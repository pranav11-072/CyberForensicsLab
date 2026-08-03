import React, { useState } from 'react';
import {
  Fish,
  Play,
  Copy,
  Check,
  AlertTriangle,
  Scale,
  ShieldAlert,
  Save,
  Link,
  Mail,
  RotateCcw,
  Info,
  Sparkles,
  Bot,
  Cpu,
  FileJson,
  FileSpreadsheet,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/presets';
import { AnalysisResult } from '../types';
import { runForensicAnalysis } from '../utils/engine';
import { exportResultToJson, exportResultToCsv } from '../utils/exportUtils';

interface PhishingAnalyzerProps {
  onSaveEvidence: (result: AnalysisResult) => void;
  savedResults: AnalysisResult[];
}

export const PhishingAnalyzer: React.FC<PhishingAnalyzerProps> = ({ onSaveEvidence, savedResults }) => {
  const phishingPresets = SAMPLE_PRESETS.filter((p) => p.module === 'phishing');
  
  const [inputText, setInputText] = useState<string>(phishingPresets[0]?.content || '');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [aiBreakdown, setAiBreakdown] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleRunAnalysis = async () => {
    if (!inputText.trim()) return;
    const result = await runForensicAnalysis(inputText, 'phishing', 'Phishing Email / Message Inspection');
    setAnalysis(result);
    setAiBreakdown(null);
    setIsSaved(savedResults.some((s) => s.id === result.id));
  };

  const handleRunAiInspection = async () => {
    if (!inputText.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactType: 'Phishing Email / Message',
          payload: inputText,
        }),
      });
      const data = await res.json();
      setAiBreakdown(data.aiBreakdown || 'No AI breakdown returned.');
    } catch (err) {
      console.error('AI inspection failed:', err);
      setAiBreakdown('Unable to generate AI deep analysis. Check server connection.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectPreset = (presetContent: string) => {
    setInputText(presetContent);
    setAnalysis(null);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToEvidence = () => {
    if (analysis) {
      onSaveEvidence(analysis);
      setIsSaved(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">
            <Fish className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-white">
              Phishing & Smishing Detector<span className="text-orange-600">.</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Evaluates email headers, SMS text, domain typosquatting, urgency cues & credential prompts against 12 rules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
          <button
            onClick={handleCopyText}
            className="px-4 py-2 bg-[#0E0E0E] hover:border-orange-600 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-orange-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY INPUT'}</span>
          </button>
          <button
            onClick={() => {
              setInputText('');
              setAnalysis(null);
            }}
            className="px-4 py-2 bg-[#0E0E0E] hover:border-orange-600 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Banner */}
      {phishingPresets.length > 0 && (
        <div className="bg-[#0E0E0E] border border-zinc-900 p-5 space-y-3">
          <div className="text-[10px] font-black font-mono tracking-[0.2em] uppercase text-zinc-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-orange-600" />
            <span>LOAD PRESET REAL-WORLD TEST CASES:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {phishingPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.content)}
                className="text-left p-3 bg-[#050505] hover:border-orange-600 border border-zinc-800 text-xs space-y-1 transition-colors group cursor-pointer"
              >
                <div className="font-bold uppercase tracking-tight text-white group-hover:text-orange-500 truncate font-mono">
                  {preset.title}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">{preset.subtitle}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Analysis Input & Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Pane (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0E0E0E] border border-zinc-900 p-6 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black font-mono tracking-widest uppercase text-zinc-400 border-b border-zinc-900 pb-3">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" />
                <span>RAW EMAIL / SMS / HEADER INPUT</span>
              </span>
              <span>{inputText.length} CHARS</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw email message, RFC 822 headers, SMS smishing text, or suspicious URL here..."
              className="w-full h-80 bg-[#050505] border border-zinc-800 p-4 text-xs font-mono text-zinc-100 focus:outline-none focus:border-orange-600 placeholder:text-zinc-600 resize-none leading-relaxed"
            ></textarea>

            <button
              onClick={handleRunAnalysis}
              disabled={!inputText.trim()}
              className="w-full py-4 bg-white hover:bg-orange-600 hover:text-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RUN PHISHING FORENSIC ANALYSIS</span>
            </button>
          </div>
        </div>

        {/* Right Output Results Pane (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {analysis ? (
            <div className="bg-[#0E0E0E] border border-zinc-900 p-6 space-y-6">
              {/* Verdict Header & Gauge */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                  <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">VERDICT & RISK SCORE</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => exportResultToJson(analysis)}
                      className="px-2.5 py-1.5 bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
                      title="Export scan artifact as JSON"
                    >
                      <FileJson className="w-3.5 h-3.5 text-orange-500" />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={() => exportResultToCsv(analysis)}
                      className="px-2.5 py-1.5 bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors cursor-pointer"
                      title="Export scan artifact as CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={handleSaveToEvidence}
                      disabled={isSaved}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                        isSaved
                          ? 'bg-orange-950 text-orange-400 border border-orange-800'
                          : 'bg-white hover:bg-orange-600 hover:text-white text-black cursor-pointer'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaved ? 'SAVED' : 'SAVE TO VAULT'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-[#050505] border border-zinc-800 p-5 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-black font-mono text-white flex items-center gap-2">
                      <span
                        className={`px-3 py-1 text-xs font-black uppercase tracking-widest ${
                          analysis.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : analysis.severity === 'HIGH_RISK'
                            ? 'bg-orange-950 text-orange-400 border border-orange-800'
                            : analysis.severity === 'SUSPICIOUS'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {analysis.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono tracking-wider mt-2 uppercase font-bold">
                      {analysis.matches.length} Signature Match(es)
                    </p>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-4xl font-black text-white tracking-tighter">
                      {analysis.threatScore}<span className="text-xs text-zinc-600">/100</span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">THREAT SCORE</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full bg-[#050505] h-2 border border-zinc-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      analysis.threatScore >= 85
                        ? 'bg-rose-600'
                        : analysis.threatScore >= 60
                        ? 'bg-orange-600'
                        : analysis.threatScore >= 35
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${analysis.threatScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Summary Description */}
              <div className="bg-[#050505] border border-zinc-800 p-4 text-xs font-mono text-zinc-300 leading-relaxed">
                {analysis.summary}
              </div>

              {/* AI Deep Forensic Breakdown Trigger & Result */}
              <div className="space-y-3 font-mono">
                <button
                  onClick={handleRunAiInspection}
                  disabled={isAiLoading}
                  className="w-full py-3 bg-[#050505] hover:border-orange-600 text-orange-400 border border-zinc-800 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isAiLoading ? (
                    <Cpu className="w-4 h-4 animate-spin text-orange-500" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-orange-500" />
                  )}
                  <span>{isAiLoading ? 'GENERATING AI FORENSIC DEEP-INSPECTION...' : 'RUN DEEP AI LLM FORENSIC INSPECTION'}</span>
                </button>

                {aiBreakdown && (
                  <div className="bg-[#050505] border border-orange-800/60 p-4 space-y-2 text-xs font-mono text-zinc-200">
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-[10px] uppercase tracking-widest border-b border-orange-950 pb-2">
                      <Bot className="w-4 h-4 text-orange-500" />
                      <span>GEMINI 3.6 FLASH LLM FORENSIC BREAKDOWN</span>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs text-zinc-300 pt-1">
                      {aiBreakdown}
                    </div>
                  </div>
                )}
              </div>

              {/* Extracted IOCs */}
              {(analysis.extractedUrls?.length || 0) > 0 && (
                <div className="space-y-2 font-mono">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-cyan-400" />
                    <span>EXTRACTED IOC URLS ({analysis.extractedUrls?.length}):</span>
                  </div>
                  <div className="bg-[#050505] border border-zinc-800 p-2.5 max-h-28 overflow-y-auto space-y-1">
                    {analysis.extractedUrls?.map((url, idx) => (
                      <div key={idx} className="text-[11px] text-cyan-400 break-all bg-zinc-900/60 p-1.5 border border-zinc-800">
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Indicators Breakdown */}
              <div className="space-y-3 font-mono">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                  <span>MATCHED SIGNATURES</span>
                  <span className="text-orange-500">{analysis.matches.length} MATCHES</span>
                </div>

                {analysis.matches.length === 0 ? (
                  <div className="bg-[#050505] border border-zinc-800 p-4 text-center text-xs text-zinc-500">
                    No malicious phishing signatures matched.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {analysis.matches.map((match, idx) => (
                      <div key={idx} className="bg-[#050505] border border-zinc-800 p-3 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-white">{match.ruleName}</span>
                          <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[9px] font-bold px-1.5 py-0.5">
                            +{match.weight} PTS
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">{match.description}</p>
                        {match.matchedText && (
                          <div className="bg-zinc-900/80 border border-zinc-800 text-rose-300 p-2 text-[10px] break-all">
                            Matched: &quot;{match.matchedText}&quot;
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-500 pt-1">
                          <span className="text-zinc-400 font-bold uppercase">Mitigation:</span> {match.mitigation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Legal Sections */}
              {analysis.legalSections.length > 0 && (
                <div className="bg-purple-950/20 border border-purple-800/40 p-3 space-y-2 text-xs font-mono">
                  <div className="text-purple-300 font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                    <Scale className="w-4 h-4 text-purple-400" />
                    <span>APPLICABLE LEGAL STATUTES (IT ACT / IPC)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.legalSections.map((sec, idx) => (
                      <span key={idx} className="bg-purple-950 text-purple-200 border border-purple-800 px-2 py-0.5 text-[10px] font-bold">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0E0E0E] border border-zinc-900 p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[400px]">
              <ShieldAlert className="w-12 h-12 text-zinc-700" />
              <div className="font-mono text-xs text-white font-black uppercase tracking-widest">READY FOR INSPECTION</div>
              <p className="text-xs text-zinc-500 max-w-xs font-medium">
                Select a preset above or paste custom text into the input box and click <span className="text-white font-bold font-mono">RUN ANALYSIS</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
