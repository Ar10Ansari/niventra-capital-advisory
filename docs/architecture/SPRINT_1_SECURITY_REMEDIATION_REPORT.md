# Niventra Capital Advisory — Sprint 1 Security Remediation & Repository Stabilization Report

**Sprint Date:** November 11, 2026  
**Workspace:** `D:\Projects\niventra website`  
**Repository:** `https://github.com/Ar10Ansari/niventra-capital-advisory`  
**Branch:** `refinement/minimal-content-cleanup` (base `HEAD`: `9498531`)  
**Scope:** Controlled Sprint 1 security remediation and repository stabilization based on [PRE_CUTOVER_VERIFICATION_REPORT.md](file:///D:/Projects/niventra%20website/docs/architecture/PRE_CUTOVER_VERIFICATION_REPORT.md). Zero changes were made to production Vercel hosting, production SQLite database data (`data/niventra.db`), DNS, or `AGENTS.md`. No commits or pushes were executed.

---

## 1. Baseline Git State

- **Branch & Commit Ancestry:** `refinement/minimal-content-cleanup` at commit `9498531`, ahead by **`4` local unpushed commits** (`2ded383`, `7ab94a1`, `b76e2ac`, `9498531`) relative to `origin/refinement/minimal-content-cleanup` (`78afc1e`), and ahead by **`5` commits** relative to `main` / `origin/main` (`75811b0`).
- **Baseline Dirty Tree Preserved:** Before Sprint 1 edits, `56` tracked files had uncommitted trailing blank-line / CRLF-LF diffs caused by Windows `core.autocrlf = true` with no `.gitattributes` file. None of these edits were discarded (`git reset --hard` and `git clean -fd` were avoided); `10` of those `56` files were subsequently updated cleanly with Sprint 1 fixes, leaving `46` whitespace-only baseline files alongside `40` functionally modified files (`86` total in `git diff --name-only`).
- **Protected Baseline & Backups:**
  - [`AGENTS.md`](file:///D:/Projects/niventra%20website/AGENTS.md) remains unmodified (`git diff AGENTS.md` is empty).
  - Pre-audit physical SQLite backup verified intact: `data/backups/niventra.db.pre-audit-backup-20261111` (`151,552` bytes).
  - Historical PII Exposure Flagged (Not Rewritten): Commits `2ded383` and `9498531` contain raw personal email addresses in local Git history (see Section 7 for the safe manual history-remediation plan prior to push).

---

## 2. Skills Discovered and Actually Used

Scanned built-in Antigravity skills (`C:\Users\Lenovo\.gemini\antigravity\builtin\skills`, `13` entries) and user-installed skills (`C:\Users\Lenovo\.agents\skills`, `1,079` entries):

| Skill / Status | Usage & Contribution in Sprint 1 |
| :--- | :--- |
| `security-and-hardening` | Guided fail-closed staging/prod env validation, HTTP security headers in `next.config.ts` & Helmet, Swagger gating, and proxy IP trust. |
| `api-security` & `hunt-cors` & `hunt-csrf` | Guided split-origin credentialed CORS origin validation, HMAC-SHA256 `X-CSRF-Token` guard, header/bootstrap design, and DTO enum/boolean validation. |
| `hunt-jwt-crypto` | Enforced explicit `HS256` algorithm, issuer/audience pinning, `sid`-bound JWT revocation across logout/reset/password-change/deletion, and `timingSafeEqual` buffer length guard. |
| `hunt-file-upload` | Guided binary upload extension parity, `15 MB` upload limits, magic-byte signature validation, sanitized download filenames, and `nosniff` / `no-store` download headers. |
| `hunt-nodejs` | Guided query-string log sanitization, staging/prod 5xx error message suppression, and `HEALTH` timeout handling. |
| `data-privacy-controls` & `privacy-mask` | Guided PII scrubbing across tracked docs and migration scripts, plus masked parity logging and deletion password verification. |
| `dependency-scanning` & `supply-chain-security` | Executed `npm audit` and constrained NestJS package upgrades to resolve all `12` backend production vulnerabilities without breaking CJS/TS/Prisma compatibility. |
| `jest-skill` | Guided isolated unit specs (`env.validation.spec.ts`, `health.service.spec.ts`, expanded auth & document specs) and E2E integration tests. |
| `git-workflow-and-versioning` & `clean-code-guard` | Preserved existing baseline edits, avoided destructive git commands, hardened `.gitignore` and `.gitattributes`, and kept helpers modular (e.g., `app.setup.ts`, `cookie.ts`, `csrf.ts`, `auth.constants.ts`). |
| **Unavailable / Missing Skills** | • Zero dedicated `nestjs` or `prisma` skills exist in the `1,079`-skill catalog.<br>• `hunt-auth-bypass` `SKILL.md` failed UTF-8 decoding.<br>**Compensation:** Manually verified NestJS DI initialization, controller guards/decorators, Swagger, Prisma schema validation, and auth bypass edge cases via `security-and-hardening`, `api-security`, and live NestJS E2E Supertest coverage. |

---

## 3. Files Modified & Added

### Added Files (`12` New Sprint 1 Files + Pre-existing Untracked Audit Report)

- [`.gitattributes`](file:///D:/Projects/niventra%20website/.gitattributes) — Enforces `* text=auto eol=lf` and marks SQLite/binary assets binary.
- [`backend/src/app.setup.ts`](file:///D:/Projects/niventra%20website/backend/src/app.setup.ts) — Shared NestJS bootstrap configuration (`trust proxy`, Helmet CSP/HSTS, strict CORS callback, global pipes & filters, environment-gated Swagger) used identically by `main.ts` and E2E tests.
- [`backend/src/common/constants/auth.constants.ts`](file:///D:/Projects/niventra%20website/backend/src/common/constants/auth.constants.ts) — Zero-dependency `JWT_ISSUER` and `JWT_AUDIENCE` constants (prevents circular module initialization between `AuthModule`, `AuthController`, and `SessionOrJwtAuthGuard`).
- [`backend/src/common/guards/csrf.guard.ts`](file:///D:/Projects/niventra%20website/backend/src/common/guards/csrf.guard.ts) — Global `APP_GUARD` enforcing origin verification + HMAC-SHA256 `X-CSRF-Token` validation on cookie-authenticated mutations.
- [`backend/src/common/utils/cookie.ts`](file:///D:/Projects/niventra%20website/backend/src/common/utils/cookie.ts) — Shared `getSessionCookieOptions` and `clearSessionCookie` helpers guaranteeing matching `httpOnly`, `secure`, `sameSite`, `path`, and `domain` flags on set and clear.
- [`backend/src/common/utils/csrf.ts`](file:///D:/Projects/niventra%20website/backend/src/common/utils/csrf.ts) — `computeCsrfToken`, `deriveCsrfSigningKey`, and length-checked `timingSafeEqual` verification helpers.
- [`backend/src/config/env.validation.spec.ts`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.spec.ts) — Unit specs covering `staging` / `production` strict env rules, CORS validation, `SameSite=none` TLS guard, and Swagger defaults.
- [`backend/src/modules/health/health.module.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/health/health.module.ts), [`health.controller.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/health/health.controller.ts), [`health.service.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/health/health.service.ts), [`health.service.spec.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/health/health.service.spec.ts) — Liveness & PostgreSQL readiness health domain.
- [`docs/architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md`](file:///D:/Projects/niventra%20website/docs/architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md) — This report (plus pre-existing untracked [`PRE_CUTOVER_VERIFICATION_REPORT.md`](file:///D:/Projects/niventra%20website/docs/architecture/PRE_CUTOVER_VERIFICATION_REPORT.md)).

### Modified Files (`40` Functionally Modified Tracked Files)

- **Root Config & Headers:** [`.env.example`](file:///D:/Projects/niventra%20website/.env.example), [`.gitignore`](file:///D:/Projects/niventra%20website/.gitignore), [`next.config.ts`](file:///D:/Projects/niventra%20website/next.config.ts)
- **Backend Core & Config:** [`backend/package.json`](file:///D:/Projects/niventra%20website/backend/package.json), [`backend/package-lock.json`](file:///D:/Projects/niventra%20website/backend/package-lock.json), [`backend/src/app.module.ts`](file:///D:/Projects/niventra%20website/backend/src/app.module.ts), [`backend/src/main.ts`](file:///D:/Projects/niventra%20website/backend/src/main.ts), [`backend/src/config/env.validation.ts`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts), [`backend/src/common/filters/http-exception.filter.ts`](file:///D:/Projects/niventra%20website/backend/src/common/filters/http-exception.filter.ts), [`backend/src/common/guards/auth.guard.ts`](file:///D:/Projects/niventra%20website/backend/src/common/guards/auth.guard.ts), [`backend/src/common/interceptors/http-logging.interceptor.ts`](file:///D:/Projects/niventra%20website/backend/src/common/interceptors/http-logging.interceptor.ts), [`backend/src/common/utils/masking.ts`](file:///D:/Projects/niventra%20website/backend/src/common/utils/masking.ts)
- **Backend Auth, Users & Documents:** [`backend/src/modules/auth/auth.controller.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.controller.ts), [`auth.module.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.module.ts), [`auth.service.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.service.ts), [`auth.service.spec.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.service.spec.ts), [`documents.controller.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.controller.ts), [`documents.service.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.service.ts), [`documents.service.spec.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.service.spec.ts), [`dto/document.dto.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/dto/document.dto.ts), [`storage/storage.adapter.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/storage/storage.adapter.ts), [`account.controller.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/users/account.controller.ts), [`users.controller.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.controller.ts), [`users.service.ts`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.service.ts), [`backend/test/app.e2e-spec.ts`](file:///D:/Projects/niventra%20website/backend/test/app.e2e-spec.ts)
- **Docs & Migration Scripts (PII & Hygiene):** [`docs/DEPLOYMENT_GUIDE.md`](file:///D:/Projects/niventra%20website/docs/DEPLOYMENT_GUIDE.md), [`docs/api/API_REFERENCE.md`](file:///D:/Projects/niventra%20website/docs/api/API_REFERENCE.md), [`docs/architecture/ENGINEERING_AUDIT.md`](file:///D:/Projects/niventra%20website/docs/architecture/ENGINEERING_AUDIT.md), [`docs/database/MIGRATION_STRATEGY.md`](file:///D:/Projects/niventra%20website/docs/database/MIGRATION_STRATEGY.md), [`docs/database/SCHEMA_DICTIONARY.md`](file:///D:/Projects/niventra%20website/docs/database/SCHEMA_DICTIONARY.md), [`scripts/migrate-sqlite-to-pg.mjs`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs), [`scripts/verify-migration-parity.mjs`](file:///D:/Projects/niventra%20website/scripts/verify-migration-parity.mjs)
- **Next.js Frontend & Fallback Route:** [`src/app/api/documents/[id]/download/route.ts`](file:///D:/Projects/niventra%20website/src/app/api/documents/%5Bid%5D/download/route.ts), [`src/app/dashboard/settings/page.tsx`](file:///D:/Projects/niventra%20website/src/app/dashboard/settings/page.tsx), [`src/app/login/page.tsx`](file:///D:/Projects/niventra%20website/src/app/login/page.tsx), [`src/components/forms/AccountDeletionForm.tsx`](file:///D:/Projects/niventra%20website/src/components/forms/AccountDeletionForm.tsx), [`src/lib/api/client.ts`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts), [`src/lib/auth/password.ts`](file:///D:/Projects/niventra%20website/src/lib/auth/password.ts), [`tests/design-foundation.test.mjs`](file:///D:/Projects/niventra%20website/tests/design-foundation.test.mjs), [`tests/frontend-api-client.test.mjs`](file:///D:/Projects/niventra%20website/tests/frontend-api-client.test.mjs)

*(Plus `46` untouched tracked files that retain only pre-existing EOF trailing blank-line / CRLF diffs from baseline.)*

---

## 4. Authentication & Cross-Origin Security Fixes

1. **Split-Origin Session Cookie Configuration & Clear-Cookie Parity:**
   - [`validateEnvironment`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts#L116-L137) defaults `COOKIE_SAMESITE="none"` and `COOKIE_SECURE=true` in both `staging` and `production` (`"lax"` / `false` in `development`/`test`) and fatally rejects `COOKIE_SAMESITE=none` when `COOKIE_SECURE=false`.
   - [`getSessionCookieOptions`](file:///D:/Projects/niventra%20website/backend/src/common/utils/cookie.ts#L6-L18) and [`clearSessionCookie`](file:///D:/Projects/niventra%20website/backend/src/common/utils/cookie.ts#L20-L22) share identical `httpOnly: true`, `secure`, `sameSite`, `path: "/"`, and optional `domain` flags across login, registration, logout, password change, and account deletion so browsers reliably expire split-origin cookies.
2. **Explicit CORS Origin Restrictions:**
   - [`env.validation.ts`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts#L102-L114) rejects `*`, `null`, and plain `http://` origins in `staging`/`production`.
   - [`configureNestApplication`](file:///D:/Projects/niventra%20website/backend/src/app.setup.ts#L49-L70) enforces `allowedOriginSet`, sets `credentials: true`, permits `X-CSRF-Token`, and exposes `X-CSRF-Token` + `Content-Disposition` headers.
3. **CSRF Protection (`CsrfGuard` + Client Bootstrap):**
   - [`CsrfGuard`](file:///D:/Projects/niventra%20website/backend/src/common/guards/csrf.guard.ts#L26-L97) (registered as `APP_GUARD` in `AppModule`) enforces `Origin`/`Referer` allowlist checks plus session-bound HMAC-SHA256 `X-CSRF-Token` validation for state-changing requests authenticated via `niventra_session` cookie (allowing public bootstrap paths `/api/auth/{login,register,forgot-password,reset-password}` and stateless `Bearer`-only requests without cookies).
   - [`AuthController`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.controller.ts) exposes `GET /api/auth/csrf` and returns `csrfToken` in JSON + `X-CSRF-Token` response headers on `register`, `login`, and `me`.
   - [`src/lib/api/client.ts`](file:///D:/Projects/niventra%20website/src/lib/api/client.ts) stores the CSRF token strictly in memory (never `localStorage`), clears it on `logout` and password changes requiring re-auth, and performs a single lazy `GET /api/auth/csrf` bootstrap + retry if an existing cookie session encounters a missing/stale CSRF token (`403`).
4. **Trust Proxy & Environment Hardening:**
   - [`configureNestApplication`](file:///D:/Projects/niventra%20website/backend/src/app.setup.ts#L17-L20) calls `expressInstance.set("trust proxy", trustProxyHops)` (default `1` in `staging`/`production`, configurable `0..5` via `TRUST_PROXY_HOPS`).
   - [`env.validation.ts`](file:///D:/Projects/niventra%20website/backend/src/config/env.validation.ts#L64-L95) enforces `JWT_SECRET` (min 32 non-placeholder chars), optional `CSRF_SECRET` (min 32 non-placeholder chars if supplied), and `DATABASE_URL` in both `staging` and `production`. `SWAGGER_ENABLED` defaults `false` in `production`.
5. **JWT Algorithm Pinning & `sid`-Bound Revocation:**
   - [`auth.constants.ts`](file:///D:/Projects/niventra%20website/backend/src/common/constants/auth.constants.ts), [`AuthModule`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.module.ts), [`AuthService`](file:///D:/Projects/niventra%20website/backend/src/modules/auth/auth.service.ts), and [`SessionOrJwtAuthGuard`](file:///D:/Projects/niventra%20website/backend/src/common/guards/auth.guard.ts) pin `HS256`, `issuer: "niventra-api"`, and `audience: "niventra-portal"`, bind Bearer JWTs via a mandatory `sid` claim to active DB `Session` rows, and revoke BOTH cookies and Bearer tokens immediately on `logout`, `resetPassword`, [`UsersService.changePassword`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.service.ts), and [`UsersService.requestDeletion`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.service.ts).
6. **Password Reset UI & Frontend Security Hardening:**
   - [`src/app/login/page.tsx`](file:///D:/Projects/niventra%20website/src/app/login/page.tsx) wires real `apiClient.auth.forgotPassword` and `?resetToken=` `apiClient.auth.resetPassword` flows inside `<Suspense>`, replacing the simulated `setTimeout` stub.
   - [`UsersService.requestDeletion`](file:///D:/Projects/niventra%20website/backend/src/modules/users/users.service.ts) and [`AccountDeletionForm.tsx`](file:///D:/Projects/niventra%20website/src/components/forms/AccountDeletionForm.tsx) strictly require password verification when submitted by an authenticated portal user.
   - [`next.config.ts`](file:///D:/Projects/niventra%20website/next.config.ts#L13-L25) sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security`.
   - [`src/lib/auth/password.ts`](file:///D:/Projects/niventra%20website/src/lib/auth/password.ts) guards buffer lengths before `timingSafeEqual`.

### Staging HTTPS Deployment Requirements (Verified Contract)

To deploy split-origin Next.js (`https://<staging-frontend>`) ↔ NestJS (`https://<staging-api>`) cleanly with cookies enabled:
- Both origins must serve over **HTTPS** (browsers reject `SameSite=None` cookies on `http://`).
- Set `NODE_ENV=staging` on the NestJS host with explicit high-entropy `JWT_SECRET` (>= 32 chars, ideally 64 chars) and `CSRF_SECRET` (>= 32 chars), TLS `DATABASE_URL` (`?sslmode=require`), `NEXT_PUBLIC_APP_URL=https://<staging-frontend>`, and `CORS_ORIGINS=https://<staging-frontend>`.
- Set `TRUST_PROXY_HOPS=1` (or exact proxy hop count on Railway/Render/ALB) so NestJS `@Throttle` reads real client IP instead of proxy IP.
- Keep `COOKIE_SAMESITE=none` and `COOKIE_SECURE=true` (automatic defaults for `staging`/`production`), or set `COOKIE_DOMAIN=.niventracapitaladvisory.com` + `COOKIE_SAMESITE=lax` if both apps run under subdomains of the same root domain.
- Set `NEXT_PUBLIC_API_BASE_URL=https://<staging-api>` ONLY in Vercel Preview/Staging environment variables (keep unset in existing SQLite production until production cutover approval).

---

## 5. Document Access Control & Upload Security Fixes

- **Approval Gating & Role Enforcement:** [`DocumentsService.assertCanAccessDocument`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.service.ts#L96-L168) enforces `doc.status === "APPROVED"` for non-`STAFF`/`ADMIN` callers on list, metadata, and download routes, and restricts non-public documents to `ADMIN`, `STAFF`, and `INVESTOR` roles (blocking `PUBLIC`-role users cleanly with audited `403`).
- **Owner Isolation:** Private documents associated with a specific investor (`ownerId` metadata or `owners/<userId>/` path prefix) deny access (`403`) to unrelated investors while allowing owner, `STAFF`, and `ADMIN` access.
- **File Validation, Upload & Download Headers:**
  - [`CreateDocumentDto`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/dto/document.dto.ts) limits uploads to `15 MB`, restricts MIME types (`pdf`, `docx`, `xlsx`, `txt`, `png`, `jpeg`), rejects path traversal, and safely parses `"true"`/`"false"` multipart form strings via `@Transform` (avoiding `Boolean("false") === true`).
  - [`DocumentsController`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/documents.controller.ts#L45-L96) adds `@Roles("ADMIN")` `POST /api/documents/upload`, validates binary magic bytes matching the declared MIME/extension, generates dynamic sanitized filenames with canonical MIME extensions in `Content-Disposition` (fixing the hardcoded `.pdf` bug), and sets `X-Content-Type-Options: nosniff` + `Cache-Control: private, no-store` on private downloads.
  - Next.js fallback route [`src/app/api/documents/[id]/download/route.ts`](file:///D:/Projects/niventra%20website/src/app/api/documents/%5Bid%5D/download/route.ts) mirrors the same status, role, and owner isolation controls while dual-stack runs.
- **Honest Local Storage Boundary:** [`StorageAdapter`](file:///D:/Projects/niventra%20website/backend/src/modules/documents/storage/storage.adapter.ts) explicitly reports `driver: "LOCAL_FS"`, `remoteDriverImplemented: false`, and throws `503 ServiceUnavailableException` if local binary writes are invoked while `S3_*` config flags imply remote object storage (preventing silent ephemeral-disk data loss assumptions).

---

## 6. Dependency Audit Before and After

| Scope | Pre-Sprint Audit | Post-Sprint Audit | Outcome |
| :--- | :--- | :--- | :--- |
| **Backend (`--omit=dev`, prod runtime)** | **`12` vulnerabilities (`7 high`, `5 moderate`)** | **`0` vulnerabilities (`found 0 vulnerabilities`)** | **Resolved (`100%` clean prod runtime)** |
| **Backend (all deps incl. dev)** | `40` (`11 high`, `18 moderate`, `11 low`) | `28` (`5 high`, `12 moderate`, `11 low` — **all dev-only**) | `-12` vulns |
| **Root Next.js (`--omit=dev`)** | `0` vulnerabilities | `0` vulnerabilities | Clean |
| **Root Next.js (all deps incl. dev)** | `7 moderate` (dev-only ESLint/TS chain) | `7 moderate` (dev-only) | Unchanged (dev-only) |

- **Upgraded Backend Dependencies ([`backend/package.json`](file:///D:/Projects/niventra%20website/backend/package.json)):**
  `@nestjs/common@^11.2.9`, `@nestjs/config@^4.0.4`, `@nestjs/core@^11.2.9`, `@nestjs/jwt@^11.0.2`, `@nestjs/passport@^12.0.1`, `@nestjs/platform-express@^11.2.9`, `@nestjs/swagger@^11.4.8`, `@nestjs/throttler@^6.7.1`, `@prisma/client@^5.22.0`, `nest-winston@^2.0.0`, `@nestjs/testing@^11.2.9`, `prisma@^5.22.0`.
- **Compatibility Decision:** Retained `@nestjs/cli@^10.3.0` (dev-only CLI) and stayed on NestJS `v11.x` + `@nestjs/jwt@11.x` instead of `v12` because `@nestjs/cli@12` requires TypeScript `~6.0.2` and `@nestjs/jwt@12` is ESM-only, which breaks the CommonJS Jest/Prisma `5.22.0` test toolchain.

---

## 7. PII Remediation & Repository Hygiene

- **Scrubbed Files:** Removed hardcoded personal email addresses, personal names, and authentic SQLite production user ID strings from [`docs/DEPLOYMENT_GUIDE.md`](file:///D:/Projects/niventra%20website/docs/DEPLOYMENT_GUIDE.md), [`docs/api/API_REFERENCE.md`](file:///D:/Projects/niventra%20website/docs/api/API_REFERENCE.md), [`docs/architecture/ENGINEERING_AUDIT.md`](file:///D:/Projects/niventra%20website/docs/architecture/ENGINEERING_AUDIT.md), [`docs/database/MIGRATION_STRATEGY.md`](file:///D:/Projects/niventra%20website/docs/database/MIGRATION_STRATEGY.md), [`docs/database/SCHEMA_DICTIONARY.md`](file:///D:/Projects/niventra%20website/docs/database/SCHEMA_DICTIONARY.md), [`scripts/migrate-sqlite-to-pg.mjs`](file:///D:/Projects/niventra%20website/scripts/migrate-sqlite-to-pg.mjs), and [`scripts/verify-migration-parity.mjs`](file:///D:/Projects/niventra%20website/scripts/verify-migration-parity.mjs).
- **Masked Telemetry & Full FK Parity:** `migrate-sqlite-to-pg.mjs` and `verify-migration-parity.mjs` now discover non-fixture user integrity dynamically, emit masked emails (`maskEmail()`) to stdout, and verify all secondary/nullable foreign-key chains across `14` tables (`0` orphans).
- **Hygiene & Pattern Guard:** [`.gitignore`](file:///D:/Projects/niventra%20website/.gitignore) now ignores `*.db`, `*.sqlite*`, `*.key`, `*.p12`, and `*.pfx` wildcards; `.gitattributes` enforces LF text normalization. Verified `0` matching PII hits across all tracked and untracked files (excluding local gitignored `data/`, `migration/`, `artifacts/`).
- **Manual History Remediation Plan Required Before Remote Push:** Because local unpushed commits `2ded383` and `9498531` still hold raw PII strings in Git history on `refinement/minimal-content-cleanup` (which has NOT been pushed to GitHub), engineering leadership should choose one safe option **before pushing**:
  1. *(Recommended)* Create a clean squash/re-based PR commit on top of `origin/refinement/minimal-content-cleanup` (`78afc1e`) containing only the scrubbed Sprint 1 state (avoiding `git push --force`), **or**
  2. Use `git filter-repo` / interactive rebase strictly on local unpushed commits `2ded383..HEAD` with a verified backup tag prior to review and push.

---

## 8. Health Endpoints & Log/Error Sanitization

- **Liveness & Readiness Endpoints (`HealthModule`):**
  - `GET /api/health` and `GET /api/health/live` return `{ status: "ok", service: "niventra-api", timestamp }` (`200 OK`, `@SkipThrottle()`, `@Public()`).
  - `GET /api/health/ready` runs `this.prisma.$queryRaw\`SELECT 1\`` with a `2,000 ms` timeout, returning `200 OK` `{ status: "ready", database: "connected" }` or `503 Service Unavailable` `{ status: "not_ready", database: "disconnected" }` with `Cache-Control: no-store` and zero leaked connection strings or driver exceptions.
- **Sanitized Errors & Request Logs:** [`sanitizeUrlForLog`](file:///D:/Projects/niventra%20website/backend/src/common/utils/masking.ts), [`HttpLoggingInterceptor`](file:///D:/Projects/niventra%20website/backend/src/common/interceptors/http-logging.interceptor.ts), and [`AllExceptionsFilter`](file:///D:/Projects/niventra%20website/backend/src/common/filters/http-exception.filter.ts) strip query parameters (`?token=...`) from logs/error paths and suppress raw 5xx internal error messages in `staging` and `production`.

---

## 9. Tests Executed and Verified Results

*(All checks below passed with exit code `0` after all source code fixes; backend E2E & unit tests run against in-memory mocked `PrismaService` because live PostgreSQL is absent locally.)*

| Command | Result | Scope & Exact Counts |
| :--- | :---: | :--- |
| Root `npm run lint` | **PASS (`0`)** | ESLint clean across Next.js frontend. |
| Root `npm run typecheck` | **PASS (`0`)** | `tsc --noEmit` (`strict: true`) clean. |
| Root `npm test` | **PASS (`0`)** | **`52` passed, `0` failed, `0` skipped** (`node --test` across `tests/*.test.mjs`; includes CSRF capture/header/logout retry & password reset API client specs). |
| Root `npm run build` | **PASS (`0`)** | Next.js `16.4.1` Turbopack (`48` routes compiled cleanly). |
| `node scripts/verify-migration-parity.mjs` | **PASS (`0`)** | `52` rows verified across `14` SQLite tables = manifest = `.sql` export; `0` FK orphans; masked console output. |
| Backend `npx prisma validate` | **PASS (`0`)** | Schema valid (with placeholder `DATABASE_URL` exported for config validation). |
| Backend `npm run lint` | **PASS (`0`)** | ESLint clean across `backend/{src,test}`. |
| Backend `npm run typecheck` | **PASS (`0`)** | `tsc --noEmit` clean. |
| Backend `npm run build` | **PASS (`0`)** | `nest build` clean (`backend/dist/`). |
| Backend `npm test` | **PASS (`0`)** | **`8` passed / `8` suites; `39` passed, `0` failed, `0` skipped** (`env.validation.spec.ts`, `health.service.spec.ts`, expanded `auth.service.spec.ts` & `documents.service.spec.ts`, `calculator`, `chatbot`, `investments`, `investor-accounts`). |
| Backend `npm run test:e2e` | **PASS (`0`)** | **`1` passed / `1` suite; `10` passed, `0` failed, `0` skipped** (CORS/Helmet, `/api/health*`, cookies/`/auth/csrf`/Bearer JWT, CSRF 403 block, `resetPassword`/`changePassword` immediate session & JWT revocation, document `PENDING`/`PUBLIC`/owner/magic-byte/`.txt` headers, DPDP deletion password gate, `logout` revocation, `429` throttling). Note: Jest logged an open-handle notice on exit due to internal module timers (`ThrottlerModule`/`HealthService`), while passing all 10 cases cleanly. |
| Backend `npm audit --omit=dev` | **PASS (`0`)** | **`found 0 vulnerabilities`**. |
| Root `npm audit --omit=dev` | **PASS (`0`)** | **`found 0 vulnerabilities`**. |

---

## 10. Remaining Vulnerabilities

- **Backend Dev-Only (`28` vulnerabilities: `5 high`, `12 moderate`, `11 low`, `0 critical`):** Confined strictly to devDependencies rooted in `@nestjs/cli@10.x` / `@nestjs/schematics@10.x` / `@angular-devkit/*`, `webpack`, `tmp`, `glob`, `picomatch`, `inquirer`, and `typescript-eslint`. None are shipped in production runtime dependencies (`npm audit --omit=dev` = `0`).
- **Root Dev-Only (`7 moderate` vulnerabilities):** Confined strictly to `@typescript-eslint/*` and `minimatch` devDependencies; production Next.js bundle (`--omit=dev`) = `0`.

---

## 11. Remaining Blockers Before Staging / Production Cutover

1. **Untested Live PostgreSQL Migration & Import:** Neither `npx prisma migrate deploy` nor `psql -f data/niventra_postgres_export.sql` has executed against an actual PostgreSQL server (no local `psql`/running Postgres daemon or container service used yet).
2. **Object Storage SDK Unimplemented (`S3`/`R2`):** `StorageAdapter` explicitly rejects S3-configured local binary writes (`503`); `@aws-sdk/client-s3` multipart/pre-signed storage must be built before storing live investor binaries in stateless staging/prod containers.
3. **Staging Credentials, DNS & Email Delivery:** Managed staging `DATABASE_URL`, production/staging `JWT_SECRET`/`CSRF_SECRET`, live `RESEND_API_KEY` + verified domain DNS, and staging API host URL are unprovisioned.
4. **PostgreSQL Data Integrity & Ledger Completeness:** Existing schema/migration gaps identified in the Pre-Cutover Audit (`DEC` float handling in `PortfolioService` & `sqlNum`, missing secondary FK indexes, missing `CHECK` constraints and `UNIQUE(payment_reference)`, `count()+1` ref sequences, read-only investments/transactions endpoints, non-PAN KYC regexes) remain open for Sprint 2.
5. **External Statutory & Business Sign-Offs (`DEC-01` – `DEC-07`):** Board resolutions/CIN verification, executed Debenture Trustee Deed (`Form SH-12`) & ROC charge (`CHG-9`), escrow waterfall banking, CFO coupon/TDS certification (`/calculator`), authentic Form PAS-4/Term Sheet PDFs, DPO/GRO appointments, and legacy CRM decommissioning remain legal prerequisites before live investor onboarding.

---

## 12. Recommended Sprint 2 Tasks

1. **P0 — Live PostgreSQL CI Container & Migration Verification:** Add a `postgres:16` service container to `.github/workflows/ci.yml` executing `npx prisma migrate deploy`, importing `data/niventra_postgres_export.sql`, running `verify-migration-parity.mjs` against real PG, and adding real-DB integration tests.
2. **P0 — Clean PR Branch History & Staging Deploy Dry-Run:** Squash/re-create clean commits without historical PII on top of `origin/refinement/minimal-content-cleanup`, provision staging PostgreSQL + Render/Railway NestJS service (`HTTPS`) + Vercel Preview (`NEXT_PUBLIC_API_BASE_URL`), and run end-to-end Playwright browser login/CSRF/reset/download verification.
3. **P1 — Implement `@aws-sdk/client-s3` Object Storage Adapter:** Replace `LOCAL_FS`-only writes/reads with private encrypted S3/R2 object storage and wire [`src/app/project-funding/page.tsx`](file:///D:/Projects/niventra%20website/src/app/project-funding/page.tsx) attachments to real binary upload validation.
4. **P1 — Database Constraints, Decimal Precision & Sequence Hardening:** Add secondary FK indexes, SQL `CHECK` constraints, `UNIQUE(payment_reference)`, exact string-decimal SQL export in `migrate-sqlite-to-pg.mjs`, SQL aggregate math in `PortfolioService`, and collision-safe ref ID generators (`ENQ`, `GRV`, `DEL`, `NVA-PF`) using PostgreSQL sequences + CSPRNG suffixes.
5. **P1/P2 — Financial Write Workflows & Code/Doc Synchronization:** Build subscription, allotment, accrual, TDS, and redemption endpoints under transactional audit logs; wire dashboard `/api/notifications`, align project funding INR vs Lakhs cost display units, consolidate duplicate `UsersController`/`AccountController`, update [`API_REFERENCE.md`](file:///D:/Projects/niventra%20website/docs/api/API_REFERENCE.md)/[`TARGET_ARCHITECTURE.md`](file:///D:/Projects/niventra%20website/docs/architecture/TARGET_ARCHITECTURE.md), and schedule the TypeScript `6` + `@nestjs/cli@12` devDependency upgrade once ESLint/ts-jest ecosystem support aligns.

