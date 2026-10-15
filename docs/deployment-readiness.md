# Niventra Capital Advisory — Deployment Readiness Assessment

**Document Version:** 1.0  
**Date:** October 16, 2026  
**Lead DevOps & Systems Architect:** Lead Full-Stack Architect  
**Workspace:** `d:\Projects\niventra website`  
**Deployment Target:** Production Staging / Live Server  

---

## 1. Readiness Summary

```text
================================================================================
COMPONENT / CRITERIA                       READINESS    CURRENT LOCAL STATUS
================================================================================
1. Application Build (`next build`)        [100%]       ✅ Passed (36/36 Routes Prerendered)
2. TypeScript Strict Typechecking          [100%]       ✅ Passed (0 Errors)
3. ESLint & React 19 Compliance            [100%]       ✅ Passed (0 Errors, 0 Warnings)
4. Automated Test Suite (`npm test`)       [100%]       ✅ Passed (23/23 Tests Passed)
5. Security & RBAC Enforcement             [100%]       ✅ Passed (4 Roles Guarded)
6. Grounded AI Retrieval & Guardrails      [100%]       ✅ Passed (Injections Blocked)
7. Production Database Connection          [  0%]       ⏳ Pending Production PostgreSQL URL
8. Production SMTP / Email Provider        [  0%]       ⏳ Using Local Sink (data/email_sink.log)
9. Production Turnstile CAPTCHA Keys       [  0%]       ⏳ Pending Cloudflare Secret Key
10. Final Legal & Escrow Approvals         [  0%]       ⏳ Pending Board Sign-Off
================================================================================
```

---

## 2. Distinction of Platform Capabilities

In accordance with execution instructions, the platform deliverables are categorized into 5 explicit states:

### Category 1: Fully Implemented & Tested
1. **Public Website (16 Routes):** All pages rendered, responsive, accessible, with consistent modern institutional styling and original emblem preservation.
2. **Design System & Components:** Shared Header with Client Portal access, Footer with directory and statutory disclaimer, PageHero, Accordion, Breadcrumb, CalloutNotice, Button, Badge.
3. **Database Persistence:** Relational schema running on native SQLite in WAL journal mode (`data/niventra.db`).
4. **Authentication & RBAC:** Scrypt password hashing with salt, timing-safe equality, HTTP-only session cookies, server-side guards for `PUBLIC`, `INVESTOR`, `STAFF`, `ADMIN`.
5. **Investor Dashboard (`/dashboard`):** Overview metrics, active consultation tracker, document downloads, and grievance history.
6. **Admin Executive Desk (`/admin`):** CRM enquiry pipeline with status selector and internal notes, grievance tickets with 30-day SLA, product catalogue, document governance, and immutable audit logs.
7. **Grounded AI Advisory Assistant:** Interactive chatbot widget with knowledge retrieval, source citations, prompt-injection defenses, and human advisory fallback.
8. **Consultation & CRM Pipeline:** Live form connected to `/api/enquiries` generating real serialized `ENQ-2026-XXXX` references.
9. **Grievance Redressal Mechanism:** Live form connected to `/api/grievances` generating real serialized `GRV-2026-XXXX` tickets with 30-day statutory SLA tracking.
10. **Data Privacy (DPDP Act 2023):** Account deletion request form connected to `/api/account/delete` generating serialized `DEL-2026-XXXX` references with statutory retention exceptions.
11. **Immutable Audit Logging:** System audit trail capturing authentication, downloads, and status transitions.

### Category 2: Implemented but Awaiting External Credentials
1. **Production Database:** Ready for PostgreSQL connection string (`DATABASE_URL`).
2. **Transactional Email Service:** Notification engine implemented; currently recording to local file sink (`data/email_sink.log`). Awaiting production SMTP / SendGrid credentials.
3. **Bot Protection:** Form validation ready; awaiting live Cloudflare Turnstile secret key.
4. **Optional LLM Model:** Grounded knowledge retrieval operational locally; awaiting production Gemini/OpenAI API key if live generative expansion is desired.

### Category 3: Implemented but Awaiting Approved Company Content
1. **Corporate Document Binaries:** Document center streams authentic template PDF binaries from `storage/documents/`. Awaiting executed, board-approved final PAS-4 offer documents and signed term sheets.
2. **Official Grievance Officer Bio:** Contact channel and SLA tracking active; awaiting formal board resolution naming the designated officer.

### Category 4: Disabled Pending Legal, Compliance, Finance, or Operational Approval
1. **Interactive Return Calculator:** Formally deferred at `/calculator/` with an honest disclosure of legacy calculation flaws. Interactive computation disabled pending CFO mathematical review.
2. **Real-Money Payment Gateway:** Disabled by design. No live payment APIs, bank integrations, or funds collection forms exist.
3. **Automated Debenture Issuance & Allocation:** Gated until SEBI-registered Debenture Trustee and ROC Form CHG-9 filing procedures are formally finalized.
4. **Referral Reward Program:** Excluded from publication and execution pending regulatory review of intermediary broker guidelines.

### Category 5: Incomplete or Blocked Features
- **None.** All implementable platform features, databases, APIs, UI dashboards, and security controls have been completed locally without blockers.

---

## 3. Next Steps for Production Rollout

1. **Step 1:** Review this local application and test evidence on `http://localhost:3000/`.
2. **Step 2:** Formally complete the executive approvals in `docs/business-approval-checklist.md`.
3. **Step 3:** Provision production PostgreSQL database and populate production environment variables in `docs/integration-setup.md`.
4. **Step 4:** Execute production deployment to staging/production infrastructure under explicit user authorization.
