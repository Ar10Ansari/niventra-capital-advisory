# Niventra Capital Advisory — Database Migration Strategy (SQLite to PostgreSQL)

**Document Type:** Data Migration Architecture, Verification Protocol & Safety Runbook  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/database/MIGRATION_STRATEGY.md`  

---

## 1. Migration Principles & Safety Mandates

1. **Zero Data Loss:** All registered users, especially authentic production accounts (non-fixture `users` records verified by anonymized ID/checksum), consultation leads (`ENQ-2026-0006`), and audit records, MUST be migrated intact.
2. **Immutable Backup First:** Before any script touches production or staging data, a verified timestamped physical backup of `data/niventra.db` must exist and pass verification.
3. **Dual-Stack Parallel Execution:** The new NestJS + PostgreSQL service runs in parallel with the Next.js runtime. No live switch occurs until automated parity tests confirm 100% record match.
4. **Primary Key & Hash Preservation:** User IDs (`usr_*`) and cryptographic password hashes/salts must be transferred verbatim so existing credentials remain functional without requiring forced password resets.

---

## 2. Step-by-Step Migration Protocol

### Step 1: Backup Verification
Run the backup script to freeze current state:
```bash
# Verify backup integrity
ls -lh data/backups/niventra.db.pre-audit-backup-20261111
```

### Step 2: Extract & Verify SQLite Source Data
Run an extraction audit script to inspect all 14 source tables and verify row counts:
```bash
node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('data/niventra.db');
const tables = ['users', 'sessions', 'products', 'documents', 'kyc_records', 'investments', 'investment_transactions', 'project_applications', 'project_status_history', 'enquiries', 'grievances', 'notifications', 'deletion_requests', 'audit_logs'];
for (const t of tables) {
  const c = db.prepare('SELECT COUNT(*) as cnt FROM ' + t).get();
  console.log(t.padEnd(25) + ': ' + c.cnt + ' rows');
}
"
```

### Step 3: Target PostgreSQL Provisioning
1. Provision managed PostgreSQL (PostgreSQL 16) on AWS RDS, Neon, or Railway with SSL enforced (`sslmode=require`).
2. Supply `DATABASE_URL` to backend environment:
   ```env
   DATABASE_URL="postgresql://niventra_admin:<SECRET>@<HOST>:5432/niventra_prod?sslmode=require"
   ```

### Step 4: Apply Schema Migrations
Execute versioned Prisma migrations against PostgreSQL:
```bash
cd backend
npx prisma migrate deploy
```

### Step 5: Transfer Records with Type Casting
Execute the automated 14-table migration script `node scripts/migrate-sqlite-to-pg.mjs`:
* Verifies a physical SQLite backup exists in `data/backups/`.
* Maps SQLite `DATETIME` strings to PostgreSQL `TIMESTAMPTZ` and supplies non-null `updated_at` timestamps.
* Maps integer booleans (`1` / `0`) to native `BOOLEAN` and stringified document metadata / audit details to `JSONB`.
* Preserves all primary-key `id` strings (`usr_*`, `ENQ-2026-0006`), `password_hash`, and `salt`.
* Emits idempotent `INSERT ... ON CONFLICT DO NOTHING` statements in strict foreign-key dependency order (`users` $\rightarrow$ `sessions` $\rightarrow$ `products` $\rightarrow$ `documents` $\rightarrow$ `kyc_records` $\rightarrow$ `investments` $\rightarrow$ `investment_transactions` $\rightarrow$ `project_applications` $\rightarrow$ `project_status_history` $\rightarrow$ `enquiries` $\rightarrow$ `grievances` $\rightarrow$ `notifications` $\rightarrow$ `deletion_requests` $\rightarrow$ `audit_logs`) into `data/niventra_postgres_export.sql` and `data/niventra_migration_manifest.json`.

### Step 6: Post-Migration Parity Verification
Verify row counts, Prisma schema coverage, referential integrity, and authentic record credential digests between SQLite, manifest, and generated PostgreSQL SQL:
```bash
# Automated verification script
node scripts/verify-migration-parity.mjs
```
Checks:
- All 14 `@@map(...)` tables match exact SQLite == Manifest == SQL `INSERT` counts with 0 orphaned foreign keys.
- `users`: Confirm all authentic non-fixture `users` exist with matching SHA-256 credential digests (masked in terminal output; optional `MIGRATION_VERIFY_EMAILS` env filter supported safely at runtime).
- `enquiries`: Confirm `ENQ-2026-0006` exists with intact timestamps and user linkage.
- `audit_logs`: Confirm all security log entries migrated cleanly.

### Step 7: Dual-Run & Cutover (Requires Management Approval & Live Credentials)
1. Import `data/niventra_postgres_export.sql` into the provisioned staging PostgreSQL database after `npx prisma migrate deploy`.
2. Configure `NEXT_PUBLIC_API_BASE_URL` on staging Next.js frontend pointing to the NestJS staging API URL (e.g. `https://api-staging.niventracapitaladvisory.com`).
3. Verify authentication, profile preferences, project funding, and portfolio endpoints in staging.
4. Obtain executive cutover approval before updating production Vercel variables or deploying production traffic.
5. Archive SQLite database backup to cold storage.
