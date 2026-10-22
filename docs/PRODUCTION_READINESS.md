# Niventra Capital Advisory — Production Readiness & Release Matrix
**Document Owner:** Chief Technology Officer  
**Classification:** Executive Production Release Sign-off Protocol  
**Repository Path:** `docs/PRODUCTION_READINESS.md`  
**Last Updated:** October 2026

---

## 1. Feature Status Matrix

| Module / Route | Architectural Status | Production Readiness | Notes / Outstanding Decisions |
|:---|:---:|:---:|:---|
| **Public Website (16 Canonical Routes)** | **COMPLETE** | **PRODUCTION-READY** | All 16 routes verified with SEO metadata, responsive Tailwind layout, and compliant legal copy. |
| **Protected Real-Estate Page (`/real-estate/`)** | **COMPLETE** | **PRODUCTION-READY** | Preserved with all original visual assets (`re_*`). |
| **Branch Directory (`/contact/`)** | **COMPLETE** | **PRODUCTION-READY (PUBLISHED HO)** | Verified Corporate Head Office (Gwalior) published. 24 unverified legacy locations held in audit isolation. |
| **Lead Generation (`POST /api/enquiries`)** | **COMPLETE** | **PRODUCTION-READY (LOCAL)** | Honeypot defense, 60s duplicate throttling, serialized reference numbering active. |
| **External Lead Email Notification** | **COMPLETE** | **BLOCKED (CONFIG REQUIRED)** | Transport adapter built; requires `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAILS`. |
| **Investor Portal (`/dashboard/`)** | **COMPLETE** | **DEMO-READY / TESTED** | Session auth, holdings ledgers, calculator, and KYC workflows functional with demo fixtures. |
| **Executive Desk (`/admin/`)** | **COMPLETE** | **PRODUCTION-READY** | Role-protected CRM pipeline, enquiry status management, and audit log inspection. |
| **Calculation Engine (`src/lib/calculator.ts`)** | **COMPLETE** | **PRODUCTION-READY** | Simple-interest debenture standard, input clamping, TDS caveats verified across 42 automated tests. |
| **Real-Money Checkout / Payment Gateway** | **NOT IMPLEMENTED** | **DISABLED BY DESIGN** | In compliance with SEBI Private Placement norms, payments must occur via escrow bank transfers. |

---

## 2. Production Blockers & Decisions Required

| # | Domain | Specific Blocker | Exact Decision / Input Needed from Management |
|:---:|:---|:---|:---|
| **1** | **Branch Directory** | Unverified regional locations | Managing Director or Company Secretary sign-off on physical lease agreements for cities beyond Gwalior Head Office. |
| **2** | **Lead Dispatch** | Staff notification mailbox | Management decision designating official authorized inbox (e.g. `inquiries@niventracapitaladvisory.com`). |
| **3** | **Database Persistence** | Ephemeral `/tmp` storage on Vercel | Provision a managed PostgreSQL database (e.g. Neon or Supabase) and supply `DATABASE_URL` in hosting provider settings. |
| **4** | **Email Gateway** | Outbound transactional transport | Provision Resend / AWS SES account, verify domain DNS records (SPF/DKIM/DMARC), and supply `RESEND_API_KEY`. |

---

## 3. Managed PostgreSQL Migration Plan

When transitioning from local development SQLite to production serverless PostgreSQL (e.g. Neon):

1. **Adapter Switch:** The provider-neutral interface in [`src/lib/database/adapter.ts`](file:///D:/Projects/niventra%20website/src/lib/database/adapter.ts) ensures that swapping storage engines requires no modifications to API routes or frontend components.
2. **Schema Mirroring:** PostgreSQL schema matching the SQLite schema:
   - `users` (UUID primary key, scrypt password hashes)
   - `sessions` (token index)
   - `enquiries` (serialized reference sequence, duplicate index)
   - `investments` & `investment_transactions` (decimal amounts, date indices)
   - `kyc_records` (masked PII)
   - `audit_logs` (immutable append-only)
3. **Data Preservation:** Run export script `scripts/export-sqlite-to-pg.mjs` to transfer existing registered accounts and audit logs before switching `DATABASE_URL`.
