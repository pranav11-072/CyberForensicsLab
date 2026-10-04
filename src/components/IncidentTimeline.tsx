import React, { useState } from 'react';
import { 
  Clock, 
  ShieldAlert, 
  Plus, 
  Download, 
  Trash2, 
  Filter, 
  Tag, 
  Calendar, 
  ArrowRight, 
  Shield, 
  Layers, 
  FileText, 
  CheckCircle2, 
  AlertOctagon,
  Sparkles,
  ExternalLink,
  Flame
} from 'lucide-react';
import { TimelineEvent, KillChainPhase, SeverityLevel } from '../types';

const SCENARIO_TEMPLATES: { id: string; name: string; badge: string; description: string; events: TimelineEvent[] }[] = [
  {
    id: 'lockbit_ransomware',
    name: 'LockBit 3.0 Enterprise Ransomware Incident',
    badge: 'CRITICAL',
    description: 'Full breach sequence: Macro Spearphishing -> Memory Dropper -> Scheduled Task -> C2 Beacon -> Volume Shadow Deletion & Mass Encryption.',
    events: [
      {
        id: 'EVT-001',
        timestamp: '2026-09-29 09:14:22 UTC',
        title: 'Spearphishing Email Delivered to Finance Dept',
        description: 'Inbound email impersonating CEO requesting immediate wire approval with malicious macro-enabled attachment "Invoice_Q3_9942.xlsm".',
        phase: 'DELIVERY',
        severity: 'HIGH_RISK',
        source: 'Email Security Gateway Logs (Proofpoint)',
        mitreTactic: 'Initial Access',
        mitreTechniqueId: 'T1566.001',
        artifacts: ['Invoice_Q3_9942.xlsm', 'spoofed-csuite@exec-corporate-notice.com'],
        investigator: 'Forensic Analyst #402',
      },
      {
        id: 'EVT-002',
        timestamp: '2026-09-29 09:21:05 UTC',
        title: 'Macro Execution & PowerShell Dropper Spawned',
        description: 'Excel process (EXCEL.EXE) spawned hidden powershell.exe invoking -EncodedCommand to fetch secondary payload from remote C2.',
        phase: 'EXPLOITATION',
        severity: 'CRITICAL',
        source: 'Windows Sysmon EventID 1 (Process Create)',
        mitreTactic: 'Execution',
        mitreTechniqueId: 'T1059.001',
        artifacts: ['PID 4912', 'powershell.exe -NoP -NonI -W Hidden -Enc JABj...'],
        investigator: 'Forensic Analyst #402',
      },
      {
        id: 'EVT-003',
        timestamp: '2026-09-29 09:23:44 UTC',
        title: 'Persistence Established via Scheduled Task',
        description: 'Created persistent autorun task "WindowsUpdateHealthCheck" executing malicious DLL from %APPDATA%\\Roaming\\Microsoft\\Windows\\.',
        phase: 'INSTALLATION',
        severity: 'HIGH_RISK',
        source: 'Windows EventID 4698 (Scheduled Task Created)',
        mitreTactic: 'Persistence',
        mitreTechniqueId: 'T1053.005',
        artifacts: ['schtasks /create /tn "WindowsUpdateHealthCheck"', 'payload_x64.dll'],
        investigator: 'DFIR Specialist #108',
      },
      {
        id: 'EVT-004',
        timestamp: '2026-09-29 09:27:10 UTC',
        title: 'Encrypted C2 Beaconing Initiated',
        description: 'Periodic HTTPS POST requests with random sleep jitter (30s ± 20%) to external IP 185.220.101.44 over port 443.',
        phase: 'COMMAND_CONTROL',
        severity: 'CRITICAL',
        source: 'Firewall & Zeek HTTP/SSL Logs',
        mitreTactic: 'Command and Control',
        mitreTechniqueId: 'T1071.001',
        artifacts: ['185.220.101.44:443', 'User-Agent: Mozilla/5.0 MalleableC2'],
        investigator: 'Threat Hunter #311',
      },
      {
        id: 'EVT-005',
        timestamp: '2026-09-29 09:45:18 UTC',
        title: 'Shadow Copy Deletion & Volume Encryption Started',
        description: 'Attacker executed vssadmin.exe to destroy system recovery points followed by bulk AES file encryption targeting shared network drives.',
        phase: 'ACTIONS_OBJECTIVES',
        severity: 'CRITICAL',
        source: 'EDR Alert & Endpoint System Logs',
        mitreTactic: 'Impact',
        mitreTechniqueId: 'T1486',
        artifacts: ['vssadmin delete shadows /all /quiet', 'README_LOCKBIT.txt'],
        investigator: 'Lead Incident Commander',
      },
    ]
  },
  {
    id: 'apt_cloud_token',
    name: 'APT29 Cloud Token Theft & Golden SAML Incursion',
    badge: 'CRITICAL',
    description: 'State-sponsored breach: Password Spray -> AiTM Reverse Proxy MFA Bypass -> Golden SAML Forgery -> Mailbox Exfiltration via Graph API.',
    events: [
      {
        id: 'APT-001',
        timestamp: '2026-09-29 01:10:00 UTC',
        title: 'Distributed Password Spraying against O365 Tenant',
        description: 'Low-and-slow authentication attempts across 340 corporate user accounts using bulletproof residential proxy addresses.',
        phase: 'RECONNAISSANCE',
        severity: 'SUSPICIOUS',
        source: 'Azure AD Identity Protection Logs',
        mitreTactic: 'Credential Access',
        mitreTechniqueId: 'T1110.003',
        artifacts: ['User-Agent: python-requests/2.28', 'Target: /common/oauth2/token'],
        investigator: 'Cloud SOC Analyst',
      },
      {
        id: 'APT-002',
        timestamp: '2026-09-29 02:44:19 UTC',
        title: 'AiTM Reverse-Proxy Phishing & Session Cookie Theft',
        description: 'Global administrator logged in through an Evilginx reverse-proxy phishing gateway, surrendering valid ESTSAUTH session cookies.',
        phase: 'EXPLOITATION',
        severity: 'CRITICAL',
        source: 'WAF & Identity Sign-in Logs',
        mitreTactic: 'Adversary-in-the-Middle',
        mitreTechniqueId: 'T1556',
        artifacts: ['portal-sso-verify.top', 'ESTSAUTH cookie captured'],
        investigator: 'Senior Incident Responder',
      },
      {
        id: 'APT-003',
        timestamp: '2026-09-29 03:15:30 UTC',
        title: 'Golden SAML Signing Certificate Compromise',
        description: 'Threat actor exported private key from Active Directory Federation Services (AD FS) to mint arbitrary valid cloud SAML tokens.',
        phase: 'INSTALLATION',
        severity: 'CRITICAL',
        source: 'AD FS Security Audit Event 1200',
        mitreTactic: 'Defense Evasion',
        mitreTechniqueId: 'T1606.002',
        artifacts: ['ADFS Private Key Export', 'Token Minting Script'],
        investigator: 'Principal DFIR Consultant',
      },
      {
        id: 'APT-004',
        timestamp: '2026-09-29 03:50:00 UTC',
        title: 'Mailbox Access Delegation & Graph API Exfiltration',
        description: 'Rogue Service Principal created with Mail.ReadWrite permissions to automate bulk download of C-Suite Outlook messages.',
        phase: 'ACTIONS_OBJECTIVES',
        severity: 'CRITICAL',
        source: 'Microsoft Graph Audit Activity',
        mitreTactic: 'Collection & Exfiltration',
        mitreTechniqueId: 'T1114.002',
        artifacts: ['ServicePrincipal "CloudHealthSync"', '45.2 GB PST archive exfiltrated'],
        investigator: 'Lead Incident Commander',
      },
    ]
  },
  {
    id: 'sim_swap_heist',
    name: 'Telecom Insider SIM-Swap & ₹85 Lakh Wire Transfer',
    badge: 'HIGH RISK',
    description: 'Financial cyber fraud: Telecom Store Insider Bribery -> Unauthorized e-SIM Port -> Banking NetBanking Reset -> Real-time RTGS Layering.',
    events: [
      {
        id: 'SIM-001',
        timestamp: '2026-09-29 14:02:11 UTC',
        title: 'Unauthorized e-SIM Swap Initiated at Retail Kiosk',
        description: 'Syndicate operative bribed store retail clerk to process duplicate e-SIM QR code without customer biometric Aadhaar validation.',
        phase: 'INITIAL ACCESS' as any,
        severity: 'HIGH_RISK',
        source: 'Carrier Telecom Audit & BSS Logs',
        mitreTactic: 'Initial Access',
        mitreTechniqueId: 'T1589',
        artifacts: ['IMSI Swap Trace', 'Retail Agent ID: RT-4401'],
        investigator: 'Cyber Crime Cell Inspector',
      },
      {
        id: 'SIM-002',
        timestamp: '2026-09-29 14:15:40 UTC',
        title: 'Victim Device Network Loss & Sudden No Service',
        description: 'Legitimate SIM deactivated; victim handset dropped all cellular signal and mobile data connectivity.',
        phase: 'EXPLOITATION',
        severity: 'HIGH_RISK',
        source: 'Tower Signaling Handshake Record',
        mitreTactic: 'Impact',
        mitreTechniqueId: 'T1491',
        artifacts: ['Cell Tower Disconnect Packet', 'IMEI Mismatch'],
        investigator: 'Telecom Forensics Analyst',
      },
      {
        id: 'SIM-003',
        timestamp: '2026-09-29 14:22:05 UTC',
        title: 'NetBanking Password Reset & OTP Interception',
        description: 'Perpetrators initiated "Forgot Password" on HDFC NetBanking, receiving mandatory SMS OTPs on the swapped rogue handset.',
        phase: 'COMMAND_CONTROL',
        severity: 'CRITICAL',
        source: 'Bank Fraud Risk Management (FRM) Logs',
        mitreTactic: 'Credential Access',
        mitreTechniqueId: 'T1110',
        artifacts: ['Password Reset OTP #881290', 'IP: 103.21.58.12 (VPN)'],
        investigator: 'Bank Digital Fraud Team',
      },
      {
        id: 'SIM-004',
        timestamp: '2026-09-29 14:35:50 UTC',
        title: 'RTGS Transfer & Immediate Mule Layering',
        description: 'Four consecutive RTGS transactions totaling ₹85,00,000 executed and disbursed across 18 mule bank accounts within 12 minutes.',
        phase: 'ACTIONS_OBJECTIVES',
        severity: 'CRITICAL',
        source: 'Core Banking System (CBS) Audit Trail',
        mitreTactic: 'Financial Theft',
        mitreTechniqueId: 'T1657',
        artifacts: ['RTGS UTR #HDFCR520260929', '18 Layered Mule Accounts'],
        investigator: 'State Cyber Cell Investigation Unit',
      },
    ]
  }
];

const INITIAL_EVENTS: TimelineEvent[] = SCENARIO_TEMPLATES[0].events;

const KILL_CHAIN_STAGES: { phase: KillChainPhase; label: string; number: string; color: string }[] = [
  { phase: 'RECONNAISSANCE', label: 'Reconnaissance', number: '01', color: 'from-blue-500/20 to-blue-500/10 text-blue-400 border-blue-500/30' },
  { phase: 'WEAPONIZATION', label: 'Weaponization', number: '02', color: 'from-indigo-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { phase: 'DELIVERY', label: 'Delivery', number: '03', color: 'from-cyan-500/20 to-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { phase: 'EXPLOITATION', label: 'Exploitation', number: '04', color: 'from-amber-500/20 to-amber-500/10 text-amber-400 border-amber-500/30' },
  { phase: 'INSTALLATION', label: 'Installation', number: '05', color: 'from-orange-500/20 to-orange-500/10 text-orange-400 border-orange-500/30' },
  { phase: 'COMMAND_CONTROL', label: 'Command & Control', number: '06', color: 'from-rose-500/20 to-rose-500/10 text-rose-400 border-rose-500/30' },
  { phase: 'ACTIONS_OBJECTIVES', label: 'Actions on Objectives', number: '07', color: 'from-red-500/20 to-red-500/10 text-red-400 border-red-500/30' },
];

export const IncidentTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(INITIAL_EVENTS);
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIO_TEMPLATES[0].id);
  const [selectedPhase, setSelectedPhase] = useState<KillChainPhase | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State for new Event
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: '',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    phase: 'EXPLOITATION',
    severity: 'HIGH_RISK',
    description: '',
    source: '',
    mitreTechniqueId: 'T1059',
    mitreTactic: 'Execution',
    investigator: 'DFIR Investigator',
  });

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description) return;
    const created: TimelineEvent = {
      id: `EVT-00${events.length + 1}`,
      title: newEvent.title || 'Untitled Event',
      timestamp: newEvent.timestamp || new Date().toISOString(),
      phase: newEvent.phase as KillChainPhase || 'EXPLOITATION',
      severity: newEvent.severity as SeverityLevel || 'HIGH_RISK',
      description: newEvent.description || '',
      source: newEvent.source || 'Manual Forensic Entry',
      mitreTechniqueId: newEvent.mitreTechniqueId,
      mitreTactic: newEvent.mitreTactic,
      investigator: newEvent.investigator,
      artifacts: [],
    };
    setEvents([...events, created]);
    setShowAddModal(false);
    setNewEvent({
      title: '',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      phase: 'EXPLOITATION',
      severity: 'HIGH_RISK',
      description: '',
      source: '',
      mitreTechniqueId: 'T1059',
      mitreTactic: 'Execution',
      investigator: 'DFIR Investigator',
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const filteredEvents = selectedPhase === 'ALL' 
    ? events 
    : events.filter(e => e.phase === selectedPhase);

  // Export Chronology as JSON or Dossier Text
  const exportTimelineDossier = () => {
    const reportText = `CYBER FORENSIC LAB (CFL) - INCIDENT CHRONOLOGY REPORT
Generated at: ${new Date().toUTCString()}
Total Logged Events: ${events.length}
================================================================================

` + events.map((e, idx) => `
[STEP ${idx + 1}] ${e.timestamp}
TITLE: ${e.title}
KILL CHAIN PHASE: ${e.phase}
SEVERITY: ${e.severity}
SOURCE: ${e.source}
MITRE ATT&CK: ${e.mitreTechniqueId || 'N/A'} (${e.mitreTactic || 'N/A'})
INVESTIGATOR: ${e.investigator || 'Unassigned'}
DETAILS: ${e.description}
${e.artifacts && e.artifacts.length > 0 ? `ARTIFACTS:\n${e.artifacts.map(a => '  - ' + a).join('\n')}` : ''}
--------------------------------------------------------------------------------
`).join('\n');

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `incident_timeline_chronology_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>FORENSIC TIMELINE & CORRELATION ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              Multi-Artifact Incident Timeline
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Chronologically reconstruct cyber attacks, correlate disparate endpoint and network logs, and map events to the Lockheed Martin Cyber Kill Chain.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Timeline Event
            </button>
            <button
              onClick={exportTimelineDossier}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Export Dossier
            </button>
          </div>
        </div>

        {/* High-Risk Incident Scenario Presets Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>LOAD REAL-WORLD HIGH-RISK INCIDENT SCENARIOS:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SCENARIO_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setActiveScenarioId(tmpl.id);
                  setEvents(tmpl.events);
                  setSelectedPhase('ALL');
                }}
                className={`p-3 rounded-xl border text-left font-mono transition text-xs flex flex-col justify-between gap-1.5 ${
                  activeScenarioId === tmpl.id
                    ? 'bg-slate-800/90 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-200 truncate">{tmpl.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    tmpl.badge === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {tmpl.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </p>
                <div className="text-[10px] text-cyan-400 font-mono mt-1">
                  Load {tmpl.events.length} Timeline Events →
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cyber Kill Chain Pipeline Visualizer */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Cyber Kill Chain Progression ({events.length} Events Logged)
            </span>
            {selectedPhase !== 'ALL' && (
              <button
                onClick={() => setSelectedPhase('ALL')}
                className="text-xs font-mono text-cyan-400 hover:underline"
              >
                Reset Filter (Show All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {KILL_CHAIN_STAGES.map((stage) => {
              const count = events.filter(e => e.phase === stage.phase).length;
              const isSelected = selectedPhase === stage.phase;
              return (
                <button
                  key={stage.phase}
                  onClick={() => setSelectedPhase(isSelected ? 'ALL' : stage.phase)}
                  className={`p-3 rounded-xl border text-left transition relative overflow-hidden ${
                    isSelected 
                      ? `bg-gradient-to-b ${stage.color} ring-2 ring-cyan-400` 
                      : 'bg-slate-950/80 hover:bg-slate-800/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span>{stage.number}</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${count > 0 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-600'}`}>
                      {count}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 truncate">{stage.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm font-mono text-slate-300">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>Chronological Event Trace</span>
            <span className="text-xs text-slate-500 font-normal">({filteredEvents.length} items)</span>
          </div>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filteredEvents.map((evt, index) => {
            const isCritical = evt.severity === 'CRITICAL';
            const isHigh = evt.severity === 'HIGH_RISK';
            
            return (
              <div key={evt.id} className="relative group">
                {/* Node Bullet Icon */}
                <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  isCritical 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/20' 
                    : isHigh 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                    : 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                }`}>
                  <span className="text-[10px] font-mono font-bold">{index + 1}</span>
                </div>

                {/* Event Card */}
                <div className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {evt.timestamp}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        isCritical 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : isHigh 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {evt.phase.replace('_', ' ')}
                      </span>
                      {evt.mitreTechniqueId && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          MITRE: {evt.mitreTechniqueId} ({evt.mitreTactic})
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="text-slate-600 hover:text-rose-400 transition self-end sm:self-auto p-1"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white font-mono mt-1">
                    {evt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1.5 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Metadata and Artifacts */}
                  <div className="mt-3 pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Source:</span>
                      <span className="text-slate-300">{evt.source}</span>
                    </div>
                    {evt.investigator && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span>Investigator:</span>
                        <span className="text-slate-400 font-semibold">{evt.investigator}</span>
                      </div>
                    )}
                  </div>

                  {evt.artifacts && evt.artifacts.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {evt.artifacts.map((art, aIdx) => (
                        <span key={aIdx} className="text-[11px] font-mono bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                          📦 {art}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Add Timeline Artifact Event
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Event Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Reverse shell connected to remote C2"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Kill Chain Phase:</label>
                  <select
                    value={newEvent.phase}
                    onChange={(e) => setNewEvent({ ...newEvent, phase: e.target.value as KillChainPhase })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {KILL_CHAIN_STAGES.map(s => (
                      <option key={s.phase} value={s.phase}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Severity:</label>
                  <select
                    value={newEvent.severity}
                    onChange={(e) => setNewEvent({ ...newEvent, severity: e.target.value as SeverityLevel })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="SUSPICIOUS">SUSPICIOUS</option>
                    <option value="HIGH_RISK">HIGH_RISK</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Timestamp (UTC):</label>
                <input
                  type="text"
                  value={newEvent.timestamp}
                  onChange={(e) => setNewEvent({ ...newEvent, timestamp: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Description & Evidence Details:</label>
                <textarea
                  rows={3}
                  placeholder="Provide forensic context, process names, and commands executed..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Log Source:</label>
                  <input
                    type="text"
                    placeholder="e.g. Sysmon EventID 3"
                    value={newEvent.source}
                    onChange={(e) => setNewEvent({ ...newEvent, source: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">MITRE Technique ID:</label>
                  <input
                    type="text"
                    placeholder="e.g. T1071.001"
                    value={newEvent.mitreTechniqueId}
                    onChange={(e) => setNewEvent({ ...newEvent, mitreTechniqueId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
              >
                Save Event to Chronology
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
