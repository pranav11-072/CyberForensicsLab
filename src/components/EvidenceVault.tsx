import React, { useState } from 'react';
import {
  FileCheck,
  Hash,
  Download,
  Copy,
  Check,
  Scale,
  Clock,
  Printer,
  Shield,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileJson,
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { calculateSHA256, calculateMD5Simulated, generateSection65BCertificate } from '../utils/crypto';
import {
  exportResultToJson,
  exportResultToCsv,
  exportMultipleResultsToJson,
  exportMultipleResultsToCsv,
} from '../utils/exportUtils';

interface EvidenceVaultProps {
  savedResults: AnalysisResult[];
  onRemoveEvidence: (id: string) => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({ savedResults, onRemoveEvidence }) => {
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(
    savedResults.length > 0 ? savedResults[0] : null
  );

  const [investigatorName, setInvestigatorName] = useState('Analyst / Examiner');
  const [caseReference, setCaseReference] = useState('CFL-2026-001');

  // Interactive Hash Calculator state
  const [hashInputText, setHashInputText] = useState('');
  const [computedSha256, setComputedSha256] = useState('');
  const [computedMd5, setComputedMd5] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCert, setCopiedCert] = useState(false);

  const handleComputeHash = async () => {
    if (!hashInputText.trim()) return;
    const sha = await calculateSHA256(hashInputText);
    const md5 = calculateMD5Simulated(hashInputText);
    setComputedSha256(sha);
    setComputedMd5(md5);
  };

  const handleCopyCertText = (certText: string) => {
    navigator.clipboard.writeText(certText);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  const handlePrintCert = () => {
    window.print();
  };

  const activeCertText = selectedResult
    ? generateSection65BCertificate(
        caseReference,
        investigatorName,
        selectedResult.inputTitle,
        `Cyber Forensics Lab Local Ingestion Node (${selectedResult.module.toUpperCase()})`,
        selectedResult.hashes?.sha256 || 'N/A',
        new Date(selectedResult.timestamp).toLocaleString('en-IN'),
        `Analysis triggered ${selectedResult.matches.length} rule signature(s). Severity rated as ${selectedResult.severity} (${selectedResult.threatScore}/100).`
      )
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black">
            <FileCheck className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-white">
              Evidence Chain Vault & Sec 65B<span className="text-orange-600">.</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Manage saved forensic logs, calculate cryptographic hashes & generate official Section 65B Evidence Certificates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5">
            {savedResults.length} VAULTED ARTIFACTS
          </span>
          {savedResults.length > 0 && (
            <>
              <button
                onClick={() => exportMultipleResultsToJson(savedResults)}
                className="px-3 py-1.5 bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer"
                title="Export all vaulted artifacts as a single JSON file"
              >
                <FileJson className="w-3.5 h-3.5 text-orange-500" />
                <span>EXPORT ALL (JSON)</span>
              </button>
              <button
                onClick={() => exportMultipleResultsToCsv(savedResults)}
                className="px-3 py-1.5 bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer"
                title="Export all vaulted artifacts as CSV spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXPORT ALL (CSV)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Interactive Hash Calculator */}
      <div className="bg-[#0E0E0E] border border-zinc-900 p-6 space-y-4 font-mono">
        <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
          <Hash className="w-4 h-4 text-orange-600" />
          <span>CRYPTOGRAPHIC HASH CALCULATOR (SHA-256 / MD5)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input
            type="text"
            value={hashInputText}
            onChange={(e) => setHashInputText(e.target.value)}
            placeholder="Type or paste any string/filename/artifact text to calculate instant hash..."
            className="md:col-span-9 bg-[#050505] border border-zinc-800 px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-orange-600 placeholder:text-zinc-600 font-mono"
          />
          <button
            onClick={handleComputeHash}
            disabled={!hashInputText.trim()}
            className="md:col-span-3 py-3 bg-white hover:bg-orange-600 hover:text-white disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-black uppercase text-[10px] tracking-widest transition-colors cursor-pointer"
          >
            GENERATE HASHES
          </button>
        </div>

        {computedSha256 && (
          <div className="bg-[#050505] border border-zinc-800 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
              <span>CALCULATED CRYPTOGRAPHIC HASHES:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`SHA256: ${computedSha256}\nMD5: ${computedMd5}`);
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                className="text-orange-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'COPIED' : 'COPY HASHES'}</span>
              </button>
            </div>
            <div className="space-y-1">
              <div className="text-zinc-300 break-all bg-zinc-900/60 p-2 border border-zinc-800">
                <span className="text-orange-500 font-bold">SHA-256:</span> {computedSha256}
              </div>
              <div className="text-zinc-300 break-all bg-zinc-900/60 p-2 border border-zinc-800">
                <span className="text-emerald-400 font-bold">MD5:</span> {computedMd5}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Evidence Vault Layout */}
      {savedResults.length === 0 ? (
        <div className="bg-[#0E0E0E] border border-zinc-900 p-12 text-center space-y-3 flex flex-col items-center justify-center">
          <Shield className="w-12 h-12 text-zinc-700" />
          <div className="font-mono text-xs text-white font-black uppercase tracking-widest">NO VAULTED EVIDENCE ARTIFACTS YET</div>
          <p className="text-xs text-zinc-500 max-w-md font-medium">
            Run an analysis in the <span className="text-orange-500 font-mono">Phishing</span>, <span className="text-white font-mono">Malware</span>, or <span className="text-orange-400 font-mono">Fraud</span> modules and click &quot;SAVE TO VAULT&quot; to generate official Section 65B Evidence Certificates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Saved Items Sidebar List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-between">
              <span>SAVED EVIDENCE LOGS</span>
              <span>{savedResults.length} ITEMS</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {savedResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedResult(item)}
                  className={`p-4 border font-mono text-xs cursor-pointer transition-colors space-y-2 ${
                    selectedResult?.id === item.id
                      ? 'bg-[#0E0E0E] border-orange-600'
                      : 'bg-[#0E0E0E] border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                        item.severity === 'CRITICAL'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : item.severity === 'HIGH_RISK'
                          ? 'bg-orange-950 text-orange-400 border border-orange-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {item.severity}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveEvidence(item.id);
                        if (selectedResult?.id === item.id) {
                          setSelectedResult(null);
                        }
                      }}
                      className="text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="font-bold text-white uppercase tracking-tight truncate">{item.inputTitle}</div>

                  <div className="flex items-center justify-between text-[9px] text-zinc-500">
                    <span className="uppercase text-orange-500 font-bold">{item.module}</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 65B Certificate Viewer (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {selectedResult ? (
              <div className="bg-[#0E0E0E] border border-zinc-900 p-6 space-y-6">
                {/* Certificate Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900 pb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    <h2 className="text-base font-black font-mono tracking-tight uppercase text-white">
                      Section 65B Certificate
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
                    <button
                      onClick={() => handleCopyCertText(activeCertText)}
                      className="px-3 py-1.5 bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedCert ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCert ? 'COPIED' : 'COPY CERTIFICATE'}</span>
                    </button>
                    <button
                      onClick={() => exportResultToJson(selectedResult)}
                      className="px-3 py-1.5 bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download artifact raw data as JSON"
                    >
                      <FileJson className="w-3.5 h-3.5 text-orange-500" />
                      <span>JSON ARTIFACT</span>
                    </button>
                    <button
                      onClick={() => exportResultToCsv(selectedResult)}
                      className="px-3 py-1.5 bg-[#050505] hover:border-orange-600 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download artifact details as CSV"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CSV ARTIFACT</span>
                    </button>
                    <button
                      onClick={handlePrintCert}
                      className="px-3 py-1.5 bg-white hover:bg-orange-600 hover:text-white text-black font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PRINT / REPORT</span>
                    </button>
                  </div>
                </div>

                {/* Case Metadata Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div>
                    <label className="text-zinc-500 text-[10px] font-bold block mb-1 uppercase tracking-wider">CASE REFERENCE ID:</label>
                    <input
                      type="text"
                      value={caseReference}
                      onChange={(e) => setCaseReference(e.target.value)}
                      className="w-full bg-[#050505] border border-zinc-800 p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-500 text-[10px] font-bold block mb-1 uppercase tracking-wider">EXAMINER / INVESTIGATOR NAME:</label>
                    <input
                      type="text"
                      value={investigatorName}
                      onChange={(e) => setInvestigatorName(e.target.value)}
                      className="w-full bg-[#050505] border border-zinc-800 p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>

                {/* Certificate Display Area */}
                <div className="bg-[#050505] border border-zinc-800 p-5 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed space-y-4 border-l-4 border-l-purple-500">
                  {activeCertText}
                </div>

                {/* Raw Artifact Details & Hashes */}
                <div className="bg-[#050505] border border-zinc-800 p-4 space-y-2 font-mono text-xs">
                  <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-wider">DIGITAL ARTIFACT CRYPTOGRAPHIC INTEGRITY:</div>
                  <div className="text-zinc-300 break-all bg-zinc-900/60 p-2 border border-zinc-800">
                    <span className="text-orange-500 font-bold">SHA-256:</span> {selectedResult.hashes?.sha256}
                  </div>
                  <div className="text-zinc-300 break-all bg-zinc-900/60 p-2 border border-zinc-800">
                    <span className="text-emerald-400 font-bold">MD5:</span> {selectedResult.hashes?.md5}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0E0E0E] border border-zinc-900 p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
                <FileText className="w-12 h-12 text-zinc-700" />
                <div className="font-mono text-xs text-white font-black uppercase tracking-widest">SELECT A VAULTED ITEM</div>
                <p className="text-xs text-zinc-500 font-medium">
                  Select an item from the left sidebar to generate and view its official Section 65B Digital Evidence Certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
