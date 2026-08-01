import React from 'react';
import { Shield, WifiOff, Scale, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-zinc-900 text-zinc-500 py-10 mt-16 font-mono text-[10px] tracking-wider uppercase font-bold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black">
              <Shield className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="font-black text-xs text-white tracking-widest">CYBER FORENSICS LAB<span className="text-orange-600">.</span> AIR-GAPPED</div>
              <p className="text-[9px] text-zinc-600 tracking-widest mt-0.5">DETERMINISTIC RULE ENGINE // V2.4</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[10px] tracking-[0.2em] text-zinc-400">
            <span className="flex items-center text-emerald-400">
              <WifiOff className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> 100% OFFLINE
            </span>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center text-purple-400">
              <Scale className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> SEC 65B CERTIFIED
            </span>
            <span className="text-zinc-800">|</span>
            <span className="flex items-center text-orange-500">
              <Lock className="w-3.5 h-3.5 mr-1.5 text-orange-600" /> ZERO LEAKS
            </span>
          </div>
        </div>

        <div className="border-t border-zinc-900/80 pt-6 text-[9px] text-zinc-600 text-center leading-relaxed font-normal normal-case max-w-4xl mx-auto">
          DISCLAIMER: Cyber Forensics Lab is designed for educational, ethical hacking, incident response, and forensic triage purposes. Rule evaluations are deterministic and rule-based. For legal proceedings, raw logs should be preserved with Section 65B Evidence Certificates and verified by certified forensic examiners under relevant IT Act & IPC guidelines.
        </div>
      </div>
    </footer>
  );
};
