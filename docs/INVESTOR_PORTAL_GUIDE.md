# Niventra Capital Advisory — Investor Portal Architecture & Guide
**Document Owner:** Chief Technology Officer  
**Classification:** Technical & Security Architecture  
**Repository Path:** `docs/INVESTOR_PORTAL_GUIDE.md`  
**Last Updated:** October 2026

---

## 1. System Overview & Security Principles

The Niventra Client Portal (`/dashboard/`) provides accredited investors and corporate capital providers with institutional transparency into debenture holdings, coupon disbursements, compliance filings, and statutory identity documentation.

### Non-Negotiable Security Rules:
1. **Strict Cross-Investor Data Isolation:** Every protected API route (`/api/investments`, `/api/investments/[id]`, `/api/kyc`, `/api/enquiries`) validates session tokens server-side. If a regular `INVESTOR` attempts to supply another user's ID in query parameters or URL pathnames, the API immediately terminates the request with `403 Forbidden`.
2. **Distinct Accounting Metrics:** Interest accrued in accordance with accounting schedules, interest actually disbursed via banking rails, and pending coupon disbursements are presented as separate, distinct figures. They are NEVER conflated into an ambiguous "Total Return".
3. **Conspicuous Demo Disclosures:** In development and staging environments, all simulated investment holdings, balances, and ledger transactions bear clear `[DEMO RECORD]` badges.

---

## 2. Role-Based Access Control (RBAC) Hierarchy

| Role | Access Scope | Allowed Routes & APIs |
|:---|:---|:---|
| `PUBLIC` | Unauthenticated website visitor | Homepage, products, calculator, contact, disclosures, login, register. |
| `INVESTOR` | Registered client / debenture subscriber | Client Portal (`/dashboard/`), own holdings, own ledgers, own KYC, own consultations, own document downloads. |
| `STAFF` | Advisory desk operator | Client Portal, Executive Desk (`/admin/`), view all enquiries, assign leads, append internal notes, view all documents. |
| `ADMIN` | Managing Director / Compliance Head | Full administrative command, user role management, KYC approvals/rejections, audit log inspection, payout reconciliation. |

---

## 3. Financial Calculation Standards

### Simple-Interest Debenture Formula
In strict alignment with Indian debenture market standards (and unlike equity SIP compounding models), private placement debentures pay periodic simple-interest coupons on the outstanding face value:

$$\text{Gross Periodic Coupon} = \frac{\text{Principal} \times \text{Annual Rate} \times \text{Period Fraction}}{100}$$

$$\text{Total Gross Interest} = \text{Principal} \times \frac{\text{Annual Rate}}{100} \times \frac{\text{Tenor (Months)}}{12}$$

### Statutory TDS Withholding (Section 193/194A)
$$\text{Estimated TDS} = \text{Total Gross Interest} \times 10\%$$
$$\text{Net Estimated Interest} = \text{Total Gross Interest} - \text{Estimated TDS}$$

*Caveat:* Actual withholding tax varies depending on whether Form 15G/15H is furnished or whether the corporate subscriber is exempt under Section 194A(3).

---

## 4. KYC & DPDP Compliance Protocol

1. **Identity Submission (`POST /api/kyc`):** Investor submits PAN identifier and identity document reference with mandatory DPDP consent.
2. **Cryptographic Masking:** Identity numbers are masked (`AAAPN*****1F`, `********4829`) prior to storage to protect personal data.
3. **Administrative Verification (`PATCH /api/kyc`):** Compliance officers review submitted documents and transition status to `VERIFIED` or `REJECTED` (with explicit reason).
4. **Audit Logging:** Every KYC submission and review action creates an immutable record in `audit_logs`.
