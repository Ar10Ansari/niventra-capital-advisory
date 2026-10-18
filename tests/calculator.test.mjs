import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  calculateIndicativeReturn,
  validateCalculatorInput,
  formatINR,
  CALCULATOR_BOUNDS,
  TDS_STATUTORY_CAVEAT,
  STATUTORY_FIDUCIARY_DISCLAIMER,
} from "../src/lib/calculator.ts";

const rootDir = process.cwd();

/* ============================================================================
   NIVENTRA CAPITAL ADVISORY — SPRINT 3B TEST SUITE
   Comprehensive validation of the illustrative return calculator, product catalog,
   product detail routes, statutory disclaimers, and mathematical accuracy.
   ============================================================================ */

test("Sprint 3B — Calculation Engine: Mathematical Accuracy (Simple Interest)", () => {
  // Scenario 1: ₹10 Lakh at 14% p.a. for 36 months (3 years)
  // Expected Gross Interest = 1,000,000 * 0.14 * 3 = ₹4,20,000
  const res1 = calculateIndicativeReturn({
    principal: 1_000_000,
    annualRatePct: 14.0,
    tenorMonths: 36,
    payoutFrequency: "QUARTERLY",
  });

  assert.equal(res1.principal, 1_000_000);
  assert.equal(res1.annualRatePct, 14.0);
  assert.equal(res1.tenorMonths, 36);
  assert.equal(res1.totalGrossInterest, 420_000, "10L at 14% for 3 yrs gross interest must be 4,20,000");
  assert.equal(res1.totalMaturityAmount, 1_420_000, "Maturity amount must be principal + gross interest");
  assert.equal(res1.numberOfPayouts, 12, "36 months with quarterly payouts must yield 12 periods");
  assert.equal(res1.periodicPayout, 35_000, "Quarterly payout must be ₹35,000");
  assert.equal(res1.schedule.length, 12, "Schedule must contain 12 payout entries");

  // Scenario 2: ₹25 Lakh at 15% p.a. for 24 months (2 years)
  // Expected Gross Interest = 2,500,000 * 0.15 * 2 = ₹7,50,000
  const res2 = calculateIndicativeReturn({
    principal: 2_500_000,
    annualRatePct: 15.0,
    tenorMonths: 24,
    payoutFrequency: "MONTHLY",
  });

  assert.equal(res2.totalGrossInterest, 750_000, "25L at 15% for 2 yrs gross interest must be 7,50,000");
  assert.equal(res2.totalMaturityAmount, 3_250_000);
  assert.equal(res2.numberOfPayouts, 24, "24 months with monthly payouts must yield 24 periods");
  assert.equal(res2.periodicPayout, 31_250, "Monthly payout must be ₹31,250");

  // Scenario 3: ₹5 Lakh at 12% p.a. for 12 months (1 year)
  // Expected Gross Interest = 500,000 * 0.12 * 1 = ₹60,000
  const res3 = calculateIndicativeReturn({
    principal: 500_000,
    annualRatePct: 12.0,
    tenorMonths: 12,
    payoutFrequency: "ANNUAL",
  });

  assert.equal(res3.totalGrossInterest, 60_000);
  assert.equal(res3.totalMaturityAmount, 560_000);
  assert.equal(res3.numberOfPayouts, 1);
  assert.equal(res3.periodicPayout, 60_000);

  // Scenario 4: ₹50 Lakh at 16% p.a. for 60 months (5 years)
  // Expected Gross Interest = 5,000,000 * 0.16 * 5 = ₹40,00,000
  const res4 = calculateIndicativeReturn({
    principal: 5_000_000,
    annualRatePct: 16.0,
    tenorMonths: 60,
    payoutFrequency: "SEMI_ANNUAL",
  });

  assert.equal(res4.totalGrossInterest, 4_000_000);
  assert.equal(res4.totalMaturityAmount, 9_000_000);
  assert.equal(res4.numberOfPayouts, 10, "60 months semi-annual must yield 10 periods");
  assert.equal(res4.periodicPayout, 400_000);
});

test("Sprint 3B — Calculation Engine: Cumulative Frequency Handling", () => {
  const resCumulative = calculateIndicativeReturn({
    principal: 1_000_000,
    annualRatePct: 14.0,
    tenorMonths: 36,
    payoutFrequency: "CUMULATIVE",
  });

  assert.equal(resCumulative.totalGrossInterest, 420_000);
  assert.equal(resCumulative.totalMaturityAmount, 1_420_000);
  assert.equal(resCumulative.periodicPayout, null, "Cumulative frequency must have null periodic payout");
  assert.equal(resCumulative.numberOfPayouts, 0, "Cumulative frequency must have 0 periodic payouts");
  assert.equal(resCumulative.schedule.length, 0, "Cumulative frequency must not have periodic schedule rows");
});

test("Sprint 3B — Calculation Engine: Input Validation & Boundary Clamping", () => {
  // Below minimum principal (< ₹1 Lakh)
  const valLowPrincipal = validateCalculatorInput({
    principal: 50_000,
    annualRatePct: 14,
    tenorMonths: 36,
    payoutFrequency: "QUARTERLY",
  });
  assert.equal(valLowPrincipal.isValid, false);
  assert.ok(valLowPrincipal.error?.includes("Principal must be between"));

  // Above maximum rate (> 24% p.a.)
  const valHighRate = validateCalculatorInput({
    principal: 1_000_000,
    annualRatePct: 35,
    tenorMonths: 36,
    payoutFrequency: "QUARTERLY",
  });
  assert.equal(valHighRate.isValid, false);
  assert.ok(valHighRate.error?.includes("Annual indicative rate must be between"));

  // Below minimum tenor (< 6 months)
  const valLowTenor = validateCalculatorInput({
    principal: 1_000_000,
    annualRatePct: 14,
    tenorMonths: 3,
    payoutFrequency: "QUARTERLY",
  });
  assert.equal(valLowTenor.isValid, false);
  assert.ok(valLowTenor.error?.includes("Tenor must be between"));

  // Safe clamping when executing calculation with out-of-bound inputs
  const clamped = calculateIndicativeReturn({
    principal: 200_000_000, // Clamped to 100,000,000
    annualRatePct: 30,      // Clamped to 24
    tenorMonths: 150,       // Clamped to 120
    payoutFrequency: "ANNUAL",
  });
  assert.equal(clamped.principal, CALCULATOR_BOUNDS.MAX_PRINCIPAL);
  assert.equal(clamped.annualRatePct, CALCULATOR_BOUNDS.MAX_RATE);
  assert.equal(clamped.tenorMonths, CALCULATOR_BOUNDS.MAX_TENOR_MONTHS);
});

test("Sprint 3B — Calculation Engine: Statutory TDS & Fiduciary Caveats", () => {
  const res = calculateIndicativeReturn({
    principal: 1_000_000,
    annualRatePct: 14.0,
    tenorMonths: 36,
    payoutFrequency: "QUARTERLY",
  });

  assert.equal(res.tdsCaveat, TDS_STATUTORY_CAVEAT, "TDS caveat must match exported constant");
  assert.equal(res.statutoryDisclaimer, STATUTORY_FIDUCIARY_DISCLAIMER, "Fiduciary disclaimer must match exported constant");
  assert.ok(res.tdsCaveat.includes("Section 193 / 194A"), "TDS caveat must reference Section 193/194A");
  assert.ok(res.tdsCaveat.includes("10%"), "TDS caveat must mention standard 10% rate");
  assert.ok(res.tdsCaveat.includes("Form 15G / 15H"), "TDS caveat must mention Form 15G/15H exemptions");
  assert.ok(res.statutoryDisclaimer.includes("12%–16% p.a.*"), "Disclaimer must cite approved 12%–16% guidance");
  assert.ok(res.statutoryDisclaimer.includes("Form PAS-4"), "Disclaimer must reference Form PAS-4");
  assert.ok(res.statutoryDisclaimer.includes("Debenture Trust Deeds"), "Disclaimer must cite Debenture Trust Deeds");

  // Currency Formatter
  assert.equal(formatINR(1_000_000).replace(/\s/g, ""), "₹10,00,000");
});

test("Sprint 3B — Product Catalog Route Integrity (/products/)", () => {
  const catalogPath = path.join(rootDir, "src", "app", "products", "page.tsx");
  assert.ok(fs.existsSync(catalogPath), "src/app/products/page.tsx must exist");
  const content = fs.readFileSync(catalogPath, "utf-8");

  assert.ok(content.includes("metadata: Metadata"), "Catalog route must export Metadata");
  assert.ok(content.includes('canonical: "/products/"'), "Catalog route must define canonical URL /products/");
  assert.ok(content.includes("ProductCatalogView"), "Catalog route must render ProductCatalogView");

  const componentPath = path.join(rootDir, "src", "components", "products", "ProductCatalogView.tsx");
  assert.ok(fs.existsSync(componentPath), "ProductCatalogView component must exist");
  const compContent = fs.readFileSync(componentPath, "utf-8");

  assert.ok(compContent.includes("Section 42 of Companies Act, 2013"), "Catalog must cite Section 42 Private Placement");
  assert.ok(compContent.includes("12%–16% p.a.*"), "Catalog must display approved 12%–16% p.a. yield guidance");
  assert.ok(compContent.includes("Illustrative Model"), "Catalog must explicitly label illustrative models");
  assert.ok(compContent.includes("Non-Transactable Model"), "Catalog must explicitly mark models non-transactable");
  assert.ok(compContent.includes("ROC Form CHG-9"), "Catalog must reference ROC Form CHG-9 charge creation");
});

test("Sprint 3B — Product Detail Dynamic Route Integrity (/products/[slug]/)", () => {
  const detailPath = path.join(rootDir, "src", "app", "products", "[slug]", "page.tsx");
  assert.ok(fs.existsSync(detailPath), "src/app/products/[slug]/page.tsx must exist");
  const content = fs.readFileSync(detailPath, "utf-8");

  assert.ok(content.includes("generateStaticParams"), "Detail route must define generateStaticParams for SSG");
  assert.ok(content.includes("generateMetadata"), "Detail route must define dynamic generateMetadata");
  assert.ok(content.includes("canonical:"), "Detail route must generate canonical metadata");
  assert.ok(content.includes("IndicativeReturnCalculator"), "Detail route must embed pre-loaded IndicativeReturnCalculator");
  assert.ok(content.includes("ROC Form CHG-9"), "Detail route must reference ROC Form CHG-9 security creation");
  assert.ok(content.includes("4-Pillar Risk Evaluation"), "Detail route must include 4-pillar risk analysis");
  assert.ok(content.includes("Download Gated (KYC Required)"), "Detail route must gate document downloads");
  assert.ok(content.includes("Real-money transactions, automatic checkouts"), "Detail route must disclaim disabled transactions");
  assert.ok(content.includes("Schedule Structuring Consultation"), "Detail route CTA must lead to consultation");
});

test("Sprint 3B — Enhanced Calculator Page Preserves All Audit Requirements", () => {
  const calcPath = path.join(rootDir, "src", "app", "calculator", "page.tsx");
  assert.ok(fs.existsSync(calcPath), "calculator/page.tsx must exist");
  const content = fs.readFileSync(calcPath, "utf-8");

  // Preserved assertions from all-routes-integrity.test.mjs
  assert.ok(content.includes("Formally Deferred"), "Must preserve Formally Deferred audit requirement");
  assert.ok(content.includes("Why the Legacy Calculator was Decommissioned"), "Must preserve decommissioned legacy rationale");
  assert.ok(content.includes("Chief Financial Officer"), "Must preserve CFO certification requirement");

  // New Sprint 3B additions
  assert.ok(content.includes("IndicativeReturnCalculator"), "Must embed new IndicativeReturnCalculator component");
  assert.ok(content.includes("Development Preview"), "Must clearly label illustrative calculator as development preview");
});
