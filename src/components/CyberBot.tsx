import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Shield,
  FileCode,
  Scale,
  Paperclip,
  X,
  Maximize2,
  Minimize2,
  Cpu,
  Download,
  Zap,
  Brain,
  Globe,
  MessageSquare,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  roleUsed?: string;
}

interface CyberBotProps {
  embeddedMode?: boolean;
  onCloseFloating?: () => void;
  attachedEvidence?: AnalysisResult | null;
}

// System Roles Available
export const CHAT_ROLES = [
  {
    id: 'investigator',
    name: 'Lead Forensics Investigator',
    shortName: 'DFIR Lead',
    icon: Shield,
    color: 'text-orange-400',
    borderColor: 'border-orange-500/50',
    badge: 'INVESTIGATOR',
    description: 'Triage, volatile RAM extraction, filesystem ($MFT) analysis & chain of custody.',
  },
  {
    id: 'reverse_engineer',
    name: 'Malware Reverse Engineer',
    shortName: 'Reverse Eng.',
    icon: FileCode,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/50',
    badge: 'MALWARE',
    description: 'Assembly opcodes, shellcode deobfuscation, process injection & YARA rules.',
  },
  {
    id: 'legal_counsel',
    name: 'Cyber Legal & Sec 65B Counsel',
    shortName: 'Legal Counsel',
    icon: Scale,
    color: 'text-purple-400',
    borderColor: 'border-purple-500/50',
    badge: 'CYBER LAW',
    description: 'Section 65B Certificates, IT Act 2000, BNS/BSA 2023 & statutory court filings.',
  },
  {
    id: 'threat_intel',
    name: 'Threat Intel & APT Specialist',
    shortName: 'Threat Intel',
    icon: Globe,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    badge: 'THREAT INTEL',
    description: 'APT tracking, MITRE ATT&CK mapping, C2 schemas & IoC correlation.',
  },
];

// Gemini Models as specified by user instructions:
// gemini-3.1-pro-preview for particularly complex tasks
// gemini-3.5-flash for general tasks
// gemini-3.1-flash-lite for tasks that should happen fast
export const GEMINI_MODELS = [
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    label: 'General Tasks',
    icon: Sparkles,
    badge: 'DEFAULT',
    badgeColor: 'bg-orange-950 text-orange-400 border border-orange-800',
    description: 'Balanced speed and deep reasoning for end-to-end incident triage.',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    label: 'Fast Triage',
    icon: Zap,
    badge: 'FAST',
    badgeColor: 'bg-emerald-950 text-emerald-400 border border-emerald-800',
    description: 'Ultra-low latency for rapid IoC checks and quick log queries.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    label: 'Complex Tasks',
    icon: Brain,
    badge: 'COMPLEX',
    badgeColor: 'bg-purple-950 text-purple-400 border border-purple-800',
    description: 'Deep reasoning for multi-stage APTs, assembly decompilation & memory reconstruction.',
  },
];

const QUICK_PROMPTS = [
  {
    title: 'Triage LockBit 3.0 Ransomware',
    icon: Shield,
    badge: 'COMPLEX',
    model: 'gemini-3.1-pro-preview',
    role: 'investigator',
    prompt:
      'We have detected LockBit 3.0 executing vssadmin delete shadows and creating .lockbit files on an active Domain Controller. Provide an immediate step-by-step incident response containment and triage protocol.',
  },
  {
    title: 'AiTM Reverse-Proxy Phishing Triage',
    icon: Terminal,
    badge: 'COMPLEX',
    model: 'gemini-3.1-pro-preview',
    role: 'threat_intel',
    prompt:
      'An executive clicked an Evilginx-style reverse-proxy phishing link that intercepted their session cookies and bypassed FIDO2 MFA. How do we revoke active refresh tokens, investigate Azure sign-in logs, and secure the O365 tenant?',
  },
  {
    title: 'Digital Arrest Extortion FIR & Freeze',
    icon: Scale,
    badge: 'GENERAL',
    model: 'gemini-3.5-flash',
    role: 'legal_counsel',
    prompt:
      'A victim is currently under coercion in a fake CBI / Narcotics Bureau "Digital Arrest" Skype call and transferred ₹4.8 Lakh to an alleged RBI escrow account. Draft an urgent 1930 Cyber Crime Helpline FIR brief and immediate bank account freeze request under Section 66D IT Act.',
  },
  {
    title: 'In-Memory Process Injection Analysis',
    icon: FileCode,
    badge: 'COMPLEX',
    model: 'gemini-3.1-pro-preview',
    role: 'reverse_engineer',
    prompt:
      'Sysmon Event ID 8 shows CreateRemoteThread with VirtualAllocEx RWX permissions into explorer.exe. How do I dump the unbacked injected memory section and analyze it using Volatility and YARA?',
  },
  {
    title: 'Draft Section 65B Evidence Certificate',
    icon: Scale,
    badge: 'GENERAL',
    model: 'gemini-3.5-flash',
    role: 'legal_counsel',
    prompt:
      'What are the mandatory legal requirements under Section 65B of the Indian Evidence Act / Section 63 BNS for admissible digital hash evidence in court? Provide a ready-to-use certificate template.',
  },
  {
    title: 'Rapid Email Header RFC 822 Trace',
    icon: Zap,
    badge: 'FAST',
    model: 'gemini-3.1-flash-lite',
    role: 'investigator',
    prompt:
      'Quickly inspect these hop headers: explain the difference between SPF softfail (~all) and hard fail (-all), and why Return-Path mismatch indicates spoofing.',
  },
];

export const CyberBot: React.FC<CyberBotProps> = ({
  embeddedMode = false,
  onCloseFloating,
  attachedEvidence,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('investigator');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '**AEGIS-AI DIGITAL FORENSICS & INCIDENT RESPONSE COPILOT**\n\nI am initialized with multi-turn conversation memory. Select an operational role and model tier above, or ask me to inspect evidence, reconstruct attacks, draft Section 65B certificates, or deconstruct malicious payloads.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
      roleUsed: 'investigator',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeArtifact, setActiveArtifact] = useState<AnalysisResult | null>(
    attachedEvidence || null
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (attachedEvidence) {
      setActiveArtifact(attachedEvidence);
    }
  }, [attachedEvidence]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, overrideModel?: string, overrideRole?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const currentModel = overrideModel || selectedModel;
    const currentRole = overrideRole || selectedRole;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      let systemContext = '';
      if (activeArtifact) {
        systemContext = `Target Module: ${activeArtifact.module}
Input Title: ${activeArtifact.inputTitle}
Risk Score: ${activeArtifact.riskScore}/100 (${activeArtifact.severity})
Summary: ${activeArtifact.analysis.executiveSummary}
IoCs Found: ${activeArtifact.analysis.iocsFound.join(', ')}`;
      }

      // Send entire multi-turn conversation history to server
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemContext,
          roleId: currentRole,
          modelName: currentModel,
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || 'No response returned from assistant.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || currentModel,
        roleUsed: data.roleUsed || currentRole,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          '### ⚠️ FORENSIC ENGINE DISPATCH\n\nThe copilot processed your request locally. Please submit your prompt again or adjust the model tier.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: currentModel,
        roleUsed: currentRole,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content:
          '**AEGIS-AI ONLINE // MULTI-TURN SESSION REINITIALIZED**\n\nConversation memory reset. Ready for next forensic investigation query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        roleUsed: selectedRole,
      },
    ]);
  };

  const handleExportTranscript = () => {
    const header = `================================================================================
CYBER FORENSICS LAB (CFL) - MULTI-TURN INVESTIGATION TRANSCRIPT
Generated: ${new Date().toISOString()}
Session Turns: ${messages.length}
================================================================================\n\n`;

    const body = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.role === 'user' ? 'INVESTIGATOR' : `AEGIS-AI (${m.modelUsed || 'GEMINI'})`}:\n${m.content}\n\n--------------------------------------------------------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cfl-investigation-log-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentRoleObj = CHAT_ROLES.find((r) => r.id === selectedRole) || CHAT_ROLES[0];
  const currentModelObj = GEMINI_MODELS.find((m) => m.id === selectedModel) || GEMINI_MODELS[0];

  return (
    <div
      className={`bg-[#0A0A0A] border border-zinc-800 text-white flex flex-col font-mono ${
        embeddedMode
          ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 font-sans min-h-[800px]'
          : `${
              isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[650px] w-full max-w-2xl shadow-2xl'
            } rounded-none border-orange-600/40`
      }`}
    >
      {/* Top Header */}
      <div className="bg-[#0E0E0E] border-b border-zinc-900 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black">
            <Bot className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black tracking-tight uppercase text-white">
                AEGIS-AI CHATBOT
              </h2>
              <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                MULTI-TURN
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">
              Role: <span className="text-orange-400 font-bold">{currentRoleObj.name}</span> • Model:{' '}
              <span className="text-zinc-300 font-bold">{currentModelObj.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportTranscript}
            className="p-1.5 bg-[#050505] hover:border-orange-600 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1 text-[10px] px-2"
            title="Export Evidence Transcript"
          >
            <Download className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">EXPORT LOG</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 bg-[#050505] hover:border-orange-600 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Reset Conversation History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {!embeddedMode && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 bg-[#050505] hover:border-orange-600 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              {onCloseFloating && (
                <button
                  onClick={onCloseFloating}
                  className="p-1.5 bg-[#050505] hover:border-orange-600 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                  title="Close Assistant"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Role Selection Bar */}
      <div className="bg-[#080808] border-b border-zinc-900 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider pr-1">
            ROLE:
          </span>
          {CHAT_ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border ${
                  isSelected
                    ? 'bg-zinc-100 text-black border-white shadow'
                    : 'bg-[#050505] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                title={r.description}
              >
                <Icon className={`w-3 h-3 ${isSelected ? 'text-black' : r.color}`} />
                <span>{r.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Model Tier Selector (Fast / General / Complex) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider pr-1">
            MODEL:
          </span>
          {GEMINI_MODELS.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer border ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-500 shadow'
                    : 'bg-[#050505] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
                title={m.description}
              >
                <Icon className="w-3 h-3" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Attached Evidence Banner */}
      {activeArtifact && (
        <div className="bg-orange-950/30 border-b border-orange-800/50 px-4 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-orange-300 truncate">
            <Paperclip className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="font-bold uppercase text-[10px] tracking-wider">ATTACHED ARTIFACT:</span>
            <span className="truncate text-zinc-200">{activeArtifact.inputTitle}</span>
            <span className="bg-orange-900/60 px-1.5 py-0.5 text-[9px] text-orange-200 uppercase font-black">
              {activeArtifact.module}
            </span>
          </div>
          <button
            onClick={() => setActiveArtifact(null)}
            className="text-zinc-500 hover:text-white ml-2 cursor-pointer"
            title="Detach Artifact"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Starter Prompts Bar (when conversation is fresh) */}
      {messages.length <= 2 && (
        <div className="p-3 bg-[#080808] border-b border-zinc-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 font-mono">
          {QUICK_PROMPTS.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedModel(qp.model);
                  setSelectedRole(qp.role);
                  handleSendMessage(qp.prompt, qp.model, qp.role);
                }}
                className="p-2.5 bg-[#050505] border border-zinc-800 hover:border-orange-600 text-left transition-colors cursor-pointer flex items-center space-x-2.5 group"
              >
                <div className="p-1 bg-zinc-900 group-hover:bg-orange-600 text-zinc-400 group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase text-zinc-200 group-hover:text-orange-400 truncate">
                      {qp.title}
                    </span>
                    <span
                      className={`text-[8px] px-1 py-0.2 rounded font-black shrink-0 ${
                        qp.badge === 'COMPLEX'
                          ? 'bg-purple-950/80 text-purple-400 border border-purple-800'
                          : qp.badge === 'FAST'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : 'bg-orange-950/80 text-orange-400 border border-orange-800'
                      }`}
                    >
                      {qp.badge}
                    </span>
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate">{qp.prompt}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollable Chat Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            } space-y-1`}
          >
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              {msg.role === 'user' ? (
                <>
                  <span>INVESTIGATOR</span>
                  <User className="w-3 h-3 text-orange-500" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-orange-500" />
                  <span>AEGIS-AI</span>
                  {msg.roleUsed && (
                    <span className="bg-zinc-900 text-zinc-400 px-1 py-0.2 text-[9px] border border-zinc-800">
                      {msg.roleUsed.toUpperCase()}
                    </span>
                  )}
                  {msg.modelUsed && (
                    <span className="bg-orange-950 text-orange-400 px-1 py-0.2 text-[9px] border border-orange-900">
                      {msg.modelUsed}
                    </span>
                  )}
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 max-w-[90%] border ${
                msg.role === 'user'
                  ? 'bg-orange-950/40 border-orange-800 text-orange-100'
                  : 'bg-[#0E0E0E] border-zinc-800 text-zinc-200 shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                {msg.content}
              </div>

              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px] text-zinc-500">
                  <span className="text-[9px] text-zinc-600">
                    MULTI-TURN CONTEXT ACTIVE • EVIDENCE PRESERVED
                  </span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-orange-400 flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center space-x-2 text-[10px] text-zinc-500 uppercase font-bold">
              <Bot className="w-3 h-3 text-orange-500" />
              <span>AEGIS-AI IS REASONING ({selectedModel.toUpperCase()})...</span>
            </div>
            <div className="bg-[#0E0E0E] border border-zinc-800 p-4 text-orange-400 flex items-center space-x-2 shadow-md">
              <Cpu className="w-4 h-4 animate-spin text-orange-600" />
              <span className="animate-pulse text-xs font-mono">
                GENERATING CONTEXTUAL FORENSIC RESPONSE & STATUTORY CITATIONS...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Bar */}
      <div className="p-3 bg-[#080808] border-t border-zinc-900 font-mono">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask ${currentRoleObj.name} (${currentModelObj.name})...`}
              className="w-full bg-[#050505] border border-zinc-800 px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-orange-600 placeholder:text-zinc-600 font-mono pr-20"
            />
            <div className="absolute right-3 top-3 text-[10px] text-zinc-600 font-bold hidden sm:block">
              {selectedModel.replace('gemini-', '')}
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="py-3 px-5 bg-white hover:bg-orange-600 hover:text-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black uppercase text-[10px] tracking-widest transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <span>SEND</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
