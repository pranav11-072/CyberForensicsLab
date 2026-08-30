// Digital Forensics Deobfuscation & Decoders Engine

/**
 * Calculates Shannon Entropy of a string to detect encrypted or packed payloads
 * High entropy (> 5.2 for text, > 7.0 for binary strings) indicates encryption/obfuscation.
 */
export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const frequencies: Record<string, number> = {};
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

/**
 * Base64 decoder supporting both standard ASCII/UTF-8 and Unicode (UTF-16LE, PowerShell format)
 */
export function decodeBase64Safe(input: string): { output: string; encoding: 'ascii' | 'utf16le' | 'invalid' } {
  try {
    const sanitized = input.trim().replace(/\s+/g, '');
    const binaryString = atob(sanitized);

    // Check if it looks like UTF-16LE (PowerShell -EncodedCommand creates null bytes between ASCII chars)
    let isUtf16Le = false;
    if (binaryString.length >= 4 && binaryString.length % 2 === 0) {
      let nullCount = 0;
      for (let i = 1; i < binaryString.length; i += 2) {
        if (binaryString.charCodeAt(i) === 0) nullCount++;
      }
      if (nullCount / (binaryString.length / 2) > 0.7) {
        isUtf16Le = true;
      }
    }

    if (isUtf16Le) {
      let decodedUtf16 = '';
      for (let i = 0; i < binaryString.length; i += 2) {
        const charCode = binaryString.charCodeAt(i) | (binaryString.charCodeAt(i + 1) << 8);
        decodedUtf16 += String.fromCharCode(charCode);
      }
      return { output: decodedUtf16, encoding: 'utf16le' };
    }

    // Try standard UTF-8 decoding
    try {
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const utf8Decoder = new TextDecoder('utf-8');
      const decodedUtf8 = utf8Decoder.decode(bytes);
      return { output: decodedUtf8, encoding: 'ascii' };
    } catch {
      return { output: binaryString, encoding: 'ascii' };
    }
  } catch {
    return { output: '[Error: Invalid Base64 payload or padding]', encoding: 'invalid' };
  }
}

export function encodeBase64(input: string): string {
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    return btoa(input);
  }
}

/**
 * Hexadecimal Converter
 */
export function decodeHex(hexStr: string): string {
  try {
    const cleaned = hexStr.replace(/0x|\s+|\\x|,|:/g, '');
    if (cleaned.length % 2 !== 0) return '[Error: Hex string must have even length]';
    let result = '';
    for (let i = 0; i < cleaned.length; i += 2) {
      const byte = parseInt(cleaned.substr(i, 2), 16);
      if (isNaN(byte)) return '[Error: Non-hexadecimal character encountered]';
      result += String.fromCharCode(byte);
    }
    return result;
  } catch {
    return '[Error: Failed to parse Hex]';
  }
}

export function encodeHex(input: string, format: 'space' | '0x' | 'slashX' | 'raw' = 'space'): string {
  const bytes = [];
  for (let i = 0; i < input.length; i++) {
    const h = input.charCodeAt(i).toString(16).padStart(2, '0');
    bytes.push(h);
  }
  if (format === '0x') return bytes.map(b => '0x' + b).join(' ');
  if (format === 'slashX') return bytes.map(b => '\\x' + b).join('');
  if (format === 'space') return bytes.join(' ');
  return bytes.join('');
}

/**
 * Binary Converter
 */
export function decodeBinary(binStr: string): string {
  try {
    const clean = binStr.replace(/\s+/g, '');
    if (clean.length % 8 !== 0) return '[Error: Binary stream length must be multiple of 8 bits]';
    let output = '';
    for (let i = 0; i < clean.length; i += 8) {
      const byte = parseInt(clean.substr(i, 8), 2);
      if (isNaN(byte)) return '[Error: Invalid binary digit]';
      output += String.fromCharCode(byte);
    }
    return output;
  } catch {
    return '[Error: Failed to decode binary string]';
  }
}

export function encodeBinary(input: string): string {
  return Array.from(input)
    .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

/**
 * ROT13 / Caesar Cipher with configurable shift
 */
export function rot13(input: string, shift: number = 13): string {
  const normShift = ((shift % 26) + 26) % 26;
  return input.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code >= 65 && code <= 90 ? 65 : 97;
    return String.fromCharCode(((code - base + normShift) % 26) + base);
  });
}

/**
 * URL / IP Defanger & Refanger for Safe Threat Sharing
 */
export function defangThreatIndicators(input: string): string {
  let defanged = input;
  // Defang protocols
  defanged = defanged.replace(/https:\/\//gi, 'hxxps://');
  defanged = defanged.replace(/http:\/\//gi, 'hxxp://');
  defanged = defanged.replace(/ftp:\/\//gi, 'fxp://');
  // Defang IP and domain dots
  defanged = defanged.replace(/(\w)\.(\w)/g, '$1[.]$2');
  // Defang email @
  defanged = defanged.replace(/(\w)@(\w)/g, '$1[@]$2');
  return defanged;
}

export function refangThreatIndicators(input: string): string {
  let refanged = input;
  refanged = refanged.replace(/hxxps:\/\//gi, 'https://');
  refanged = refanged.replace(/hxxp:\/\//gi, 'http://');
  refanged = refanged.replace(/fxp:\/\//gi, 'ftp://');
  refanged = refanged.replace(/\[\.\]/g, '.');
  refanged = refanged.replace(/\[\.\]/g, '.');
  refanged = refanged.replace(/\[@\]/g, '@');
  return refanged;
}

/**
 * Single-Byte XOR Decryption & Key Brute-Forcer
 */
export function xorDecode(inputHexOrStr: string, key: number): string {
  // If input looks like hex (e.g. 4a 5b 6c), parse as bytes
  const isHex = /^(?:[0-9a-fA-F]{2}[\s,:\\]*)+$/.test(inputHexOrStr.trim());
  let bytes: number[] = [];
  if (isHex && inputHexOrStr.length > 3) {
    const clean = inputHexOrStr.replace(/0x|\s+|\\x|,|:/g, '');
    for (let i = 0; i < clean.length; i += 2) {
      bytes.push(parseInt(clean.substr(i, 2), 16));
    }
  } else {
    bytes = Array.from(inputHexOrStr).map(c => c.charCodeAt(0));
  }

  return bytes.map(b => String.fromCharCode(b ^ key)).join('');
}

export function bruteForceXor(input: string): { key: number; hexKey: string; preview: string; printableRatio: number }[] {
  const results = [];
  for (let k = 1; k < 256; k++) {
    const text = xorDecode(input, k);
    // Calculate printable ASCII ratio
    let printable = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
        printable++;
      }
    }
    const ratio = text.length > 0 ? printable / text.length : 0;
    if (ratio >= 0.65) {
      results.push({
        key: k,
        hexKey: '0x' + k.toString(16).padStart(2, '0').toUpperCase(),
        preview: text,
        printableRatio: Number((ratio * 100).toFixed(1)),
      });
    }
  }
  return results.sort((a, b) => b.printableRatio - a.printableRatio);
}

/**
 * Unpacks Obfuscated PowerShell Command Payloads
 */
export function unpackPowerShellPayload(script: string): {
  detected: boolean;
  extractedCommands: string[];
  notes: string[];
} {
  const notes: string[] = [];
  const extractedCommands: string[] = [];

  // 1. Look for -e, -enc, -encodedcommand
  const encRegex = /(?:-e|-enc|-encodedcommand)\s+([a-zA-Z0-9+/=]{10,})/gi;
  let match;
  while ((match = encRegex.exec(script)) !== null) {
    const b64 = match[1];
    const decoded = decodeBase64Safe(b64);
    if (decoded.encoding !== 'invalid') {
      notes.push(`Decoded Base64 (${decoded.encoding.toUpperCase()}) PowerShell command.`);
      extractedCommands.push(decoded.output);
    }
  }

  // 2. Look for FromBase64String
  const fromB64Regex = /\[System\.Convert\]::FromBase64String\(\s*['"]([a-zA-Z0-9+/=]{10,})['"]\s*\)/gi;
  while ((match = fromB64Regex.exec(script)) !== null) {
    const b64 = match[1];
    const decoded = decodeBase64Safe(b64);
    if (decoded.encoding !== 'invalid') {
      notes.push('Found and decoded [System.Convert]::FromBase64String payload.');
      extractedCommands.push(decoded.output);
    }
  }

  // 3. Look for concatenated obfuscated string variables (e.g. ('d'+'own'+'load'))
  const concatRegex = /(?:'\s*\+\s*')/g;
  if (concatRegex.test(script)) {
    const cleaned = script.replace(/['"]\s*\+\s*['"]/g, '');
    if (cleaned !== script) {
      notes.push('De-concatenated fragmented string tokens.');
      extractedCommands.push(cleaned);
    }
  }

  return {
    detected: extractedCommands.length > 0,
    extractedCommands,
    notes,
  };
}
