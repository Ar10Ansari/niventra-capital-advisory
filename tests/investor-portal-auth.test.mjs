import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const rootDir = process.cwd();
const dbPath = path.join(rootDir, "data", "niventra.db");

test("Investor Portal — Database Schema for Holdings, Transactions & KYC", () => {
  assert.ok(fs.existsSync(dbPath), "Database file data/niventra.db must exist");
  const db = new DatabaseSync(dbPath);

  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map((r) => r.name);
  assert.ok(tables.includes("investments"), "Must define investments table");
  assert.ok(tables.includes("investment_transactions"), "Must define investment_transactions table");
  assert.ok(tables.includes("kyc_records"), "Must define kyc_records table");
});

test("Investor Portal — Cross-Investor Data Isolation & Authorization Architecture", () => {
  const routePath = path.join(rootDir, "src", "app", "api", "investments", "route.ts");
  assert.ok(fs.existsSync(routePath), "Investments API route must exist");

  const routeContent = fs.readFileSync(routePath, "utf-8");

  // Verify cross-investor authorization check is strictly enforced in code
  assert.ok(
    routeContent.includes("user.role === \"INVESTOR\" && targetUserId && targetUserId !== user.id"),
    "Investments route must block regular investors from requesting other user IDs"
  );
  assert.ok(
    routeContent.includes("403"),
    "Unauthorized cross-investor queries must return 403 Forbidden"
  );

  // Verify single investment detail route also enforces ownership
  const singleRoutePath = path.join(rootDir, "src", "app", "api", "investments", "[id]", "route.ts");
  assert.ok(fs.existsSync(singleRoutePath), "Single investment route must exist");
  const singleRouteContent = fs.readFileSync(singleRoutePath, "utf-8");
  assert.ok(
    singleRouteContent.includes("investment.user_id !== user.id && user.role !== \"ADMIN\" && user.role !== \"STAFF\""),
    "Single investment route must block investors from accessing holdings they do not own"
  );
});

test("Investor Portal — Conspicuous Demo Marking & Portfolio Metrics Separation", () => {
  const db = new DatabaseSync(dbPath);

  const demoHoldings = db.prepare("SELECT * FROM investments WHERE is_demo = 1").all();
  assert.ok(demoHoldings.length >= 1, "Must contain seeded demo debenture holdings");

  for (const inv of demoHoldings) {
    // 1. Conspicuous demo naming or is_demo flag
    assert.equal(inv.is_demo, 1, `Holding ${inv.id} must be explicitly marked as demo`);
    assert.ok(inv.product_title.includes("[DEMO]"), `Title for ${inv.id} must contain [DEMO] tag`);

    // 2. Strict accounting separation: Principal, Interest Paid, Pending, Accrued
    assert.ok(typeof inv.principal_amount === "number" && inv.principal_amount > 0, "Principal must be positive number");
    assert.ok(typeof inv.accrued_interest === "number" && inv.accrued_interest >= 0, "Accrued interest must be >= 0");
    assert.ok(typeof inv.interest_paid === "number" && inv.interest_paid >= 0, "Interest paid must be >= 0");
    assert.ok(typeof inv.pending_interest === "number" && inv.pending_interest >= 0, "Pending interest must be >= 0");

    // 3. Fiduciary rule: Contractual coupon rate must fall in approved 12% - 16% p.a. band
    assert.ok(inv.interest_rate_pa >= 12.0 && inv.interest_rate_pa <= 16.0, "Coupon rate must be within 12% - 16% p.a.");
  }
});

test("Investor Portal — Transaction Ledger Integrity", () => {
  const db = new DatabaseSync(dbPath);

  const txns = db.prepare("SELECT * FROM investment_transactions WHERE is_demo = 1").all();
  assert.ok(txns.length >= 2, "Must contain ledger entries for allocations and disbursements");

  const principalAllocations = txns.filter((t) => t.transaction_type === "PRINCIPAL_ALLOCATION");
  const couponDisbursements = txns.filter((t) => t.transaction_type === "INTEREST_PAYOUT");

  assert.ok(principalAllocations.length >= 1, "Must record initial principal allocation transaction");
  assert.ok(couponDisbursements.length >= 1, "Must record periodic interest payout transactions");

  for (const t of txns) {
    assert.ok(t.amount > 0, `Transaction ${t.id} must have positive amount`);
    assert.ok(t.payment_reference.length > 5, `Transaction ${t.id} must have bank UTR / payment reference`);
  }
});

test("KYC Compliance & DPDP Act Masking", () => {
  const db = new DatabaseSync(dbPath);

  const kycRows = db.prepare("SELECT * FROM kyc_records").all();
  assert.ok(kycRows.length >= 1, "Must have sample KYC record");

  for (const k of kycRows) {
    // 1. PAN must be masked and never stored in plaintext in the demo record
    assert.ok(k.pan_number_masked.includes("*"), "PAN identifier must be masked");
    assert.ok(!k.pan_number_masked.includes(" "), "PAN must not contain spaces");
    assert.ok(k.dpdp_consent === 1, "KYC records must record DPDP Act 2023 consent");
  }
});

test("Demo Seeder Production Environment Protection", () => {
  const seederPath = path.join(rootDir, "scripts", "seed-demo.mjs");
  assert.ok(fs.existsSync(seederPath), "seed-demo.mjs must exist");

  const seederContent = fs.readFileSync(seederPath, "utf-8");
  assert.ok(
    seederContent.includes("process.env.NODE_ENV === \"production\""),
    "Seeder script must explicitly guard against execution in production"
  );
  assert.ok(
    seederContent.includes("process.exit(1)"),
    "Seeder script must terminate immediately in production"
  );
});
