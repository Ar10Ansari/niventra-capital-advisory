# Niventra Capital Advisory

Niventra Capital Advisory is an Indian corporate financial advisory platform focused on structured corporate debt, senior secured private placement debentures (Companies Act, 2013 Section 42 / Section 71), and real estate developer project financing evaluation.

---

## 1. Business Purpose

The platform provides:
- Institutional public disclosures, product structures, grievance redressal policies, and regulatory notices.
- Client advisory consultation scheduling and developer project funding intake.
- An authenticated investor workspace for inspecting illustrative/allocated debenture holdings, transaction histories, KYC status, documents, enquiries, and grievances.
- An administrative deal desk for reviewing project applications, enquiries, grievances, product catalog items, document metadata, and audit logs.

> **Important Status Notice:** Current production hosting on Vercel operates in Next.js + local SQLite demonstration/transition mode. The standalone NestJS + PostgreSQL backend (`backend/`) is implemented and hardened in-repo, but **live PostgreSQL migration, S3 object storage uploads, and corporate/statutory sign-offs (`DEC-01`–`DEC-07`) remain pending** before production cutover. See [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

---

## 2. Main Platform Capabilities

- **Public Institutional Website (`src/app/`):** Canonical advisory pages including `/`, `/about`, `/capital-providers`, `/real-estate`, `/debt-debenture`, `/due-diligence`, `/products`, `/calculator`, `/contact`, `/grievance`, `/project-funding`, and statutory policy pages.
- **Project Funding Intake & Admin Review:** Multi-step real estate proposal submission (`/project-funding/`) with server-side cost validation, status transitions, and immutable review history.
- **Investor Portal & Account Controls (`/dashboard/`, `/dashboard/settings/`):** Portfolio summary, holding ledger inspection, KYC masking/verification, notification preferences, password changes with immediate session revocation, and DPDP Act 2023 account erasure requests (`/delete-account/`).
- **Grounded Institutional Chatbot & Yield Calculator:** Rule-based FAQ matcher with prompt-injection refusal (`ChatbotService` / `src/lib/ai/knowledge.ts`) and simple-interest simulation (`CalculatorService` / `src/lib/calculator.ts`).
- **Branch Directory (`/contact/`):** Searchable 25-location directory dataset (1 published corporate head office + 24 historical records held cleanly).
- **Standalone Enterprise Backend (`backend/`):** 16 NestJS modules backed by a 15-table Prisma PostgreSQL schema, Swagger OpenAPI (`/api/docs`), cookie/Bearer JWT + HMAC CSRF protection, document ACL/magic-byte validation, and `/api/health/*` probes.

---

## 3. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js `16.4.1` (App Router, Turbopack), React `19.3.0`, TypeScript `^5` (`strict: true`), Tailwind CSS `^4`, `lucide-react` |
| **Backend (`backend/`)** | NestJS `^11.2.9`, `@nestjs/platform-express` (Express 5), `@nestjs/jwt`, `@nestjs/throttler`, Helmet, `class-validator`, `winston` |
| **ORM & Database** | Prisma `^5.22.0` + PostgreSQL 16 (`backend/prisma/schema.prisma`), plus Node `node:sqlite` (`data/niventra.db`) transition runtime |
| **Notifications & Storage** | Resend REST API (`fetch` with local masked fallback `data/email_sink.log`), local filesystem adapter (`LOCAL_FS`, S3 SDK pending) |
| **Testing** | Node native test runner (`node --test tests/*.test.mjs`), Jest (`backend` unit), Supertest (`backend` E2E against in-memory mocked Prisma) |

---

## 4. Architecture Overview

The repository supports **two explicit runtime modes** switched via `NEXT_PUBLIC_API_BASE_URL` in [`src/lib/api/client.ts`](src/lib/api/client.ts):
1. **Default / Current Vercel Mode (`NEXT_PUBLIC_API_BASE_URL` unset):** Next.js serves UI pages and fallback Route Handlers (`src/app/api/*`) backed by local SQLite (`data/niventra.db`).
2. **Decoupled Target Mode (`NEXT_PUBLIC_API_BASE_URL` set):** Next.js browser clients call the standalone NestJS REST API (`backend/`) over HTTPS with split-origin cookies (`SameSite=None; Secure; HttpOnly`) and HMAC-SHA256 `X-CSRF-Token` protection backed by PostgreSQL.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for system and auth-flow Mermaid diagrams.

---

## 5. Repository Structure

```text
.
├── .env.example                 # Environment variable template (placeholders only)
├── .github/workflows/ci.yml     # CI pipeline for frontend + backend verification
├── backend/                     # Standalone NestJS + Prisma backend
│   ├── prisma/                  # 15-table PostgreSQL schema and initial SQL migration
│   ├── src/
│   │   ├── app.setup.ts         # Shared Express/Helmet/CORS/Validation/Swagger setup
│   │   ├── common/              # Guards (Auth, Roles, CSRF), filters, logger, money/cookie/masking utils
│   │   ├── config/              # Fail-closed staging/production env validation
│   │   └── modules/             # 16 domain modules (auth, users, documents, health, investments, etc.)
│   └── test/                    # Supertest E2E suite (mocked in-memory Prisma)
├── data/                        # Gitignored local SQLite DB, email sink log, export artifacts & backups
├── docs/                        # System architecture, API, DB, security, status & release reports
├── preserved-assets/            # Archived legacy static HTML/CSS/JS/PNG assets kept for reference
├── public/                      # Active website public images and icons
├── scripts/                     # DB seeders (seed.mjs, seed-demo.mjs), PG export & parity verifiers
├── src/                         # Next.js App Router frontend, components, libraries & fallback API routes
└── tests/                       # Node native frontend, calculator, branch, schema & security test suites
```

---

## 6. Local Development Setup

### Prerequisites
- **Node.js:** `v24.x` (tested on `v24.15.0` with native `node:sqlite`; `v20+` compatible for Next.js/NestJS except native `node:sqlite` scripts)
- **npm:** `v10.x` or `v11.x`
- **Git:** `v2.40+`

### Installation & Environment Configuration
```bash
git clone https://github.com/Ar10Ansari/niventra-capital-advisory.git
cd niventra-capital-advisory

# Install frontend dependencies
npm install

# Install standalone backend dependencies
cd backend
npm install
npx prisma generate
cd ..

# Create local environment files from placeholders
cp .env.example .env.local
```

Configure `NEXT_PUBLIC_API_BASE_URL` only when running against the standalone NestJS API; leave it unset for Next.js + SQLite mode. Never commit real secrets or `.env` files.

### Database Setup
- **Local SQLite (`data/niventra.db`):** Initialized lazily by [`src/lib/db.ts`](src/lib/db.ts), or explicitly seeded with local demo accounts (`admin@niventra.local`, `staff@niventra.local`, `investor@example.com`):
  ```bash
  node scripts/seed.mjs
  node scripts/seed-demo.mjs
  ```
- **Target PostgreSQL (`backend/prisma/`):** Requires a reachable PostgreSQL instance configured in `DATABASE_URL`:
  ```bash
  cd backend
  npx prisma migrate deploy
  cd ..
  ```
  SQLite-to-PostgreSQL SQL export and offline parity checks:
  ```bash
  node scripts/migrate-sqlite-to-pg.mjs
  node scripts/verify-migration-parity.mjs
  ```

---

## 7. Startup Instructions

### Frontend Only (Next.js + SQLite Fallback Mode)
```bash
npm run dev
```
Open `http://localhost:3000`.

### Standalone NestJS Backend (Port `4000`)
```bash
cd backend
cp ../.env.example .env   # Supply valid JWT_SECRET & DATABASE_URL if running in staging/prod
npm run start:dev
```
Swagger OpenAPI docs (enabled by default in non-production environments): `http://localhost:4000/api/docs`.

To route the Next.js frontend to the local backend, set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` in `.env.local` and restart Next.js.

---

## 8. Testing & Verification

```bash
# Frontend & shared checks (repository root)
npm run lint
npm run typecheck
npm test              # 52 automated tests across tests/*.test.mjs
npm run build         # Production Next.js build (48 routes)

# Backend checks (from backend/)
cd backend
npx prisma validate   # Requires DATABASE_URL set (placeholder allowed for schema syntax check)
npm run lint
npm run typecheck
npm run build
npm test              # 9 Jest unit suites (42 tests, mocked Prisma)
npm run test:e2e      # 1 Supertest suite (10 E2E cases, mocked in-memory Prisma)
npm audit --omit=dev  # Production runtime dependency audit (0 vulnerabilities)
```

---

## 9. Documentation Index

- **API Documentation:** [`docs/API_OVERVIEW.md`](docs/API_OVERVIEW.md) and [`docs/api/API_REFERENCE.md`](docs/api/API_REFERENCE.md) (plus runtime OpenAPI at `/api/docs` when enabled)
- **Architecture:** [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **Feature Status Matrix:** [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md)
- **Development Guide:** [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md)
- **Security Overview:** [`docs/SECURITY_OVERVIEW.md`](docs/SECURITY_OVERVIEW.md) and [`SECURITY.md`](SECURITY.md)
- **Deployment & Database Migration:** [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md), [`docs/database/SCHEMA_DICTIONARY.md`](docs/database/SCHEMA_DICTIONARY.md), [`docs/database/MIGRATION_STRATEGY.md`](docs/database/MIGRATION_STRATEGY.md)
- **Audit & Release Reports:** [`docs/architecture/PRE_CUTOVER_VERIFICATION_REPORT.md`](docs/architecture/PRE_CUTOVER_VERIFICATION_REPORT.md), [`docs/architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md`](docs/architecture/SPRINT_1_SECURITY_REMEDIATION_REPORT.md), and [`docs/GITHUB_RELEASE_READINESS_REPORT.md`](docs/GITHUB_RELEASE_READINESS_REPORT.md)

---

## 10. Deployment Architecture, Current Status & Known Limitations

- **Current Production:** Hosted on Vercel at `https://niventra-capital-advisory.vercel.app/` from `main` without external NestJS cutover (`NEXT_PUBLIC_API_BASE_URL` unset).
- **Planned Split-Origin Production:** Vercel hosts Next.js; a dedicated Node runtime hosts `backend/` with managed TLS PostgreSQL (`DATABASE_URL` with `?sslmode=require`), HTTPS `CORS_ORIGINS`, `TRUST_PROXY_HOPS >= 1`, `COOKIE_SAMESITE=none`, `COOKIE_SECURE=true`, and `SWAGGER_ENABLED=false`.
- **Known Limitations:**
  - Live `prisma migrate deploy` and SQL import have not yet been executed against a running PostgreSQL server.
  - S3/R2 remote upload driver is unimplemented (`StorageAdapter` operates in explicit `LOCAL_FS` mode and rejects local writes with `503` if `S3_*` vars imply remote storage).
  - `/api/investments` and `/api/transactions` in the NestJS backend are currently read-only query endpoints (write/allotment/payout mutations are unimplemented).
  - Real email delivery requires valid `RESEND_API_KEY` + verified domain DNS; Turnstile bot verification keys exist in `.env.example` without active verification code.
  - Real-money transactions and calculator live promotion await corporate legal/CFO sign-offs (`DEC-01`–`DEC-07`).

---

## 11. Security Considerations

- **Runtime Controls Verified:** HttpOnly session cookies + session-bound HMAC-SHA256 `X-CSRF-Token`, explicit CORS origin allowlists, pinned `HS256` JWT issuer/audience + `sid` revocation on logout/reset/password-change/deletion, fail-closed `staging`/`production` env validation, `DocumentsService` approval/role/owner ACLs + magic-byte checks, Helmet & Next.js security headers, query-string log sanitization, and `0` runtime production `npm audit` vulnerabilities in both packages.
- **Unresolved Pre-Push History Advisory:** Two earlier unpushed commits on `refinement/minimal-content-cleanup` (`2ded383`, `9498531`) still contain raw personal email addresses in local Git history despite `HEAD` being completely scrubbed. See [`docs/SECURITY_OVERVIEW.md`](docs/SECURITY_OVERVIEW.md) before pushing to remote branches.

---

## 12. Contributing & License

Please follow [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SECURITY.md`](SECURITY.md). Work in feature branches, run all root and backend checks cleanly, never commit `.env*` secrets or real client records, and never merge directly to `main` without engineering and compliance review. Repository license: Private / Proprietary (`UNLICENSED`).
