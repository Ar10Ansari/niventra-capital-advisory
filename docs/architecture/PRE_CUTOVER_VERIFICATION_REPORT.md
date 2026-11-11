# Niventra Capital Advisory — Independent Pre-Cutover Verification & Engineering Audit Report

**Audit Date:** November 11, 2026  
**Workspace:** `D:\Projects\niventra website`  
**Repository:** `https://github.com/Ar10Ansari/niventra-capital-advisory`  
**Target Production Reference:** `https://niventra-capital-advisory.vercel.app/`  
**Audited Branch / HEAD:** `refinement/minimal-content-cleanup` (`9498531`) vs `main` (`75811b0`)  
**Audit Scope:** Strictly read-only repository, schema, backend, frontend, migration, test, security, and regulatory verification. Zero production resources, live SQLite data, environment variables, DNS, or git history were modified.

---

## 1. Executive Summary

Independent verification confirms substantial foundational progress across architecture documentation, Next.js frontend strictness/decomposition, the standalone NestJS + Prisma backend across all 15 business domains, and SQLite-to-PostgreSQL export tooling. Specifically, the SQLite database row count (`52` rows across `14` tables), the `15`-table PostgreSQL schema reconciliation (`password_reset_tokens` added in PostgreSQL), the presence of `4` scoped local engineering commits, removal of `@supabase/*` / `firebase` SDKs, and baseline unit/E2E/lint/build gates (`51` root tests, `27` backend unit tests, `9` backend E2E tests) are **independently verified**.

However, several critical claims from earlier summaries **failed verification or exposed cutover blockers**, making live production cutover unsafe and staging deployment conditional on immediate P0 fixes:

1. **Split-Origin Production/Staging Cutover Will Break Authentication Immediately:** Next.js [client.ts](file:///D:/Projects/niventra%20website/src/lib/api/client.ts) sends cookie credentials (`credentials: "include"`) and never sends `Authorization: Bearer`, while NestJS [`AuthController`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.controller.ts#L36-L44) issues cookies with `sameSite: "lax"`. Across separate frontend (`vercel.app`) and API hosts, browsers will drop `SameSite=Lax` cookies; switching to `SameSite=None` without CSRF tokens exposes authenticated mutations to CSRF. [`main.ts`](file:///D:/Projects/niventra%20website/backend/src/main.ts) also lacks `app.set("trust proxy", 1)` for rate limiting behind reverse proxies.
2. **Database Execution Against Real PostgreSQL Never Ran:** Neither local development nor GitHub Actions CI executed `prisma migrate deploy` or `data/niventra_postgres_export.sql` against an actual PostgreSQL server. All `27` backend unit tests and `9` E2E tests use an in-memory mock `PrismaService`.
3. **Dirty Local Git Tree & Unpushed Commits:** All `4` engineering commits (`2ded383`, `7ab94a1`, `b76e2ac`, `9498531`) remain **unpushed** (`4` ahead of `origin/refinement/minimal-content-cleanup`, `5` ahead of `main`). Contrary to the "clean working tree" claim, `git status` currently reports **`56` modified tracked files** caused by trailing blank-line / CRLF-LF EOF drift.
4. **High-Severity Backend Security & Functional Gaps:**
   - Plaintext personal investor email addresses (`[REDACTED]`) are committed into tracked Git documentation and migration scripts.
   - `NODE_ENV=staging` bypasses mandatory secret enforcement in [env.validation.ts](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts#L48-L62), allowing fallback to a hardcoded JWT signing string.
   - Private/unapproved documents lack `status = "APPROVED"` and `role !== "PUBLIC"` checks in [`DocumentsService`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.service.ts#L126-L153), and S3/R2 storage ([storage.adapter.ts](file:///D:/Projects/niventra%20website/backend/src/modules/documents/storage/storage.adapter.ts)) is a local-disk stub with no binary upload endpoint.
   - Backend production dependencies contain **`12` known `npm audit` vulnerabilities (`7 high`, `5 moderate`)** in the `@nestjs/*` v10/v5/v7 stack (`@nestjs/platform-express`, `@nestjs/swagger`, `@nestjs/config`, `multer`, `body-parser`, `js-yaml`, `lodash`).
   - Forgot/Reset password UI ([`LoginPage`](file:///D:/Projects/niventra%20website/src/app/login/page.tsx#L87-L95)) is still a simulated `setTimeout` mock; `InvestmentsModule` and `TransactionsModule` are read-only; no `/api/health` readiness endpoint exists.
5. **Unresolved Statutory & Legal Sign-Offs:** Corporate issuer structure (CIN, Section 42/71 Companies Act), Debenture Trustee & escrow banking execution, CFO-certified interest/TDS models, Grievance Officer / DPO appointments, and offering binary PDFs remain unsigned per [`docs/business-approval-checklist.md`](file:///D:/Projects/niventra%20website/docs/business-approval-checklist.md).

**Overall Decision:**
- **Production Cutover:** **NO-GO** (Blocked by architecture, security, live PG verification, read-only ledger, S3 storage, and regulatory sign-offs).
- **Staging Deployment:** **CONDITIONAL NO-GO** until the P0 staging blockers (`env.validation.ts` staging enforcement, cross-origin auth/CSRF design, `trust proxy`, `/api/health`, PII removal from tracked files, and a verified `prisma migrate deploy` + SQL export dry-run on an ephemeral PostgreSQL instance) are resolved.

---

## 2. Skills Discovered and Actually Used

### Discovery Scope
Inspected all local and global skill locations on disk:
- **Built-in Antigravity Skills (`C:\Users\Lenovo\.gemini\antigravity\builtin\skills`):** `13` skills discovered (`agy-customizations`, `antigravity_guide`, `automation`, `generative_ui`, `migrate-agent-settings`, `migrate-workflows`, `native_swarm`, `permissioned-github`, `plugin`, `run-workflow`, `swarm_monitor`, `swarm_narrator`, `ui-plugin-navigation`).
- **Installed Skills Catalog (`C:\Users\Lenovo\.agents\skills`):** `1,079` skill directories discovered.
- **Absent Directories:** Workspace-local `.agent/`, `.agents/`, `.gemini/` and user `~/.gemini/antigravity/skills` / `plugins` do not exist.

### Selected, Read & Applied Skills

| Skill | Status | Activities Supported in This Audit |
| :--- | :--- | :--- |
| `pre-release-review` (+ `checklist.md`, `report-template.md`) | Applied | Structured Go/No-Go gate taxonomy, dependency/config audit, release checklist & reporting format |
| `dos-verify-done-claims` | Partial (`dos` CLI absent) | Reconciled every prior sprint claim against git commits, file counts, schemas, and live test runs manually |
| `architecture-review` | Partial (Ontoly MCP/CLI absent) | Audited domain boundaries, frontend-to-backend coupling, doc-vs-code drift via direct AST/source inspection |
| `frontend-architecture` | Applied | Audited Next.js `16.4.1` strict TypeScript, API centralization ([client.ts](file:///D:/Projects/niventra%20website/src/lib/api/client.ts)), UI mocks, dead links, security headers |
| `postgresql-devsec` | Applied | Evaluated PostgreSQL migration SQL, SSL/credential handling, missing `CHECK` constraints, least privilege |
| `supabase-postgres-best-practices` (+ FK index & constraint refs) | Applied | Identified missing FK indexes, missing `CHECK` constraints, numeric/float coercion risks in migration |
| `database-security` & `database-backups` | Applied | Verified physical SQLite backup presence, PII handling, encryption/secrets separation, backup parity |
| `security-and-hardening` (+ `security-checklist.md`) | Applied | Audited headers, cookies, CSRF, rate limiting, `trust proxy`, Swagger exposure, input validation, `npm audit` |
| `api-security` & `client-secret-exposure-audit` | Applied | Checked RBAC, IDOR guards, DTO validation, query enum casts, client secret exposure, tracked `.env` checks |
| `hunt-jwt-crypto` | Applied | Audited scrypt password hashing, `timingSafeEqual` length checks, HS256 JWT lifetime, revocation & algorithm pinning |
| `hunt-auth-bypass` | Blocked (`SKILL.md` binary error) | Substituted manual auth-bypass verification via `security-and-hardening` & `api-security` across all guards/routes |
| `five-axis-code-review` & `code-review-and-quality` | Applied | Reviewed correctness, security, duplication, error handling, race conditions (`count() + 1`) across NestJS & Next.js |
| `improve-codebase-architecture` | Applied | Flagged duplicated controllers (`UsersController` vs `AccountController`) & duplicated portfolio float aggregation |
| `ci-cd-and-automation` & `git-workflow-and-versioning` | Applied | Audited `.github/workflows/ci.yml`, git ancestry, branch divergence, unpushed commits, `.gitignore`, CRLF/LF hygiene |
| `documentation-and-adrs` | Applied | Audited `docs/*` vs actual code for staleness, inaccurate API docs, committed PII, and dead script paths |
| `jest-skill` | Applied | Distinguished real PG integration tests from mocked-`PrismaService` unit (`27`) & E2E (`9`) Jest tests; flagged 9 untested modules |
| `party-ledger-reconciliation` | Applied | Audited financial decimal precision (`DECIMAL(18,2)` vs JS `Number()`), idempotency, TDS/accrual/redemption gaps |

### Missing Skills & Substituted Alternatives
- **Missing Skills:** Zero `nestjs`-specific or `prisma`-specific skills exist in the `1,079`-skill catalog (verified by scanning all `SKILL.md` manifests). Compensated through direct line-by-line review of NestJS decorators/guards/interceptors/DTOs and Prisma `schema.prisma` / `migration.sql` using `five-axis-code-review`, `api-security`, `postgresql-devsec`, and `supabase-postgres-best-practices`.

---

## 3. Git and Commit Verification

| Check | Command / Evidence | Verified Finding |
| :--- | :--- | :--- |
| **Current Branch & Tracking** | `git branch -vv` | `refinement/minimal-content-cleanup` at `9498531`, tracking `origin/refinement/minimal-content-cleanup` (`78afc1e`) — **`4` commits ahead, `0` behind** |
| **Base vs `main`** | `git rev-list --left-right --count origin/main...HEAD` | `0 5` (`refinement/minimal-content-cleanup` is cleanly rebased on `main` at `75811b0` + commit `78afc1e` + the 4 recent commits) |
| **Remote Sync Status** | `git fetch origin --prune` (prior step) + branch tracking | **Unpushed:** None of `2ded383`, `7ab94a1`, `b76e2ac`, or `9498531` exist on `origin` |
| **Clean Working Tree Claim** | `git status -uall`, `git diff --ignore-blank-lines --stat`, `git diff --check` | **DISPROVED:** `56` tracked files show uncommitted trailing blank-line EOF diffs (`git diff --check` exits `1`); `0` untracked files; `0` substantive non-blank-line diffs |
| **Sensitive Tracked Files** | `git ls-files` | Zero `.env`, `*.db`, `*.sqlite*`, `node_modules/`, `dist/`, `data/`, or private `storage/` files tracked; **HOWEVER**, plaintext personal user emails are committed in tracked docs/scripts |

### Individual Commit Inspection

| Commit | Scope | File Count / Line Churn | Key Verification Notes |
| :--- | :--- | :--- | :--- |
| `2ded383` | Architecture docs, API/DB/Security specs, governance, CI | `14` files (`+2457 / -69`) | Added `.env.example`, `.github/workflows/ci.yml`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `docs/*`. Contains committed PII emails in `ENGINEERING_AUDIT.md` & `MIGRATION_STRATEGY.md` and doc drifts in `TARGET_ARCHITECTURE.md` & `API_REFERENCE.md`. |
| `7ab94a1` | Frontend refactor, strict TS, API client | `35` files (`+3626 / -2207`) | Enabled `strict: true` in `tsconfig.json`, extracted [client.ts](file:///D:/Projects/niventra%20website/src/lib/api/client.ts), modularized [`src/components/dashboard/`](file:///D:/Projects/niventra%20website/src/components/dashboard) and [`src/components/admin/`](file:///D:/Projects/niventra%20website/src/components/admin), added `tests/frontend-api-client.test.mjs`. |
| `b76e2ac` | Standalone NestJS + Prisma backend | `93` files | Added `backend/` across `15` domain modules, `schema.prisma`, `migration.sql`, `6` unit `.spec.ts` files, `test/app.e2e-spec.ts`. Excluded `node_modules/` and `dist/`. |
| `9498531` | SQLite-to-PostgreSQL migration scripts | `2` files | Added [`scripts/migrate-sqlite-to-pg.mjs`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs) & [`scripts/verify-migration-parity.mjs`](file:///D:/Projects/niventra%20website/scripts/verify-migration-parity.mjs). Both hardcode/print real investor/admin emails (`PII` leak). |

---

## 4. Repository Quality Findings

| Area | Status | Concrete Findings |
| :--- | :--- | :--- |
| **Core Governance Docs** | Present | [`README.md`](file:///D:/Projects/niventra%20website/README.md), [`CONTRIBUTING.md`](file:///D:/Projects/niventra%20website/CONTRIBUTING.md), [`SECURITY.md`](file:///D:/Projects/niventra%20website/SECURITY.md), and [`.env.example`](file:///D:/Projects/niventra%20website/.env.example) cover setup, testing, and responsible disclosure accurately overall. |
| **Stale Legacy Docs** | Defect | [`docs/PRODUCTION_READINESS.md`](file:///D:/Projects/niventra%20website/docs/PRODUCTION_READINESS.md#L48) is outdated (Oct 2026): references nonexistent `scripts/export-sqlite-to-pg.mjs`, "42 automated tests", and "24 isolated branches". |
| **`.gitignore` Gaps** | Defect | Blocks `/data/`, `/storage/`, `.env*` (`!.env.example`), `*.pem`, `/backend/node_modules`, `/backend/dist/`, `.vercel`, `*.log`, **but omits** `*.db`, `*.sqlite*`, `*.key`, `*.p12`, `*.pfx` wildcards outside `/data/`. |
| **Line-Ending Hygiene** | Defect | Missing `.gitattributes` caused `56` tracked files to turn dirty on Windows (`core.autocrlf = true`) with trailing blank lines (`git diff --check` fails). |
| **CI Pipeline ([`ci.yml`](file:///D:/Projects/niventra%20website/.github/workflows/ci.yml))** | Partial | Runs root + backend ESLint, `tsc --noEmit`, build, Jest/Node tests, and `prisma validate` (dummy URL) on Node `24`. **Missing:** live PostgreSQL service container, `prisma migrate deploy`, SQL export test, `npm audit`, Playwright E2E. |
| **Root Dependency Audit** | Pass (Prod) | `next@16.4.1`, `react@19.3.0`: `npm audit --omit=dev` = **`0` vulnerabilities**; full `npm audit` = `7 moderate` dev-only. |
| **Backend Dependency Audit** | **High Risk** | `@nestjs/*` `^10.3.0`, `@prisma/client@^5.12.0` (`prisma` CLI resolved `5.22.0`): `npm audit` = **`40` total (`11 high`, `18 moderate`, `11 low`)**; **`npm audit --omit=dev` = `12` production vulnerabilities (`7 high`, `5 moderate`)** affecting `@nestjs/config`, `@nestjs/platform-express`, `@nestjs/swagger`, `@nestjs/common`, `@nestjs/core`, `@nestjs/throttler`, `body-parser`, `file-type`, `js-yaml`, `lodash`, `multer`, `qs` (remediable via NestJS v12 upgrade). |

---

## 5. Current and Target Architecture Assessment

| Architecture Aspect | Documentation Claim | Verified Actual Codebase State | Gap Assessment |
| :--- | :--- | :--- | :--- |
| **Supabase / Firebase Elimination** | Zero Supabase/Firebase dependency | Confirmed via `git grep`: zero `@supabase/*` or `firebase` runtime imports or dependencies exist anywhere (doc/comment-only mentions in `.env.example:30` & `src/lib/database/adapter.ts:6`). | **Verified** |
| **Dual Backend Switch (`src/lib/api/client.ts`)** | Clean cutover via `NEXT_PUBLIC_API_BASE_URL` | Frontend relies solely on browser cookies (`credentials: baseUrl ? "include" : "same-origin"`); **never** sends `Authorization: Bearer`. NestJS sets `sameSite: "lax"`. | **Critical Mismatch (Broken Cross-Origin)** |
| **PostgreSQL ID Column Types** | [`TARGET_ARCHITECTURE.md:310-556`](file:///D:/Projects/niventra%20website/docs/architecture/TARGET_ARCHITECTURE.md#L310-L556) shows `@db.Uuid` primary keys | Actual [`schema.prisma`](file:///D:/Projects/niventra%20website/backend/prisma/schema.prisma) uses `@db.VarChar(128)` string IDs (`usr_...`, `ENQ-2026-...`, `DEL-2026-...`) for SQLite parity. | **Doc Drift** |
| **Token & Cookie Security Model** | [`TARGET_ARCHITECTURE.md:123,565-568`](file:///D:/Projects/niventra%20website/docs/architecture/TARGET_ARCHITECTURE.md#L565-L568) claims rotating refresh tokens & `SameSite=Strict` | Actual `AuthController` sets stateless 15-min HS256 JWT in `SameSite=Lax` cookie (`auth.controller.ts:40`); **no refresh token endpoint or rotation exists**. | **Doc Drift + Design Gap** |
| **Health / Metrics Endpoint** | [`TARGET_ARCHITECTURE.md:45`](file:///D:/Projects/niventra%20website/docs/architecture/TARGET_ARCHITECTURE.md#L45) lists `Health & Metrics` domain | **Absent** — no `/api/health` or database readiness probe controller exists in NestJS or Next.js. | **Not Implemented** |
| **Object Storage & Streaming** | S3/R2 pre-signed upload & private stream | [`storage.adapter.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/storage/storage.adapter.ts) checks env vars for status only; actual reads use `fs.createReadStream` locally. No upload binary endpoint. | **Stub / Incomplete** |
| **Product Catalog Admin RBAC** | [`API_REFERENCE.md:417`](file:///D:/Projects/niventra%20website/docs/api/API_REFERENCE.md#L417) documents `ADMIN` or `STAFF` for `POST /api/products` | Actual [`ProductsController`](file:///D:/Projects/niventra%20website/backend/src/modules/investments/products.controller.ts#L25) enforces `@Roles("ADMIN")` only. | **Doc Drift** |
| **AI / Chatbot Engine** | [`TARGET_ARCHITECTURE.md:157`](file:///D:/Projects/niventra%20website/docs/architecture/TARGET_ARCHITECTURE.md#L157) cites optional `pgvector` semantic RAG | Actual `ChatbotService` uses static deterministic keyword matching against institutional policy FAQs. | **Doc Drift (Accurate behavior, stale doc)** |

---

## 6. Database Schema Discrepancy Reconciliation (14 vs 15 Tables)

Earlier documentation and migration reports cited **14 migrated SQLite tables** alongside a **15-table PostgreSQL Prisma schema** without causing data loss. This discrepancy is **completely reconciled**:

- **Existing SQLite Database (`data/niventra.db`):** Contains **`14` tables** (`users`, `sessions`, `products`, `documents`, `kyc_records`, `investments`, `investment_transactions`, `project_applications`, `project_status_history`, `enquiries`, `grievances`, `notifications`, `deletion_requests`, `audit_logs`), matching `data/niventra_migration_manifest.json` (`14` keys in `tableCounts`, `52` total rows) and [`scripts/migrate-sqlite-to-pg.mjs`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs).
- **Physical Backup Verified:** `data/backups/niventra.db.pre-audit-backup-20261111` (`151,552` bytes) exists on disk matching `data/niventra.db` (`151,552` bytes).
- **Target PostgreSQL Schema ([`backend/prisma/schema.prisma`](file:///D:/Projects/niventra%20website/backend/prisma/schema.prisma) & [`migration.sql`](file:///D:/Projects/niventra%20website/backend/prisma/migrations/20261111000000_init/migration.sql)):** Defines **`15` PostgreSQL tables**.
- **Exact 15th Table:** **`password_reset_tokens`** ([`schema.prisma`](file:///D:/Projects/niventra%20website/backend/prisma/schema.prisma#L149-L162), [`migration.sql`](file:///D:/Projects/niventra%20website/backend/prisma/migrations/20261111000000_init/migration.sql#L65-L74)). This table supports NestJS password-recovery workflows (`AuthService.forgotPassword` / `resetPassword`) which do not exist in SQLite; it intentionally starts with `0` rows on PostgreSQL initialization.

---

## 7. Table-by-Table Migration Verification

Verified read-only across `data/niventra.db` (`node:sqlite`), `data/niventra_migration_manifest.json`, `data/niventra_postgres_export.sql` (`62` lines, `1 BEGIN`, `1 COMMIT`, `52 INSERT ... ON CONFLICT DO NOTHING`), `scripts/verify-migration-parity.mjs`, and `backend/prisma/migrations/20261111000000_init/migration.sql`:

| # | Table Name | SQLite Rows | Export `.sql` Inserts | FK Orphans (SQLite) | Verified Schema/Migration Parity & Specific Risks |
| :-: | :--- | :-: | :-: | :-: | :--- |
| 1 | `users` | `5` | `5` | N/A | **5 rows have `created_at = NULL`** in SQLite (script coerces to `CURRENT_TIMESTAMP`); two authentic real users present whose emails are hardcoded in tracked docs/scripts. |
| 2 | `sessions` | `5` | `5` | `0` (`user_id`) | SQLite has 5 columns; PG adds nullable `user_agent` and `ip_address` (both omitted safely in `INSERT` column list). |
| 3 | `password_reset_tokens` | N/A | `0` | N/A | **15th PG-only table** (`user_id -> users.id`, `ON DELETE CASCADE`); verified intentionally excluded from SQLite export. |
| 4 | `products` | `2` | `2` | N/A | `slug` UNIQUE enforced in PG; enums map cleanly (`DEBENTURE`, `PUBLISHED`). |
| 5 | `documents` | `3` | `3` | N/A | `is_public` integer (`0/1`) maps cleanly to PG `BOOLEAN` (`true/false`). |
| 6 | `kyc_records` | `1` | `1` | `0` (`user_id`) | Unique `(user_id)` FK with cascade; Aadhaar/Passport regex missing in NestJS DTO. |
| 7 | `investments` | `2` | `2` | `0` (`user_id`, `product_id`) | **`sqlNum` uses JS `Number()` IEEE-754 float coercion** before `NUMERIC(18,2)` export; **no FK index on `product_id`**; parity script skips `product_id` check; zero `CHECK (principal_amount > 0)`. |
| 8 | `investment_transactions` | `6` | `6` | `0` (`investment_id`, `user_id`) | **`sqlNum` JS float coercion**; `payment_reference` lacks `UNIQUE` index in PG (double-credit/replay risk). |
| 9 | `project_applications` | `3` | `3` | `0` (`assigned_to`) | **`sqlNum` JS float coercion** (`total_cost`, `funding_requested`, `promoter_contribution`); `documents` JSON string maps to PG `JSONB`; **no index on `assigned_to`**; parity script skips `assigned_to`; zero `CHECK (funding_requested <= total_cost)`. |
| 10 | `project_status_history` | `2` | `2` | `0` (`project_id`) | `changed_by` (`VarChar(255)`) stores actor string/identifier without FK constraint (matches SQLite schema cleanly). |
| 11 | `enquiries` | `6` | `6` | `0` (`user_id`, `assigned_to`) | **Parity script skips FK orphan checks** on both `user_id` & `assigned_to`; **no FK index on `assigned_to`**. |
| 12 | `grievances` | `1` | `1` | `0` (`user_id`, `assigned_to`) | `0` null `sla_deadline` rows in SQLite; **parity script skips FK checks**; **no FK index on `assigned_to`**. |
| 13 | `notifications` | `3` | `3` | `0` (`user_id`) | **Parity script skips FK check** on `user_id`; legacy/backend links point to nonexistent `/dashboard/{enquiries,grievances,security}/` routes. |
| 14 | `deletion_requests` | `0` | `0` | `0` (`user_id`) | **Parity script skips FK check**; **no index on `user_id`**. |
| 15 | `audit_logs` | `13` | `13` | N/A | Historical string actor refs (`actor_id` intentionally un-constrained for immutable retention after deletion). |
| **Σ** | **15 PG / 14 SQLite** | **52** | **52** | **0 Orphans** | **Live PostgreSQL `psql` execution & `prisma migrate deploy` remain UNVERIFIED.** |

---

## 8. NestJS Module Completion Matrix (All 15 Domains)

All 15 modules are imported in [`AppModule`](file:///D:/Projects/niventra%20website/backend/src/app.module.ts#L50-L64) (`AuditLogsModule` & `NotificationsModule` via `@Global()`). **`6` domains have unit `.spec.ts` files (`27` tests) and `9` domains have zero dedicated unit tests**; E2E tests (`9` cases) mock `PrismaService` in memory.

| # | Domain Module | Controllers & Endpoints | Unit Spec | Completion Classification | Verified Gaps / Defects |
| :-: | :--- | :--- | :---: | :--- | :--- |
| 1 | **Authentication** (`auth`) | `POST register, login, logout, forgot-password, reset-password`, `GET me` | Yes (`auth.service.spec.ts`) | **Partial** | `SameSite=Lax` cookie fails split-origin; `clearCookie` misses cookie flags; stateless JWT unrevoked on logout/reset; no refresh tokens; no `algorithms: ["HS256"]` pin; no MFA/email verify. |
| 2 | **Users & Profiles** (`users`) | `AccountController` (`/api/account/*`: `6` routes) + duplicate `UsersController` (`/api/users/*`: `6` routes) | **No** | **Partial** | Duplicate controller surface (`/account` vs `/users`); `changePassword` does not revoke existing sessions/JWTs; `requestDeletion` (`DEL-2026-`) makes password optional & has `count()+1` race condition. |
| 3 | **Project Funding** (`project-funding`) | `POST /project-funding`, `GET /`, `GET /:id`, `PATCH /:id` (`ADMIN/STAFF`) | **No** | **Partial** | `randomInt(1000,9999)` reference generation lacks collision retry; query `status`/`category` unvalidated enums; cost units (`INR` vs `Lakhs`) undocumented consistently. |
| 4 | **Documents** (`documents`) | `GET /documents`, `POST /documents` (`ADMIN`), `GET /:id`, `GET /:id/download` | Yes (`documents.service.spec.ts`) | **Stub / Vulnerable** | **`findOne`/`getDownloadStream` omits `status="APPROVED"` and exposes non-public docs to `PUBLIC`-role users**; S3/R2 SDK missing (`storage.adapter.ts` local disk only); no file upload endpoint; hardcoded `.pdf` filename in `Content-Disposition`; no max size / MIME allowlist in DTO. |
| 5 | **Appointments** (`appointments`) | `POST /enquiries`, `GET /enquiries`, `PATCH /enquiries/:id` (`ADMIN/STAFF`) | **No** | **Partial** | `ENQ-2026-` uses `count() + 1` race condition & hardcoded `2026` year prefix; emits dead `/dashboard/enquiries/` notification links. |
| 6 | **Investor Accounts** (`investor-accounts`) | `GET /kyc`, `POST /kyc`, `PATCH /kyc` (`ADMIN/STAFF`) | Yes (`investor-accounts.service.spec.ts`) | **Partial** | `SubmitKycDto` validates PAN format via `@Matches` only; no Aadhaar/Passport/VoterID regex validation. |
| 7 | **Investments & Products** (`investments`) | `GET /investments`, `GET /investments/products`, `GET /investments/:id`; `GET/POST /products` | Yes (`investments.service.spec.ts`) | **Partial (Read-Only)** | **No endpoints to create, allot, adjust, mature, or redeem investments**; unvalidated `status` query cast risks Prisma 500; `createProduct` ID `prod_${Date.now()}`. |
| 8 | **Transactions** (`transactions`) | `GET /transactions` | **No** | **Stub (Read-Only)** | Query-only ledger list; zero payout, coupon accrual, TDS deduction, reconciliation, or idempotent credit/debit mutation endpoints. |
| 9 | **Portfolio** (`portfolio`) | `GET /portfolio/summary` | **No** | **Partial** | Duplicates `InvestmentsService` logic using JS `Number()` float `+` summation instead of PostgreSQL aggregate arithmetic. |
| 10 | **Branches** (`branches`) | `GET /branches` (static directory) | **No** | **Production-ready (Static)** | Works cleanly as read-only reference directory (`25` locations, search/filter), zero unit spec. |
| 11 | **Calculator** (`calculator`) | `POST /calculator/simulate` | Yes (`calculator.service.spec.ts`) | **Partial (Gated)** | Calculation engine functions cleanly, **but gated under Governance Decision 7** awaiting CFO sign-off on compounding/TDS rules. |
| 12 | **Chatbot** (`chatbot`) | `POST /chat` | Yes (`chatbot.service.spec.ts`) | **Partial** | Rule-based institutional FAQ matching (zero LLM/vector integration); functional fallback with audit logging. |
| 13 | **Notifications** (`notifications`) | `GET /notifications`, `PATCH /notifications/:id/read` + `@Global` service | **No** | **Partial** | Resend email dispatch coded; emits broken `/dashboard/{enquiries,grievances,security}/` links; logs masked recipient status on fallback. |
| 14 | **Admin & Grievances** (`admin`) | `GET /admin/overview`, `GET/PATCH /admin/grievances`, `POST/GET/PATCH /grievances` | **No** | **Partial** | `GRV-2026-` uses `count() + 1` race & hardcoded `2026` year; emits dead `/dashboard/grievances/` link; no user/role management endpoints (`ADMIN` role assignment still manual SQL). |
| 15 | **Audit Logs** (`audit-logs`) | `GET /audit-logs` (`ADMIN`) | **No** | **Partial** | Append-only logging operational across domain services (`@Global`), **but** lacks immutable tamper-chaining, unit tests, and pagination bounds testing. |
| — | **Health / Ops** *(Missing)* | *None* | N/A | **Not Implemented** | [`AppModule`](file:///D:/Projects/niventra%20website/backend/src/app.module.ts) has **no `/api/health`** liveness/readiness endpoint referencing DB connectivity. |

---

## 9. Frontend Integration Matrix (All User Journeys)

All 48 compiled Next.js `16.4.1` routes compile cleanly (`npm run build`), with centralized transport in [`src/lib/api/client.ts`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts). Below is verified split-mode readiness (`NEXT_PUBLIC_API_BASE_URL` pointing to NestJS):

| # | User Journey | Primary Frontend File | Transport Mode in Cutover | Cutover Verification Verdict |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Registration | [`src/app/register/page.tsx`](file:///D:/Projects/niventra%20website/src/app/register/page.tsx) | `apiClient.register()` | **Broken Cross-Origin:** Registration succeeds, but returned `SameSite=Lax` cookie is rejected cross-origin on subsequent requests. |
| 2 | Login & Session Persistence | [`src/app/login/page.tsx`](file:///D:/Projects/niventra%20website/src/app/login/page.tsx) | `apiClient.login()`, `getMe()` | **Broken Cross-Origin:** Same `SameSite=Lax` cookie drop + no `Bearer` header persistence in [`client.ts`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts). |
| 3 | **Forgot / Reset Password** | [`src/app/login/page.tsx:87-95`](file:///D:/Projects/niventra%20website/src/app/login/page.tsx#L87-L95) | **Local `setTimeout` Mock** | **Not Wired:** `client.ts` has zero `forgotPassword`/`resetPassword` calls and `/login` ignores `?resetToken=` links sent by NestJS. |
| 4 | Investor Overview & Holdings | [`src/app/dashboard/page.tsx`](file:///D:/Projects/niventra%20website/src/app/dashboard/page.tsx), [`HoldingsLedgerTab.tsx`](file:///D:/Projects/niventra%20website/src/components/dashboard/HoldingsLedgerTab.tsx) | `apiClient.getInvestments()`, `getTransactions()` | Works via `client.ts` once auth fixed; uses NestJS summary/investments endpoints (`GET /portfolio/summary` unused separately in UI). |
| 5 | Notification Bell / Alerts | [`src/app/dashboard/page.tsx`](file:///D:/Projects/niventra%20website/src/app/dashboard/page.tsx), [`client.ts`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts) | **Not Wired** | **Not Wired:** `client.ts` lacks `/api/notifications` methods completely, dashboard never fetches `/api/notifications`, and backend notification `link` URLs (`/dashboard/enquiries/`, `/dashboard/grievances/`, `/dashboard/security/`) are 404 routes. |
| 6 | KYC & Compliance | [`KycComplianceTab.tsx`](file:///D:/Projects/niventra%20website/src/components/dashboard/KycComplianceTab.tsx) | `apiClient.getKyc()`, `submitKyc()` | Wired to NestJS `/api/kyc`. |
| 7 | Consultations / Scheduling | [`ConsultationForm.tsx`](file:///D:/Projects/niventra%20website/src/components/forms/ConsultationForm.tsx) | `apiClient.createEnquiry()` | Wired cleanly (honeypot + DPDP consent). |
| 8 | Investor Documents Download | [`ConsultationsDocumentsGrievancesTabs.tsx`](file:///D:/Projects/niventra%20website/src/components/dashboard/ConsultationsDocumentsGrievancesTabs.tsx) | `apiClient.getDocuments()` + download URL | **Partial / Broken Storage:** Download streams only from local NestJS filesystem & enforces broken ACL (`SEC-02`) + `.pdf` filename extension hardcode. |
| 9 | Project Funding Submission | [`src/app/project-funding/page.tsx`](file:///D:/Projects/niventra%20website/src/app/project-funding/page.tsx#L146-L167) | `apiClient.submitProjectFunding()` | **Partial Mock:** Uploaded document attachments are simulated (`Math.random()` byte size metadata), not binary uploads. |
| 10 | Grievances & SLA Tracking | [`GrievanceForm.tsx`](file:///D:/Projects/niventra%20website/src/components/forms/GrievanceForm.tsx) | `apiClient.submitGrievance()` | Wired cleanly; backend links `/dashboard/grievances/` return 404. |
| 11 | Profile, Preferences & Password Change | [`src/app/dashboard/settings/page.tsx`](file:///D:/Projects/niventra%20website/src/app/dashboard/settings/page.tsx) | `apiClient` (`/api/account/*`) | Wired cleanly; password change fails to revoke active tokens. |
| 12 | DPDP Account Deletion | [`AccountDeletionForm.tsx`](file:///D:/Projects/niventra%20website/src/components/forms/AccountDeletionForm.tsx) | `apiClient.requestAccountDeletion()` | Wired, **but** authenticated users aren't strictly forced to supply current password (`SEC-06`). |
| 13 | Branch Directory | [`BranchDirectory.tsx`](file:///D:/Projects/niventra%20website/src/components/branches/BranchDirectory.tsx) | **Static Local TS Data** | **Not Wired:** Uses local TS dataset rather than NestJS `/api/branches` (low risk while parity holds). |
| 14 | Indicative Return Calculator | [`IndicativeReturnCalculator.tsx`](file:///D:/Projects/niventra%20website/src/components/calculator/IndicativeReturnCalculator.tsx), [`DashboardCalculatorTab.tsx`](file:///D:/Projects/niventra%20website/src/components/dashboard/DashboardCalculatorTab.tsx) | **Local `src/lib/calculator.ts`** | **Not Wired:** Runs locally rather than calling NestJS `POST /api/calculator/simulate`. Gated by CFO Decision 7. |
| 15 | Product Catalog & Detail View | [`ProductCatalogView.tsx`](file:///D:/Projects/niventra%20website/src/components/products/ProductCatalogView.tsx), [`products/[slug]/page.tsx`](file:///D:/Projects/niventra%20website/src/app/products/[slug]/page.tsx) | `apiClient.getProducts()` vs Static TS | `/products/[slug]` uses static `PRODUCTS_DATABASE`; `ProductCatalogView` silently falls back to `ILLUSTRATIVE_PRODUCTS` on API failure. |
| 16 | Admin Review Portal | [`src/app/admin/page.tsx`](file:///D:/Projects/niventra%20website/src/app/admin/page.tsx), [`AdminOverviewTab.tsx`](file:///D:/Projects/niventra%20website/src/components/admin/AdminOverviewTab.tsx), [`ProjectReviewModal.tsx`](file:///D:/Projects/niventra%20website/src/components/admin/ProjectReviewModal.tsx) | `apiClient` (`project-funding`, `enquiries`, `grievances`, `audit-logs`) | **Unit Bug:** Admin UI computes `(total_cost / 100).toFixed(2) Cr` assuming Lakhs, whereas `API_REFERENCE.md` examples pass full INR (`450000000` -> renders erroneously as `4500000.00 Cr`). |

---

## 10. Security Findings and Severity

| ID | Severity | Component / Symbol (`File:Line`) | Finding & Impact | Required Remediation |
| :--- | :---: | :--- | :--- | :--- |
| **SEC-01** | **Critical / High** | [`AuthController`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.controller.ts#L36-L44), [`main.ts`](file:///D:/Projects/niventra%20website/backend/src/main.ts), [`client.ts`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts#L252-L256) | Cookie set with `sameSite: "lax"` (dropped cross-origin); `clearCookie` at line `103` omits `httpOnly`/`secure`/`sameSite`; `main.ts` omits `app.set("trust proxy", 1)` breaking per-IP throttling behind reverse proxy; switching to `SameSite=None` without CSRF tokens exposes mutations to CSRF. | Enable `app.set("trust proxy", 1)`; either serve API under same root eTLD+1 subdomain (`api.niventracapitaladvisory.com`) or implement double-submit CSRF tokens + match `clearCookie` attributes (or BFF proxy via Next.js). |
| **SEC-02** | **High** | [`DocumentsService`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.service.ts#L126-L153), [`DocumentsController`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.controller.ts#L54), [`storage.adapter.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/storage/storage.adapter.ts) | `findOne`/`getDownloadStream` checks `if (!doc.isPublic && !user)` ONLY — omits `doc.status === "APPROVED"` and permits `PUBLIC`-role users to read draft/archived/private docs; controller hardcodes `.pdf` extension; S3/R2 SDK unimplemented (`storage.adapter.ts` falls back strictly to ephemeral local disk). | Enforce `status === "APPROVED"` and role allowlist (`ADMIN`, `STAFF`, `INVESTOR`) on non-public documents; implement real `@aws-sdk/client-s3` storage + multipart/pre-signed upload + real MIME/size limits. |
| **SEC-03** | **High** | [`ENGINEERING_AUDIT.md:151-156`](file:///D:/Projects/niventra%20website/docs/architecture/ENGINEERING_AUDIT.md#L151-L156), [`MIGRATION_STRATEGY.md:11,71`](file:///D:/Projects/niventra%20website/docs/database/MIGRATION_STRATEGY.md#L11), [`migrate-sqlite-to-pg.mjs:126`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs#L126), [`verify-migration-parity.mjs:89`](file:///D:/Projects/niventra%20website/scripts/verify-migration-parity.mjs#L89) | Authentic personal email PII (`[REDACTED]`) committed verbatim in tracked Git docs & migration scripts; `verify-migration-parity.mjs` prints raw emails directly to stdout/CI logs. | Redact/remove personal emails from tracked docs/scripts, pass parity checks via env/masked hashes, and rewrite/rotate history or squash branch before public exposure (with team sign-off). |
| **SEC-04** | **High** | [`env.validation.ts:48-62`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts#L48-L62), [`main.ts:92-93`](file:///D:/Projects/niventra%20website/backend/src/main.ts#L92-L93), [`next.config.ts`](file:///D:/Projects/niventra%20website/next.config.ts) | Staging (`NODE_ENV=staging`) silently falls back to hardcoded `"niventra-nonprod-ephemeral-signing-secret-do-not-use-in-prod"` and does not require `DATABASE_URL`; Swagger `/api/docs` unconditionally mounted in production; `next.config.ts` sets zero security headers (`CSP`, `HSTS`, `X-Frame-Options`, `nosniff`, `Referrer-Policy`). | Enforce `JWT_SECRET` (min 32 high-entropy chars) and `DATABASE_URL` in both `staging` & `production`; disable Swagger in production unless explicitly gated; configure HTTP security headers in `next.config.ts`. |
| **SEC-05** | **High** | [`AuthService`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.service.ts#L257-L277), [`AuthModule`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.module.ts#L12-L21), [`UsersService`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.service.ts#L209-L247), [`backend/package.json`](file:///D:/Projects/niventra%20website/backend/package.json), [`src/lib/auth/password.ts:22`](file:///D:/Projects/niventra%20website/src/lib/auth/password.ts#L22), [`src/app/api/auth/login/route.ts`](file:///D:/Projects/niventra%20website/src/app/api/auth/login/route.ts) | Stateless 15m Bearer JWT stays valid after logout, password reset, and password change (`UsersService.changePassword` clears neither DB `sessions` nor JWTs); `JwtModule` omits `verifyOptions.algorithms: ["HS256"]`; backend production deps have **`12` vulnerabilities (`7 high`, `5 moderate`)**; legacy Next.js `/api/auth/login` lacks rate limiting and `src/lib/auth/password.ts` omits `timingSafeEqual` buffer length guard. | Implement token-version (`token_version`) claim checked against user row + revoke sessions on `changePassword`; pin `algorithms: ["HS256"]`; upgrade NestJS packages (`v12`) to clear all 12 prod CVEs; harden Next.js `verifyPassword` & login throttling while dual-stack runs. |
| **SEC-06** | **Medium** | [`UsersService.requestDeletion:259`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.service.ts#L259), [`delete/route.ts:26`](file:///D:/Projects/niventra%20website/src/app/api/account/delete/route.ts#L26), [`InvestmentsService:34`](file:///D:/Projects/niventra%20website/backend/src/modules/investments/investments.service.ts#L34), [`ProjectFundingService:157-160`](file:///D:/Projects/niventra%20website/backend/src/modules/project-funding/project-funding.service.ts#L157-L160), [`AppointmentsService`](file:///D:/Projects/niventra%20website/backend/src/modules/appointments/appointments.service.ts#L51-L52), [`AdminService`](file:///D:/Projects/niventra%20website/backend/src/modules/admin/admin.service.ts#L44-L45) | Authenticated deletion (`requestDeletion` / Next.js `delete/route.ts`) skips password verification if `password` is omitted; unvalidated query strings cast directly (`as InvestmentStatus`, `as ProjectStatus`) risk Prisma `500`; sequential `count()+1` IDs (`ENQ-2026-`, `GRV-2026-`, `DEL-2026-`) have concurrency collision & hardcoded year `2026`; `SubmitKycDto` missing non-PAN ID regexes. | Require `currentPassword` whenever authenticated user requests deletion; validate query enums via DTO + `ValidationPipe`; replace `count()+1` with PostgreSQL sequences or timestamp+CSPRNG unique refs; validate KYC ID formats per `idType`. |

---

## 11. Financial Data Integrity Findings

1. **IEEE-754 Float Coercion in Migration & Portfolio Aggregation:**
   - [`sqlNum`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs#L43-L49) passes monetary values through `Number(val)` before serializing for `NUMERIC(18,2)` columns across `investments`, `investment_transactions`, and `project_applications`.
   - [`PortfolioService.getSummary`](file:///D:/Projects/niventra%20website/backend/src/modules/portfolio/portfolio.service.ts) accumulates portfolio totals in JavaScript floats (`Number(...)`) rather than PostgreSQL `SUM(...)` aggregates or fixed-point integer paise / `Decimal`.
2. **Missing PostgreSQL Financial Constraints & Idempotency:**
   - [`migration.sql`](file:///D:/Projects/niventra%20website/backend/prisma/migrations/20261111000000_init/migration.sql) omits `CHECK` constraints (`principal_amount > 0`, `interest_rate_pa >= 0`, `funding_requested <= total_cost`, non-negative accrued/paid/pending interest) and omits a `UNIQUE` index on `investment_transactions.payment_reference` to prevent duplicate payout/settlement credits.
   - Missing secondary FK indexes on `investments.product_id`, `project_applications.assigned_to`, `enquiries.assigned_to`, `grievances.assigned_to`, and `deletion_requests.user_id`.
3. **Absence of Core Investment Ledger Write Workflows:**
   - Both `InvestmentsModule` and `TransactionsModule` expose `GET` endpoints exclusively. No transactional backend mechanism exists for subscription intake, allotment approval vs escrow separation, scheduled coupon accruals, payout execution, TDS (Section 193/194A) deduction ledger entries, or redemption settlement.
4. **Unit Ambiguity in Project Funding Costs:**
   - [`AdminOverviewTab.tsx`](file:///D:/Projects/niventra%20website/src/components/admin/AdminOverviewTab.tsx) and [`ProjectReviewModal.tsx`](file:///D:/Projects/niventra%20website/src/components/admin/ProjectReviewModal.tsx) divide `total_cost` by `100` to render `Cr` (expecting Lakhs), whereas [`API_REFERENCE.md`](file:///D:/Projects/niventra%20website/docs/api/API_REFERENCE.md) examples use full INR integers (`450000000`).

---

## 12. Actual Test Results (Verified vs Unverified)

All executable local checks below were **independently re-run in this audit session** with zero edits to source code or databases:

| Suite / Command | Outcome | Observed Counts & Details | Mocking / Environment Caveats |
| :--- | :---: | :--- | :--- |
| Root `npm run lint` (`eslint`) | **PASS** | Exit `0` | Clean ESLint across Next.js frontend. |
| Root `npm run typecheck` (`tsc --noEmit`) | **PASS** | Exit `0` | Clean under `strict: true`. |
| Root `npm test` (`node --test`) | **PASS** | **`51` passed, `0` failed, `0` skipped** (`8` files in `tests/*.test.mjs`) | Tests SQLite local logic & static source-string checks (`apiClient` wiring verified statically). |
| Root `npm run build` (`next build`) | **PASS** | Exit `0`, Next.js `16.4.1` Turbopack (`48` compiled routes) | Clean production build. |
| `node scripts/verify-migration-parity.mjs` | **PASS** | Exit `0` (`52` rows matched across `14` SQLite tables = manifest = `.sql`) | **Incomplete FK coverage:** skips 7 nullable/secondary FK checks (verified `0` orphans separately via read-only `node:sqlite`); prints raw PII emails to stdout. |
| Backend `npx prisma validate` | **CONDITIONAL** | Fails (`P1012`) if `DATABASE_URL` unset; **PASSES (`exit 0`)** when `DATABASE_URL` exported (`Prisma CLI 5.22.0`) | Validates schema syntax only; does not test DB connection or SQL execution. |
| Backend `npm run lint` | **PASS** | Exit `0` | Clean ESLint across `backend/{src,test}`. |
| Backend `npm run typecheck` | **PASS** | Exit `0` | Clean `tsc --noEmit`. |
| Backend `npm run build` (`nest build`) | **PASS** | Exit `0` | Compiles cleanly to `backend/dist/`. |
| Backend `npm test` (`jest`) | **PASS** | **`6` passed / `6` total suites; `27` passed, `0` failed, `0` skipped** | **Mocked `PrismaService`** in-memory; **`9` of `15` modules lack dedicated unit `.spec.ts` files**. |
| Backend `npm run test:e2e` | **PASS** | **`1` suite; `9` passed, `0` failed, `0` skipped** | **Mocked `PrismaService`** (`test/app.e2e-spec.ts`), NOT real PostgreSQL HTTP/SQL roundtrip. |
| `npm audit` (Root vs Backend) | **WARN / FAIL** | Root prod=`0`, all=`7 moderate`; Backend **prod=`12` (`7 high`, `5 moderate`)**, all=`40` (`11 high`, `18 moderate`, `11 low`) | Requires NestJS major/minor upgrades in `backend/package.json`. |
| **PostgreSQL `prisma migrate deploy` & `.sql` Import** | **UNVERIFIED / BLOCKED** | Never executed against live/disposable PostgreSQL | Blocked locally (`psql` unavailable; Docker Desktop daemon stopped). |
| **End-to-End Cross-Origin Next.js ↔ NestJS** | **UNVERIFIED** | Zero Playwright / live browser flows tested against split Next.js + NestJS servers | Split cookie cutover will fail as currently coded (`SEC-01`). |

---

## 13. Staging Deployment Readiness

**Status:** **NOT READY (Requires P0 Staging Remediation First)**  
Staging deployment can proceed **only** after resolving P0 staging gates: `env.validation.ts` staging enforcement, `trust proxy`, cookie/CORS/CSRF resolution, `/api/health`, S3/object storage or explicit staging disk guard, and an end-to-end `prisma migrate deploy` + `data/niventra_postgres_export.sql` dry-run against a disposable PostgreSQL instance.

### Verified Environment Variables Matrix

| Variable | Target Runtime | Verified Status in Codebase | Staging Requirement |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Both | Checked (`production` gates strict checks, logging, secure cookies) | Set explicit `"staging"` or `"production"` (after fixing `env.validation.ts`) |
| `PORT` | Backend | Defaults `4000` in [`main.ts`](file:///D:/Projects/niventra%20website/backend/src/main.ts) | Platform port / `4000` |
| `DATABASE_URL` | Backend / Prisma | Required in `production` ONLY in [`env.validation.ts`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts#L54); required for `prisma validate` | **Mandatory SSL PostgreSQL URI** (`?sslmode=require`) |
| `JWT_SECRET` | Backend | Required >=32 non-placeholder chars in `production` ONLY (`staging` uses unsafe fallback) | **Mandatory >=64-char CSPRNG secret** |
| `JWT_EXPIRES_IN` | Backend | Defaults `15m` in `AuthModule` | `15m` |
| `CORS_ORIGINS` | Backend | CSV origins appended to `DEFAULT_CORS_ORIGINS` | Staging Vercel URL(s) + custom domain |
| `NEXT_PUBLIC_APP_URL` | Frontend & Backend | Appended to CORS origins & used in password reset URL (`NotificationsService:220`) | Exact HTTPS Vercel staging URL |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend (Vercel) | Read by [`src/lib/api/client.ts:232`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts#L232); unset = legacy SQLite routes | **Keep unset in current prod**; set to staging NestJS origin only on staging Vercel preview |
| `RESEND_API_KEY` | Both (`Notifications`) | Wired via `fetch("https://api.resend.com/emails")`; unset logs masked fallback | Needed for email/reset verification in staging |
| `EMAIL_FROM` | Both (`Notifications`) | Verified domain sender string | Verified sender (`notifications@niventracapitaladvisory.com`) |
| `LEAD_NOTIFICATION_EMAILS` | Both (`Notifications`) | CSV recipient list for consultation leads | Staging test inbox only |
| `STAFF_LEAD_NOTIFICATION_EMAILS` | Both (`Notifications`) | CSV recipient list for project funding leads | Staging test inbox only |
| `STORAGE_ROOT_DIR` | Backend (`Documents`) | Local path override (`storage/documents`) | Ephemeral-unsafe unless persistent volume or S3 implemented |
| `S3_BUCKET_NAME`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | Backend (`Documents`) | Read ONLY for status report in [`storage.adapter.ts:34-36`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/storage/storage.adapter.ts#L34-L36); **NO S3 SDK calls implemented** | **SDK integration required** before private staging docs work across deploys |
| `SESSION_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | `.env.example` only | **Unused / Dead variables** — `0` references in `src/` or `backend/src/` | Implement Turnstile or remove unused `.env.example` keys |
| `DEV_ADMIN_PASSWORD`, `DEV_STAFF_PASSWORD`, `DEV_INVESTOR_PASSWORD` | Seeding Scripts | Dev seeding only (`scripts/seed.mjs`, blocked when `NODE_ENV=production`) | Never set or seed demo passwords in staging/prod |

---

## 14. Missing Credentials and Configuration

The following external credentials, infrastructure targets, and environment endpoints are **not configured or unavailable** in this verification environment and prevented end-to-end validation:
1. **Managed PostgreSQL Connection (`DATABASE_URL`):** Staging/production PostgreSQL instance (and local Docker daemon / `psql`) required to verify `prisma migrate deploy` and import `data/niventra_postgres_export.sql`.
2. **Backend Hosting Target & DNS Subdomain:** Railway/Render/ECS/VPS host URL and TLS configuration (ideally `api-staging.niventracapitaladvisory.com` to evaluate cookie root-domain compatibility).
3. **Production High-Entropy Secrets:** `JWT_SECRET` (per environment) and `RESEND_API_KEY` scoped for verified sender domain.
4. **Object Storage Credentials & Bucket:** S3 or Cloudflare R2 bucket, IAM least-privilege keys, KMS/SSE-S3 encryption settings (once `@aws-sdk/client-s3` is added).
5. **Cloudflare Turnstile Keys (Optional/Planned):** Referenced in `.env.example`, zero verification code exists on public forms.

---

## 15. Legal and Regulatory Dependencies

Per [`docs/financial-and-legal-review.md`](file:///D:/Projects/niventra%20website/docs/financial-and-legal-review.md), [`docs/outstanding-business-and-compliance-decisions.md`](file:///D:/Projects/niventra%20website/docs/outstanding-business-and-compliance-decisions.md), and [`docs/business-approval-checklist.md`](file:///D:/Projects/niventra%20website/docs/business-approval-checklist.md), the following statutory items remain **external hard blockers before real investor transactions or production financial cutover**:

1. **Issuer Identity & Companies Act Compliance (DEC-01):** Board resolution, CIN verification, authorized share capital, Private Placement Offer Letter (**Form PAS-4**), and compliance under Sections 42 & 71, Companies Act 2013 and Companies (Share Capital & Debentures) Rules, 2014 (plus DRR provisions).
2. **Debenture Trustee & ROC Security Execution (Gate 4):** Executed Debenture Trust Deed (**Form SH-12**) with a SEBI-registered Debenture Trustee and **ROC Form CHG-9** charge creation workflow, plus scheduled commercial bank **Escrow & Waterfall Agreement** (real-money investments & automated allotments remain strictly prohibited prior to execution).
3. **Return Guidance & Mathematical Certification (DEC-02 / DEC-07):** CFO & Chief Compliance Officer written certification of coupon tiers, simple vs compounding mechanics, day-count conventions (`Actual/365` / `Actual/Actual`), Section 193/194A TDS rules, and resolution of historical copy mismatch (`₹50,360` example vs `14%–16%`) before enabling `/calculator` publicly.
4. **Approved Offering Documents & Investor Clauses (DEC-04):** Legal counsel provision of authentic, redacted/watermarked sample Offer Document (PAS-4) and Term Sheet binaries, plus Clauses 1–7 and 9–10 of `/investor-information/`.
5. **DPDP Act 2023 & Officer Designations (Gates 5–7):** Formal board appointment of **Data Protection Officer (DPO)** and **Grievance Redressal Officer** with official gazette/contact details, written retention schedules (Companies Act 8 yrs / PMLA 5 yrs / Income Tax Act), decommissioning audit of legacy external Vercel CRM (`crm-teal-one-29.vercel.app`), and SEBI compliance sign-off on any future referral incentives (currently disabled).

---

## 16. Outstanding Engineering Tasks

| Priority | Task | Scope / File Targets |
| :---: | :--- | :--- |
| **P0 (Pre-Staging)** | Enforce `JWT_SECRET` & `DATABASE_URL` when `NODE_ENV=staging` | [`backend/src/config/env.validation.ts`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts) |
| **P0 (Pre-Staging)** | Fix split-origin auth, cookie flags (`clearCookie`), `trust proxy`, and CSRF protection | [`backend/src/main.ts`](file:///D:/Projects/niventra%20website/backend/src/main.ts), [`auth.controller.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.controller.ts), [`src/lib/api/client.ts`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts) |
| **P0 (Pre-Staging)** | Fix private/unapproved document ACL (`status === "APPROVED"` + role check + `.pdf` header bug) | [`documents.service.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.service.ts), [`documents.controller.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.controller.ts) |
| **P0 (Pre-Staging)** | Scrub plaintext personal PII emails from tracked docs & migration scripts and prevent stdout printing | [`ENGINEERING_AUDIT.md`](file:///D:/Projects/niventra%20website/docs/architecture/ENGINEERING_AUDIT.md), [`MIGRATION_STRATEGY.md`](file:///D:/Projects/niventra%20website/docs/database/MIGRATION_STRATEGY.md), [`scripts/migrate-sqlite-to-pg.mjs`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs), [`scripts/verify-migration-parity.mjs`](file:///D:/Projects/niventra%20website/scripts/verify-migration-parity.mjs) |
| **P0 (Pre-Staging)** | Run & verify `prisma migrate deploy` + `.sql` import on real disposable PostgreSQL | `backend/prisma/migrations/`, CI `.github/workflows/ci.yml` (+ PG service container) |
| **P0 (Pre-Staging)** | Add `GET /api/health` readiness endpoint + disable Swagger `/api/docs` in production | [`backend/src/main.ts`](file:///D:/Projects/niventra%20website/backend/src/main.ts), new `HealthModule` |
| **P1 (Pre-Cutover)** | Implement real S3/R2 document upload/download + MIME/size bounds & remove Next.js mock metadata upload | [`storage.adapter.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/storage/storage.adapter.ts), [`project-funding/page.tsx`](file:///D:/Projects/niventra%20website/src/app/project-funding/page.tsx) |
| **P1 (Pre-Cutover)** | Upgrade NestJS stack (`v12`) to clear all 12 production `npm audit` vulnerabilities | [`backend/package.json`](file:///D:/Projects/niventra%20website/backend/package.json) |
| **P1 (Pre-Cutover)** | Implement JWT revocation (`tokenVersion`), `algorithms: ["HS256"]` pin, session wipe on password change, mandatory password on authenticated deletion | [`auth.module.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.module.ts), [`auth.guard.ts`](file:///D:/Projects/niventra%20website/backend/src/common/guards/auth.guard.ts), [`users.service.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.service.ts), [`delete/route.ts`](file:///D:/Projects/niventra%20website/src/app/api/account/delete/route.ts) |
| **P1 (Pre-Cutover)** | Wire `/login` Forgot/Reset Password UI to NestJS + fix dead `/dashboard/*` notification deep links + unify `total_cost` units (`INR` vs `Lakhs`) | [`login/page.tsx`](file:///D:/Projects/niventra%20website/src/app/login/page.tsx), [`notifications.service.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/notifications/notifications.service.ts), [`AdminOverviewTab.tsx`](file:///D:/Projects/niventra%20website/src/components/admin/AdminOverviewTab.tsx), [`ProjectReviewModal.tsx`](file:///D:/Projects/niventra%20website/src/components/admin/ProjectReviewModal.tsx) |
| **P1 (Pre-Cutover)** | Add PG FK indexes, `CHECK` constraints, `UNIQUE(payment_reference)`, precision-safe decimal parser (`sqlNum`), & atomic ref IDs (eliminate `count()+1`) | [`migration.sql`](file:///D:/Projects/niventra%20website/backend/prisma/migrations/20261111000000_init/migration.sql), [`migrate-sqlite-to-pg.mjs`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs), `Appointments`/`Admin`/`Users` services |
| **P1 (Pre-Cutover)** | Complete financial write domain (`InvestmentsModule` / `TransactionsModule` allocation, accruals, TDS, redemptions) + SQL aggregate `PortfolioService` | `backend/src/modules/{investments,transactions,portfolio}/` |
| **P2 (Hardening)** | Add `.gitattributes` (normalize LF across `56` files), expand `.gitignore`, add `next.config.ts` CSP/HSTS headers, deduplicate `UsersController` vs `AccountController`, update `API_REFERENCE.md` / `TARGET_ARCHITECTURE.md` / `PRODUCTION_READINESS.md`, add unit tests for 9 untested backend modules + Playwright E2E | Repo config, docs, `backend/src/modules/*/*.spec.ts`, Playwright |

---

## 17. Recommended Next Sprint

**Sprint Focus: Staging Readiness, Cross-Origin Auth & Real PostgreSQL Validation (5–7 Engineering Days)**
1. **Day 1 — Hygiene & PII Remediation:** Add `.gitattributes` and `.gitignore` wildcards; remove committed plaintext emails from docs/scripts; fix the `56` EOF line-ending diffs; harden `env.validation.ts` for staging and add HTTP security headers in `next.config.ts`.
2. **Day 2 — Auth, Proxy & CSRF Architecture:** Add `app.set("trust proxy", 1)` and `/api/health`; implement same-root-domain cookies or CSRF + Bearer handling cleanly between `src/lib/api/client.ts` and `AuthController`; add `tokenVersion` revocation and `algorithms: ["HS256"]` pinning; lock Swagger off in production.
3. **Day 3 — Security & Dependency Upgrade:** Fix `DocumentsService` ACL (`APPROVED` + roles) and wire `@aws-sdk/client-s3` storage; require password for authenticated deletion; replace `count()+1` sequence generation; upgrade NestJS dependencies (`v12`) and verify `npm audit --omit=dev` = `0`.
4. **Day 4 — PostgreSQL Schema Hardening & Live CI Proof:** Add missing FK indexes, `CHECK` constraints, `payment_reference` uniqueness, exact string-decimal export in `migrate-sqlite-to-pg.mjs`, full FK verification in `verify-migration-parity.mjs`, and a live `postgres:16` service container in `.github/workflows/ci.yml` running `prisma migrate deploy`, `.sql` import, and real-DB Prisma E2E tests.
5. **Day 5 — Frontend Wiring & Staging Dry-Run:** Wire Forgot/Reset password UI, `/dashboard` notifications + valid routes, `total_cost` unit alignment, and run Playwright browser tests against Vercel Preview ↔ Staging NestJS + disposable PostgreSQL before pushing branch and opening PR to `main`.

---

## 18. Final GO / NO-GO Recommendation

### Status Taxonomy Breakdown

| Category | Items |
| :--- | :--- |
| **Independently Verified** | • Local Git ancestry on `refinement/minimal-content-cleanup` (`9498531`, 4 commits on top of `78afc1e`, `5` ahead of `main`)<br>• Zero `@supabase/*` or `firebase` runtime imports/dependencies<br>• `14` SQLite tables / `52` rows matching manifest & `.sql` export + `151,552`-byte SQLite backup intact<br>• `15` PG tables reconciliation (`password_reset_tokens` is the 15th PG-only table)<br>• All `15` NestJS modules wired in `AppModule`<br>• Root `lint`, `typecheck`, `build` (`48` Next.js routes), `51` root tests PASS; Backend `lint`, `typecheck`, `build`, `27` unit tests, `9` E2E tests PASS (mocked Prisma) |
| **Previously Reported, Not Independently Verified** | • **"Clean Git working tree": DISPROVED** (`56` files have dirty EOF blank-line diffs; `git diff --check` fails)<br>• **Commits synced to GitHub:** **DISPROVED** (all `4` commits remain local/unpushed)<br>• **`prisma migrate deploy` & `niventra_postgres_export.sql` compatibility:** Unverified against real PostgreSQL engine<br>• **S3 / Resend / Turnstile integrations:** S3 & Turnstile unverified/unimplemented; Resend tested via fallback only |
| **Partially Implemented** | • NestJS domains (`9/15` modules lack unit specs; `Auth`, `Users`/`Account`, `Documents`, `Investments`, `Portfolio`, `ProjectFunding`, `Appointments`, `Admin`, `Notifications`, `InvestorAccounts`)<br>• Migration parity script (skips 7 secondary/nullable FK checks)<br>• Next.js cutover wiring (Password reset mocked; notifications unfetched; `/products/[slug]` static; project funding docs simulated; `total_cost` INR/Lakhs unit mismatch) |
| **Not Implemented** | • Real S3/R2 object upload/download SDK calls & multipart upload<br>• Financial write workflows (investment subscription, allotment, accruals, TDS, payout batches, redemptions)<br>• `/api/health` readiness endpoint<br>• Refresh-token rotation, CSRF protection, MFA, and JWT `tokenVersion` revocation<br>• Live PostgreSQL integration & Playwright E2E CI pipeline |
| **Blocked by Missing Access or Credentials** | • Live PostgreSQL `DATABASE_URL` (`psql` / running Postgres or Docker daemon unavailable locally)<br>• Staging/Prod hosting hosts, DNS subdomain routing, Resend live API key, S3/R2 bucket credentials<br>• Corporate legal & CFO sign-offs (`DEC-01` through `DEC-07`: CIN, Form PAS-4, Debenture Trustee, Escrow, DPO/GRO appointments, calculator approval) |

### Decision Summary

| Gate | Verdict | Rationale |
| :--- | :---: | :--- |
| **Staging Deployment** | **CONDITIONAL NO-GO** | **Do not deploy to staging** until P0 staging fixes complete (`env.validation.ts` staging checks, cross-origin cookie/CSRF + `trust proxy` fix, document ACL fix, PII removal from repo, `/api/health`, S3 or explicit staging disk config, and a verified `prisma migrate deploy` + SQL dry-run against disposable Postgres). |
| **Production Cutover & Data Migration** | **STRICT NO-GO** | Blocked by: (1) unverified live PostgreSQL migration & missing decimal/PK/FK/check constraints, (2) broken split-domain cookie auth & unimplemented password reset/document S3 storage, (3) `12` backend prod `npm audit` vulnerabilities (`7 high`), (4) read-only investment/transaction ledger, and (5) pending statutory corporate/SEBI/Companies Act/DPDP legal approvals. **Keep production Vercel + SQLite running unchanged (`NEXT_PUBLIC_API_BASE_URL` unset) until all gates pass.** |
