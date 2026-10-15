import React from "react";
import {
  Shield,
  Building2,
  FileCheck2,
  TrendingUp,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Award,
  Clock,
  Compass,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConsultationForm } from "@/components/forms/ConsultationForm";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header activePath="/" />

      <main className="flex-1">
        {/* =========================================================================
            HERO SECTION: Institutional Depth, Subtle Gold Ambient Lighting
        ========================================================================= */}
        <section className="relative bg-navy-gradient text-white py-20 lg:py-28 overflow-hidden border-b border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-6">
              <Badge
                variant="navy"
                size="md"
                className="mb-2"
                icon={<Award className="w-3.5 h-3.5 text-[#D4AF37]" />}
              >
                Structured Capital & Corporate Debenture Advisory
              </Badge>

              <h1 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18]">
                Connecting eligible capital with professionally evaluated{" "}
                <span className="text-[#D4AF37] italic">real-estate opportunities.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-sans-body leading-relaxed max-w-2xl">
                NIVENTRA facilitates and structures institutional capital solutions
                through compliant debt and debenture channels, connecting discerning
                capital providers with thoroughly audited real estate developments.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  href="/debt-debenture/"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Debt & Debentures
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  href="#consultation"
                >
                  Schedule Capital Consultation
                </Button>
              </div>

              {/* 4 Hero Strategic Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/10 mt-8">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                    Instrument Type
                  </span>
                  <span className="text-sm font-bold text-white block">
                    Secured Debentures
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                    Target Yield Guidance
                  </span>
                  <span className="text-sm font-bold text-white block">
                    12% – 16% p.a.*
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                    Due Diligence
                  </span>
                  <span className="text-sm font-bold text-white block">
                    5-Point Framework
                  </span>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-1">
                    Grievance SLA
                  </span>
                  <span className="text-sm font-bold text-white block">
                    48h Acknowledgment
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Subtle Geometric Element */}
          <div
            className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />
        </section>

        {/* =========================================================================
            SECTION 1: 4 STRATEGIC ADVISORY PILLARS
        ========================================================================= */}
        <section className="py-20 bg-[#F8F9FA] border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="gold" size="sm">
                Strategic Competence
              </Badge>
              <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C]">
                Institutional Advisory Pillars
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our operations rest on rigorous corporate diligence, structured fiduciary
                governance, and transparent real estate underwriting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Pillar 1 */}
              <div className="card-luxury p-7 rounded-xl space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-[#0B192C]">
                  Structured Capital Solutions
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Structuring compliant capital channels via non-convertible debentures
                  (NCDs) and private credit instruments with defined tenures and priority
                  repayment.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="card-luxury p-7 rounded-xl space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-[#0B192C]">
                  Real Estate Project Evaluation
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Rigorous screening of prime residential, commercial, and mixed-use
                  developments, assessing location desirability and developer track records.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="card-luxury p-7 rounded-xl space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-[#0B192C]">
                  Legal & Financial Due Diligence
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Comprehensive 5-point audits covering title verification, RERA
                  approvals, litigation scrutiny, project cash-flow viability, and security charges.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="card-luxury p-7 rounded-xl space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-lg font-bold text-[#0B192C]">
                  Project Monitoring & Reporting
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Continuous oversight of development progress, milestone-controlled fund
                  deployments, escrow account monitoring, and transparent investor updates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: 6-STAGE VALUE CREATION LIFECYCLE
        ========================================================================= */}
        <section className="py-20 bg-white border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="gold" size="sm">
                Execution Methodology
              </Badge>
              <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C]">
                How Niventra Creates Value
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                An end-to-end disciplined lifecycle engineered to protect capital, ensure
                transparent monitoring, and deliver predictable financial milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Opportunity Identification",
                  desc: "Systematic screening of real estate developers, property locations, regulatory feasibility, and market demand.",
                },
                {
                  step: "02",
                  title: "Multi-Tier Due Diligence",
                  desc: "Independent legal title search, RERA registration audit, construction cost verification, and stress-tested financial models.",
                },
                {
                  step: "03",
                  title: "Structured Capital Architecture",
                  desc: "Structuring debenture terms, coupon schedules, collateral security coverage, and ROC charge filings (CHG-9).",
                },
                {
                  step: "04",
                  title: "Controlled Capital Deployment",
                  desc: "Funds are released in tranches strictly aligned with verified physical construction milestones and architect certifications.",
                },
                {
                  step: "05",
                  title: "Independent Project Monitoring",
                  desc: "Regular site inspections, sales velocity reviews, escrow account supervision, and quarterly compliance certificates.",
                },
                {
                  step: "06",
                  title: "Repayment & Capital Redemption",
                  desc: "Periodic coupon distribution followed by full principal redemption upon asset maturity or project exit.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37]/50 bg-[#F8F9FA] transition-all hover:shadow-lg space-y-3 relative group"
                >
                  <span className="font-serif-heading text-3xl font-bold text-[#D4AF37]/80 block">
                    {item.step}
                  </span>
                  <h3 className="font-serif-heading text-lg font-bold text-[#0B192C]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: 9-NODE OPERATIONAL FLOW
        ========================================================================= */}
        <section className="py-20 bg-[#0B192C] text-white border-b border-[#D4AF37]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="navy" size="sm">
                System Architecture
              </Badge>
              <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Our Operational Workflow
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                The structured transactional flow governing capital mobilization, project
                execution, and investor redemption.
              </p>
            </div>

            {/* 9-Node Flow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-center">
              {[
                "1. Capital Sourcing",
                "2. Debt Structure",
                "3. Issuer Entity",
                "4. Due Diligence",
                "5. Board Approval",
                "6. Deployment",
                "7. Development",
                "8. Monitoring",
                "9. Redemption",
              ].map((node, i) => (
                <div
                  key={i}
                  className="card-dark-luxury p-3 rounded-lg flex flex-col items-center justify-center min-h-[90px]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0B192C] text-[10px] font-bold flex items-center justify-center mb-1.5">
                    {i + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-200 leading-tight">
                    {node.replace(/^\d+\.\s*/, "")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: CORE SOLUTIONS OVERVIEW & DEFERRED CALCULATOR NOTICE
        ========================================================================= */}
        <section id="solutions" className="py-20 bg-[#F8F9FA] border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="gold" size="sm">
                Investment Pillars
              </Badge>
              <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C]">
                Structured Investment Channels
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Professional fixed-income instruments and capital structuring programs
                tailored for accredited investors and developers.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Solution 1: Debt & Debenture */}
              <div className="card-luxury p-8 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#0B192C]">
                    Debt & Debentures
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Secured non-convertible debentures (NCDs) offering defined tenures,
                    priority repayment, and structured collateral charges under Companies Act
                    frameworks.
                  </p>
                  <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-gray-200 space-y-1.5 text-xs text-gray-700">
                    <div className="flex justify-between font-medium">
                      <span>Guidance Range:</span>
                      <strong className="text-[#0B192C]">12% – 16% p.a.*</strong>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Target Tenures:</span>
                      <strong className="text-[#0B192C]">12 to 36 Months</strong>
                    </div>
                  </div>
                </div>
                <div className="pt-6">
                  <Button
                    variant="primary"
                    size="sm"
                    href="/debt-debenture/"
                    className="w-full justify-center text-xs"
                  >
                    View Debenture Guidelines
                  </Button>
                </div>
              </div>

              {/* Solution 2: Real Estate Capital */}
              <div className="card-luxury p-8 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#0B192C]">
                    Real Estate Capital
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Structured funding solutions for Tier-1 and emerging real estate
                    developers. Covering seed capital, project finance, and working capital
                    tranches.
                  </p>
                  <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-gray-200 space-y-1.5 text-xs text-gray-700">
                    <div className="flex justify-between font-medium">
                      <span>Asset Classes:</span>
                      <strong className="text-[#0B192C]">Residential / Commercial</strong>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Evaluation Process:</span>
                      <strong className="text-[#0B192C]">7-Stage Framework</strong>
                    </div>
                  </div>
                </div>
                <div className="pt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    href="/real-estate/"
                    className="w-full justify-center text-xs"
                  >
                    Explore Real Estate Process
                  </Button>
                </div>
              </div>

              {/* Solution 3: Capital Providers Guide */}
              <div className="card-luxury p-8 rounded-xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0B192C] text-[#D4AF37] flex items-center justify-center">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#0B192C]">
                    Capital Providers Guide
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Comprehensive instrument highlights, bond classifications, risk
                    profiles, and illustrative financial examples for eligible corporate and
                    HNW capital partners.
                  </p>
                  <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-gray-200 space-y-1.5 text-xs text-gray-700">
                    <div className="flex justify-between font-medium">
                      <span>Bond Classifications:</span>
                      <strong className="text-[#0B192C]">10 Types Cataloged</strong>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Investor Checklist:</span>
                      <strong className="text-[#0B192C]">7 Verification Points</strong>
                    </div>
                  </div>
                </div>
                <div className="pt-6">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    href="/capital-providers/"
                    className="w-full justify-center text-xs"
                  >
                    Read Capital Providers Guide
                  </Button>
                </div>
              </div>
            </div>

            {/* Formal Calculator Deferral Advisory Notice */}
            <div className="bg-white border border-[#D4AF37]/40 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#0B192C] text-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif-heading text-base font-bold text-[#0B192C]">
                    Institutional Financial Calculator Notice
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-2xl mt-0.5">
                    In alignment with our fiduciary standards and verified mathematical
                    governance, our interactive yield estimation engine is currently
                    undergoing formal certification by our structuring controllers. Please
                    contact our advisory desk for customized repayment schedules.
                  </p>
                </div>
              </div>
              <Button
                variant="outline-dark"
                size="sm"
                href="#consultation"
                className="shrink-0 text-xs"
              >
                Request Custom Schedule
              </Button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: INSTITUTIONAL TRUST & GOVERNANCE MATRIX
        ========================================================================= */}
        <section className="py-20 bg-white border-b border-gray-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <Badge variant="gold" size="sm">
                Fiduciary Integrity
              </Badge>
              <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C]">
                Institutional Trust & Governance
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Operating strictly within the statutory provisions of the Companies Act,
                2013, Indian data protection laws, and institutional compliance standards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Legal & Financial DD",
                  desc: "Exhaustive title searches, litigation audits, and stress-tested financial cash flows.",
                },
                {
                  title: "Clear Documentation",
                  desc: "Comprehensive Information Memoranda, explicit debenture term sheets, and formal agreements.",
                },
                {
                  title: "Transparent Risk Disclosure",
                  desc: "Zero hidden caveats. Unambiguous disclosures regarding credit, market, and liquidity factors.",
                },
                {
                  title: "Defined Terms & Tenure",
                  desc: "Contractually documented coupon schedules, repayment frequency, and redemption timelines.",
                },
                {
                  title: "Independent Monitoring",
                  desc: "Continuous site inspections and architect certifications before releasing project tranches.",
                },
                {
                  title: "Statutory Grievance Redressal",
                  desc: "Designated Grievance Redressal Officer with a published 48h acknowledgment and 30d resolution SLA.",
                },
                {
                  title: "DPDP Act 2023 Compliance",
                  desc: "Encrypted data custody, purposeful data collection, and verified deletion protocols.",
                },
                {
                  title: "Fiduciary Entity Governance",
                  desc: "Direct corporate issuer architecture with Debenture Trustee and ROC charge registration.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg bg-[#F8F9FA] border border-gray-200 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif-heading text-sm font-bold text-[#0B192C] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: CONSULTATION INTAKE & DIRECT CORPORATE DESK
        ========================================================================= */}
        <section
          id="consultation"
          className="py-20 bg-[#F8F9FA] border-b border-gray-200/60"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Advisory Coordinates */}
              <div className="lg:col-span-5 space-y-6">
                <Badge variant="gold" size="sm">
                  Client Engagement
                </Badge>
                <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C]">
                  Consult with Our Capital Structuring Team
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Whether you are an eligible capital provider seeking secured debenture
                  opportunities or a real estate developer evaluating project finance, our
                  advisory team provides confidential evaluation.
                </p>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#0B192C] text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-sm text-[#0B192C] block">
                        Direct Advisory Hours
                      </strong>
                      <span className="text-xs text-gray-500">
                        Monday – Friday, 9:30 AM – 6:30 PM IST
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#0B192C] text-[#D4AF37] flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-sm text-[#0B192C] block">
                        Confidentiality Guarantee
                      </strong>
                      <span className="text-xs text-gray-500">
                        All investor coordinates and project models remain strictly
                        confidential under non-disclosure governance.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Accessible Consultation Intake Form */}
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
