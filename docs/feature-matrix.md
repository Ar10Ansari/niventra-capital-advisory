# Niventra Capital Advisory — Platform Feature Matrix

**Project:** Niventra Capital Advisory Platform  
**Date:** October 16, 2026  
**Status:** Implementation Complete & Fully Verified  
**Lead Engineer:** Lead Full-Stack Architect  

---

## 1. Feature Traceability & Implementation Matrix

| Feature Domain | Specific Feature | Code / Route Location | Implementation Status | Test Evidence | Configuration / Dependency | Outstanding Approvals |
| :--- | :--- | :--- | :---: | :---: | :--- | :--- |
| **Public Website** | Canonical Routes (16/16) | `src/app/**/page.tsx` | **Complete** | `all-routes-integrity.test.mjs` | None | None |
| **Public Website** | Header & Mobile Drawer | `src/components/layout/Header.tsx` | **Complete** | Browser subagent verified | None | None |
| **Public Website** | Footer & Corporate Directory | `src/components/layout/Footer.tsx` | **Complete** | `all-routes-integrity.test.mjs` | None | Formal corporate directory sign-off |
| **Public Website** | SEO Metadata & Sitemap | `src/app/sitemap.ts`, `robots.ts` | **Complete** | `all-routes-integrity.test.mjs` | None | None |
| **Public Website** | Custom 404 Error Page | `src/app/not-found.tsx` | **Complete** | `all-routes-integrity.test.mjs` | None | None |
| **Database & ORM** | Native SQLite Relational Engine | `src/lib/db.ts` | **Complete** | `platform-fullstack.test.mjs` | `node:sqlite` (Node v24), `data/niventra.db` | PostgreSQL migration script for prod |
| **Authentication** | Cryptographic Session Cookies | `src/lib/auth/session.ts` | **Complete** | `platform-fullstack.test.mjs` | HTTP-only `niventra_session` cookie | None |
| **Authentication** | Scrypt Password Hashing | `src/lib/auth/password.ts` | **Complete** | `platform-fullstack.test.mjs` | `node:crypto.scryptSync` + timingSafeEqual | None |
| **Authentication** | Sign-In & Sign-Up Endpoints | `src/app/api/auth/**` | **Complete** | `platform-fullstack.test.mjs` | `/login`, `/register` pages | None |
| **Authentication** | Role-Based Access Control | `src/lib/auth/rbac.ts` | **Complete** | `platform-fullstack.test.mjs` | 4 Roles: PUBLIC, INVESTOR, STAFF, ADMIN | None |
| **Authentication** | Local Admin Bootstrap / Seed | `scripts/seed.mjs` | **Complete** | Browser subagent verified | `node scripts/seed.mjs` | Production bootstrap credentials |
| **Investor Portal** | Dashboard Overview & Metrics | `src/app/dashboard/page.tsx` | **Complete** | Browser subagent verified | Session check (`/api/auth/me`) | None |
| **Investor Portal** | Consultation Enquiry Tracker | `src/app/dashboard/page.tsx` | **Complete** | Browser subagent verified | Filtered by `user_id` | None |
| **Investor Portal** | Approved Document Centre | `src/app/dashboard/page.tsx` | **Complete** | Browser subagent verified | Downloads via `/api/documents/[id]/download` | Executed PAS-4 offer documents |
| **Investor Portal** | Grievance Ticket View | `src/app/dashboard/page.tsx` | **Complete** | Browser subagent verified | SLA deadline calculation | None |
| **Admin Portal** | Operations Overview & KPIs | `src/app/admin/page.tsx` | **Complete** | Browser subagent verified | Requires `ADMIN` or `STAFF` role | None |
| **Admin Portal** | Enquiry CRM Pipeline | `src/app/admin/page.tsx` | **Complete** | Browser subagent verified | Status transitions + internal notes | None |
| **Admin Portal** | Grievance Case Desk | `src/app/admin/page.tsx` | **Complete** | Browser subagent verified | Resolution notes + 30-day statutory SLA | None |
| **Admin Portal** | Product Catalogue Admin | `src/app/admin/page.tsx` | **Complete** | Browser subagent verified | `/api/products` | Final committee debenture term sheets |
| **Admin Portal** | Document Governance Admin | `src/app/admin/page.tsx` | **Complete** | Browser subagent verified | Public vs Restricted classification | Watermarked corporate documents |
| **Admin Portal** | Immutable Audit Log Viewer | `src/app/admin/page.tsx` | **Complete** | Browser subagent verified | `/api/audit-logs` (strictly `ADMIN`) | None |
| **AI Intelligence** | Grounded Knowledge Retrieval | `src/lib/ai/knowledge.ts` | **Complete** | `platform-fullstack.test.mjs` | Approved knowledge chunks + citations | None |
| **AI Intelligence** | Interactive Chatbot Widget | `src/components/chat/InstitutionalChatbot.tsx` | **Complete** | Browser subagent verified | Floating widget in `layout.tsx` | Production LLM API key (optional) |
| **AI Intelligence** | Prompt Injection Defenses | `src/lib/ai/knowledge.ts` | **Complete** | `platform-fullstack.test.mjs` | Keyword & pattern sanitization | None |
| **CRM Inquiries** | Consultation Form & API | `src/components/forms/ConsultationForm.tsx` | **Complete** | Browser subagent verified (`ENQ-2026-0002`) | Serialized IDs: `ENQ-2026-XXXX` | None |
| **Grievance Desk** | Online Ticket Form & SLA | `src/components/forms/GrievanceForm.tsx` | **Complete** | `platform-fullstack.test.mjs` | Serialized IDs: `GRV-2026-XXXX` | Official Officer Legal Designation |
| **Notifications** | In-App Notification Center | `src/lib/notifications.ts` | **Complete** | `platform-fullstack.test.mjs` | Stored in `notifications` table | None |
| **Notifications** | Email Notification Sink | `src/lib/notifications.ts` | **Complete** | Log inspection (`data/email_sink.log`) | Local sink active; SMTP abstraction ready | Production SMTP / SendGrid credentials |
| **Audit Logging** | Immutable Security Event Trail | `src/lib/audit.ts` | **Complete** | `platform-fullstack.test.mjs` | Stored in `audit_logs` table | None |
| **Data Privacy** | DPDP Act Erasure Request Form | `src/components/forms/AccountDeletionForm.tsx` | **Complete** | `platform-fullstack.test.mjs` | Serialized IDs: `DEL-2026-XXXX` | Data Protection Officer appointment |
| **Financial Gate** | Return Calculator Deferral | `src/app/calculator/page.tsx` | **Complete** | `all-routes-integrity.test.mjs` | Honest deferral notice | CFO Mathematical Sign-off (Decision 7) |
| **Financial Gate** | Live Payment / Escrow | N/A (Gated) | **Gated by Policy** | Architecture boundary enforced | Disabled by design | Escrow Banking & Trustee Agreement |
| **Financial Gate** | Debenture Issuance / Allocation | N/A (Gated) | **Gated by Policy** | Architecture boundary enforced | Disabled by design | ROC Form PAS-4 & CHG-9 filings |
