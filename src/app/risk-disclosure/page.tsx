import React from "react";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";

export const metadata: Metadata = {
  title: "Risk Disclosure | Niventra Capital Advisory India",
  description:
    "Statutory risk disclosure statement covering market risk, credit risk, construction delay risk, and liquidity lock-in for private debt and debentures.",
  alternates: {
    canonical: "/risk-disclosure/",
  },
};

export default function RiskDisclosurePage() {
  const riskClauses = [
    {
      id: "market-risk",
      num: "01",
      title: "Market & Real Estate Cyclicality Risk",
      desc: "Real estate property valuations, absorption velocity, and commercial rental yields are subject to macroeconomic fluctuations, interest rate changes, inflationary pressures, and local property supply gluts. A downturn in the specific micro-market where an asset is situated may affect sales velocity, developer cash flows, and subsequent debt servicing capabilities.",
      mitigation: "Rigorous micro-market feasibility studies and conservative underwriting LTVs (≤60%).",
    },
    {
      id: "credit-risk",
      num: "02",
      title: "Credit & Obligor Default Risk",
      desc: "While structured non-convertible debentures facilitated by Niventra are secured by collateral charges registered under Form CHG-9 with the Registrar of Companies, there remains an inherent risk that an issuer or underlying borrower may experience insolvency, financial distress, or bankruptcy. In such events, recovery of principal and accrued interest is subject to the enforcement of the Debenture Trust Deed and recovery processes under the Insolvency and Bankruptcy Code (IBC), 2016.",
      mitigation: "Dual corporate guarantees, personal promoter covenants, and hypothecated escrow cashflows.",
    },
    {
      id: "execution-risk",
      num: "03",
      title: "Construction & Project Execution Delay Risk",
      desc: "Real estate developments depend on multiple statutory approvals (environmental clearance, fire NOC, height clearances, municipal sanctions), supply chain availability of raw materials (cement, steel), labor availability, and contractor execution capabilities. Unforeseen litigation, force majeure events, or administrative delays may prolong project completion beyond anticipated schedules, postponing milestone-linked cash flows.",
      mitigation: "Independent Project Monitoring Engineers (LIE/PMA) certify construction milestones before tranche disbursements.",
    },
    {
      id: "liquidity-risk",
      num: "04",
      title: "Illiquidity & Secondary Market Lock-In Risk",
      desc: "Unlisted private placement debentures lack an active, liquid secondary trading market. Investors cannot redeem debentures prematurely on demand prior to contractual maturity unless explicitly provided under early redemption clauses in the applicable term sheet. Capital committed to these instruments should be treated as long-term, illiquid allocation.",
      mitigation: "Clear predetermined tenure horizons (18–36 months) with defined quarterly coupon distributions.",
    },
    {
      id: "regulatory-risk",
      num: "05",
      title: "Legal, Regulatory & Statutory Taxation Risk",
      desc: "Changes in tax regulations, stamp duty enactments, municipal zoning laws, or SEBI/RBI guidelines governing non-banking financial transactions may impact net realized yields. Interest coupons paid on debentures are subject to Tax Deducted at Source (TDS) under Section 193/194A of the Income Tax Act, 1961, and are taxed at the investor's applicable marginal income tax rates.",
      mitigation: "Standardized tax structuring advisory and legal opinions prior to indenture execution.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/risk-disclosure/" />

      <main id="main-content" className="flex-1">
        <PageHero
          breadcrumbItems={[{ label: "Risk Disclosure" }]}
          eyebrow="Statutory Disclosure Statement"
          title="Understanding the inherent risks of"
          highlightedText="capital deployment."
          description={
            <p>
              Capital allocation in structured debt, private debentures, and real estate
              involves material financial, legal, and operational risks. Please review these
              disclosures carefully before making any investment commitments.
            </p>
          }
          sideContent={
            <div className="p-6 bg-white rounded-lg border border-[rgba(26,26,26,0.08)] space-y-2">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A]">
                Statutory Status
              </span>
              <p className="font-heading text-lg font-[600] text-[#1A1A1A]">
                Mandatory Disclosure
              </p>
              <p className="text-xs text-[#5C5C5C] leading-relaxed">
                Companies Act, 2013 (Section 42 & 71) & SEBI Private Placement Guidelines.
              </p>
            </div>
          }
        />

        {/* ==================================================================
            STATUTORY CALLOUT
            ================================================================== */}
        <div className="container-editorial pt-8 pb-4">
          <CalloutNotice variant="warning" title="Mandatory Regulatory Warning">
            Investments in unlisted private debentures and structured debt instruments are not
            insured deposits, do not carry sovereign guarantees, and are subject to market,
            credit, and liquidity risks. Indicative target yields of 12%–16% p.a. are not
            guaranteed. Investors may face loss of principal in the event of obligor default.
          </CalloutNotice>
        </div>

        {/* ==================================================================
            DETAILED RISK CLAUSES & STICKY SIDEBAR
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-label="Detailed Risk Categories">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Clauses */}
              <div className="lg:col-span-8 space-y-8">
                {riskClauses.map((clause) => (
                  <div
                    key={clause.id}
                    id={clause.id}
                    className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm transition-all hover:border-[rgba(154,123,44,0.3)]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono font-semibold text-[#9A7B2C] bg-[rgba(154,123,44,0.1)] px-2.5 py-1 rounded">
                        Clause {clause.num}
                      </span>
                      <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                        {clause.title}
                      </h2>
                    </div>

                    <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8] mb-6">
                      {clause.desc}
                    </p>

                    <div className="p-4 rounded bg-[#FAFAF7] border-l-2 border-[#9A7B2C] space-y-1">
                      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#9A7B2C] block">
                        Advisory Structuring Safeguard:
                      </span>
                      <p className="text-xs text-[#5C5C5C] leading-relaxed">
                        {clause.mitigation}
                      </p>
                    </div>
                  </div>
                ))}

                {/* INDEPENDENT PROFESSIONAL ADVICE NOTICE */}
                <div className="bg-[#F4F3EF] border border-[rgba(26,26,26,0.1)] rounded-lg p-8 sm:p-10 space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                    Requirement for Independent Professional Advice
                  </h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Niventra Capital Advisory India Pvt. Ltd. acts as an advisory and structuring
                    intermediary. Information presented on this website does not constitute personalized
                    tax, legal, or investment recommendations. Prospective investors are strongly urged
                    to consult their own independent legal counsel, chartered accountants, and SEBI-registered
                    investment advisers before subscribing to any debt debenture structure.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Button variant="primary" size="md" href="/due-diligence/" icon={<ArrowRight className="w-4 h-4" />}>
                    Review Due Diligence Safeguards
                  </Button>
                  <Button variant="primary-outline" size="md" href="/regulatory-disclosures/">
                    View Regulatory Disclosures
                  </Button>
                </div>
              </div>

              {/* Right Column: Sticky Navigation & Statutory Safeguards */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <div className="bg-white p-6 rounded-lg border border-[rgba(26,26,26,0.08)] shadow-sm space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Risk Table of Contents
                  </p>
                  <nav className="space-y-2">
                    {riskClauses.map((c) => (
                      <a
                        key={c.id}
                        href={`#${c.id}`}
                        className="block text-xs text-[#5C5C5C] hover:text-[#9A7B2C] hover:translate-x-1 transition-all py-1 border-b border-[rgba(26,26,26,0.04)]"
                      >
                        <span className="font-mono text-[#9A7B2C] mr-2">{c.num}.</span>
                        {c.title.split(" Risk")[0]}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="p-6 bg-[#F4F3EF] rounded-lg border border-[rgba(26,26,26,0.08)] space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Key Regulatory Safeguards
                  </p>
                  <ul className="space-y-2 text-xs text-[#5C5C5C]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#9A7B2C] font-bold">✓</span>
                      <span>ROC Form CHG-9 charge registration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#9A7B2C] font-bold">✓</span>
                      <span>Independent Debenture Trustee oversight</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#9A7B2C] font-bold">✓</span>
                      <span>Dedicated escrow cash-flow monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#9A7B2C] font-bold">✓</span>
                      <span>Section 42 private placement compliance</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
