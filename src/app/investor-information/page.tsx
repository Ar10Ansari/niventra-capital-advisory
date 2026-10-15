import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertCircle, Shield, FileText, Scale } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";

export const metadata: Metadata = {
  title: "Investor Information | Niventra Capital Advisory India",
  description:
    "Statutory parameters, engagement guidelines, risk disclosures, and grievance redressal channels for prospective capital providers.",
  alternates: {
    canonical: "/investor-information/",
  },
};

export default function InvestorInformationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/investor-information/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Header
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Governance & Engagement">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Governance &amp; Engagement Standards
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A] mb-4">
                Investor Information &amp;{" "}
                <em className="not-italic text-[#9A7B2C]">
                  Terms of Engagement.
                </em>
              </h1>

              <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                Comprehensive details on engagement parameters, statutory disclosures, risk acknowledgments, and investor protection mechanisms governing Niventra Capital Advisory India.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            COMPLIANCE DISCLOSURE: STATUS OF CLAUSES
            ================================================================== */}
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <CalloutNotice variant="neutral" title="Policy Documentation Status Notice">
            Clauses 8, 11, and 12 detailed below represent verified active statutory disclosures.
            In compliance with our documentation governance standards, operational clauses
            (Clauses 1–7 regarding specific subscription mechanics, accreditation thresholds,
            and allotment schedules, and Clauses 9–10 regarding secondary transfers and stamp duty)
            are undergoing formal legal finalization by company counsel and will be published
            upon regulatory sign-off. For active debenture indenture terms, please contact our advisory desk.
          </CalloutNotice>
        </div>

        {/* ==================================================================
            ACTIVE VERIFIED CLAUSES
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-label="Verified Investor Clauses">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-10">

              {/* SECTION 8: RISK FACTORS */}
              <div className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-8 sm:p-10 shadow-2xs">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[rgba(154,123,44,0.1)] text-[#9A7B2C]"
                  >
                    Section 08
                  </span>
                  <h2 className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                    Risk Factors &amp; Investment Disclaimers
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed space-y-4 font-body">
                  <p>
                    All prospective capital providers must acknowledge that private debt
                    instruments, non-convertible debentures, and real estate financing involve
                    inherent risks, including but not limited to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-[#1A1A1A]">Obligor Credit Risk:</strong> The potential failure of the issuing
                      entity or project company to service coupon obligations or repay principal
                      at maturity.
                    </li>
                    <li>
                      <strong className="text-[#1A1A1A]">Project Execution &amp; Approvals Delay:</strong> Real estate
                      developments are subject to construction timelines, municipal approvals,
                      and market demand cycles.
                    </li>
                    <li>
                      <strong className="text-[#1A1A1A]">Liquidity &amp; Transfer Limitations:</strong> Unlisted private
                      placement debentures lack immediate secondary market liquidity and cannot
                      be redeemed on demand prior to scheduled maturity.
                    </li>
                  </ul>
                  <div className="pt-2">
                    <Link
                      href="/risk-disclosure/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#1A1A1A] transition-colors"
                    >
                      Read Complete Statutory Risk Disclosure <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* SECTION 11: GRIEVANCE REDRESSAL */}
              <div className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-8 sm:p-10 shadow-2xs">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[rgba(154,123,44,0.1)] text-[#9A7B2C]"
                  >
                    Section 11
                  </span>
                  <h2 className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                    Grievance Redressal &amp; Dispute Resolution
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed space-y-4 font-body">
                  <p>
                    Niventra Capital Advisory India maintains an established formal dispute
                    resolution mechanism to address complaints and queries from investors and
                    stakeholders:
                  </p>
                  <div className="p-4 bg-white rounded-lg border border-[rgba(26,26,26,0.06)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-[#1A1A1A] mb-1">Grievance SLA:</p>
                      <p className="text-[#5C5C5C]">Formal acknowledgment within 48 hours; resolution within 30 business days.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A] mb-1">Designated Email:</p>
                      <a href="mailto:grievance@niventracapitaladvisory.com" className="text-[#9A7B2C] hover:underline font-medium">
                        grievance@niventracapitaladvisory.com
                      </a>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/grievance/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#1A1A1A] transition-colors"
                    >
                      View Grievance Redressal Procedure <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* SECTION 12: REGULATORY DISCLOSURES */}
              <div className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-8 sm:p-10 shadow-2xs">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[rgba(154,123,44,0.1)] text-[#9A7B2C]"
                  >
                    Section 12
                  </span>
                  <h2 className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                    Statutory &amp; Regulatory Disclosures
                  </h2>
                </div>
                <div className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed space-y-4 font-body">
                  <p>
                    Niventra Capital Advisory India operates in strict accordance with the
                    Companies Act, 2013 and applicable Indian securities rules. We state
                    unequivocally:
                  </p>
                  <blockquote className="p-4 border-l-2 border-[#9A7B2C] bg-white text-xs italic text-[#1A1A1A] rounded-r">
                    &ldquo;We do not offer guaranteed returns or risk-free investments. All
                    representations and debenture structures are subject to regulatory scrutiny
                    and formal corporate charge creation under Form CHG-9.&rdquo;
                  </blockquote>
                  <div className="pt-2">
                    <Link
                      href="/regulatory-disclosures/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#1A1A1A] transition-colors"
                    >
                      Read Full Regulatory Disclosures <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* PENDING CLAUSES NOTICE ACCORDION / INFORMATIVE PANEL */}
              <div className="p-6 bg-[#F4F3EF] rounded-xl border border-[rgba(26,26,26,0.08)] shadow-2xs">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#8A8A8A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mb-1">
                      Pending Supplementary Clauses (Clauses 1–7 &amp; 9–10)
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                      Detailed procedural clauses covering Accredited Investor Qualification,
                      Minimum Subscription Limits (₹10 Lakhs+), PAS-4 Allotment Timelines,
                      Depository Settlement via CDSL/NSDL, and Stamp Duty will be published upon
                      formal legal certification by company counsel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 text-center">
                <Button variant="primary" size="lg" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                  Contact Legal &amp; Advisory Desk
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
