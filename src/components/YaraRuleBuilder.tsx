import React, { useState } from 'react';
import { 
  FileCode, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Code2,
  Terminal,
  Layers,
  Flame
} from 'lucide-react';
import { CustomYaraRule, SeverityLevel } from '../types';

const HIGH_RISK_YARA_TEMPLATES: {
  id: string;
  name: string;
  badge: 'CRITICAL' | 'HIGH_RISK';
  technique: string;
  rule: CustomYaraRule;
  samplePayload: string;
}[] = [
  {
    id: 'YARA-RANSOM-01',
    name: 'Ransomware Shadow Deletion (T1490)',
    badge: 'CRITICAL',
    technique: 'MITRE ATT&CK T1490',
    rule: {
      id: 'YARA-RANSOM-01',
      ruleName: 'Detect_Ransomware_Shadow_Deletion',
      meta: {
        author: 'CFL Incident Response Team',
        description: 'Detects execution of shadow copy deletion and recovery impairment commands.',
        date: '2026-09-29',
        severity: 'CRITICAL',
        reference: 'MITRE ATT&CK T1490',
        mitreId: 'T1490',
      },
      strings: [
        { id: '1', identifier: '$vss', value: 'vssadmin delete shadows', type: 'text', modifiers: 'nocase' },
        { id: '2', identifier: '$bcd', value: 'bcdedit /set {default} recoveryenabled no', type: 'text', modifiers: 'nocase' },
        { id: '3', identifier: '$wbadmin', value: 'wbadmin delete catalog', type: 'text', modifiers: 'nocase' },
        { id: '4', identifier: '$hex_marker', value: '4c 6f 63 6b 42 69 74', type: 'hex', modifiers: '' },
      ],
      condition: 'any of ($vss, $bcd, $wbadmin) or $hex_marker',
    },
    samplePayload: `[Sysmon Process Creation]
Image: C:\\Windows\\System32\\cmd.exe
CommandLine: cmd.exe /c vssadmin delete shadows /all /quiet & bcdedit /set {default} recoveryenabled no
User: NT AUTHORITY\\SYSTEM
Hashes: SHA256=4aa97b1897d2fa95ffecabaf6a70e7e1f40aa96ef784260d705c92c9066bf631
Note: Dropped LockBit encryption identifier tag.`
  },
  {
    id: 'YARA-COBALT-02',
    name: 'Cobalt Strike Named Pipe & Injection (T1055)',
    badge: 'CRITICAL',
    technique: 'MITRE ATT&CK T1055',
    rule: {
      id: 'YARA-COBALT-02',
      ruleName: 'Detect_CobaltStrike_NamedPipe_Injection',
      meta: {
        author: 'CFL Threat Hunting Unit',
        description: 'Detects Cobalt Strike malleable C2 named pipes and in-memory thread injection artifacts.',
        date: '2026-09-29',
        severity: 'CRITICAL',
        reference: 'MITRE ATT&CK T1055',
        mitreId: 'T1055',
      },
      strings: [
        { id: '1', identifier: '$pipe1', value: '\\\\.\\pipe\\msse-', type: 'text', modifiers: 'nocase' },
        { id: '2', identifier: '$pipe2', value: '\\\\.\\pipe\\status_', type: 'text', modifiers: 'nocase' },
        { id: '3', identifier: '$api1', value: 'VirtualAllocEx', type: 'text', modifiers: '' },
        { id: '4', identifier: '$api2', value: 'CreateRemoteThread', type: 'text', modifiers: '' },
      ],
      condition: '($pipe1 or $pipe2) or ($api1 and $api2)',
    },
    samplePayload: `[EDR Thread Injection Alert]
SourceProcess: powershell.exe (PID 5120)
TargetProcess: explorer.exe (PID 3420)
APIs: VirtualAllocEx called with PAGE_EXECUTE_READWRITE
Thread: CreateRemoteThread spawned at 0x7FFB32191000
NamedPipeCreated: \\\\.\\pipe\\msse-4401-server`
  },
  {
    id: 'YARA-MIMIKATZ-03',
    name: 'Mimikatz LSASS Password Harvesting (T1003)',
    badge: 'CRITICAL',
    technique: 'MITRE ATT&CK T1003.001',
    rule: {
      id: 'YARA-MIMIKATZ-03',
      ruleName: 'Detect_Mimikatz_LSASS_MemoryDump',
      meta: {
        author: 'CFL Incident Response Team',
        description: 'Detects execution of LSASS memory dumping utilities and Mimikatz credential extraction commands.',
        date: '2026-09-29',
        severity: 'CRITICAL',
        reference: 'MITRE ATT&CK T1003.001',
        mitreId: 'T1003.001',
      },
      strings: [
        { id: '1', identifier: '$mimi1', value: 'sekurlsa::logonpasswords', type: 'text', modifiers: 'nocase' },
        { id: '2', identifier: '$mimi2', value: 'lsadump::sam', type: 'text', modifiers: 'nocase' },
        { id: '3', identifier: '$dump', value: 'procdump -ma lsass.exe', type: 'text', modifiers: 'nocase' },
        { id: '4', identifier: '$ssp', value: 'misc::memssp', type: 'text', modifiers: 'nocase' },
      ],
      condition: 'any of ($mimi1, $mimi2, $dump, $ssp)',
    },
    samplePayload: `[Security Event ID 4688 - Process Creation]
CreatorProcessName: C:\\Windows\\System32\\cmd.exe
NewProcessName: C:\\Windows\\Temp\\procdump.exe
CommandLine: procdump -ma lsass.exe C:\\Windows\\Temp\\lsass.dmp
ParentCommandLine: powershell.exe -c "Invoke-Mimikatz; sekurlsa::logonpasswords"`
  },
  {
    id: 'YARA-WEBSHELL-04',
    name: 'China Chopper / Weevely Webshell (T1505)',
    badge: 'HIGH_RISK',
    technique: 'MITRE ATT&CK T1505.003',
    rule: {
      id: 'YARA-WEBSHELL-04',
      ruleName: 'Detect_Webshell_ChinaChopper_Eval',
      meta: {
        author: 'CFL Threat Hunting Unit',
        description: 'Detects single-line PHP eval webshells and base64 command execution parameters.',
        date: '2026-09-29',
        severity: 'HIGH_RISK',
        reference: 'MITRE ATT&CK T1505.003',
        mitreId: 'T1505.003',
      },
      strings: [
        { id: '1', identifier: '$eval', value: 'eval(@$_POST[', type: 'text', modifiers: '' },
        { id: '2', identifier: '$assert', value: 'assert($_POST[', type: 'text', modifiers: '' },
        { id: '3', identifier: '$passthru', value: 'passthru(base64_decode', type: 'text', modifiers: 'nocase' },
      ],
      condition: 'any of ($eval, $assert, $passthru)',
    },
    samplePayload: `[Web Server Access Log & Script Inspect]
File: /var/www/html/uploads/avatar_shell.php
Content: <?php @eval(@$_POST['password_cmd_exec']); ?>
Referer: http://compromised-target.com/uploads/`
  }
];

const INITIAL_RULE: CustomYaraRule = HIGH_RISK_YARA_TEMPLATES[0].rule;
const SAMPLE_PAYLOAD = HIGH_RISK_YARA_TEMPLATES[0].samplePayload;

export const YaraRuleBuilder: React.FC = () => {
  const [rule, setRule] = useState<CustomYaraRule>(INITIAL_RULE);
  const [testPayload, setTestPayload] = useState<string>(SAMPLE_PAYLOAD);
  const [testResults, setTestResults] = useState<{
    matched: boolean;
    matchedStrings: { identifier: string; value: string; count: number }[];
    details: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate standardized YARA format text
  const generateYaraText = (): string => {
    const metaBlock = `    meta:
        author = "${rule.meta.author}"
        description = "${rule.meta.description}"
        date = "${rule.meta.date}"
        severity = "${rule.meta.severity}"
        ${rule.meta.mitreId ? `mitre_technique = "${rule.meta.mitreId}"` : ''}
        ${rule.meta.reference ? `reference = "${rule.meta.reference}"` : ''}`;

    const stringsBlock = `    strings:
` + rule.strings.map(s => {
      if (s.type === 'hex') {
        return `        ${s.identifier} = { ${s.value} }`;
      } else if (s.type === 'regex') {
        return `        ${s.identifier} = /${s.value}/ ${s.modifiers}`.trim();
      } else {
        return `        ${s.identifier} = "${s.value}" ${s.modifiers}`.trim();
      }
    }).join('\n');

    const conditionBlock = `    condition:
        ${rule.condition}`;

    return `rule ${rule.ruleName || 'Custom_Threat_Rule'} {
${metaBlock}

${stringsBlock}

${conditionBlock}
}`;
  };

  // Add String Pattern
  const addStringPattern = () => {
    const nextNum = rule.strings.length + 1;
    const newStr = {
      id: Date.now().toString(),
      identifier: `$str_${nextNum}`,
      value: 'malicious_pattern',
      type: 'text' as const,
      modifiers: 'nocase',
    };
    setRule({ ...rule, strings: [...rule.strings, newStr] });
  };

  const removeStringPattern = (id: string) => {
    setRule({ ...rule, strings: rule.strings.filter(s => s.id !== id) });
  };

  const updateStringPattern = (id: string, updates: Partial<typeof rule.strings[0]>) => {
    setRule({
      ...rule,
      strings: rule.strings.map(s => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  // Test Rule In Sandbox against Sample Payload
  const executeSandboxTest = () => {
    const matchedStrings: { identifier: string; value: string; count: number }[] = [];
    const textToSearch = testPayload;

    rule.strings.forEach((str) => {
      let matchCount = 0;
      if (str.type === 'text') {
        const isNoCase = str.modifiers.includes('nocase');
        const pattern = new RegExp(str.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), isNoCase ? 'gi' : 'g');
        const matches = textToSearch.match(pattern);
        if (matches) matchCount = matches.length;
      } else if (str.type === 'regex') {
        try {
          const isNoCase = str.modifiers.includes('nocase');
          const pattern = new RegExp(str.value, isNoCase ? 'gi' : 'g');
          const matches = textToSearch.match(pattern);
          if (matches) matchCount = matches.length;
        } catch {
          // invalid regex
        }
      } else if (str.type === 'hex') {
        // Simple hex string match check
        const cleanHex = str.value.replace(/\s+/g, '');
        let decodedHex = '';
        for (let i = 0; i < cleanHex.length; i += 2) {
          decodedHex += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
        }
        if (decodedHex && textToSearch.toLowerCase().includes(decodedHex.toLowerCase())) {
          matchCount = 1;
        }
      }

      if (matchCount > 0) {
        matchedStrings.push({
          identifier: str.identifier,
          value: str.value,
          count: matchCount,
        });
      }
    });

    const isMatch = matchedStrings.length > 0;
    setTestResults({
      matched: isMatch,
      matchedStrings,
      details: isMatch 
        ? `Rule Triggered: Matched ${matchedStrings.length} detection patterns in target artifact payload.` 
        : 'No match: Target payload did not satisfy string identifiers and condition rules.',
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateYaraText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = generateYaraText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rule.ruleName || 'yara_rule'}.yar`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono mb-3">
              <FileCode className="w-3.5 h-3.5" />
              <span>HEURISTIC RULE AUTHORING & YARA COMPILER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
              YARA Rule Builder & Sandbox Tester
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Design customized heuristic detection signatures, write regex string modifiers, and test your rules in real time against sample malware scripts and forensic logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied YARA' : 'Copy YARA'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              Export .YAR File
            </button>
          </div>
        </div>
      </div>

      {/* High-Risk YARA Rule Templates Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>LOAD HIGH-RISK YARA RULE & LIVE SANDBOX PAYLOAD TEMPLATES:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {HIGH_RISK_YARA_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => {
                setRule(tmpl.rule);
                setTestPayload(tmpl.samplePayload);
                setTestResults(null);
              }}
              className={`p-2.5 rounded-xl border text-left font-mono transition text-xs flex flex-col justify-between gap-1.5 ${
                rule.id === tmpl.id
                  ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="font-bold text-slate-200 text-[11px] truncate">{tmpl.name}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  tmpl.badge === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {tmpl.badge}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">{tmpl.technique}</span>
              <span className="text-[9px] text-cyan-400">Loads Rule & Live Payload →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Builder Left, Output/Sandbox Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Form Configuration */}
        <div className="space-y-4">
          {/* Metadata Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Rule Definition & Meta
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Rule Name (identifier):</label>
                <input
                  type="text"
                  value={rule.ruleName}
                  onChange={(e) => setRule({ ...rule, ruleName: e.target.value.replace(/\s+/g, '_') })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Author:</label>
                <input
                  type="text"
                  value={rule.meta.author}
                  onChange={(e) => setRule({ ...rule, meta: { ...rule.meta, author: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Severity:</label>
                <select
                  value={rule.meta.severity}
                  onChange={(e) => setRule({ ...rule, meta: { ...rule.meta, severity: e.target.value as SeverityLevel } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="SUSPICIOUS">SUSPICIOUS</option>
                  <option value="HIGH_RISK">HIGH_RISK</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">MITRE Technique ID:</label>
                <input
                  type="text"
                  value={rule.meta.mitreId}
                  onChange={(e) => setRule({ ...rule, meta: { ...rule.meta, mitreId: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Description:</label>
                <input
                  type="text"
                  value={rule.meta.description}
                  onChange={(e) => setRule({ ...rule, meta: { ...rule.meta, description: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Strings Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Detection Strings ({rule.strings.length})
              </h2>
              <button
                onClick={addStringPattern}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono flex items-center gap-1 border border-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Pattern
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {rule.strings.map((str) => (
                <div key={str.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={str.identifier}
                      onChange={(e) => updateStringPattern(str.id, { identifier: e.target.value })}
                      className="w-28 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-amber-400 font-bold"
                    />
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={str.type}
                        onChange={(e) => updateStringPattern(str.id, { type: e.target.value as any })}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-slate-300"
                      >
                        <option value="text">Text ("")</option>
                        <option value="hex">Hex ({'{}'})</option>
                        <option value="regex">Regex (//)</option>
                      </select>
                      <button
                        onClick={() => removeStringPattern(str.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={str.type === 'hex' ? 'e.g. 48 89 e5' : 'Search value or expression...'}
                      value={str.value}
                      onChange={(e) => updateStringPattern(str.id, { value: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono text-emerald-300"
                    />
                    {str.type !== 'hex' && (
                      <input
                        type="text"
                        placeholder="modifiers (nocase, ascii)"
                        value={str.modifiers}
                        onChange={(e) => updateStringPattern(str.id, { modifiers: e.target.value })}
                        className="w-32 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-[11px] font-mono text-slate-400"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Condition Logic */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Evaluation Condition Logic
            </label>
            <input
              type="text"
              value={rule.condition}
              onChange={(e) => setRule({ ...rule, condition: e.target.value })}
              placeholder="e.g. any of them, or all of ($a*)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-purple-300 font-bold focus:outline-none focus:border-cyan-500"
            />
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono text-slate-500">
              <span>Presets:</span>
              <button 
                onClick={() => setRule({ ...rule, condition: 'all of them' })}
                className="hover:text-cyan-300 underline"
              >
                all of them
              </button>
              •
              <button 
                onClick={() => setRule({ ...rule, condition: 'any of them' })}
                className="hover:text-cyan-300 underline"
              >
                any of them
              </button>
              •
              <button 
                onClick={() => setRule({ ...rule, condition: '2 of them' })}
                className="hover:text-cyan-300 underline"
              >
                2 of them
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Compiled YARA View & Sandbox Tester */}
        <div className="space-y-4">
          
          {/* Compiled YARA Code Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                Compiled YARA Rule Definition
              </label>
            </div>
            <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-64">
              {generateYaraText()}
            </pre>
          </div>

          {/* Sandbox Live Tester */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Sandbox Test Execution
              </label>
              <button
                onClick={executeSandboxTest}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
              >
                <Play className="w-3.5 h-3.5" /> Execute Test
              </button>
            </div>

            <textarea
              rows={5}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              placeholder="Paste test log, script, or binary string to evaluate against this YARA rule..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />

            {/* Test Results Banner */}
            {testResults && (
              <div className={`p-4 rounded-xl border transition ${
                testResults.matched 
                  ? 'bg-rose-950/20 border-rose-500/40' 
                  : 'bg-emerald-950/20 border-emerald-500/40'
              }`}>
                <div className="flex items-center gap-2 font-mono text-xs font-bold mb-1">
                  {testResults.matched ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span className="text-rose-400">YARA RULE MATCH CONFIRMED (TRIGGERED)</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">PASSED: NO STRINGS SATISFIED</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  {testResults.details}
                </p>

                {testResults.matchedStrings.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                    {testResults.matchedStrings.map((ms, idx) => (
                      <span key={idx} className="text-[11px] font-mono bg-slate-950 text-amber-300 px-2 py-0.5 rounded border border-slate-800">
                        {ms.identifier} ({ms.count} hit{ms.count > 1 ? 's' : ''})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
