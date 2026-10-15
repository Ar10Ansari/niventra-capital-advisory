import React from "react";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ConsultationForm } from "@/components/forms/ConsultationForm";

/* ============================================================================
   HOMEPAGE — Niventra Capital Advisory India
   Modern Institutional · Editorial Light Design · Real Financial Services
   ============================================================================ */

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header activePath="/" />

      <main id="main-content" className="flex-1">

        {/* ==================================================================
            HERO: Asymmetric editorial split
            Left: Strong typographic statement
            Right: Brass-ruled credential panel
            ================================================================== */}
        <section className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)]" aria-label="Introduction">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[580px] lg:min-h-[640px]">

              {/* Left: Editorial copy block */}
              <div className="lg:col-span-7 flex flex-col justify-center pt-16 pb-12 lg:pb-16 lg:pr-16">
                {/* Eyebrow */}
                <p className="text-eyebrow mb-6">
                  Structured Capital &amp; Real Estate Advisory
                </p>

                {/* Display headline: confident, editorial, no fluff */}
                <h1 className="font-heading text-[clamp(2.25rem,5vw,4rem)] font-[500] leading-[1.08] tracking-[-0.025em] text-[#1A1A1A] mb-6">
                  Connecting eligible capital with evaluated{" "}
                  <em className="not-italic" style={{ color: "var(--color-brass)" }}>
                    real estate opportunities.
                  </em>
                </h1>

                {/* Sub-copy: measured, factual, no superlatives */}
                <p className="text-[1.0625rem] text-[#5C5C5C] leading-[1.7] max-w-[500px] mb-10">
                  Niventra facilitates and structures institutional capital solutions
                  through compliant debt and debenture channels — connecting
                  discerning capital providers with thoroughly evaluated real
                  estate developments across India.
                </p>

                {/* CTA pair — primary then secondary */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="lg" href="/debt-debenture/" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Debentures
                  </Button>
                  <Button variant="primary-outline" size="lg" href="#consultation">
                    Schedule Consultation
                  </Button>
                </div>

                {/* Yield guidance note — qualified, below fold, honest */}
                <p className="mt-8 text-xs text-[#8A8A8A] leading-relaxed max-w-[440px]">
                  <span style={{ color: "var(--color-brass)", fontWeight: 600 }}>*</span>{" "}
                  Indicative debenture yield guidance of 12%–16% p.a. is subject to
                  formal product approval and applicable statutory conditions.
                  Past returns do not guarantee future performance.
                </p>
              </div>

              {/* Right: Credential panel with brass rules */}
              <div className="lg:col-span-5 hidden lg:flex flex-col justify-center border-l border-[rgba(26,26,26,0.08)] pl-12">
                <div className="space-y-8">
                  {/* Credential item */}
                  {[
                    {
                      label: "Instrument Type",
                      value: "Secured Non-Convertible Debentures",
                      note: "Structured under Companies Act, 2013",
                    },
                    {
                      label: "Indicative Yield Guidance",
                      value: "12% – 16% p.a.*",
                      note: "Subject to product approval and conditions",
                    },
                    {
                      label: "Due Diligence Framework",
                      value: "5-Point Independent Audit",
                      note: "Title, legal, financial, construction, exit",
                    },
                    {
                      label: "Grievance Acknowledgment",
                      value: "48-Hour SLA",
                      note: "Designated Grievance Redressal Officer",
                    },
                  ].map((item, i) => (
                    <div key={i} className="group">
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] mb-1.5">
                        {item.label}
                      </p>
                      <p className="font-heading text-[1.3125rem] font-[600] text-[#1A1A1A] leading-none mb-1">
                        {item.value}
                      </p>
                      <p className="text-xs text-[#8A8A8A]">{item.note}</p>
                      {i < 3 && (
                        <div className="mt-5 h-px bg-[rgba(26,26,26,0.08)]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile credential strip — visible only below lg breakpoint */}
        <section className="lg:hidden bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]" aria-label="Key credentials">
          <div className="container-editorial py-10">
            <div className="grid grid-cols-2 gap-x-6 gap-y-7">
              {[
                { label: "Instrument", value: "Secured NCDs" },
                { label: "Yield Guidance", value: "12%–16% p.a.*" },
                { label: "Diligence Points", value: "5-Stage Audit" },
                { label: "Grievance SLA", value: "48 Hours" },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] mb-1">
                    {item.label}
                  </p>
                  <p className="font-heading text-[1.125rem] font-[600] text-[#1A1A1A]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[0.6875rem] text-[#8A8A8A] leading-relaxed">
              * Indicative guidance. Subject to product approval and statutory conditions.
            </p>
          </div>
        </section>

        {/* ==================================================================
            SERVICES: Editorial asymmetric layout with brass numbering
            Varied compositions — not a repeated card grid
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-labelledby="services-heading">
          <div className="container-editorial">
            {/* Section header — left-aligned, editorial */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              <div className="lg:col-span-5">
                <p className="text-eyebrow mb-4">Advisory Services</p>
                <h2
                  id="services-heading"
                  className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-[500] leading-[1.15] tracking-[-0.02em] text-[#1A1A1A]"
                >
                  Where we apply our expertise
                </h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7 flex items-end">
                <p className="text-[1rem] text-[#5C5C5C] leading-[1.7]">
                  Niventra works across four distinct practice areas, each
                  supported by independent research, structured documentation,
                  and direct advisory engagement.
                </p>
              </div>
            </div>

            {/* Service 1: Debt & Debenture — wide editorial row */}
            <div className="border-t border-[rgba(26,26,26,0.08)]">
              {[
                {
                  num: "01",
                  href: "/debt-debenture/",
                  title: "Debt & Debenture",
                  description:
                    "We structure secured non-convertible debentures (NCDs) as compliant fixed-income instruments connecting capital providers to evaluated real estate projects. Our structuring includes defined tenure schedules, priority repayment architecture, and collateral charge registration under the Companies Act, 2013 framework.",
                  detail: "12%–16% p.a. indicative yield guidance · NCDs · CHG-9 Charge Registration",
                },
                {
                  num: "02",
                  href: "/real-estate/",
                  title: "Real Estate Capital",
                  description:
                    "We evaluate and structure capital deployment into residential, commercial, and mixed-use real estate projects. All projects undergo independent site assessment, construction feasibility review, RERA compliance verification, and developer track record analysis before any capital structuring begins.",
                  detail: "7-Stage Evaluation Framework · Residential, Commercial & Mixed-Use",
                },
                {
                  num: "03",
                  href: "/capital-providers/",
                  title: "Capital Providers",
                  description:
                    "We provide a detailed reference framework for eligible capital providers — covering bond classification types, NCD versus listed debenture distinctions, instrument risk profiles, and a structured checklist for evaluating any private debt offering. This material is informational only and does not constitute a regulated offer.",
                  detail: "Reference Framework · 10 Instrument Types · Not a Regulated Offering",
                },
                {
                  num: "04",
                  href: "/due-diligence/",
                  title: "Due Diligence",
                  description:
                    "Our due diligence process covers five independent areas: property title verification, RERA and regulatory approval status, litigation and encumbrance checks, project financial model stress-testing, and security charge filing. Reports are produced per project and made available to capital providers in our documentation package.",
                  detail: "5-Point Framework · Title · Legal · Financial · Construction · Exit",
                },
              ].map((service, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-6 py-10 border-b border-[rgba(26,26,26,0.08)] group"
                >
                  {/* Number */}
                  <div className="sm:col-span-1 hidden sm:flex items-start pt-1">
                    <span
                      className="font-heading text-[2.5rem] font-[300] leading-none tracking-[-0.04em] select-none"
                      style={{ color: "var(--color-canvas-dim)" }}
                      aria-hidden="true"
                    >
                      {service.num}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="sm:col-span-3 flex items-start pt-1">
                    <h3 className="font-heading text-[1.375rem] font-[600] text-[#1A1A1A] leading-tight tracking-[-0.01em]">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description + Detail */}
                  <div className="sm:col-span-6 space-y-3">
                    <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.75]">
                      {service.description}
                    </p>
                    <p className="text-[0.75rem] text-[#8A8A8A] font-medium tracking-wide">
                      {service.detail}
                    </p>
                  </div>

                  {/* Link arrow */}
                  <div className="sm:col-span-2 flex sm:justify-end items-start pt-1">
                    <a
                      href={service.href}
                      className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[#9A7B2C] hover:text-[#B8922F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded group-hover:gap-2.5"
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Learn more <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            PROCESS: Clean numbered timeline — editorial, not a grid of boxes
            ================================================================== */}
        <section className="section-spacing surface-tonal border-y border-[rgba(26,26,26,0.08)]" aria-labelledby="process-heading">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Left: Section label + intro */}
              <div className="lg:col-span-4 lg:sticky lg:top-24">
                <p className="text-eyebrow mb-4">Execution Methodology</p>
                <h2
                  id="process-heading"
                  className="font-heading text-[clamp(1.625rem,3vw,2.5rem)] font-[500] leading-[1.18] tracking-[-0.02em] text-[#1A1A1A] mb-5"
                >
                  How we structure and deploy capital
                </h2>
                <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.75] mb-8">
                  A disciplined lifecycle designed to protect capital,
                  ensure transparent project monitoring, and deliver
                  defined financial milestones at each stage.
                </p>
                <Button variant="primary-outline" size="md" href="/due-diligence/">
                  View Diligence Framework
                </Button>
              </div>

              {/* Right: Numbered stages */}
              <div className="lg:col-span-7 lg:col-start-6">
                <ol className="space-y-0">
                  {[
                    {
                      step: "01",
                      title: "Opportunity Identification",
                      desc: "Systematic screening of real estate developers, property locations, regulatory feasibility, and market demand fundamentals before initiating any formal advisory engagement.",
                    },
                    {
                      step: "02",
                      title: "Multi-Tier Due Diligence",
                      desc: "Independent legal title search, RERA registration verification, construction cost assessment, stress-tested financial projections, and encumbrance checks.",
                    },
                    {
                      step: "03",
                      title: "Structured Capital Architecture",
                      desc: "Defining debenture terms, coupon schedules, collateral security coverage ratios, and formal ROC charge registration (CHG-9) to establish priority claims.",
                    },
                    {
                      step: "04",
                      title: "Controlled Capital Deployment",
                      desc: "Funds are released in tranches strictly aligned with verified physical construction milestones, independently certified by a qualified architect or project monitor.",
                    },
                    {
                      step: "05",
                      title: "Independent Project Monitoring",
                      desc: "Ongoing site inspections, sales velocity tracking, escrow account supervision, and periodic compliance reporting throughout the investment tenure.",
                    },
                    {
                      step: "06",
                      title: "Repayment & Capital Redemption",
                      desc: "Scheduled coupon distribution at defined intervals, followed by full principal redemption upon project maturity or agreed exit event, per documented term sheet.",
                    },
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-12 gap-4 py-8 border-b border-[rgba(26,26,26,0.08)] first:border-t first:border-[rgba(26,26,26,0.08)]"
                    >
                      <div className="col-span-2 sm:col-span-1 pt-0.5">
                        <span
                          className="font-heading text-[0.75rem] font-[600] tracking-[0.06em]"
                          style={{ color: "var(--color-brass)" }}
                          aria-label={`Step ${item.step}`}
                        >
                          {item.step}
                        </span>
                      </div>
                      <div className="col-span-10 sm:col-span-11 space-y-1.5">
                        <h3 className="font-heading text-[1.125rem] font-[600] text-[#1A1A1A] leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-[0.9rem] text-[#5C5C5C] leading-[1.7]">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            TRANSPARENCY STATEMENT: Single-column editorial, no cards
            Financial disclosures presented calmly and honestly
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-labelledby="transparency-heading">
          <div className="container-editorial">
            <div className="max-w-3xl">
              <p className="text-eyebrow mb-5">Financial Transparency</p>
              <h2
                id="transparency-heading"
                className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-[500] leading-[1.18] tracking-[-0.02em] text-[#1A1A1A] mb-8"
              >
                What we disclose, and why it matters
              </h2>

              {/* Honest structured paragraphs — not a card grid */}
              <div className="space-y-8">
                <div className="border-l-2 pl-6" style={{ borderColor: "var(--color-brass-rule)" }}>
                  <h3 className="font-heading text-[1.125rem] font-[600] text-[#1A1A1A] mb-2">
                    Debenture Yield Guidance
                  </h3>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.75]">
                    The indicative yield range of 12%–16% p.a. represents internal
                    business guidance for the debenture product under development. It is
                    not a guaranteed return, a confirmed offer, or a regulated financial
                    promise. Final terms — including exact coupon rates, tenor, payment
                    frequency, collateral details, eligibility criteria, and redemption
                    conditions — will be documented in a formal Information Memorandum or
                    term sheet upon product finalisation and applicable legal clearance.
                  </p>
                </div>

                <div className="border-l-2 pl-6" style={{ borderColor: "var(--color-canvas-dim)", borderLeftColor: "rgba(26,26,26,0.15)" }}>
                  <h3 className="font-heading text-[1.125rem] font-[600] text-[#1A1A1A] mb-2">
                    Issuer Entity
                  </h3>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.75]">
                    The intended issuing entity is Niventra Capital Advisory India Pvt. Ltd.
                    This has been confirmed as a business objective. Formal legal and
                    compliance verification — including applicable provisions of the
                    Companies Act, 2013 (Sections 71 and 42) and current SEBI regulations —
                    is ongoing and not yet independently confirmed.
                  </p>
                </div>

                <div className="border-l-2 pl-6" style={{ borderColor: "rgba(26,26,26,0.15)" }}>
                  <h3 className="font-heading text-[1.125rem] font-[600] text-[#1A1A1A] mb-2">
                    Return Calculator — Deferred
                  </h3>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.75]">
                    An interactive yield estimation tool has been intentionally withheld
                    pending formal mathematical review and CFO certification. The legacy
                    website&rsquo;s calculator contained an unverified compounding formula
                    that was inconsistent with the stated fixed-income product structure.
                    A verified calculator will be published when certified figures are
                    available. Please contact our advisory desk for indicative schedules.
                  </p>
                </div>

                <div className="border-l-2 pl-6" style={{ borderColor: "rgba(26,26,26,0.15)" }}>
                  <h3 className="font-heading text-[1.125rem] font-[600] text-[#1A1A1A] mb-2">
                    Governance &amp; Legal Compliance
                  </h3>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.75]">
                    Niventra operates in accordance with the Companies Act, 2013, the
                    Indian Stamp Act, and the Digital Personal Data Protection (DPDP) Act,
                    2023. We maintain a designated Grievance Redressal Officer with a
                    48-hour acknowledgment commitment. Full regulatory registration details
                    are subject to ongoing independent verification and will be published
                    upon confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            CONSULTATION: Horizontal layout — intro left, form right
            Clean, professional, no decorative excess
            ================================================================== */}
        <section
          id="consultation"
          className="section-spacing surface-tonal border-t border-[rgba(26,26,26,0.08)]"
          aria-labelledby="consultation-heading"
        >
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

              {/* Left: Approach description */}
              <div className="lg:col-span-4">
                <p className="text-eyebrow mb-4">Advisory Enquiries</p>
                <h2
                  id="consultation-heading"
                  className="font-heading text-[clamp(1.625rem,3vw,2.25rem)] font-[500] leading-[1.2] tracking-[-0.02em] text-[#1A1A1A] mb-5"
                >
                  Speak with our advisory team
                </h2>
                <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.75] mb-8">
                  Whether you are an eligible capital provider evaluating structured
                  debt opportunities, or a real estate developer seeking project
                  finance, we offer confidential preliminary consultation with
                  no obligation.
                </p>

                {/* Direct contact details — from verified audit records */}
                <div className="space-y-5">
                  <div>
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] mb-1">
                      Office Address
                    </p>
                    <p className="text-[0.875rem] text-[#2D2D2D] leading-snug">
                      Patel Nagar City Centre<br />
                      Gwalior, Madhya Pradesh — 474001
                    </p>
                  </div>
                  <div className="h-px bg-[rgba(26,26,26,0.07)]" />
                  <div>
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] mb-1">
                      Toll-Free
                    </p>
                    <a
                      href="tel:18008900818"
                      className="text-[0.9375rem] font-medium text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded"
                    >
                      1800 890 0818
                    </a>
                  </div>
                  <div className="h-px bg-[rgba(26,26,26,0.07)]" />
                  <div>
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] mb-1">
                      Advisory Hours
                    </p>
                    <p className="text-[0.875rem] text-[#2D2D2D]">
                      Monday – Friday, 9:30 AM – 6:30 PM IST
                    </p>
                  </div>
                  <div className="h-px bg-[rgba(26,26,26,0.07)]" />
                  <div>
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] mb-1">
                      Grievance Contact
                    </p>
                    <a
                      href="mailto:compliance@niventracapitaladvisory.com"
                      className="text-[0.875rem] text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded"
                    >
                      compliance@niventracapitaladvisory.com
                    </a>
                  </div>
                </div>

                {/* Confidentiality notice */}
                <div className="mt-8 pt-6 border-t border-[rgba(26,26,26,0.08)]">
                  <p className="text-[0.8125rem] text-[#8A8A8A] leading-relaxed">
                    All enquiries are treated as confidential. Information provided
                    is used solely for consultation purposes, in compliance with the
                    DPDP Act, 2023.
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:col-span-7 lg:col-start-6">
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
