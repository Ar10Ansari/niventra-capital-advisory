# Niventra Capital Advisory — Requirements, Decision Log & Open Questions

**Project Phase:** Phase 1.2 — Requirements Reconciliation & Open Questions Review  
**Date:** October 15, 2026  
**Auditor / Architect:** Senior Enterprise Software Architect & Financial Systems Auditor  
**Workspace:** `d:\Projects\niventra website`  
**Classification:** Requirements Traceability & Governance Register  

---

## 1. Overview & Governance Separation

This document structures the requirements for the Niventra Capital Advisory website rebuild by strictly separating:
1. **Confirmed Business Intent & Direction:** Strategic requirements and parameters confirmed by the project stakeholder, alongside their mandatory independent legal/compliance verification gates.
2. **Outstanding Operational & Technical Inquiries:** Specific factual data, missing copy, and architectural decisions requiring resolution by corporate management, legal counsel, finance, and technical leads.

*Important Boundary: Business-intent confirmations establish architectural scope, but do NOT constitute independent legal, regulatory, or tax clearance. Real-money transactions and debenture issuance remain strictly gated until formal certifications are executed.*

---

## 2. Part I: Confirmed Business Intent & Required Legal Verifications

### BI-01: Issuer Identity (Niventra Capital Advisory as Direct Issuer)
- **Status:** **BUSINESS INTENT CONFIRMED (Phase 1.2)**
- **User-Confirmed Business Requirement:**
  Niventra Capital Advisory itself is intended to be the legal issuer of the initial debenture product.
- **Architectural Scope Established:**
  The platform data models, database schemas, and product catalogues will be architected around **Niventra as the direct issuing legal entity**, rather than solely an external matchmaking intermediary.
- **Mandatory Legal & Regulatory Verification Requirements:**
  *Distinction between business intent and legal confirmation:* The authorized company legal and compliance team must formally verify and confirm:
  1. The exact issuing legal corporate entity (e.g., Niventra Capital Advisory India Pvt. Ltd.), including verified Corporate Identification Number (CIN) and registered office.
  2. The statutory issuance structure under the Companies Act, 2013 (Section 71 for Debentures, Section 42 for Private Placement).
  3. Compliance with private placement offer letter requirements (Form PAS-4), special resolution filings (MGT-14), and Registrar of Companies (ROC) charge creation (Form CHG-9).
  4. Appointment of a SEBI-registered Debenture Trustee and execution of Debenture Trust Deed (Form SH-12).
  5. Debenture Redemption Reserve (DRR) and recovery expense fund obligations.
  *No registration numbers, permissions, or compliance status are assumed or fabricated.*
- **Responsible Stakeholder:** General Counsel, Company Secretary & Managing Director.
- **Phase Gate Dependency:** Phase 2 Governance Sign-off (Prerequisite for Phase 5 & Phase 8).

---

### BI-02: Debenture Return Guidance (Preliminary Range: 12% – 16%)
- **Status:** **PRELIMINARY BUSINESS GUIDANCE (Phase 1.2)**
- **User-Provided Guidance:**
  Debenture returns are currently understood to fall within a range of **12% – 16%**.
- **Nature of Guidance:**
  Recorded as preliminary business guidance, **not** as a verified contractual rate, approved advertisement, or guaranteed return.
- **Policy on Public Content:**
  **Do NOT automatically overwrite the existing website's advertised figures (14%–16%) with 12%–16%.** The existing figures are retained in the baseline content parity checklist, while the discrepancy is cataloged for formal review. Approval of final public marketing wording and disclaimers is required before any public copy is modified.
- **Unresolved Specifications Requiring Resolution:**
  1. *Rate Measure:* Does 12%–16% represent a fixed coupon rate, target IRR, or annualized gross yield?
  2. *Product Tranches:* Which specific debenture tenures and security tranches carry which specific rates?
  3. *Payout Frequency:* Is interest distributed monthly, quarterly, semi-annually, annually, or cumulative at maturity?
  4. *Calculation Convention:* Is interest calculated as simple interest or compounded?
  5. *Day-Count Convention:* Is day-count Actual/365, Actual/Actual, or 30/360? How are holiday adjustments and payment dates handled?
  6. *Taxes & Deductions:* What TDS withholding (Section 193/194A), origination fees, or structuring costs apply?
  7. *Marketing Authorization:* Has legal/compliance approved public advertising of this yield range and drafted the mandatory co-located risk disclaimers?
- **Responsible Stakeholder:** Chief Financial Officer & Chief Compliance Officer.
- **Phase Gate Dependency:** Phase 2 Governance Gate (Prerequisite for Phase 4 copy & Phase 7 calculator).

---

### BI-03: Payment & Settlement Direction (Approved Provider Preferred)
- **Status:** **BUSINESS DIRECTION CONFIRMED (Phase 1.2)**
- **User-Confirmed Business Requirement:**
  The preferred business direction is to use an approved payment / settlement provider, subject to product requirements and legal/compliance review.
- **Core Architectural Guardrail (Payment vs Issuance Separation):**
  **Payment initiation is strictly separated from confirmation of legal debenture issuance or allocation.** Successful processing of funds through an approved provider records a `CONFIRMED` payment transaction, but does **not** automatically legally issue or allocate the debenture. Allocation is a distinct legal milestone confirmed only upon formal debenture certificate generation or depository (NSDL/CDSL) credit.
- **Unresolved Specifications Requiring Resolution:**
  1. *Provider Selection:* Selection of the specific authorized provider (e.g., ICICI Eazypay, Razorpay Escrow, Axis Bank Corporate Banking, or direct RTGS/NEFT virtual accounts).
  2. *Escrow / Settlement Architecture:* Compliance of the payment flow with RBI escrow regulations and private placement funds-handling rules.
  3. *Reconciliation & Ledgering:* Double-entry transaction ledger states (`Initiated`, `Pending`, `Confirmed`, `Failed`, `Refunded`, `Allocated`).
  4. *Refunds & Payouts:* Automated or manual workflows for rejected applications, excess subscription refunds, periodic coupon disbursements, and maturity redemptions.
- **Responsible Stakeholder:** Chief Financial Officer & Banking Operations Lead.
- **Phase Gate Dependency:** Phase 2 Selection / Phase 8 Gated Development.

---

## 3. Part II: Outstanding Operational, Technical & Compliance Inquiries

The following specific items remain unresolved and require authoritative evidence and input from company stakeholders:

### OP-01: Authoritative Company Contact Directory
- **Status:** **UNRESOLVED — COMPANY INPUT REQUIRED**
- **Identified Contradictions in Live Audit:**
  - Toll-free phone: `18008900818` (used in footer across 14 pages and `/contact/`).
  - Delhi landline: `+91 01140515660` (displayed on `/debt-debenture/` and `/capital-providers/`, but link dials `tel:18008900818`).
  - WhatsApp mobile: `+91 74282 80200` (`https://wa.me/917428280200` on `/contact/`).
  - Office address: `Patel Nagar City Centre, Gwalior, Madhya Pradesh - 474001` (currently linked to generic Google Maps homepage).
  - Corporate emails: `info@niventracapitaladvisory.com` (general) vs `grievance@niventracapitaladvisory.com` (grievance officer).
- **Action Required from Company:**
  Provide an authoritative, company-approved corporate contact directory defining which numbers, physical addresses, and mailboxes should be standardized across the website.
- **Responsible Stakeholder:** Head of Marketing & Customer Operations.

---

### OP-02: Approved Offering Documents & Missing Investor Policy Clauses
- **Status:** **UNRESOLVED — COMPANY DOCUMENTS REQUIRED**
- **Identified Deficiencies in Live Audit:**
  - `/assets/docs/sample_offer_document.pdf` is missing on the server (returns HTML homepage catch-all).
  - `/assets/docs/sample_term_sheet.pdf` is missing on the server (returns HTML homepage catch-all).
  - `/investor-information/` renders only clauses 8, 11, and 12. Clauses 1, 2, 3, 4, 5, 6, 7, 9, and 10 are missing from the live DOM.
- **Action Required from Company:**
  1. Provide the latest approved, redacted, and watermarked sample **Information Memorandum / Offer Document** (PDF).
  2. Provide the latest approved sample **Debenture Term Sheet** (PDF).
  3. Supply the complete, approved text for **Clauses 1 through 7, 9, and 10** for `/investor-information/`.
- **Policy Enforcement:** Antigravity will not synthesize mock agreements or fabricate missing policy clauses.
- **Responsible Stakeholder:** Legal Counsel & Corporate Secretary.

---

### OP-03: External Application Form Ownership, Custody & Replacement
- **Status:** **UNRESOLVED — COMPANY INPUT REQUIRED**
- **Identified Finding in Live Audit:**
  The "Application Form" on `/capital-providers/` links to `https://crm-teal-one-29.vercel.app/debenture-application?ref=MDSDWK-00I`. Independent live verification confirmed this endpoint currently returns **HTTP 404 (Not Found)**.
- **Action Required from Company:**
  Confirm the following information:
  1. The legal or business owner of the `crm-teal-one-29.vercel.app` deployment.
  2. The technical administrator who created and managed it.
  3. The data controller and any third-party processors involved.
  4. The categories of personal and financial data previously collected.
  5. The storage location, encryption, and access controls for collected records.
  6. Privacy notices, retention schedules, and deletion protocols.
  7. Written authorization to permanently decommission this broken external link and replace it with a native, secure, first-party investor application workflow hosted directly on the Niventra domain.
- **Responsible Stakeholder:** Chief Information Security Officer (CISO) & Data Protection Officer (DPO).

---

### OP-04: Proposed Referral Program Regulatory Evaluation
- **Status:** **UNRESOLVED — LEGAL EVALUATION REQUIRED**
- **Context:**
  A proposed referral concept outlines a unique referral link offering 1% of qualifying principal up to ₹2,000 per investment.
- **Action Required from Company:**
  Legal and tax counsel must confirm:
  1. Does paying financial compensation to individuals for introducing investors to private placement debentures violate Section 42 of the Companies Act (prohibition on public advertisements, agents, or media)?
  2. Does referral remuneration require registration as a SEBI-registered intermediary or broker?
  3. What are the TDS obligations under Section 194H (commission/brokerage) of the Income Tax Act?
  4. What anti-fraud controls (self-referral prevention, KYC verification of referrers) are mandated?
- **Policy Enforcement:** The referral engine remains strictly disabled in backend code until legal clearance is documented.
- **Responsible Stakeholder:** Legal & Tax Counsel.

---

### OP-05: Standard Financial Calculation & Yield Formulas
- **Status:** **UNRESOLVED — FINANCIAL SIGN-OFF REQUIRED**
- **Context:**
  The live calculator operates on simple interest with a 30-day month fraction, the hero slider uses a 16% monthly compounding SIP formula, and the bond example table contains an arithmetic contradiction (₹50,000 at 14%-16% yielding ₹50,360 instead of ₹50,583.33 / ₹50,666.67).
- **Action Required from Company:**
  Financial controller must formally sign off on the exact mathematical specification for the platform calculator:
  1. Simple Interest vs Compound Interest formulas.
  2. Day-count convention (Actual/365, Actual/Actual, or 30/360).
  3. Payout frequency options (monthly, quarterly, annual, maturity).
  4. Display of gross coupon vs net after TDS (10%).
- **Responsible Stakeholder:** Chief Financial Officer / Head of Structuring.

---

### OP-06: Identity & Authentication Architecture Selection
- **Status:** **ARCHITECTURAL DECISION REQUIRED**
- **Options Available:**
  1. *Managed Identity Provider (Clerk / Auth0):* SOC2 certified, built-in MFA, Passkeys, turnkey DPDP compliance, lower maintenance.
  2. *Self-Hosted NextAuth / Lucia with Argon2id in PostgreSQL:* Complete data ownership, zero vendor lock-in, higher development and maintenance overhead.
- **Responsible Stakeholder:** Technical Architect & CISO.

---

### OP-07: Chatbot Grounding Corpus & Bilingual Scope
- **Status:** **OPERATIONAL DECISION REQUIRED**
- **Scope to Confirm:**
  1. Confirmation of the exact corpus of approved documents for vector indexing (public website copy, approved FAQs, redacted offering summaries).
  2. Confirmation of bilingual (English and Hindi) support requirements and designated reviewer for translated financial terms.
  3. Escalation workflow for ungrounded queries (WhatsApp routing vs CRM ticket creation).
- **Responsible Stakeholder:** Head of Marketing & IT Operations Lead.

---

## 4. Stakeholder Action Items Summary

| Stakeholder Role | Assigned Inquiries & Decisions | Mandatory Gate |
| :--- | :--- | :---: |
| **General Counsel / Legal** | BI-01 (Issuer legal entity & structure), BI-02 (Marketing disclosures), OP-02 (Approved offer docs & clauses), OP-04 (Referral legality) | **Phase 2 Gate** |
| **Chief Financial Officer** | BI-02 (Rate specifications & tenures), BI-03 (Payment & settlement model), OP-05 (Certified calculation engine) | **Phase 2 Gate** |
| **Managing Director** | BI-01 (Corporate issuer strategy confirmation), BI-03 (Payment provider direction) | **Phase 2 Gate** |
| **CISO / IT Security** | OP-03 (External CRM ownership & decommission authorization), OP-06 (Auth provider selection) | **Phase 3 Gate** |
| **Marketing & Operations** | OP-01 (Official contact directory), OP-07 (Chatbot corpus & Hindi review) | **Phase 3 Gate** |
