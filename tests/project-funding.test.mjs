import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const rootDir = process.cwd();
const DB_PATH = path.join(rootDir, "data", "niventra.db");

test("Project Funding — SQLite Relational Database & Table Integrity", () => {
  assert.ok(fs.existsSync(DB_PATH), "Database file data/niventra.db must exist");

  const db = new DatabaseSync(DB_PATH);
  
  const tables = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
  `).all().map((r) => r.name);

  assert.ok(tables.includes("project_applications"), "Table project_applications must exist");
  assert.ok(tables.includes("project_status_history"), "Table project_status_history must exist");

  // Verify columns in project_applications
  const columns = db.prepare(`PRAGMA table_info(project_applications)`).all().map((c) => c.name);
  const requiredCols = [
    "id",
    "reference_number",
    "applicant_name",
    "organization_name",
    "email",
    "phone",
    "role",
    "website",
    "project_name",
    "category",
    "address",
    "city",
    "state",
    "pin_code",
    "land_status",
    "stage",
    "description",
    "total_cost",
    "funding_requested",
    "promoter_contribution",
    "use_of_funds",
    "expected_timeline",
    "existing_loans",
    "documents",
    "consent_given",
    "status",
    "assigned_to",
    "internal_notes",
    "decline_reason",
    "info_requested",
    "is_demo",
    "created_at",
    "updated_at",
  ];

  for (const col of requiredCols) {
    assert.ok(columns.includes(col), `Column ${col} must exist in project_applications`);
  }
});

test("Project Funding — Application CRUD and Status Transition Constraints", () => {
  const db = new DatabaseSync(DB_PATH);
  const testId = `test_prj_${Date.now()}`;
  const testRef = `PRJ-${Date.now().toString().slice(-6)}`;

  // Insert application
  const insertStmt = db.prepare(`
    INSERT INTO project_applications (
      id, reference_number, applicant_name, organization_name, email,
      phone, role, project_name, category,
      address, city, state, pin_code, land_status,
      stage, description, total_cost, funding_requested,
      promoter_contribution, use_of_funds, expected_timeline,
      documents, status, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, 'RECEIVED', 1
    )
  `);

  insertStmt.run(
    testId,
    testRef,
    "Vikramaditya Construction",
    "Vikramaditya Group LLP",
    "contact@vikramaditya.test",
    "+91 98765 43210",
    "MANAGING_DIRECTOR",
    "Green Crest Meadows",
    "RESIDENTIAL",
    "Plot 42, Sector 18",
    "Indore",
    "Madhya Pradesh",
    "452001",
    "FREEHOLD",
    "UNDER_CONSTRUCTION",
    "Premium 3BHK high-rise residential project with 240 units.",
    450000000,
    150000000,
    100000000,
    "Civil construction and finishing",
    "24 Months",
    JSON.stringify([{ name: "Project_Report.pdf", category: "project_overview", size: 1048576 }])
  );

  // Retrieve
  const app = db.prepare("SELECT * FROM project_applications WHERE id = ?").get(testId);
  assert.ok(app, "Application should be retrieved");
  assert.equal(app.reference_number, testRef);
  assert.equal(app.total_cost, 450000000);
  assert.equal(app.funding_requested, 150000000);
  assert.equal(app.status, "RECEIVED");

  // Validate status transition history logging
  const histId = `hist_${Date.now()}`;
  db.prepare(`
    INSERT INTO project_status_history (
      id, project_id, previous_status, new_status, changed_by, change_note
    ) VALUES (?, ?, 'RECEIVED', 'UNDER_REVIEW', 'admin_tester', 'Initial technical appraisal initiated')
  `).run(histId, testId);

  // Update application status
  db.prepare(`
    UPDATE project_applications
    SET status = 'UNDER_REVIEW', internal_notes = 'Under technical diligence'
    WHERE id = ?
  `).run(testId);

  const updated = db.prepare("SELECT status, internal_notes FROM project_applications WHERE id = ?").get(testId);
  assert.equal(updated.status, "UNDER_REVIEW");
  assert.equal(updated.internal_notes, "Under technical diligence");

  const historyEntries = db.prepare("SELECT * FROM project_status_history WHERE project_id = ?").all(testId);
  assert.equal(historyEntries.length, 1);
  assert.equal(historyEntries[0].new_status, "UNDER_REVIEW");

  // Check CHECK constraint rejection on invalid status
  assert.throws(() => {
    db.prepare("UPDATE project_applications SET status = 'INVALID_STATUS' WHERE id = ?").run(testId);
  }, /CHECK constraint failed/);

  // Clean up
  db.prepare("DELETE FROM project_status_history WHERE project_id = ?").run(testId);
  db.prepare("DELETE FROM project_applications WHERE id = ?").run(testId);
});

test("Project Funding — Public Submission Route Security & Honeypot Defenses", () => {
  const routePath = path.join(rootDir, "src", "app", "api", "project-funding", "route.ts");
  assert.ok(fs.existsSync(routePath), "Project Funding route must exist");

  const content = fs.readFileSync(routePath, "utf-8");
  assert.ok(content.includes("website_hp"), "Project funding route must implement honeypot bot defense");
  assert.ok(content.includes("PRJ-"), "Must generate unique reference starting with PRJ-");
  assert.ok(content.includes("numFundingRequested > numTotalCost"), "Must validate that funding request cannot exceed total cost");
  assert.ok(content.includes("dispatchProjectFundingNotification"), "Must dispatch notification on submission");
  assert.ok(content.includes("logAudit"), "Must log submission to audit logs");
});

test("Project Funding — Admin Route Security & Authorized Status Transitions", () => {
  const detailRoutePath = path.join(rootDir, "src", "app", "api", "project-funding", "[id]", "route.ts");
  assert.ok(fs.existsSync(detailRoutePath), "Project Funding ID route must exist");

  const content = fs.readFileSync(detailRoutePath, "utf-8");
  assert.ok(content.includes("user.role !== \"ADMIN\""), "Must enforce ADMIN / STAFF role authorization");
  assert.ok(content.includes("VALID_STATUSES"), "Must enforce whitelist of allowed status transitions");
  assert.ok(content.includes("project_status_history"), "Must record audit history of all status changes");
  assert.ok(content.includes("MORE_INFORMATION_REQUIRED"), "Must support MORE_INFORMATION_REQUIRED status");
  assert.ok(content.includes("DECLINED"), "Must support DECLINED status with mandatory reason");
});

test("Project Funding — UI Page Integrity & Multi-Step Architecture", () => {
  const pagePath = path.join(rootDir, "src", "app", "project-funding", "page.tsx");
  assert.ok(fs.existsSync(pagePath), "Project Funding page must exist");

  const content = fs.readFileSync(pagePath, "utf-8");
  assert.ok(content.includes("Submit a Project for"), "Must have professional page title");
  assert.ok(content.includes("Funding Consideration"), "Must include funding consideration heading");
  assert.ok(content.includes("Developer"), "Step 1 must be Developer info");
  assert.ok(content.includes("Project Specs"), "Step 2 must be Project Specs");
  assert.ok(content.includes("Documents"), "Step 3 must be Documents");
  assert.ok(content.includes("Review"), "Step 4 must be Review & Verification");
  assert.ok(content.includes("demonstration environments") || content.includes("Secure Document Upload"), "Must conspicuously indicate demo mode for documents");
  assert.ok(content.includes("does not constitute a commitment") || content.includes("does not represent an approved"), "Must include non-commitment fiduciary disclaimer");
});
