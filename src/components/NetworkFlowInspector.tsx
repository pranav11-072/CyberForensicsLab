import React, { useState } from 'react';
import { 
  Radio, 
  Activity, 
  ShieldAlert, 
  Globe, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Terminal, 
  Sparkles, 
  Filter, 
  Server, 
  ExternalLink,
  Flame
} from 'lucide-react';
import { NetworkLogEntry, SeverityLevel } from '../types';
import { calculateShannonEntropy } from '../utils/forensicDecoders';

const HIGH_RISK_SCENARIOS = [
  {
    id: 'c2_dga',
    title: 'Critical C2 DNS Beaconing & Metasploit Shell',
    badge: 'CRITICAL',
    logs: `2026-09-29 09:12:01 | 192.168.1.105:49152 -> 8.8.8.8:53 | DNS QUERY a9f8a10b4c2e17d983e02a.beacon-c2-drop.cc (Length: 512 bytes)
2026-09-29 09:12:31 | 192.168.1.105:49152 -> 8.8.8.8:53 | DNS QUERY a9f8a10b4c2e17d983e02b.beacon-c2-drop.cc (Length: 512 bytes)
2026-09-29 09:13:01 | 192.168.1.105:49152 -> 8.8.8.8:53 | DNS QUERY a9f8a10b4c2e17d983e02c.beacon-c2-drop.cc (Length: 512 bytes)
2026-09-29 09:15:20 | 192.168.1.105:51204 -> 185.220.101.44:4444 | TCP SYN -> UNKNOWN SERVICE ON PORT 4444 (Metasploit Default)
2026-09-29 09:18:45 | 192.168.1.140:53110 -> 10.0.0.5:445 | SMB2 Tree Connect -> \\\\10.0.0.5\\C$ (Admin Share Lateral Movement)
2026-09-29 09:22:11 | 192.168.1.105:54902 -> 142.250.190.46:443 | HTTPS GET https://accounts.google.com/ (Standard Normal Traffic)`
  },
  {
    id: 'ransom_lateral',
    title: 'Ransomware Mass SMB Propagation & Veeam Kill',
    badge: 'CRITICAL',
    logs: `2026-09-29 03:14:10 | 10.0.0.12:49811 -> 10.0.0.5:445 | SMB2 Tree Connect -> \\\\10.0.0.5\\ADMIN$\\System32\\PSEXESVC.exe
2026-09-29 03:14:18 | 10.0.0.12:49812 -> 10.0.0.8:445 | SMB2 File Write -> \\\\10.0.0.8\\C$\\Windows\\Temp\\locker_payload.exe
2026-09-29 03:14:25 | 10.0.0.12:49813 -> 10.0.0.22:445 | SMB2 Tree Connect -> \\\\10.0.0.22\\C$\\BackupShare\\ (Veeam Storage)
2026-09-29 03:15:02 | 10.0.0.12:51220 -> 185.220.101.89:8888 | TCP ESTABLISHED -> Active C2 Callback to Bulletproof IP
2026-09-29 03:16:40 | 10.0.0.5:52100 -> 10.0.0.1:53 | DNS QUERY lockbit-pay-portal-v3.cc TXT (Length: 1024 bytes)`
  },
  {
    id: 'dns_tunnel',
    title: 'Covert Data Exfiltration via High-Entropy DNS Tunnel',
    badge: 'HIGH RISK',
    logs: `2026-09-29 11:02:14 | 172.16.4.88:60211 -> 1.1.1.1:53 | DNS QUERY dXNlcl9jcmVkZW50aWFsc19kYXRhYmFzZV9kdW1w.exfil-tunnel.top (Length: 1024 bytes)
2026-09-29 11:02:16 | 172.16.4.88:60212 -> 1.1.1.1:53 | DNS QUERY cHJpdmF0ZV9rZXlzX3NhbWxfc2lnbmluZ19jZXJ0.exfil-tunnel.top (Length: 1024 bytes)
2026-09-29 11:02:18 | 172.16.4.88:60213 -> 1.1.1.1:53 | DNS QUERY bGlzdF9vZiRfZW1wbG95ZWVfc3NuX2Jhbmtpbmc=.exfil-tunnel.top (Length: 1024 bytes)
2026-09-29 11:05:00 | 172.16.4.88:58440 -> 194.26.29.110:31337 | TCP SYN -> High Port Backdoor Listener on Suspicious Subnet
2026-09-29 11:07:30 | 172.16.4.10:54110 -> 172.16.4.1:80 | HTTP GET http://internal-intranet.local/ (Legitimate Intranet)`
  },
  {
    id: 'recon_sweep',
    title: 'Internal Subnet Port Sweep & Kerberoasting Probe',
    badge: 'HIGH RISK',
    logs: `2026-09-29 08:30:11 | 192.168.1.55:41201 -> 192.168.1.10:88 | TCP SYN -> Port 88 Kerberos TGS-REQ Request (RC4 Encryption Probe)
2026-09-29 08:30:12 | 192.168.1.55:41202 -> 192.168.1.10:389 | TCP SYN -> Port 389 LDAP Active Directory Schema Dump
2026-09-29 08:30:15 | 192.168.1.55:41205 -> 192.168.1.10:3389 | TCP SYN -> Port 3389 Remote Desktop Protocol Brute Attempt
2026-09-29 08:32:00 | 192.168.1.55:54999 -> 185.220.101.5:1337 | TCP SYN -> Connection to Tor Exit Node on Backdoor Port 1337
2026-09-29 08:35:10 | 192.168.1.20:51000 -> 8.8.8.8:53 | DNS QUERY www.microsoft.com (Normal Routine Resolution)`
  }
];

export const NetworkFlowInspector: React.FC = () => {
  const [rawLogs, setRawLogs] = useState<string>(HIGH_RISK_SCENARIOS[0].logs);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(HIGH_RISK_SCENARIOS[0].id);
  const [parsedEntries, setParsedEntries] = useState<NetworkLogEntry[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<SeverityLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Heuristic Network Flow Analyzer
  const analyzeNetworkLogs = () => {
    const lines = rawLogs.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const results: NetworkLogEntry[] = [];

    lines.forEach((line, idx) => {
      let srcIp = 'Unknown';
      let destIp = 'Unknown';
      let destPort = 80;
      let protocol: NetworkLogEntry['protocol'] = 'OTHER';
      let info = line;
      let timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Extract timestamp if present
      const tsMatch = line.match(/^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
      if (tsMatch) timestamp = tsMatch[1];

      // Extract IPs & Ports: e.g. 192.168.1.105:49152 -> 8.8.8.8:53
      const flowMatch = line.match(/(\d{1,3}(?:\.\d{1,3}){3})(?::(\d+))?\s*(?:->|=>|>)\s*(\d{1,3}(?:\.\d{1,3}){3})(?::(\d+))?/);
      if (flowMatch) {
        srcIp = flowMatch[1];
        destIp = flowMatch[3];
        if (flowMatch[4]) destPort = parseInt(flowMatch[4]);
      }

      // Protocol identification
      if (line.includes('DNS') || destPort === 53) protocol = 'DNS';
      else if (line.includes('HTTPS') || destPort === 443) protocol = 'HTTPS';
      else if (line.includes('HTTP') || destPort === 80) protocol = 'HTTP';
      else if (line.includes('TCP') || destPort === 4444 || destPort === 445) protocol = 'TCP';
      else if (line.includes('UDP')) protocol = 'UDP';

      const reasons: string[] = [];
      let anomalousScore = 0;

      // Rule 1: Dangerous / Default Backdoor Ports
      if ([4444, 5555, 6666, 1337, 31337, 8888, 9999].includes(destPort)) {
        reasons.push(`Suspicious C2 / Metasploit default listener port (${destPort}) detected`);
        anomalousScore += 65;
      }

      // Rule 2: Lateral Movement via Administrative SMB / RDP
      if (destPort === 445 && (line.includes('C$') || line.includes('ADMIN$') || line.includes('IPC$'))) {
        reasons.push('Internal administrative share access (Lateral Movement T1021.002)');
        anomalousScore += 50;
      }

      // Rule 3: DGA & DNS Tunneling Inspection
      if (protocol === 'DNS' || line.includes('DNS QUERY')) {
        const domainMatch = line.match(/(?:QUERY\s+)([a-zA-Z0-9.-]+)/i);
        if (domainMatch) {
          const domain = domainMatch[1];
          const subdomain = domain.split('.')[0];
          const entropy = calculateShannonEntropy(subdomain);

          if (entropy > 3.8 && subdomain.length > 16) {
            reasons.push(`High entropy (${entropy}) DGA or DNS Tunneling payload: "${subdomain.slice(0, 16)}..."`);
            anomalousScore += 70;
          }
        }
        if (line.includes('512 bytes') || line.includes('1024 bytes') || line.includes('TXT')) {
          reasons.push('Abnormally large DNS query length indicative of data exfiltration');
          anomalousScore += 40;
        }
      }

      // Rule 4: Tor Exit Node / Known Suspicious Subnets
      if (destIp.startsWith('185.220.') || destIp.startsWith('194.26.')) {
        reasons.push(`Connection to known bulletproof / Tor exit node network range (${destIp})`);
        anomalousScore += 60;
      }

      // Compute severity
      let severity: SeverityLevel = 'SAFE';
      if (anomalousScore >= 75) severity = 'CRITICAL';
      else if (anomalousScore >= 45) severity = 'HIGH_RISK';
      else if (anomalousScore >= 20) severity = 'SUSPICIOUS';
      else if (anomalousScore > 0) severity = 'LOW';

      results.push({
        id: `NET-${idx + 1}`,
        timestamp,
        srcIp,
        destIp,
        destPort,
        protocol,
        info,
        anomalousScore,
        reasons: reasons.length > 0 ? reasons : ['Baseline network protocol traffic.'],
        severity,
      });
    });

    setParsedEntries(results);
  };

  // Run on mount
  React.useEffect(() => {
    analyzeNetworkLogs();
  }, []);

  const filtered = parsedEntries.filter(entry => {
    const matchesSev = filterSeverity === 'ALL' || entry.severity === filterSeverity;
    const matchesSearch = 
      entry.info.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.srcIp.includes(searchQuery) ||
      entry.destIp.includes(searchQuery) ||
      entry.reasons.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <Radio className="w-3.5 h-3.5" />
              <span>NETWORK TRAFFIC & PCAP HEURISTIC INSPECTOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              Network Flow & DNS Beaconing Analyzer
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Inspect Zeek/Suricata alert lines, firewall flow exports, and DNS queries for DGA algorithms, covert DNS data exfiltration, lateral SMB movements, and C2 beacons.
            </p>
          </div>

          <button
            onClick={analyzeNetworkLogs}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            Analyze & Score Stream
          </button>
        </div>
      </div>

      {/* High-Risk Preset Scenarios Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>LOAD HIGH-RISK NETWORK ATTACK SCENARIOS:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {HIGH_RISK_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                setRawLogs(sc.logs);
                setTimeout(() => analyzeNetworkLogs(), 50);
              }}
              className={`p-2.5 rounded-xl border text-left font-mono transition text-xs flex flex-col justify-between gap-1.5 ${
                selectedScenarioId === sc.id
                  ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-200 text-[11px] truncate">{sc.title}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  sc.badge === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {sc.badge}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Click to ingest & score live</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input / Log Ingest Terminal */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Raw Network Flow / DNS / Syslog Feed (Paste Logs)
          </label>
          <button
            onClick={() => setRawLogs('')}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono"
          >
            Clear Feed
          </button>
        </div>
        <textarea
          rows={5}
          value={rawLogs}
          onChange={(e) => setRawLogs(e.target.value)}
          placeholder="Paste Zeek conn.log, dns.log, or firewall syslog entries here..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none leading-relaxed"
        />
      </div>

      {/* Filter and Metrics Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by IP, Port, Domain, or threat keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {(['ALL', 'CRITICAL', 'HIGH_RISK', 'SUSPICIOUS', 'SAFE'] as const).map((sev) => {
            const isSel = filterSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  isSel 
                    ? 'bg-cyan-500 text-slate-950 font-bold' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {sev}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flow Results Grid */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 font-mono text-xs">
            No network events match the current filter query.
          </div>
        ) : (
          filtered.map((entry) => {
            const isCritical = entry.severity === 'CRITICAL';
            const isHigh = entry.severity === 'HIGH_RISK';
            const isSuspicious = entry.severity === 'SUSPICIOUS';

            return (
              <div 
                key={entry.id}
                className={`bg-slate-900 border rounded-xl p-4 transition ${
                  isCritical 
                    ? 'border-rose-500/40 bg-rose-950/10' 
                    : isHigh 
                    ? 'border-amber-500/40 bg-amber-950/10' 
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {entry.timestamp}
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {entry.protocol}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      isSuspicious ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {entry.severity} (Risk Score: {entry.anomalousScore}/100)
                    </span>
                  </div>

                  <div className="text-xs font-mono text-slate-400">
                    <span className="text-slate-300 font-semibold">{entry.srcIp}</span> ➔ <span className="text-cyan-300 font-bold">{entry.destIp}:{entry.destPort}</span>
                  </div>
                </div>

                <div className="font-mono text-xs text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80 mb-2 overflow-x-auto">
                  {entry.info}
                </div>

                {/* Threat Diagnostics */}
                <div className="space-y-1">
                  {entry.reasons.map((r, rIdx) => (
                    <div key={rIdx} className="text-xs font-mono flex items-start gap-2 text-slate-300">
                      <span className={isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-cyan-400'}>
                        {isCritical || isHigh ? '⚠️' : 'ℹ️'}
                      </span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
