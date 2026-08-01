import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  HelpCircle,
  Scale,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import { FORENSIC_QUIZ } from '../data/quiz';

export const TrainingHub: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = FORENSIC_QUIZ[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (selectedOption !== null) return; // prevent re-clicking

    setSelectedOption(optionId);
    const selected = currentQ.options.find((o) => o.id === optionId);
    if (selected?.isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnsweredCount((prev) => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentIndex < FORENSIC_QUIZ.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredCount(0);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">
            <GraduationCap className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-white">
              Cyber Forensics Triage Quiz<span className="text-orange-600">.</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Test & sharpen your digital forensics analysis skills across 10 real-world threat scenarios.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest">
          <div className="bg-[#0E0E0E] border border-zinc-800 px-3 py-1.5 text-zinc-300">
            SCORE: <span className="text-orange-500 font-black">{score}</span> / {FORENSIC_QUIZ.length}
          </div>
          <button
            onClick={handleRestart}
            className="p-2 bg-[#0E0E0E] hover:border-orange-600 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
            title="Restart Quiz"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isCompleted ? (
        <div className="bg-[#0E0E0E] border border-zinc-900 p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-white text-black flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-orange-600" />
          </div>

          <div className="space-y-2 font-mono">
            <h2 className="text-2xl font-black tracking-tight uppercase text-white">TRIAGE ASSESSMENT COMPLETE</h2>
            <div className="text-4xl font-black text-orange-500 tracking-tighter">
              {score} / {FORENSIC_QUIZ.length} ({Math.round((score / FORENSIC_QUIZ.length) * 100)}%)
            </div>
            <p className="text-xs text-zinc-400 max-w-md mx-auto font-sans leading-relaxed pt-2">
              {score >= 8
                ? 'Outstanding performance! You demonstrate expert-level threat identification skills.'
                : score >= 5
                ? 'Good work! Review the rule explorer to strengthen your knowledge on tricky edge cases.'
                : 'Keep practicing! Focus on email headers, process logs, and legal statutes.'}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-4 bg-white hover:bg-orange-600 hover:text-white text-black font-black font-mono text-[10px] uppercase tracking-widest inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY FORENSIC QUIZ</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] border border-zinc-900 p-6 md:p-8 space-y-6 font-mono text-xs">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              <span>QUESTION {currentIndex + 1} OF {FORENSIC_QUIZ.length}</span>
              <span className="text-orange-500 font-black">[{currentQ.module}]</span>
            </div>
            <div className="w-full bg-[#050505] h-2 border border-zinc-800">
              <div
                className="h-full bg-orange-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / FORENSIC_QUIZ.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Title & Scenario */}
          <div className="space-y-3">
            <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-tight">
              <HelpCircle className="w-4 h-4 text-orange-600 shrink-0" />
              <span>{currentQ.title}</span>
            </h2>

            <p className="text-zinc-300 leading-relaxed text-xs font-sans">
              {currentQ.scenario}
            </p>

            {currentQ.codeSnippet && (
              <div className="bg-[#050505] border border-zinc-800 p-4 text-[11px] text-zinc-100 font-mono whitespace-pre-wrap break-all border-l-4 border-l-orange-600">
                {currentQ.codeSnippet}
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const hasAnswered = selectedOption !== null;

              let btnStyle = 'bg-[#050505] border-zinc-800 hover:border-orange-600 text-zinc-200 cursor-pointer';
              if (hasAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                } else {
                  btnStyle = 'bg-[#050505] border-zinc-900 text-zinc-600 opacity-50';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 border text-xs font-mono transition-colors flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="font-black text-orange-500 uppercase">[{opt.id}]</span>
                  <span className="flex-1 leading-relaxed font-sans">{opt.text}</span>
                  {hasAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {hasAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation Box */}
          {selectedOption !== null && (
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="bg-[#050505] border border-zinc-800 p-4 space-y-2">
                <div className="text-orange-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>TECHNICAL ANALYSIS & EXPLANATION</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed font-sans">{currentQ.explanation}</p>
                {currentQ.legalContext && (
                  <div className="text-[10px] text-purple-300 pt-1 flex items-center gap-1 font-mono uppercase tracking-wider font-bold">
                    <Scale className="w-3.5 h-3.5 text-purple-400" />
                    <span>Statute Reference: {currentQ.legalContext}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3.5 bg-white hover:bg-orange-600 hover:text-white text-black font-black font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{currentIndex < FORENSIC_QUIZ.length - 1 ? 'NEXT QUESTION' : 'VIEW FINAL SCORE'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
