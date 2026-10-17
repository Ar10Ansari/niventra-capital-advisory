import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Building,
  Home,
  Briefcase,
  RefreshCw,
  ShieldCheck,
  MapPin,
  FileCheck2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";

export const metadata: Metadata = {
  title: "Real Estate | Niventra Capital Advisory India",
  description:
    "Explore real estate capital solutions and project evaluation across residential, commercial, mixed-use, and redevelopment projects in India. Illustrative 7-stage developer evaluation framework.",
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
            HERO: Editorial Composition with Panoramic Architectural Photography
            ================================================================== */}
        <section
          className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden"
          aria-label="Overview"
        >
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

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    href="/contact/"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Schedule a Consultation
                  </Button>
                  <Button
                    variant="primary-outline"
                    size="lg"
                    href="/debt-debenture/"
                  >
                    Explore Debenture Advisory
                  </Button>
                </div>

                {/* Institutional Underwriting Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[rgba(26,26,26,0.08)]">
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)] shadow-2xs">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Evaluation Framework
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      Illustrative 7-Stage Workflow
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5 font-body">
                      Indicative roadmap for technical, financial, and legal review
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)] shadow-2xs">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Indicative Asset-Cover Target Benchmark
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      1.5x – 2.0x Target Cover
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5 font-body">
                      Potential first or pari-passu charge subject to transaction-specific valuation, definitive documentation, and statutory ROC filing where applicable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Panoramic Architectural Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.12)] shadow-[0_12px_40px_rgba(26,26,26,0.08)] bg-white aspect-[4/3] group">
                  <Image
                    src="/assets/images/re_hero_skyline.jpg"
                    alt="Panoramic architectural photography of premier metropolitan commercial and residential towers in an Indian urban corridor"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/75 via-[#1A1A1A]/20 to-transparent" />

                  {/* Floating Metadata Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)] shadow-md">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Target Real Estate Asset Class
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Tier-1 Residential &amp; Grade-A Commercial Developments
                    </span>
                    <span className="text-[0.6875rem] text-[#7A7A7A] mt-0.5 block">
                      Strictly RERA-Approved Projects with Architect-Certified Milestones
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 1: TARGET REAL ESTATE SECTORS (VISUAL SHOWCASE)
            ================================================================== */}
        <section
          className="py-16 sm:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]"
          aria-labelledby="asset-categories"
        >
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 sm:mb-14">
              <span className="text-eyebrow mb-2 block">Portfolio Focus</span>
              <h2
                id="asset-categories"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Target Real Estate Asset Categories
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                Niventra focuses exclusively on project categories with strong underlying end-user demand, verified municipal infrastructure connectivity, and proven developer execution track records. We do not participate in speculative unapproved land banking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Category 1: Residential Developments */}
              <div className="bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] overflow-hidden shadow-2xs hover:border-[#9A7B2C]/40 transition-all duration-200 flex flex-col group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="/assets/images/re_residential_tower.jpg"
                    alt="Contemporary luxury residential high-rise tower with stone and glass facade"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs text-[0.625rem] font-semibold text-[#1A1A1A] border border-[rgba(26,26,26,0.08)]">
                    Residential
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-md bg-white border border-[rgba(26,26,26,0.08)] flex items-center justify-center text-[#9A7B2C]">
                      <Home className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                      Residential Developments
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                      Mid-market and premium housing developments possessing full RERA sanctions, clear legal titles, and demonstrated micro-market sales velocity.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] text-[0.6875rem] text-[#8A8A8A] font-mono">
                    RERA Registered · Title Audited · Milestone Escrow
                  </div>
                </div>
              </div>

              {/* Category 2: Commercial Real Estate */}
              <div className="bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] overflow-hidden shadow-2xs hover:border-[#9A7B2C]/40 transition-all duration-200 flex flex-col group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="/assets/images/re_commercial_grade_a.jpg"
                    alt="Grade-A commercial corporate headquarters glass building with arrival court"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs text-[0.625rem] font-semibold text-[#1A1A1A] border border-[rgba(26,26,26,0.08)]">
                    Commercial
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-md bg-white border border-[rgba(26,26,26,0.08)] flex items-center justify-center text-[#9A7B2C]">
                      <Briefcase className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                      Commercial Real Estate
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                      Grade-A office complexes and corporate campuses in high-density urban employment corridors with institutional pre-leasing or stable absorption.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] text-[0.6875rem] text-[#8A8A8A] font-mono">
                    Grade-A Specifications · High Pre-lease · Transit Linked
                  </div>
                </div>
              </div>

              {/* Category 3: Mixed-Use Projects */}
              <div className="bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] overflow-hidden shadow-2xs hover:border-[#9A7B2C]/40 transition-all duration-200 flex flex-col group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="/assets/images/re_mixed_use_development.jpg"
                    alt="Modern mixed-use urban promenade with retail colonnade and contemporary glass towers"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs text-[0.625rem] font-semibold text-[#1A1A1A] border border-[rgba(26,26,26,0.08)]">
                    Mixed-Use
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-md bg-white border border-[rgba(26,26,26,0.08)] flex items-center justify-center text-[#9A7B2C]">
                      <Building className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                      Mixed-Use Projects
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                      Integrated developments combining open-air retail high streets with residential or corporate towers, creating diversified cash flow profiles.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] text-[0.6875rem] text-[#8A8A8A] font-mono">
                    Diversified Cashflows · Retail Footfall · Phased Capex
                  </div>
                </div>
              </div>

              {/* Category 4: Redevelopment Projects */}
              <div className="bg-[#FAFAF7] rounded-xl border border-[rgba(26,26,26,0.08)] overflow-hidden shadow-2xs hover:border-[#9A7B2C]/40 transition-all duration-200 flex flex-col group">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="/assets/images/re_urban_redevelopment.jpg"
                    alt="Sustainable urban redevelopment precinct with modern residential architecture and landscaped pedestrian courts"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs text-[0.625rem] font-semibold text-[#1A1A1A] border border-[rgba(26,26,26,0.08)]">
                    Redevelopment
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-md bg-white border border-[rgba(26,26,26,0.08)] flex items-center justify-center text-[#9A7B2C]">
                      <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                      Redevelopment Projects
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                      Brownfield urban regeneration and housing society redevelopments in prime Tier-1 micro-markets with verified statutory consent thresholds.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] text-[0.6875rem] text-[#8A8A8A] font-mono">
                    Infill Micro-markets · Society Consent · Rapid Infill Demand
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: MARKET ECOSYSTEM FOCUS & DEVELOPER BENCHMARKS
            (Draft for Internal & Corporate Review — Compliance Safeguarded)
            ================================================================== */}
        <section
          className="py-16 sm:py-20 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)]"
          aria-labelledby="market-ecosystems"
        >
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Market Ecosystem Focus · Draft for Company Review
                </span>
              </div>
              <h2
                id="market-ecosystems"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Institutional Real Estate Corridors &amp; Developer Ecosystems
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                Niventra&apos;s real estate research focuses on Tier-1 micro-markets and prime development corridors across India. We track established listed developers and prominent market participants — such as DLF and M3M within the Northern corridor — as institutional benchmarks for construction velocity, micro-market absorption, and capital structure standards.
              </p>
            </div>

            {/* Compliance Governance Notice */}
            <div className="mb-10 max-w-4xl">
              <CalloutNotice variant="neutral" title="Governance & Compliance Review Status">
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed">
                  <strong>Draft for Internal Review &amp; Legal Counsel:</strong> Mention of developer ecosystems (including DLF, M3M, and industry peers) serves solely as illustrative market context and micro-market reference. This section does not constitute an announcement of direct investment, partnership, underwriting relationship, sponsorship, or corporate endorsement. Final publication of any specific portfolio participation or co-investment structure remains subject to verified transaction documentation and authorized corporate review.
                </p>
              </CalloutNotice>
            </div>

            {/* Micro-market Corridor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 bg-white rounded-xl border border-[rgba(26,26,26,0.08)] space-y-3 shadow-2xs">
                <div className="w-9 h-9 rounded-md bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Delhi-NCR Growth Corridors
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Focus on Golf Course Extension Road, Southern Peripheral Road (SPR), CyberCity, and Dwarka Expressway. Benchmark tracking of Grade-A commercial absorption and luxury residential demand led by prominent regional developers.
                </p>
                <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] text-[0.6875rem] text-[#8A8A8A] font-mono">
                  Micro-market Focus: CyberCity &amp; Golf Course Ext.
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-[rgba(26,26,26,0.08)] space-y-3 shadow-2xs">
                <div className="w-9 h-9 rounded-md bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Mumbai Metropolitan Region
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Focus on high-velocity Western Suburbs redevelopment, Central Mumbai commercial infill, and Navi Mumbai transit corridors with verified MHADA/SRA regulatory compliance benchmarks.
                </p>
                <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] text-[0.6875rem] text-[#8A8A8A] font-mono">
                  Micro-market Focus: Western Suburbs &amp; Transit Hubs
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl border border-[rgba(26,26,26,0.08)] space-y-3 shadow-2xs">
                <div className="w-9 h-9 rounded-md bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                  <FileCheck2 className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Southern Technology Hubs
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Focus on Bengaluru (Outer Ring Road &amp; Whitefield) and Hyderabad (HITEC City &amp; Financial District) commercial campuses and surrounding residential submarkets with strong institutional covenants.
                </p>
                <div className="pt-3 border-t border-[rgba(26,26,26,0.06)] text-[0.6875rem] text-[#8A8A8A] font-mono">
                  Micro-market Focus: ORR Tech Corridor &amp; HITEC City
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: ILLUSTRATIVE 7-STAGE EVALUATION FRAMEWORK
            ================================================================== */}
        <section
          className="py-16 sm:py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]"
          aria-labelledby="funding-journey"
        >
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12 sm:mb-14">
              <span className="text-eyebrow mb-2 block">Developer Capital Process · Advisory Framework</span>
              <h2
                id="funding-journey"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                Illustrative 7-Stage Evaluation Framework
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                An illustrative procedural roadmap outlining prospective governance checkpoints from preliminary developer submission through to potential milestone-based disbursement:
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
                  desc: "Promoter background scrutiny, MCA corporate filing checks, GST compliance, credit bureau scoring, and statutory tax clearance verification.",
                },
                {
                  step: "Stage 03",
                  title: "Proposed Legal & Regulatory Due Diligence",
                  desc: "Requirement for independent legal title search (typically 30+ years), encumbrance certification, sanctioned architectural plan inspection, and RERA registration verification by qualified legal counsel.",
                },
                {
                  step: "Stage 04",
                  title: "Technical & Financial Feasibility Review",
                  desc: "Civil engineering cost review, construction timeline stress-testing, micro-market absorption rate modeling, and cash-flow sensitivity analysis under market downturn scenarios.",
                },
                {
                  step: "Stage 05",
                  title: "Investment Committee Evaluation",
                  desc: "Presentation to the advisory investment committee for review of indicative security coverage, collateral valuation haircuts, debt service coverage ratio (DSCR), and approval.",
                },
                {
                  step: "Stage 06",
                  title: "Definitive Documentation & Statutory Charge Filing",
                  desc: "Drafting and execution of definitive agreements (including Debenture Trust Deed, Term Sheet, Guarantees, and Escrow controls), followed by proposed Form CHG-9 charge registration with the Registrar of Companies where applicable, subject to legal review.",
                },
                {
                  step: "Stage 07",
                  title: "Milestone Disbursement & Project Monitoring",
                  desc: "Structured tranche-based capital deployment tied to architect-certified physical construction milestones, accompanied by periodic site reviews and escrow cash-flow controls.",
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

            {/* Section CTAs */}
            <div className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                href="/contact/"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Submit Developer Project Proposal
              </Button>
              <Button
                variant="primary-outline"
                size="lg"
                href="/due-diligence/"
              >
                Explore Due Diligence Standards
              </Button>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: INSTITUTIONAL ADVISORY CONSULTATION BANNER
            ================================================================== */}
        <section
          className="py-16 sm:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]"
          aria-label="Advisory Consultation"
        >
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-2xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xs">
              <div className="max-w-2xl space-y-2">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                  Confidential Advisory Engagement
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                  Initiate Developer Capital or Real Estate Advisory
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Connect with our advisory committee to discuss project underwriting, capital structuring, or independent due diligence parameters for qualifying developments.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  href="/contact/"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Schedule Advisory Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
