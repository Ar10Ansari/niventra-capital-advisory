# Niventra Capital Advisory — GitHub Release Readiness Report

**Report Date:** November 12, 2026  
**Repository:** `https://github.com/Ar10Ansari/niventra-capital-advisory`  
**Working Branch:** `refinement/minimal-content-cleanup`  
**Classification:** Internal Engineering & Management Release Audit

---

## 1. Executive Summary

The Niventra Capital Advisory repository has completed Sprint 1 security remediation and final codebase/documentation stabilization. All automated frontend (`52` Node tests, ESLint `--max-warnings 0`, strict TypeScript, `48`-route Next.js build) and backend (`42` Jest unit tests across `9` suites, `10` Supertest E2E cases, Prisma validate, ESLint `--max-warnings 0`, strict TypeScript, NestJS build) checks pass cleanly with **`0` production runtime `npm audit` vulnerabilities**.

**Release Recommendation:** Ready for GitHub Pull Request code review once maintainers resolve the **local unpushed commit history PII blocker** (`2ded383` and `9498531` precede `HEAD` on local `refinement/minimal-content-cleanup` and were not rewritten automatically under no-history-rewrite rules). **Production hosting on Vercel must remain untouched** (Next.js + SQLite mode) until live PostgreSQL provisioning, S3/R2 storage implementation, and corporate/statutory sign-offs (`DEC-01`–`DEC-07`) are completed.

---

## 2. Repository Cleanup Completed

- **Dead Code Removed:** Deleted unused `src/scripts/seed.ts` (superseded by canonical CLI seeders [`scripts/seed.mjs`](../scripts/seed.mjs) and [`scripts/seed-demo.mjs`](../scripts/seed-demo.mjs)).
- **Trailing Whitespace & EOF Normalization:** Restored `41` untouched baseline files that carried accidental trailing EOF blank lines and normalized remaining modified files so `git diff --check` passes with exit `0`; added [`.gitattributes`](../.gitattributes) (`* text=auto eol=lf`).
- **Git Ignore Hardening:** Added wildcards in [`.gitignore`](../.gitignore) for `*.db`, `*.sqlite*`, `*.key`, `*.p12`, and `*.pfx`.
- **Archived Assets Preserved:** Preserved legacy reference artifacts in `preserved-assets/`, `data/niventra.db`, and `data/backups/niventra.db.pre-audit-backup-20261111` (`151,552` bytes) untouched.
- **Internal Markdown Link Verification:** Verified `0` broken relative links across `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `docs/`.

---

## 3. Frontend Changes

- **Oversized Component Decomposition:** Split [`src/app/project-funding/page.tsx`](../src/app/project-funding/page.tsx) (`1,170` lines -> `< 240` lines orchestrator) into focused configuration/validators ([`projectFundingConfig.ts`](../src/components/project-funding/projectFundingConfig.ts)) and dedicated step components ([`ProjectFundingSteps.tsx`](../src/components/project-funding/ProjectFundingSteps.tsx)), eliminating `Math.random()` simulated file sizing in favor of deterministic sample fixture metadata.
- **Admin Monetary Formatting & Badge Deduplication:** Added [`adminFormatters.ts`](../src/components/admin/adminFormatters.ts) (`formatProjectAmountCr`, `getProjectStatusBadgeClass`) used consistently across [`AdminOverviewTab.tsx`](../src/components/admin/AdminOverviewTab.tsx), [`AdminProjectsTab.tsx`](../src/components/admin/AdminProjectsTab.tsx), and [`ProjectReviewModal.tsx`](../src/components/admin/ProjectReviewModal.tsx) to resolve `100,000x` Crore rendering distortion between INR-stored database rows (`480000000`) and legacy Lakh-entered form values (`4800`).
- **Authentication, Recovery & CSRF Client Transport:**
  - Wired [`src/app/login/page.tsx`](../src/app/login/page.tsx) Forgot/Reset Password (`?resetToken=`) cleanly inside `<Suspense>` to `apiClient.auth.forgotPassword` / `resetPassword` (replaced `setTimeout` stub; avoided synchronous `setState` inside `useEffect`).
  - Updated [`src/lib/api/client.ts`](../src/lib/api/client.ts) for in-memory `X-CSRF-Token` capture on `login`/`register`/`me`, header injection on mutations, lazy one-time `/api/auth/csrf` retry on CSRF `403`, and token wipe on `logout` / re-auth password change.
  - Updated [`src/app/dashboard/page.tsx`](../src/app/dashboard/page.tsx) to honor `?tab=` deep-link query parameters inside `<Suspense>` so notification links open the exact dashboard section instead of hitting `404` subroutes.
  - Configured HTTP security headers (`nosniff`, `DENY`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) in [`next.config.ts`](../next.config.ts).

---

## 4. Backend Changes

- **Shared Exact Monetary Arithmetic:** Created [`backend/src/common/utils/money.ts`](../backend/src/common/utils/money.ts) (`parseDecimalToPaise`, `paiseToInrNumber`, `summarizeActiveInvestments`) using base-10 integer paise (`BigInt`) and refactored [`PortfolioService`](../backend/src/modules/portfolio/portfolio.service.ts) and [`InvestmentsService`](../backend/src/modules/investments/investments.service.ts) to share exact summary computation without IEEE-754 float drift (`money.spec.ts` added).
- **Decimal-Safe Migration Export:** Updated `sqlNum()` in [`scripts/migrate-sqlite-to-pg.mjs`](../scripts/migrate-sqlite-to-pg.mjs) to preserve exact SQL decimal strings rather than coercing through JS `Number()`.
- **Consistent Query Validation & Status Parity:** Validated enum filters cleanly (`BadRequestException`) in [`InvestmentsService`](../backend/src/modules/investments/investments.service.ts) and [`ProjectFundingService`](../backend/src/modules/project-funding/project-funding.service.ts); aligned `UsersController` `@HttpCode(HttpStatus.OK)` parity with `AccountController`; cleared `HealthService.getReadiness()` timeout handles in `finally` to eliminate open timer handles during Jest teardown.
- **Health Domain & Error/Log Sanitization:** Added [`HealthModule`](../backend/src/modules/health/health.module.ts) (`/api/health`, `/api/health/live`, `/api/health/ready` via `$queryRaw SELECT 1`), suppressed raw 5xx internal error details in staging/prod (`AllExceptionsFilter`), and stripped URL query strings in HTTP logs (`sanitizeUrlForLog`).
- **Circular Dependency Prevention:** Extracted `JWT_ISSUER` / `JWT_AUDIENCE` into [`backend/src/common/constants/auth.constants.ts`](../backend/src/common/constants/auth.constants.ts).

---

## 5. Security Improvements

- **Split-Origin Session Cookies & Explicit CORS:** Enforced `SameSite=none; Secure; HttpOnly` defaults in `staging` and `production` (`validateEnvironment`), unified [`cookie.ts`](../backend/src/common/utils/cookie.ts) flags across login/register/logout/password-change/deletion, enforced `TRUST_PROXY_HOPS`, and blocked `*`, `null`, and plain `http://` origins in deployed modes (`app.setup.ts`).
- **CSRF & Token Revocation:** Registered global [`CsrfGuard`](../backend/src/common/guards/csrf.guard.ts) + `GET /api/auth/csrf`, pinned `HS256` algorithm + issuer/audience, and bound Bearer JWTs (`sid`) to PostgreSQL `Session` records revoked immediately upon `logout`, `resetPassword`, `changePassword`, and `requestDeletion`.
- **Authenticated Erasure Verification Parity:** Enforced mandatory password verification + immediate session revocation on authenticated DPDP deletion requests in both [`UsersService`](../backend/src/modules/users/users.service.ts) and Next.js fallback [`src/app/api/account/delete/route.ts`](../src/app/api/account/delete/route.ts).
- **Document ACL & Binary Integrity:** Restricted private documents to `APPROVED` status, authorized non-`PUBLIC` roles (`INVESTOR`, `STAFF`, `ADMIN`), and owning investors (`ownerId` / `owners/<userId>/`), added `@Roles("ADMIN")` `POST /api/documents/upload` with magic-byte checks, `15 MB` cap, safe multipart boolean transform, dynamic MIME extensions in `Content-Disposition`, `nosniff`/`no-store` headers, and explicit `503` guard on unimplemented S3 storage. Mirrors applied in Next.js [`src/app/api/documents/[id]/download/route.ts`](../src/app/api/documents).
- **Dead Notification Links Fixed:** Replaced broken `/dashboard/{enquiries,grievances,security}/` notification paths with valid `/dashboard/?tab=enquiries`, `/dashboard/?tab=grievances`, and `/dashboard/settings/`.
- **Workspace PII Removal:** Verified `0` personal email or authentic production user ID hits across all tracked and untracked files in working tree and `HEAD`.

---

## 6. Documentation Created or Updated

- **Created / Updated Primary Docs:**
  - [`README.md`](../README.md) (all 18 onboarding, setup, architecture, status, and security sections)
  - [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) (actual system topology & auth/CSRF sequence Mermaid diagrams)
  - [`docs/PROJECT_STATUS.md`](PROJECT_STATUS.md) (truthful 6-tier capability status matrix)
  - [`docs/DEVELOPMENT_GUIDE.md`](DEVELOPMENT_GUIDE.md)
  - [`docs/SECURITY_OVERVIEW.md`](SECURITY_OVERVIEW.md)
  - [`docs/API_OVERVIEW.md`](API_OVERVIEW.md)
  - [`docs/architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md`](architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md)
  - [`docs/GITHUB_RELEASE_READINESS_REPORT.md`](GITHUB_RELEASE_READINESS_REPORT.md) *(this report)*
- **Synchronized Existing Docs:** Scrubbed PII from `DEPLOYMENT_GUIDE.md`, `ENGINEERING_AUDIT.md`, `MIGRATION_STRATEGY.md`, `SCHEMA_DICTIONARY.md`, and `API_REFERENCE.md`; annotated historical `docs/PRODUCTION_READINESS.md` & `docs/architecture/TARGET_ARCHITECTURE.md` to match implemented schema, RBAC, chatbot, and auth mechanisms.

---

## 7. Dependencies Reviewed

- **Root (`package.json`):** `next@16.4.1`, `react@19.3.0`, `react-dom@19.3.0`, `lucide-react@^1.57.0` + Tailwind v4 / ESLint v9 / TypeScript 5 dev tooling. All packages verified in use; no unnecessary changes applied.
- **Backend (`backend/package.json`):**
  - **Upgraded Runtime:** NestJS v11 CJS stack (`@nestjs/*` `^11.2.9`, `@nestjs/config@^4.0.4`, `@nestjs/jwt@^11.0.2`, `@nestjs/swagger@^11.4.8`, `@nestjs/throttler@^6.7.1`, `nest-winston@^2.0.0`, `@prisma/client@^5.22.0`).
  - **Removed Unused Packages via `npm uninstall`:** `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt` (0 references across codebase).
  - **Retained Constraints:** Stayed on NestJS `v11.x` + `@nestjs/cli@^10.3.0` + TypeScript `5.x` because `@nestjs/jwt@12` is ESM-only and `@nestjs/cli@12` requires TypeScript 6.

---

## 8. Test Results

| Check | Command | Observed Result | Caveats |
| :--- | :--- | :---: | :--- |
| Git Hygiene | `git diff --check` | **PASS (`0`)** | 0 trailing whitespace/EOF errors |
| Link Integrity | Markdown link script | **PASS (`0` broken)** | Verified after writing this report |
| Workspace PII Scan | `git grep` + `Select-String` | **PASS (`0` hits)** | Tracks working tree / `HEAD` (see Sec. 13 for pre-Sprint unpushed commits) |
| Frontend Lint | `npx eslint --max-warnings 0 .` | **PASS (`0`)** | Zero warnings, zero errors |
| Frontend Types | `npm run typecheck` | **PASS (`0`)** | Strict TypeScript |
| Frontend Tests | `npm test` | **PASS (`0`)** | **`52` passed, `0` failed, `0` skipped** (`node --test tests/*.test.mjs`) |
| Frontend Build | `npm run build` | **PASS (`0`)** | Next.js `16.4.1` Turbopack (`48` compiled routes) |
| Root Prod Audit | `npm audit --omit=dev` | **PASS (`0`)** | `found 0 vulnerabilities` |
| DB Migration Parity | `node scripts/verify-migration-parity.mjs` | **PASS (`0`)** | `52` rows across `14` SQLite tables; `0` FK orphans |
| Prisma Schema | `npx prisma validate` | **PASS (`0`)** | Validated syntax with placeholder `DATABASE_URL` |
| Backend Lint | `npx eslint --max-warnings 0 "{src,test}/**/*.ts"` | **PASS (`0`)** | Zero warnings, zero errors |
| Backend Types | `npm run typecheck` | **PASS (`0`)** | Strict TypeScript |
| Backend Build | `npm run build` | **PASS (`0`)** | Clean `nest build` |
| Backend Unit | `npm test` | **PASS (`0`)** | **`9` passed / `9` suites; `42` passed, `0` failed** (clean exit, zero timer leaks) |
| Backend E2E | `npm run test:e2e` | **PASS (`0`)** | **`1` passed / `1` suite; `10` passed, `0` failed** (mocked in-memory `PrismaService`, clean exit) |
| Backend Prod Audit | `npm audit --omit=dev` | **PASS (`0`)** | `found 0 vulnerabilities` |

---

## 9. Remaining Vulnerabilities

- **Root DevDependencies (`7 moderate`):** Confined solely to `@typescript-eslint/*` and `minimatch`; not shipped in runtime production bundle.
- **Backend DevDependencies (`28`: `5 high`, `12 moderate`, `11 low`, `0 critical`):** Confined solely to dev tooling rooted in `@nestjs/cli@10.x` / `webpack` / `glob` / `tmp` / `picomatch` / `typescript-eslint`; runtime `--omit=dev` equals **`0` vulnerabilities**.

---

## 10. Incomplete Features

- `@aws-sdk/client-s3` multipart/pre-signed storage uploads (real binaries in `/project-funding/` Step 3).
- Investment subscription, allotment, coupon accrual, Section 193/194A TDS deduction, and redemption write workflows (`InvestmentsModule` / `TransactionsModule` are read-only).
- Frontend dashboard header polling/rendering of `/api/notifications`.
- LLM/vector semantic search in `ChatbotService` and live `/api/calculator/simulate` / `/api/branches` frontend fetches.
- Cloudflare Turnstile bot checks (`TURNSTILE_*` env placeholders only).
- Admin user-role assignment UI.

---

## 11. Known Technical Limitations

- **Live PostgreSQL Untested:** Local environment lacks a running PostgreSQL server / Docker daemon; `prisma migrate deploy` and `data/niventra_postgres_export.sql` await CI `postgres:16` or staging validation.
- **Mocked Persistence in Backend Tests:** Jest unit & E2E suites mock `PrismaService` in memory rather than hitting PostgreSQL directly.
- **Sequential Ref Counters (`count() + 1`):** `ENQ`, `GRV`, and `DEL` ID generators in `AppointmentsService`, `AdminService`, and `UsersService` still rely on `count() + 1` with hardcoded `2026` prefix.
- **External Corporate / Statutory Gates (`DEC-01`–`DEC-07`):** Live investor transactions and public yield calculator promotion remain blocked pending CIN verification, Debenture Trustee Deed (`SH-12`), ROC (`CHG-9`), bank escrow contracts, CFO coupon certification, Form PAS-4 binaries, and DPO/GRO appointments.

---

## 12. Git Branch and Commit Details

- **Repository:** `https://github.com/Ar10Ansari/niventra-capital-advisory`
- **Active Branch:** `refinement/minimal-content-cleanup` (tracking `origin/refinement/minimal-content-cleanup` at `78afc1e`)
- **Base `main` / `origin/main`:** `75811b0`
- **Local Recovery Point:** Lightweight Git tag `pre-cleanup-recovery-20261112` at `9498531` plus working-tree recovery patch in agent scratch storage.
- **Preserved Earlier Unpushed Commits (`4` commits):**
  - `2ded383` — docs(architecture), specs, governance, CI workflow *(contains historical PII strings)*
  - `7ab94a1` — refactor(frontend)
  - `b76e2ac` — feat(backend)
  - `9498531` — feat(migration) *(contains historical PII strings)*
- **New Sprint 1 & Cleanup Commits Added cleanly on `refinement/minimal-content-cleanup`:**
  - `e09ed18` — `chore(deps,hygiene): remove unused passport packages and tighten git hygiene`
  - `2124565` — `fix(security): harden split-origin cookies, CSRF, JWT revocation, document ACLs, and health probes`
  - `0fbfe18` — `refactor(portal,backend): unify paise math, validate query enums, fix notifications, and decompose project-funding`
  - `46c90df` — `docs: scrub committed PII and add architecture, status, security, API, and release docs` *(followed by this report SHA update)*

---

## 13. Remote Push Status & 14. Pull Request URL

- **Push Status:** **Held locally by explicit maintainer decision** (not blocked by network or Git authentication). Local unpushed commits `2ded383` and `9498531` contain `15` raw personal email/user ID matches in their diffs even though `HEAD` is clean (`0` hits). Following the decision to avoid rewriting history automatically and avoid exposing PII on GitHub, changes remain cleanly committed on `refinement/minimal-content-cleanup` locally and `origin/refinement/minimal-content-cleanup` stays unchanged at `78afc1e`.
- **Safe Manual Pre-Push Resolution Commands:**
  ```bash
  # Option A (Recommended — non-destructive clean release branch from origin/refinement/minimal-content-cleanup):
  git checkout -b feat/clean-platform-release origin/refinement/minimal-content-cleanup
  git merge --squash refinement/minimal-content-cleanup
  git commit -m "feat(platform): security remediation, NestJS/PostgreSQL backend readiness, and docs suite"
  git push -u origin feat/clean-platform-release

  # Option B (Only if explicitly choosing to rewrite local unpushed commits 2ded383..HEAD with interactive rebase / git-filter-repo):
  # Scrub PII strings from commits 2ded383 and 9498531 locally, confirm zero hits across `git log origin/refinement/minimal-content-cleanup..HEAD -S "<pattern>"`, then:
  git push origin refinement/minimal-content-cleanup
  ```
- **GitHub Branch URL:** `https://github.com/Ar10Ansari/niventra-capital-advisory/tree/refinement/minimal-content-cleanup` *(currently shows remote baseline `78afc1e` until pushed)*
- **Pull Request URL:** Not created yet (`https://github.com/Ar10Ansari/niventra-capital-advisory/compare/main...feat/clean-platform-release` after Option A push).

---

## 15. Skills Discovered and Applied

Discovered `13` built-in Antigravity skills (`C:\Users\Lenovo\.gemini\antigravity\builtin\skills`) and `1,079` installed skills (`C:\Users\Lenovo\.agents\skills`); workspace-local `.agent`/`.agents`/`.gemini` directories are absent.

| Skill Applied | Scope Supported |
| :--- | :--- |
| `clean-code-guard`, `code-review-and-quality`, `repo-native-refactor`, `review-and-simplify-changes` | Unused `passport` removal, `money.ts` fixed-point paise deduplication, `project-funding` decomposition, `adminFormatters.ts` reuse, enum query guards, timer leak fix, EOF/LF whitespace hygiene. |
| `security-and-hardening`, `api-security`, `data-privacy-controls` *(and Sprint 1: `hunt-cors`, `hunt-csrf`, `hunt-file-upload`, `hunt-jwt-crypto`, `hunt-nodejs`, `privacy-mask`)* | Split-origin cookie/CSRF verification, JWT pinning & `sid` revocation, Next.js `account/delete` password parity, document ACL/magic-byte validation, PII scan verification across commits & tree. |
| `frontend-architecture`, `hunt-nextjs` | Next.js `?tab=` Suspense dashboard routing, component decomposition, `next.config.ts` security headers, dead `src/scripts/seed.ts` removal. |
| `documentation-and-adrs`, `pre-release-review` | `README.md`, `ARCHITECTURE.md` Mermaid diagrams, `PROJECT_STATUS.md`, `DEVELOPMENT_GUIDE.md`, `SECURITY_OVERVIEW.md`, `API_OVERVIEW.md`, and this release readiness report. |
| `git-commit-message`, `git-workflow`, `git-workflow-and-versioning`, `github-presence` | Safe recovery tag/patch creation, scoped conventional commits, no destructive resets/force-pushes, pre-push PII gate. |
| `jest-skill` | Added `money.spec.ts` and `InvestmentsService` invalid-status test; fixed leaked timer in `HealthService`; verified full unit + E2E runs. |
| **Unavailable / Missing Skills** | No dedicated `nestjs` or `prisma` skills exist in the `1,079`-skill catalog; compensated via direct source/schema inspection, Prisma validation, TypeScript compiler checks, ESLint `--max-warnings 0`, and Jest/Supertest suites. |

---

## 16. Recommended Next Engineering Priorities

1. **Resolve Pre-Push History PII Cleanly:** Create a clean PR branch or squash unpushed PII commits `2ded383`/`9498531` before pushing to remote GitHub, then open PR into `main`.
2. **Provision Live PostgreSQL CI Container & Staging Dry-Run:** Add `postgres:16` service container to `.github/workflows/ci.yml` to run `npx prisma migrate deploy`, import `data/niventra_postgres_export.sql`, and execute real-DB NestJS tests plus Playwright cross-origin HTTPS cookie/CSRF smoke tests.
3. **Implement `@aws-sdk/client-s3` Object Storage:** Wire private encrypted bucket uploads/presigned downloads in `StorageAdapter` and `/project-funding/`.
4. **PostgreSQL Constraints & Financial Write Workflows:** Add FK indexes, `CHECK` constraints, `UNIQUE(payment_reference)`, collision-safe ID sequences, and transactional allotment/accrual/TDS/redemption endpoints.
5. **Corporate Governance Sign-Off (`DEC-01`–`DEC-07`):** Obtain legal, trustee, escrow, DPO/GRO, and CFO approvals prior to any live production cutover.
