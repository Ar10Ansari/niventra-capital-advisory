# Niventra Capital Advisory — Current Architecture Analysis

**Document Type:** Architectural Baseline & System Specification  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/architecture/CURRENT_ARCHITECTURE.md`  
**Author:** CTO & Principal Software Architect  
**Date of Audit:** October / November 2026  
**Target Environment:** Main Production Branch (`main` / `refinement/minimal-content-cleanup`)  

---

## 1. System Overview & Deployment Topology

Niventra Capital Advisory currently operates as a monolithic Next.js application deployed to Vercel's serverless platform (`https://niventra-capital-advisory.vercel.app/`). The codebase encompasses both the public-facing institutional website, static legal and financial disclosures, interactive client widgets, an administrative desk, an investor portal, and an internal API layer backed by an embedded SQLite database.

```
+-------------------------------------------------------------------------------+
|                             CLIENT APPLICATION                                |
|                                                                               |
|  Public Website               Investor Portal           Executive Deal Desk   |
|  - 16 Canonical Routes        - /dashboard              - /admin              |
|  - Indicative Calculator      - Holdings & Ledgers      - Review Applications |
|  - Real Estate Portal         - KYC Status & Settings   - Grievance Handling  |
|  - Institutional Chatbot      - Document Center         - Audit Inspection    |
+---------------------------------------+---------------------------------------+
                                        | (Internal fetch calls)
                                        v
+-------------------------------------------------------------------------------+
|                       NEXT.JS SERVERLESS RUNTIME (VERCEL)                     |
|                                                                               |
|  Route Handlers: /api/auth/*, /api/project-funding/*, /api/enquiries/*, etc.  |
|  Middleware & Auth: Custom Scrypt + Cookie-based Session Engine               |
|  Business Logic: src/lib/calculator.ts, src/lib/ai/knowledge.ts               |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                     PERSISTENCE LAYER (NODE:SQLITE)                           |
|                                                                               |
|  Local Dev:  ./data/niventra.db (Persistent file)                             |
|  Vercel:     /tmp/niventra_data/niventra.db OR :memory: (EPHEMERAL!)          |
|  Audit Log:  Immutable append-only table in SQLite                           |
|  Storage:    Local filesystem in storage/documents/ (Mock PDFs)               |
+-------------------------------------------------------------------------------+
```

---

## 2. Technology Stack & Dependency Inventory

The repository runs on modern Node.js and React primitives with minimal external package bloat:

### 2.1 Core Dependencies (`package.json`)
* **Framework:** Next.js `16.4.1` (running Turbopack bundler and App Router).
* **UI Library:** React `19.3.0` & React-DOM `19.3.0`.
* **Icons:** Lucide React `^1.57.0`.
* **Styling:** Tailwind CSS `^4.0` (with `@tailwindcss/turbopack`).
* **Language & Runtime:** TypeScript `^5.0`, Node.js `v24.15.0`.
* **Database Driver:** Built-in `node:sqlite` (`DatabaseSync` API introduced natively in Node.js 22.5+ / 24).
* **Test Harness:** Node.js native test runner (`node --test tests/*.test.mjs`).

### 2.2 Critical Dependency Gaps
* **Zero External ORM:** No Prisma, Drizzle, or TypeORM installed.
* **Zero External Database Drivers:** No `pg`, `postgres`, `@neondatabase/serverless`, or `@supabase/supabase-js`.
* **Zero Dedicated Backend Framework:** NestJS is not yet initialized; all backend endpoints exist as Next.js route handlers.
* **Zero CI/CD Workflows:** `.github/workflows` does not exist.

---

## 3. Directory Layout & Codebase Structure

```
.
├── .env.example                       # Reference environment variable template
├── .gitignore                         # Git tracking exclusions
├── AGENTS.md                          # Next.js agent instruction block
├── eslint.config.mjs                  # ESLint flat configuration (v9)
├── next.config.ts                     # Next.js runtime configuration
├── package.json                       # Project manifests & scripts
├── tsconfig.json                      # Strict TypeScript compiler configuration
├── data/
│   ├── niventra.db                    # Active SQLite development database (151 KB)
│   └── email_sink.log                 # Append-only lead dispatch file sink
├── docs/
│   ├── architecture/                  # Architectural documentation (Current, Audit, Target)
│   ├── presentation/                  # Executive slide previews & speaker notes
│   └── *.md                           # Historical checklists & compliance guides
├── public/
│   ├── assets/images/                 # Institutional imagery (boardroom, real estate)
│   └── logo.png                       # High-resolution corporate crest
├── scripts/
│   ├── seed.mjs                       # Database bootstrap & user generation script
│   ├── seed-demo.mjs                  # Isolated presentation demo seeder (is_demo=1)
│   └── capture-*.mjs                  # Screenshot generation & QA tooling
├── src/
│   ├── app/                           # App Router routes and page components
│   │   ├── (public pages)             # /, /about, /products, /real-estate, /calculator, /contact...
│   │   ├── admin/page.tsx             # 1,246-line monolithic deal desk client component
│   │   ├── dashboard/                 # Investor portal (/dashboard & /dashboard/settings)
│   │   ├── project-funding/           # Real estate project submission portal
│   │   └── api/                       # 13 Next.js Route Handlers
│   ├── components/
│   │   ├── branches/BranchDirectory.tsx # 25-location branch directory
│   │   ├── calculator/IndicativeReturnCalculator.tsx # Simple-interest calculator UI
│   │   ├── chat/InstitutionalChatbot.tsx # Guarded knowledge-retrieval chatbot
│   │   ├── forms/                     # ConsultationForm, AccountDeletionForm, GrievanceForm
│   │   ├── layout/                    # Header.tsx, Footer.tsx
│   │   └── ui/                        # Accordion, Badge, Button, CalloutNotice, PageHero
│   ├── lib/
│   │   ├── ai/knowledge.ts            # Grounded knowledge base & prompt injection filter
│   │   ├── auth/                      # password.ts, session.ts, rbac.ts
│   │   ├── branches/                  # data.ts (25 locations), types.ts
│   │   ├── database/adapter.ts        # Abstract DatabaseAdapter interface definition
│   │   ├── audit.ts                   # Immutable audit log writer
│   │   ├── calculator.ts              # Mathematical calculation engine
│   │   ├── db.ts                      # SQLite singleton, schema DDL, and default seeder
│   │   └── notifications.ts           # Email sink & Resend REST dispatch
│   └── types/
│       └── node-sqlite.d.ts           # Ambient type definitions for node:sqlite
├── storage/
│   └── documents/                     # Sample mock PDF binaries for download testing
└── tests/                             # 7 automated test suites (47 test cases)
```

---

## 4. Persistence Architecture & SQLite Implementation

### 4.1 Storage Engine Implementation (`src/lib/db.ts`)
The persistence layer relies on Node 24's synchronous SQLite bindings (`DatabaseSync`).
Path resolution operates hierarchically:
1. Local Workspace: `path.join(process.cwd(), "data", "niventra.db")`
2. Serverless Temporary Storage: `path.join(os.tmpdir(), "niventra_data", "niventra.db")`
3. Fallback: `:memory:`

### 4.2 Database Schema
The SQLite database defines 11 primary tables initialized via `CREATE TABLE IF NOT EXISTS`:
1. `users`: Credentials, RBAC role (`PUBLIC`, `INVESTOR`, `STAFF`, `ADMIN`), account status (`ACTIVE`, `SUSPENDED`, `PENDING_DELETION`), scrypt hash and salt.
2. `sessions`: Token-based session tracking (`niventra_session` cookie).
3. `enquiries`: CRM pipeline capturing incoming investor and borrower consultation requests.
4. `grievances`: Formal grievance tickets with 48-hour SLA tracking and resolution notes.
5. `products`: Fixed-income and debt debenture catalog records.
6. `documents`: Regulatory filings, private placement memorandums, and term sheets.
7. `notifications`: In-app notification queue.
8. `audit_logs`: Immutable security audit log storing actor ID, IP address, action, and JSON payload.
9. `deletion_requests`: DPDP Act 2023 account deletion requests with statutory retention notes.
10. `kyc_records`: Investor PAN and national identity verification status with PII masking.
11. `investments` & `investment_transactions`: Investor portfolio holdings, coupon schedules, and payout ledgers (segregated with `is_demo` flag).
12. `project_applications` & `project_status_history`: Real estate developer financing submissions with multi-stage approval logs.

---

## 5. Security & Authentication Architecture

### 5.1 Password Hashing & Verification (`src/lib/auth/password.ts`)
* Uses `crypto.scryptSync` with a unique 16-byte random salt generated per user.
* Derives a 64-byte key (128-character hex string).
* Verification utilizes `crypto.timingSafeEqual` to guard against side-channel timing attacks.

### 5.2 Session Management (`src/lib/auth/session.ts`)
* Generates a 32-byte cryptographic random hex token.
* Persists token in SQLite `sessions` table with a 7-day expiration (`SESSION_DURATION_MS = 604,800,000`).
* Transmitted to the browser via an HTTP-Only, SameSite=Lax cookie (`niventra_session`). In production, the `secure` flag is enforced.

### 5.3 Authorization & Role-Based Access Control (`src/lib/auth/rbac.ts`)
* User roles are strictly typed: `PUBLIC`, `INVESTOR`, `STAFF`, `ADMIN`.
* Route handlers verify user roles using `getCurrentUser()` and enforce ownership checks (e.g. regular investors can only query their own investments in `src/app/api/investments/route.ts`).

---

## 6. Business Domain Implementations

### 6.1 Real Estate Project Funding (`src/app/project-funding/`, `src/app/api/project-funding/`)
* **Public Submission:** Captures developer contact, land status, approvals, project cost, funding requested, and use of funds. Protected by honeypot field (`website_hp`) and a 10-minute duplicate suppression window.
* **Deal Desk Review (`src/app/admin/page.tsx`):** Allows administrative staff to filter applications, request additional documents, transition application status (`RECEIVED` -> `UNDER_REVIEW` -> `SHORTLISTED` / `DECLINED`), and record notes. Every change is logged in `project_status_history` and `audit_logs`.

### 6.2 Investor Portal (`src/app/dashboard/`)
* **Holdings & Metrics:** Displays total invested principal, accrued interest, interest received, pending interest, and next payout date.
* **Isolation of Demo Fixtures:** Demo accounts and fixtures are visibly badged with `[DEMO MODEL]` and isolated using `is_demo = 1` database flags to prevent confusion with authentic capital.
* **KYC Submission:** Validates Indian PAN formatting (`[A-Z]{5}[0-9]{4}[A-Z]{1}`) and masks all but the first two and last two characters before storage.

### 6.3 Indicative Return Calculator (`src/lib/calculator.ts`)
* Implements simple-interest debenture calculations: $\text{Interest} = P \times \frac{r}{100} \times \frac{t}{12}$.
* Rejects equity SIP compounding. Enforces strict input bounds: ₹1 Lakh to ₹10 Crore principal, 8% to 24% p.a. yield, 6 to 120 months tenor.
* Discloses statutory TDS withholding caveats under Sections 193/194A of the Indian Income Tax Act, 1961.

### 6.4 Institutional Chatbot (`src/lib/ai/knowledge.ts`)
* Zero external LLM dependency in default mode; grounded on 9 institutional knowledge chunks covering corporate registry, debenture structures, ROC CHG-9 filings, and grievance policies.
* Defends against prompt injection (rejects attempts to alter system instructions, leak API keys, or exfiltrate internal notes).
* Emits grounded citations referencing official URLs.

### 6.5 Branch Directory (`src/lib/branches/data.ts`)
* Tracks 25 physical locations across 6 states.
* Segregated into 3 tiers: Corporate Head Office (Verified, Gwalior), Regional Advisory Desk (Pending Confirmation, New Delhi), and Partner Network (23 locations, Pending Verification).
* Search filter handles city, state, pin code, address, and audit verification notes.

---

## 7. Current Infrastructure & Integration State

| Integration | Technology | Current Status | Runtime Behavior |
|:---|:---|:---|:---|
| **Web Hosting** | Vercel Serverless | Operational | Next.js App Router SSR / SSG |
| **Database** | Node.js `node:sqlite` | Operational locally; Flawed on Vercel | Ephemeral `/tmp` persistence on serverless lambdas |
| **Lead Notifications** | Resend API / Local Sink | Operational | Falls back to `data/email_sink.log` if `RESEND_API_KEY` unset |
| **Bot Protection** | Cloudflare Turnstile / Honeypot | Honeypot active | Turnstile keys defined in `.env.example`, not yet enforced |
| **Document Storage** | Local filesystem (`storage/`) | Operational (Mock files) | Streams sample PDFs or watermarked notices |
| **CI / CD Pipeline** | GitHub Actions | Absent | Zero automated build or test gates |
