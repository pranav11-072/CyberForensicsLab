import { AnalysisResult } from '../types';

/**
 * Escapes CSV field value properly for RFC 4180 compliance
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const stringified = String(val).replace(/"/g, '""');
  return `"${stringified}"`;
}

/**
 * Triggers a browser file download from string content
 */
export function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export an individual scan result artifact as JSON
 */
export function exportResultToJson(result: AnalysisResult) {
  const filename = `cfl-forensic-artifact-${result.module}-${result.id.slice(0, 8)}.json`;
  const jsonContent = JSON.stringify(result, null, 2);
  downloadFile(filename, jsonContent, 'application/json');
}

/**
 * Export an individual scan result artifact as CSV
 */
export function exportResultToCsv(result: AnalysisResult) {
  const filename = `cfl-forensic-artifact-${result.module}-${result.id.slice(0, 8)}.csv`;

  const headers = [
    'Artifact ID',
    'Timestamp',
    'Module',
    'Title',
    'Threat Score',
    'Severity',
    'SHA-256',
    'MD5',
    'Matched Rules Count',
    'Matched Rules List',
    'Extracted URLs',
    'Extracted IPs',
    'Extracted Domains',
    'Extracted Hashes',
    'Extracted Emails',
    'Legal Provisions',
    'Executive Summary',
  ];

  const matchedRulesList = (result.matches || [])
    .map((m) => `${m.ruleName} [${m.category}, Weight:${m.weight}]`)
    .join('; ');

  const row = [
    escapeCsvValue(result.id),
    escapeCsvValue(result.timestamp),
    escapeCsvValue(result.module),
    escapeCsvValue(result.inputTitle),
    escapeCsvValue(result.threatScore),
    escapeCsvValue(result.severity),
    escapeCsvValue(result.hashes?.sha256 || ''),
    escapeCsvValue(result.hashes?.md5 || ''),
    escapeCsvValue(result.matches?.length || 0),
    escapeCsvValue(matchedRulesList),
    escapeCsvValue((result.extractedUrls || []).join('; ')),
    escapeCsvValue((result.extractedIPs || []).join('; ')),
    escapeCsvValue((result.extractedDomains || []).join('; ')),
    escapeCsvValue((result.extractedHashes || []).join('; ')),
    escapeCsvValue((result.extractedEmails || []).join('; ')),
    escapeCsvValue((result.legalSections || []).join('; ')),
    escapeCsvValue(result.summary),
  ];

  const csvContent = [headers.map(escapeCsvValue).join(','), row.join(',')].join('\n');
  downloadFile(filename, csvContent, 'text/csv;charset=utf-8;');
}

/**
 * Export multiple scan result artifacts as a single JSON array file
 */
export function exportMultipleResultsToJson(results: AnalysisResult[]) {
  const filename = `cfl-vault-evidence-export-${new Date().toISOString().slice(0, 10)}.json`;
  const jsonContent = JSON.stringify(results, null, 2);
  downloadFile(filename, jsonContent, 'application/json');
}

/**
 * Export multiple scan result artifacts as a CSV table
 */
export function exportMultipleResultsToCsv(results: AnalysisResult[]) {
  const filename = `cfl-vault-evidence-export-${new Date().toISOString().slice(0, 10)}.csv`;

  const headers = [
    'Artifact ID',
    'Timestamp',
    'Module',
    'Title',
    'Threat Score',
    'Severity',
    'SHA-256',
    'MD5',
    'Matched Rules Count',
    'Matched Rules List',
    'Extracted URLs',
    'Extracted IPs',
    'Extracted Domains',
    'Legal Provisions',
    'Executive Summary',
  ];

  const rows = results.map((result) => {
    const matchedRulesList = (result.matches || [])
      .map((m) => `${m.ruleName} [${m.category}]`)
      .join('; ');

    return [
      escapeCsvValue(result.id),
      escapeCsvValue(result.timestamp),
      escapeCsvValue(result.module),
      escapeCsvValue(result.inputTitle),
      escapeCsvValue(result.threatScore),
      escapeCsvValue(result.severity),
      escapeCsvValue(result.hashes?.sha256 || ''),
      escapeCsvValue(result.hashes?.md5 || ''),
      escapeCsvValue(result.matches?.length || 0),
      escapeCsvValue(matchedRulesList),
      escapeCsvValue((result.extractedUrls || []).join('; ')),
      escapeCsvValue((result.extractedIPs || []).join('; ')),
      escapeCsvValue((result.extractedDomains || []).join('; ')),
      escapeCsvValue((result.legalSections || []).join('; ')),
      escapeCsvValue(result.summary),
    ].join(',');
  });

  const csvContent = [headers.map(escapeCsvValue).join(','), ...rows].join('\n');
  downloadFile(filename, csvContent, 'text/csv;charset=utf-8;');
}
