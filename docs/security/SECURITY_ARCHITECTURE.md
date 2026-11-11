# Niventra Capital Advisory — Security Architecture & Regulatory Compliance

**Document Type:** Enterprise Security Architecture, Threat Model & Regulatory Compliance  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/security/SECURITY_ARCHITECTURE.md`  

---

## 1. Authentication & Cryptographic Controls

### 1.1 Password Security
* **Algorithm:** Node.js native `crypto.scryptSync` (target: Argon2id or Scrypt).
* **Salt Generation:** 16 bytes of cryptographically secure pseudo-random entropy generated via `crypto.randomBytes(16)`.
* **Cost Parameters:** `N=16384`, `r=8`, `p=1`, producing a 64-byte key (128 hex characters).
* **Timing-Safe Verification:** Password verification uses `crypto.timingSafeEqual` between the candidate derived key buffer and the stored hash buffer, preventing timing side-channel attacks.

### 1.2 Session Management & Tokens
* **Session Tokens:** 32-byte cryptographic random hex tokens (`crypto.randomBytes(32)`).
* **Storage & Transmission:** Delivered to browsers via `HttpOnly`, `SameSite=Lax`, `Secure` (in `production`) cookies (`niventra_session`), supplemented by signed short-lived JWT Bearer tokens (`Authorization: Bearer <jwt>`, default `JWT_EXPIRES_IN=15m`) on the NestJS API.
* **Expiration:** Sessions expire after 7 days (`SESSION_DURATION_MS = 604,800,000`).
* **Invalidation:** Explicit logout deletes the session row and clears the browser cookie. Password reset revokes **all** active sessions for the user inside a single atomic Prisma `$transaction`.
* **Password Recovery Tokens:** Generated with 32 random bytes, stored strictly as SHA-256 digests in `password_reset_tokens` (30-minute TTL, single-use `used_at` enforcement), and never written in plaintext to logs or local mock email sinks.

---

## 2. Authorization & Data Isolation

### 2.1 Role-Based Access Control (RBAC)
The platform defines 4 discrete access roles:
1. `PUBLIC`: Unauthenticated visitors; restricted to public disclosures, branch directory, calculator, and submission of consultation/project forms.
2. `INVESTOR`: Registered capital providers; restricted to personal dashboard, own KYC records, own investments, and own enquiries.
3. `STAFF`: Advisory desk operators; authorized to review inbound CRM leads and project applications.
4. `ADMIN`: Full administrative control; authorized to alter user roles, review audit logs, and manage platform configurations.

### 2.2 Strict Cross-Tenant & Cross-Investor Boundaries
Every investor endpoint enforces query parameter isolation:
```typescript
// Enforced in GET /api/investments and GET /api/kyc
if (user.role === "INVESTOR" && targetUserId && targetUserId !== user.id) {
  return NextResponse.json(
    { error: "Forbidden: You cannot access records of another investor." },
    { status: 403 }
  );
}
```

---

## 3. Privacy & DPDP Act 2023 Compliance

### 3.1 PII Masking
Personal Identifiable Information (PII) is automatically masked prior to log emission and display:
* **Email:** `alexander@example.com` $\rightarrow$ `a***r@example.com`.
* **PAN Number:** `ABCDE1234F` $\rightarrow$ `AB*****4F`.
* **ID / Aadhaar:** `123456789012` $\rightarrow$ `********9012`.

### 3.2 Right to Erasure & Statutory Retention Exemptions
Under the Digital Personal Data Protection (DPDP) Act, 2023, data subjects may request account and data erasure via `POST /api/account/delete`.
* **Processing:** The account is set to `PENDING_DELETION`.
* **Statutory Retention Overrides:** In compliance with the Companies Act 2013 (Section 88 debenture register: 8 years) and the Prevention of Money Laundering Act (PMLA 2002: 5 years for CDD records), financial transactions and audit logs are retained under statutory exemption notes rather than deleted immediately.

---

## 4. Network & Application Defenses

### 4.1 Rate Limiting & Throttling
* NestJS Throttler enforces tiered rate limits:
  * Global Public & API Default: 60 requests / minute / IP
  * Authentication (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`): 5 requests / minute / IP
  * Lead & Project Submissions (`/api/enquiries`, `/api/project-funding`): 5 requests / 5 minutes / IP

### 4.2 Bot Defenses
* Dual-layer bot mitigation:
  1. Honeypot traps (`website_hp`) silently absorb automated bot submissions.
  2. Cloudflare Turnstile integration validates browser challenge tokens on production forms.

### 4.3 HTTP Security Headers (Helmet)
```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.niventracapitaladvisory.com"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: "deny" },
  noSniff: true,
})
```

---

## 5. Regulatory Disclaimers & Financial Transparency

* **No Guaranteed Returns:** In compliance with SEBI and RBI regulations, all marketing copy, calculation outputs, and chatbot answers strictly refrain from claiming "guaranteed", "risk-free", or "assured" returns.
* **Indicative Yield Disclosures:** The 12%–16% p.a. yield range is consistently qualified as an indicative business target subject to asset due diligence, escrow covenants, and ROC CHG-9 charge registration.
* **TDS Withholding Disclosures:** All financial projections prominently display statutory withholding caveats under Section 193/194A of the Indian Income Tax Act, 1961.

### 5.1 Legal & Regulatory Compliance Boundary
Implementing cryptographic, RBAC, and audit controls establishes technical baseline security only — it does **not** by itself certify regulatory compliance. Prior to handling live capital commitments or external private placements on the production PostgreSQL core, legal and compliance counsel must complete sign-off on:
1. Final Companies Act, 2013 (Sections 42 & 71) private placement offer letters (`Form PAS-4`) and Debenture Trustee agreements.
2. Live KYC verification workflow alignment with PMLA 2002 / CKYC / KRA requirements.
3. Cloud hosting data-residency verification (India region PostgreSQL & S3/R2 storage) and formal DPDP Act, 2023 privacy notice review.
4. S3/R2 encrypted object storage provisioning, automated off-site PostgreSQL PITR backups, and incident response drills.
