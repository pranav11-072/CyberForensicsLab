import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { PhishingAnalyzer } from './components/PhishingAnalyzer';
import { MalwareAnalyzer } from './components/MalwareAnalyzer';
import { FraudScanner } from './components/FraudScanner';
import { CaseLibrary } from './components/CaseLibrary';
import { EvidenceVault } from './components/EvidenceVault';
import { RuleExplorer } from './components/RuleExplorer';
import { TrainingHub } from './components/TrainingHub';
import { CyberBot } from './components/CyberBot';
import { Footer } from './components/Footer';
import { AnalysisResult } from './types';
import { Bot, Sparkles, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [savedEvidence, setSavedEvidence] = useState<AnalysisResult[]>([]);
  const [recentScans, setRecentScans] = useState<AnalysisResult[]>([]);
  const [isFloatingBotOpen, setIsFloatingBotOpen] = useState(false);
  const [selectedArtifactForAi, setSelectedArtifactForAi] = useState<AnalysisResult | null>(null);

  const handleAnalysisCompleted = (result: AnalysisResult) => {
    setRecentScans((prev) => [result, ...prev.filter((r) => r.id !== result.id)]);
  };

  const handleSaveEvidence = (result: AnalysisResult) => {
    if (!savedEvidence.some((e) => e.id === result.id)) {
      setSavedEvidence((prev) => [result, ...prev]);
    }
  };

  const handleRemoveEvidence = (id: string) => {
    setSavedEvidence((prev) => prev.filter((item) => item.id !== id));
  };

  const openAiWithArtifact = (result: AnalysisResult) => {
    setSelectedArtifactForAi(result);
    if (activeTab === 'chatbot') {
      // already on chatbot
    } else {
      setIsFloatingBotOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col font-sans selection:bg-orange-600/30 selection:text-orange-200 relative">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedEvidenceCount={savedEvidence.length}
      />

      <main className="flex-1">
        {activeTab === 'overview' && (
          <Overview
            setActiveTab={setActiveTab}
            onAnalysisComplete={handleAnalysisCompleted}
            recentScans={recentScans}
          />
        )}

        {activeTab === 'phishing' && (
          <PhishingAnalyzer
            onSaveEvidence={(res) => {
              handleSaveEvidence(res);
              handleAnalysisCompleted(res);
            }}
            savedResults={savedEvidence}
          />
        )}

        {activeTab === 'malware' && (
          <MalwareAnalyzer
            onSaveEvidence={(res) => {
              handleSaveEvidence(res);
              handleAnalysisCompleted(res);
            }}
            savedResults={savedEvidence}
          />
        )}

        {activeTab === 'fraud' && (
          <FraudScanner
            onSaveEvidence={(res) => {
              handleSaveEvidence(res);
              handleAnalysisCompleted(res);
            }}
            savedResults={savedEvidence}
          />
        )}

        {activeTab === 'chatbot' && (
          <CyberBot
            embeddedMode={true}
            attachedEvidence={selectedArtifactForAi}
          />
        )}

        {activeTab === 'cases' && <CaseLibrary />}

        {activeTab === 'evidence' && (
          <EvidenceVault
            savedResults={savedEvidence}
            onRemoveEvidence={handleRemoveEvidence}
          />
        )}

        {activeTab === 'rules' && <RuleExplorer />}

        {activeTab === 'training' && <TrainingHub />}
      </main>

      {/* Floating AI Assistant Trigger Button & Drawer (when not in full chatbot view) */}
      {activeTab !== 'chatbot' && (
        <>
          {isFloatingBotOpen ? (
            <div className="fixed bottom-6 right-6 z-50">
              <CyberBot
                embeddedMode={false}
                onCloseFloating={() => setIsFloatingBotOpen(false)}
                attachedEvidence={selectedArtifactForAi}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsFloatingBotOpen(true)}
              className="fixed bottom-6 right-6 z-50 bg-white hover:bg-orange-600 hover:text-white text-black font-black p-4 shadow-2xl border-2 border-black flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-all hover:scale-105 cursor-pointer group"
            >
              <div className="w-6 h-6 bg-orange-600 text-white group-hover:bg-black flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <span>ASK AEGIS-AI</span>
              <span className="bg-orange-100 text-orange-800 text-[9px] font-black px-1.5 py-0.5">
                GEMINI 3.6
              </span>
            </button>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
