# Security Policy — Niventra Capital Advisory

## 1. Reporting a Vulnerability

Niventra Capital Advisory is committed to maintaining the highest security standards for our digital advisory infrastructure, financial records, and client personal data. If you discover a vulnerability or security flaw, please report it immediately to our security desk:

* **Security Desk Email:** `security@niventracapitaladvisory.com`
* **Advisory Contact:** `info@niventracapitaladvisory.com`
* **Response SLA:** Initial acknowledgment within 24 business hours; full evaluation within 7 business days.

Please provide:
1. Detailed description of the vulnerability.
2. Steps to reproduce or proof-of-concept (PoC).
3. Potential impact on confidential data or service availability.

We ask that you practice responsible disclosure and refrain from accessing, modifying, or destroying real user data or interrupting public service availability during your testing.

---

## 2. Supported Versions

Security updates and patches are actively applied to the following branches:

| Branch / Release | Supported | Maintenance Status |
|:---|:---:|:---|
| `main` | Yes | Active Production Release |
| `refinement/*` | Yes | Active Staging / Engineering Development |
| Legacy Tags (< 0.1.0) | No | Deprecated |

---

## 3. Vulnerability Severity Ratings

Vulnerabilities are evaluated using CVSS v3.1 standards:

* **Critical (CVSS 9.0–10.0):** Unauthenticated remote code execution, SQL/NoSQL injection, privilege escalation allowing access to arbitrary investor records, or leak of cryptographic keys. (Patched within 24 hours).
* **High (CVSS 7.0–8.9):** Authentication bypass, direct object reference (IDOR) leaking financial ledgers, or stored cross-site scripting (XSS). (Patched within 72 hours).
* **Medium (CVSS 4.0–6.9):** Rate limiting omissions, CSRF on non-critical endpoints, or information disclosure without PII exposure. (Patched in standard release cycle).
* **Low (CVSS 0.1–3.9):** Non-sensitive header misconfigurations, verbose error stacks in development mode.

---

## 4. Regulatory & Compliance Scope

Security controls are designed to adhere to Indian financial and data privacy statutes:
* **Digital Personal Data Protection (DPDP) Act, 2023** (Sections governing data fiduciary duties and PII masking).
* **Companies Act, 2013** (Section 42 Private Placement and Section 71 Debentures).
* **Information Technology Act, 2000** (Reasonable security practices for sensitive personal data).
