import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Building, Home, Briefcase, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Real Estate | Niventra Capital Advisory India",
  description:
    "Explore real estate capital solutions and project evaluation across residential, commercial, mixed-use, and redevelopment projects in India. Complete 7-stage developer funding workflow.",
  alternates: {
    canonical: "/real-estate/",
  },
};

export default function RealEstatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/real-estate/" />

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
                    Asset Advisory &amp; Project Underwriting
                  </span>
                </div>

                <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A]">
                  Connecting capital with{" "}
                  <em className="not-italic text-[#9A7B2C]">
                    real estate growth.
                  </em>
                </h1>

                <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                  We evaluate, underwrite, and structure institutional capital deployment into high-potential real estate developments across India — aligning developer growth objectives with disciplined investor risk parameters.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Underwriting Standard
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      7-Stage Developer Workflow
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      RERA audits, title certification &amp; site feasibility
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Collateral Benchmark
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      1.5x – 2.0x Asset Cover
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      ROC Form CHG-9 first / pari-passu charge
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/commercial_development.jpg"
                    alt="Contemporary mixed-use commercial and residential urban development in an Indian metropolitan growth corridor"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Target Asset Focus
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      RERA-Approved Prime Commercial &amp; Residential Projects
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 1: TARGET REAL ESTATE SECTORS
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="asset-categories">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-14">
              <span className="text-eyebrow mb-2 block">Portfolio Focus</span>
              <h2
                id="asset-categories"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Target Real Estate Sectors
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                Niventra focuses exclusively on project categories with strong underlying end-user demand, verified municipal infrastructure connectivity, and proven developer execution track records. We do not participate in speculative unapproved land banking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                  <Home className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Residential Developments
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Mid-market and affordable housing projects possessing full RERA sanctions and proven micro-market sales velocity.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                  <Briefcase className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Commercial Real Estate
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Grade-A office spaces and boutique commercial hubs in high-density urban employment corridors with pre-leasing interest.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                  <Building className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Mixed-Use Projects
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Integrated developments combining retail high-streets with residential or corporate towers, diversifying project cash flows.
                </p>
              </div>

              <div className="p-6 bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                  <RefreshCw className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Redevelopment Projects
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Brownfield urban regeneration and housing society redevelopments in prime tier-1 micro-markets with verified consent thresholds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: 7-STAGE PROJECT EVALUATION JOURNEY
            ================================================================== */}
        <section className="py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="funding-journey">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-14">
              <span className="text-eyebrow mb-2 block">Developer Capital Process</span>
              <h2
                id="funding-journey"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                The 7-Stage Project Evaluation Journey
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                From preliminary submission to milestone disbursement, every project passes through our sequential governance checkpoints:
              </p>
            </div>

            <ol className="space-y-4">
              {[
                {
                  step: "Stage 01",
                  title: "Initial Application & Screening",
                  desc: "Developer submits project fundamentals, land ownership documentation, promoter background, and preliminary capital requirement details for high-level suitability review.",
                },
                {
                  step: "Stage 02",
                  title: "KYC & Compliance Verification",
                  desc: "Comprehensive promoter background scrutiny, MCA corporate filing checks, GST compliance, credit bureau scoring, and statutory tax clearance verification.",
                },
                {
                  step: "Stage 03",
                  title: "Independent Due Diligence",
                  desc: "Third-party legal title search for 30+ years, encumbrance verification, sanctioned architectural plan inspection, and RERA registration compliance verification.",
                },
                {
                  step: "Stage 04",
                  title: "Technical & Financial Feasibility",
                  desc: "Detailed civil engineering cost audits, construction timeline stress-testing, absorption rate modeling, and cash-flow sensitivity analysis under market downturn scenarios.",
                },
                {
                  step: "Stage 05",
                  title: "Investment Committee Evaluation",
                  desc: "Formal presentation to the advisory investment committee for review of security coverage, collateral valuation haircuts, debt service coverage ratio (DSCR), and approval.",
                },
                {
                  step: "Stage 06",
                  title: "Definitive Agreements & ROC Charge Creation",
                  desc: "Execution of Debenture Trust Deed, Term Sheet, Personal / Corporate Guarantees, Escrow Agreements, and registration of Form CHG-9 with the Registrar of Companies.",
                },
                {
                  step: "Stage 07",
                  title: "Milestone Disbursement & Continuous Monitoring",
                  desc: "Tranche-based capital release strictly tied to architect-certified physical construction milestones, monitored via continuous site audits and escrow cash-flow controls.",
                },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start shadow-2xs"
                >
                  <div className="md:col-span-2">
                    <span
                      className="font-mono text-xs font-bold tracking-wider uppercase block"
                      style={{ color: "var(--color-brass)" }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <div className="md:col-span-10 space-y-1">
                    <h3 className="font-heading text-base sm:text-lg font-semibold text-[#1A1A1A]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
              <Button variant="primary" size="lg" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                Submit Developer Project Proposal
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
