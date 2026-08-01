import React, { useState } from 'react';
import {
  ShieldAlert,
  Fish,
  Bug,
  CreditCard,
  BookOpen,
  FileText,
  Zap,
  Lock,
  Search,
  ArrowRight,
  AlertTriangle,
  Scale,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import { AnalysisResult, ModuleType } from '../types';
import { runForensicAnalysis } from '../utils/engine';
import { ThreatIntelligenceFeed } from './ThreatIntelligenceFeed';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  recentScans: AnalysisResult[];
}

export const Overview: React.FC<OverviewProps> = ({
  setActiveTab,
  onAnalysisComplete,
  recentScans,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [selectedModule, setSelectedModule] = useState<ModuleType>('phishing');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleQuickScan = async () => {
    if (!quickInput.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate microscopic delay for UI feedback
    setTimeout(async () => {
      const result = await runForensicAnalysis(quickInput, selectedModule, 'Quick Inspection Scan');
      onAnalysisComplete(result);
      setIsAnalyzing(false);
      setActiveTab(selectedModule);
    }, 250);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner with Massive Bold Typography */}
      <div className="relative border border-zinc-900 bg-[#0E0E0E] p-8 md:p-12 overflow-hidden shadow-2xl">
        {/* Background watermark number */}
        <div className="absolute -right-10 -bottom-12 opacity-[0.03] text-[280px] font-black leading-none pointer-events-none select-none text-white font-mono">
          36
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-12 h-[1px] bg-orange-600"></span>
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange-600 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              100% AIR-GAPPED // DETERMINISTIC ENGINE
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.88] tracking-tighter uppercase text-white">
            Digital Forensics<br />
            <span className="text-zinc-600">& Threat Analyzer</span><span className="text-orange-600">.</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
            Perform offline forensic inspection of suspicious emails, URLs, malware command logs, and financial scam communications using <span className="text-white font-bold">36 deterministic pattern rules</span>. Generates legal section mappings (IT Act & IPC) and Section 65B Evidence Certificates.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => setActiveTab('phishing')}
              className="bg-white text-black px-6 py-3.5 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-colors cursor-pointer"
            >
              <Fish className="w-4 h-4" />
              <span>Launch Phishing Detector</span>
            </button>
            <button
              onClick={() => setActiveTab('malware')}
              className="bg-[#050505] text-zinc-300 border border-zinc-800 px-6 py-3.5 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:border-orange-600 hover:text-white transition-colors cursor-pointer"
            >
              <Bug className="w-4 h-4 text-orange-600" />
              <span>Inspect Malware Logs</span>
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className="bg-[#050505] text-zinc-300 border border-zinc-800 px-6 py-3.5 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:border-orange-600 hover:text-white transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span>Explore 9 Cases</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row - High Impact Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0E0E0E] border border-zinc-900 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span>RULESET</span>
            <Cpu className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-4xl font-black text-white tracking-tighter font-mono">36</div>
          <p className="text-[11px] text-zinc-500 font-mono">12 Phishing • 12 Malware • 12 Fraud</p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-900 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span>NETWORK</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-4xl font-black text-white tracking-tighter font-mono">0 API</div>
          <p className="text-[11px] text-zinc-500 font-mono">100% offline local evaluation</p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-900 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span>CASE DATABASE</span>
            <BookOpen className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-4xl font-black text-white tracking-tighter font-mono">9 HEISTS</div>
          <p className="text-[11px] text-zinc-500 font-mono">AIIMS, Cosmos, Deepfake BEC</p>
        </div>

        <div className="bg-[#0E0E0E] border border-zinc-900 p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase">
            <span>LEGAL CERT</span>
            <Scale className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-black text-white tracking-tighter font-mono">SEC 65B</div>
          <p className="text-[11px] text-zinc-500 font-mono">IT Act + IPC statutes ready</p>
        </div>
      </div>

      {/* Quick Scanner Section */}
      <div className="bg-[#0E0E0E] border border-zinc-900 p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-black tracking-tight uppercase text-white font-mono">
              Universal Triage Quick Scanner
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-[#050505] p-1 border border-zinc-900 text-[10px] font-bold tracking-wider uppercase font-mono">
            <span className="text-zinc-500 px-2">MODULE:</span>
            {(['phishing', 'malware', 'fraud'] as ModuleType[]).map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-3 py-1 uppercase transition-colors ${
                  selectedModule === mod
                    ? 'bg-orange-600 text-white font-black'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <textarea
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Paste raw email headers, SMS text, URL, PowerShell script, process logs, or transaction messages here to scan instantly..."
            className="w-full h-32 bg-[#050505] border border-zinc-800 p-4 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-600 placeholder:text-zinc-600 resize-none"
          ></textarea>

          <div className="flex flex-wrap justify-between items-center gap-3">
            <span className="text-[11px] text-zinc-500 font-mono">
              Evaluating input against 12 {selectedModule.toUpperCase()} regex signature rules locally.
            </span>
            <button
              onClick={handleQuickScan}
              disabled={!quickInput.trim() || isAnalyzing}
              className="px-6 py-3 bg-white text-black hover:bg-orange-600 hover:text-white disabled:bg-zinc-800 disabled:text-zinc-600 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent animate-spin"></div>
                  <span>EVALUATING...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>RUN QUICK FORENSIC SCAN</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Live Search-Grounded Threat Intelligence Feed */}
      <ThreatIntelligenceFeed />

      {/* Primary Modules Grid */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[1px] bg-orange-600"></span>
          <h2 className="text-base font-black tracking-widest uppercase text-zinc-400 font-mono">
            Forensic Analysis Engines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phishing Card */}
          <div className="bg-[#0E0E0E] border border-zinc-900 hover:border-orange-600 p-6 space-y-4 transition-colors flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Fish className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-tight">Phishing & Smishing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Inspect email headers, SPF/DKIM/Reply-To mismatches, lookalike domains, SMS OTP harvesting, shortened links, and coercive urgency cues.
              </p>
              <div className="text-[10px] font-bold tracking-widest uppercase text-orange-600 bg-orange-950/30 px-2.5 py-1 border border-orange-900/50 inline-block font-mono">
                12 Phishing Rules
              </div>
            </div>
            <button
              onClick={() => setActiveTab('phishing')}
              className="w-full mt-4 py-3 bg-[#050505] hover:bg-white hover:text-black text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
            >
              <span>OPEN PHISHING ENGINE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Malware Card */}
          <div className="bg-[#0E0E0E] border border-zinc-900 hover:border-orange-600 p-6 space-y-4 transition-colors flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Bug className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-tight">Malware & Payloads</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Detect ransomware shadow copy wiping, banking trojans, encoded PowerShell scripts, cryptojacking CPU hogs, and double extensions.
              </p>
              <div className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 bg-cyan-950/30 px-2.5 py-1 border border-cyan-900/50 inline-block font-mono">
                12 Malware Rules
              </div>
            </div>
            <button
              onClick={() => setActiveTab('malware')}
              className="w-full mt-4 py-3 bg-[#050505] hover:bg-white hover:text-black text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
            >
              <span>OPEN MALWARE INSPECTOR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fraud Card */}
          <div className="bg-[#0E0E0E] border border-zinc-900 hover:border-orange-600 p-6 space-y-4 transition-colors flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-tight">Financial Fraud</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                Scan UPI collect request scams, crypto doubling lures, FedEx customs "Digital Arrest" extortion, BEC wire requests, and illegal loan apps.
              </p>
              <div className="text-[10px] font-bold tracking-widest uppercase text-amber-400 bg-amber-950/30 px-2.5 py-1 border border-amber-900/50 inline-block font-mono">
                12 Fraud Rules
              </div>
            </div>
            <button
              onClick={() => setActiveTab('fraud')}
              className="w-full mt-4 py-3 bg-[#050505] hover:bg-white hover:text-black text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-zinc-800 transition-colors"
            >
              <span>OPEN FRAUD SCANNER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Features Grid: Case Library, Evidence Vault, Training */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => setActiveTab('cases')}
          className="bg-[#0E0E0E] border border-zinc-900 hover:border-zinc-700 p-6 cursor-pointer transition-colors flex items-start gap-4 group"
        >
          <div className="p-3 bg-zinc-900 border border-zinc-800 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-white tracking-wide">Case Reference Library</h3>
            <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
              9 real cybercrime breakdowns with timelines, attack vectors, and legal statutes.
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('evidence')}
          className="bg-[#0E0E0E] border border-zinc-900 hover:border-zinc-700 p-6 cursor-pointer transition-colors flex items-start gap-4 group"
        >
          <div className="p-3 bg-zinc-900 border border-zinc-800 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-white tracking-wide">Evidence Vault & Reports</h3>
            <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
              Generate official Section 65B Certificates, SHA-256 evidence logs, and export reports.
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('training')}
          className="bg-[#0E0E0E] border border-zinc-900 hover:border-zinc-700 p-6 cursor-pointer transition-colors flex items-start gap-4 group"
        >
          <div className="p-3 bg-zinc-900 border border-zinc-800 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase text-white tracking-wide">Forensic Triage Quiz</h3>
            <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
              Test your triage skills across 10 scenario challenges with immediate technical feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      {recentScans.length > 0 && (
        <div className="bg-[#0E0E0E] border border-zinc-900 p-6 space-y-4">
          <h2 className="text-xs font-black tracking-[0.2em] uppercase text-zinc-400 flex items-center gap-2 font-mono">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span>RECENT SESSION ANALYSES</span>
          </h2>

          <div className="divide-y divide-zinc-900 font-mono text-xs">
            {recentScans.slice(0, 5).map((scan) => (
              <div
                key={scan.id}
                onClick={() => setActiveTab(scan.module)}
                className="py-3 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-zinc-900/60 px-2 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                      scan.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : scan.severity === 'HIGH_RISK'
                        ? 'bg-orange-950 text-orange-400 border border-orange-800'
                        : scan.severity === 'SUSPICIOUS'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {scan.severity} ({scan.threatScore}/100)
                  </span>
                  <span className="font-bold text-zinc-200">{scan.inputTitle}</span>
                  <span className="text-[10px] text-zinc-500 uppercase">[{scan.module}]</span>
                </div>

                <div className="flex items-center space-x-4 text-zinc-500 text-[11px]">
                  <span>{scan.matches.length} Match(es)</span>
                  <span>•</span>
                  <span>{new Date(scan.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
