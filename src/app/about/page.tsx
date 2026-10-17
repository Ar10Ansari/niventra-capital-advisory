import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Target, Compass, Shield, Building, Scale, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us | Niventra Capital Advisory India",
  description:
    "Learn about Niventra Capital Advisory India — our institutional ethos, mission, vision, and disciplined approach to structured debt and real estate capital advisory.",
  alternates: {
    canonical: "/about/",
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/about/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Brand Positioning with Architectural Context
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Corporate Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Typographic Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                    Institutional Profile &amp; Governance
                  </span>
                </div>

                <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A]">
                  Building trust.{" "}
                  <em className="not-italic text-[#9A7B2C]">
                    Creating enduring value.
                  </em>
                </h1>

                <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                  Niventra Capital Advisory India facilitates and structures compliant capital solutions — connecting qualified capital providers with rigorously evaluated real estate developments across India under disciplined underwriting covenants.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Corporate Domicile
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      Gwalior &amp; New Delhi, India
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Patel Nagar City Centre, Gwalior — 474001
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Advisory Focus
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      Structured Debt &amp; Real Estate
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Secured NCDs, Project Due Diligence &amp; Monitoring
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/advisory_boardroom.jpg"
                    alt="Niventra Capital Advisory executive boardroom in modern corporate financial district"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Executive Committee Oversight
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Fiduciary Governance &amp; Independent Structuring Review
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            MISSION & VISION: Dual Column Asymmetric Editorial Composition
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-label="Mission and Vision">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
              
              {/* Mission */}
              <div className="p-8 sm:p-10 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />
                  </div>
                  <span className="text-eyebrow mb-2 block">Our Mission</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-4">
                    Disciplined capital facilitation
                  </h2>
                  <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                    To bridge the structural capital gap in India&rsquo;s real estate ecosystem by facilitating compliant, secured, and transparent debt instruments that prioritize principal protection, robust due diligence, and reliable returns for discerning capital providers.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[rgba(26,26,26,0.08)]">
                  <span className="text-[0.6875rem] text-[#8A8A8A] font-medium uppercase tracking-wider block">
                    Fiduciary Integrity · Risk Mitigation · Regulatory Alignment
                  </span>
                </div>
              </div>

              {/* Vision */}
              <div className="p-8 sm:p-10 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center mb-6">
                    <Compass className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />
                  </div>
                  <span className="text-eyebrow mb-2 block">Our Vision</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-4">
                    Setting the benchmark in private debt
                  </h2>
                  <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                    To be recognized across India as an institutional advisory firm that sets the standard for structured financial governance — known for uncompromising project vetting, unvarnished risk disclosures, and alignment of interests between developers and capital providers.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[rgba(26,26,26,0.08)]">
                  <span className="text-[0.6875rem] text-[#8A8A8A] font-medium uppercase tracking-wider block">
                    Transparency First · Disciplined Underwriting · Capital Security
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            STRATEGIC APPROACH: 4 Core Operating Tenets
            ================================================================== */}
        <section className="py-20 bg-[#F4F3EF] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="approach-heading">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-14">
              <span className="text-eyebrow mb-3 block">Operating Philosophy</span>
              <h2
                id="approach-heading"
                className="font-heading text-2xl sm:text-3xl lg:text-4xl font-[500] leading-[1.2] tracking-[-0.02em] text-[#1A1A1A] mb-4"
              >
                Our strategic approach to capital advisory
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                We do not solicit retail deposits or offer speculative financial products. Our advisory practice is anchored in four core operating tenets:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Underwriting Discipline",
                  desc: "Every potential asset undergoes independent verification of clear land titles, regulatory sanctions, RERA compliance, and financial cash-flow feasibility before structuring.",
                },
                {
                  step: "02",
                  title: "Security & Charge Creation",
                  desc: "We focus on secured structures backed by tangible collateral, escrow cash-flow mechanics, and formal ROC charge registration under Form CHG-9 of the Companies Act.",
                },
                {
                  step: "03",
                  title: "Milestone-Linked Controls",
                  desc: "Capital deployment is structured in tranches tied to certified physical construction progress, verified by technical architects rather than unmonitored advances.",
                },
                {
                  step: "04",
                  title: "Fiduciary Transparency",
                  desc: "We communicate openly regarding project risks, market conditions, and regulatory parameters, disclaiming guaranteed returns and emphasizing informed decision-making.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 flex flex-col justify-between shadow-2xs">
                  <div>
                    <span
                      className="font-mono text-sm font-bold block mb-4"
                      style={{ color: "var(--color-brass)" }}
                    >
                      TENET {item.step}
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================
            GOVERNANCE, ETHICS & CORPORATE DIRECTORY
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="governance-heading">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Governance Text */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Institutional Standards</span>
                  <h2
                    id="governance-heading"
                    className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]"
                  >
                    Institutional credibility and compliance verification.
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  <p>
                    Niventra Capital Advisory India Pvt. Ltd. operates under the regulatory framework of the Companies Act, 2013 and applicable securities laws. We hold ourselves to the highest standards of corporate governance, maintaining dedicated grievance redressal mechanisms with a 48-hour response SLA and strict data privacy compliance under the Digital Personal Data Protection (DPDP) Act, 2023.
                  </p>
                  <p>
                    In accordance with regulatory transparency requirements, we disclose that entity registrations, tax identifiers, and specific regulatory filings are subject to formal internal governance policies. We do not make claims of unverified registrations or guaranteed financial returns.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)]">
                    <Scale className="w-5 h-5 text-[#9A7B2C] mb-2" />
                    <span className="text-xs font-semibold text-[#1A1A1A] block">Companies Act, 2013</span>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block mt-0.5">Section 42 &amp; 71 Framework</span>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)]">
                    <Shield className="w-5 h-5 text-[#9A7B2C] mb-2" />
                    <span className="text-xs font-semibold text-[#1A1A1A] block">DPDP Act, 2023</span>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block mt-0.5">Fiduciary Data Privacy</span>
                  </div>
                  <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)]">
                    <Clock className="w-5 h-5 text-[#9A7B2C] mb-2" />
                    <span className="text-xs font-semibold text-[#1A1A1A] block">48-Hour SLA</span>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block mt-0.5">Grievance Redressal</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Button variant="primary" size="md" href="/due-diligence/" icon={<ArrowRight className="w-4 h-4" />}>
                    Due Diligence Framework
                  </Button>
                  <Button variant="primary-outline" size="md" href="/contact/">
                    Connect With Advisory Desk
                  </Button>
                </div>
              </div>

              {/* Right Column: Office Footprint Directory */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)]">
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-5 h-5 text-[#9A7B2C]" />
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                      Corporate Offices &amp; Liaison
                    </h3>
                  </div>

                  <div className="space-y-4 divide-y divide-[rgba(26,26,26,0.08)]">
                    <div className="pt-2">
                      <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#9A7B2C] block mb-1">
                        Principal Head Office
                      </span>
                      <p className="font-heading text-sm font-semibold text-[#1A1A1A]">
                        Gwalior, Madhya Pradesh
                      </p>
                      <p className="text-xs text-[#5C5C5C] mt-0.5">
                        Patel Nagar City Centre, Gwalior — 474001, India
                      </p>
                      <p className="text-[0.6875rem] text-[#8A8A8A] mt-1">
                        Corporate administration &amp; central operations
                      </p>
                    </div>

                    <div className="pt-4">
                      <span className="text-[0.625rem] font-bold uppercase tracking-wider text-[#9A7B2C] block mb-1">
                        National Capital Liaison
                      </span>
                      <p className="font-heading text-sm font-semibold text-[#1A1A1A]">
                        New Delhi Advisory Liaison
                      </p>
                      <p className="text-xs text-[#5C5C5C] mt-0.5">
                        Connaught Place / Barakhamba Road Corridor, New Delhi — 110001
                      </p>
                      <p className="text-[0.6875rem] text-[#8A8A8A] mt-1">
                        Institutional capital desk &amp; statutory legal counsel
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-[rgba(154,123,44,0.2)] bg-[rgba(154,123,44,0.04)]">
                  <span className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                    Direct Corporate Enquiries
                  </span>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Toll-Free: <a href="tel:18008900818" className="font-semibold text-[#1A1A1A] hover:text-[#9A7B2C]">1800 890 0818</a> · Email: <a href="mailto:info@niventracapitaladvisory.com" className="font-semibold text-[#1A1A1A] hover:text-[#9A7B2C]">info@niventracapitaladvisory.com</a>
                  </p>
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
