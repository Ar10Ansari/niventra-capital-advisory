import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "niventra.db");

// Singleton connection
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    // Enable WAL mode for high concurrency & performance
    dbInstance.exec("PRAGMA journal_mode = WAL;");
    dbInstance.exec("PRAGMA foreign_keys = ON;");
    initSchema(dbInstance);
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
      status TEXT NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW', 'IN_REVIEW', 'CONTACTED', 'QUALIFIED', 'CLOSED')),
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
  `);
}

// Ensure database initializes on module load
export const db = getDb();
