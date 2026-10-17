import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const STORAGE_DOCS = path.join(process.cwd(), "storage", "documents");
if (!fs.existsSync(STORAGE_DOCS)) {
  fs.mkdirSync(STORAGE_DOCS, { recursive: true });
}

// Create sample document files so download endpoints actually stream authentic files
const sampleDocs = [
  { name: "doc_corporate_profile.pdf", content: "%PDF-1.4\n% Niventra Capital Advisory India - Corporate Profile & Standards\n1 0 obj\n<< /Title (Corporate Profile) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF" },
  { name: "doc_pas4_sample.pdf", content: "%PDF-1.4\n% Niventra Capital Advisory - Reference PAS-4 Structure\n1 0 obj\n<< /Title (PAS-4 Offer Letter Reference) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF" },
  { name: "doc_termsheet_sample.pdf", content: "%PDF-1.4\n% Niventra Capital Advisory - Sample Term Sheet & Covenants\n1 0 obj\n<< /Title (Debenture Term Sheet Sample) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF" }
];

for (const doc of sampleDocs) {
  const p = path.join(STORAGE_DOCS, doc.name);
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, doc.content);
  }
}

const db = new DatabaseSync(path.join(DATA_DIR, "niventra.db"));
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('PUBLIC', 'INVESTOR', 'STAFF', 'ADMIN')),
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'SUSPENDED', 'PENDING_DELETION')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    category TEXT NOT NULL,
    capital_range TEXT NOT NULL,
    message TEXT,
    consent INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED', 'CLOSED')),
    assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
    internal_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS grievances (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    complainant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    transaction_ref TEXT,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'SUBMITTED' CHECK(status IN ('SUBMITTED', 'ACKNOWLEDGED', 'UNDER_INVESTIGATION', 'RESOLVED', 'ESCALATED')),
    assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
    resolution_notes TEXT,
    sla_deadline DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('DEBENTURE', 'REAL_ESTATE_DEBT', 'STRUCTURED_FINANCE')),
    indicative_yield TEXT NOT NULL,
    tenor TEXT NOT NULL,
    min_investment TEXT NOT NULL,
    security_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK(status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    risks_summary TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    doc_type TEXT NOT NULL CHECK(doc_type IN ('OFFER_DOC', 'TERM_SHEET', 'COMPLIANCE', 'POLICY', 'DUE_DILIGENCE')),
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    is_public INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'APPROVED' CHECK(status IN ('PENDING', 'APPROVED', 'ARCHIVED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('ENQUIRY', 'GRIEVANCE', 'SECURITY', 'SYSTEM', 'DOCUMENT')),
    link TEXT,
    is_read INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT,
    actor_email TEXT,
    actor_role TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS deletion_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'VERIFIED', 'COMPLETED', 'REJECTED')),
    statutory_retention_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return { hash: derived.toString("hex"), salt };
}

// 1. Seed Users (explicit development-only bootstrap with non-documented dynamic credentials)
if (process.env.NODE_ENV === "production") {
  console.error("[Seed Error] Seeding development accounts is prohibited in production.");
  process.exit(1);
}

const adminPassword = process.env.DEV_ADMIN_PASSWORD || crypto.randomBytes(16).toString("base64url");
const staffPassword = process.env.DEV_STAFF_PASSWORD || crypto.randomBytes(16).toString("base64url");
const investorPassword = process.env.DEV_INVESTOR_PASSWORD || crypto.randomBytes(16).toString("base64url");

const users = [
  {
    id: "usr_admin_dev",
    name: "System Administrator",
    email: "admin@niventra.local",
    password: adminPassword,
    role: "ADMIN",
    phone: "+91 98765 00001",
  },
  {
    id: "usr_staff_dev",
    name: "Advisory Desk Operator",
    email: "staff@niventra.local",
    password: staffPassword,
    role: "STAFF",
    phone: "+91 98765 00002",
  },
  {
    id: "usr_investor_dev",
    name: "Vikramaditya Sharma",
    email: "investor@example.com",
    password: investorPassword,
    role: "INVESTOR",
    phone: "+91 98765 00003",
  },
];

for (const u of users) {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(u.email);
  if (!existing) {
    const { hash, salt } = hashPassword(u.password);
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(u.id, u.name, u.email, hash, salt, u.role, u.phone);
    console.log(`[Seed] User created: ${u.email} (${u.role})`);
  }
}

// 2. Seed Products
const products = [
  {
    id: "prod_ncd_tranche_a",
    slug: "secured-ncd-tranche-a",
    title: "[ILLUSTRATIVE MODEL] Secured Real Estate Debenture Tranche A",
    category: "DEBENTURE",
    indicativeYield: "14.5% p.a.*",
    tenor: "36 Months",
    minInvestment: "₹10,00,000",
    securityType: "First Pari-Passu Charge on Commercial Assets (ROC CHG-9)",
    summary: "[DEVELOPMENT FIXTURE] Illustrative debenture structure for architecture and schema verification. Not an active financial offering or investment solicitation.",
    description: "[DEVELOPMENT FIXTURE] This record is an illustrative data model used exclusively for development testing and schema verification. Genuine debentures require approved Form PAS-4 documentation and Board authorization.",
    risksSummary: "[TEST RECORD] Illustrative model only. No genuine financial transactions or investment allocations can be executed against this record.",
  },
  {
    id: "prod_redevelopment_series_1",
    slug: "redevelopment-debt-series-1",
    title: "[ILLUSTRATIVE MODEL] Urban Redevelopment Debt Series 1",
    category: "REAL_ESTATE_DEBT",
    indicativeYield: "15.0% p.a.*",
    tenor: "24 Months",
    minInvestment: "₹25,00,000",
    securityType: "Escrow Cash-Flow Waterfall + Mortgage Charge",
    summary: "[DEVELOPMENT FIXTURE] Illustrative project finance debt tranche for testing purposes.",
    description: "[DEVELOPMENT FIXTURE] Sample redevelopment debt structure for development testing.",
    risksSummary: "[TEST RECORD] Illustrative model only. No genuine financial transactions can be executed against this record.",
  },
];

for (const p of products) {
  const existing = db.prepare("SELECT id FROM products WHERE slug = ?").get(p.slug);
  if (!existing) {
    db.prepare(`
      INSERT INTO products (
        id, slug, title, category, indicative_yield, tenor, min_investment,
        security_type, status, summary, description, risks_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?)
    `).run(
      p.id, p.slug, p.title, p.category, p.indicativeYield, p.tenor,
      p.minInvestment, p.securityType, p.summary, p.description, p.risksSummary
    );
    console.log(`[Seed] Product created: ${p.title}`);
  }
}

// 3. Seed Documents
const documents = [
  {
    id: "doc_corporate_profile",
    title: "[SAMPLE TEMPLATE] Niventra Corporate Profile & Advisory Standards",
    docType: "POLICY",
    filePath: "storage/documents/doc_corporate_profile.pdf",
    fileSize: 412000,
    mimeType: "application/pdf",
    isPublic: 0,
  },
  {
    id: "doc_pas4_sample",
    title: "[SAMPLE TEMPLATE] Private Placement Offer Letter (PAS-4) Reference Format",
    docType: "OFFER_DOC",
    filePath: "storage/documents/doc_pas4_sample.pdf",
    fileSize: 854000,
    mimeType: "application/pdf",
    isPublic: 0,
  },
  {
    id: "doc_termsheet_sample",
    title: "[SAMPLE TEMPLATE] Sample Debenture Term Sheet & Security Covenants",
    docType: "TERM_SHEET",
    filePath: "storage/documents/doc_termsheet_sample.pdf",
    fileSize: 320000,
    mimeType: "application/pdf",
    isPublic: 0,
  },
];

for (const d of documents) {
  const existing = db.prepare("SELECT id FROM documents WHERE id = ?").get(d.id);
  if (!existing) {
    db.prepare(`
      INSERT INTO documents (
        id, title, doc_type, file_path, file_size, mime_type, version, is_public, status
      ) VALUES (?, ?, ?, ?, ?, ?, '1.0', ?, 'PENDING')
    `).run(d.id, d.title, d.docType, d.filePath, d.fileSize, d.mimeType, d.isPublic);
    console.log(`[Seed] Document created: ${d.title}`);
  }
}

// 4. Seed Initial Sample Enquiry
const sampleEnquiry = db.prepare("SELECT id FROM enquiries WHERE id = 'ENQ-2026-0001'").get();
if (!sampleEnquiry) {
  db.prepare(`
    INSERT INTO enquiries (
      id, user_id, full_name, email, phone_number, category,
      capital_range, message, consent, status, internal_notes
    ) VALUES (
      'ENQ-2026-0001', 'usr_investor_dev', 'Vikramaditya Sharma', 'investor@example.com',
      '+91 98765 00003', 'Capital Provider / Investor', '₹25 Lakh – ₹1 Crore',
      'Interested in learning more about secured NCD Tranche A coupon frequencies and ROC charge creation.',
      1, 'IN_REVIEW', 'Preliminary suitability verified. Follow-up consultation scheduled.'
    )
  `).run();
  console.log("[Seed] Sample enquiry created: ENQ-2026-0001");
}

// 5. Seed Initial Grievance Ticket
const sampleGrievance = db.prepare("SELECT id FROM grievances WHERE id = 'GRV-2026-0001'").get();
if (!sampleGrievance) {
  db.prepare(`
    INSERT INTO grievances (
      id, user_id, complainant_name, email, phone, transaction_ref,
      subject, description, status, resolution_notes, sla_deadline
    ) VALUES (
      'GRV-2026-0001', 'usr_investor_dev', 'Vikramaditya Sharma', 'investor@example.com',
      '+91 98765 00003', 'ENQ-2026-0001', 'Clarification on ROC charge timeline',
      'Requesting written confirmation of the ROC Form CHG-9 filing timeframe following allocation.',
      'ACKNOWLEDGED', 'Assigned to Advisory Compliance Desk for technical response.',
      datetime('now', '+30 days')
    )
  `).run();
  console.log("[Seed] Sample grievance created: GRV-2026-0001");
}

// 6. Seed Sample Notifications
const notifCount = db.prepare("SELECT count(*) as count FROM notifications").get().count;
if (notifCount === 0) {
  db.prepare(`
    INSERT INTO notifications (id, user_id, title, message, type, link, is_read)
    VALUES 
    ('notif_1', 'usr_investor_dev', 'Enquiry Under Review', 'Your enquiry ENQ-2026-0001 is currently under review by our senior desk.', 'ENQUIRY', '/dashboard/enquiries', 0),
    ('notif_2', 'usr_investor_dev', 'Grievance Acknowledged', 'Grievance GRV-2026-0001 has been logged and assigned to compliance.', 'GRIEVANCE', '/dashboard', 1)
  `).run();
  console.log("[Seed] Sample notifications created for investor.");
}

console.log("Database seeded successfully with local institutional testing data.");
