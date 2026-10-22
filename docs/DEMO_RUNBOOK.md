# Niventra Capital Advisory — Executive Presentation Demo Runbook
**Document Owner:** Chief Technology Officer  
**Classification:** Operational Runbook & Walkthrough Script  
**Repository Path:** `docs/DEMO_RUNBOOK.md`  
**Last Updated:** October 2026

---

## 1. Local Launch Commands

To launch the application locally for tomorrow's executive presentation:

```bash
# 1. Navigate to project root
cd "D:\Projects\niventra website"

# 2. Seed reproducible demo fixtures (Safe development seeder)
node scripts/seed-demo.mjs

# 3. Start local development server
npm run dev
```

The application will be accessible at: **`http://localhost:3000`**

---

## 2. Repeatable Presentation Credentials

| Persona | Role | Email | Password | Primary Purpose |
|:---|:---:|:---|:---|:---|
| **Vikramaditya Sharma** | `INVESTOR` | `investor@example.com` | `DemoInvestor2026!#` | Demonstrates Investor Portal, active debenture holdings, transaction ledgers, calculator, and verified KYC status. |
| **Desk Operator** | `STAFF` | `staff@niventra.local` | `DemoStaff2026!#` | Demonstrates Enquiry pipeline review, lead note logging, and status transitions. |
| **System Administrator** | `ADMIN` | `admin@niventra.local` | `DemoAdmin2026!#` | Demonstrates complete executive oversight, audit logs, KYC approvals, and system telemetry. |

---

## 3. Recommended 11-Step Executive Walkthrough Script

| Step | Screen / URL | Talking Points & Feature Demonstration |
|:---:|:---|:---|
| **1** | **Homepage (`/`)** | Showcase clean light institutional palette, brand heritage, and core advisory pillars. Highlight absence of aggressive popups or unrealistic return claims. |
| **2** | **Debenture Products (`/debt-debenture/` & `/products/`)** | Explain private placement debenture structures (Secured NCDs, urban redevelopment debt). Emphasize qualified yield band (12%–16% p.a.*) and legal backing (ROC CHG-9 filings). |
| **3** | **Branch Directory (`/contact/`)** | Demonstrate real-time instant search by city, state, or PIN code (e.g. typing `474001` or `Gwalior`). Explain that only verified Corporate Head Office is published, while regional locations remain in audit isolation pending lease review. |
| **4** | **Consultation Form (`/contact/`)** | Submit a live enquiry (e.g. "Family Office Allocation"). Show client-side validation, DPDP consent checkbox, and instant generation of a unique reference ID (e.g. `ENQ-2026-0004`). |
| **5** | **Lead Dispatch & Transport** | Point out the confirmation screen: it confirms registration in the advisory registry without falsely claiming external email delivery. Show `data/email_sink.log` where the event was recorded with masked PII. |
| **6** | **Investor Sign-In (`/login/`)** | Log in as `investor@example.com` (`DemoInvestor2026!#`). Note secure HTTP-only session cookie authentication and timing-safe password verification. |
| **7** | **Investor Portal Overview (`/dashboard/`)** | Point out the 4 primary portfolio accounting cards: Total Principal (`₹25,00,000 [DEMO]`), Interest Paid (`₹1,83,750`), Accrued Interest (`₹2,50,625`), and Next Scheduled Payout (`15 Oct 2026`). Conspicuously marked as demo fixtures. |
| **8** | **Holdings & Ledgers Tab** | Expand transaction ledger on `INV-DEMO-001`. Show real ledger entries: Initial NEFT allocation (`₹15,00,000`) and two disbursed quarterly CMS coupons (`₹54,375` each). |
| **9** | **Embedded Yield Calculator** | Open the Calculator tab inside the portal. Adjust principal slider to ₹25 Lakh and tenor to 36 Months. Explain the simple-interest mathematical model and 10% statutory TDS deduction under Section 193. |
| **10** | **KYC & Regulatory Compliance Tab** | Show verified institutional KYC documentation with masked PAN (`AAAPN*****1F`) and statutory DPDP compliance notes. |
| **11** | **Executive Desk (`/admin/`)** | Sign out and sign in as `admin@niventra.local` (`DemoAdmin2026!#`). Review the CRM deal pipeline, demonstrate updating enquiry status (`QUALIFIED`, `FOLLOW_UP`), and inspect immutable audit logs. |

---

## 4. Live vs. Simulated Integration Boundaries

| Capability | Current Demo State | What Production Requires |
|:---|:---:|:---|
| **Branch Directory** | **LIVE** | Managing Director approval of physical lease deeds for remaining regional cities. |
| **Consultation Form** | **LIVE** | Ready for public traffic. |
| **Lead Email Alerts** | **MOCKED** (Logged to local audit sink) | `RESEND_API_KEY` + authorized staff inbox (`LEAD_NOTIFICATION_EMAILS`). |
| **Database Persistence** | **LOCAL SQLITE** | Managed PostgreSQL connection string (`DATABASE_URL`). |
| **Investor Dashboard** | **LIVE LOGIC / DEMO SEEDS** | Client integration with official Registrar & Transfer Agent (RTA) / Escrow Bank. |
| **Real Money Checkout** | **DISABLED BY DESIGN** | Prohibited under SEBI Private Placement rules; funds move via direct investor escrow banking rails. |
