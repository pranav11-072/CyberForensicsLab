export type ModuleType = 'phishing' | 'malware' | 'fraud';

export type SeverityLevel = 'SAFE' | 'LOW' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL';

export type KillChainPhase =
  | 'RECONNAISSANCE'
  | 'WEAPONIZATION'
  | 'DELIVERY'
  | 'EXPLOITATION'
  | 'INSTALLATION'
  | 'COMMAND_CONTROL'
  | 'ACTIONS_OBJECTIVES';

export interface ForensicRule {
  id: string;
  name: string;
  module: ModuleType;
  category: string;
  pattern: RegExp | string;
  weight: number; // 5 to 35
  description: string;
  indicatorName: string;
  mitigation: string;
  legalSections: string[];
}

export interface RuleMatch {
  ruleId: string;
  ruleName: string;
  category: string;
  weight: number;
  description: string;
  indicatorName: string;
  mitigation: string;
  legalSections: string[];
  matchedText?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  module: ModuleType;
  inputTitle: string;
  rawInput: string;
  threatScore: number; // 0 - 100
  severity: SeverityLevel;
  matches: RuleMatch[];
  summary: string;
  extractedUrls?: string[];
  extractedDomains?: string[];
  extractedEmails?: string[];
  extractedIPs?: string[];
  extractedHashes?: string[];
  investigationSteps: string[];
  legalSections: string[];
  hashes?: {
    md5: string;
    sha256: string;
  };
}

export interface SamplePreset {
  id: string;
  module: ModuleType;
  title: string;
  subtitle: string;
  content: string;
  description: string;
  expectedVerdict: SeverityLevel;
}

export interface CyberCase {
  id: string;
  title: string;
  category: string;
  year: string;
  location: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  lossImpact: string;
  summary: string;
  timeline: { time: string; event: string }[];
  attackVectors: string[];
  forensicArtifacts: string[];
  mitigationLessons: string[];
  legalSections: string[];
}

export interface EvidenceLogItem {
  id: string;
  caseId: string;
  evidenceName: string;
  source: string;
  timestamp: string;
  investigatorName: string;
  sha256Hash: string;
  md5Hash: string;
  analysisResult: AnalysisResult;
  notes: string;
  chainOfCustody: { date: string; action: string; handledBy: string }[];
}

export interface QuizQuestion {
  id: string;
  module: ModuleType;
  title: string;
  scenario: string;
  codeSnippet?: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  legalContext?: string;
}

// TIMELINE TYPES
export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  phase: KillChainPhase;
  severity: SeverityLevel;
  source: string;
  mitreTactic?: string;
  mitreTechniqueId?: string;
  artifacts?: string[];
  investigator?: string;
}

// NETWORK INSPECTOR TYPES
export interface NetworkLogEntry {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort?: number;
  destIp: string;
  destPort: number;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'DNS' | 'ICMP' | 'OTHER';
  length?: number;
  domain?: string;
  uri?: string;
  method?: string;
  info?: string;
  anomalousScore: number;
  reasons: string[];
  severity: SeverityLevel;
}

// HASH & IOC TYPES
export interface KnownThreatIOC {
  id: string;
  name: string;
  family: string;
  type: 'RANSOMWARE' | 'TROJAN' | 'BOTNET' | 'SPYWARE' | 'APT_PAYLOAD' | 'CRYPTOJACKER' | 'STEALER';
  threatActor?: string;
  md5: string;
  sha1: string;
  sha256: string;
  description: string;
  firstSeen: string;
  severity: SeverityLevel;
  mitreTechniques: string[];
  indicators: string[];
  remediation: string;
}

// YARA & CUSTOM RULES TYPES
export interface CustomYaraRule {
  id: string;
  ruleName: string;
  meta: {
    author: string;
    description: string;
    date: string;
    severity: SeverityLevel;
    reference?: string;
    mitreId?: string;
  };
  strings: {
    id: string;
    identifier: string;
    value: string;
    type: 'text' | 'hex' | 'regex';
    modifiers: string; // e.g. 'nocase', 'wide ascii'
  }[];
  condition: string;
  rawYaraOutput?: string;
}
