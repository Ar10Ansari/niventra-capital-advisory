# Niventra Capital Advisory — Developer Guide

**Last Updated:** November 12, 2026

---

## 1. Environment & Tooling Prerequisites

- **Node.js:** `v24.x` (`v24.15.0` verified locally with native `node:sqlite` support)
- **npm:** `v10.x` or `v11.x`
- **Git:** `v2.40+` (`.gitattributes` normalizes text files to `lf` on commit)
- **PostgreSQL 16 (Optional / Target):** Required only when testing live Prisma migrations or running the NestJS backend against PostgreSQL rather than mocked tests.

---

## 2. Running Modes

### Mode A: Next.js + Local SQLite (Default)
Used automatically whenever `NEXT_PUBLIC_API_BASE_URL` is unset:

```bash
npm install
cp .env.example .env.local
node scripts/seed.mjs
node scripts/seed-demo.mjs
npm run dev
```

- Web app & API Route Handlers run at `http://localhost:3000`.
- Data persists in `data/niventra.db` (`node:sqlite`); outbound email fallbacks log PII-masked entries to `data/email_sink.log`.
- Notice: Wait to run `seed-demo.mjs` unless testing explicit `[DEMO]` portfolio records (`is_demo = 1`); never run seed scripts with `NODE_ENV=production`.

### Mode B: Split-Origin Next.js + Standalone NestJS Backend (`:4000`)
Used when testing frontend calls against `backend/`:

```bash
# 1. Start NestJS backend
cd backend
npm install
npx prisma generate
npx prisma migrate deploy     # Requires running PostgreSQL DATABASE_URL
npm run start:dev             # Runs on http://localhost:4000

# 2. Point Next.js client to NestJS in .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
npm run dev
```

- Ensure `CORS_ORIGINS` in `backend/.env` includes `http://localhost:3000`.
- When running locally on HTTP, `validateEnvironment()` defaults `COOKIE_SAMESITE=lax` and `COOKIE_SECURE=false`.
- Swagger interactive docs are available at `http://localhost:4000/api/docs` (disabled automatically when `NODE_ENV=production` unless `SWAGGER_ENABLED=true`).

---

## 3. Useful Repository Scripts

| Script / Command | Purpose |
| :--- | :--- |
| `node scripts/seed.mjs` | Initializes SQLite development user, product, document, enquiry, and grievance records (blocked in `production`). |
| `node scripts/seed-demo.mjs` | Seeds labeled `[DEMO]` portfolio and KYC fixtures (blocked in `production`). |
| `node scripts/migrate-sqlite-to-pg.mjs` | Exports `14` SQLite tables to `data/niventra_postgres_export.sql` and `data/niventra_migration_manifest.json` without mutating `data/niventra.db`. |
| `node scripts/verify-migration-parity.mjs` | Verifies row counts, credential hashes, and all FK chains across SQLite, manifest, and `.sql` export (masked stdout). |
| `cd backend && npm run prisma:generate` | Generates Prisma client from `backend/prisma/schema.prisma`. |
| `cd backend && npm run start:prod` | Runs compiled `backend/dist/main.js`. |

---

## 4. Quality Gates & Tests

Run all checks locally before opening or updating a PR (matching [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)):

```bash
# Root Next.js checks
npm run lint
npm run typecheck
npm test
npm run build

# SQLite-to-Postgres offline parity check
node scripts/verify-migration-parity.mjs

# Backend NestJS checks (placeholder DATABASE_URL works for prisma validate & mocked Jest tests)
cd backend
DATABASE_URL="postgresql://niventra:placeholder@localhost:5432/niventra?schema=public" npx prisma validate
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
npm audit --omit=dev
```

---

## 5. Conventions & Architectural Rules

- **API Transport:** Frontend browser components must call [`src/lib/api/client.ts`](../src/lib/api/client.ts) rather than ad-hoc `fetch` calls so `credentials`, CSRF headers (`X-CSRF-Token`), and validation errors behave consistently.
- **Financial Arithmetic:** Backend monetary summations must use exact integer-paise arithmetic via [`backend/src/common/utils/money.ts`](../backend/src/common/utils/money.ts) (`parseDecimalToPaise`, `summarizeActiveInvestments`) rather than binary floats.
- **Line Endings & Git Hygiene:** Respect `.gitattributes` (`eol=lf` for code/docs). Never commit `.env*`, `*.db`, `*.sqlite*`, certificates/keys, raw investor emails, or build outputs.
- **Branch Protection:** Work in scoped feature branches and open Pull Requests toward `main`; do not bypass CI or push directly to `main`.

