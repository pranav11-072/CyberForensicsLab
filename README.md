<div align="center">

# 🛡️ Cyber Forensic Lab (CFL) Portal

**Enterprise-Grade Digital Forensics, Threat Intelligence & Automated Incident Response Platform**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<p align="center">
  <a href="#-key-modules--capabilities">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-environment-configuration">Configuration</a> •
  <a href="#-legal--mitre-coverage">Legal & Compliance</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

</div>

## 📌 Overview

**Cyber Forensic Lab (CFL) Portal** is a high-performance triage and forensic analysis suite engineered for incident responders, cybersecurity analysts, and digital forensic investigators. It combines **deterministic client-side heuristic inspection engines** with **server-side AI threat attribution** powered by Google Gemini.

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                           CYBER FORENSIC LAB                                │
 │  [ Phishing Triage ] ── [ Malware Artifacts ] ── [ Financial Fraud Scan ]   │
 │         │                       │                          │                │
 │         ▼                       ▼                          ▼                │
 │  ┌───────────────────────────────────────────────────────────────────────┐  │
 │  │      Heuristic Rule Engine + MITRE ATT&CK & IT Act Legal Mapping     │  │
 │  └───────────────────────────────────────────────────────────────────────┘  │
 │         │                                                  │                │
 │  [ AI Threat Assistant ]                           [ Evidence Vault ]       │
 │  (Gemini Server Proxy)                             (Forensic Reports + Hash)│
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Modules & Capabilities

### 🔍 1. Phishing & Email Header Forensics
- **Deep Header Triage**: Analyzes Received hops, SPF, DKIM, and DMARC alignment records.
- **Payload & Link De-obfuscation**: Detects typosquatted domains, suspicious TLDs, Punycode tricks, and credential harvesting forms.
- **Heuristic Threat Scoring**: Delivers instant risk grading (*SAFE*, *SUSPICIOUS*, *HIGH RISK*, *CRITICAL*).

### 🦠 2. Malware Log & Artifact Analyzer
- **Log & Script Parser**: Inspects PowerShell, Base64 strings, system event logs, and command execution traces.
- **Ransomware & Trojan Detection**: Flags shadow copy destruction commands (`vssadmin`, `wbadmin`), memory injection APIs (`WriteProcessMemory`), and persistence keys.
- **Diagnostic Triage**: Identifies cryptojacking loops, rootkit hooks, and unmapped socket connections.

### 💳 3. Financial Fraud & Social Engineering Scanner
- **Payment Scam Triage**: Uncovers deceptive UPI collect requests, fake refund QR mechanics, and payment gateway impersonation.
- **Extortion & Impersonation**: Detects "Digital Arrest" extortion, law enforcement impersonation threats, and fraudulent investment schemes.
- **Statutory Violation Mapping**: Maps fraud patterns directly to Indian IT Act (Sec 43, 66, 66D) and IPC sections.

### 🌐 4. Live Threat Intelligence & WHOIS Engine
- **Domain & IP WHOIS Lookup**: Queries domain registrar data, creation dates, nameservers, and geolocation endpoints.
- **Threat Indicator Feed**: Real-time intelligence breakdown for active malicious indicators and compromised IPs.

### 🔒 5. Evidence Vault & Chain of Custody
- **Forensic Report Generation**: Exports comprehensive investigation dossiers with timestamps and findings.
- **Cryptographic Hash Verification**: Calculates SHA-256 integrity hashes for stored evidence to preserve chain of custody.

### 🤖 6. AI Forensic Copilot (CyberBot)
- **Deep Threat Attribution**: Interactive Gemini-powered assistant to decode obfuscated payloads, analyze threat actors, and suggest containment procedures.
- **Server-Side Security**: All AI interactions are proxied securely through backend endpoints—no API keys are exposed to the client.

### 📚 7. Interactive Case Library & Training Hub
- **Historical Case Repository**: In-depth breakdowns of landmark cyber attacks, technical timelines, and lessons learned.
- **Forensic Skill Assessment**: Interactive quiz modules for triage methodologies and forensic best practices.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Web Browser (Client)                 │
│  React 19 + TypeScript + Tailwind CSS + Lucide Icons   │
│  • Instant Local Heuristic Triage Engine               │
│  • Interactive Evidence Vault & Hash Generator         │
└───────────────────────────┬────────────────────────────┘
                            │ REST API Requests
                            ▼
┌────────────────────────────────────────────────────────┐
│               Backend Server (Express / Node.js)       │
│  • /api/whois/:target      --> WHOIS & DNS Intelligence │
│  • /api/threat-intel       --> Live IOC Feed Provider   │
│  • /api/ai/chat            --> Gemini 2.5 Flash Proxy   │
│  • /api/ai/analyze-report  --> Automated Report Summary │
└───────────────────────────┬────────────────────────────┘
                            │ Server-Side Auth
                            ▼
               ┌────────────────────────┐
               │   Google Gemini API    │
               │  Threat Intelligence   │
               └────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher

---

### Step-by-Step Installation

#### 1. Clone or Open the Repository
```bash
git clone https://github.com/your-username/cyber-forensic-lab.git
cd cyber-forensic-lab
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables *(Optional for AI Copilot)*
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

> 💡 **Quick Environment Setup by Terminal:**
> 
> - **Windows Command Prompt (cmd.exe):**
>   ```cmd
>   set GEMINI_API_KEY=your_key_here
>   ```
> - **Windows PowerShell:**
>   ```powershell
>   $env:GEMINI_API_KEY="your_key_here"
>   ```
> - **Linux / macOS:**
>   ```bash
>   export GEMINI_API_KEY="your_key_here"
>   ```

#### 4. Launch the Application
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Boots the full-stack server (`server.ts`) in development mode with hot reloading |
| `npm run build` | Compiles the Vite React frontend and bundles `server.ts` into `dist/server.cjs` via `esbuild` |
| `npm start` | Runs the compiled standalone production server (`node dist/server.cjs`) |
| `npm run lint` | Runs TypeScript static type checking (`tsc --noEmit`) |
| `npm run clean` | Cleans up previous build artifacts and dist directories |

---

## 🛡️ Legal & MITRE Coverage

The built-in forensic heuristic engine maps threat indicators to international standards and legal frameworks:

- **MITRE ATT&CK Framework**:
  - `T1566`: Phishing (Spearphishing Link, Attachment, Service)
  - `T1059`: Command and Scripting Interpreter (PowerShell, VBScript)
  - `T1486`: Data Encrypted for Impact (Ransomware Execution)
  - `T1055`: Process Injection (Memory Manipulation)
  - `T1071`: Application Layer Protocol (C2 Beaconing)
- **Legal Compliance Mapping**:
  - **IT Act 2000 / 2008**: Sec 43 (Damage to computer system), Sec 66 (Hacking), Sec 66C (Identity theft), Sec 66D (Cheating by impersonation).
  - **Indian Penal Code (IPC)**: Sec 419 (Cheating by personation), Sec 420 (Cheating and dishonestly inducing delivery of property), Sec 426 (Mischief).

---

## 📁 Project Structure

```
├── .env.example              # Sample environment configuration
├── index.html                # Single-page application HTML entry
├── metadata.json             # Applet capabilities & metadata
├── package.json              # Project dependencies and lifecycle scripts
├── server.ts                 # Full-stack Express backend & API proxy
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite & Tailwind CSS build configuration
└── src/
    ├── App.tsx               # Primary layout, routing, and navigation
    ├── index.css             # Tailwind CSS global stylesheet
    ├── main.tsx              # React DOM mounting entry point
    ├── types.ts              # TypeScript interfaces, types & data schemas
    ├── components/
    │   ├── CaseLibrary.tsx   # Incident case study knowledge base
    │   ├── CyberBot.tsx      # AI Forensic Copilot modal / drawer
    │   ├── EvidenceVault.tsx # Saved forensic reports & hash generator
    │   ├── Footer.tsx        # Global footer component
    │   ├── FraudScanner.tsx  # Financial fraud & scam detector
    │   ├── MalwareAnalyzer.tsx # Malware logs & memory injection parser
    │   ├── Navbar.tsx        # Top navigation header & status bar
    │   ├── Overview.tsx      # Central forensic dashboard & metrics
    │   ├── PhishingAnalyzer.tsx # Email header & URL triage tool
    │   ├── RuleExplorer.tsx  # Forensic rules & heuristic matrix
    │   ├── ThreatIntelligenceFeed.tsx # Live WHOIS & threat intel
    │   └── TrainingHub.tsx   # Interactive quizzes and training drills
    ├── data/
    │   ├── cases.ts          # Real-world forensic case studies
    │   ├── presets.ts        # Presets repository
    │   ├── quiz.ts           # Training hub quiz question bank
    │   └── rules.ts          # Heuristic rules & MITRE mapping database
    └── utils/
        └── engine.ts         # Deterministic rule engine & regex evaluator
```

---

## 🔒 Security & Privacy

- **Offline-First Rule Engine**: Primary heuristic scans, regex parsing, and threat evaluations execute entirely on the client, ensuring sensitive data is not transmitted externally unless explicitly requested.
- **Zero API Key Leakage**: Third-party and AI keys are strictly resolved server-side through Express API endpoints.
- **Forensic Integrity**: Generated SHA-256 evidence digests enable verification of report contents for investigative records.

---

<div align="center">

**Cyber Forensic Lab** • Built for Secure Incident Investigation & Threat Triage

</div>
