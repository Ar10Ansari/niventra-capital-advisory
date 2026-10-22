import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";

export const metadata: Metadata = {
  title: "Debt & Debenture | Niventra Capital Advisory India",
  description:
    "Explore structured debt and non-convertible debentures (NCDs) in India. Indicative yield guidance of 12%–16% p.a., key features, risk analysis, and investor due diligence checklists.",
  alternates: {
    canonical: "/debt-debenture/",
  },
};

export default function DebtDebenturePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/debt-debenture/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Overview with Structured Yield Highlights
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Typographic Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                    Structured Debt Solutions · NCDs
                  </span>
                </div>

                <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A]">
                  Providing compliant,{" "}
                  <em className="not-italic text-[#9A7B2C]">
                    structured capital channels.
                  </em>
                </h1>

                <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                  Secured non-convertible debentures (NCDs) under the Companies Act, 2013 — structured for fixed-income predictability, collateral backing, and disciplined repayment priorities.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Indicative Guidance
                    </span>
                    <p className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                      12% – 16% <span className="text-xs font-normal text-[#5C5C5C]">p.a.*</span>
                    </p>
                    <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-body">
                      Indicative target, yields never assured
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Legal Security
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      ROC Form CHG-9
                    </p>
                    <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-body">
                      Registered mortgage charge
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Trustee Oversight
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      Independent Trustee
                    </p>
                    <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-body">
                      Fiduciary collective custody
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Precision Architecture Visual */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/due_diligence_structure.jpg"
                    alt="Precision structural architectural engineering representing disciplined corporate debt underwriting"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Senior Secured Position
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Asset-Backed Collateral with 1.5x–2.0x Coverage Benchmark
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            STATUTORY CALLOUT NOTICE
            ================================================================== */}
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <CalloutNotice variant="brass" title="Important Investment Disclosure">
            Debenture yields and tenures are subject to definitive contract terms and ROC
            charge creation. Past performance does not indicate future results. Investments
            in private debt carry credit, market, and liquidity risks. Review all offering
            documents and term sheets before committing capital.
          </CalloutNotice>
        </div>

        {/* ==================================================================
            SECTION 1: WHAT IS A DEBENTURE — CONCISE OVERVIEW
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="what-is-debenture">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Fixed-Income Instrument</span>
                  <h2
                    id="what-is-debenture"
                    className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]"
                  >
                    What is a Debenture?
                  </h2>
                </div>
                
                <p className="font-body text-sm sm:text-base text-[#5C5C5C] leading-relaxed">
                  A debenture is a debt instrument issued by a corporate entity to raise long-term capital. Unlike equity shares, debentures do not confer ownership rights; the issuer enters into a binding agreement to pay regular interest (coupons) and return the principal at maturity.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2C] mb-1">
                      Fixed Income
                    </p>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                      Predetermined coupon schedule — monthly, quarterly, or annually.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2C] mb-1">
                      Defined Tenor
                    </p>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                      Contractual maturity typically from 12 to 60 months.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2C] mb-1">
                      Priority Repayment
                    </p>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                      Higher claim on cash flows and liquidation proceeds than equity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Capital Seniority Hierarchy */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-4">
                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#9A7B2C] block">
                  Liquidation Priority &amp; Seniority
                </span>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Capital Stack Hierarchy
                </h3>
                
                <div className="space-y-2.5 pt-2">
                  <div className="p-3.5 rounded bg-white border border-[#9A7B2C]/40 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-mono text-xs font-bold flex items-center justify-center">1</span>
                      <div>
                        <span className="text-xs font-semibold text-[#1A1A1A] block">Senior Secured Debentures</span>
                        <span className="text-[0.625rem] text-[#5C5C5C]">First-charge mortgage · Priority claim</span>
                      </div>
                    </div>
                    <span className="text-[0.625rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Highest</span>
                  </div>

                  <div className="p-3.5 rounded bg-white border border-[rgba(26,26,26,0.08)] flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#F4F3EF] text-[#5C5C5C] font-mono text-xs font-bold flex items-center justify-center">2</span>
                      <div>
                        <span className="text-xs font-semibold text-[#1A1A1A] block">Subordinated / Unsecured Debt</span>
                        <span className="text-[0.625rem] text-[#5C5C5C]">Junior ranking claim</span>
                      </div>
                    </div>
                    <span className="text-[0.625rem] font-medium text-[#5C5C5C]">Subordinate</span>
                  </div>

                  <div className="p-3.5 rounded bg-white border border-[rgba(26,26,26,0.08)] flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#F4F3EF] text-[#5C5C5C] font-mono text-xs font-bold flex items-center justify-center">3</span>
                      <div>
                        <span className="text-xs font-semibold text-[#1A1A1A] block">Common Equity / Promoter Capital</span>
                        <span className="text-[0.625rem] text-[#5C5C5C]">Residual claim · First loss absorption</span>
                      </div>
                    </div>
                    <span className="text-[0.625rem] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">First Loss</span>
                  </div>
                </div>

                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-[rgba(26,26,26,0.08)] bg-white mt-4 flex items-center justify-center">
                  <Image
                    src="/assets/images/bond-plant.png"
                    alt="Structured debentures and fixed-income capital preservation illustration"
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-contain p-4"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: BENEFITS & RISKS (TIGHTENED)
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="benefits-risks">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* Benefits */}
              <div className="space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Investor Benefits</span>
                  <h2
                    id="benefits-risks"
                    className="font-heading text-2xl font-[600] text-[#1A1A1A]"
                  >
                    Fixed-Income Advantages
                  </h2>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Predictable Yield Schedule",
                      desc: "Coupons at defined intervals for dependable cash-flow modeling.",
                    },
                    {
                      title: "Collateral Protection",
                      desc: "Priority claims on underlying real estate assets in distress scenarios.",
                    },
                    {
                      title: "Inflation Hedging Potential",
                      desc: "12%–16% p.a.* guidance offers spread above bank fixed deposits.",
                    },
                    {
                      title: "Defined Exit",
                      desc: "Clear contractual maturity without equity market volatility.",
                    },
                  ].map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <strong className="text-sm font-semibold text-[#1A1A1A] block">
                          {b.title}
                        </strong>
                        <span className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                          {b.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inherent Risks */}
              <div className="space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block text-[#9A3412]">Risk Considerations</span>
                  <h2 className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                    Key Risks
                  </h2>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Credit & Default Risk",
                      desc: "Risk that the issuer fails to meet coupon or principal obligations.",
                    },
                    {
                      title: "Execution & Delay Risk",
                      desc: "Construction or regulatory delays may impact project cash flows.",
                    },
                    {
                      title: "Liquidity Risk",
                      desc: "Private placement NCDs lack secondary market liquidity; held to maturity.",
                    },
                    {
                      title: "Taxation & TDS",
                      desc: "Coupon income taxable at applicable slab rates; TDS under Section 193/194A.",
                    },
                  ].map((r, idx) => (
                    <li key={idx} className="flex items-start gap-3.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <strong className="text-sm font-semibold text-[#1A1A1A] block">
                          {r.title}
                        </strong>
                        <span className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                          {r.desc}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: DUE DILIGENCE STANDARDS & VERIFICATION SUMMARY
            ================================================================== */}
        <section className="py-14 lg:py-16 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="due-diligence-summary">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xs">
              <div className="max-w-2xl space-y-2">
                <span className="text-eyebrow block">Prudent Verification</span>
                <h3 id="due-diligence-summary" className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                  8-Point Investor Due Diligence Standards
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Every debenture issuance undergoes independent 30-year title verification, registered ROC Form CHG-9 mortgage charge filing, and appointment of a SEBI-registered debenture trustee. For the complete 8-Point Investor Due Diligence evaluation methodology and 6 Red Flags warning criteria, visit our dedicated underwriting guide.
                </p>
              </div>
              <div className="shrink-0">
                <Button variant="primary-outline" size="md" href="/due-diligence/" icon={<ArrowRight className="w-4 h-4" />}>
                  Explore Due Diligence Standards
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: ADVISORY CONSULTATION CTA
            ================================================================== */}
        <section className="py-14 bg-[#FAFAF7]" aria-label="Advisory Consultation">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A] mb-3">
              Discuss Structured Debt Opportunities
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-lg mx-auto mb-6 leading-relaxed font-body">
              Connect with our advisory desk to review private placement structures and indicative tranche availability.
            </p>
            <Button variant="primary" size="lg" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
              Connect with Advisory Desk
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
