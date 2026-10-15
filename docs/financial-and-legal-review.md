# Niventra Capital Advisory — Financial & Legal Review

**Audit Date:** October 15, 2026  
**Auditor:** Senior Financial-Services Auditor & Regulatory Compliance Specialist  
**Target Domain:** `https://niventracapitaladvisory.com`  
**Classification:** Regulatory Risk Analysis, Discrepancy Register & Stakeholder Inquiries  

---

## 1. Regulatory Context & Review Framework

As an entity operating in the Indian financial services and real estate capital sector, Niventra Capital Advisory India Pvt. Ltd. operates within an intersection of statutory frameworks, including:
1. **Companies Act, 2013:** Section 42 (Private Placement of Securities), Section 71 (Debentures), and Companies (Share Capital and Debentures) Rules, 2014.
2. **SEBI Regulations:** SEBI (Issue and Listing of Non-Convertible Securities) Regulations, 2021; SEBI (Prohibition of Fraudulent and Unfair Trade Practices) Regulations; SEBI (Investment Advisers) Regulations, 2013 (if advisory services are rendered).
3. **RBI Master Directions:** Non-Banking Financial Company regulations (if funds are pooled or lending activities are conducted directly), and private credit guidelines.
4. **Digital Personal Data Protection (DPDP) Act, 2023:** Lawful basis of processing, notice, consent, data principal rights, and deletion protocols.
5. **Consumer Protection Act, 2019:** Misleading advertisement regulations and e-commerce consumer disclosures.

*Important Notice: All observations in this document are objective audit findings requiring verification by authorized corporate stakeholders, legal counsel, and compliance officers. These findings do not constitute legal conclusions or proof of wrongdoing.*

---

## 2. Inconsistencies & Unsupported Claims Register

### Finding 1: Issuer Identity — Confirmed Business Intent vs Mandatory Legal Verification
- **Page & Location:** `/capital-providers/` (under "Key Highlights -> Issuer Entity") vs `/` vs User Phase 1.2 Confirmation.
- **Current Website Statement:**
  > "Issuer Entity: Specific Special Purpose Vehicle (SPV) or Corporate Entity."
- **User-Confirmed Business Requirement (Phase 1.2):**
  > **Niventra Capital Advisory itself is intended to be the legal issuer of the initial debenture product.**
- **Legal Verification Boundary (Intent vs Verification):**
  While stakeholder business intent is now confirmed, this intent is strictly distinguished from independent legal verification. Before any investment, onboarding, or payment functionality can be implemented, the authorized company legal and compliance team must independently confirm:
  1. The exact issuing corporate entity name, verified Corporate Identification Number (CIN), registered office, and authorized share capital under the Companies Act, 2013.
  2. The statutory issuance structure: Section 71 (Debentures), Section 42 (Private Placement of Securities), and Companies (Share Capital and Debentures) Rules, 2014.
  3. Appointment of a SEBI-registered Debenture Trustee and execution of the Debenture Trust Deed (Form SH-12).
  4. Creation of security and ROC charge registration (Form CHG-9) within statutory timelines.
  5. Mandatory Debenture Redemption Reserve (DRR) obligations and investor eligibility criteria.
  *No registration numbers, permissions, or compliance approvals are assumed or fabricated.*
- **Question for the Legal / Compliance Team:**
  *What is the exact registered legal corporate entity, CIN, and authorized issuance limit for Niventra's debenture offering? Has legal counsel drafted the Private Placement Offer Letter (Form PAS-4) and certified compliance with Section 42 and Section 71?*
- **Appropriate Reviewer:** General Counsel, Company Secretary & Managing Director.

---

### Finding 2: Debenture Return Guidance (Preliminary 12%–16%) vs Live Marketing (14%–16%)
- **Page & Location:** `/debt-debenture/` (Bullet 5), `/capital-providers/` (Highlight 2), `/` (Core Services card) vs User Phase 1.2 Guidance.
- **Current Live Website Statement:**
  > "Target returns of 14% - 16% per annum" / "Targeting 14% - 16% per annum (as per offer document)."
- **Current User-Provided Guidance (Phase 1.2):**
  > **Debenture returns are currently understood to fall within a preliminary range of 12% – 16%.**
- **Governance & Content Policy:**
  - **Do NOT automatically overwrite the live website's 14%–16% text with 12%–16%.** The live website's existing advertised figures are preserved in the content inventory baseline.
  - The 12%–16% range is recorded strictly as **preliminary business guidance**, not as a verified contractual rate, approved public advertisement, or guaranteed return.
  - Approval of the final public marketing wording and accompanying statutory risk disclosures is required from compliance counsel before any public content change is made.
- **Unresolved Financial & Structuring Specifications:**
  1. *Measure of Return:* Does 12%–16% represent a fixed coupon rate, target yield, internal rate of return (IRR), or annualized simple interest?
  2. *Product Tranches:* Which specific debenture series, tenures (e.g., 12, 24, 36 months), and risk tranches offer which rates?
  3. *Payout Frequency:* Is interest distributed monthly, quarterly, semi-annually, annually, or cumulatively at maturity?
  4. *Calculation Convention:* Is interest calculated as simple interest or compounded?
  5. *Day-Count & Conventions:* What day-count convention applies (Actual/365, Actual/Actual, or 30/360), and how are non-business days and leap years treated?
  6. *Tax Withholding & Fees:* What TDS withholding rate (Section 193/194A) and structuring deductions apply?
  7. *Public Marketing Clearance:* Has compliance counsel approved public display of this yield range alongside the mandatory disclaimers required under SEBI advertising codes and ASCI guidelines?
- **Question for Finance & Compliance:**
  *What is the verified term sheet specifying the coupon rate, tenure tiers, payout frequency, day-count convention, and TDS treatment? Has compliance approved the public marketing copy and co-located risk disclaimers?*
- **Appropriate Reviewer:** Chief Compliance Officer & Chief Financial Officer.

---

### Finding 3: Mathematical Discrepancy in Illustrative Calculation Example
- **Page & Location:** `/capital-providers/` (under "Illustrative Bond Example").
- **Current Website Statement:**
  > "Investment Amount: ₹50,000"  
  > "Tenure: 1 Month (Illustrative)"  
  > "Coupon Rate: 14 - 16% p.a. (illustrative range)"  
  > "Expected Return: ₹50,360 (after 1 month)"
- **Why It Needs Review:**
  Mathematical verification reveals an arithmetic inconsistency:
  - If coupon is 14% p.a. simple interest: Monthly Interest = `₹50,000 × (14% / 12) = ₹583.33` (Total Return = **₹50,583.33**).
  - If coupon is 16% p.a. simple interest: Monthly Interest = `₹50,000 × (16% / 12) = ₹666.67` (Total Return = **₹50,666.67**).
  - If TDS is withheld at 10% on 14%: Net Interest = `₹525.00` (Total Return = **₹50,525.00**).
  - If TDS is withheld at 10% on 16%: Net Interest = `₹600.00` (Total Return = **₹50,600.00**).
  - The stated return of ₹50,360 reflects an interest amount of only **₹360.00**, which corresponds to an annualized simple interest yield of only **8.64% per annum** (`(360 / 50,000) × 12 = 8.64%`).
  Publishing a table displaying a 14%-16% coupon while the arithmetic demonstrates an effective return of ₹50,360 (8.64% p.a.) creates investor confusion and warrants formal verification of the underlying methodology, assumptions, or deduction model.
- **Question for the Company:**
  *What specific mathematical formula, fee deductions, tax withholding (TDS), or compounding methodology produced the ₹50,360 figure on a ₹50,000 investment? If this is an editorial or typographical error from legacy copy, what is the authorized illustrative calculation model?*
- **Appropriate Reviewer:** Financial Engineering Lead & Compliance Officer.

---

### Finding 4: Inappropriate SIP Compounding Calculator on Debt Website
- **Page & Location:** Homepage Hero (`/`) and `assets/js/script.js` (lines 100-146).
- **Current Website Statement / Logic:**
  > Interactive Hero slider calculating estimated future value using an equity/mutual-fund SIP compounding formula:  
  > `FV = P * (((1 + i)^n - 1) / i) * (1 + i)` with `i = 0.16 / 12` (16% annual rate compounded monthly).
- **Why It Needs Review:**
  Debentures and structured debt instruments are typically lump-sum fixed-income securities with periodic coupon distributions and maturity redemption. They are fundamentally distinct from Systematic Investment Plans (SIPs). Applying a mutual-fund SIP formula that implies investors can deposit monthly installments and receive monthly exponential compounding at a fixed 16% annualized rate is inconsistent with debt debenture mechanics and requires product alignment review.
- **Question for the Company:**
  *Does Niventra offer any recurring SIP product, or is this slider an artifact of generic website template code? Should this hero slider be replaced with an institutional Debenture Coupon & Yield Estimator?*
- **Appropriate Reviewer:** Financial Architect & Marketing Lead.

---

### Finding 5: Third-Party Form Redirection, Inactive Endpoint & Data Governance Question
- **Page & Location:** `/capital-providers/` (Application Form link).
- **Current Website Statement / Destination:**
  > Button "Application Form / Subscription Form" links to:  
  > `https://crm-teal-one-29.vercel.app/debenture-application?ref=MDSDWK-00I`
- **Observed Behavior & Verification Pass Evidence:**
  - **HTTP 404 Not Found:** Independent live verification confirmed that `https://crm-teal-one-29.vercel.app/debenture-application?ref=MDSDWK-00I` currently returns an **HTTP 404 (Not Found)** error. The target application page is unavailable.
- **Why It Needs Review:**
  Redirecting prospective investors who are seeking debenture application materials off-domain to an unbranded external Vercel deployment presents two significant concerns:
  1. **User Experience & Conversion Defect:** Prospective investors encounter a dead 404 error page, completely blocking application submission.
  2. **Data Governance & DPDP Consideration:** If active, collecting investor PII and financial eligibility data on an external third-party domain outside Niventra's primary infrastructure raises data custody questions under the Digital Personal Data Protection (DPDP) Act, 2023.
- **Question for the Company:**
  *Who previously owned and administered `crm-teal-one-29.vercel.app`? Should this dead external link be completely replaced with a native, secure, first-party investor application workflow hosted directly on the official Niventra domain?*
- **Appropriate Reviewer:** Chief Information Security Officer (CISO) & Legal Counsel.

---

### Finding 6: Missing Statutory Offer Document and Term Sheet PDFs
- **Page & Location:** `/capital-providers/` (Required Documents section).
- **Current Website Statement / Destination:**
  > Links to `/assets/docs/sample_offer_document.pdf` and `/assets/docs/sample_term_sheet.pdf`.
- **Observed Behavior:**
  Both links return HTTP 200 with the HTML homepage (soft 404). Neither PDF exists.
- **Why It Needs Review:**
  Advertising that sample offer documents and term sheets are available, while serving dead links that secretly loop to the homepage, violates basic transparency and frustrates investor due diligence.
- **Question for the Company:**
  *Where are the approved, redacted sample Information Memorandum and Term Sheet documents? What legal review is required before hosting them publicly?*
- **Appropriate Reviewer:** Legal Counsel & Corporate Secretary.

---

### Finding 7: Inconsistent Telephony & WhatsApp Routing
- **Page & Location:** `/debt-debenture/` and `/capital-providers/` footers vs `/` and `/contact/`.
- **Current Website Statement:**
  - Displayed in footers of `/debt-debenture/` and `/capital-providers/`: `+91 01140515660` (Delhi landline).
  - Underlying `href` on those links: `tel:18008900818` (Toll-Free).
  - WhatsApp chat link on `/contact/`: `https://wa.me/917428280200` (`+91 74282 80200`).
- **Why It Needs Review:**
  Telephony mismatches create confusion and can lead investors to suspect spoofing or fraudulent operations.
- **Question for the Company:**
  *Which phone numbers are official, operational company communication lines? Should the Delhi landline (`01140515660`), toll-free (`18008900818`), and WhatsApp line (`7428280200`) all be retained and correctly matched in machine-readable markup?*
- **Appropriate Reviewer:** Customer Operations & Marketing Lead.

---

### Finding 8: Truncated / Missing Sections on Investor Information Page
- **Page & Location:** `/investor-information/`.
- **Current Website Content:**
  > Displays only:  
  > `## 8. Risk Factors`  
  > `## 11. Grievance / Contact Process`  
  > `## 12. Regulatory Disclosures`
- **Why It Needs Review:**
  Clauses 1, 2, 3, 4, 5, 6, 7, 9, and 10 are completely absent. This suggests that the live page was deployed with incomplete or truncated content from an original 12-point policy document.
- **Question for the Company:**
  *What were clauses 1 through 7, 9, and 10 of the Investor Information policy? Can management supply the complete un-truncated text for inclusion in the rebuilt platform?*
- **Appropriate Reviewer:** Corporate Secretary & Legal Counsel.

---

### Finding 9: Account Deletion vs Platform Reality
- **Page & Location:** `/delete-account/`.
- **Current Website Statement:**
  > "If you wish to delete your account and all associated personal data from our platform, you can initiate the process below... Send an email to info@niventracapitaladvisory.com..."
- **Why It Needs Review:**
  The current website possesses no user accounts, authentication system, or registered user databases. Offering an account deletion procedure for a platform that has no user accounts suggests either:
  1. An external mobile app or unlinked portal exists elsewhere.
  2. Boilerplate compliance text was copied from a template without tailoring to current functionality.
- **Question for the Company:**
  *Does Niventra currently maintain user accounts on any associated mobile app or legacy CRM? How should this policy be integrated into the upcoming authenticated investor portal?*
- **Appropriate Reviewer:** Technical Lead & Compliance Officer.

---

## 3. Required Pre-Implementation Approvals Matrix

Before any production code, financial calculators, user registration, or payment workflows can be initialized in downstream phases, the following explicit sign-offs must be obtained:

| Approval Area | Scope & Required Sign-Off | Responsible Stakeholder | Phase Gate Dependency |
| :--- | :--- | :--- | :--- |
| **Legal Entity & Issuer Role** | Written confirmation of whether Niventra is the direct issuer or capital advisory intermediary, including applicable CIN, GSTIN, and regulatory registration numbers. | General Counsel / Managing Director | **Phase 2 Gate** (Prerequisite for Phase 4 & Phase 7) |
| **Advertised Return Language** | Written approval of exact marketing copy for target returns, yield ranges, and accompanying statutory disclaimers. | Chief Compliance Officer | **Phase 2 Gate** (Prerequisite for Phase 4) |
| **Financial Calculation Models** | Formal sign-off on the mathematical formulas, compounding conventions (simple vs compound), day-count conventions, and tax withholding rules for the calculator. | Chief Financial Officer / Head of Structuring | **Phase 2 Gate** (Prerequisite for Phase 7) |
| **Investment Offering Documents** | Provision of authentic, approved, and watermarked sample Information Memorandum and Term Sheet PDFs. | Legal Counsel / Corporate Secretary | **Phase 2 Gate** (Prerequisite for Phase 4 & 5) |
| **Proposed Referral Policy** | Regulatory evaluation and formal policy decision on whether the proposed referral model (1% up to ₹2,000) complies with SEBI/RBI regulations and tax TDS (Section 194H) rules. | Legal & Tax Advisory | **Phase 2 Gate** (Prerequisite for Phase 8) |
| **Payment Gateway & Settlement Model** | Selection and legal approval of escrow/settlement partner, payout model, and banking APIs. | CFO & Compliance Officer | **Phase 2 Gate** (Prerequisite for Phase 8) |
