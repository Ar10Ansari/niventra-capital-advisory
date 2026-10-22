# Niventra Capital Advisory — Lead Generation & Enquiry Pipeline
**Document Owner:** Chief Technology Officer  
**Classification:** Technical Architecture & Operational Guide  
**Repository Path:** `docs/LEAD_GENERATION_SETUP.md`  
**Last Updated:** October 2026

---

## 1. Overview & Architectural Principles

The lead generation system captures institutional consultations, investor inquiries, and corporate debt restructuring requests through a secure, compliant, and auditable pipeline.

### Core Fiduciary Guarantees:
1. **Never Falsely Imply Delivery:** If email credentials are not configured, the application explicitly logs to a local audit sink and informs the admin console that the event was recorded in `MOCK SINK` mode.
2. **DPDP Act 2023 Compliance:** Every public enquiry requires explicit, unbundled consent before processing.
3. **No PII Leaks in Logs:** Email addresses in logs are cryptographically masked (`a***r@domain.com`).
4. **Idempotency & Anti-Spam Defense:** Automated submissions filling the hidden honeypot (`website_hp`) are immediately terminated. Identical submissions within a 60-second window return the existing reference number idempotently without duplicate lead creation.

---

## 2. Lead Capture Control Flow

```
[ Visitor / Investor ]
        │
        ▼ (Submits Consultation Form)
[ Client Validation ] ──► (Checks full name, valid email, 10-digit mobile, DPDP consent)
        │
        ▼ POST /api/enquiries
[ Bot & Spam Shields ]
   ├── Honeypot check: If `website_hp` is filled ──► Return 400 (Rejected)
   └── Deduplication: Same email + phone within 60s ──► Return existing Ref ID (Idempotent)
        │
        ▼
[ Serialized Reference ID Generation ] ──► ENQ-2026-0001, ENQ-2026-0002...
        │
        ▼
[ Database Storage ] ──► Insert into `enquiries` table (Status: 'NEW')
        │
        ▼
[ Provider-Neutral Notification Dispatcher ]
   ├── IF `RESEND_API_KEY` & `LEAD_NOTIFICATION_EMAILS` are configured:
   │      └── Dispatches external email alert to authorized staff mailbox via REST API
   └── ELSE:
          └── Writes structured JSON event to `data/email_sink.log` (Safe Local Mock)
        │
        ▼
[ User-Facing Confirmation ]
   └── Displays Reference ID with explicit notice: "Enquiry logged in advisory registry."
```

---

## 3. Environment Variables Configuration

To configure production lead notifications, set the following environment variables in your deployment environment (e.g. Vercel Project Settings). **Never commit secret values to Git.**

| Variable Name | Required For | Description | Example / Recommended Format |
|:---|:---:|:---|:---|
| `LEAD_NOTIFICATION_EMAILS` | Production Notifications | Comma-separated list of authorized staff lead recipient mailboxes. | `inquiries@niventracapitaladvisory.com,desk@niventracapitaladvisory.com` |
| `RESEND_API_KEY` | Production Email Transport | API key from approved transactional email gateway (Resend / AWS SES). | `re_live_xxxxxxxxxxxxxxxxxxxxxxxx` |
| `EMAIL_FROM` | Production Email Transport | Verified sender email address matching authenticated domain DNS. | `Niventra Advisory <notifications@niventracapitaladvisory.com>` |
| `DATABASE_URL` | Multi-Container Production | Pooled PostgreSQL connection string for persistent lead persistence. | `postgres://user:password@ep-xyz.neon.tech/niventra?sslmode=require` |

---

## 4. Administrative Deal Pipeline & Status Tracking

Desk operators and administrators review submissions in the **Executive Desk (`/admin/`)**:

- **Lead Statuses:**
  - `NEW`: Inward consultation recorded; pending initial desk assignment.
  - `IN_REVIEW`: Assigned operator is reviewing capital requirements or financial statements.
  - `CONTACTED`: Desk operator conducted initial telephone/WhatsApp intake.
  - `QUALIFIED`: Prospect meets accredited investor / corporate debt placement criteria.
  - `FOLLOW_UP`: Detailed term sheet or PAS-4 offer document pending client response.
  - `CONVERTED`: Private placement debenture allocation or advisory mandate executed.
  - `CLOSED`: Inquiry archived, ineligible, or withdrawn.

- **Internal Confidential Notes:** Staff can append follow-up notes that are strictly hidden from public and investor views.
- **Observable Transport Status:** Admin table displays an explicit badge (`MOCK SINK (Logged)` vs `EXTERNAL DISPATCHED`), guaranteeing absolute visibility into email delivery status.
