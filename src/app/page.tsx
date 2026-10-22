import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

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
            SECTION 1: HERO
            One headline, one concise supporting paragraph, primary CTA,
            secondary CTA to working catalog, calm architectural image,
            and qualified yield guidance disclosure.
            ================================================================== */}
        <section
          className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.06)] overflow-hidden"
          aria-label="Introduction and Overview"
        >
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Typographic Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="animate-hero-1">
                  <span className="text-eyebrow mb-4 block">
                    Institutional Advisory · Connecting eligible capital
                  </span>
                  <h1 className="font-heading text-[clamp(2.4rem,4.4vw,4.1rem)] font-[500] leading-[1.08] tracking-[-0.025em] text-[#1A1A1A] mb-6">
                    Connecting Capital with{" "}
                    <em className="not-italic text-[#9A7B2C]">
                      Evaluated Real Estate Opportunities
                    </em>
                  </h1>
                </div>

                <div className="animate-hero-2">
                  <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-[540px] mb-8 font-normal">
                    We advise on structured debt, debenture opportunities and real estate capital through disciplined evaluation and transparent processes.
                  </p>

                  {/* Primary & Secondary Action CTAs */}
                  <div className="flex flex-wrap items-center gap-4 mb-10">
                    <Button
                      variant="primary"
                      size="lg"
                      href="/contact/"
                      icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      className="group"
                    >
                      Schedule a Consultation
                    </Button>
                    <Button
                      variant="primary-outline"
                      size="lg"
                      href="/products/"
                    >
                      Explore Opportunities
                    </Button>
                  </div>
                </div>

                {/* Unobtrusive Statutory Disclosure */}
                <div className="animate-hero-3 pt-5 border-t border-[rgba(26,26,26,0.06)] max-w-[540px]">
                  <p className="text-[0.75rem] text-[#8A8A8A] leading-relaxed font-body">
                    <span className="text-[#9A7B2C] font-semibold">*</span>{" "}
                    Indicative debenture yield guidance of 12%–16% p.a. reflects internal structuring parameters. Subject to formal private placement documentation (Form PAS-4), ROC charge creation under Section 42 of the Companies Act, 2013, and statutory approvals. Non-guaranteed.
                  </p>
                </div>
              </div>

              {/* Right Column: Architectural Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-xl overflow-hidden border border-[rgba(26,26,26,0.08)] bg-white aspect-[4/3] sm:aspect-[16/11] shadow-2xs group animate-hero-image">
                  <Image
                    src="/assets/images/hero_commercial_architecture.jpg"
                    alt="Contemporary corporate architecture representing Niventra institutional advisory standards"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.15)] via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: WHAT WE DO (ADVISORY SERVICES)
            Four concise service rows with <= 20 words each and working links.
            ================================================================== */}
        <section className="py-20 lg:py-28 bg-white border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="advisory-services">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Contextual Overview & Architectural Image */}
              <div className="lg:col-span-5 space-y-6">
                <ScrollReveal direction="up">
                  <span className="text-eyebrow mb-2 block">Core Disciplines</span>
                  <h2 id="advisory-services" className="font-heading text-2xl sm:text-3xl lg:text-4xl font-[500] text-[#1A1A1A] leading-tight">
                    Advisory Services
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 font-body leading-relaxed max-w-md">
                    Disciplined practice areas connecting evaluated real estate opportunities with institutional capital.
                  </p>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={150}>
                  <div className="relative rounded-xl overflow-hidden border border-[rgba(26,26,26,0.08)] aspect-[4/3] bg-[#FAFAF7] shadow-2xs group">
                    <Image
                      src="/assets/images/re_commercial_grade_a.jpg"
                      alt="Grade-A commercial office headquarters evaluated under Niventra real estate advisory"
                      fill
                      sizes="(max-width: 1024px) 100vw, 38vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: Four Refined Service Rows */}
              <div className="lg:col-span-7">
                <div className="divide-y divide-[rgba(26,26,26,0.08)] border-y border-[rgba(26,26,26,0.08)]">
                  {[
                    {
                      num: "01",
                      title: "Debt & Debenture Advisory",
                      desc: "Senior secured non-convertible debentures structured under Section 42 private placement regulations.",
                      href: "/debt-debenture/",
                    },
                    {
                      num: "02",
                      title: "Real Estate Capital",
                      desc: "Structured project debt and mezzanine finance for evaluated residential and commercial developments.",
                      href: "/real-estate/",
                    },
                    {
                      num: "03",
                      title: "Capital Providers Advisory",
                      desc: "Institutional co-investment advisory for family offices, corporate treasuries, and accredited capital providers.",
                      href: "/capital-providers/",
                    },
                    {
                      num: "04",
                      title: "Independent Due Diligence",
                      desc: "Forensic evaluation anchored in our 5-Point due diligence framework, title records, and structural reviews.",
                      href: "/due-diligence/",
                    },
                  ].map((service, idx) => (
                    <ScrollReveal key={service.num} direction="up" delay={idx * 80}>
                      <Link
                        href={service.href}
                        className="group block py-6 sm:py-7 transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C]"
                        aria-label={`Explore ${service.title}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-start gap-5">
                            <span className="font-mono text-xs font-bold text-[#9A7B2C] pt-1">
                              {service.num}
                            </span>
                            <div>
                              <h3 className="font-heading text-lg sm:text-xl font-[600] text-[#1A1A1A] group-hover:text-[#9A7B2C] transition-colors duration-200">
                                {service.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed mt-1.5 max-w-xl font-body">
                                {service.desc}
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 p-2 text-[#8A8A8A] group-hover:text-[#1A1A1A] group-hover:translate-x-1 transition-all duration-200">
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: OUR APPROACH (THREE CONCISE PHASES)
            Consolidated 3-phase methodology without redundant summaries.
            ================================================================== */}
        <section className="py-20 lg:py-28 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="execution-methodology">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="max-w-2xl mb-14">
                <span className="text-eyebrow mb-2 block">Execution Methodology</span>
                <h2 id="execution-methodology" className="font-heading text-2xl sm:text-3xl lg:text-4xl font-[500] text-[#1A1A1A]">
                  Our Approach
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 font-body leading-relaxed">
                  A disciplined three-phase framework guiding capital evaluation from screening to contractual repayment.
                </p>
              </div>
            </ScrollReveal>

            {/* Three Phase Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  phase: "01",
                  title: "01 — Evaluate",
                  desc: "Opportunity Identification: Review the opportunity, available documentation, title records, and relevant approvals.",
                },
                {
                  phase: "02",
                  title: "02 — Structure",
                  desc: "Transaction Structuring: Assess the proposed financing structure, transaction documentation, and applicable security arrangements.",
                },
                {
                  phase: "03",
                  title: "03 — Monitor",
                  desc: "Monitoring & Repayment: Oversee progress, financial covenants, periodic servicing, and contractual repayment per transaction terms.",
                },
              ].map((item, idx) => (
                <ScrollReveal key={item.phase} direction="up" delay={idx * 120} className="h-full">
                  <div className="bg-white p-7 sm:p-8 rounded-xl border border-[rgba(26,26,26,0.08)] shadow-2xs h-full flex flex-col justify-between space-y-4 hover:border-[#9A7B2C]/40 transition-colors duration-200">
                    <div className="space-y-3">
                      <span className="font-mono text-xs font-bold text-[#9A7B2C] uppercase tracking-wider block">
                        Phase {item.phase}
                      </span>
                      <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal direction="up" delay={250}>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-[rgba(26,26,26,0.08)]">
                <span className="text-xs text-[#7A7A7A] font-body">
                  Illustrative methodology overview. Specific covenants, security structures, and trustee frameworks are transaction-specific.
                </span>
                <Link
                  href="/due-diligence/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#1A1A1A] transition-colors shrink-0 group"
                >
                  <span>Explore the complete six-stage Due Diligence Methodology</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: WHY NIVENTRA (FOUR EVIDENCE-BACKED PILLARS)
            Compact institutional differentiation without fabricated metrics.
            ================================================================== */}
        <section className="py-20 lg:py-24 bg-white border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="why-niventra">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <div className="max-w-2xl mb-12">
                <span className="text-eyebrow mb-2 block">Institutional Standards</span>
                <h2 id="why-niventra" className="font-heading text-2xl sm:text-3xl lg:text-4xl font-[500] text-[#1A1A1A]">
                  Why Niventra
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 font-body leading-relaxed">
                  Rigorous underwriting, statutory compliance, and transparent governance.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Disciplined Underwriting",
                  desc: "Multi-factor diligence across title, municipal, and developer records.",
                },
                {
                  title: "Statutory Alignment",
                  desc: "Section 42 private placement norms with ROC filings.",
                },
                {
                  title: "Security Focus",
                  desc: "Asset-specific charges, covenants, and monitored cash flows.",
                },
                {
                  title: "Transparent Governance",
                  desc: "Clear risk disclosures with no speculative return promises.",
                },
              ].map((item, idx) => (
                <ScrollReveal key={item.title} direction="up" delay={idx * 80}>
                  <div className="bg-[#FAFAF7] p-6 rounded-xl border border-[rgba(26,26,26,0.06)] h-full space-y-2">
                    <h3 className="font-heading text-base font-semibold text-[#1A1A1A]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 5: FINANCIAL TRANSPARENCY (STATUTORY DISCLOSURES)
            Four factual governance pillars preserving all legal notices.
            ================================================================== */}
        <section className="py-20 lg:py-28 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="financial-transparency">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Boardroom Photography */}
              <div className="lg:col-span-5">
                <ScrollReveal direction="up">
                  <div className="relative rounded-xl overflow-hidden border border-[rgba(26,26,26,0.08)] aspect-[4/3] bg-white shadow-2xs group">
                    <Image
                      src="/assets/images/advisory_boardroom.jpg"
                      alt="Executive boardroom representing Niventra corporate governance"
                      fill
                      sizes="(max-width: 1024px) 100vw, 38vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: Four Factual Pillars */}
              <div className="lg:col-span-7 space-y-6">
                <ScrollReveal direction="up">
                  <span className="text-eyebrow mb-2 block">Institutional Integrity</span>
                  <h2 id="financial-transparency" className="font-heading text-2xl sm:text-3xl lg:text-4xl font-[500] text-[#1A1A1A]">
                    Financial Transparency
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 font-body leading-relaxed max-w-lg">
                    Clear corporate disclosures, documented risk factors, and institutional governance benchmarks.
                  </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Yield Guidance (12%–16% p.a.*)",
                      desc: "Indicative; non-guaranteed. Final terms set in Form PAS-4 upon ROC charge creation.",
                    },
                    {
                      title: "Issuer Entity",
                      desc: "Niventra Capital Advisory India Pvt. Ltd. — Section 42, Companies Act, 2013.",
                    },
                    {
                      title: "Return Calculator — Deferred",
                      desc: "Pending CFO certification. Illustrative model available.",
                    },
                    {
                      title: "Private Placement",
                      desc: "All transactions offered on a private placement basis under Section 42.",
                    },
                  ].map((item, idx) => (
                    <ScrollReveal key={item.title} direction="up" delay={idx * 70}>
                      <div className="p-5 rounded-lg border border-[rgba(26,26,26,0.06)] bg-white space-y-1.5 h-full">
                        <span className="text-xs font-semibold text-[#1A1A1A] block">
                          {item.title}
                        </span>
                        <p className="text-[0.75rem] text-[#5C5C5C] leading-relaxed font-body">
                          {item.desc}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 6: CONSULTATION ENGAGEMENT
            Clear closing narrative with accessible DPDP-compliant consultation form.
            ================================================================== */}
        <section id="consultation" className="py-20 lg:py-28 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="consultation-heading">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Direct Consultation Guidance */}
              <div className="lg:col-span-5 space-y-6">
                <ScrollReveal direction="up">
                  <span className="text-eyebrow mb-2 block">Direct Engagement</span>
                  <h2 id="consultation-heading" className="font-heading text-2xl sm:text-3xl lg:text-4xl font-[500] text-[#1A1A1A] leading-tight">
                    Schedule a Consultation
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-3 font-body leading-relaxed">
                    Speak with our advisory team to discuss opportunities and eligibility.
                  </p>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={120}>
                  <div className="p-5 rounded-xl border border-[rgba(26,26,26,0.08)] bg-white space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8A8A8A] font-medium">Toll-Free Direct Desk</span>
                      <a href="tel:18008900818" className="font-bold text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors">
                        1800 890 0818
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-[rgba(26,26,26,0.06)] pt-3">
                      <span className="text-[#8A8A8A] font-medium">Corporate Inquiries</span>
                      <a href="mailto:info@niventracapitaladvisory.com" className="font-semibold text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors">
                        info@niventracapitaladvisory.com
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={200}>
                  <div className="flex items-center gap-2 text-[0.6875rem] text-[#8A8A8A] pt-1">
                    <Lock className="w-3.5 h-3.5 text-[#9A7B2C] shrink-0" aria-hidden="true" />
                    <span>Inquiries processed under Digital Personal Data Protection (DPDP) Act, 2023.</span>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Column: Accessible Consultation Form */}
              <div className="lg:col-span-7">
                <ScrollReveal direction="up" delay={100}>
                  <ConsultationForm />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
