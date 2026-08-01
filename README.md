# Cyber Forensic Lab (CFL) Portal

A web application and API portal for cyber forensic triage, threat intelligence analysis, WHOIS lookup, and AI-powered artifact inspection.

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

## Getting Started in Command Prompt / Terminal

### 1. Install Dependencies
Run the following command in your terminal or Windows Command Prompt:

```cmd
npm install
```

### 2. Set Up Environment Variables (Optional)
Copy `.env.example` to `.env` or set the environment variable directly:

**Windows Command Prompt (cmd.exe):**
```cmd
set GEMINI_API_KEY=your_gemini_api_key_here
```

**Windows PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_gemini_api_key_here"
```

**Linux / macOS:**
```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Run Development Server
To start the application in development mode with hot reload on `http://localhost:3000`:

```cmd
npm run dev
```

### 4. Build and Run in Production
To build the optimized static bundle and bundled backend server:

```cmd
npm run build
npm start
```

## Available Scripts

- `npm run dev`: Starts the TypeScript Express & Vite server (`server.ts`)
- `npm run build`: Bundles the Vite frontend and compiles `server.ts` into CommonJS (`dist/server.cjs`)
- `npm start`: Runs the compiled production server (`node dist/server.cjs`)
- `npm run lint`: Validates TypeScript type safety without emitting files
