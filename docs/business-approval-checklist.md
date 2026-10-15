# Niventra Capital Advisory — Business Approval & Compliance Checklist

**Document Version:** 1.0  
**Date:** October 16, 2026  
**Lead Compliance Architect:** Senior Software Architect & Delivery Owner  
**Workspace:** `d:\Projects\niventra website`  

---

## 1. Scope and Objective

This checklist identifies all statutory, legal, financial, and operational decisions that must be formally approved in writing by authorized Niventra corporate executives, legal counsel, and the board of directors **before any production deployment or activation of live financial operations**.

Until these gates are formally signed off, the corresponding platform features remain strictly gated or deferred in accordance with project governance rules.

---

## 2. Business Approval Gate Register

### Gate 1: Issuing Entity & Corporate Legal Structure
- **Current Technical Implementation:** Niventra Capital Advisory is designated as the advisory facilitator and intended issuing entity under Section 42 of the Companies Act, 2013.
- **Required Action:** Independent legal counsel must confirm the exact issuing entity (whether Niventra Capital Advisory India Pvt. Ltd. or a dedicated Special Purpose Vehicle / NBFC partner).
- **Responsible Party:** Managing Director & Legal Counsel.
- **Status:** Pending written board resolution.

### Gate 2: Debenture Return Guidance & Mathematical Verification (Decision 7)
- **Current Technical Implementation:** Public return guidance is standardized to **12%–16% p.a.*** with statutory qualifications. Interactive calculator is formally deferred at `/calculator/`.
- **Required Action:** Structuring Committee and CFO must approve the definitive mathematical cash-flow model (distinguishing simple annual coupons from reinvestment yield) and establish tax deduction (TDS) schedules before interactive calculators can be enabled.
- **Responsible Party:** Chief Financial Officer & Structuring Head.
- **Status:** Calculator safely deferred; guidance locked to approved 12%–16% range.

### Gate 3: Corporate Contact Directory Sign-Off (Decision 3)
- **Current Technical Implementation:**
  - Corporate Office: Patel Nagar City Centre, Gwalior, MP — 474001, India.
  - Delhi Advisory Desk: +91 011 4051 5660.
  - Toll-Free Line: 1800 890 0818.
  - Corporate Email: `info@niventracapitaladvisory.com`.
- **Required Action:** Board confirmation of official registered office versus representative office status in MCA ROC filings.
- **Responsible Party:** Company Secretary & Operations Head.
- **Status:** Parity maintained across all 16 canonical routes.

### Gate 4: Debenture Trustee & Escrow Banking Agreement
- **Current Technical Implementation:** Live real-money investment payments, collection escrow accounts, and automated debenture issuance are disabled.
- **Required Action:** Formal execution of:
  - Debenture Trustee Agreement with a SEBI-registered Trustee.
  - Escrow Cash-Flow Waterfall Agreement with a scheduled commercial bank.
  - Standardized Form PAS-4 Private Placement Offer Letter.
  - Form CHG-9 ROC charge creation process.
- **Responsible Party:** Board of Directors & Escrow Banker.
- **Status:** Strictly gated.

### Gate 5: Grievance Redressal Officer Designation
- **Current Technical Implementation:** Grievance ticketing workflow (`/grievance/`) operates under an institutional 30-day resolution SLA.
- **Required Action:** Formal board notification designating the official Grievance Redressal Officer by name, direct contact email, and telephone.
- **Responsible Party:** Board of Directors.
- **Status:** Operational workflow ready; awaiting officer gazette/board entry.

### Gate 6: Referral Reward Policy Approval
- **Current Technical Implementation:** Referral rewards (1% up to ₹2,000 cap) are completely omitted from active publication and technical execution.
- **Required Action:** Legal compliance review regarding whether referral compensation constitutes broker/intermediary commission requiring regulatory registration under SEBI regulations.
- **Responsible Party:** Compliance Officer & Legal Counsel.
- **Status:** Disabled and excluded from public website.

### Gate 7: Data Protection Officer (DPDP Act, 2023)
- **Current Technical Implementation:** Online data erasure request queue (`/delete-account/`) logs requests under `DEL-2026-XXXX`.
- **Required Action:** Formal designation of Data Protection Officer (DPO) and written statutory data retention schedule.
- **Responsible Party:** Legal & Operations.
- **Status:** Implemented and compliant.
