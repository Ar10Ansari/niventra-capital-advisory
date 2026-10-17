import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
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
                  Facilitating secured non-convertible debentures (NCDs) under the Companies Act, 2013 framework — structured to deliver fixed-income predictability, collateral backing, and disciplined repayment priorities for eligible capital providers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Indicative Guidance
                    </span>
                    <p className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                      12% – 16% <span className="text-xs font-normal text-[#5C5C5C]">p.a.*</span>
                    </p>
                    <p className="text-[0.6875rem] text-[#8A8A8A] mt-1">
                      Business target, not guaranteed
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Legal Security
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      ROC Form CHG-9
                    </p>
                    <p className="text-[0.6875rem] text-[#8A8A8A] mt-1">
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
                    <p className="text-[0.6875rem] text-[#8A8A8A] mt-1">
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
            SECTION 1: WHAT IS A DEBENTURE & SENIORITY ARCHITECTURE
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="what-is-debenture">
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
                  A debenture is a debt instrument issued by a corporate entity to raise long-term capital. Unlike equity shares, debentures do not confer ownership rights or voting powers; instead, the issuing entity enters into a legally binding agreement to pay regular interest (coupons) and return the principal face value upon maturity.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2C] mb-1">
                      Fixed Income
                    </p>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed">
                      Predetermined coupon schedule distributed monthly, quarterly, or annually.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2C] mb-1">
                      Defined Tenor
                    </p>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed">
                      Contractual maturity date ranging typically from 12 to 60 months.
                    </p>
                  </div>
                  <div className="p-4 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2C] mb-1">
                      Priority Repayment
                    </p>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed">
                      Higher claim on corporate cash flows and liquidation proceeds than equity.
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
                        <span className="text-[0.625rem] text-[#5C5C5C]">First-charge mortgage backing · Priority claim</span>
                      </div>
                    </div>
                    <span className="text-[0.625rem] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Highest</span>
                  </div>

                  <div className="p-3.5 rounded bg-white border border-[rgba(26,26,26,0.08)] flex items-center justify-between opacity-80">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#F4F3EF] text-[#5C5C5C] font-mono text-xs font-bold flex items-center justify-center">2</span>
                      <div>
                        <span className="text-xs font-semibold text-[#1A1A1A] block">Subordinated / Unsecured Debt</span>
                        <span className="text-[0.625rem] text-[#5C5C5C]">Junior ranking claim · Subordinate to secured debt</span>
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
            SECTION 2: TYPES OF DEBENTURES & COMPARISON
            ================================================================== */}
        <section className="py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="types-features">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-eyebrow mb-2 block">Instrument Classification</span>
              <h2
                id="types-features"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Types and Key Features of Debentures
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                Understanding debenture structures is essential for assessing risk and return parameters:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#9A7B2C] block mb-2">
                  Primary Focus of Niventra Advisory
                </span>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                  Non-Convertible (NCDs)
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Cannot be converted into equity shares. They offer higher interest rates and are redeemed in full at maturity, offering pure debt exposure without dilution.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#9A7B2C] block mb-2">
                  Collateralized Claims
                </span>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                  Secured Debentures
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Backed by specific corporate assets or real property through a charge created with the Registrar of Companies (ROC Form CHG-9), providing recovery recourse in distress.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#9A7B2C] block mb-2">
                  PCDs &amp; FCDs
                </span>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                  Convertible Debentures
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Give the issuer or investor the option to convert a fraction or entirety of the instrument into company shares after a specified holding period.
                </p>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl border border-[rgba(26,26,26,0.08)] overflow-hidden shadow-2xs">
              <div className="p-6 border-b border-[rgba(26,26,26,0.08)]">
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Convertible vs Non-Convertible Debentures
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FAFAF7] text-[0.6875rem] uppercase tracking-wider text-[#8A8A8A] border-b border-[rgba(26,26,26,0.08)]">
                    <tr>
                      <th className="py-3.5 px-6 font-semibold">Parameter</th>
                      <th className="py-3.5 px-6 font-semibold">Non-Convertible Debenture (NCD)</th>
                      <th className="py-3.5 px-6 font-semibold">Convertible Debenture (PCD/FCD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(26,26,26,0.06)] text-[#5C5C5C] font-body">
                    <tr>
                      <td className="py-3.5 px-6 font-medium text-[#1A1A1A]">Conversion Option</td>
                      <td className="py-3.5 px-6">None; strictly redeemed as debt capital</td>
                      <td className="py-3.5 px-6">Converts into equity shares upon terms</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-medium text-[#1A1A1A]">Coupon Yield</td>
                      <td className="py-3.5 px-6">Typically higher fixed coupon yield</td>
                      <td className="py-3.5 px-6">Generally lower coupon due to upside equity option</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-medium text-[#1A1A1A]">Repayment Security</td>
                      <td className="py-3.5 px-6">Full principal returned at maturity</td>
                      <td className="py-3.5 px-6">Subject to equity market valuation upon conversion</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-6 font-medium text-[#1A1A1A]">Investor Profile</td>
                      <td className="py-3.5 px-6">Capital preservation &amp; predictable yields</td>
                      <td className="py-3.5 px-6">Investors seeking hybrid debt-equity growth</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: BENEFITS & RISKS (BALANCED INSTITUTIONAL PRESENTATION)
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="benefits-risks">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* Benefits */}
              <div className="space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Investor Benefits</span>
                  <h3
                    id="benefits-risks"
                    className="font-heading text-2xl font-[600] text-[#1A1A1A]"
                  >
                    Structured Fixed-Income Advantages
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Predictable Yield Schedule",
                      desc: "Coupons are paid at defined regular intervals, providing dependable cash-flow modeling for institutional and family office portfolios.",
                    },
                    {
                      title: "Collateral Protection Priority",
                      desc: "Secured NCDs hold priority claims on underlying real estate assets over common equity and promoter capital in distress scenarios.",
                    },
                    {
                      title: "Inflation Hedging Potential",
                      desc: "Target return guidance of 12%–16% p.a. offers substantial real yield spread above traditional retail bank fixed deposits and sovereign gilts.",
                    },
                    {
                      title: "Defined Exit Milestones",
                      desc: "Clear contractual tenure without the ambiguity of equity market volatility or speculative multiple expansion dependencies.",
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
                  <h3 className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                    Key Financial &amp; Execution Risks
                  </h3>
                </div>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Credit & Obligor Default Risk",
                      desc: "Risk that the issuing entity or underlying project sponsor fails to meet contractual coupon or principal repayment schedules.",
                    },
                    {
                      title: "Real Estate Execution & Delay Risk",
                      desc: "Construction approvals, statutory clearances, or physical development bottlenecks may delay project completion and subsequent cash flows.",
                    },
                    {
                      title: "Liquidity & Illiquidity Risk",
                      desc: "Unlisted private placement debentures lack immediate secondary market liquidity and are intended to be held to full contractual maturity.",
                    },
                    {
                      title: "Taxation & TDS Withholding",
                      desc: "Coupon returns are taxable as per applicable income tax slab rates; statutory TDS (under Section 193/194A) is deducted where applicable.",
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
            SECTION 4: DUE DILIGENCE CHECKLIST & RED FLAGS
            ================================================================== */}
        <section className="py-20 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="due-diligence-checklist">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-eyebrow mb-2 block">Prudent Evaluation</span>
              <h2
                id="due-diligence-checklist"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Investor Due Diligence &amp; Warning Flags
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                We recommend that all prospective capital providers evaluate any debenture offering against this rigorous 8-point due diligence standard:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 8-Point Checklist */}
              <div className="lg:col-span-7 bg-white p-7 rounded-xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#9A7B2C]" aria-hidden="true" />
                  8-Point Investor Due Diligence Checklist
                </h3>
                <ol className="space-y-3.5 text-xs sm:text-sm text-[#5C5C5C] list-decimal pl-4 leading-relaxed font-body">
                  <li><strong>Issuer Legal Standing:</strong> Verify corporate entity incorporation, CIN, and authorized capital on MCA portal.</li>
                  <li><strong>Security &amp; Charge Creation:</strong> Confirm Form CHG-9 charge registration with ROC establishing first or pari-passu charge on identified assets.</li>
                  <li><strong>Debenture Trustee Appointment:</strong> Confirm appointment of an independent SEBI-registered Debenture Trustee for collective security enforcement.</li>
                  <li><strong>Project RERA Registration:</strong> Ensure the underlying real estate development possesses valid, active RERA registration.</li>
                  <li><strong>Escrow Account Ring-Fencing:</strong> Verify that capital disbursements and receivables are routed through a designated escrow bank account.</li>
                  <li><strong>Cash-Flow Coverage Ratio:</strong> Review projected project revenues against debt service requirements (target DSCR &gt; 1.5x).</li>
                  <li><strong>Promoter Track Record &amp; Litigation:</strong> Check for pending disputes, civil suits, or regulatory sanctions on promoters.</li>
                  <li><strong>Repayment &amp; Exit Mechanism:</strong> Scrutinize specific repayment triggers, lock-in terms, and early redemption conditions.</li>
                </ol>
              </div>

              {/* 6 Red Flags */}
              <div className="lg:col-span-5 bg-[#FFF9F2] p-7 rounded-xl border border-[#F2C99D] shadow-2xs">
                <h3 className="font-heading text-lg font-semibold text-[#9A3412] mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#D97706]" aria-hidden="true" />
                  6 Red Flags — Be Cautious
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-[#6E4822] leading-relaxed font-body">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97706]">✕</span>
                    <span><strong>Guaranteed Return Claims:</strong> Promising &ldquo;100% risk-free&rdquo; returns on high-yield debt is illegal and misleading.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97706]">✕</span>
                    <span><strong>Unregistered Charges:</strong> Failure to provide ROC Form CHG-9 certificate of charge registration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97706]">✕</span>
                    <span><strong>Vague Project Backing:</strong> No identified physical real estate project or land parcel backing the issuance.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97706]">✕</span>
                    <span><strong>Absence of Trustee:</strong> Lack of an independent debenture trustee to protect investor rights.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97706]">✕</span>
                    <span><strong>Cash Transactions:</strong> Any request for cash payments or bypassing registered banking channels.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-[#D97706]">✕</span>
                    <span><strong>Missing Documentation:</strong> Reluctance to provide a complete Private Placement Offer Letter (PAS-4).</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-4">
              <Button variant="primary" size="lg" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                Discuss Structured Debt Opportunities
              </Button>
              <Button variant="primary-outline" size="lg" href="/due-diligence/">
                Explore Due Diligence Standards
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
