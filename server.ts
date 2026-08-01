import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini AI Client (Lazy check inside route)
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY });
  });

  // AI Search Grounding Endpoint: Live Cybersecurity Threat Intelligence & CVE Headlines
  app.post("/api/threat-intel/search", async (req, res) => {
    try {
      const { query } = req.body;
      const searchQuery = query || "latest cybersecurity threat intelligence headlines active zero-day vulnerabilities CVE alerts 2026";
      const ai = getGenAI();

      if (!ai) {
        // Fallback realistic search-grounded alerts if GEMINI_API_KEY is not configured
        return res.json({
          isGrounded: false,
          isFallback: true,
          searchQuery,
          lastUpdated: new Date().toISOString(),
          sources: [
            { title: "CISA Cyber Advisories & Known Exploited Vulnerabilities", uri: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" },
            { title: "NIST National Vulnerability Database (NVD)", uri: "https://nvd.nist.gov/" },
            { title: "CERT-In Cyber Security Alerts", uri: "https://www.cert-in.org.in/" }
          ],
          threatAlerts: [
            {
              cve: "CVE-2026-44012",
              severity: "CRITICAL",
              title: "Critical Unauthenticated RCE in Telecommunication OTP SMS Gateways",
              category: "Telecommunications & Banking",
              summary: "A severe remote code execution flaw in carrier OTP relay software allows unauthenticated actors to intercept SMS verification codes and trigger SIM swap exploits across major banking networks.",
              affectedSystems: "Carrier SMS Gateway API v4.2+, Telecom Core Switches",
              recommendedAction: "Apply emergency vendor patch KB-2026-901 and enforce FIDO2 WebAuthn mandatory MFA for financial portals."
            },
            {
              cve: "CVE-2026-3891",
              severity: "HIGH",
              title: "Active Phishing Campaign Targeting Federal Digital Signature Portals",
              category: "Phishing / PKI Identity",
              summary: "Sophisticated typosquatted domains and man-in-the-middle proxy toolkits are actively capturing Class 3 Digital Signature Certificate (DSC) renewal credentials.",
              affectedSystems: "e-Mudhra & Class 3 PKI Token Authentication Gates",
              recommendedAction: "Block newly registered lookalike domains in DNS sinkholes and implement strict Certificate Pinning."
            },
            {
              cve: "CVE-2026-1904",
              severity: "HIGH",
              title: "Android Banking Trojan 'RupayaStealer' Harvesting UPI PINs",
              category: "Mobile Malware & FinTech",
              summary: "A newly identified Android accessibility service payload mimics official UPI payment authorization dialogs to capture user MPINs and execute silent transfers.",
              affectedSystems: "Android 11-15 Mobile Operating Systems",
              recommendedAction: "Revoke Accessibility permissions for untrusted side-loaded APKs and restrict side-loading via MDM policy."
            },
            {
              cve: "CVE-2026-5109",
              severity: "CRITICAL",
              title: "Zero-Day Memory Corruption in Enterprise VPN Concentrators",
              category: "Zero-Day Vulnerability",
              summary: "Heap buffer overflow in sslvpn process permits arbitrary code execution prior to user authentication, facilitating initial network access for ransomware groups.",
              affectedSystems: "Enterprise VPN Gateway Firmware < v9.4.1",
              recommendedAction: "Disable SSL-VPN portal access immediately or restrict ingress IP ranges until hotfix binary is flashed."
            }
          ]
        });
      }

      const prompt = `Perform a live web search for: "${searchQuery}".
Synthesize the 4 to 5 most critical, recent cybersecurity threat intelligence headlines, active zero-day exploits, ransomware campaigns, or CVE alerts.

You MUST respond strictly with a valid JSON object matching this schema (no extra text, no markdown preamble outside JSON):
{
  "searchQuery": "${searchQuery}",
  "lastUpdated": "${new Date().toISOString()}",
  "threatAlerts": [
    {
      "cve": "CVE ID or N/A",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM",
      "title": "Headline title",
      "category": "e.g. Zero-Day / Ransomware / Phishing / FinTech",
      "summary": "2-3 sentence clear technical summary of the threat and impact",
      "affectedSystems": "Software or hardware affected",
      "recommendedAction": "Actionable mitigation advice"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        },
      });

      // Extract Grounding Chunks (URLs and titles)
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri,
        }));

      let rawText = response.text || "";
      // Strip markdown syntax
      rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

      let parsedJson: any = null;
      try {
        parsedJson = JSON.parse(rawText);
      } catch (parseErr) {
        // If JSON parsing fails, extract JSON fragment or structure cleanly
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            parsedJson = JSON.parse(match[0]);
          } catch (e) {}
        }
      }

      if (!parsedJson || !Array.isArray(parsedJson.threatAlerts)) {
        // Fallback if parsing failed but response exists
        return res.json({
          isGrounded: true,
          isFallback: false,
          searchQuery,
          lastUpdated: new Date().toISOString(),
          sources,
          rawText,
          threatAlerts: [
            {
              cve: "CVE-2026-SEARCH",
              severity: "HIGH",
              title: "Recent Search Grounding Cyber Threat Insights",
              category: "Web Search Intel",
              summary: rawText.slice(0, 300) + "...",
              affectedSystems: "Various Global Infrastructure",
              recommendedAction: "Review attached grounding sources for detailed threat indicators."
            }
          ]
        });
      }

      res.json({
        isGrounded: true,
        isFallback: false,
        searchQuery: parsedJson.searchQuery || searchQuery,
        lastUpdated: parsedJson.lastUpdated || new Date().toISOString(),
        sources: sources.length > 0 ? sources : [
          { title: "Google Search Grounding Intel Feed", uri: "https://google.com" }
        ],
        threatAlerts: parsedJson.threatAlerts
      });
    } catch (err: any) {
      console.error("Search Grounding API Error:", err);
      res.status(500).json({
        error: "Failed to fetch live search grounded threat intelligence.",
        details: err.message
      });
    }
  });

  // AI Cyber Forensics Chatbot Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, systemContext } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is missing
        return res.json({
          reply:
            "AI Assistant is operating in local fallback mode. Please configure GEMINI_API_KEY in environment variables for live Gemini 3.6 Flash threat intelligence.",
          isFallback: true,
        });
      }

      const systemInstruction = `You are "Aegis AI", an elite Senior Cyber Crime Forensics Investigator & Legal Expert working for CFL (Cyber Forensics Lab).
Your expertise covers:
1. Digital Evidence Triage (Phishing email headers, malware shellcode, powershell obfuscation, suspicious transaction logs).
2. Cyber Law & Statutes: Information Technology Act 2000 (Sec 65B, 66C, 66D, 43, 72), Bharatiya Nyaya Sanhita (BNS) provisions, and Indian Evidence Act.
3. Forensics Best Practices: Chain of Custody, SHA-256 integrity hashing, YARA rules, STIX/TAXII IoCs, and Section 65B certificate drafting.

Provide precise, structured, highly professional technical responses using clear markdown formatting, bullet points, code blocks for payloads/YARA rules, and statute references.`;

      // Convert conversation history into model prompt format
      const formattedContents = (messages || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      if (systemContext) {
        formattedContents.unshift({
          role: "user",
          parts: [{ text: `[SYSTEM CONTEXT / EVIDENCE ARTIFACT ATTACHED]: ${systemContext}` }],
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      res.json({ reply: response.text || "No response generated from AI." });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({
        error: "Failed to generate AI response.",
        details: error.message || String(error),
      });
    }
  });

  // AI Deep Analysis Route for Phishing / Malware / Fraud
  app.post("/api/ai-analyze", async (req, res) => {
    try {
      const { artifactType, payload } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          aiBreakdown:
            "Local deterministic analysis completed. Set GEMINI_API_KEY for deep LLM forensic inspection.",
        });
      }

      const prompt = `Perform a deep forensic threat assessment on the following ${artifactType} payload:

=== ARTIFACT PAYLOAD ===
${payload}
========================

Provide a structured breakdown including:
1. Executive Threat Classification & Severity
2. Key Indicators of Compromise (IoCs) & Malicious Patterns Identified
3. Recommended Containment & Forensic Mitigation Steps
4. Relevant Legal Provisions (IT Act / BNS)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
        },
      });

      res.json({ aiBreakdown: response.text });
    } catch (error: any) {
      console.error("Gemini Analysis API Error:", error);
      res.status(500).json({ error: "AI Analysis failed." });
    }
  });

  // Vite Middleware for development mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CFL Forensics Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
