import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ShieldAlert,
  Scale,
  FileCheck,
  ChevronRight,
  X,
  AlertTriangle,
} from 'lucide-react';
import { CYBER_CASES } from '../data/cases';
import { CyberCase } from '../types';

export const CaseLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeCase, setActiveCase] = useState<CyberCase | null>(null);

  const categories = [
    'ALL',
    'Malware & Ransomware',
    'Phishing & Social',
    'Financial Fraud',
    'Critical Infrastructure',
  ];

  const filteredCases = CYBER_CASES.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.legalSections.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'ALL') return matchesQuery;
    if (selectedCategory === 'Malware & Ransomware') {
      return matchesQuery && (c.category.includes('Malware') || c.category.includes('Ransomware'));
    }
    if (selectedCategory === 'Phishing & Social') {
      return matchesQuery && (c.category.includes('Phishing') || c.category.includes('SMS') || c.category.includes('Deepfake'));
    }
    if (selectedCategory === 'Financial Fraud') {
      return fontMatchesFraud(c) && matchesQuery;
    }
    if (selectedCategory === 'Critical Infrastructure') {
      return matchesQuery && (c.category.includes('Critical') || c.category.includes('Infrastructure') || c.category.includes('Nuclear'));
    }
    return matchesQuery;
  });

  function fontMatchesFraud(c: CyberCase) {
    return c.category.includes('Fraud') || c.category.includes('Financial') || c.category.includes('Crypto') || c.category.includes('Extortion');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-white">
              Cybercrime Case Library<span className="text-orange-600">.</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              9 landmark cyber attack & fraud investigation breakdowns with timelines, IOC artifacts, and legal provisions.
            </p>
          </div>
        </div>

        <div className="text-[10px] font-black font-mono uppercase tracking-widest text-orange-400 bg-orange-950/60 border border-orange-800 px-3 py-1.5">
          9 REAL-WORLD CASE STUDIES
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 font-mono">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by keyword, attack vector, malware name, or legal section (e.g., WannaCry, Sec 66D)..."
            className="w-full bg-[#0E0E0E] border border-zinc-800 pl-10 pr-4 py-3 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-600 placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar font-mono text-[10px] font-bold uppercase tracking-wider">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-3 whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-black'
                  : 'bg-[#0E0E0E] text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Case Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((cyberCase) => (
          <div
            key={cyberCase.id}
            onClick={() => setActiveCase(cyberCase)}
            className="bg-[#0E0E0E] border border-zinc-900 hover:border-orange-600 p-6 space-y-4 cursor-pointer transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono">
                <span
                  className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                    cyberCase.severity === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : 'bg-orange-950 text-orange-400 border border-orange-800'
                  }`}
                >
                  {cyberCase.severity}
                </span>

                <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-600" />
                  <span>{cyberCase.year}</span>
                </div>
              </div>

              <h3 className="font-black text-lg font-mono tracking-tight uppercase text-white group-hover:text-orange-500 transition-colors">
                {cyberCase.title}
              </h3>

              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3 h-3 text-orange-600" />
                <span>{cyberCase.location}</span>
                <span className="text-zinc-700">•</span>
                <span className="text-orange-400 font-bold">{cyberCase.lossImpact}</span>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed font-sans">
                {cyberCase.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>{cyberCase.timeline.length} TIMELINE EVENTS</span>
              <span className="text-orange-500 font-black flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                DOSSIER <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Case Dossier Modal */}
      {activeCase && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative font-sans">
            <button
              onClick={() => setActiveCase(null)}
              className="absolute top-5 right-5 p-2 bg-[#050505] border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Metadata */}
            <div className="space-y-3 border-b border-zinc-900 pb-5">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
                <span className="bg-orange-950 text-orange-400 border border-orange-800 px-2.5 py-0.5">
                  {activeCase.category}
                </span>
                <span className="text-zinc-500">
                  {activeCase.year} • {activeCase.location}
                </span>
              </div>
              <h2 className="text-2xl font-black font-mono tracking-tight uppercase text-white">{activeCase.title}</h2>
              <div className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/40 border border-orange-800 px-3 py-1 inline-block uppercase tracking-wider">
                IMPACT / LOSS: {activeCase.lossImpact}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-widest">EXECUTIVE SUMMARY</h3>
              <p className="text-xs md:text-sm text-zinc-300 font-mono leading-relaxed bg-[#050505] p-4 border border-zinc-800">
                {activeCase.summary}
              </p>
            </div>

            {/* Attack Vectors */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span>PRIMARY ATTACK VECTORS</span>
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                {activeCase.attackVectors.map((vec, idx) => (
                  <li key={idx} className="bg-[#050505] border border-zinc-800 p-3 text-zinc-300 flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>{vec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>ATTACK TIMELINE & INCIDENT CHRONOLOGY</span>
              </h3>
              <div className="space-y-3 border-l-2 border-zinc-800 pl-4">
                {activeCase.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-0.5 font-mono">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-orange-600"></div>
                    <div className="text-[10px] text-orange-400 font-black uppercase tracking-wider">{item.time}</div>
                    <div className="text-xs text-zinc-300">{item.event}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forensic Artifacts Found */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>FORENSIC ARTIFACTS & IOCS RECOVERED</span>
              </h3>
              <div className="bg-[#050505] border border-zinc-800 p-3 space-y-1.5 font-mono text-xs">
                {activeCase.forensicArtifacts.map((art, idx) => (
                  <div key={idx} className="text-zinc-300 flex items-start gap-2 bg-zinc-900/50 p-2 border border-zinc-800">
                    <span className="text-emerald-500 font-bold">&gt;</span>
                    <span>{art}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lessons & Legal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" />
                  <span>PREVENTION & MITIGATION LESSONS</span>
                </h3>
                <ul className="text-xs font-mono space-y-1.5 text-zinc-300 list-disc list-inside bg-[#050505] p-4 border border-zinc-800">
                  {activeCase.mitigationLessons.map((les, idx) => (
                    <li key={idx} className="leading-relaxed">{les}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-[10px] font-mono text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <span>APPLICABLE LEGAL PROVISIONS</span>
                </h3>
                <div className="bg-purple-950/20 border border-purple-800/40 p-4 space-y-1 text-xs font-mono">
                  {activeCase.legalSections.map((sec, idx) => (
                    <div key={idx} className="text-purple-200 font-bold">• {sec}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
