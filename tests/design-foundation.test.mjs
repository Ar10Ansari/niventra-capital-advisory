import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

test("Design Foundation - Asset Integrity Check", () => {
  const logoPath = path.join(rootDir, "public", "assets", "images", "logo.png");
  assert.ok(fs.existsSync(logoPath), "Original logo must exist at public/assets/images/logo.png");
  
  const stats = fs.statSync(logoPath);
  assert.equal(stats.size, 687686, "Logo binary size must match authentic source (687,686 bytes)");
  
  const faviconPath = path.join(rootDir, "public", "favicon.ico");
  assert.ok(fs.existsSync(faviconPath), "Favicon must exist at public/favicon.ico");
});

test("Design Foundation - CSS Design Tokens & Typography Variables", () => {
  const cssPath = path.join(rootDir, "src", "app", "globals.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  assert.ok(css.includes("--color-navy: #0B192C"), "Midnight Navy token must be #0B192C");
  assert.ok(css.includes("--color-slate: #1E3E62"), "Slate Blue token must be #1E3E62");
  assert.ok(css.includes("--color-gold: #D4AF37"), "Warm Gold token must be #D4AF37");
  assert.ok(css.includes("--color-gold-deep: #997300"), "Deep Gold accessible text token must be #997300");
  assert.ok(css.includes("--color-pearl: #F8F9FA"), "Pearl off-white canvas token must be #F8F9FA");
  assert.ok(css.includes("prefers-reduced-motion"), "Accessibility reduced-motion safety override must be defined");
  assert.ok(css.includes(".glass-header"), "Frosted glass header utility class must be defined");
  assert.ok(css.includes(".card-luxury"), "Luxury card utility class must be defined");
});

test("Design Foundation - Root Layout & Font Engine", () => {
  const layoutPath = path.join(rootDir, "src", "app", "layout.tsx");
  const layout = fs.readFileSync(layoutPath, "utf-8");

  assert.ok(layout.includes("Playfair_Display"), "Editorial heading font Playfair Display must be loaded");
  assert.ok(layout.includes("Plus_Jakarta_Sans"), "Geometric data font Plus Jakarta Sans must be loaded");
  assert.ok(layout.includes("metadataBase: new URL"), "metadataBase must be configured to prevent OpenGraph URL warnings");
  assert.ok(layout.includes("Niventra Capital Advisory India"), "Page title must establish official financial advisory brand");
});

test("Design Foundation - Header Component Navigation & Mobile Drawer", () => {
  const headerPath = path.join(rootDir, "src", "components", "layout", "Header.tsx");
  const header = fs.readFileSync(headerPath, "utf-8");

  assert.ok(header.includes("/assets/images/logo.png"), "Header must render authentic logo");
  assert.ok(header.includes("1800 890 0818"), "Header must include official Toll-Free phone");
  assert.ok(header.includes("/debt-debenture/"), "Header must link to Debt & Debenture");
  assert.ok(header.includes("/real-estate/"), "Header must link to Real Estate");
  assert.ok(header.includes("/due-diligence/"), "Header must link to Due Diligence");
  assert.ok(header.includes("/capital-providers/"), "Header must link to Capital Providers");
  assert.ok(header.includes("/investor-information/"), "Header must link to Investor Info");
  assert.ok(header.includes("/contact/"), "Header must link to Contact");
  assert.ok(header.includes("aria-expanded"), "Mobile toggle must include accessible ARIA state");
  assert.ok(header.includes("Escape"), "Header must support Escape key to close mobile navigation");
});

test("Design Foundation - Footer Component Coordinates & Disclaimers", () => {
  const footerPath = path.join(rootDir, "src", "components", "layout", "Footer.tsx");
  const footer = fs.readFileSync(footerPath, "utf-8");

  assert.ok(footer.includes("Patel Nagar City Centre, Gwalior"), "Footer must include official Gwalior office address");
  assert.ok(footer.includes("1800 890 0818"), "Footer must include Toll-Free phone");
  assert.ok(footer.includes("+91 011 4051 5660"), "Footer must include Delhi landline");
  assert.ok(footer.includes("+91 74282 80200"), "Footer must include WhatsApp contact");
  assert.ok(footer.includes("info@niventracapitaladvisory.com"), "Footer must include corporate email");
  assert.ok(footer.includes("/risk-disclosure/"), "Footer must link to Risk Disclosures");
  assert.ok(footer.includes("/regulatory-disclosures/"), "Footer must link to Regulatory Disclosures");
  assert.ok(footer.includes("/grievance/"), "Footer must link to Grievance Redressal");
  assert.ok(footer.includes("/delete-account/"), "Footer must link to Data Protection / Erasure");
  assert.ok(footer.includes("Statutory Financial Risk & Regulatory Notice"), "Footer must include statutory risk disclaimer");
  assert.ok(footer.includes("© 2026 Niventra Capital Advisory India Pvt. Ltd."), "Footer must render correct unescaped copyright");
});

test("Design Foundation - Accessible Consultation Form", () => {
  const formPath = path.join(rootDir, "src", "components", "forms", "ConsultationForm.tsx");
  const form = fs.readFileSync(formPath, "utf-8");

  assert.ok(form.includes("fullName"), "Form must capture full legal name");
  assert.ok(form.includes("email"), "Form must capture email address");
  assert.ok(form.includes("phoneNumber"), "Form must capture phone number");
  assert.ok(form.includes("category"), "Form must capture investor/developer category");
  assert.ok(form.includes("capitalRange"), "Form must capture anticipated capital size");
  assert.ok(form.includes("Cloudflare Turnstile Verified"), "Form must include Turnstile security verification");
  assert.ok(form.includes("Digital Personal Data Protection (DPDP) Act, 2023"), "Form must include explicit DPDP Act consent");
  assert.ok(form.includes("aria-invalid"), "Form inputs must include accessible ARIA validation states");
});

test("Design Foundation - Homepage Prototype 6 Core Sections", () => {
  const pagePath = path.join(rootDir, "src", "app", "page.tsx");
  const page = fs.readFileSync(pagePath, "utf-8");

  // Hero Section
  assert.ok(page.includes("Connecting eligible capital with professionally evaluated"), "Hero headline must be present");
  assert.ok(page.includes("Secured Debentures"), "Hero trust metric: Secured Debentures");
  assert.ok(page.includes("12% – 16% p.a.*"), "Hero trust metric: 12%-16% preliminary guidance with asterisk disclaimer");
  assert.ok(page.includes("48h Acknowledgment"), "Hero trust metric: 48h SLA");

  // Section 1: 4 Pillars
  assert.ok(page.includes("Structured Capital Solutions"), "Pillar 1 must be present");
  assert.ok(page.includes("Real Estate Project Evaluation"), "Pillar 2 must be present");
  assert.ok(page.includes("Legal & Financial Due Diligence"), "Pillar 3 must be present");
  assert.ok(page.includes("Project Monitoring & Reporting"), "Pillar 4 must be present");

  // Section 2: 6 Stages
  assert.ok(page.includes("How Niventra Creates Value"), "Section 2 heading must be present");
  assert.ok(page.includes("Opportunity Identification"), "Stage 1 must be present");
  assert.ok(page.includes("Multi-Tier Due Diligence"), "Stage 2 must be present");
  assert.ok(page.includes("Structured Capital Architecture"), "Stage 3 must be present");
  assert.ok(page.includes("Controlled Capital Deployment"), "Stage 4 must be present");
  assert.ok(page.includes("Independent Project Monitoring"), "Stage 5 must be present");
  assert.ok(page.includes("Repayment & Capital Redemption"), "Stage 6 must be present");

  // Section 3: 9 Nodes
  assert.ok(page.includes("Our Operational Workflow"), "Section 3 heading must be present");
  assert.ok(page.includes("Capital Sourcing"), "Workflow node 1 must be present");
  assert.ok(page.includes("Redemption"), "Workflow node 9 must be present");

  // Section 4: Solutions & Calculator Notice
  assert.ok(page.includes("Debt & Debentures"), "Solution 1 must be present");
  assert.ok(page.includes("Real Estate Capital"), "Solution 2 must be present");
  assert.ok(page.includes("Capital Providers Guide"), "Solution 3 must be present");
  assert.ok(page.includes("Institutional Financial Calculator Notice"), "Calculator deferral notice must be present");

  // Section 5: Trust Matrix
  assert.ok(page.includes("Institutional Trust & Governance"), "Trust section must be present");
  assert.ok(page.includes("Statutory Grievance Redressal"), "Grievance redressal pillar must be present");

  // Section 6: Consultation Intake
  assert.ok(page.includes("Consult with Our Capital Structuring Team"), "Consultation section must be present");
  assert.ok(page.includes("<ConsultationForm />"), "Consultation form must be embedded");
});
