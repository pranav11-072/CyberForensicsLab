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
  AlertTriangle,
  Scale,
  Paperclip,
  X,
  Maximize2,
  Minimize2,
  Cpu,
} from 'lucide-react';
import { AnalysisResult } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CyberBotProps {
  embeddedMode?: boolean;
  onCloseFloating?: () => void;
  attachedEvidence?: AnalysisResult | null;
}

const QUICK_PROMPTS = [
  {
    title: 'Deconstruct Email Header',
    icon: Terminal,
    prompt:
      'Explain how to analyze Received: headers and SPF/DKIM/DMARC alignment in suspicious email forensics.',
  },
  {
    title: 'PowerShell Obfuscation',
    icon: FileCode,
    prompt:
      'What are the common indicators of obfuscated PowerShell commands (e.g. EncodedCommand, IEX, DownloadString)?',
  },
  {
    title: 'Sec 65B Certificate Guide',
    icon: Scale,
    prompt:
      'What are the mandatory legal requirements under Section 65B of the Indian Evidence Act for admissible digital proof?',
  },
  {
    title: 'Generate YARA Rule',
    icon: Shield,
    prompt:
      'Write a template YARA rule to detect ransomware executable patterns with suspicious high entropy sections.',
  },
];

export const CyberBot: React.FC<CyberBotProps> = ({
  embeddedMode = false,
  onCloseFloating,
  attachedEvidence,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        '**AEGIS-AI ONLINE // CFL FORENSICS ASSISTANT**\n\nI am your AI Cybercrime Forensics & Legal Specialist. Ask me about threat analysis, log deconstruction, YARA rule generation, or IT Act / BNS legal provisions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

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

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemContext,
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || 'No response returned from assistant.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          '⚠️ **System Error**: Unable to reach backend forensics AI endpoint. Ensure server is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          '**AEGIS-AI ONLINE // CFL FORENSICS ASSISTANT**\n\nSession reset. Ready for next forensic investigation query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div
      className={`bg-[#0A0A0A] border border-zinc-800 text-white flex flex-col font-mono ${
        embeddedMode
          ? 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans min-h-[750px]'
          : `${
              isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : 'h-[600px] w-full max-w-xl shadow-2xl'
            } rounded-none border-orange-600/40`
      }`}
    >
      {/* Header */}
      <div className="bg-[#0E0E0E] border-b border-zinc-900 px-5 py-4 flex items-center justify-between font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black">
            <Bot className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black tracking-tight uppercase text-white">
                AEGIS-AI ASSISTANT
              </h2>
              <span className="bg-orange-950 text-orange-400 border border-orange-800 text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-widest">
                GEMINI 3.6
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">
              Cyber Crime Specialist & Legal Compliance Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetChat}
            className="p-1.5 bg-[#050505] hover:border-orange-600 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
            title="Clear Session"
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

      {/* Quick Prompts Bar */}
      {messages.length <= 2 && (
        <div className="p-4 bg-[#080808] border-b border-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
          {QUICK_PROMPTS.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                className="p-2.5 bg-[#050505] border border-zinc-800 hover:border-orange-600 text-left transition-colors cursor-pointer flex items-center space-x-2.5 group"
              >
                <div className="p-1 bg-zinc-900 group-hover:bg-orange-600 text-zinc-400 group-hover:text-white transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-black uppercase text-zinc-200 group-hover:text-orange-400">
                    {qp.title}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate">{qp.prompt}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Chat Messages Body */}
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
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 max-w-[90%] border ${
                msg.role === 'user'
                  ? 'bg-orange-950/40 border-orange-800 text-orange-100'
                  : 'bg-[#0E0E0E] border-zinc-800 text-zinc-200'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                {msg.content}
              </div>

              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-zinc-900 flex justify-end font-mono">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="text-[10px] text-zinc-500 hover:text-orange-400 flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY RESPONSE</span>
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
              <span>AEGIS-AI IS ANALYZING...</span>
            </div>
            <div className="bg-[#0E0E0E] border border-zinc-800 p-4 text-orange-400 flex items-center space-x-2">
              <Cpu className="w-4 h-4 animate-spin text-orange-600" />
              <span className="animate-pulse text-xs font-mono">
                DECONSTRUCTING THREAT INTELLIGENCE & LEGAL PROVISIONS...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-[#080808] border-t border-zinc-900 font-mono">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI Assistant (e.g., 'Draft YARA rule for phishing script' or 'Section 66D penalty')..."
            className="flex-1 bg-[#050505] border border-zinc-800 px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-orange-600 placeholder:text-zinc-600 font-mono"
          />
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
