/**
 * Niventra Capital Advisory — Executive Presentation Demo Seeder
 * 
 * Safety constraints:
 * - NEVER executes in production environments (checks NODE_ENV === 'production').
 * - All generated investments, transactions, and balances are explicitly marked `is_demo = 1`.
 * - Provides reproducible, documented accounts for tomorrow's management presentation.
 */

import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";

if (process.env.NODE_ENV === "production") {
  console.error("FATAL: Cannot seed demo data in production environment.");
  process.exit(1);
}

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "niventra.db");
const db = new DatabaseSync(dbPath);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return { hash: derived.toString("hex"), salt };
}

console.log("Seeding isolated Presentation Demo fixtures...");

// 1. Seed or update demo accounts with stable presentation credentials
const DEMO_USERS = [
  {
    id: "usr_admin_dev",
    name: "System Administrator",
    email: "admin@niventra.local",
    password: "DemoAdmin2026!#",
    role: "ADMIN",
    phone: "+91 98765 00001",
  },
  {
    id: "usr_staff_dev",
    name: "Advisory Desk Operator",
    email: "staff@niventra.local",
    password: "DemoStaff2026!#",
    role: "STAFF",
    phone: "+91 98765 00002",
  },
  {
    id: "usr_investor_dev",
    name: "Vikramaditya Sharma",
    email: "investor@example.com",
    password: "DemoInvestor2026!#",
    role: "INVESTOR",
    phone: "+91 98765 00003",
  },
];

for (const u of DEMO_USERS) {
  const { hash, salt } = hashPassword(u.password);
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(u.email);
  if (existing) {
    db.prepare(`
      UPDATE users
      SET password_hash = ?, salt = ?, role = ?, name = ?, status = 'ACTIVE'
      WHERE email = ?
    `).run(hash, salt, u.role, u.name, u.email);
  } else {
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, salt, role, phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(u.id, u.name, u.email, hash, salt, u.role, u.phone);
  }
}

// 2. Seed KYC record for investor@example.com
db.prepare("DELETE FROM kyc_records WHERE user_id = 'usr_investor_dev'").run();
db.prepare(`
  INSERT INTO kyc_records (
    id, user_id, pan_number_masked, id_type, id_number_masked, status, verified_at, dpdp_consent
  ) VALUES (
    'kyc_demo_vikram', 'usr_investor_dev', 'AAAPN*****1F', 'PAN', '********4829', 'VERIFIED',
    '2026-01-10T10:00:00Z', 1
  )
`).run();

// 3. Clean and seed Demo Investments for Vikramaditya Sharma (usr_investor_dev)
db.prepare("DELETE FROM investments WHERE user_id = 'usr_investor_dev'").run();
db.prepare("DELETE FROM investment_transactions WHERE user_id = 'usr_investor_dev'").run();

const DEMO_INVESTMENTS = [
  {
    id: "INV-DEMO-001",
    userId: "usr_investor_dev",
    productId: "prod_ncd_tranche_a",
    productTitle: "[DEMO] Secured Real Estate Debenture Tranche A",
    principalAmount: 1500000,
    interestRatePa: 14.5,
    tenorMonths: 36,
    payoutFrequency: "QUARTERLY",
    startDate: "2026-01-15",
    maturityDate: "2029-01-15",
    accruedInterest: 163125,
    interestPaid: 108750,
    pendingInterest: 54375,
    nextPayoutDate: "2026-10-15",
    status: "ACTIVE",
    isDemo: 1,
  },
  {
    id: "INV-DEMO-002",
    userId: "usr_investor_dev",
    productId: "prod_redevelopment_series_1",
    productTitle: "[DEMO] Urban Redevelopment Debt Series 1",
    principalAmount: 1000000,
    interestRatePa: 15.0,
    tenorMonths: 24,
    payoutFrequency: "MONTHLY",
    startDate: "2026-04-01",
    maturityDate: "2028-04-01",
    accruedInterest: 87500,
    interestPaid: 75000,
    pendingInterest: 12500,
    nextPayoutDate: "2026-11-01",
    status: "ACTIVE",
    isDemo: 1,
  },
];

const insertInv = db.prepare(`
  INSERT INTO investments (
    id, user_id, product_id, product_title, principal_amount, interest_rate_pa,
    tenor_months, payout_frequency, start_date, maturity_date, accrued_interest,
    interest_paid, pending_interest, next_payout_date, status, is_demo
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const inv of DEMO_INVESTMENTS) {
  insertInv.run(
    inv.id, inv.userId, inv.productId, inv.productTitle, inv.principalAmount,
    inv.interestRatePa, inv.tenorMonths, inv.payoutFrequency, inv.startDate,
    inv.maturityDate, inv.accruedInterest, inv.interestPaid, inv.pendingInterest,
    inv.nextPayoutDate, inv.status, inv.isDemo
  );
}

// 4. Seed Ledger Transactions
const DEMO_TXNS = [
  {
    id: "TXN-DEMO-101",
    investmentId: "INV-DEMO-001",
    userId: "usr_investor_dev",
    type: "PRINCIPAL_ALLOCATION",
    amount: 1500000,
    status: "PROCESSED",
    ref: "NEFT/NIV/ALLOC/2026011501",
    date: "2026-01-15",
  },
  {
    id: "TXN-DEMO-102",
    investmentId: "INV-DEMO-001",
    userId: "usr_investor_dev",
    type: "INTEREST_PAYOUT",
    amount: 54375,
    status: "PROCESSED",
    ref: "CMS/NIV/CPN/2026041501",
    date: "2026-04-15",
  },
  {
    id: "TXN-DEMO-103",
    investmentId: "INV-DEMO-001",
    userId: "usr_investor_dev",
    type: "INTEREST_PAYOUT",
    amount: 54375,
    status: "PROCESSED",
    ref: "CMS/NIV/CPN/2026071501",
    date: "2026-07-15",
  },
  {
    id: "TXN-DEMO-201",
    investmentId: "INV-DEMO-002",
    userId: "usr_investor_dev",
    type: "PRINCIPAL_ALLOCATION",
    amount: 1000000,
    status: "PROCESSED",
    ref: "RTGS/NIV/ALLOC/2026040102",
    date: "2026-04-01",
  },
  {
    id: "TXN-DEMO-202",
    investmentId: "INV-DEMO-002",
    userId: "usr_investor_dev",
    type: "INTEREST_PAYOUT",
    amount: 12500,
    status: "PROCESSED",
    ref: "CMS/NIV/CPN/2026080102",
    date: "2026-08-01",
  },
  {
    id: "TXN-DEMO-203",
    investmentId: "INV-DEMO-002",
    userId: "usr_investor_dev",
    type: "INTEREST_PAYOUT",
    amount: 12500,
    status: "PROCESSED",
    ref: "CMS/NIV/CPN/2026090102",
    date: "2026-09-01",
  },
];

const insertTxn = db.prepare(`
  INSERT INTO investment_transactions (
    id, investment_id, user_id, transaction_type, amount, status, payment_reference, effective_date, is_demo
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

for (const tx of DEMO_TXNS) {
  insertTxn.run(tx.id, tx.investmentId, tx.userId, tx.type, tx.amount, tx.status, tx.ref, tx.date);
}

// 5. Seed sample demo enquiries with varied lifecycle statuses
const DEMO_ENQUIRIES = [
  {
    id: "ENQ-2026-DEMO01",
    userId: "usr_investor_dev",
    name: "Vikramaditya Sharma",
    email: "investor@example.com",
    phone: "+91 98765 00003",
    category: "Capital Provider / Investor",
    range: "₹25 Lakh – ₹50 Lakh",
    message: "Interested in evaluating upcoming Secured Debenture tranches with quarterly liquidity option.",
    status: "QUALIFIED",
    notes: "High net worth individual verified. PAS-4 offer document transmitted via email. In-person discussion scheduled.",
  },
  {
    id: "ENQ-2026-DEMO02",
    userId: null,
    name: "Meera Singhania",
    email: "meera.singhania@corp-holdings.test",
    phone: "+91 98200 11223",
    category: "Corporate Borrower",
    range: "₹5 Crore – ₹10 Crore",
    message: "Seeking mezzanine debt refinancing for commercial redevelopment project in Central Delhi.",
    status: "FOLLOW_UP",
    notes: "Initial term sheet requested. Site inspection scheduled with Delhi Advisory Desk.",
  },
  {
    id: "ENQ-2026-DEMO03",
    userId: null,
    name: "Dr. Rajesh K. Varma",
    email: "rajesh.varma@medicare-trust.test",
    phone: "+91 94250 88990",
    category: "Family Office / Trust",
    range: "₹1 Crore – ₹5 Crore",
    message: "Requested briefing on senior secured yield structures and collateral charge registration timelines.",
    status: "NEW",
    notes: "Submitted via website consultation form. Notification recorded in mock audit sink.",
  },
];

// Migrate enquiries table if needed to support FOLLOW_UP and CONVERTED
try {
  const tableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='enquiries'").get()?.sql || "";
  if (!tableSql.includes("FOLLOW_UP")) {
    db.exec(`
      PRAGMA foreign_keys = OFF;
      CREATE TABLE enquiries_migrated (
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
      INSERT INTO enquiries_migrated SELECT * FROM enquiries;
      DROP TABLE enquiries;
      ALTER TABLE enquiries_migrated RENAME TO enquiries;
      PRAGMA foreign_keys = ON;
    `);
  }
} catch (e) {
  console.log("Migration check notice:", e.message);
}

for (const enq of DEMO_ENQUIRIES) {
  const existingEnq = db.prepare("SELECT id FROM enquiries WHERE id = ?").get(enq.id);
  if (!existingEnq) {
    db.prepare(`
      INSERT INTO enquiries (
        id, user_id, full_name, email, phone_number, category, capital_range,
        message, consent, status, internal_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(enq.id, enq.userId, enq.name, enq.email, enq.phone, enq.category, enq.range, enq.message, enq.status, enq.notes);
  }
}

console.log("Demo fixtures successfully seeded.");
console.log("--------------------------------------------------");
console.log("Repeatable Presentation Credentials:");
console.log("  Investor Account:  investor@example.com / DemoInvestor2026!#");
console.log("  Desk Staff Account: staff@niventra.local  / DemoStaff2026!#");
console.log("  Admin Account:      admin@niventra.local  / DemoAdmin2026!#");
console.log("--------------------------------------------------");
