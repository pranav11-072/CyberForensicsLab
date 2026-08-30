import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Fish,
  Bug,
  CreditCard,
  BookOpen,
  FileCheck,
  Cpu,
  GraduationCap,
  Activity,
  WifiOff,
  Clock,
  CheckCircle2,
  Bot,
  Binary,
  Radio,
  ShieldCheck,
  FileCode,
  Globe,
  Flame,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedEvidenceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedEvidenceCount }) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const coreNavItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'phishing', label: 'Phishing', icon: Fish },
    { id: 'malware', label: 'Malware', icon: Bug },
    { id: 'fraud', label: 'Fraud', icon: CreditCard },
    { id: 'decoders', label: 'Decoders', icon: Binary, isNew: true },
    { id: 'timeline', label: 'Timeline', icon: Clock, isNew: true },
    { id: 'network', label: 'Network Flow', icon: Radio, isNew: true },
    { id: 'hashes', label: 'Hash Matcher', icon: ShieldCheck, isNew: true },
    { id: 'yara', label: 'YARA Builder', icon: FileCode, isNew: true },
    { id: 'intel', label: 'Threat Feed', icon: Globe },
    { id: 'chatbot', label: 'AI Copilot', icon: Bot, isAi: true },
    { id: 'cases', label: 'Cases', icon: BookOpen },
    { id: 'evidence', label: 'Vault', icon: FileCheck, badge: savedEvidenceCount },
    { id: 'rules', label: 'Rules', icon: Cpu },
    { id: 'training', label: 'Quiz', icon: GraduationCap },
  ];

  return (
    <header className="bg-[#0A0A0A] border-b border-zinc-900 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      {/* Top Status Ticker Bar */}
      <div className="bg-[#050505] border-b border-zinc-900 px-4 sm:px-8 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-4">
          <span className="flex items-center text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            ENGINE // ACTIVE
          </span>
          <span className="text-zinc-800">|</span>
          <span className="flex items-center text-zinc-300 font-mono">
            <WifiOff className="w-3 h-3 mr-1 text-orange-600" /> AIR-GAPPED // LOCAL DECODERS ACTIVE
          </span>
          <span className="hidden md:inline text-zinc-800">|</span>
          <span className="hidden md:inline text-zinc-400 font-mono">45+ DETERMINISTIC HEURISTIC RULES</span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-zinc-400">
          <div className="flex items-center space-x-1.5 text-zinc-300">
            <Clock className="w-3 h-3 text-orange-600" />
            <span>{time || '08:58:05 IST'}</span>
          </div>
          <div className="flex items-center text-orange-500 border border-orange-600/40 bg-orange-950/20 px-2 py-0.5 text-[9px] font-black tracking-widest uppercase">
            SECURE LAB
          </div>
        </div>
      </div>

      {/* Main Brand & Nav Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-2xl tracking-tighter uppercase leading-none text-white">
                CFL<span className="text-orange-600">.</span>FORENSICS
              </div>
              <div className="text-[9px] font-bold tracking-[0.25em] uppercase text-zinc-500 mt-1">
                ENTERPRISE INCIDENT TRIAGE & REVERSE ENGINEERING
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-4 overflow-x-auto py-2">
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'text-white border-b-2 border-orange-600'
                      : 'text-zinc-500 hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.isNew && (
                    <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[8px] px-1 py-0.2 rounded font-mono font-bold">
                      NEW
                    </span>
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-0.5 bg-orange-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Compact / Mobile Nav Tabs Bar */}
        <div className="xl:hidden flex items-center gap-2 overflow-x-auto py-2 border-t border-zinc-900 no-scrollbar">
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-black font-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 bg-orange-600 text-white text-[9px] px-1 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
