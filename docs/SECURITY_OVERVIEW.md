# Niventra Capital Advisory — Security & Privacy Overview

**Updated:** November 12, 2026  
**Baseline Policy:** [`SECURITY.md`](../SECURITY.md) | **Detailed Sprint 1 Audit:** [`docs/architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md`](architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md)

---

## 1. Verified Security Controls

| Control Area | Verified Implementation |
| :--- | :--- |
| **Environment Startup Guards** | [`validateEnvironment`](../backend/src/config/env.validation.ts) blocks boot in both `staging` and `production` unless `DATABASE_URL` and non-placeholder `JWT_SECRET` (>= 32 chars) are present. Wildcard (`*`), `null`, and insecure `http://` CORS origins are rejected in deployed modes. |
| **Cross-Origin Cookies & CSRF** | Deployed environments default `COOKIE_SAMESITE=none` + `COOKIE_SECURE=true` (`SameSite=None` without `Secure` is blocked) with matching flags in [`clearSessionCookie`](../backend/src/common/utils/cookie.ts). Global [`CsrfGuard`](../backend/src/common/guards/csrf.guard.ts) validates Origin/Referer + HMAC-SHA256 `X-CSRF-Token` on cookie-authenticated mutations. |
| **Token Pinning & Session Revocation** | `AuthModule` & `SessionOrJwtAuthGuard` pin `HS256`, `issuer: "niventra-api"`, and `audience: "niventra-portal"`, rejecting `alg:none` and stale tokens. All JWTs carry a `sid` tied to active DB `Session` rows and are revoked on logout, `resetPassword`, `changePassword`, and `requestDeletion`. |
| **Password & Verification Security** | Scrypt 16-byte salted hashes with pre-`timingSafeEqual` buffer length guards (`src/lib/auth/password.ts`, `AuthService`). Authenticated deletion requires current password verification in both NestJS and Next.js `/api/account/delete`. |
| **Document ACLs & Binary Checks** | `DocumentsService` enforces `status === "APPROVED"` for non-staff callers, denies `PUBLIC`-role access to private documents, isolates owner-scoped docs (`ownerId` / `owners/<userId>/`), checks binary magic bytes (`15 MB` cap), serves canonical MIME extensions (`nosniff`, `private, no-store`), and blocks silent `LOCAL_FS` fallback (`503`) if `S3_*` vars imply cloud storage. |
| **HTTP Headers & Log Redaction** | [`app.setup.ts`](../backend/src/app.setup.ts) enforces Helmet CSP/HSTS/XFO/`nosniff` and `TRUST_PROXY_HOPS`. [`next.config.ts`](../next.config.ts) sets HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, and `Permissions-Policy`. Query strings (`?token=...`) are stripped from logs/errors, and 5xx internal error details are suppressed in staging/prod. |

---

## 2. Dependency Vulnerability Posture

| Scope | Runtime (`--omit=dev`) | All Dependencies (Incl. Dev) | Notes |
| :--- | :---: | :---: | :--- |
| **Root Next.js App** | `0` | `7 moderate` | Dev-only `@typescript-eslint/*` / `minimatch`. |
| **Backend NestJS App** | **`0`** *(down from `12`)* | `28` (`5 high`, `12 mod`, `11 low`) | All `28` remaining vulnerabilities reside in dev-only tooling (`@nestjs/cli@10.x` / `webpack` / `glob` / `tmp` / `typescript-eslint`); upgrading CLI to `v12` requires TypeScript 6. |

---

## 3. Privacy, PII & Git History Status

- **Working Tree & `HEAD`:** Scrubbed clean of committed personal email addresses, real client identities, and hardcoded production user IDs (`0` hits in workspace PII scans). [`migrate-sqlite-to-pg.mjs`](../scripts/migrate-sqlite-to-pg.mjs) and [`verify-migration-parity.mjs`](../scripts/verify-migration-parity.mjs) emit masked addresses (`maskEmail()`) to stdout only. `.gitignore` blocks `*.db`, `*.sqlite*`, `.env*`, `*.pem`, `*.key`, `*.p12`, and `*.pfx`.
- **Important Pre-Push Git History Warning:** Two earlier unpushed local commits on `refinement/minimal-content-cleanup` (`2ded383` and `9498531`) still contain raw personal email addresses and real SQLite user IDs in their local commit history (`origin/refinement/minimal-content-cleanup` at `78afc1e` does not). **Resolving or cleanly squashing those unpushed commits with maintainer approval before pushing to GitHub is strongly recommended** so PII never enters remote GitHub history.

---

## 4. Known Remaining Security Gaps (Planned for Sprint 2)

1. Live PostgreSQL TLS verification & integration test suite in CI (`postgres:16`).
2. `@aws-sdk/client-s3` implementation for remote encrypted uploads and removal of mock Step 3 metadata in `/project-funding/`.
3. PostgreSQL schema hardening: missing secondary FK indexes, `CHECK` constraints, `UNIQUE(payment_reference)` idempotency index, non-PAN KYC format regexes (Aadhaar/Passport/Voter ID), and collision-safe ID sequences replacing `count() + 1`.
4. Removal/implementation of Cloudflare Turnstile verification (`TURNSTILE_*` keys are currently template-only placeholders).

