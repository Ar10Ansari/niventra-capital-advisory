import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  FileCheck2,
  Building2,
  Scale,
  ChevronRight,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ConsultationForm } from "@/components/forms/ConsultationForm";

export const metadata: Metadata = {
  title: "Niventra Capital Advisory India | Professional Structured Capital & Real Estate Advisory",
  description:
    "Niventra Capital Advisory India structures senior secured debentures and evaluates commercial and residential real estate capital solutions across India.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Composition with Architectural Photography
            Left: Authoritative positioning, headline & CTAs
            Right: Architectural visual framed with institutional metadata
            ================================================================== */}
        <section
          className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden"
          aria-label="Introduction and Overview"
        >
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Typographic Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                    Structured Capital &amp; Real Estate Advisory
                  </span>
                </div>

                <h1 className="font-heading text-[clamp(2.4rem,4.8vw,4.25rem)] font-[500] leading-[1.08] tracking-[-0.025em] text-[#1A1A1A] mb-6">
                  Connecting eligible capital with professionally evaluated{" "}
                  <em className="not-italic text-[#9A7B2C]">
                    real estate opportunities.
                  </em>
                </h1>

                <p className="text-[1.0625rem] text-[#5C5C5C] leading-[1.75] max-w-[560px] mb-8 font-body">
                  Niventra facilitates senior secured debt debentures and bespoke project
                  capital solutions — connecting discerning capital providers with rigorously
                  audited commercial and residential property developments across India.
                </p>

                {/* Primary & Secondary Action CTAs */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
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

                {/* Statutory Yield Guidance Qualification */}
                <div className="pt-4 border-t border-[rgba(26,26,26,0.08)] max-w-[540px]">
                  <p className="text-[0.75rem] text-[#8A8A8A] leading-relaxed">
                    <span className="text-[#9A7B2C] font-bold">*</span>{" "}
                    Indicative debenture yield guidance of 12%–16% p.a. is indicative business guidance. Subject to formal offer documentation, ROC charge creation, and statutory approvals under the Companies Act, 2013. Past performance does not indicate future results.
                  </p>
                </div>
              </div>

              {/* Right Column: Editorial Architectural Imagery */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.12)] shadow-[0_12px_40px_rgba(26,26,26,0.08)] bg-white aspect-[4/3] group">
                  <Image
                    src="/assets/images/hero_commercial_architecture.jpg"
                    alt="Contemporary commercial financial headquarters representing Niventra institutional real estate advisory"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />

                  {/* Image Overlaid Metadata Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)] shadow-md flex items-center justify-between">
                    <div>
                      <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                        Capital Deployment Standard
                      </span>
                      <span className="text-xs font-semibold text-[#1A1A1A]">
                        First Pari-Passu Charge (ROC Form CHG-9)
                      </span>
                    </div>
                    <span className="text-[0.6875rem] font-mono text-[#5C5C5C] bg-[#FAFAF7] px-2 py-1 rounded border border-[rgba(26,26,26,0.08)]">
                      Sec. 42 / 71
                    </span>
                  </div>
                </div>

                {/* Floating Metric Badge */}
                <div className="hidden sm:flex items-center gap-3 absolute -top-5 -left-5 bg-white p-3.5 rounded-lg border border-[rgba(26,26,26,0.1)] shadow-lg">
                  <div className="w-9 h-9 rounded-full bg-[rgba(154,123,44,0.1)] flex items-center justify-center text-[#9A7B2C]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[0.625rem] uppercase tracking-wider text-[#8A8A8A] font-bold block">
                      Security Benchmark
                    </span>
                    <span className="text-xs font-bold text-[#1A1A1A]">
                      1.5x–2.0x Asset Cover
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 1: Core Institutional Tenets (Varied Editorial Grid)
            ================================================================== */}
        <section className="py-16 sm:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
              <div className="lg:col-span-5">
                <span className="text-eyebrow mb-2 block">Institutional Foundations</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] leading-snug">
                  A disciplined bridge between capital providers and verified obligors.
                </h2>
              </div>
              <div className="lg:col-span-7 text-xs sm:text-sm text-[#5C5C5C] leading-relaxed">
                Niventra operates at the intersection of private credit and real estate development. We eliminate speculative underwriting by implementing structural safeguards, independent engineering monitors, and statutory legal covenants before any capital commitment is arranged.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Building2,
                  title: "Senior Secured Debentures",
                  desc: "Non-convertible debentures (NCDs) structured under the Companies Act, 2013 with formal ROC mortgage charge creation (CHG-9) in favor of an independent debenture trustee.",
                  link: "/debt-debenture/",
                  linkText: "Debenture Advisory",
                },
                {
                  icon: FileCheck2,
                  title: "5-Pillar Due Diligence",
                  desc: "Comprehensive 30-year legal title searches, financial forensics, micro-market absorption analysis, on-site technical audits, and escrow waterfall architecture.",
                  link: "/due-diligence/",
                  linkText: "Due Diligence Process",
                },
                {
                  icon: Scale,
                  title: "Statutory Governance & DPDP",
                  desc: "Strict compliance with Section 42 private placement regulations, SEBI guidelines, and the Digital Personal Data Protection Act, 2023 with a designated 48-hour SLA grievance desk.",
                  link: "/regulatory-disclosures/",
                  linkText: "Regulatory Standards",
                },
              ].map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 sm:p-8 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] hover:border-[#9A7B2C]/50 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-md bg-white border border-[rgba(26,26,26,0.1)] flex items-center justify-center text-[#9A7B2C] mb-5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2.5">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#5C5C5C] leading-relaxed font-body mb-6">
                        {pillar.desc}
                      </p>
                    </div>

                    <Link
                      href={pillar.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#1A1A1A] transition-colors mt-auto"
                    >
                      <span>{pillar.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: Principal Practice Areas with Architectural Showcase
            ================================================================== */}
        <section className="py-20 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual Property Development Portfolio */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/commercial_development.jpg"
                    alt="Contemporary mixed-use urban development evaluated under Niventra real estate advisory"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
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

              {/* Right Column: Practice Areas Breakdown */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Advisory Services</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                    Specialized Advisory Services engineered for institutional clarity.
                  </h2>
                </div>

                <div className="divide-y divide-[rgba(26,26,26,0.08)]">
                  {[
                    {
                      num: "01",
                      title: "Debt & Debenture Advisory",
                      desc: "Structuring senior secured non-convertible debentures (NCDs) under Section 42 of the Companies Act, 2013. Defined tenure schedules, escrow waterfalls, and ROC Form CHG-9 filings.",
                      href: "/debt-debenture/",
                      tag: "12%–16% p.a.* Indicative Guidance",
                    },
                    {
                      num: "02",
                      title: "Real Estate Capital Facilitation",
                      desc: "Structured project debt and construction finance for verified developers across residential redevelopment and commercial assets with mandatory RERA clearances.",
                      href: "/real-estate/",
                      tag: "7-Stage Evaluation Framework",
                    },
                    {
                      num: "03",
                      title: "Capital Providers Advisory",
                      desc: "Institutional reference framework for accredited capital providers, covering bond classification, covenant protections, and risk-return calibration.",
                      href: "/capital-providers/",
                      tag: "Accredited & Institutional Scope",
                    },
                    {
                      num: "04",
                      title: "Independent Due Diligence",
                      desc: "Forensic title searches spanning 30 years, municipal sanction verification, financial model stress-testing, and on-site engineering milestone monitoring.",
                      href: "/due-diligence/",
                      tag: "5-Pillar Audit Standards",
                    },
                  ].map((service, idx) => (
                    <div key={idx} className="py-5 group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span className="font-mono text-xs font-bold text-[#9A7B2C] pt-0.5">
                            {service.num}
                          </span>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-heading text-base font-semibold text-[#1A1A1A] group-hover:text-[#9A7B2C] transition-colors">
                                {service.title}
                              </h3>
                              <span className="text-[0.625rem] font-mono px-2 py-0.5 rounded bg-white border border-[rgba(26,26,26,0.1)] text-[#5C5C5C]">
                                {service.tag}
                              </span>
                            </div>
                            <p className="text-xs text-[#5C5C5C] leading-relaxed mt-1.5 max-w-xl font-body">
                              {service.desc}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={service.href}
                          className="shrink-0 p-2 rounded-full border border-[rgba(26,26,26,0.1)] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors"
                          aria-label={`Learn more about ${service.title}`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: Engineering Rigor & 5-Point Diligence Framework
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Diligence Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Rigorous Due Diligence</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                    Every asset subjected to a 5-pillar independent verification audit.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed mt-2 font-body">
                    We do not rely on self-reported developer metrics. Our internal evaluation committee mandates independent third-party searches and forensic engineering audits before structuring capital.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    {
                      title: "1. 30-Year Title Search",
                      desc: "Chain of title, revenue record verification, encumbrance certificates, and court litigation clearance.",
                    },
                    {
                      title: "2. Statutory & RERA Audit",
                      desc: "RERA registration validation, municipal commencement certificates, environmental clearances, and sanctioned plans.",
                    },
                    {
                      title: "3. Civil & Structural Inspection",
                      desc: "Independent architect audits, on-site construction milestone verification, and bill-of-quantities evaluation.",
                    },
                    {
                      title: "4. Forensic Cash-Flow Modeling",
                      desc: "Stress-testing absorption velocity, price per sq.ft. sensitivity, and escrow debt-service coverage ratio (DSCR).",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7]">
                      <span className="font-heading text-sm font-semibold text-[#1A1A1A] block">
                        {item.title}
                      </span>
                      <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed mt-1 font-body">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href="/due-diligence/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A7B2C] hover:text-[#1A1A1A] transition-colors"
                  >
                    <span>Read complete 5-Point Due Diligence Methodology</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Engineering Structural Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/due_diligence_structure.jpg"
                    alt="Precision structural steel and engineering facade representing Niventra forensic due diligence"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Physical Audit Verification
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Milestone-Linked Capital Release Architecture
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: Structured Advisory Lifecycle (Timeline)
            ================================================================== */}
        <section className="py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-eyebrow mb-2 block">Execution Methodology</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                Disciplined lifecycle from screening to redemption.
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 font-body">
                Structured in 6 transparent stages to ensure total alignment between capital providers and real estate developers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { step: "01", title: "Opportunity Identification", desc: "Developer track record, legal sanity & market feasibility" },
                { step: "02", title: "Due Diligence", desc: "Title search, RERA approvals & technical engineering audit" },
                { step: "03", title: "Structuring", desc: "Term sheet, coupon schedule & ROC CHG-9 mortgage charge" },
                { step: "04", title: "Deployment", desc: "Milestone-linked tranches via independent escrow waterfall" },
                { step: "05", title: "Monitoring", desc: "Ongoing physical inspections & quarterly compliance reports" },
                { step: "06", title: "Repayment & Redemption", desc: "Scheduled coupon servicing & full principal redemption" },
              ].map((s, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border border-[rgba(26,26,26,0.08)] shadow-2xs space-y-2">
                  <span className="font-mono text-xs font-bold text-[#9A7B2C] block">
                    STAGE {s.step}
                  </span>
                  <h3 className="font-heading text-sm font-semibold text-[#1A1A1A]">
                    {s.title}
                  </h3>
                  <p className="text-[0.6875rem] text-[#5C5C5C] leading-snug font-body">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 5: Executive Boardroom & Financial Transparency
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Boardroom Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/advisory_boardroom.jpg"
                    alt="Executive boardroom in a modern financial district representing Niventra governance"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Governance &amp; Corporate Ethics
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Independent Trusteeship &amp; Statutory Transparency
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Factual Corporate Disclosures */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Financial Transparency</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                    Transparent disclosures grounded in statutory standards.
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7]">
                    <span className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Debenture Yield Guidance (12%–16% p.a.*)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      The indicative yield range of 12%–16% p.a. reflects internal structuring parameters. It is an indicative business target and not a confirmed offer or guaranteed return. Contractual terms are finalized via formal Form PAS-4 documentation upon ROC registration.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7]">
                    <span className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Return Calculator — Deferred (Decision 7)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      Interactive calculation tools are deferred pending CFO and committee review. We explicitly avoid flawed compounding algorithms that misrepresent fixed-income coupon structures. Indicative schedules are provided directly via our advisory desk.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7]">
                    <span className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Issuer Entity Status (Decision 1)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      Niventra Capital Advisory India Pvt. Ltd. itself is intended to be the legal Issuer Entity of the initial debenture product, subject to formal board authorizations and ROC charge filings.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7]">
                    <span className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                      Independent Grievance Redressal (48h SLA)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      We operate a formal dispute resolution framework with guaranteed 48-business-hour written acknowledgment and a statutory 30-day final resolution determination under our designated Grievance Cell.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 6: Consultation & Advisory CRM Form
            ================================================================== */}
        <section id="consultation" className="py-20 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Corporate Contacts */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Direct Engagement</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                    Schedule a confidential advisory consultation.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 font-body leading-relaxed">
                    Speak with our advisory team to evaluate opportunities. Whether you are an accredited capital provider evaluating secured debentures or a real estate developer seeking structured project finance, our advisory desk provides preliminary consultations without obligation.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-white">
                    <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#8A8A8A] block mb-1">
                      Corporate Office Address
                    </span>
                    <p className="text-xs text-[#1A1A1A] font-semibold leading-relaxed">
                      Patel Nagar City Centre, Gwalior,<br />
                      Madhya Pradesh — 474001, India
                    </p>
                    <span className="text-[0.6875rem] text-[#8A8A8A] mt-1 block">
                      (With representative advisory presence in New Delhi)
                    </span>
                  </div>

                  <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-white flex items-center justify-between">
                    <div>
                      <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#8A8A8A] block">
                        Toll-Free Telephone
                      </span>
                      <a href="tel:18008900818" className="text-sm font-bold text-[#1A1A1A] hover:text-[#9A7B2C]">
                        1800 890 0818
                      </a>
                    </div>
                    <span className="text-[0.6875rem] text-[#8A8A8A] font-mono">Mon–Fri, 9:30–18:30 IST</span>
                  </div>

                  <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-white flex items-center justify-between">
                    <div>
                      <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#8A8A8A] block">
                        Corporate Advisory Email
                      </span>
                      <a href="mailto:info@niventracapitaladvisory.com" className="text-xs font-semibold text-[#1A1A1A] hover:text-[#9A7B2C]">
                        info@niventracapitaladvisory.com
                      </a>
                    </div>
                    <span className="text-[0.625rem] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                      Encrypted
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[0.6875rem] text-[#8A8A8A] pt-2">
                  <Lock className="w-3.5 h-3.5 text-[#9A7B2C]" />
                  <span>Submissions processed under Digital Personal Data Protection (DPDP) Act, 2023.</span>
                </div>
              </div>

              {/* Right Column: Live CRM Consultation Form */}
              <div className="lg:col-span-7">
                <ConsultationForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
