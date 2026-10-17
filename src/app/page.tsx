import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Lock } from "lucide-react";
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
            SECTION 1: HERO
            One headline, one short supporting sentence, one primary CTA,
            one calm architectural image. No floating badges or overlapping cards.
            ================================================================== */}
        <section
          className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.06)] overflow-hidden"
          aria-label="Introduction and Overview"
        >
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left: Concise Typographic Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A] mb-6">
                  Connecting eligible capital with professionally evaluated{" "}
                  <em className="not-italic text-[#9A7B2C]">
                    real estate opportunities.
                  </em>
                </h1>

                <p className="text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-[540px] mb-8 font-body">
                  Niventra facilitates senior secured debt debentures and bespoke project
                  capital solutions across India under disciplined underwriting covenants.
                </p>

                {/* Single Primary Action CTA */}
                <div className="mb-8">
                  <Button
                    variant="primary"
                    size="lg"
                    href="/contact/"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Schedule a Consultation
                  </Button>
                </div>

                {/* Statutory Yield Guidance Qualification */}
                <div className="pt-4 border-t border-[rgba(26,26,26,0.06)] max-w-[520px]">
                  <p className="text-[0.75rem] text-[#8A8A8A] leading-relaxed font-body">
                    <span className="text-[#9A7B2C] font-bold">*</span>{" "}
                    Indicative debenture yield guidance of 12%–16% p.a. is indicative business guidance. Subject to formal offer documentation, ROC charge creation, and statutory approvals under the Companies Act, 2013. Past performance does not indicate future results.
                  </p>
                </div>
              </div>

              {/* Right: Clean Architectural Image without Overlays */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.08)] bg-white aspect-[4/3]">
                  <Image
                    src="/assets/images/hero_commercial_architecture.jpg"
                    alt="Contemporary commercial financial headquarters representing Niventra institutional real estate advisory"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: CORE ADVISORY PRACTICES
            Four concise service rows with generous whitespace
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="advisory-services">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Architectural Photo */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.08)] aspect-[4/3] bg-[#FAFAF7]">
                  <Image
                    src="/assets/images/re_commercial_grade_a.jpg"
                    alt="Grade-A commercial office headquarters evaluated under Niventra real estate advisory"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Four Concise Practice Disciplines */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 id="advisory-services" className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                    Advisory Services
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1 font-body">
                    Disciplined practice areas for institutional capital allocation.
                  </p>
                </div>

                <div className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {[
                    {
                      num: "01",
                      title: "Debt & Debenture Advisory",
                      desc: "Senior secured non-convertible debentures structured under Section 42 of the Companies Act, 2013 with formal ROC Form CHG-9 filings.",
                      href: "/debt-debenture/",
                    },
                    {
                      num: "02",
                      title: "Real Estate Capital Facilitation",
                      desc: "Structured project debt and mezzanine finance for vetted developers across residential and commercial developments with mandatory RERA approvals.",
                      href: "/real-estate/",
                    },
                    {
                      num: "03",
                      title: "Capital Providers Advisory",
                      desc: "Institutional co-investment facilitation for family offices, HNIs, and corporate treasuries seeking secured fixed-income allocations.",
                      href: "/capital-providers/",
                    },
                    {
                      num: "04",
                      title: "Independent Due Diligence",
                      desc: "Rigorous evaluation anchored in our 5-Point due diligence framework spanning 30-year forensic title searches, municipal sanctions, and engineering audits.",
                      href: "/due-diligence/",
                    },
                  ].map((service) => (
                    <div key={service.num} className="py-4.5 group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span className="font-mono text-xs font-bold text-[#9A7B2C] pt-0.5">
                            {service.num}
                          </span>
                          <div>
                            <h3 className="font-heading text-base font-semibold text-[#1A1A1A] group-hover:text-[#9A7B2C] transition-colors">
                              {service.title}
                            </h3>
                            <p className="text-xs text-[#5C5C5C] leading-relaxed mt-1 max-w-xl font-body">
                              {service.desc}
                            </p>
                          </div>
                        </div>

                        <Link
                          href={service.href}
                          className="shrink-0 p-2 rounded-full border border-[rgba(26,26,26,0.08)] group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors"
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
            SECTION 3: EXECUTION METHODOLOGY
            Restrained 3-phase overview; full 6-stage details linked to dedicated page
            ================================================================== */}
        <section className="py-16 sm:py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="execution-methodology">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 id="execution-methodology" className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                Execution Methodology
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 font-body">
                A disciplined three-phase framework from screening to redemption.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Opportunity Identification & Due Diligence",
                  desc: "Comprehensive developer vetting, 30-year revenue title searches, active RERA approvals, and independent structural engineering inspection.",
                },
                {
                  step: "02",
                  title: "Structuring & Deployment",
                  desc: "Definitive term sheets, ROC Form CHG-9 charge registration, and milestone-linked disbursements through independent escrow bank accounts.",
                },
                {
                  step: "03",
                  title: "Monitoring, Repayment & Redemption",
                  desc: "Continuous technical audit oversight, scheduled periodic coupon servicing, and disciplined principal repayment upon contractual maturity.",
                },
              ].map((s) => (
                <div key={s.step} className="bg-white p-6 rounded-lg border border-[rgba(26,26,26,0.06)] shadow-2xs space-y-2">
                  <span className="font-mono text-xs font-bold text-[#9A7B2C] block">
                    PHASE {s.step}
                  </span>
                  <h3 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:text-left">
              <Link
                href="/due-diligence/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#1A1A1A] transition-colors"
              >
                <span>Explore the complete six-stage Due Diligence Methodology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: FINANCIAL TRANSPARENCY
            Factual statutory disclosures presented cleanly without visual bloat
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="financial-transparency">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Boardroom Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.08)] aspect-[4/3] bg-[#FAFAF7]">
                  <Image
                    src="/assets/images/advisory_boardroom.jpg"
                    alt="Executive boardroom representing Niventra governance"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Factual Corporate Disclosures */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h2 id="financial-transparency" className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                    Financial Transparency
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1 font-body">
                    Statutory disclosures and investor governance benchmarks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4.5 rounded-lg border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] space-y-1">
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Debenture Yield Guidance (12%–16% p.a.*)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      Indicative yield range reflects internal structuring parameters. It is an indicative target and not a guaranteed return. Final terms are set in Form PAS-4 upon ROC charge creation.
                    </p>
                  </div>

                  <div className="p-4.5 rounded-lg border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] space-y-1">
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Return Calculator — Deferred (Decision 7)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      Interactive calculation widgets are deferred pending CFO certification, eliminating flawed compounding assumptions that misrepresent fixed-income coupon structures.
                    </p>
                  </div>

                  <div className="p-4.5 rounded-lg border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] space-y-1">
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Issuer Entity Status (Decision 1)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      Niventra Capital Advisory India Pvt. Ltd. is intended to be the legal Issuer Entity of the initial debenture product, subject to formal board approvals and ROC filings.
                    </p>
                  </div>

                  <div className="p-4.5 rounded-lg border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] space-y-1">
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Independent Grievance Redressal (48h SLA)
                    </span>
                    <p className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                      Dedicated dispute resolution mechanism with guaranteed 48-business-hour written acknowledgment and statutory 30-day final resolution determination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 5: CONSULTATION ACTION
            One clear consultation action with accessible form and DPDP consent
            ================================================================== */}
        <section id="consultation" className="py-20 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.06)]" aria-labelledby="consultation-heading">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Direct Consultation Guidance */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <h2 id="consultation-heading" className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
                    Schedule a Consultation
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2.5 font-body leading-relaxed">
                    Speak with our advisory team to evaluate opportunities. Whether you are an accredited capital provider evaluating debentures or a real estate developer seeking structured capital, consultations are preliminary and confidential.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-[rgba(26,26,26,0.06)] bg-white space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8A8A8A] font-medium">Toll-Free Helpline</span>
                    <a href="tel:18008900818" className="font-bold text-[#1A1A1A] hover:text-[#9A7B2C]">
                      1800 890 0818
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-[rgba(26,26,26,0.06)] pt-2.5">
                    <span className="text-[#8A8A8A] font-medium">Corporate Email</span>
                    <a href="mailto:info@niventracapitaladvisory.com" className="font-semibold text-[#1A1A1A] hover:text-[#9A7B2C]">
                      info@niventracapitaladvisory.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[0.6875rem] text-[#8A8A8A] pt-1">
                  <Lock className="w-3.5 h-3.5 text-[#9A7B2C] shrink-0" />
                  <span>Submissions processed under Digital Personal Data Protection (DPDP) Act, 2023.</span>
                </div>
              </div>

              {/* Right Column: Accessible Consultation Form */}
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
