# Niventra Capital Advisory — Comprehensive Engineering Audit

**Document Type:** Technical Debt, Architecture Vulnerability & Security Audit  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/architecture/ENGINEERING_AUDIT.md`  
**Author:** CTO, Principal Architect, Senior Backend/Frontend Engineer, DevOps Engineer & Security Reviewer  
**Date of Audit:** October / November 2026  
**Audited Target:** `main` / `refinement/minimal-content-cleanup`  

---

## 1. Executive Summary

This engineering audit assesses the current state of Niventra Capital Advisory's digital platform. While the user-facing presentation, design tokens, statutory disclosures, and compliance copywriting are remarkably high caliber, the underlying architecture suffers from critical structural flaws that prevent reliable enterprise operation.

The most critical defect is the platform's reliance on an embedded SQLite database running inside Vercel's serverless runtime. In serverless environments, write operations are directed to `/tmp`, which is non-shared and destroyed across container recycling. As a result, data entered by investors, developers, and administrators on production is ephemeral and fragmented.

Furthermore, business logic is tightly coupled to Next.js route handlers with direct SQL statement execution, bypassing any ORM, DTO validation layer, or decoupled API architecture. Frontend components suffer from severe bloat, with individual client components exceeding 1,200 lines of code.

### Summary of Audit Findings by Severity

| Severity | Count | Primary Impact Areas |
|:---|:---:|:---|
| **CRITICAL** | 2 | Serverless Data Loss Risk (Ephemeral SQLite); Missing Data Isolation Layer |
| **HIGH** | 4 | Monolithic Oversized Client Components; Lack of CI/CD Testing Gates; Local Storage for Documents; No Auth Rate Limiting |
| **MEDIUM** | 5 | Incomplete Frontend Integrations (Settings & Security); No Database Migrations Engine; Absence of DTO Validation Layer; Untyped API Contracts; Direct SQL Coupling in Route Handlers |
| **LOW** | 3 | Node 24 Typeless Package Warning; Keyword-Only Chatbot Algorithm; Lack of Startup Environment Variable Schema Validation |

---

## 2. Detailed Findings & Vulnerability Matrix

### Finding 1: Ephemeral SQLite Persistence on Serverless Hosting [CRITICAL]
* **Location:** [`src/lib/db.ts`](file:///D:/Projects/niventra%20website/src/lib/db.ts#L27-L41)
* **Description:** When deployed to Vercel, the application attempts to resolve a database path in `path.join(os.tmpdir(), "niventra_data", "niventra.db")` or falls back to `:memory:`. Vercel executes Next.js server actions and route handlers inside isolated AWS Lambda serverless execution environments.
* **Impact:** 
  1. Different serverless instances do NOT share `/tmp` storage. An enquiry submitted on Lambda A is invisible to Lambda B.
  2. Any redeployment or container shutdown immediately destroys all SQLite database state stored in `/tmp`.
  3. Real users registering on `https://niventra-capital-advisory.vercel.app/` experience intermittent "User not found" errors when subsequent requests hit a different cold-started Lambda instance.
* **Remediation:** Immediately migrate persistence to an independent PostgreSQL cluster managed via Prisma ORM and hosted on a persistent cloud provider (AWS RDS, Neon, or Railway) with connection pooling.

---

### Finding 2: Direct SQL Coupling & Lack of Data Access Layer [CRITICAL]
* **Location:** All 13 files in [`src/app/api/`](file:///D:/Projects/niventra%20website/src/app/api/)
* **Description:** Every route handler imports `import { db } from "@/lib/db"` and executes synchronous C-API SQLite prepared statements (`db.prepare("SELECT ...").all()`). 
* **Observation:** [`src/lib/database/adapter.ts`](file:///D:/Projects/niventra%20website/src/lib/database/adapter.ts) exists as an abstract TypeScript interface declaring an intent for persistence independence, but it has ZERO implementations and is completely bypassed by all route handlers.
* **Impact:** Any change to database engine requires rewriting all 13 route handlers. No transaction management exists for multi-table updates (e.g., project submission + status history + audit log).
* **Remediation:** Implement a clean repository/service pattern in a dedicated NestJS backend utilizing Prisma ORM with typed entities and automated transactions.

---

### Finding 3: Monolithic Oversized Client Components [HIGH]
* **Locations:**
  * [`src/app/admin/page.tsx`](file:///D:/Projects/niventra%20website/src/app/admin/page.tsx) — **1,246 lines**
  * [`src/app/dashboard/page.tsx`](file:///D:/Projects/niventra%20website/src/app/dashboard/page.tsx) — **1,227 lines**
  * [`src/app/dashboard/settings/page.tsx`](file:///D:/Projects/niventra%20website/src/app/dashboard/settings/page.tsx) — **687 lines**
* **Description:** These pages are massive client-side components containing hundreds of state variables (`useState`), asynchronous fetching side-effects (`useEffect`), nested modals, filter algorithms, table renderers, and form submissions in a single file.
* **Impact:** High cognitive load, severe maintenance bottlenecks, high risk of regressions during feature updates, poor bundle size performance, and impossible unit testability for individual sub-views.
* **Remediation:** Refactor these monoliths into modular, presentationally focused component hierarchies:
  * Admin: `AdminHeader`, `ProjectReviewTable`, `ProjectDetailModal`, `EnquiryPipelineTable`, `GrievanceManager`, `AuditLogViewer`.
  * Dashboard: `PortfolioSummaryCards`, `HoldingsLedgerTable`, `TransactionHistoryTable`, `KycStatusBanner`, `DocumentCenter`.

---

### Finding 4: Absence of Automated CI/CD Testing Gates [HIGH]
* **Location:** Repository root (`.github/` is completely absent)
* **Description:** There are zero GitHub Actions workflows defined in the repository. Pull requests and commits to `main` are not automatically verified by typechecking, linting, or test execution.
* **Impact:** Broken code or failing tests can be pushed directly to production without warning.
* **Remediation:** Establish `.github/workflows/ci.yml` running Node 24, checking linting (`npm run lint`), TypeScript compilation (`npm run typecheck`), automated tests (`npm test`), and Next.js production build (`npm run build`).

---

### Finding 5: Local Serverless Filesystem Document Handling [HIGH]
* **Location:** [`src/app/api/documents/[id]/download/route.ts`](file:///D:/Projects/niventra%20website/src/app/api/documents/[id]/download/route.ts#L46-L65)
* **Description:** Document downloads attempt to read local files from `storage/documents/`. The files currently checked into git are 5-line plain text stubs mimicking PDF headers. In production serverless runtimes, local storage is ephemeral and cannot receive binary file uploads.
* **Impact:** Uploaded documents from developers submitting project applications are held only as metadata strings (`sanitizedDocs`) without storing actual files.
* **Remediation:** Implement S3-compatible object storage (AWS S3, Cloudflare R2, or Supabase Storage) with presigned URLs for secure, authenticated document uploads and downloads.

---

### Finding 6: Lack of Rate Limiting & Brute Force Defenses [HIGH]
* **Locations:**
  * [`src/app/api/auth/login/route.ts`](file:///D:/Projects/niventra%20website/src/app/api/auth/login/route.ts)
  * [`src/app/api/auth/register/route.ts`](file:///D:/Projects/niventra%20website/src/app/api/auth/register/route.ts)
* **Description:** While passwords use cryptographic scrypt hashing with salts, the authentication endpoints have no rate limiting, IP throttling, or account lockout mechanisms after consecutive failed attempts.
* **Impact:** Vulnerable to distributed brute-force attacks and credential stuffing.
* **Remediation:** Implement NestJS Throttler (`@nestjs/throttler`) or Redis-based rate limiting on all public authentication and enquiry submission routes.

---

### Finding 7: Incomplete Integrations in User Account Settings [MEDIUM]
* **Locations:**
  * [`src/app/dashboard/settings/page.tsx`](file:///D:/Projects/niventra%20website/src/app/dashboard/settings/page.tsx#L91-L128)
* **Description:** 
  1. `handleProfileSubmit` simply executes `setProfileSaved(true)` without sending a PATCH or PUT request to update user name or phone in the database.
  2. `handleSecuritySubmit` (password change) validates fields locally and displays a static message: *"Backend Integration Notice: Password update request submitted in compliance preview mode"*. No backend endpoint exists to change passwords.
  3. Notification preference toggles (`notifyConsultations`, `notifyDisclosures`, `notifyGrievances`) are stored only in volatile React state.
* **Impact:** Users believe their settings are saved, but all modifications disappear upon page refresh.
* **Remediation:** Create dedicated API routes and NestJS endpoints: `PATCH /api/users/profile`, `POST /api/users/change-password`, `PATCH /api/users/preferences`.

---

### Finding 8: Absence of Database Migration Engine [MEDIUM]
* **Location:** [`src/lib/db.ts`](file:///D:/Projects/niventra%20website/src/lib/db.ts#L72-L306)
* **Description:** Schema changes are applied via raw `CREATE TABLE IF NOT EXISTS` statements during application startup.
* **Impact:** Cannot safely alter existing tables, rename columns, drop foreign keys, or manage versioned schema rollbacks. Production schema state is uncontrolled.
* **Remediation:** Adopt Prisma Migrate with versioned, reproducible SQL migrations (`prisma/migrations/*`).

---

### Finding 9: Manual Request Validation Without DTO Layer [MEDIUM]
* **Location:** All route handlers in `src/app/api/`
* **Description:** Each route handler manually checks request body properties using nested `if` statements and regex checks (e.g. 50+ lines of validation logic in `src/app/api/project-funding/route.ts`).
* **Impact:** Boilerplate code, potential validation inconsistencies across routes, and no centralized validation documentation.
* **Remediation:** Implement NestJS DTO classes with `class-validator` and `class-transformer` decorators, validated globally by `ValidationPipe`.

---

### Finding 10: Untyped API Responses & Frontend Fetching [MEDIUM]
* **Location:** Client components calling `const res = await fetch("/api/...")`
* **Description:** Responses are parsed as `const data = await res.json()`, and state is cast unsafely (`setProjects(d.applications || [])`).
* **Impact:** Breaking API response schema changes will silently fail at runtime without TypeScript compiler warnings.
* **Remediation:** Generate OpenAPI (Swagger) specifications from the NestJS backend and generate typed frontend API client contracts.

---

### Finding 11: Node 24 Typeless Package Warning [LOW]
* **Location:** [`package.json`](file:///D:/Projects/niventra%20website/package.json)
* **Description:** Node.js emits: `[MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///... is not specified and it doesn't parse as CommonJS. Reparsing as ES module...` during test execution.
* **Impact:** Slight startup overhead and noisy test logs.
* **Remediation:** Explicitly add `"type": "module"` to `package.json`.

---

### Finding 12: Keyword-Only Chatbot Algorithm [LOW]
* **Location:** [`src/lib/ai/knowledge.ts`](file:///D:/Projects/niventra%20website/src/lib/ai/knowledge.ts#L126-L138)
* **Description:** The chatbot uses string keyword matching against 9 static knowledge chunks. While safe against hallucination and prompt injection, it fails to understand paraphrased inquiries.
* **Remediation:** Enhance with hybrid search (dense embeddings via PostgreSQL `pgvector` paired with keyword retrieval).

---

## 3. Real Production Data Inventory in `data/niventra.db`

The audit inspected the local database `data/niventra.db` (151,552 bytes). Real and authenticated user data is present and must be protected during migration:

### 3.1 Users Table (`users`)
1. `usr_admin_dev`: `admin@niventra.local` (System Administrator - Fixture)
2. `usr_staff_dev`: `staff@niventra.local` (Advisory Desk Operator - Fixture)
3. `usr_investor_dev`: `investor@example.com` (Vikramaditya Sharma - Fixture)
4. `usr_auth_client_01`: **`[REDACTED_CLIENT_EMAIL_1]`** (`[REDACTED_CLIENT_NAME]` - **AUTHENTIC USER**)
5. `usr_auth_client_02`: **`[REDACTED_CLIENT_EMAIL_2]`** (`[REDACTED_CLIENT_NAME]` - **AUTHENTIC USER**)

### 3.2 Lead Enquiries (`enquiries`)
* 5 Fixture / Test records (`ENQ-2026-0001`, `ENQ-2026-0002`, `ENQ-2026-DEMO01`, `DEMO02`, `DEMO03`)
* **`ENQ-2026-0006`:** `[REDACTED_CLIENT_NAME]` (`[REDACTED_CLIENT_EMAIL_1]`), Category: Capital Provider / Investor, Capital Range: ₹25 Lakh – ₹1 Crore (**AUTHENTIC LEAD**)

### 3.3 Project Applications (`project_applications`)
* 3 Demo applications flagged `is_demo = 1` (`PRJ-202610-1082`, `PRJ-202610-2041`, `PRJ-202610-3914`).

> [!CAUTION]
> Authentic registered user accounts (`[REDACTED_CLIENT_EMAIL_1]`, `[REDACTED_CLIENT_EMAIL_2]`), along with enquiry `ENQ-2026-0006`, MUST be backed up and migrated cleanly to PostgreSQL. Under no circumstances should `data/niventra.db` be truncated or deleted.

---

## 4. Supabase & Firebase Infrastructure Evaluation

### 4.1 Supabase Dependency Inspection
* **Findings:** A search across all source code, `package.json`, and `package-lock.json` reveals that `@supabase/supabase-js` is **NOT installed** and **NOT imported**.
* Supabase was only mentioned as an illustrative third-party option in `docs/` and `.env.example`.
* **Conclusion:** There are no active Supabase runtime locks to decouple. We can transition directly to our own NestJS + PostgreSQL + Prisma backend without unwinding legacy Supabase SDK code.

### 4.2 Firebase Evaluation
The primary objectives require an architectural evaluation of Firebase for Niventra Capital Advisory:

| Criterion | Firebase (Firestore + Firebase Auth) | Target Architecture (NestJS + PostgreSQL + Prisma) | Architectural Verdict |
|:---|:---|:---|:---|
| **Data Integrity** | NoSQL Document Store (Eventual consistency, lack of relational foreign keys) | Relational SQL with ACID compliance, strict constraints, and foreign key cascades | **PostgreSQL Required:** Financial ledgers and debenture allocations cannot tolerate eventual consistency or orphan records. |
| **Financial Ledgers** | Unsuitable for double-entry bookkeeping, balance rollups, and exact math | Standard SQL `NUMERIC(15, 2)` / `DECIMAL` prevents floating point errors | **PostgreSQL Required** |
| **Audit Trails & DPDP** | Append-only audit logs difficult to lock down; document-level security rules complex | Native immutable tables, relational foreign keys, and trigger-based row audits | **PostgreSQL Required** |
| **Vendor Independence** | Heavy proprietary vendor lock-in (Google Cloud proprietary runtime) | 100% open-source standards; run on Docker, AWS, GCP, Railway, or on-premise | **NestJS/PostgreSQL Required** |
| **Regulatory Compliance** | MCA, ROC, SEBI, and DPDP Act audit requirements require clear data exportability | Standard PostgreSQL dumps (`pg_dump`) satisfy statutory data retention mandates | **PostgreSQL Required** |

**Recommendation:** Reject Firebase for Niventra Capital Advisory. Proceed with the planned NestJS + PostgreSQL + Prisma target architecture.

---

## 5. Remediation Roadmap Mapped to Phases

1. **Phase 2 (Repository Professionalization):**
   * Standardize documentation (`README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.env.example`, `.gitignore`).
   * Add architecture documentation.
2. **Phase 3 (Code Quality & Refactoring):**
   * Decompose oversized client components (`src/app/admin/page.tsx`, `src/app/dashboard/page.tsx`).
   * Fix incomplete integrations in `src/app/dashboard/settings/page.tsx`.
   * Add `"type": "module"` to `package.json`.
3. **Phase 4 & 5 (Backend & Database Architecture):**
   * Initialize NestJS backend service with Prisma ORM.
   * Design normalized PostgreSQL schema with financial decimal types and audit logging.
4. **Phase 6 & 7 (Security & Data Migration):**
   * Export verified SQLite data (`data/niventra.db`) to PostgreSQL.
   * Verify integrity of authentic non-fixture user accounts (`[REDACTED]`) via credential digests.
5. **Phase 8 & 9 (Frontend Integration & Testing):**
   * Connect Next.js frontend to NestJS backend APIs via centralized API client.
   * Add automated Jest/Supertest backend tests and end-to-end integration tests.
6. **Phase 10 & 11 (Deployment & GitHub Standards):**
   * Implement GitHub Actions CI workflow for lint, typecheck, tests, and build.
   * Establish environment configurations for staging and production.
