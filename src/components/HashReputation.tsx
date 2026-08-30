import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileSearch, 
  Upload, 
  Copy, 
  Check, 
  AlertOctagon, 
  Database, 
  Search, 
  ShieldAlert, 
  Sparkles,
  ExternalLink,
  Lock,
  Layers,
  Flame
} from 'lucide-react';
import { KNOWN_THREAT_IOCS } from '../data/knownIOCs';
import { KnownThreatIOC } from '../types';

export const HashReputation: React.FC = () => {
  const [hashInput, setHashInput] = useState<string>('4aa97b1897d2fa95ffecabaf6a70e7e1f40aa96ef784260d705c92c9066bf631');
  const [calculatedHashes, setCalculatedHashes] = useState<{
    name?: string;
    size?: string;
    md5?: string;
    sha1?: string;
    sha256?: string;
  } | null>(null);
  const [matchedIOC, setMatchedIOC] = useState<KnownThreatIOC | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchLibraryQuery, setSearchLibraryQuery] = useState<string>('');

  // Handle manual hash lookup
  const runHashLookup = (query: string) => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setMatchedIOC(null);
      return;
    }

    const found = KNOWN_THREAT_IOCS.find(
      ioc =>
        ioc.sha256.toLowerCase() === clean ||
        ioc.sha1.toLowerCase() === clean ||
        ioc.md5.toLowerCase() === clean ||
        ioc.name.toLowerCase().includes(clean) ||
        ioc.family.toLowerCase().includes(clean)
    );

    setMatchedIOC(found || null);
  };

  // Run on mount with default
  React.useEffect(() => {
    runHashLookup(hashInput);
  }, []);

  // Compute file hashes in browser
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();

    // SHA-256
    const hashBuffer256 = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
    const sha256 = hashArray256.map(b => b.toString(16).padStart(2, '0')).join('');

    // SHA-1
    const hashBuffer1 = await crypto.subtle.digest('SHA-1', arrayBuffer);
    const hashArray1 = Array.from(new Uint8Array(hashBuffer1));
    const sha1 = hashArray1.map(b => b.toString(16).padStart(2, '0')).join('');

    // Pseudo MD5 estimation for local display
    const md5 = 'Local Client SHA256/SHA1 Active';

    setCalculatedHashes({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      sha256,
      sha1,
      md5,
    });

    setHashInput(sha256);
    runHashLookup(sha256);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredLibrary = KNOWN_THREAT_IOCS.filter(ioc =>
    ioc.name.toLowerCase().includes(searchLibraryQuery.toLowerCase()) ||
    ioc.family.toLowerCase().includes(searchLibraryQuery.toLowerCase()) ||
    ioc.sha256.toLowerCase().includes(searchLibraryQuery.toLowerCase()) ||
    ioc.threatActor?.toLowerCase().includes(searchLibraryQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CRYPTOGRAPHIC REPUTATION & THREAT SIGNATURE DATABASE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              File Hash Calculator & IOC Threat Matcher
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Calculate instant client-side SHA-256 and SHA-1 cryptographic digests and cross-reference against verified threat signatures for ransomware, trojans, and APT payloads.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Ingest Section: File Upload & Manual Hash Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* File Drag & Drop */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Upload className="w-4 h-4 text-purple-400" />
              Direct File Hash Inspection
            </label>
            <div className="border-2 border-dashed border-slate-800 hover:border-purple-500/50 rounded-xl p-6 text-center transition cursor-pointer relative bg-slate-950/40">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-80" />
              <div className="text-xs font-mono text-slate-200 font-bold">
                Drop suspicious binary or document here
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                Computes SHA-256 and SHA-1 locally in browser sandbox memory.
              </p>
            </div>
          </div>

          {calculatedHashes && (
            <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span className="font-bold text-slate-200 truncate max-w-[200px]">{calculatedHashes.name}</span>
                <span>{calculatedHashes.size}</span>
              </div>
              <div className="space-y-1">
                <div className="text-slate-400">
                  <span className="text-purple-400 font-bold">SHA-256: </span>
                  <span className="text-slate-200 break-all text-[11px]">{calculatedHashes.sha256}</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-cyan-400 font-bold">SHA-1: </span>
                  <span className="text-slate-200 break-all text-[11px]">{calculatedHashes.sha1}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Manual Hash / Query Lookup */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-cyan-400" />
              Search Hash Signature / Threat Query
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={hashInput}
                onChange={(e) => {
                  setHashInput(e.target.value);
                  runHashLookup(e.target.value);
                }}
                placeholder="Enter MD5, SHA-1, SHA-256, or malware family name..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-500 self-center">Try Sample:</span>
                {KNOWN_THREAT_IOCS.slice(0, 4).map((ioc) => (
                  <button
                    key={ioc.id}
                    onClick={() => {
                      setHashInput(ioc.sha256);
                      runHashLookup(ioc.sha256);
                    }}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    {ioc.family}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Match Status Card */}
          <div className={`p-4 rounded-xl border transition ${
            matchedIOC 
              ? 'bg-rose-950/20 border-rose-500/50' 
              : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              {matchedIOC ? (
                <>
                  <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
                  <div>
                    <div className="text-xs font-mono font-bold text-rose-400">
                      THREAT SIGNATURE MATCH DETECTED ({matchedIOC.severity})
                    </div>
                    <div className="text-xs text-slate-300 font-mono font-semibold">
                      {matchedIOC.name}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-slate-500" />
                  <div className="text-xs font-mono text-slate-400">
                    No verified malicious threat match in offline core database.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Matched Threat Detail Dossier */}
      {matchedIOC && (
        <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
                  {matchedIOC.type}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Actor: <strong className="text-slate-200">{matchedIOC.threatActor || 'Unknown'}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-mono">
                {matchedIOC.name}
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
              First Seen: {matchedIOC.firstSeen}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            {matchedIOC.description}
          </p>

          {/* Hashes Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'MD5', val: matchedIOC.md5 },
              { label: 'SHA-1', val: matchedIOC.sha1 },
              { label: 'SHA-256', val: matchedIOC.sha256 },
            ].map((h) => (
              <div key={h.label} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span className="font-bold text-cyan-400">{h.label}</span>
                  <button
                    onClick={() => handleCopy(h.val, h.label)}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedKey === h.label ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-200 break-all select-all">
                  {h.val}
                </div>
              </div>
            ))}
          </div>

          {/* MITRE and Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                MITRE ATT&CK Techniques:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedIOC.mitreTechniques.map((t, idx) => (
                  <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded bg-purple-950/40 text-purple-300 border border-purple-800/40">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Host & Network Indicators:
              </span>
              <div className="space-y-1">
                {matchedIOC.indicators.map((ind, idx) => (
                  <div key={idx} className="text-xs font-mono text-slate-300 bg-slate-950 p-1.5 rounded border border-slate-800/80">
                    {ind}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remediation Guide */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 mt-2">
            <span className="text-xs font-mono font-bold text-rose-400 block mb-1">
              🛡️ DFIR Incident Remediation Protocol:
            </span>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {matchedIOC.remediation}
            </p>
          </div>
        </div>
      )}

      {/* IOC Intelligence Library Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              Verified Threat Signature Intelligence Library
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Browse pre-indexed adversary malware hashes and technical threat signatures.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search library..."
              value={searchLibraryQuery}
              onChange={(e) => setSearchLibraryQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLibrary.map((ioc) => (
            <div
              key={ioc.id}
              onClick={() => {
                setHashInput(ioc.sha256);
                runHashLookup(ioc.sha256);
              }}
              className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-xl p-4 cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white group-hover:text-purple-300 transition">
                  {ioc.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {ioc.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans line-clamp-2">
                {ioc.description}
              </p>
              <div className="text-[11px] font-mono text-slate-500 truncate pt-1 border-t border-slate-900">
                SHA-256: <span className="text-slate-400">{ioc.sha256}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
