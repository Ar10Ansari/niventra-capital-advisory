# Niventra Capital Advisory — Security Review & Vulnerability Assessment

**Document Version:** 1.0  
**Date:** October 16, 2026  
**Auditor:** Application Security Lead & Lead Architect  
**Workspace:** `d:\Projects\niventra website`  
**Classification:** Institutional Confidential  

---

## 1. Executive Summary

A comprehensive application security review was conducted across the newly implemented Niventra Capital Advisory platform. The platform implements defense-in-depth architectural safeguards spanning authentication, authorization (RBAC), input validation, session security, database query safety, safe document streaming, data privacy (DPDP Act, 2023), AI prompt-injection defenses, and immutable audit trails.

---

## 2. Security Controls & Implementations

### 2.1 Authentication & Password Security
- **Password Hashing:** Implemented using Node.js built-in `node:crypto.scryptSync` with 16-byte cryptographically secure random salts and 64-byte key lengths.
- **Timing Attack Prevention:** All password hash comparisons utilize `crypto.timingSafeEqual` to eliminate side-channel timing leakage.
- **Account Enumeration Protection:** Sign-in endpoints return generic authentication failure messages ("Invalid corporate credentials") regardless of whether the email or password was invalid.
- **No Hardcoded Credentials:** Test accounts are created exclusively during explicit local seeding via `scripts/seed.mjs` with clear development-only flags.

### 2.2 Session Management & Cookies
- **Session Tokens:** 32-byte cryptographic random hex strings stored server-side in the `sessions` table with explicit timestamps (`expires_at`).
- **Cookie Security:** Cookies are issued with:
  - `httpOnly: true` (prevents JavaScript access and XSS token theft).
  - `sameSite: "lax"` (mitigates Cross-Site Request Forgery).
  - `path: "/"`
  - `secure: true` in production environments.
- **Session Termination:** Calling `/api/auth/logout` immediately invalidates the database session row and clears the client cookie.

### 2.3 Role-Based Access Control (RBAC)
- **Server-Side Enforcement:** Role authorization is enforced on every API route and server action using `src/lib/auth/rbac.ts` (`hasRole`, `requireAuth`, `requireRole`).
- **Least Privilege:**
  - `PUBLIC`: May view public canonical routes, submit consultations, lodge grievances, and query the AI chatbot. Cannot access dashboards, private documents, or audit logs.
  - `INVESTOR`: Access limited to user's own profile, submitted enquiries, permitted documents, and personal compliance tickets.
  - `STAFF`: Restricted advisory desk access to review CRM inquiries and assign grievances. Cannot access immutable audit logs or elevate roles.
  - `ADMIN`: Comprehensive administrative management, product catalogue publishing, and audit log inspection.
- **Zero Client-Side Reliance:** Role checks are never performed exclusively in browser UI state.

### 2.4 SQL Injection & Query Safety
- **Parameterized Queries:** All SQLite database interactions in `src/lib/db.ts` utilize prepared statements (`db.prepare("...").run(param1, param2)`) with bound parameters. Zero dynamic SQL string concatenations exist.
- **Foreign Key Constraints:** Enforced via `PRAGMA foreign_keys = ON;`.

### 2.5 Path Traversal & Document Access Control
- **Safe Directory Scoping:** Document download endpoint (`/api/documents/[id]/download`) verifies that file access is strictly constrained to `storage/documents/` using `path.join(safeBaseDir, path.basename(doc.file_path))`.
- **Permission Verification:** Access to non-public documents (e.g. PAS-4 offer letter formats and term sheets) strictly requires an active authenticated session.
- **Audit Logging:** Every download attempt (successful or denied) is immediately recorded in the immutable audit log.

### 2.6 AI Prompt Injection & Data Leakage Protections
- **Input Sanitization:** User prompts sent to `/api/chat` are sanitized and analyzed for adversarial markers (`ignore previous instructions`, `system prompt`, `reveal secrets`, `internal notes`, etc.).
- **Grounded Scope Enforcement:** The assistant explicitly rejects prompt override attempts and returns approved institutional guidance.
- **Private Data Isolation:** The AI retrieval knowledge base (`APPROVED_KNOWLEDGE_BASE`) contains strictly approved public corporate disclosures; it does not have programmatic access to user records, internal staff notes, or database sessions.

### 2.7 Privacy & Statutory Data Retention (DPDP Act, 2023)
- **Consent Capture:** Explicit affirmative consent checkboxes are mandatory on all enquiry, registration, and grievance forms.
- **Erasure Queue:** Account deletion requests are logged under `DEL-2026-XXXX` with defined statutory retention exceptions (Companies Act 2013: 8-year retention for debenture registers; PMLA 2002: 5-year retention for CDD records).

### 2.8 Immutable Audit Logging
- **Tamper Resistance:** Security and business events are recorded in `audit_logs` with actor ID, email, role, action, resource, timestamp, IP address, and outcome.
- **Non-Rewritable:** Normal administrators have read-only visibility into audit logs via `/api/audit-logs`; no API endpoint allows updating or deleting audit logs.

---

## 3. Production Hardening Checklist (Pre-Deployment)

1. [ ] Configure production database (PostgreSQL on Supabase/AWS RDS) with encrypted connections (`sslmode=require`).
2. [ ] Set strong, high-entropy production secrets (`SESSION_SECRET`, `ADMIN_BOOTSTRAP_TOKEN`).
3. [ ] Configure Cloudflare Turnstile CAPTCHA server-side validation keys (`TURNSTILE_SECRET_KEY`).
4. [ ] Configure production transactional email provider (SendGrid / AWS SES) to replace local file sink.
5. [ ] Enable HTTP Strict Transport Security (HSTS) and Content Security Policy (CSP) headers in reverse proxy.
6. [ ] Conduct formal third-party penetration testing and statutory vulnerability assessment.
