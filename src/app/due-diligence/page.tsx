import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Scale,
  DollarSign,
  Compass,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Layers,
  Building,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Due Diligence | Niventra Capital Advisory India",
  description:
    "Explore Niventra's 5-point due diligence framework for real estate structured debt: Legal, Financial, Technical, Market, and Risk Mitigation audits.",
  alternates: {
    canonical: "/due-diligence/",
  },
};

export default function DueDiligencePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/due-diligence/" />

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
                    Institutional Evaluation Framework
                  </span>
                </div>

                <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A]">
                  Rigorous 5-point{" "}
                  <em className="not-italic text-[#9A7B2C]">
                    due diligence framework.
                  </em>
                </h1>

                <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                  Capital preservation begins with unsparing underwriting. Every real estate asset evaluated by Niventra undergoes comprehensive independent verification across legal, financial, engineering, micro-market, and security parameters before any capital structuring.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Fiduciary Principle
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      Independent Verification
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Third-party title searches, chartered engineering &amp; forensic reviews
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A] block mb-1">
                      Security Covenant
                    </span>
                    <p className="font-heading text-base font-semibold text-[#1A1A1A]">
                      1.5x – 2.0x Asset Cover
                    </p>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      ROC Form CHG-9 charge registration &amp; escrow controls
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Photography */}
              <div className="lg:col-span-5">
                <div className="relative rounded-lg overflow-hidden border border-[rgba(26,26,26,0.1)] shadow-lg aspect-[4/3] group">
                  <Image
                    src="/assets/images/due_diligence_structure.jpg"
                    alt="Precision architectural steel and glass facade engineering representing Niventra forensic due diligence"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-102"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded bg-white/95 backdrop-blur-md border border-[rgba(26,26,26,0.1)]">
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                      Forensic Underwriting
                    </span>
                    <span className="text-xs font-semibold text-[#1A1A1A] block">
                      Multi-Disciplinary Legal, Engineering &amp; Financial Audits
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            THE 5 PILLARS OF DUE DILIGENCE
            ================================================================== */}
        <section className="py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="five-pillars">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-14">
              <span className="text-eyebrow mb-2 block">Comprehensive Vetting</span>
              <h2
                id="five-pillars"
                className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A] mb-3"
              >
                The Five Diligence Pillars
              </h2>
              <p className="text-sm sm:text-base text-[#5C5C5C] leading-relaxed font-body">
                A systematic, multi-disciplinary evaluation designed to ensure projects are legally unencumbered, financially sound, structurally viable, and backed by robust security:
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  pillar: "Pillar 01",
                  title: "Legal & Title Due Diligence",
                  icon: <Scale className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />,
                  summary:
                    "Verification of absolute, unencumbered ownership and statutory approvals.",
                  checks: [
                    "30-Year Search Report: Comprehensive title search through government sub-registrar offices to trace lineage of ownership and establish clear marketable title.",
                    "Statutory Clearances: Verification of Commencement Certificate (CC), Intimation of Disapproval (IOD), Environmental Clearances, Fire NOC, and Airport Authority clearances.",
                    "RERA Audit: Scrutiny of state Real Estate Regulatory Authority (RERA) registration certificates, declared completion deadlines, and quarterly compliance filings.",
                    "Litigation Checks: Court searches across District Courts, High Courts, NCLT, and Supreme Court for pending disputes, revenue proceedings, or land acquisition claims.",
                  ],
                },
                {
                  pillar: "Pillar 02",
                  title: "Financial & Forensic Cash-Flow Diligence",
                  icon: <DollarSign className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />,
                  summary:
                    "Stress-testing the project balance sheet, cash flows, and debt servicing capabilities.",
                  checks: [
                    "Cost Audit & Budget Validation: Independent verification of construction bill of quantities (BOQ), civil engineering costs, and contingency margins.",
                    "Cash-Flow Stress-Testing: Financial sensitivity modeling testing absorption rate delays, 10–20% cost overruns, and interest rate spikes to test project DSCR.",
                    "Existing Indebtedness Review: Examination of existing bank loans, non-fund-based credit lines, and prior charges registered on the MCA portal.",
                    "Escrow Mechanism Setup: Structuring ring-fenced project escrow bank accounts with waterfall priority rules governing revenue allocation.",
                  ],
                },
                {
                  pillar: "Pillar 03",
                  title: "Technical & Construction Feasibility",
                  icon: <Compass className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />,
                  summary:
                    "On-site civil engineering inspections to verify physical progress and build quality.",
                  checks: [
                    "Physical Site Inspection: Ground-level audit of construction progress versus reported expenditure to ensure no diversion of project capital.",
                    "Structural & Soil Audits: Review of soil test reports, foundation stability, and structural stability certificates by chartered civil engineers.",
                    "Contractor Track Record: Evaluation of general contractor credentials, labor mobilization, material sourcing resilience, and execution history.",
                    "Milestone Mapping: Structuring clear, verifiable physical construction triggers for tranche-based capital disbursements.",
                  ],
                },
                {
                  pillar: "Pillar 04",
                  title: "Micro-Market & Demand Feasibility",
                  icon: <TrendingUp className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />,
                  summary:
                    "Independent valuation and assessment of end-user absorption velocity.",
                  checks: [
                    "Catchment Area Analysis: Demographic analysis, infrastructure connectivity (metro, highways, employment nodes), and social infrastructure.",
                    "Competitive Pricing Audit: Benchmarking project price per square foot against competing active developments in a 3-5 km radius.",
                    "Sales Velocity Verification: Historical sales velocity audit to establish realistic monthly absorption rates and uncontracted inventory levels.",
                    "Target Buyer Affordability: Assessing buyer demographic profile, home loan eligibility trends, and local purchasing power parity.",
                  ],
                },
                {
                  pillar: "Pillar 05",
                  title: "Security Structuring & Risk Mitigation",
                  icon: <ShieldCheck className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />,
                  summary:
                    "Ensuring adequate collateral coverage and definitive legal recourse in adverse events.",
                  checks: [
                    "Collateral Charge Registration: Creation and formal filing of Form CHG-9 with the Registrar of Companies for first exclusive or pari-passu charge on land/receivables.",
                    "Asset Coverage Ratio: Targeting a minimum collateral security cover of 1.5x to 2.0x of the total debenture issue size.",
                    "Personal & Corporate Guarantees: Obtaining enforceable guarantees from developer promoter entities backed by net worth certificates.",
                    "Clearly Defined Exit Triggers: Pre-agreed contractual exit dates, refinancing covenants, and asset sale rights in the event of default.",
                  ],
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-7 sm:p-9 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(26,26,26,0.08)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <span
                          className="font-mono text-xs font-bold uppercase tracking-wider block"
                          style={{ color: "var(--color-brass)" }}
                        >
                          {item.pillar}
                        </span>
                        <h3 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs text-[#8A8A8A] font-medium max-w-xs sm:text-right">
                      {item.summary}
                    </span>
                  </div>

                  <div className="pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] mb-4">
                      Key Verification Checkpoints:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.checks.map((check, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 p-8 rounded-xl bg-[#F4F3EF] border border-[rgba(26,26,26,0.08)] text-center max-w-3xl mx-auto space-y-4 shadow-2xs">
              <h3 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                Request a Sample Due Diligence Memo
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed max-w-xl mx-auto font-body">
                Qualified institutional investors and capital providers can request an anonymized due diligence review package demonstrating our underwriting depth and risk scoring methodology.
              </p>
              <div className="pt-2">
                <Button variant="primary" size="md" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                  Contact Advisory Desk
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
