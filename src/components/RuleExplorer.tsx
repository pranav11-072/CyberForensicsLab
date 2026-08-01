import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Filter,
  Code,
  Scale,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { FORENSIC_RULES } from '../data/rules';
import { ForensicRule } from '../types';

export const RuleExplorer: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sandboxInput, setSandboxInput] = useState('');

  const filteredRules = FORENSIC_RULES.filter((rule) => {
    const matchesModule = selectedModule === 'ALL' || rule.module === selectedModule.toLowerCase();
    const matchesQuery =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.legalSections.some((sec) => sec.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesModule && matchesQuery;
  });

  // Test sandbox input against all 36 rules
  const triggeredRules = sandboxInput.trim()
    ? FORENSIC_RULES.filter((rule) => {
        if (rule.pattern instanceof RegExp) {
          return rule.pattern.test(sandboxInput);
        }
        return sandboxInput.toLowerCase().includes(rule.pattern.toLowerCase());
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">
            <Cpu className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-white">
              Forensic Pattern Rule Engine<span className="text-orange-600">.</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Inspect the 36 deterministic pattern-matching rules powering offline phishing, malware, and fraud detection.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-black font-mono text-orange-500 bg-orange-950/30 border border-orange-800/50 px-3 py-1.5 uppercase tracking-widest">
          36 DETERMINISTIC SIGNATURES
        </div>
      </div>

      {/* Sandbox Tester */}
      <div className="bg-[#0E0E0E] border border-zinc-900 p-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-orange-500 font-black tracking-wider uppercase">
          <Zap className="w-4 h-4 text-orange-600" />
          <span>LIVE RULE SANDBOX TESTER // TEST ANY INPUT STRING</span>
        </div>

        <input
          type="text"
          value={sandboxInput}
          onChange={(e) => setSandboxInput(e.target.value)}
          placeholder="Type test text (e.g. 'vssadmin delete shadows', 'verify password now', 'enter upi pin')..."
          className="w-full bg-[#050505] border border-zinc-800 px-4 py-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-600"
        />

        {sandboxInput.trim() && (
          <div className="bg-[#050505] border border-zinc-800 p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-zinc-400 text-[11px] font-bold">
              <span>EVALUATION RESULTS:</span>
              <span className="text-orange-500 font-black">{triggeredRules.length} RULE(S) TRIGGERED</span>
            </div>

            {triggeredRules.length === 0 ? (
              <div className="text-zinc-600 text-[11px]">No rules matched input string.</div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {triggeredRules.map((rule) => (
                  <span
                    key={rule.id}
                    className="bg-orange-950 text-orange-300 border border-orange-800 px-3 py-1 text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>{rule.id}: {rule.name} (+{rule.weight})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search & Module Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter rules by name, pattern string, or legal statute..."
            className="w-full bg-[#0E0E0E] border border-zinc-900 pl-11 pr-4 py-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-600"
          />
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
          {['ALL', 'PHISHING', 'MALWARE', 'FRAUD'].map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-4 py-3 transition-colors ${
                selectedModule === mod
                  ? 'bg-white text-black font-black'
                  : 'bg-[#0E0E0E] text-zinc-400 border border-zinc-900 hover:text-white'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Rule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-[#0E0E0E] border border-zinc-900 hover:border-orange-600/70 p-6 space-y-4 text-xs flex flex-col justify-between transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-[#050505] text-white border border-zinc-800 px-2.5 py-1 text-[10px] font-black">
                  {rule.id}
                </span>

                <span
                  className={`px-2.5 py-1 text-[10px] font-black tracking-widest uppercase ${
                    rule.module === 'phishing'
                      ? 'bg-orange-950 text-orange-400 border border-orange-800'
                      : rule.module === 'malware'
                      ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {rule.module.toUpperCase()} • +{rule.weight} PTS
                </span>
              </div>

              <h3 className="font-black text-sm text-white tracking-tight uppercase font-sans">{rule.name}</h3>

              <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{rule.category}</div>

              <p className="text-[11px] text-zinc-300 leading-relaxed bg-[#050505] p-3 border border-zinc-800/80 font-sans font-medium">
                {rule.description}
              </p>

              {/* Regex Pattern View */}
              <div className="bg-[#050505] border border-zinc-800/80 p-2.5 text-[10px] text-rose-400 break-all flex items-start gap-2">
                <Code className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                <span className="font-mono">{rule.pattern.toString()}</span>
              </div>
            </div>

            {/* Legal Statutes */}
            <div className="pt-3 border-t border-zinc-900 space-y-1.5">
              <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                <Scale className="w-3 h-3 text-purple-400" />
                <span>LEGAL STATUTES:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {rule.legalSections.map((sec, idx) => (
                  <span key={idx} className="bg-purple-950 text-purple-300 border border-purple-800/50 px-2 py-0.5 text-[10px] font-bold">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
