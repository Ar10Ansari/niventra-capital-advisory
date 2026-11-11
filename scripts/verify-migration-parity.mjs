/**
 * Niventra Capital Advisory — Migration Parity & Integrity Verification Script
 *
 * Verifies consistency between:
 *   1. Live SQLite database (`data/niventra.db`)
 *   2. Generated JSON manifest (`data/niventra_migration_manifest.json`)
 *   3. Generated PostgreSQL SQL import script (`data/niventra_postgres_export.sql`)
 *   4. Foreign key referential integrity across all 14 tables
 */

import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = path.join(process.cwd(), "data", "niventra.db");
const MANIFEST_PATH = path.join(process.cwd(), "data", "niventra_migration_manifest.json");
const SQL_PATH = path.join(process.cwd(), "data", "niventra_postgres_export.sql");
const SCHEMA_PATH = path.join(process.cwd(), "backend", "prisma", "schema.prisma");

function fail(message) {
  console.error(`PARITY FAILURE: ${message}`);
  process.exit(1);
}

console.log("==================================================================");
console.log("NIVENTRA CAPITAL ADVISORY — MIGRATION PARITY VERIFICATION");
console.log("==================================================================");

if (!fs.existsSync(DB_PATH)) fail(`Missing SQLite database at ${DB_PATH}`);
if (!fs.existsSync(MANIFEST_PATH)) fail(`Missing manifest at ${MANIFEST_PATH}. Run migrate-sqlite-to-pg.mjs first.`);
if (!fs.existsSync(SQL_PATH)) fail(`Missing SQL export at ${SQL_PATH}. Run migrate-sqlite-to-pg.mjs first.`);
if (!fs.existsSync(SCHEMA_PATH)) fail(`Missing Prisma schema at ${SCHEMA_PATH}`);

const db = new DatabaseSync(DB_PATH);
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
const sqlScript = fs.readFileSync(SQL_PATH, "utf-8");
const prismaSchema = fs.readFileSync(SCHEMA_PATH, "utf-8");

const tables = [
  "users",
  "sessions",
  "products",
  "documents",
  "kyc_records",
  "investments",
  "investment_transactions",
  "project_applications",
  "project_status_history",
  "enquiries",
  "grievances",
  "notifications",
  "deletion_requests",
  "audit_logs",
];

// 1. Verify Prisma schema declares every migrated table mapping
for (const table of tables) {
  if (!prismaSchema.includes(`@@map("${table}")`)) {
    fail(`Prisma schema missing @@map("${table}")`);
  }
}

// 2. Verify SQLite row counts match manifest and SQL INSERT statements
for (const table of tables) {
  const sqliteCount = db.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get().cnt;
  const manifestCount = Array.isArray(manifest.tables?.[table]) ? manifest.tables[table].length : -1;
  const insertMatches = (sqlScript.match(new RegExp(`INSERT INTO "${table}"`, "g")) || []).length;

  if (sqliteCount !== manifestCount) {
    fail(`Row count mismatch in manifest for "${table}": sqlite=${sqliteCount}, manifest=${manifestCount}`);
  }
  if (sqliteCount !== insertMatches) {
    fail(`SQL INSERT count mismatch for "${table}": sqlite=${sqliteCount}, sql=${insertMatches}`);
  }
  console.log(`- Verified ${table.padEnd(25)}: ${sqliteCount} rows (SQLite == Manifest == SQL)`);
}

// 3. Verify transaction boundaries & clean SQL literals
if (!sqlScript.includes("\nBEGIN;") || !sqlScript.includes("\nCOMMIT;")) {
  fail("Generated SQL script is missing BEGIN/COMMIT transaction boundaries.");
}
if (/\bVALUES\s*\([^;]*\bundefined\b/i.test(sqlScript)) {
  fail("Generated SQL script contains invalid JavaScript 'undefined' literal.");
}

function maskEmail(email) {
  const parts = String(email || "").split("@");
  if (parts.length !== 2) return "***@***";
  const [local, domain] = parts;
  return `${local[0] || "*"}***@${domain}`;
}

function isFixtureEmail(email) {
  const normalized = String(email || "").toLowerCase();
  return normalized.endsWith("@niventra.local") || normalized === "investor@example.com";
}

// 4. Verify authentic production accounts & credential hashes without exposing plaintext PII
const users = manifest.tables.users || [];
const dbUsers = db.prepare("SELECT * FROM users").all();
const optionalVerifyEmails = (process.env.MIGRATION_VERIFY_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const authenticDbUsers = dbUsers.filter((u) =>
  optionalVerifyEmails.length > 0
    ? optionalVerifyEmails.includes(String(u.email).toLowerCase())
    : !isFixtureEmail(u.email)
);

for (const dbUser of authenticDbUsers) {
  const manifestUser = users.find((u) => u.id === dbUser.id);
  if (!manifestUser) {
    fail(`Missing authentic user record "${dbUser.id}" (${maskEmail(dbUser.email)}) in migration manifest.`);
  }
  const expectedDigest = createHash("sha256")
    .update(`${dbUser.id}:${dbUser.email}:${dbUser.password_hash}:${dbUser.salt}`)
    .digest("hex");
  const recordedEntry =
    manifest.authenticUserChecksums?.[dbUser.id] ||
    manifest.authenticUserChecksums?.[dbUser.email];
  const recordedDigest = recordedEntry?.digestSha256;
  if (expectedDigest !== recordedDigest || dbUser.password_hash !== manifestUser.password_hash) {
    fail(`Credential integrity mismatch for user "${dbUser.id}" (${maskEmail(dbUser.email)}).`);
  }
  console.log(`- Verified authentic user "${dbUser.id}" (${maskEmail(dbUser.email)}) hash & salt digest intact.`);
}

// 5. Verify referential integrity across all manifest foreign-key relations
const userIds = new Set(users.map((u) => u.id));
const productIds = new Set((manifest.tables.products || []).map((p) => p.id));
const investmentIds = new Set((manifest.tables.investments || []).map((i) => i.id));
const projectIds = new Set((manifest.tables.project_applications || []).map((p) => p.id));

for (const s of manifest.tables.sessions || []) {
  if (!userIds.has(s.user_id)) fail(`Orphaned session ${s.id} referencing missing user ${s.user_id}`);
}
for (const k of manifest.tables.kyc_records || []) {
  if (!userIds.has(k.user_id)) fail(`Orphaned KYC ${k.id} referencing missing user ${k.user_id}`);
}
for (const inv of manifest.tables.investments || []) {
  if (!userIds.has(inv.user_id)) fail(`Orphaned investment ${inv.id} referencing missing user ${inv.user_id}`);
  if (inv.product_id && !productIds.has(inv.product_id)) {
    fail(`Orphaned investment ${inv.id} referencing missing product ${inv.product_id}`);
  }
}
for (const txn of manifest.tables.investment_transactions || []) {
  if (!investmentIds.has(txn.investment_id)) {
    fail(`Orphaned transaction ${txn.id} referencing missing investment ${txn.investment_id}`);
  }
  if (!userIds.has(txn.user_id)) fail(`Orphaned transaction ${txn.id} referencing missing user ${txn.user_id}`);
}
for (const prj of manifest.tables.project_applications || []) {
  if (prj.assigned_to && !userIds.has(prj.assigned_to)) {
    fail(`Orphaned project_application ${prj.id} referencing missing staff user ${prj.assigned_to}`);
  }
}
for (const hist of manifest.tables.project_status_history || []) {
  if (!projectIds.has(hist.project_id)) {
    fail(`Orphaned project_status_history ${hist.id} referencing missing project ${hist.project_id}`);
  }
}
for (const enq of manifest.tables.enquiries || []) {
  if (enq.user_id && !userIds.has(enq.user_id)) {
    fail(`Orphaned enquiry ${enq.id} referencing missing user ${enq.user_id}`);
  }
  if (enq.assigned_to && !userIds.has(enq.assigned_to)) {
    fail(`Orphaned enquiry ${enq.id} referencing missing staff user ${enq.assigned_to}`);
  }
}
for (const grv of manifest.tables.grievances || []) {
  if (grv.user_id && !userIds.has(grv.user_id)) {
    fail(`Orphaned grievance ${grv.id} referencing missing user ${grv.user_id}`);
  }
  if (grv.assigned_to && !userIds.has(grv.assigned_to)) {
    fail(`Orphaned grievance ${grv.id} referencing missing staff user ${grv.assigned_to}`);
  }
}
for (const notif of manifest.tables.notifications || []) {
  if (!userIds.has(notif.user_id)) {
    fail(`Orphaned notification ${notif.id} referencing missing user ${notif.user_id}`);
  }
}
for (const del of manifest.tables.deletion_requests || []) {
  if (del.user_id && !userIds.has(del.user_id)) {
    fail(`Orphaned deletion_request ${del.id} referencing missing user ${del.user_id}`);
  }
}

console.log("\n[Referential Integrity] All foreign-key chains verified with 0 orphans.");
console.log("[Live Postgres Cutover] Pending management approval & live DATABASE_URL.");
console.log("==================================================================");
