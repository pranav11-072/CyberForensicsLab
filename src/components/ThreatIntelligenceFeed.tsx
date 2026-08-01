import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Radio,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

interface ThreatAlert {
  cve: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | string;
  title: string;
  category: string;
  summary: string;
  affectedSystems: string;
  recommendedAction: string;
}

interface GroundingSource {
  title: string;
  uri: string;
}

interface ThreatIntelData {
  isGrounded?: boolean;
  isFallback?: boolean;
  searchQuery?: string;
  lastUpdated?: string;
  sources?: GroundingSource[];
  threatAlerts?: ThreatAlert[];
}

export const ThreatIntelligenceFeed: React.FC = () => {
  const [queryTopic, setQueryTopic] = useState('all');
  const [data, setData] = useState<ThreatIntelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAlertIndex, setExpandedAlertIndex] = useState<number | null>(0);
  const [customSearch, setCustomSearch] = useState('');

  const topics = [
    { id: 'all', label: 'All Intel', query: 'latest cybersecurity threat intelligence headlines active zero-day vulnerabilities CVE alerts 2026' },
    { id: 'zeroday', label: 'Zero-Days', query: 'latest zero-day exploit vulnerabilities active exploitation CVE 2026' },
    { id: 'ransomware', label: 'Ransomware', query: 'latest ransomware attacks gangs IOCs threat actor advisory 2026' },
    { id: 'phishing', label: 'Phishing & BEC', query: 'latest phishing campaigns credential harvesting BEC scam alerts 2026' },
    { id: 'banking', label: 'FinTech & Banking', query: 'latest banking trojan financial cyber attack UPI OTP fraud 2026' },
  ];

  const fetchThreatIntel = async (searchPrompt?: string) => {
    setIsLoading(true);
    try {
      const activeTopic = topics.find((t) => t.id === queryTopic);
      const queryToUse = searchPrompt || (activeTopic ? activeTopic.query : topics[0].query);

      const res = await fetch('/api/threat-intel/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToUse }),
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch threat intel:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreatIntel();
  }, [queryTopic]);

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    fetchThreatIntel(customSearch.trim());
  };

  return (
    <div className="bg-[#0E0E0E] border border-zinc-900 p-6 sm:p-8 space-y-6 font-sans shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[9px] font-black px-2 py-0.5 uppercase tracking-widest font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-400 animate-pulse" />
              SEARCH GROUNDED VIA GEMINI AI
            </span>
            {data?.isGrounded && (
              <span className="text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                LIVE WEB GROUNDED
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2.5 font-mono">
            <Globe className="w-6 h-6 text-orange-500" />
            <span>LIVE THREAT INTEL & CVE HEADLINES</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono leading-relaxed max-w-3xl">
            Real-time web search grounding synthesizes the latest zero-day exploits, ransomware campaigns, and CVE alerts directly into structured forensic intelligence.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={() => fetchThreatIntel()}
            disabled={isLoading}
            className="px-4 py-2.5 bg-[#050505] hover:border-orange-600 text-zinc-300 hover:text-white border border-zinc-800 font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>REFRESH FEED</span>
          </button>
        </div>
      </div>

      {/* Topic Filter Chips & Custom Search Form */}
      <div className="space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setQueryTopic(t.id);
                  setCustomSearch('');
                }}
                className={`px-3 py-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  queryTopic === t.id && !customSearch
                    ? 'bg-white text-black font-black'
                    : 'bg-[#050505] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Query Input */}
          <form onSubmit={handleCustomSearch} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              placeholder="Search specific CVE or threat group..."
              className="bg-[#050505] border border-zinc-800 px-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-600 w-full sm:w-64"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Timestamp & Grounding Metadata info */}
        {data && (
          <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-500 bg-[#050505] border border-zinc-800/80 px-3.5 py-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>LAST GROUNDED FETCH: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Just now'}</span>
            </div>
            {data.searchQuery && (
              <div className="truncate max-w-md">
                <span>QUERY: </span>
                <span className="text-orange-400 font-bold">"{data.searchQuery}"</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-[#050505] border border-zinc-800 p-12 text-center space-y-3 font-mono">
          <Cpu className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
          <div className="text-xs font-bold text-white uppercase tracking-widest">
            EXECUTING LIVE GOOGLE SEARCH GROUNDING VIA GEMINI...
          </div>
          <p className="text-[11px] text-zinc-500">
            Querying active vulnerability databases, security blogs, and CERT bulletins...
          </p>
        </div>
      ) : data?.threatAlerts && data.threatAlerts.length > 0 ? (
        <div className="space-y-4">
          {data.threatAlerts.map((alert, idx) => {
            const isExpanded = expandedAlertIndex === idx;
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';

            return (
              <div
                key={idx}
                className={`border transition-colors font-mono ${
                  isExpanded
                    ? 'bg-[#080808] border-orange-600/80 shadow-lg'
                    : 'bg-[#050505] border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Alert Accordion Header */}
                <button
                  onClick={() => setExpandedAlertIndex(isExpanded ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 uppercase tracking-wider ${
                          isCritical
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : isHigh
                            ? 'bg-orange-950 text-orange-400 border border-orange-800'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {alert.severity || 'MEDIUM'}
                      </span>
                      <span className="text-xs font-bold text-orange-400 bg-orange-950/20 px-2 py-0.5 border border-orange-900/30">
                        {alert.cve || 'CVE ALERT'}
                      </span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 border border-zinc-800 uppercase">
                        {alert.category}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white font-sans leading-snug">
                      {alert.title}
                    </h3>
                  </div>

                  <div className="pt-1 text-zinc-500 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-zinc-900 space-y-4 font-sans text-xs">
                    <div className="space-y-1.5 pt-3">
                      <div className="text-[10px] font-black uppercase text-zinc-500 font-mono tracking-wider">
                        THREAT SUMMARY & IMPACT
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-medium">{alert.summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                      <div className="bg-[#050505] border border-zinc-800 p-3.5 space-y-1">
                        <div className="text-[10px] font-bold text-orange-400 uppercase">AFFECTED SYSTEMS</div>
                        <div className="text-zinc-300 text-xs">{alert.affectedSystems || 'General Enterprise Networks'}</div>
                      </div>

                      <div className="bg-[#050505] border border-zinc-800 p-3.5 space-y-1">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase">RECOMMENDED MITIGATION</div>
                        <div className="text-zinc-300 text-xs">{alert.recommendedAction || 'Apply official patches immediately.'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#050505] border border-zinc-800 p-8 text-center text-zinc-500 font-mono text-xs">
          No threat intelligence alerts returned for this query. Try clicking "REFRESH FEED" or entering a custom query.
        </div>
      )}

      {/* Grounding Source Citations Section */}
      {data?.sources && data.sources.length > 0 && (
        <div className="pt-4 border-t border-zinc-900 space-y-3 font-mono">
          <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>GROUNDED WEB SOURCES & CITATIONS ({data.sources.length})</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {data.sources.map((src, i) => (
              <a
                key={i}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 px-3 py-1.5 text-[11px] font-medium flex items-center space-x-1.5 transition-colors group"
              >
                <span className="truncate max-w-xs">{src.title}</span>
                <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-orange-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
