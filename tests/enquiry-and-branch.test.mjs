import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PUBLISHED_BRANCHES, filterBranches, getStateCounts } from "../src/lib/branches/data.ts";
import { LEGACY_UNVERIFIED_BRANCHES } from "../src/lib/branches/legacy-unverified.ts";

const rootDir = process.cwd();

test("Branch Architecture — Published Dataset Integrity", () => {
  assert.ok(Array.isArray(PUBLISHED_BRANCHES), "PUBLISHED_BRANCHES must be an array");
  assert.ok(PUBLISHED_BRANCHES.length >= 1, "Must contain at least the verified Corporate Head Office");

  const headOffice = PUBLISHED_BRANCHES.find((b) => b.isHeadOffice);
  assert.ok(headOffice, "Must designate an explicit Corporate Head Office");
  assert.equal(headOffice.city, "Gwalior");
  assert.equal(headOffice.status, "VERIFIED");
  assert.ok(headOffice.address.includes("Patel Nagar City Centre"));
  assert.equal(headOffice.pinCode, "474001");
});

test("Branch Architecture — Isolated Legacy Unverified Dataset", () => {
  assert.ok(Array.isArray(LEGACY_UNVERIFIED_BRANCHES), "LEGACY_UNVERIFIED_BRANCHES must be an array");
  assert.equal(LEGACY_UNVERIFIED_BRANCHES.length, 24, "Must preserve all 24 legacy entries for audit reconciliation");

  // Verify that NONE of the legacy regional entries are improperly marked as VERIFIED
  for (const branch of LEGACY_UNVERIFIED_BRANCHES) {
    assert.notEqual(branch.status, "VERIFIED", `Branch ${branch.city} must not be marked VERIFIED without lease documentation`);
  }

  // Verify Delhi address encoding is clean and does not contain mojibake 'â€¢'
  const delhiEntry = LEGACY_UNVERIFIED_BRANCHES.find((b) => b.city === "Delhi");
  assert.ok(delhiEntry, "Legacy entries must contain Delhi");
  assert.ok(!delhiEntry.address.includes("â€¢"), "Delhi address must not contain UTF-8 mojibake â€¢");
  assert.equal(delhiEntry.status, "PENDING_CONFIRMATION");
});

test("Branch Directory — Search & Filter Functionality", () => {
  // 1. Search by City
  const gwaliorResults = filterBranches(PUBLISHED_BRANCHES, "gwalior", "ALL");
  assert.equal(gwaliorResults.length, 1);
  assert.equal(gwaliorResults[0].city, "Gwalior");

  // 2. Search by PIN Code
  const pinResults = filterBranches(PUBLISHED_BRANCHES, "474001", "ALL");
  assert.equal(pinResults.length, 1);
  assert.equal(pinResults[0].city, "Gwalior");

  // 3. Filter by State
  const mpResults = filterBranches(PUBLISHED_BRANCHES, "", "Madhya Pradesh");
  assert.ok(mpResults.every((b) => b.state === "Madhya Pradesh"));

  // 4. Non-matching query returns empty
  const emptyResults = filterBranches(PUBLISHED_BRANCHES, "AtlantisUnknownCity", "ALL");
  assert.equal(emptyResults.length, 0);

  // 5. State counts reflect published records
  const counts = getStateCounts(PUBLISHED_BRANCHES);
  const mpCount = counts.find((c) => c.state === "Madhya Pradesh");
  assert.ok(mpCount && mpCount.count >= 1);
});

test("Database Architecture — Persistent Adapter Contract", () => {
  const adapterFilePath = path.join(rootDir, "src", "lib", "database", "adapter.ts");
  assert.ok(fs.existsSync(adapterFilePath), "Database adapter interface file must exist");

  const content = fs.readFileSync(adapterFilePath, "utf-8");
  assert.ok(content.includes("export interface DatabaseAdapter"), "Must export DatabaseAdapter interface");
  assert.ok(content.includes("insertEnquiry"), "Must define insertEnquiry method");
  assert.ok(content.includes("findRecentDuplicate"), "Must define findRecentDuplicate method for idempotency/spam defense");
  assert.ok(content.includes("getEnquiryCount"), "Must define getEnquiryCount for reference numbering");
  assert.ok(content.includes("getEnquiries"), "Must define getEnquiries for admin queries");
});

test("Enquiry Notification & Security — Flow & Defensive Controls", () => {
  const routeFilePath = path.join(rootDir, "src", "app", "api", "enquiries", "route.ts");
  assert.ok(fs.existsSync(routeFilePath), "Enquiries API route must exist");

  const routeContent = fs.readFileSync(routeFilePath, "utf-8");
  
  // 1. Honeypot bot protection
  assert.ok(routeContent.includes("website_hp"), "Enquiry API must check website_hp honeypot field");

  // 2. Duplicate submission throttling (60s window)
  assert.ok(routeContent.includes("Enquiry already recorded"), "Enquiry API must deduplicate submissions within 60s window");

  // 3. Lead notification dispatch for unauthenticated public leads
  assert.ok(routeContent.includes("dispatchLeadNotification"), "Public submission must invoke dispatchLeadNotification");

  // 4. Notifications module PII safety
  const notifFilePath = path.join(rootDir, "src", "lib", "notifications.ts");
  assert.ok(fs.existsSync(notifFilePath), "Notifications library must exist");
  const notifContent = fs.readFileSync(notifFilePath, "utf-8");
  assert.ok(notifContent.includes("maskEmail"), "Notifications module must mask email PII");
  assert.ok(notifContent.includes("MOCK_SINK"), "Must have safe offline MOCK_SINK mode");
});
