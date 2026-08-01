import { FORENSIC_RULES } from '../data/rules';
import { AnalysisResult, ModuleType, RuleMatch, SeverityLevel } from '../types';
import { calculateMD5Simulated, calculateSHA256, extractIOCs } from './crypto';

export async function runForensicAnalysis(
  input: string,
  moduleType: ModuleType,
  title: string = 'Custom Artifact'
): Promise<AnalysisResult> {
  const iocs = extractIOCs(input);
  const relevantRules = FORENSIC_RULES.filter(r => r.module === moduleType);

  const matches: RuleMatch[] = [];
  let scoreSum = 0;

  for (const rule of relevantRules) {
    let matchedText: string | undefined = undefined;

    if (rule.pattern instanceof RegExp) {
      const match = input.match(rule.pattern);
      if (match) {
        matchedText = match[0];
      }
    } else if (typeof rule.pattern === 'string') {
      if (input.toLowerCase().includes(rule.pattern.toLowerCase())) {
        matchedText = rule.pattern;
      }
    }

    if (matchedText) {
      matches.push({
        ruleId: rule.id,
        ruleName: rule.name,
        category: rule.category,
        weight: rule.weight,
        description: rule.description,
        indicatorName: rule.indicatorName,
        mitigation: rule.mitigation,
        legalSections: rule.legalSections,
        matchedText,
      });
      scoreSum += rule.weight;
    }
  }

  // Cap threat score at 100
  const threatScore = Math.min(100, Math.round(scoreSum));

  let severity: SeverityLevel = 'SAFE';
  if (threatScore >= 85) severity = 'CRITICAL';
  else if (threatScore >= 60) severity = 'HIGH_RISK';
  else if (threatScore >= 35) severity = 'SUSPICIOUS';
  else if (threatScore >= 15) severity = 'LOW';
  else severity = 'SAFE';

  // Aggregate legal sections
  const legalSectionsSet = new Set<string>();
  matches.forEach(m => m.legalSections.forEach(ls => legalSectionsSet.add(ls)));
  const legalSections = Array.from(legalSectionsSet);

  // Generate investigation steps based on module & severity
  const investigationSteps: string[] = [];
  if (matches.length === 0) {
    investigationSteps.push('No known threat signatures matched rule database.');
    investigationSteps.push('Artifact displays normal structural characteristics.');
    investigationSteps.push('Retain artifact in archive for baseline comparison.');
  } else {
    investigationSteps.push(`Isolate source system and flag ${matches.length} matched indicator(s).`);
    investigationSteps.push('Cross-reference extracted URLs, IPs, and hashes against threat intelligence databases.');
    investigationSteps.push('Capture volatile memory and preserve raw communication logs with SHA-256 verification.');
    
    if (moduleType === 'phishing') {
      investigationSteps.push('Perform email gateway domain lookup and inspect SPF/DKIM/DMARC headers.');
      investigationSteps.push('Notify internal IT Security desk to sinkhole malicious link domains.');
    } else if (moduleType === 'malware') {
      investigationSteps.push('Analyze sample in isolated sandbox environment (Cuckoo/Any.Run).');
      investigationSteps.push('Check startup persistence registry keys (HKCU\\Run) and scheduled tasks.');
    } else if (moduleType === 'fraud') {
      investigationSteps.push('Freeze affected payment handles/cards and file report with National Cyber Crime Portal (1930).');
      investigationSteps.push('Document transaction IDs, bank accounts, and chat screenshots in Evidence Log.');
    }
  }

  const sha256 = await calculateSHA256(input);
  const md5 = calculateMD5Simulated(input);

  const summary = generateSummaryText(moduleType, severity, matches.length, threatScore);

  return {
    id: `ANALYSIS-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    module: moduleType,
    inputTitle: title || 'Artifact Inspection',
    rawInput: input,
    threatScore,
    severity,
    matches,
    summary,
    extractedUrls: iocs.urls,
    extractedDomains: iocs.domains,
    extractedEmails: iocs.emails,
    extractedIPs: iocs.ips,
    investigationSteps,
    legalSections,
    hashes: {
      sha256,
      md5,
    },
  };
}

function generateSummaryText(
  module: ModuleType,
  severity: SeverityLevel,
  matchCount: number,
  score: number
): string {
  const moduleLabel = module.toUpperCase();
  if (severity === 'SAFE') {
    return `${moduleLabel} Analysis complete. Artifact scored ${score}/100 with zero threat triggers. Deemed SAFE.`;
  }
  if (severity === 'LOW') {
    return `${moduleLabel} Analysis flagged ${matchCount} low-severity indicator(s) (Score: ${score}/100). Exercise standard caution.`;
  }
  if (severity === 'SUSPICIOUS') {
    return `${moduleLabel} Analysis identified ${matchCount} suspicious pattern(s) (Score: ${score}/100). Further forensic verification recommended.`;
  }
  if (severity === 'HIGH_RISK') {
    return `HIGH RISK DETECTED: ${moduleLabel} inspection triggered ${matchCount} malicious rule signature(s) (Score: ${score}/100). Immediate mitigation required.`;
  }
  return `CRITICAL THREAT ALERT: ${moduleLabel} inspection triggered ${matchCount} high-weight malicious signature(s) (Score: ${score}/100). Incident response protocol should be activated immediately.`;
}
