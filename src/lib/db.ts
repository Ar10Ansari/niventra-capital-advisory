import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

/**
 * Resolves a resilient, writable database path across environments:
 * 1. Local workspace 'data/' directory (ideal for local development persistence).
 * 2. Operating system /tmp directory (writable in serverless runtimes like AWS Lambda / Vercel: /tmp).
 * 3. In-memory fallback (':memory:') if filesystem writes are restricted.
 */
function resolveDbPath(): string {
  // 1. Try local project 'data' directory
  try {
    const localDataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(localDataDir)) {
      fs.mkdirSync(localDataDir, { recursive: true });
    }
    const probeFile = path.join(localDataDir, ".probe");
    fs.writeFileSync(probeFile, "probe");
    fs.unlinkSync(probeFile);
    return path.join(localDataDir, "niventra.db");
  } catch {
    // Read-only filesystem in container or serverless runtime
  }

  // 2. Try OS temporary directory (/tmp on Vercel/Linux)
  try {
    const tmpDataDir = path.join(os.tmpdir(), "niventra_data");
    if (!fs.existsSync(tmpDataDir)) {
      fs.mkdirSync(tmpDataDir, { recursive: true });
    }
    const probeFile = path.join(tmpDataDir, ".probe");
    fs.writeFileSync(probeFile, "probe");
    fs.unlinkSync(probeFile);
    return path.join(tmpDataDir, "niventra.db");
  } catch {
    // Fallback to in-memory SQLite
    return ":memory:";
  }
}

// Singleton connection
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    const dbPath = resolveDbPath();
    try {
      dbInstance = new DatabaseSync(dbPath);
    } catch {
      dbInstance = new DatabaseSync(":memory:");
    }

    try {
      dbInstance.exec("PRAGMA journal_mode = WAL;");
    } catch {
      // WAL journal mode may not be supported on in-memory or some tmpfs, continue gracefully
    }
    try {
      dbInstance.exec("PRAGMA foreign_keys = ON;");
    } catch {
      // Continue if PRAGMA fails
    }

    initSchema(dbInstance);
    seedDefaultsIfEmpty(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    -- USERS & ROLES
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

    -- SESSIONS
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ENQUIRIES / CRM PIPELINE
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
      status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'CLOSED')),
      assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- GRIEVANCE TICKETS
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

    -- PRODUCT CATALOGUE
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

    -- DOCUMENTS & COMPLIANCE REPOSITORY
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

    -- NOTIFICATIONS
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

    -- AUDIT LOGS (IMMUTABLE)
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

    -- ACCOUNT DELETION & DPDP REQUESTS
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

    -- KYC & INVESTOR VERIFICATION
    CREATE TABLE IF NOT EXISTS kyc_records (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pan_number_masked TEXT,
      id_type TEXT CHECK(id_type IN ('PAN', 'AADHAAR', 'PASSPORT', 'VOTER_ID')),
      id_number_masked TEXT,
      status TEXT NOT NULL DEFAULT 'NOT_SUBMITTED' CHECK(status IN ('NOT_SUBMITTED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED')),
      verified_at DATETIME,
      rejection_reason TEXT,
      dpdp_consent INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- INVESTOR HOLDINGS & DEBENTURE ALLOCATIONS
    CREATE TABLE IF NOT EXISTS investments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
      product_title TEXT NOT NULL,
      principal_amount REAL NOT NULL,
      interest_rate_pa REAL NOT NULL,
      tenor_months INTEGER NOT NULL,
      payout_frequency TEXT NOT NULL CHECK(payout_frequency IN ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'CUMULATIVE')),
      start_date DATE NOT NULL,
      maturity_date DATE NOT NULL,
      accrued_interest REAL NOT NULL DEFAULT 0,
      interest_paid REAL NOT NULL DEFAULT 0,
      pending_interest REAL NOT NULL DEFAULT 0,
      next_payout_date DATE,
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'MATURED', 'CANCELLED')),
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- INVESTMENT TRANSACTIONS & PAYOUT LEDGER
    CREATE TABLE IF NOT EXISTS investment_transactions (
      id TEXT PRIMARY KEY,
      investment_id TEXT NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      transaction_type TEXT NOT NULL CHECK(transaction_type IN ('PRINCIPAL_ALLOCATION', 'INTEREST_PAYOUT', 'TDS_DEDUCTION', 'REDEMPTION')),
      amount REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('SCHEDULED', 'PROCESSED', 'FAILED')),
      payment_reference TEXT,
      effective_date DATE NOT NULL,
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seedDefaultsIfEmpty(db: DatabaseSync) {
  try {
    // Never auto-seed development fixtures in production environments
    if (process.env.NODE_ENV === "production") {
      return;
    }

    // 1. Seed Products if empty (explicitly labelled as non-transactable development test fixtures)
    const productCountRow = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number } | undefined;
    if (!productCountRow || productCountRow.count === 0) {
      const defaultProducts = [
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

      const insertProdStmt = db.prepare(`
        INSERT INTO products (
          id, slug, title, category, indicative_yield, tenor, min_investment,
          security_type, status, summary, description, risks_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?, ?, ?)
      `);

      for (const p of defaultProducts) {
        insertProdStmt.run(
          p.id, p.slug, p.title, p.category, p.indicativeYield, p.tenor,
          p.minInvestment, p.securityType, p.summary, p.description, p.risksSummary
        );
      }
    }

    // 2. Seed Default Documents if empty (explicitly labelled as sample templates)
    const docCountRow = db.prepare("SELECT COUNT(*) as count FROM documents").get() as { count: number } | undefined;
    if (!docCountRow || docCountRow.count === 0) {
      const defaultDocs = [
        {
          id: "doc_corporate_profile",
          title: "[SAMPLE TEMPLATE] Niventra Corporate Profile & Advisory Standards",
          docType: "POLICY",
          filePath: "storage/documents/doc_corporate_profile.pdf",
          fileSize: 412000,
          mimeType: "application/pdf",
          isPublic: 0,
          status: "PENDING",
        },
        {
          id: "doc_pas4_sample",
          title: "[SAMPLE TEMPLATE] Private Placement Offer Letter (PAS-4) Reference Format",
          docType: "OFFER_DOC",
          filePath: "storage/documents/doc_pas4_sample.pdf",
          fileSize: 854000,
          mimeType: "application/pdf",
          isPublic: 0,
          status: "PENDING",
        },
        {
          id: "doc_termsheet_sample",
          title: "[SAMPLE TEMPLATE] Sample Debenture Term Sheet & Security Covenants",
          docType: "TERM_SHEET",
          filePath: "storage/documents/doc_termsheet_sample.pdf",
          fileSize: 320000,
          mimeType: "application/pdf",
          isPublic: 0,
          status: "PENDING",
        },
      ];

      const insertDocStmt = db.prepare(`
        INSERT INTO documents (
          id, title, doc_type, file_path, file_size, mime_type, version, is_public, status
        ) VALUES (?, ?, ?, ?, ?, ?, '1.0', ?, ?)
      `);

      for (const d of defaultDocs) {
        insertDocStmt.run(d.id, d.title, d.docType, d.filePath, d.fileSize, d.mimeType, d.isPublic, d.status);
      }
    }

  } catch (err) {
    console.error("Initial seed check warning:", err);
  }
}

// Ensure database initializes on module load
export const db = getDb();
