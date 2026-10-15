# Niventra Capital Advisory — Outstanding Business & Compliance Decisions

**Project Phase:** Phase 4 Rebuild Execution & Governance Sign-Off  
**Date:** October 15, 2026  
**Auditor / Architect:** Senior Enterprise Software Architect & Financial Systems Auditor  
**Workspace:** `d:\Projects\niventra website`  
**Classification:** Corporate Governance, Pre-Deployment Blockers & Sign-Off Matrix  

---

## 1. Executive Purpose

While the complete public website rebuild is locally finished and passes all automated, responsive, and visual quality gates, **this website represents a real financial services and capital advisory enterprise**.

In accordance with strict financial-services safeguards and the master execution mandate:
- **No production deployment or DNS cutover will occur without explicit client authorization.**
- **No real-money payment processing, investor fund allocation, or debenture issuance will be activated.**
- **This document enumerates all remaining legal, regulatory, corporate, and technical dependencies that must be formally certified by authorized corporate reviewers prior to production launch.**

---

## 2. Pre-Deployment Decision & Compliance Matrix

| # | Governance Decision | Stakeholder Intent Status | Legal / Compliance Verification Status | Remaining Action Required Before Production Launch | Required Corporate Sign-Off |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Issuer Corporate Entity (DEC-01)** | Confirmed by stakeholder: Niventra Capital Advisory India Pvt. Ltd. is intended as direct issuer. | **Pending Legal Sign-Off:** Formal corporate structure under Companies Act 2013 (Sections 42 & 71) not yet certified. | Provide exact legal entity name, CIN, authorized capital, board resolution for debenture issuance, and ROC Form CHG-9 charge creation template. | General Counsel / Managing Director |
| **2** | **Debenture Return Guidance (DEC-02)** | Confirmed business guidance: **12%–16% p.a.** indicative yield range. | **Unverified Preliminary Guidance:** Not certified as audited yield or approved public advertisement. | CFO/Compliance review of coupon rate mapping per tenure tranche, day-count convention (Actual/365), compounding vs simple interest, and TDS withholding disclaimers. | Chief Financial Officer / Chief Compliance Officer |
| **3** | **Official Contact Directory (DEC-03)** | Multiple numbers and channels cataloged across website and footer. | **Awaiting Corporate Directory:** Telephones and addresses verified active, but authoritative routing rules needed. | Formalize the primary toll-free (`1800 890 0818`), landline (`+91 011 4051 5660`), WhatsApp desk (`+91 74282 80200`), and office suite designation in Gwalior. | Head of Marketing & Operations |
| **4** | **Offering Documents & Investor Clauses (DEC-04)** | Sample documents request flow implemented natively on `/capital-providers/`. | **Awaiting Approved Source Binaries:** No sample PAS-4 or term sheets currently hosted. | Provide official, watermarked, redacted sample Private Placement Offer Letters (PAS-4) and Term Sheets for secure download. Provide authorized text for Clauses 1–7 and 9–10 on `/investor-information/`. | Legal Counsel & Company Secretary |
| **5** | **Legacy External CRM Decommissioning (DEC-05)** | External Vercel link (`crm-teal-one-29.vercel.app`) eliminated from public routes. | **Pending Confirmation:** Historical data custody and account ownership unverified. | Confirm ownership and technical administrative closure of `crm-teal-one-29.vercel.app` hosting account; certify no residual unencrypted investor data remains. | Chief Information Security Officer (CISO) |
| **6** | **Payment & Settlement Infrastructure (DEC-06)** | Preferred direction: Approved payment / escrow provider. Live financial APIs strictly disabled. | **Gated by Governance:** Zero real-money movement permitted prior to escrow agreement. | Select approved settlement banking partner (Escrow Account vs Virtual Accounts / NEFT / RTGS / ICICI Eazypay). Formally sign-off on allocation separation rule (payment receipt ≠ debenture allotment). | Chief Financial Officer & Head of Banking Operations |
| **7** | **Financial Return Calculator (DEC-07)** | Legacy formula decommissioned; route `/calculator/` preserved in formal deferred state. | **Deferred to Phase 7:** No online calculator will be published until arithmetic is certified. | CFO certification of exact financial formulas, interest compounding conventions, leap-year handling, and TDS deductions before deploying Phase 7 calculator engine. | Chief Financial Officer / Structuring Lead |
| **8** | **Production Deployment & Domain Cutover** | Local rebuild fully complete at `http://localhost:3000/`. | **Strict Stop Condition in Effect:** Production environment untouched. | Formal written client authorization to configure production CI/CD, TLS certificates, DNS A/CNAME records, and domain cutover. | Managing Director / Product Owner |

---

## 3. Regulatory Safeguards Enacted in Local Rebuild

To ensure zero premature risk exposure:
1. **Separation of Intent vs Verification:** Disclaimers on `/`, `/debt-debenture/`, `/capital-providers/`, and `/regulatory-disclosures/` clearly distinguish preliminary business guidance from contractual commitments.
2. **Elimination of Broken Downloads & External Leaks:** Dead PDF links and third-party Vercel redirects were replaced with first-party advisory enquiry pathways.
3. **Strict DPDP Act 2023 Enforcement:** All form inputs capture explicit consent; data retention exceptions and erasure workflows are transparently documented.
4. **Zero Production Mutation:** The live production website at `https://niventracapitaladvisory.com/` remains completely untouched.
