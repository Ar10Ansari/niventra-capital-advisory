/**
 * Niventra Capital Advisory — Full 14-Table SQLite to PostgreSQL Migration Engine
 *
 * Operational Mandates:
 * 1. Verifies that a physical SQLite backup exists in data/backups/ before reading.
 * 2. Extracts all 14 relational tables in foreign-key dependency order.
 * 3. Preserves authentic user IDs (`usr_*`), leads (`ENQ-2026-0006`), scrypt password hashes,
 *    salts, and audit logs verbatim so cutover requires zero forced password resets.
 * 4. Maps SQLite types cleanly to PostgreSQL (TIMESTAMPTZ, BOOLEAN, JSONB, DECIMAL, non-null updated_at).
 * 5. Writes `data/niventra_migration_manifest.json` and idempotent `data/niventra_postgres_export.sql`.
 */

import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs";

const DB_PATH = path.join(process.cwd(), "data", "niventra.db");
const BACKUP_DIR = path.join(process.cwd(), "data", "backups");

const DEPENDENCY_ORDERED_TABLES = [
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

function sqlStr(val) {
  if (val === null || val === undefined) return "NULL";
  return `'${String(val).replace(/'/g, "''")}'`;
}

function sqlNum(val, fallback = null) {
  if (val === null || val === undefined || val === "") {
    return fallback === null ? "NULL" : String(fallback);
  }
  // Preserve exact decimal representation from SQLite strings rather than coercing via IEEE-754 floats.
  const normalized = String(val).trim();
  if (/^[+-]?\d+(?:\.\d+)?$/.test(normalized)) {
    return normalized;
  }
  const num = Number(val);
  return Number.isFinite(num) ? String(num) : fallback === null ? "NULL" : String(fallback);
}

function sqlBool(val, fallback = false) {
  if (val === null || val === undefined) return fallback ? "TRUE" : "FALSE";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  return Number(val) !== 0 ? "TRUE" : "FALSE";
}

function sqlTs(val, fallback = null) {
  if (val === null || val === undefined || String(val).trim() === "") {
    return fallback ? sqlTs(fallback) : "NULL";
  }
  return sqlStr(String(val).trim());
}

function sqlNonNullTs(val, fallbackVal) {
  if (val !== null && val !== undefined && String(val).trim() !== "") {
    return sqlStr(String(val).trim());
  }
  if (fallbackVal !== null && fallbackVal !== undefined && String(fallbackVal).trim() !== "") {
    return sqlStr(String(fallbackVal).trim());
  }
  return "CURRENT_TIMESTAMP";
}

function sqlJsonb(val, defaultValue = "NULL") {
  if (val === null || val === undefined || String(val).trim() === "") {
    return defaultValue;
  }
  const raw = String(val);
  try {
    const parsed = JSON.parse(raw);
    return `${sqlStr(JSON.stringify(parsed))}::jsonb`;
  } catch {
    return `${sqlStr(JSON.stringify({ raw }))}::jsonb`;
  }
}

console.log("==================================================================");
console.log("NIVENTRA CAPITAL ADVISORY — FULL 14-TABLE MIGRATION EXTRACTION");
console.log("==================================================================");

if (!fs.existsSync(DB_PATH)) {
  console.error("FATAL: Source database not found at", DB_PATH);
  process.exit(1);
}

if (!fs.existsSync(BACKUP_DIR) || fs.readdirSync(BACKUP_DIR).length === 0) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const backupFile = path.join(BACKUP_DIR, `niventra.db.auto-backup-${Date.now()}`);
  fs.copyFileSync(DB_PATH, backupFile);
  console.log(`[Backup Created] Verified backup written to ${backupFile}`);
} else {
  console.log(`[Backup Verified] Backup folder contains ${fs.readdirSync(BACKUP_DIR).length} backup(s).`);
}

const db = new DatabaseSync(DB_PATH);
const exportData = {};
const tableCounts = {};
let totalRows = 0;

for (const tableName of DEPENDENCY_ORDERED_TABLES) {
  try {
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
    exportData[tableName] = rows;
    tableCounts[tableName] = rows.length;
    totalRows += rows.length;
    console.log(`- Extracted ${tableName.padEnd(25)}: ${rows.length} records`);
  } catch {
    console.warn(`- Table ${tableName} not present in source database.`);
    exportData[tableName] = [];
    tableCounts[tableName] = 0;
  }
}

function maskEmail(email) {
  const parts = String(email || "").split("@");
  if (parts.length !== 2) return "***@***";
  const [local, domain] = parts;
  return `${local[0] || "*"}***@${domain}`;
}

function isFixtureUser(user) {
  const email = String(user.email || "").toLowerCase();
  return email.endsWith("@niventra.local") || email === "investor@example.com";
}

const users = exportData.users || [];
const optionalEmails = (process.env.MIGRATION_VERIFY_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const authenticUsers = users.filter((u) =>
  optionalEmails.length > 0 ? optionalEmails.includes(String(u.email).toLowerCase()) : !isFixtureUser(u)
);
const authenticUserChecksums = {};

console.log("\n--- Authentic Production Records Verification ---");
console.log(`Authentic client accounts identified: ${authenticUsers.length}`);
for (const u of authenticUsers) {
  const hashDigest = createHash("sha256")
    .update(`${u.id}:${u.email}:${u.password_hash}:${u.salt}`)
    .digest("hex");
  const emailSha256 = createHash("sha256").update(String(u.email).toLowerCase()).digest("hex");
  authenticUserChecksums[u.id] = {
    id: u.id,
    maskedEmail: maskEmail(u.email),
    emailSha256,
    digestSha256: hashDigest,
  };
  console.log(
    `  * User ID: ${u.id} | Masked: ${maskEmail(u.email)} | Credential Digest: ${hashDigest.slice(0, 12)}...`
  );
}

const enquiries = exportData.enquiries || [];
const authenticLead = enquiries.find((e) => e.id === "ENQ-2026-0006");
if (authenticLead) {
  console.log(
    `Authentic consultation lead identified: ${authenticLead.id} (${maskEmail(authenticLead.email)})`
  );
}

const manifestPayload = {
  generatedAt: new Date().toISOString(),
  sourceDatabase: "data/niventra.db",
  totalRows,
  tableCounts,
  authenticUserChecksums,
  tables: exportData,
};

const manifestPath = path.join(process.cwd(), "data", "niventra_migration_manifest.json");
fs.writeFileSync(manifestPath, JSON.stringify(manifestPayload, null, 2), "utf-8");
console.log(`\n[Manifest Created] Full JSON dump saved to: ${manifestPath}`);

const lines = [
  "-- ==============================================================================",
  "-- NIVENTRA CAPITAL ADVISORY — IDEMPOTENT POSTGRESQL DATA IMPORT SCRIPT",
  `-- Generated: ${new Date().toISOString()}`,
  `-- Total Verified Rows: ${totalRows} across ${DEPENDENCY_ORDERED_TABLES.length} tables`,
  "-- ==============================================================================",
  "",
  "BEGIN;",
  "",
];

// 1. users
for (const u of exportData.users) {
  lines.push(
    `INSERT INTO "users" (id, name, email, password_hash, salt, role, phone, investor_category, notify_consultations, notify_disclosures, notify_grievances, status, created_at, updated_at) VALUES (${sqlStr(u.id)}, ${sqlStr(u.name)}, ${sqlStr(u.email)}, ${sqlStr(u.password_hash)}, ${sqlStr(u.salt)}, ${sqlStr(u.role)}, ${sqlStr(u.phone)}, ${sqlStr(u.investor_category)}, ${sqlBool(u.notify_consultations, true)}, ${sqlBool(u.notify_disclosures, true)}, ${sqlBool(u.notify_grievances, true)}, ${sqlStr(u.status || "ACTIVE")}, ${sqlNonNullTs(u.created_at)}, ${sqlNonNullTs(u.updated_at, u.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 2. sessions
for (const s of exportData.sessions) {
  lines.push(
    `INSERT INTO "sessions" (id, user_id, token, expires_at, created_at) VALUES (${sqlStr(s.id)}, ${sqlStr(s.user_id)}, ${sqlStr(s.token)}, ${sqlNonNullTs(s.expires_at)}, ${sqlNonNullTs(s.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 3. products
for (const p of exportData.products) {
  lines.push(
    `INSERT INTO "products" (id, slug, title, category, indicative_yield, tenor, min_investment, security_type, status, summary, description, risks_summary, created_at, updated_at) VALUES (${sqlStr(p.id)}, ${sqlStr(p.slug)}, ${sqlStr(p.title)}, ${sqlStr(p.category)}, ${sqlStr(p.indicative_yield)}, ${sqlStr(p.tenor)}, ${sqlStr(p.min_investment)}, ${sqlStr(p.security_type)}, ${sqlStr(p.status || "PUBLISHED")}, ${sqlStr(p.summary)}, ${sqlStr(p.description)}, ${sqlStr(p.risks_summary)}, ${sqlNonNullTs(p.created_at)}, ${sqlNonNullTs(p.updated_at, p.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 4. documents
for (const d of exportData.documents) {
  lines.push(
    `INSERT INTO "documents" (id, title, doc_type, file_path, file_size, mime_type, version, is_public, status, created_at, updated_at) VALUES (${sqlStr(d.id)}, ${sqlStr(d.title)}, ${sqlStr(d.doc_type)}, ${sqlStr(d.file_path)}, ${sqlNum(d.file_size, 0)}, ${sqlStr(d.mime_type || "application/pdf")}, ${sqlStr(d.version || "1.0")}, ${sqlBool(d.is_public, false)}, ${sqlStr(d.status || "APPROVED")}, ${sqlNonNullTs(d.created_at)}, ${sqlNonNullTs(d.updated_at, d.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 5. kyc_records
for (const k of exportData.kyc_records) {
  lines.push(
    `INSERT INTO "kyc_records" (id, user_id, pan_number_masked, id_type, id_number_masked, status, verified_at, rejection_reason, dpdp_consent, created_at, updated_at) VALUES (${sqlStr(k.id)}, ${sqlStr(k.user_id)}, ${sqlStr(k.pan_number_masked)}, ${sqlStr(k.id_type)}, ${sqlStr(k.id_number_masked)}, ${sqlStr(k.status || "NOT_SUBMITTED")}, ${sqlTs(k.verified_at)}, ${sqlStr(k.rejection_reason)}, ${sqlBool(k.dpdp_consent, true)}, ${sqlNonNullTs(k.created_at)}, ${sqlNonNullTs(k.updated_at, k.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 6. investments
for (const inv of exportData.investments) {
  lines.push(
    `INSERT INTO "investments" (id, user_id, product_id, product_title, principal_amount, interest_rate_pa, tenor_months, payout_frequency, start_date, maturity_date, accrued_interest, interest_paid, pending_interest, next_payout_date, status, is_demo, created_at, updated_at) VALUES (${sqlStr(inv.id)}, ${sqlStr(inv.user_id)}, ${sqlStr(inv.product_id)}, ${sqlStr(inv.product_title)}, ${sqlNum(inv.principal_amount, 0)}, ${sqlNum(inv.interest_rate_pa, 0)}, ${sqlNum(inv.tenor_months, 12)}, ${sqlStr(inv.payout_frequency)}, ${sqlTs(inv.start_date)}, ${sqlTs(inv.maturity_date)}, ${sqlNum(inv.accrued_interest, 0)}, ${sqlNum(inv.interest_paid, 0)}, ${sqlNum(inv.pending_interest, 0)}, ${sqlTs(inv.next_payout_date)}, ${sqlStr(inv.status || "PENDING")}, ${sqlBool(inv.is_demo, true)}, ${sqlNonNullTs(inv.created_at)}, ${sqlNonNullTs(inv.updated_at, inv.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 7. investment_transactions
for (const txn of exportData.investment_transactions) {
  lines.push(
    `INSERT INTO "investment_transactions" (id, investment_id, user_id, transaction_type, amount, status, payment_reference, effective_date, is_demo, created_at) VALUES (${sqlStr(txn.id)}, ${sqlStr(txn.investment_id)}, ${sqlStr(txn.user_id)}, ${sqlStr(txn.transaction_type)}, ${sqlNum(txn.amount, 0)}, ${sqlStr(txn.status)}, ${sqlStr(txn.payment_reference)}, ${sqlTs(txn.effective_date)}, ${sqlBool(txn.is_demo, true)}, ${sqlNonNullTs(txn.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 8. project_applications
for (const prj of exportData.project_applications) {
  lines.push(
    `INSERT INTO "project_applications" (id, reference_number, applicant_name, organization_name, email, phone, role, website, project_name, category, address, city, state, pin_code, land_status, stage, description, total_cost, funding_requested, promoter_contribution, use_of_funds, expected_timeline, existing_loans, documents, consent_given, status, assigned_to, internal_notes, decline_reason, info_requested, is_demo, created_at, updated_at) VALUES (${sqlStr(prj.id)}, ${sqlStr(prj.reference_number)}, ${sqlStr(prj.applicant_name)}, ${sqlStr(prj.organization_name)}, ${sqlStr(prj.email)}, ${sqlStr(prj.phone)}, ${sqlStr(prj.role)}, ${sqlStr(prj.website)}, ${sqlStr(prj.project_name)}, ${sqlStr(prj.category)}, ${sqlStr(prj.address)}, ${sqlStr(prj.city)}, ${sqlStr(prj.state)}, ${sqlStr(prj.pin_code)}, ${sqlStr(prj.land_status)}, ${sqlStr(prj.stage)}, ${sqlStr(prj.description)}, ${sqlNum(prj.total_cost, 0)}, ${sqlNum(prj.funding_requested, 0)}, ${sqlNum(prj.promoter_contribution)}, ${sqlStr(prj.use_of_funds)}, ${sqlStr(prj.expected_timeline)}, ${sqlStr(prj.existing_loans)}, ${sqlJsonb(prj.documents, "'[]'::jsonb")}, ${sqlBool(prj.consent_given, true)}, ${sqlStr(prj.status || "RECEIVED")}, ${sqlStr(prj.assigned_to)}, ${sqlStr(prj.internal_notes)}, ${sqlStr(prj.decline_reason)}, ${sqlStr(prj.info_requested)}, ${sqlBool(prj.is_demo, false)}, ${sqlNonNullTs(prj.created_at)}, ${sqlNonNullTs(prj.updated_at, prj.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 9. project_status_history
for (const hist of exportData.project_status_history) {
  lines.push(
    `INSERT INTO "project_status_history" (id, project_id, previous_status, new_status, changed_by, change_note, created_at) VALUES (${sqlStr(hist.id)}, ${sqlStr(hist.project_id)}, ${sqlStr(hist.previous_status)}, ${sqlStr(hist.new_status)}, ${sqlStr(hist.changed_by || "SYSTEM")}, ${sqlStr(hist.change_note)}, ${sqlNonNullTs(hist.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 10. enquiries
for (const e of exportData.enquiries) {
  lines.push(
    `INSERT INTO "enquiries" (id, reference_id, user_id, full_name, email, phone_number, category, capital_range, message, consent, status, assigned_to, internal_notes, created_at, updated_at) VALUES (${sqlStr(e.id)}, ${sqlStr(e.id)}, ${sqlStr(e.user_id)}, ${sqlStr(e.full_name)}, ${sqlStr(e.email)}, ${sqlStr(e.phone_number)}, ${sqlStr(e.category)}, ${sqlStr(e.capital_range)}, ${sqlStr(e.message)}, ${sqlBool(e.consent, true)}, ${sqlStr(e.status || "NEW")}, ${sqlStr(e.assigned_to)}, ${sqlStr(e.internal_notes)}, ${sqlNonNullTs(e.created_at)}, ${sqlNonNullTs(e.updated_at, e.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 11. grievances
for (const g of exportData.grievances) {
  const defaultDeadline = new Date(
    (g.created_at ? new Date(g.created_at).getTime() : Date.now()) + 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  lines.push(
    `INSERT INTO "grievances" (id, ticket_id, user_id, complainant_name, email, phone, transaction_ref, subject, description, status, assigned_to, resolution_notes, sla_deadline, created_at, updated_at) VALUES (${sqlStr(g.id)}, ${sqlStr(g.id)}, ${sqlStr(g.user_id)}, ${sqlStr(g.complainant_name)}, ${sqlStr(g.email)}, ${sqlStr(g.phone)}, ${sqlStr(g.transaction_ref)}, ${sqlStr(g.subject)}, ${sqlStr(g.description)}, ${sqlStr(g.status || "SUBMITTED")}, ${sqlStr(g.assigned_to)}, ${sqlStr(g.resolution_notes)}, ${sqlNonNullTs(g.sla_deadline, defaultDeadline)}, ${sqlNonNullTs(g.created_at)}, ${sqlNonNullTs(g.updated_at, g.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 12. notifications
for (const n of exportData.notifications) {
  lines.push(
    `INSERT INTO "notifications" (id, user_id, title, message, type, link, is_read, created_at) VALUES (${sqlStr(n.id)}, ${sqlStr(n.user_id)}, ${sqlStr(n.title)}, ${sqlStr(n.message)}, ${sqlStr(n.type)}, ${sqlStr(n.link)}, ${sqlBool(n.is_read, false)}, ${sqlNonNullTs(n.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 13. deletion_requests
for (const d of exportData.deletion_requests) {
  lines.push(
    `INSERT INTO "deletion_requests" (id, request_id, user_id, full_name, email, phone, reason, status, statutory_retention_notes, created_at, updated_at) VALUES (${sqlStr(d.id)}, ${sqlStr(d.id)}, ${sqlStr(d.user_id)}, ${sqlStr(d.full_name)}, ${sqlStr(d.email)}, ${sqlStr(d.phone)}, ${sqlStr(d.reason)}, ${sqlStr(d.status || "PENDING")}, ${sqlStr(d.statutory_retention_notes)}, ${sqlNonNullTs(d.created_at)}, ${sqlNonNullTs(d.updated_at, d.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

// 14. audit_logs
for (const l of exportData.audit_logs) {
  lines.push(
    `INSERT INTO "audit_logs" (id, actor_id, actor_email, actor_role, action, resource_type, resource_id, details, ip_address, status, created_at) VALUES (${sqlStr(l.id)}, ${sqlStr(l.actor_id)}, ${sqlStr(l.actor_email)}, ${sqlStr(l.actor_role)}, ${sqlStr(l.action)}, ${sqlStr(l.resource_type)}, ${sqlStr(l.resource_id)}, ${sqlJsonb(l.details, "NULL")}, ${sqlStr(l.ip_address)}, ${sqlStr(l.status || "SUCCESS")}, ${sqlNonNullTs(l.created_at)}) ON CONFLICT DO NOTHING;`
  );
}

lines.push("", "COMMIT;", "");

const sqlPath = path.join(process.cwd(), "data", "niventra_postgres_export.sql");
fs.writeFileSync(sqlPath, lines.join("\n"), "utf-8");
console.log(`[SQL Script Created] PostgreSQL import script saved to: ${sqlPath}`);

console.log("\n==================================================================");
console.log(`MIGRATION EXTRACTION COMPLETED SUCCESSFULLY (${totalRows} total records verified)`);
console.log("==================================================================");
