# Niventra Capital Advisory — Deployment & Environment Strategy

**Document Type:** DevOps Runbook & Multi-Environment Deployment Strategy  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/DEPLOYMENT_GUIDE.md`  

---

## 1. Environment Topology

The Niventra Capital Advisory platform enforces strict isolation across three environments:

| Environment | Frontend Host | Backend Host | Database Engine | Purpose |
|:---|:---|:---|:---|:---|
| **Local Development** | `http://localhost:3000` | `http://localhost:4000` | `node:sqlite` (`data/niventra.db`) or local PostgreSQL | Active engineering and testing |
| **Staging** | Vercel Preview URLs | Railway / Render / AWS ECS Staging | Managed PostgreSQL 16 (Staging) | QA verification, migration parity testing, stakeholder preview |
| **Production** | `https://niventra-capital-advisory.vercel.app/` | Dedicated NestJS Instance (AWS ECS / Railway / Render) | Managed PostgreSQL 16 (AWS RDS / Neon with PITR & SSL) | Live client operations |

---

## 2. Production Deployment Safeguards

1. **Domain Preservation:** Never modify DNS records or the canonical Vercel production URL (`https://niventra-capital-advisory.vercel.app/`).
2. **Backend Independence:** Do NOT route live production frontend authentication or financial queries to the NestJS backend until:
   * A live PostgreSQL instance is provisioned with `DATABASE_URL` configured (`sslmode=require`).
   * `npx prisma migrate deploy` has executed cleanly.
   * `scripts/migrate-sqlite-to-pg.mjs` has exported and verified authentic registered user accounts (keyed safely without hardcoded PII) and leads (`ENQ-2026-0006`).
   * Staging integration tests pass 100%.
3. **Database Seeding Lock:** Ensure `NODE_ENV=production` is set on all staging and production instances so development fixtures (`scripts/seed-demo.mjs` and `src/lib/db.ts` auto-seeding) are strictly blocked from execution.

---

## 3. Deploying the NestJS Backend Independently

1. **Build & Test Verification:**
   ```bash
   cd backend
   npm ci
   DATABASE_URL="postgresql://ci:ci@localhost:5432/niventra_ci" npx prisma validate
   npx prisma generate
   npm run lint
   npm run typecheck
   npm run build
   npm test
   npm run test:e2e
   ```
2. **Database Migrations:**
   ```bash
   npx prisma migrate deploy
   ```
3. **Runtime Startup (`dist/main.js`):**
   ```bash
   npm run start:prod
   ```
4. **Routing Frontend Traffic to NestJS (Post-Cutover Only):**
   Configure `NEXT_PUBLIC_API_BASE_URL` on the Vercel frontend project pointing to the hardened NestJS backend domain, and ensure `CORS_ORIGINS` on the backend explicitly lists the Vercel frontend origin.
5. **Health & Documentation Endpoints:**
   * Swagger OpenAPI Spec: `https://<backend-host>/api/docs`
   * Branch Directory Verification: `GET https://<backend-host>/api/branches`

---

## 4. Required Production Credentials (Management Action Required)

To execute the live database cutover (Phase 7), management/DevOps must supply the following credentials in the hosting dashboards (NEVER commit to GitHub):

1. `DATABASE_URL`: Managed PostgreSQL 16 connection URI (`sslmode=require`).
2. `SESSION_SECRET`: 64-character random cryptographic key.
3. `JWT_SECRET`: 64-character random cryptographic key.
4. `RESEND_API_KEY`: Production API key for outbound transactional emails.
5. `LEAD_NOTIFICATION_EMAILS`: Authorized staff recipient inbox list.
6. `S3_BUCKET_NAME`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`: S3/R2 bucket credentials for encrypted real estate document storage.
