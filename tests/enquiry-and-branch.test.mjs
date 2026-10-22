import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PUBLISHED_BRANCHES, filterBranches, getStateCounts } from "../src/lib/branches/data.ts";
import { LEGACY_UNVERIFIED_BRANCHES } from "../src/lib/branches/legacy-unverified.ts";

const rootDir = process.cwd();

test("Branch Architecture — Complete 25-Location Public Dataset Integrity", () => {
  assert.ok(Array.isArray(PUBLISHED_BRANCHES), "PUBLISHED_BRANCHES must be an array");
  assert.equal(PUBLISHED_BRANCHES.length, 25, "Must contain all 25 locations across 6 states");

  // 1. Exactly 1 Verified Office: Corporate Head Office (Gwalior)
  const verifiedOffices = PUBLISHED_BRANCHES.filter((b) => b.status === "VERIFIED");
  assert.equal(verifiedOffices.length, 1, "Only 1 office may be marked VERIFIED");
  const headOffice = verifiedOffices[0];
  assert.equal(headOffice.city, "Gwalior");
  assert.equal(headOffice.state, "Madhya Pradesh");
  assert.ok(headOffice.isHeadOffice, "Gwalior must be designated isHeadOffice: true");
  assert.equal(headOffice.pinCode, "474001");
  assert.equal(headOffice.phone, "1800 890 0818");

  // 2. Exactly 1 Advisory Desk — Pending Confirmation: Delhi Desk
  const pendingConfirmation = PUBLISHED_BRANCHES.filter((b) => b.status === "PENDING_CONFIRMATION");
  assert.equal(pendingConfirmation.length, 1, "Only Delhi desk should be PENDING_CONFIRMATION");
  const delhiEntry = pendingConfirmation[0];
  assert.equal(delhiEntry.city, "Delhi");
  assert.equal(delhiEntry.state, "Delhi");
  assert.equal(delhiEntry.pinCode, "110001");
  assert.ok(!delhiEntry.address.includes("â€¢"), "Delhi address must be clean UTF-8 without mojibake");

  // 3. Exactly 23 Regional Locations — Pending Verification
  const pendingVerification = PUBLISHED_BRANCHES.filter((b) => b.status === "PENDING_VERIFICATION");
  assert.equal(pendingVerification.length, 23, "Must have exactly 23 regional locations PENDING_VERIFICATION");

  // Verify none of the pending locations have invented phone numbers
  for (const branch of pendingVerification) {
    assert.equal(branch.phone, undefined, `Branch ${branch.city} must not have invented phone number`);
  }

  // 4. Verify Gurugram PIN and Address discrepancy note
  const gurugram = PUBLISHED_BRANCHES.find((b) => b.city === "Gurugram");
  assert.ok(gurugram, "Gurugram must be present in public directory");
  assert.equal(gurugram.state, "Haryana");
  assert.equal(gurugram.pinCode, "122001");
  assert.ok(gurugram.notes?.includes("PIN discrepancy note"), "Must preserve Gurugram PIN discrepancy note for internal follow-up");
});

test("Branch Architecture — Parity with Legacy Dataset", () => {
  assert.ok(Array.isArray(LEGACY_UNVERIFIED_BRANCHES), "LEGACY_UNVERIFIED_BRANCHES must be an array");
  assert.equal(LEGACY_UNVERIFIED_BRANCHES.length, 24, "Must preserve all 24 legacy entries for audit reconciliation");

  // Every city in the legacy dataset must be present in the public directory
  const publishedCities = new Set(PUBLISHED_BRANCHES.map((b) => b.city.toLowerCase()));
  for (const legacyBranch of LEGACY_UNVERIFIED_BRANCHES) {
    assert.ok(
      publishedCities.has(legacyBranch.city.toLowerCase()),
      `Legacy city ${legacyBranch.city} must be present in PUBLISHED_BRANCHES`
    );
  }

  // Verify that NONE of the legacy regional entries are improperly marked as VERIFIED
  for (const branch of LEGACY_UNVERIFIED_BRANCHES) {
    assert.notEqual(branch.status, "VERIFIED", `Branch ${branch.city} must not be marked VERIFIED without lease documentation`);
  }
});

test("Branch Directory — Search & Filter Functionality", () => {
  // 1. Search by City
  const gwaliorResults = filterBranches(PUBLISHED_BRANCHES, "gwalior", "ALL");
  assert.equal(gwaliorResults.length, 1);
  assert.equal(gwaliorResults[0].city, "Gwalior");

  const jaipurResults = filterBranches(PUBLISHED_BRANCHES, "jaipur", "ALL");
  assert.equal(jaipurResults.length, 1);
  assert.equal(jaipurResults[0].city, "Jaipur");

  // 2. Search by PIN Code
  const pinResults = filterBranches(PUBLISHED_BRANCHES, "474001", "ALL");
  assert.equal(pinResults.length, 1);
  assert.equal(pinResults[0].city, "Gwalior");

  const gurugramPin = filterBranches(PUBLISHED_BRANCHES, "122001", "ALL");
  assert.equal(gurugramPin.length, 1);
  assert.equal(gurugramPin[0].city, "Gurugram");

  // 3. Filter by State — Counts must match exact breakdown
  const mpResults = filterBranches(PUBLISHED_BRANCHES, "", "Madhya Pradesh");
  assert.equal(mpResults.length, 12, "Madhya Pradesh must have 12 locations (1 HO + 11 regional)");
  assert.ok(mpResults.every((b) => b.state === "Madhya Pradesh"));

  const rjResults = filterBranches(PUBLISHED_BRANCHES, "", "Rajasthan");
  assert.equal(rjResults.length, 7, "Rajasthan must have 7 locations");

  const upResults = filterBranches(PUBLISHED_BRANCHES, "", "Uttar Pradesh");
  assert.equal(upResults.length, 2, "Uttar Pradesh must have 2 locations");

  const mhResults = filterBranches(PUBLISHED_BRANCHES, "", "Maharashtra");
  assert.equal(mhResults.length, 2, "Maharashtra must have 2 locations");

  const dlResults = filterBranches(PUBLISHED_BRANCHES, "", "Delhi");
  assert.equal(dlResults.length, 1, "Delhi must have 1 location");

  const hrResults = filterBranches(PUBLISHED_BRANCHES, "", "Haryana");
  assert.equal(hrResults.length, 1, "Haryana must have 1 location");

  // 4. Non-matching query returns empty
  const emptyResults = filterBranches(PUBLISHED_BRANCHES, "AtlantisUnknownCity", "ALL");
  assert.equal(emptyResults.length, 0);

  // 5. State counts reflect all 25 published records
  const counts = getStateCounts(PUBLISHED_BRANCHES);
  const totalCount = counts.reduce((acc, c) => acc + c.count, 0);
  assert.equal(totalCount, 25, "State counts sum must equal 25");

  const mpCount = counts.find((c) => c.state === "Madhya Pradesh");
  assert.equal(mpCount?.count, 12);

  const rjCount = counts.find((c) => c.state === "Rajasthan");
  assert.equal(rjCount?.count, 7);
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
