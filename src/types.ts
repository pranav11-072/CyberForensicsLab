export type ModuleType = 'phishing' | 'malware' | 'fraud';

export type SeverityLevel = 'SAFE' | 'LOW' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL';

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
