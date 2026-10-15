import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

/* ============================================================================
   NIVENTRA CAPITAL ADVISORY — ALL-ROUTES & CONTENT INTEGRITY TESTS
   Comprehensive validation of all 16 canonical public routes,
   governance disclosures, compliance safeguards, and technical directives.
   ============================================================================ */

const CANONICAL_ROUTES = [
  { path: "src/app/page.tsx", name: "Homepage (/)" },
  { path: "src/app/about/page.tsx", name: "About Us (/about/)" },
  { path: "src/app/debt-debenture/page.tsx", name: "Debt & Debenture (/debt-debenture/)" },
  { path: "src/app/real-estate/page.tsx", name: "Real Estate (/real-estate/)" },
  { path: "src/app/due-diligence/page.tsx", name: "Due Diligence (/due-diligence/)" },
  { path: "src/app/capital-providers/page.tsx", name: "Capital Providers (/capital-providers/)" },
  { path: "src/app/investor-information/page.tsx", name: "Investor Information (/investor-information/)" },
  { path: "src/app/calculator/page.tsx", name: "Deferred Calculator (/calculator/)" },
  { path: "src/app/contact/page.tsx", name: "Contact Us (/contact/)" },
  { path: "src/app/risk-disclosure/page.tsx", name: "Risk Disclosure (/risk-disclosure/)" },
  { path: "src/app/terms-conditions/page.tsx", name: "Terms & Conditions (/terms-conditions/)" },
  { path: "src/app/privacy-policy/page.tsx", name: "Privacy Policy (/privacy-policy/)" },
  { path: "src/app/regulatory-disclosures/page.tsx", name: "Regulatory Disclosures (/regulatory-disclosures/)" },
  { path: "src/app/grievance/page.tsx", name: "Grievance Redressal (/grievance/)" },
  { path: "src/app/support-faq/page.tsx", name: "Support & FAQ (/support-faq/)" },
  { path: "src/app/delete-account/page.tsx", name: "Delete Account (/delete-account/)" },
];

test("All 16 Canonical Routes Exist and Have Metadata", () => {
  for (const route of CANONICAL_ROUTES) {
    const filePath = path.join(rootDir, route.path);
    assert.ok(fs.existsSync(filePath), `${route.name} file must exist at ${route.path}`);
    const content = fs.readFileSync(filePath, "utf-8");
    assert.ok(content.length > 500, `${route.name} must contain substantive content (>500 bytes)`);
    assert.ok(content.includes("metadata: Metadata"), `${route.name} must export Metadata`);
    assert.ok(content.includes("alternates:"), `${route.name} must define canonical URL`);
  }
});

test("Custom 404 Not Found Page Exists", () => {
  const notFoundPath = path.join(rootDir, "src", "app", "not-found.tsx");
  assert.ok(fs.existsSync(notFoundPath), "Custom not-found.tsx must exist");
  const content = fs.readFileSync(notFoundPath, "utf-8");
  assert.ok(content.includes("Page not found"), "404 page must display descriptive heading");
  assert.ok(content.includes('href="/"'), "404 page must link back to home");
});

test("Robots.txt and Sitemap.xml Directives", () => {
  const robotsPath = path.join(rootDir, "src", "app", "robots.ts");
  assert.ok(fs.existsSync(robotsPath), "robots.ts route handler must exist");
  const robots = fs.readFileSync(robotsPath, "utf-8");
  assert.ok(robots.includes("sitemap:"), "robots.ts must reference sitemap");

  const sitemapPath = path.join(rootDir, "src", "app", "sitemap.ts");
  assert.ok(fs.existsSync(sitemapPath), "sitemap.ts route handler must exist");
  const sitemap = fs.readFileSync(sitemapPath, "utf-8");
  for (const route of CANONICAL_ROUTES) {
    const segment = route.path
      .replace("src/app/", "")
      .replace("/page.tsx", "")
      .replace("page.tsx", "");
    if (segment) {
      assert.ok(sitemap.includes(`/${segment}/`), `sitemap.ts must contain canonical /${segment}/`);
    }
  }
});

test("Debt & Debenture Compliance & Qualified Yield Guidance", () => {
  const filePath = path.join(rootDir, "src", "app", "debt-debenture", "page.tsx");
  const content = fs.readFileSync(filePath, "utf-8");
  assert.ok(content.includes("12% – 16%"), "Debt & Debenture must specify 12%–16% p.a. yield guidance");
  assert.ok(content.includes("Indicative"), "Yield must be explicitly qualified as indicative");
  assert.ok(!content.includes("guaranteed return"), "Must never promise guaranteed returns");
  assert.ok(content.includes("8-Point Investor Due Diligence"), "Must include 8-point due diligence checklist");
  assert.ok(content.includes("6 Red Flags"), "Must include 6 red flags warning");
  assert.ok(content.includes("bond-plant.png"), "Must render bond-plant brand asset");
});

test("Calculator Deferral Transparency (Decision 7)", () => {
  const filePath = path.join(rootDir, "src", "app", "calculator", "page.tsx");
  const content = fs.readFileSync(filePath, "utf-8");
  assert.ok(content.includes("Formally Deferred"), "Calculator must be explicitly marked as deferred");
  assert.ok(content.includes("Why the Legacy Calculator was Decommissioned"), "Must explain legacy calculation defects");
  assert.ok(content.includes("Chief Financial Officer"), "Must reference CFO certification requirement");
});

test("Investor Information Clause Integrity (Decision 4)", () => {
  const filePath = path.join(rootDir, "src", "app", "investor-information", "page.tsx");
  const content = fs.readFileSync(filePath, "utf-8");
  assert.ok(content.includes("Section 08"), "Must include Section 8: Risk Factors");
  assert.ok(content.includes("Section 11"), "Must include Section 11: Grievance Redressal");
  assert.ok(content.includes("Section 12"), "Must include Section 12: Regulatory Disclosures");
  assert.ok(content.includes("Pending Supplementary Clauses"), "Must transparently state pending legal clauses without fabricating");
});

test("Corporate Contact Details & Office Parity (Decision 3)", () => {
  const contactPath = path.join(rootDir, "src", "app", "contact", "page.tsx");
  const contact = fs.readFileSync(contactPath, "utf-8");
  assert.ok(contact.includes("1800 890 0818"), "Contact page must include toll-free number");
  assert.ok(contact.includes("+91 011 4051 5660"), "Contact page must include Delhi landline");
  assert.ok(contact.includes("+91 74282 80200"), "Contact page must include WhatsApp line");
  assert.ok(contact.includes("Patel Nagar City Centre"), "Contact page must include official Gwalior office address");
  assert.ok(contact.includes("Gwalior, Madhya Pradesh — 474001"), "Contact page must include official Gwalior PIN code");
  assert.ok(contact.includes("info@niventracapitaladvisory.com"), "Contact page must include corporate email");
});

test("Grievance Redressal Mechanism & SLA", () => {
  const filePath = path.join(rootDir, "src", "app", "grievance", "page.tsx");
  const content = fs.readFileSync(filePath, "utf-8");
  assert.ok(content.includes("grievance@niventracapitaladvisory.com"), "Must provide official grievance email");
  assert.ok(content.includes("48"), "Must specify 48-hour acknowledgment SLA");
  assert.ok(content.includes("30"), "Must specify 30-day resolution SLA");
});

test("Digital Personal Data Protection (DPDP) Act 2023 Compliance", () => {
  const privacyPath = path.join(rootDir, "src", "app", "privacy-policy", "page.tsx");
  const privacy = fs.readFileSync(privacyPath, "utf-8");
  assert.ok(privacy.includes("Digital Personal Data Protection (DPDP) Act, 2023"), "Privacy policy must cite DPDP Act 2023");
  assert.ok(privacy.includes("privacy_lock.png"), "Privacy policy must render privacy_lock asset");

  const deletePath = path.join(rootDir, "src", "app", "delete-account", "page.tsx");
  const deleteAcc = fs.readFileSync(deletePath, "utf-8");
  assert.ok(deleteAcc.includes("Account Deletion Request"), "Must provide exact email subject format");
  assert.ok(deleteAcc.includes("7 to 14 Business Days"), "Must document processing SLA");
  assert.ok(deleteAcc.includes("Statutory Data Retention Exceptions"), "Must document statutory financial retention rules");
});
