import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, FileText, Lock, Building2, Landmark, Coins } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";

export const metadata: Metadata = {
  title: "Capital Providers | Niventra Capital Advisory India",
  description:
    "Institutional guide for capital providers, HNIs, and family offices evaluating private debt debentures in India. Key highlights, bond classifications, and due diligence frameworks.",
  alternates: {
    canonical: "/capital-providers/",
  },
};

export default function CapitalProvidersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/capital-providers/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Composition with Architectural Photography
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Typographic Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                    Institutional Capital Reference · Section 42
                  </span>
                </div>

                <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A]">
                  Structured fixed-income for{" "}
                  <em className="not-italic text-[#9A7B2C]">
                    eligible capital providers.
                  </em>
                </h1>

                <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                  A comprehensive reference framework for High Net Worth Individuals (HNIs), Family Offices, and Institutional Treasuries seeking secured, asset-backed fixed-income yields through structured non-convertible debentures.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Indicative Target Yield
                    </span>
                    <p className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                      12% – 16% <span className="text-xs font-normal text-[#5C5C5C]">p.a.*</span>
                    </p>
                    <p className="text-xs text-[#8A8A8A] mt-0.5 font-body">
                      Subject to asset security and product approval
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Statutory Framework
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      Companies Act, 2013
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5 font-body">
                      Private placement under Section 42 / Form PAS-4
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/hero_commercial_architecture.jpg"
                    alt="Institutional commercial financial tower representing Niventra structured private debt solutions"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Accredited Placement Scope
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Private Debt for Discerning Family Offices &amp; Treasuries
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            STATUTORY COMPLIANCE CALLOUT
            ================================================================== */}
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <CalloutNotice variant="neutral" title="Informational Reference Notice">
            This page provides educational and conceptual frameworks regarding structured debt instruments. It does not constitute a public solicitation, an offer to buy securities, or investment advice. Private placement debentures are issued solely in accordance with Section 42 of the Companies Act, 2013 and applicable regulatory guidelines.
          </CalloutNotice>
        </div>

        {/* ==================================================================
            SECTION 1: KEY STRUCTURAL HIGHLIGHTS
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="key-highlights">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-eyebrow mb-2 block">Instrument Architecture</span>
              <h2
                id="key-highlights"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Key Structural Highlights
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                Core parameters governing structured debt instruments facilitated through our advisory framework:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  label: "Instrument Category",
                  value: "Secured Non-Convertible Debentures",
                  desc: "Senior secured debt instruments issued under the Companies Act, 2013 without equity dilution.",
                },
                {
                  label: "Indicative Yield Guidance",
                  value: "12% – 16% per annum*",
                  desc: "Annualized gross yield paid out on scheduled monthly, quarterly, or cumulative terms.",
                },
                {
                  label: "Security Structure",
                  value: "ROC Charge (Form CHG-9)",
                  desc: "First or pari-passu charge registered with ROC on identified real estate land/receivables.",
                },
                {
                  label: "Intended Issuing Entity",
                  value: "Niventra Capital Advisory India Pvt. Ltd.",
                  desc: "Direct corporate issuer model, subject to ongoing formal compliance and legal verification.",
                },
                {
                  label: "Tenure & Redemption",
                  value: "12 to 60 Months",
                  desc: "Contractually defined maturity dates with full principal redemption upon term completion.",
                },
                {
                  label: "Target Investor Category",
                  value: "HNIs, Family Offices & Corporates",
                  desc: "Accredited capital providers meeting private placement eligibility and net worth thresholds.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-6 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      {item.label}
                    </span>
                    <h3 className="font-heading text-lg font-[600] text-[#1A1A1A] mb-2 leading-snug">
                      {item.value}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: REQUIRED DOCUMENTS (SCANNABLE RESPONSIVE GROUPS)
            Streamlined institutional documentation directory
            ================================================================== */}
        <section className="py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="required-docs">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-eyebrow mb-2 block">Documentation Governance</span>
              <h2
                id="required-docs"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Required Offering Documentation
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                Private debt investments require comprehensive statutory documentation. Formal offering documents are provided directly to verified accredited capital providers upon request:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[
                {
                  title: "Information Memorandum",
                  docType: "Form PAS-4",
                  desc: "Statutory private placement offer letter detailing issuer financials, project specifications, and risk factors.",
                  status: "Available upon verification",
                },
                {
                  title: "Debenture Term Sheet",
                  docType: "Definitive Terms",
                  desc: "Summary of coupon rate, payment frequency, security cover ratio, debenture trustee details, and redemption mechanics.",
                  status: "Per issue tranche",
                },
                {
                  title: "Subscription Agreement",
                  docType: "Application Form",
                  desc: "Formal subscription application capturing investor KYC, bank details, demat account, and DPDP consent.",
                  status: "Compliance workflow",
                },
                {
                  title: "Statutory Risk Disclosure",
                  docType: "Risk Schedule",
                  desc: "Statutory acknowledgment of credit, market, construction delay, and secondary liquidity risk factors.",
                  status: "Mandatory pre-commitment",
                },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-5 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="w-9 h-9 rounded-md bg-[rgba(154,123,44,0.1)] flex items-center justify-center mb-3.5 text-[#9A7B2C]">
                      <FileText className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
                      {doc.docType}
                    </span>
                    <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-2 leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed mb-4 font-body">
                      {doc.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] flex items-center text-[0.6875rem] text-[#7A7A7A]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Lock className="w-3 h-3 text-[#9A7B2C]" aria-hidden="true" />
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border border-[rgba(26,26,26,0.1)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-2xs">
              <div>
                <h4 className="font-heading text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1">
                  Request Documentation Package
                </h4>
                <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-xl font-body">
                  Contact our institutional desk to receive watermarked sample offering documentation and debenture term sheets.
                </p>
              </div>
              <Button variant="primary" size="md" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                Request Documentation
              </Button>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: BOND LIFECYCLE & 10 PRIMARY CLASSIFICATIONS
            Consolidated into scannable institutional clusters
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="bond-guide">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-eyebrow mb-2 block">Investor Education</span>
              <h2
                id="bond-guide"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Understanding Bonds &amp; Debentures
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                A structured bond lifecycle operates in four disciplined phases:
              </p>
            </div>

            {/* 4-Stage Lifecycle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
              {[
                {
                  num: "01",
                  title: "Origination & Structure",
                  desc: "Issuer evaluates capital need, establishes security charge, files offer documentation, and issues debenture tranches.",
                },
                {
                  num: "02",
                  title: "Capital Subscription",
                  desc: "Accredited investor completes KYC, executes subscription agreement, and transfers funds into designated escrow account.",
                },
                {
                  num: "03",
                  title: "Regular Coupon Distribution",
                  desc: "Contractual interest payments distributed at predetermined monthly, quarterly, or annual intervals.",
                },
                {
                  num: "04",
                  title: "Maturity & Redemption",
                  desc: "Full principal face value returned to investor upon reaching the contractual maturity date.",
                },
              ].map((s, idx) => (
                <div key={idx} className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-5 shadow-2xs">
                  <span className="font-mono text-xs font-bold text-[#9A7B2C] block mb-2.5">
                    PHASE {s.num}
                  </span>
                  <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Ten Primary Bond Classifications Organized in 3 Clean Clusters */}
            <div className="pt-4 border-t border-[rgba(26,26,26,0.08)]">
              <div className="max-w-2xl mb-8">
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-[#9A7B2C] block mb-1">
                  Regulatory Taxonomy
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                  Ten Primary Bond Classifications in India
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cluster 1: Sovereign & Civic Debt */}
                <div className="p-6 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[rgba(26,26,26,0.08)]">
                    <Landmark className="w-4 h-4 text-[#9A7B2C]" />
                    <h4 className="font-heading text-sm font-semibold text-[#1A1A1A]">
                      Sovereign &amp; Civic Debt
                    </h4>
                  </div>
                  <div className="space-y-3 font-body">
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Government Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Sovereign-backed securities with zero credit default risk.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Municipal Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Local urban civic body funding for municipal infrastructure projects.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Sovereign Gold Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">RBI-issued government securities denominated in grams of physical gold.</p>
                    </div>
                  </div>
                </div>

                {/* Cluster 2: Corporate & Market Instruments */}
                <div className="p-6 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[rgba(26,26,26,0.08)]">
                    <Building2 className="w-4 h-4 text-[#9A7B2C]" />
                    <h4 className="font-heading text-sm font-semibold text-[#1A1A1A]">
                      Corporate &amp; Market Debt
                    </h4>
                  </div>
                  <div className="space-y-3 font-body">
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Corporate Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Senior debt issued by public and private companies for capital expenditure.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Convertible Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Hybrid debt with embedded contractual option to convert into company equity.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Zero-Coupon Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Issued at a discount; redeemable at full face value without periodic coupons.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Floating Rate Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Coupons adjust periodically based on the benchmark repo rate.</p>
                    </div>
                  </div>
                </div>

                {/* Cluster 3: Structured & Yield Instruments */}
                <div className="p-6 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[rgba(26,26,26,0.08)]">
                    <Coins className="w-4 h-4 text-[#9A7B2C]" />
                    <h4 className="font-heading text-sm font-semibold text-[#1A1A1A]">
                      Structured &amp; Private Credit
                    </h4>
                  </div>
                  <div className="space-y-3 font-body">
                    <div className="p-2.5 rounded bg-white border border-[#9A7B2C]/30 shadow-2xs">
                      <p className="text-xs font-bold text-[#1A1A1A]">High-Yield / Private Debt</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug mt-0.5">Senior secured debentures backed by real estate collateral (Niventra core focus).</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Inflation-Indexed Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Principal and interest adjusted against Consumer Price Index changes.</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">Perpetual Bonds</p>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug">Instruments with no fixed maturity date, generating indefinite periodic yield.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: ILLUSTRATIVE BOND EXAMPLE (VERIFIED SIMPLE MATH)
            ================================================================== */}
        <section className="py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="illustrative-math">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span className="text-eyebrow mb-2 block">Financial Modeling</span>
              <h2
                id="illustrative-math"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Illustrative Fixed-Income Cash-Flow Example
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                A transparent, uncompounded simple interest calculation demonstrating hypothetical cash flows on a secured NCD:
              </p>
            </div>

            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 sm:p-8 max-w-4xl shadow-2xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-[rgba(26,26,26,0.08)]">
                <div>
                  <p className="text-xs text-[#8A8A8A] uppercase tracking-wider mb-1 font-semibold">Principal</p>
                  <p className="font-heading text-2xl font-[600] text-[#1A1A1A]">₹10,00,000</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8A8A] uppercase tracking-wider mb-1 font-semibold">Hypothetical Coupon</p>
                  <p className="font-heading text-2xl font-[600] text-[#9A7B2C]">14.0% p.a.</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8A8A] uppercase tracking-wider mb-1 font-semibold">Tenure</p>
                  <p className="font-heading text-2xl font-[600] text-[#1A1A1A]">36 Months</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8A8A] uppercase tracking-wider mb-1 font-semibold">Payout</p>
                  <p className="font-heading text-2xl font-[600] text-[#1A1A1A]">Quarterly</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                <div>
                  <p className="text-xs text-[#8A8A8A] mb-1 font-medium">Quarterly Coupon Payout (Gross)</p>
                  <p className="font-heading text-xl font-semibold text-[#1A1A1A]">₹35,000 / qtr</p>
                  <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-mono">(₹10,00,000 × 14% ÷ 4)</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8A8A] mb-1 font-medium">Total Interest Across 3 Years</p>
                  <p className="font-heading text-xl font-semibold text-[#1A1A1A]">₹4,20,000</p>
                  <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-mono">(12 quarterly distributions)</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A8A8A] mb-1 font-medium">Total Maturity Realization</p>
                  <p className="font-heading text-xl font-semibold text-[#1A1A1A]">₹14,20,000</p>
                  <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-mono">(Principal returned + total coupon)</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(26,26,26,0.06)] text-[0.75rem] text-[#8A8A8A] leading-relaxed font-body">
                * Note: Figures shown are illustrative and assume simple interest without compounding. Actual returns are subject to applicable Tax Deducted at Source (TDS) under the Income Tax Act, 1961 and specific indenture terms.
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button variant="primary" size="lg" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                Consult With Capital Advisory Team
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
