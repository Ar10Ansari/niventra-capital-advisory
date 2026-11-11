# Niventra Capital Advisory — Truthful Project Implementation Status

**Last Verified:** November 12, 2026  
**Purpose:** Evidence-based feature status matrix preventing overstated readiness claims ahead of staging or production cutover.

---

## 1. Classification Legend

| Status | Definition |
| :--- | :--- |
| **Implemented and verified** | Built in codebase and verified cleanly by automated tests/builds in this repository. |
| **Implemented but integration pending** | Code and internal tests work locally/mocked, but live external infrastructure or UI wiring is incomplete. |
| **Prototype or demonstration only** | Works cleanly as UI/mock/local SQLite demo fixture; unsafe or incomplete for live investor production use. |
| **In development** | Partially implemented across stacks with known gaps in completeness or schema constraints. |
| **Not implemented** | No production code exists yet (stubs, templates, or placeholders only). |
| **Blocked by external dependency or approval** | Requires third-party credentials, infrastructure provisioning, or corporate/legal/regulatory sign-off (`DEC-01`–`DEC-07`). |

---

## 2. Feature & Capability Matrix

| Feature / Domain | Current Status | Code & Verification Evidence | Known Gaps / Remaining Work |
| :--- | :--- | :--- | :--- |
| **Public Website (`16` Canonical Routes)** | **Implemented and verified** | `src/app/**/page.tsx`, Next.js build compiles all `48` routes; `52` root tests pass (`all-routes-integrity.test.mjs`). | Calculator & product disclaimers remain gated under compliance notices until `DEC-01`–`DEC-07` sign-off. |
| **Authentication (Login, Register, Logout, Reset, Session Revocation)** | **Implemented but integration pending** | `AuthModule`, `CsrfGuard`, `SessionOrJwtAuthGuard`, `src/app/login/page.tsx`, `client.ts`; `auth.service.spec.ts` + E2E tests pass. | Split-origin Next.js ↔ NestJS browser cookies have not yet been tested live over HTTPS against a deployed PostgreSQL instance. |
| **Investor Dashboard (`/dashboard/`)** | **Prototype or demonstration only** | `src/app/dashboard/page.tsx`, decomposed `src/components/dashboard/*`, `?tab=` deep-link support. | Displays explicitly labelled `DEMO FIXTURE ENVIRONMENT` data from SQLite locally; `/api/notifications` bell/inbox is not yet fetched in dashboard UI. |
| **Project Funding (`/project-funding/`)** | **Prototype or demonstration only** | `src/app/project-funding/page.tsx`, decomposed `ProjectFundingSteps.tsx`, `ProjectFundingModule`, E2E + `project-funding.test.mjs`. | Step 3 attachment upload records deterministic mock metadata fixtures rather than uploading real files to S3/R2. |
| **Document Uploads & Storage** | **Implemented but integration pending** | `DocumentsController` (`POST /upload`, `GET /:id/download`), `DocumentsService` (ACL, magic bytes, 15 MB limit, dynamic MIME filename), `documents.service.spec.ts` & E2E pass. | `@aws-sdk/client-s3` integration is **Not implemented**; `StorageAdapter` runs `LOCAL_FS` only and returns `503` if `S3_*` config is provided without SDK support. |
| **Appointments & Enquiries** | **Implemented and verified** *(SQLite/Mocked E2E)* | `AppointmentsModule`, `ConsultationForm.tsx`, duplicate throttling, notification links fixed to `/dashboard/?tab=enquiries`. | Email notifications log to local `data/email_sink.log` until live `RESEND_API_KEY` + domain DNS exist; `ENQ-2026-` uses `count() + 1` ID generation. |
| **Investment Records (Read & Write)** | **In development** | `InvestmentsModule` (`GET /investments`, `GET /investments/:id`, `POST /products`), `investments.service.spec.ts` pass; query enum validation hardened. | Read-only holdings/products in NestJS; subscription, allotment, accrual, TDS deduction, and redemption write workflows are **Not implemented**. |
| **Transactions Ledger** | **In development** | `TransactionsModule` (`GET /transactions`), owner-scoped read queries tested in `app.e2e-spec.ts`. | Ledger is read-only; idempotent payout/accrual write endpoints and `UNIQUE(payment_reference)` DB constraint are pending. |
| **Portfolio Summary** | **Implemented and verified** *(Mocked)* | `PortfolioService` + `InvestmentsService` unified via `backend/src/common/utils/money.ts` exact integer-paise aggregation (`money.spec.ts`). | Verified against mocked Prisma; should migrate to PostgreSQL `SUM(...)` aggregates at scale. |
| **Admin Dashboard (`/admin/`)** | **Implemented and verified** *(SQLite/Mocked E2E)* | `src/app/admin/page.tsx`, decomposed `src/components/admin/*`, `AdminModule`, `adminFormatters.ts` normalizing INR vs Lakhs Cr display. | No user/role promotion UI (`ADMIN`/`STAFF` assignment requires DB/script); unverified against live PostgreSQL. |
| **Notifications (In-App & Email Engine)** | **In development** | `NotificationsService` & `src/lib/notifications.ts` route cleanly to `/dashboard/?tab=enquiries`, `/dashboard/?tab=grievances`, `/dashboard/settings/`. | Backend `/api/notifications` exists and passes E2E, but Next.js frontend dashboard header does not yet poll/render the in-app notification inbox; Resend live delivery requires creds. |
| **Institutional Chatbot** | **Prototype or demonstration only** | `ChatbotModule` & `src/lib/ai/knowledge.ts`; `chatbot.service.spec.ts` + E2E prompt-injection test pass. | Rule-based deterministic keyword matcher only (`GEMINI_API_KEY` / `pgvector` LLM integration **Not implemented**). |
| **Indicative Return Calculator** | **Blocked by external dependency or approval** | `CalculatorModule` + `src/lib/calculator.ts` pass all mathematical simple-interest & TDS tests (`calculator.test.mjs`, `calculator.service.spec.ts`). | Frontend runs locally rather than calling `POST /api/calculator/simulate`; public promotion gated by CFO & CCO sign-off (**Decision 7 / DEC-02**). |
| **Branch Information (`/contact/`)** | **Implemented and verified** | `BranchesModule` (`GET /api/branches`), `src/lib/branches/data.ts`, `BranchDirectory.tsx`; verified by `enquiry-and-branch.test.mjs`. | Frontend uses local static TS dataset rather than live `/api/branches` fetch; 24 non-HQ branches remain subject to physical lease sign-off. |
| **PostgreSQL Migration & Parity** | **Implemented but integration pending** | `schema.prisma`, `migration.sql` (15 tables), `migrate-sqlite-to-pg.mjs` (decimal-safe SQL export), `verify-migration-parity.mjs` (`52` rows, `0` orphans). | **Blocked locally** — `prisma migrate deploy` and `.sql` execution have NOT run against an actual PostgreSQL server yet. |
| **Email Integration (Resend)** | **Blocked by external dependency or approval** | `NotificationsService` & `dispatchLeadNotification` wire Resend REST API with masked local sink fallback. | Requires provisioned `RESEND_API_KEY` and verified SPF/DKIM/DMARC sender domain records. |
| **Payment / Escrow Integration** | **Not implemented** *(Disabled by design)* | None — SEBI Section 42 private placements forbid online card/UPI checkout; requires scheduled bank escrow accounts. | Blocked by Debenture Trust Deed (`SH-12`), ROC (`CHG-9`), and bank escrow execution (`Gate 4`). |
| **Bot Turnstile Protection** | **Not implemented** | `.env.example` documents `TURNSTILE_*` placeholder variables only. | Zero frontend widget or server-side verification code exists; forms rely on honeypot (`website_hp`) and rate throttling. |
| **Regulatory & Statutory Sign-Offs** | **Blocked by external dependency or approval** | Tracked in [`docs/business-approval-checklist.md`](business-approval-checklist.md) and [`docs/financial-and-legal-review.md`](financial-and-legal-review.md). | Pending CIN verification (`DEC-01`), Debenture Trustee & escrow (`Gate 4`), CFO yield approval (`DEC-07`), PAS-4 PDFs (`DEC-04`), DPO/GRO appointments (`Gates 5–7`). |

