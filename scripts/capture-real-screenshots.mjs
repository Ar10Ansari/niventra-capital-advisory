import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { DatabaseSync } from "node:sqlite";

const ASSETS_DIR = path.join(process.cwd(), "docs", "presentation", "assets");
const DB_PATH = path.join(process.cwd(), "data", "niventra.db");

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// 1. Seed demo project records if none exist
const db = new DatabaseSync(DB_PATH);
const count = (db.prepare("SELECT count(*) as cnt FROM project_applications").get()).cnt;

if (count === 0) {
  console.log("Seeding realistic sample project applications for presentation capture...");
  const insertStmt = db.prepare(`
    INSERT INTO project_applications (
      id, reference_number, applicant_name, organization_name, email,
      phone, role, website, project_name, category, address, city, state, pin_code,
      land_status, stage, description, total_cost, funding_requested,
      promoter_contribution, use_of_funds, expected_timeline, existing_loans,
      documents, consent_given, status, internal_notes, is_demo
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, 1, ?, ?, 1
    )
  `);

  insertStmt.run(
    "prj_demo_01",
    "PRJ-202610-1082",
    "Rajendra Singhania",
    "Singhania Buildcon Pvt. Ltd.",
    "rajendra@singhaniabuildcon.com",
    "+91 98260 12345",
    "MANAGING_DIRECTOR",
    "https://singhaniabuildcon.com",
    "Green Crest Meadows & Towers",
    "RESIDENTIAL",
    "Super Corridor, Near TCS SEZ",
    "Indore",
    "Madhya Pradesh",
    "452005",
    "Freehold Ownership (Clear Title)",
    "UNDER_CONSTRUCTION",
    "Twin 18-storey towers featuring 216 luxury 3BHK and 4BHK apartments. Superstructure at 60% completion.",
    480000000,
    160000000,
    140000000,
    "Tower B superstructure casting, civil finishing, and lift procurement",
    "24 Months",
    "₹6.5 Cr project finance limit with Axis Bank",
    JSON.stringify([
      { name: "Singhania_Corporate_Profile.pdf", category: "Company Profile", size: 2450000 },
      { name: "GreenCrest_RERA_Sanction.pdf", category: "Approvals & RERA", size: 1840000 },
      { name: "CashFlow_Projections_FY27.xlsx", category: "Cost & Cash Flows", size: 820000 }
    ]),
    "UNDER_REVIEW",
    "Preliminary due diligence initiated. Site inspection scheduled with Gwalior regional engineering team."
  );

  insertStmt.run(
    "prj_demo_02",
    "PRJ-202610-2041",
    "Amitabh Vardhan",
    "Vardhan Real Infra LLP",
    "amitabh@vardhaninfra.in",
    "+91 94251 88990",
    "PARTNER",
    "https://vardhaninfra.in",
    "Apex Central Commercial Plaza",
    "COMMERCIAL",
    "Plot 14, Commercial Zone, Arera Colony",
    "Bhopal",
    "Madhya Pradesh",
    "462016",
    "Freehold Commercial Title",
    "UNDER_CONSTRUCTION",
    "Grade-A commercial retail and IT office tower with 180,000 sq ft leasable area.",
    650000000,
    220000000,
    200000000,
    "Façade glazing, MEP installation, and basement 3 parking fitout",
    "18 Months",
    "Clear of bank mortgage; initial funding by promoter equity",
    JSON.stringify([
      { name: "Apex_Plaza_Brochure.pdf", category: "Project Overview", size: 3100000 },
      { name: "Bhopal_Municipal_Sanction.pdf", category: "Approvals & RERA", size: 1420000 }
    ]),
    "SHORTLISTED",
    "Strong sponsor track record. Debenture structure proposed at 13.5% IRR with 1.8x collateral coverage."
  );

  insertStmt.run(
    "prj_demo_03",
    "PRJ-202610-3914",
    "Kunal Mittal",
    "Mittal Logistics Hubs",
    "kunal@mittallogistics.com",
    "+91 98930 45678",
    "CHIEF_EXECUTIVE_OFFICER",
    null,
    "Malwa Freight Logistics Park",
    "INDUSTRIAL",
    "Sector 3 Industrial Area, Pithampur",
    "Dhar",
    "Madhya Pradesh",
    "454775",
    "99-Year MPAKVN Industrial Lease",
    "PLANNING_APPROVALS",
    "Pre-engineered steel warehouse park spanning 32 acres catering to auto ancillary and 3PL clients.",
    380000000,
    140000000,
    90000000,
    "Land development, pre-engineered building procurement, and road network",
    "28 Months",
    "None",
    JSON.stringify([
      { name: "MPAKVN_Allotment_Letter.pdf", category: "Land Title / JDA", size: 1950000 }
    ]),
    "RECEIVED",
    "New intake. Awaiting structural layout drawings from lead engineer."
  );

  // Status histories
  db.prepare(`
    INSERT INTO project_status_history (id, project_id, previous_status, new_status, changed_by, change_note)
    VALUES ('psh_demo_1', 'prj_demo_01', 'RECEIVED', 'UNDER_REVIEW', 'admin@niventra.local', 'Technical desk review initiated.')
  `).run();

  db.prepare(`
    INSERT INTO project_status_history (id, project_id, previous_status, new_status, changed_by, change_note)
    VALUES ('psh_demo_2', 'prj_demo_02', 'UNDER_REVIEW', 'SHORTLISTED', 'admin@niventra.local', 'Collateral assessment approved for committee review.')
  `).run();
}

// 2. Setup auth sessions for captures
const adminToken = "adm_token_" + Date.now();
const investorToken = "inv_token_" + Date.now();
const expiresAt = new Date(Date.now() + 86400000).toISOString();

db.prepare("INSERT OR REPLACE INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").run(
  "sess_admin_capture",
  "usr_admin_dev",
  adminToken,
  expiresAt
);

db.prepare("INSERT OR REPLACE INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").run(
  "sess_investor_capture",
  "usr_investor_dev",
  investorToken,
  expiresAt
);

console.log("Sessions configured for screenshot captures.");

// 3. Launch browser
async function run() {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--font-render-hinting=none"],
  });

  const page = await browser.newPage();

  async function capture(url, filename, options = {}) {
    const fullPath = path.join(ASSETS_DIR, filename);
    console.log(`Capturing ${filename} from ${url}...`);
    await page.goto(url, { waitUntil: "load", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));
    if (options.cookie) {
      await page.setCookie(options.cookie);
      await page.goto(url, { waitUntil: "load", timeout: 15000 });
      await new Promise((r) => setTimeout(r, 800));
    }
    if (options.scroll) {
      await page.evaluate((selector) => {
        const el = selector ? document.querySelector(selector) : null;
        if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
        else window.scrollBy(0, 500);
      }, options.scroll);
      await new Promise((r) => setTimeout(r, 600));
    }
    if (options.click) {
      await page.click(options.click);
      await new Promise((r) => setTimeout(r, 600));
    }
    await page.screenshot({ path: fullPath, fullPage: options.fullPage || false });
    console.log(`Saved: ${fullPath}`);
  }

  try {
    const BASE = "http://127.0.0.1:3000";

    // Slide 1 & 3: Homepage hero
    await capture(`${BASE}/`, "01_home_hero.png");

    // Slide 4: Services Ecosystem (Debt & Debenture)
    await capture(`${BASE}/debt-debenture/`, "02_services_debt.png");

    // Slide 5: Products & Due Diligence
    await capture(`${BASE}/products/`, "03_products_catalog.png");

    // Slide 6: 25-Location Branch Directory on Contact Page
    await capture(`${BASE}/contact/`, "04_contact_branch_directory.png", { scroll: "#branch-directory" });

    // Slide 7: Consultation Enquiry Lead Form
    await capture(`${BASE}/contact/`, "05_lead_enquiry_form.png", { scroll: "form" });

    // Slide 8: Admin Lead Management (with admin session)
    await page.setCookie({ name: "niventra_session", value: adminToken, domain: "127.0.0.1", path: "/" });
    await capture(`${BASE}/admin`, "06_admin_lead_management.png");

    // Slide 9: Chatbot Interaction
    await page.deleteCookie({ name: "niventra_session", domain: "127.0.0.1" });
    await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const chatBtn = await page.$("button[aria-label='Open Institutional Chatbot']");
      if (chatBtn) {
        await chatBtn.click();
        await new Promise((r) => setTimeout(r, 800));
        const input = await page.$("input[placeholder*='Ask about']");
        if (input) {
          await input.type("What are the eligibility criteria for real estate funding?");
          await page.keyboard.press("Enter");
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    } catch (e) {
      console.log("Chatbot note:", e.message);
    }
    await page.screenshot({ path: path.join(ASSETS_DIR, "07_chatbot_interaction.png") });

    // Slide 10, 11, 13: Investor Portal Dashboard (with investor session)
    await page.setCookie({ name: "niventra_session", value: investorToken, domain: "127.0.0.1", path: "/" });
    await capture(`${BASE}/dashboard`, "08_investor_dashboard.png");

    // Slide 12: Indicative Return Calculator (worked example)
    await page.deleteCookie({ name: "niventra_session", domain: "127.0.0.1" });
    await capture(`${BASE}/calculator/`, "09_calculator_worked_example.png", { scroll: "input" });

    // Slide 14: Investor KYC & Document Workflow
    await page.setCookie({ name: "niventra_session", value: investorToken, domain: "127.0.0.1", path: "/" });
    await capture(`${BASE}/dashboard/settings`, "10_investor_kyc_settings.png");

    // Slide 15: New Feature: Project Funding Multi-Step Submission (/project-funding/)
    await page.deleteCookie({ name: "niventra_session", domain: "127.0.0.1" });
    await capture(`${BASE}/project-funding/`, "11_project_funding_portal.png");

    // Step 2 in Project Funding Form
    await page.goto(`${BASE}/project-funding/`, { waitUntil: "load", timeout: 15000 });
    await page.waitForSelector("#applicantName", { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 600));
    await page.type("#applicantName", "Rajendra Singhania");
    await page.type("#organizationName", "Singhania Buildcon Pvt. Ltd.");
    await page.type("#email", "rajendra@singhaniabuildcon.com");
    await page.type("#phone", "+91 98260 12345");
    await page.type("#role", "Managing Director");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const target = btns.find((b) => b.textContent && b.textContent.includes("Proceed to Project Details"));
      if (target) target.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ASSETS_DIR, "12_project_funding_step2.png") });

    // Step 3 in Project Funding Form
    await page.waitForSelector("#projectName", { timeout: 10000 });
    await page.type("#projectName", "Green Crest Meadows");
    await page.type("#address", "Super Corridor Sector 14");
    await page.type("#city", "Indore");
    await page.type("#pinCode", "452005");
    await page.type("#description", "Twin 18-storey towers featuring 216 luxury apartments with approved sanctions.");
    await page.type("#totalCost", "4800");
    await page.type("#fundingRequested", "1600");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const target = btns.find((b) => b.textContent && b.textContent.includes("Proceed to Documents"));
      if (target) target.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ASSETS_DIR, "13_project_funding_step3.png") });

    // Slide 16: Admin Project Review Dashboard (with Projects tab selected)
    await page.setCookie({ name: "niventra_session", value: adminToken, domain: "127.0.0.1", path: "/" });
    await page.goto(`${BASE}/admin`, { waitUntil: "load", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const target = btns.find((b) => b.textContent && b.textContent.includes("Project Submissions"));
      if (target) target.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ASSETS_DIR, "14_admin_project_review.png") });

    // Slide 17 & 18: Mobile Responsive View
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await capture(`${BASE}/project-funding/`, "15_mobile_project_funding.png");
    await capture(`${BASE}/contact/`, "16_mobile_branch_directory.png", { scroll: "#branch-directory" });

    console.log("All authentic screenshots captured successfully!");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
