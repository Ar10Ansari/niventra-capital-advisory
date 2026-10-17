import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

/* ============================================================================
   NIVENTRA CAPITAL ADVISORY — DESIGN FOUNDATION TESTS v2
   Verifies the editorial modern institutional redesign.
   Zero production endpoints connected.
   ============================================================================ */

test("Design Foundation v2 — Asset Integrity Check", () => {
  const logoPath = path.join(rootDir, "public", "assets", "images", "logo.png");
  assert.ok(fs.existsSync(logoPath), "Original logo must exist at public/assets/images/logo.png");

  const stats = fs.statSync(logoPath);
  assert.equal(stats.size, 687686, "Logo binary size must match authentic source (687,686 bytes)");

  const faviconPath = path.join(rootDir, "public", "favicon.ico");
  assert.ok(fs.existsSync(faviconPath), "Favicon must exist at public/favicon.ico");
});

test("Design Foundation v2 — CSS Design Tokens (Light Institutional Palette)", () => {
  const cssPath = path.join(rootDir, "src", "app", "globals.css");
  const css = fs.readFileSync(cssPath, "utf-8");

  // Warm ivory canvas — primary background
  assert.ok(css.includes("--color-canvas:"), "Warm ivory canvas token must exist");
  assert.ok(css.includes("#FAFAF7"), "Canvas colour must be warm ivory #FAFAF7");

  // Deep ink type
  assert.ok(css.includes("--color-ink:"), "Deep ink type token must exist");
  assert.ok(css.includes("#1A1A1A"), "Ink colour must be deep #1A1A1A");

  // Muted slate
  assert.ok(css.includes("--color-slate:"), "Muted slate supporting text token must exist");

  // Brass accent
  assert.ok(css.includes("--color-brass:"), "Brand brass accent token must exist");
  assert.ok(css.includes("#9A7B2C"), "Brass accent colour must be #9A7B2C (WCAG AA compliant on white)");

  // Anchor dark (footer)
  assert.ok(css.includes("--color-anchor:"), "Dark anchor colour token for footer must exist");

  // Editorial utility classes
  assert.ok(css.includes(".text-eyebrow"), "Eyebrow text utility class must be defined");
  assert.ok(css.includes(".card-editorial"), "Minimal editorial card class must be defined");
  assert.ok(css.includes(".header-light"), "Light glass header utility class must be defined");
  assert.ok(css.includes(".container-editorial"), "Editorial container class must be defined");
  assert.ok(css.includes(".section-spacing"), "Section spacing utility must be defined");

  // Accessibility
  assert.ok(css.includes("prefers-reduced-motion"), "Reduced-motion safety override must be defined");
  assert.ok(css.includes("focus-visible"), "Focus visible ring must be specified");
});

test("Design Foundation v2 — Root Layout & Font Engine", () => {
  const layoutPath = path.join(rootDir, "src", "app", "layout.tsx");
  const layout = fs.readFileSync(layoutPath, "utf-8");

  // Cormorant Garamond replaces Playfair Display in v2
  assert.ok(layout.includes("Cormorant_Garamond"), "Editorial heading font Cormorant Garamond must be loaded");
  assert.ok(layout.includes("Plus_Jakarta_Sans"), "Geometric body font Plus Jakarta Sans must be loaded");
  assert.ok(layout.includes("metadataBase: new URL"), "metadataBase must be configured");
  assert.ok(layout.includes("Niventra Capital Advisory India"), "Page title must include official brand");
  assert.ok(layout.includes("Skip to main content"), "Skip-to-content link must be present for accessibility");
});

test("Design Foundation v2 — Header Component (Light Institutional)", () => {
  const headerPath = path.join(rootDir, "src", "components", "layout", "Header.tsx");
  const header = fs.readFileSync(headerPath, "utf-8");

  // Original logo preserved unchanged
  assert.ok(header.includes("/assets/images/logo.png"), "Header must render authentic logo");

  // Contact number preserved
  assert.ok(header.includes("1800 890 0818"), "Header must include official toll-free phone");

  // All 7 core navigation routes
  assert.ok(header.includes("/debt-debenture/"), "Header must link to Debt & Debenture");
  assert.ok(header.includes("/real-estate/"), "Header must link to Real Estate");
  assert.ok(header.includes("/due-diligence/"), "Header must link to Due Diligence");
  assert.ok(header.includes("/capital-providers/"), "Header must link to Capital Providers");
  assert.ok(header.includes("/investor-information/"), "Header must link to Investor Info");
  assert.ok(header.includes("/contact/"), "Header must link to Contact");

  // Accessibility
  assert.ok(header.includes("aria-expanded"), "Mobile toggle must include accessible ARIA state");
  assert.ok(header.includes("Escape"), "Header must support Escape key to close mobile drawer");

  // New design: light header (not dark navy)
  assert.ok(header.includes("header-light"), "Header must use new light glass class");
  assert.ok(!header.includes("glass-header"), "Old dark glass-header class must not be present");
});

test("Design Foundation v2 — Footer Component (Refined Dark Anchor)", () => {
  const footerPath = path.join(rootDir, "src", "components", "layout", "Footer.tsx");
  const footer = fs.readFileSync(footerPath, "utf-8");

  // Verified contact details
  assert.ok(footer.includes("Patel Nagar City Centre, Gwalior"), "Footer must include official Gwalior office address");
  assert.ok(footer.includes("1800 890 0818"), "Footer must include toll-free phone");
  assert.ok(footer.includes("+91 011 4051 5660"), "Footer must include Delhi landline");
  assert.ok(footer.includes("+91 74282 80200"), "Footer must include WhatsApp contact");
  assert.ok(footer.includes("info@niventracapitaladvisory.com"), "Footer must include corporate email");

  // Governance links
  assert.ok(footer.includes("/risk-disclosure/"), "Footer must link to Risk Disclosures");
  assert.ok(footer.includes("/regulatory-disclosures/"), "Footer must link to Regulatory Disclosures");
  assert.ok(footer.includes("/grievance/"), "Footer must link to Grievance Redressal");
  assert.ok(footer.includes("/delete-account/"), "Footer must link to Data Protection / Erasure");

  // Statutory disclosure
  assert.ok(footer.includes("Statutory Financial Risk"), "Footer must include statutory risk disclaimer");
  assert.ok(footer.includes("© 2026 Niventra Capital Advisory India Pvt. Ltd."), "Footer must render correct copyright");
});

test("Design Foundation v2 — Consultation Form (Accessible, DPDP Compliant)", () => {
  const formPath = path.join(rootDir, "src", "components", "forms", "ConsultationForm.tsx");
  const form = fs.readFileSync(formPath, "utf-8");

  // Required fields
  assert.ok(form.includes("fullName"), "Form must capture full legal name");
  assert.ok(form.includes("email"), "Form must capture email address");
  assert.ok(form.includes("phoneNumber"), "Form must capture phone number");
  assert.ok(form.includes("category"), "Form must capture investor/developer category");
  assert.ok(form.includes("capitalRange"), "Form must capture anticipated capital size");

  // Security and compliance
  assert.ok(form.includes("Cloudflare Turnstile Verified"), "Form must include Turnstile security verification");
  assert.ok(form.includes("Digital Personal Data Protection (DPDP) Act, 2023"), "Form must include explicit DPDP Act 2023 consent");
  assert.ok(form.includes("aria-invalid"), "Form inputs must include accessible ARIA validation states");
  assert.ok(form.includes('role="alert"'), "Form error messages must use role=alert for screen readers");
  assert.ok(form.includes("autoComplete"), "Form inputs must include autocomplete attributes");
});

test("Design Foundation v2 — Homepage Editorial Redesign", () => {
  const pagePath = path.join(rootDir, "src", "app", "page.tsx");
  const page = fs.readFileSync(pagePath, "utf-8");

  // Hero section — no fake metrics, qualified yield language
  assert.ok(page.includes("Connecting eligible capital"), "Hero headline must be present");
  assert.ok(page.includes("12%–16% p.a."), "Hero must include yield guidance (qualified)");
  assert.ok(page.includes("Subject to"), "Yield guidance must be appropriately qualified");

  // Services — editorial row layout
  assert.ok(page.includes("Advisory Services"), "Services section heading must be present");
  assert.ok(page.includes("Debt & Debenture"), "Debt & Debenture service must be present");
  assert.ok(page.includes("Real Estate Capital"), "Real Estate Capital service must be present");
  assert.ok(page.includes("Capital Providers"), "Capital Providers service must be present");
  assert.ok(page.includes("Due Diligence"), "Due Diligence service must be present");

  // Process section
  assert.ok(page.includes("Execution Methodology"), "Process section must be present");
  assert.ok(page.includes("Opportunity Identification"), "Process stage 1 must be present");
  assert.ok(page.includes("Repayment"), "Process stage 6 must be present");

  // Transparency section (new — replaces repetitive governance card grid)
  assert.ok(page.includes("Financial Transparency"), "Transparency section must be present");
  assert.ok(page.includes("Issuer Entity"), "Issuer entity disclosure must be present");
  assert.ok(page.includes("Return Calculator — Deferred"), "Calculator deferral must be explicitly disclosed");

  // Consultation
  assert.ok(page.includes("Speak with our advisory team"), "Consultation section must be present");
  assert.ok(page.includes("<ConsultationForm />"), "Consultation form must be embedded");

  // Content integrity
  assert.ok(!page.includes("Generic"), "Page must not contain generic filler copy");
  assert.ok(page.includes("5-Point"), "Due diligence framework must be mentioned");
});

test("Sprint 3A — Authentication & Settings Frontend Integrity", () => {
  // 1. Login Page Integrity
  const loginPath = path.join(rootDir, "src", "app", "login", "page.tsx");
  assert.ok(fs.existsSync(loginPath), "login/page.tsx must exist");
  const loginContent = fs.readFileSync(loginPath, "utf-8");
  assert.ok(loginContent.includes("showPassword"), "Login must include password visibility toggle");
  assert.ok(loginContent.includes("Password Recovery"), "Login must include password recovery preview");
  assert.ok(loginContent.includes("Notice: Self-Service Reset in Compliance Preview"), "Password reset must be explicitly labeled as preview");

  // 2. Register Page Integrity
  const regPath = path.join(rootDir, "src", "app", "register", "page.tsx");
  assert.ok(fs.existsSync(regPath), "register/page.tsx must exist");
  const regContent = fs.readFileSync(regPath, "utf-8");
  assert.ok(regContent.includes("showPassword"), "Register must include password visibility toggle");
  assert.ok(regContent.includes("showConfirmPassword"), "Register must include confirm password visibility toggle");
  assert.ok(regContent.includes("Password Strength Guidance"), "Register must include password criteria helper");
  assert.ok(regContent.includes("Password criteria shown are client-side input guidance"), "Must disclaim criteria as client aid, not server security");
  assert.ok(regContent.includes("Investor Category"), "Register must include investor category selector");
  assert.ok(regContent.includes("Optional — subject to advisory qualification"), "Investor category must be marked optional");

  // 3. Settings Page Integrity
  const settingsPath = path.join(rootDir, "src", "app", "dashboard", "settings", "page.tsx");
  assert.ok(fs.existsSync(settingsPath), "dashboard/settings/page.tsx must exist");
  const settingsContent = fs.readFileSync(settingsPath, "utf-8");
  assert.ok(settingsContent.includes("Personal &amp; Entity Profile"), "Settings must include profile section");
  assert.ok(settingsContent.includes("Change Password"), "Settings must include security section");
  assert.ok(settingsContent.includes("Two-Factor Authentication (2FA)"), "Settings must include 2FA status");
  assert.ok(settingsContent.includes("Pending Telecom DLT Registration"), "2FA must clearly label pending backend integration");
  assert.ok(settingsContent.includes("Communication Preferences"), "Settings must include notifications section");
  assert.ok(settingsContent.includes("Privacy &amp; Data Protection Compliance"), "Settings must include privacy section");
  assert.ok(settingsContent.includes("/delete-account/"), "Settings must link to DPDP deletion workflow");
});
