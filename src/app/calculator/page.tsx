import React from "react";
import type { Metadata } from "next";
import { ArrowRight, AlertTriangle, CheckCircle2, ShieldAlert, Calculator } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";

export const metadata: Metadata = {
  title: "Return Calculator — Under Review | Niventra Capital Advisory India",
  description:
    "Notice regarding the deferral and mathematical restructuring of the financial return calculator pending formal CFO certification.",
  alternates: {
    canonical: "/calculator/",
  },
};

export default function CalculatorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/calculator/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Header
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Governance Notice">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Financial Governance &amp; Decision 7
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A] mb-4">
                Return Calculator —{" "}
                <em className="not-italic text-[#9A7B2C]">
                  Formally Deferred.
                </em>
              </h1>

              <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                The interactive return calculation tool is currently withheld pending formal mathematical restructuring and Chief Financial Officer (CFO) certification, eliminating flawed retail compounding assumptions.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            DEFERRAL RATIONALE & GOVERNANCE AUDIT DETAILS
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="deferral-rationale">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mb-12">
              <CalloutNotice variant="brass" title="Fiduciary Commitment to Mathematical Accuracy">
                Niventra Capital Advisory will not publish calculation widgets that produce arithmetic discrepancies or mislead capital providers. Custom, transaction-specific cash-flow schedules are available on request through our structuring desk.
              </CalloutNotice>
            </div>

            <div className="max-w-4xl space-y-10">
              <div className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-8 sm:p-10 shadow-2xs space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Technical Finding</span>
                  <h2
                    id="deferral-rationale"
                    className="font-heading text-2xl font-[600] text-[#1A1A1A]"
                  >
                    Why the Legacy Calculator was Decommissioned
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  During our comprehensive institutional audit of the legacy website, several critical mathematical and conceptual deficiencies were identified in the original JavaScript calculation engine:
                </p>

                <ul className="space-y-4 text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  <li className="flex items-start gap-3 p-4 rounded-lg bg-white border border-[rgba(26,26,26,0.06)]">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="text-[#1A1A1A] block mb-0.5 font-semibold">
                        Equity SIP Compounding Applied to Fixed Debt:
                      </strong>
                      The legacy calculator applied a monthly compounding retail SIP formula inappropriate for fixed-income non-convertible debentures with predefined simple-interest coupon payout schedules.
                    </div>
                  </li>

                  <li className="flex items-start gap-3 p-4 rounded-lg bg-white border border-[rgba(26,26,26,0.06)]">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="text-[#1A1A1A] block mb-0.5 font-semibold">
                        Non-Standard Day-Count Divisors:
                      </strong>
                      The legacy algorithm used an informal 30-day divisor that failed to adhere to Indian banking standards (Actual/365 or Actual/Actual day-count conventions), causing discrepancies across leap years and month boundaries.
                    </div>
                  </li>

                  <li className="flex items-start gap-3 p-4 rounded-lg bg-white border border-[rgba(26,26,26,0.06)]">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <strong className="text-[#1A1A1A] block mb-0.5 font-semibold">
                        Omission of Statutory TDS Withholding:
                      </strong>
                      Outputs failed to model mandatory Tax Deducted at Source (TDS) under Section 193/194A of the Income Tax Act, 1961, falsely implying gross coupon equals net realized return.
                    </div>
                  </li>
                </ul>
              </div>

              {/* REQUIREMENTS FOR THE FUTURE CERTIFIED ENGINE */}
              <div className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-8 sm:p-10 shadow-2xs space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Restructuring Roadmap</span>
                  <h3 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    Parameters Required for Certified Calculation Engine
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  Prior to relaunching an online calculation tool, company finance and compliance counsel must formalize and certify the following specifications:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Definitive debenture coupon rates (12%–16% p.a. specific tranche mapping)",
                    "Payout frequency selection (Monthly, Quarterly, Cumulative at Maturity)",
                    "Day-count convention standard (Actual/365 with leap year handling)",
                    "Automated TDS tax toggle (10% resident, exempt with Form 15G/H)",
                    "Clean separation of principal repayment from periodic coupon distributions",
                    "Formal written certification by Chief Financial Officer",
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5C5C5C] font-body">
                      <CheckCircle2 className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ALTERNATIVE ADVISORY PATHWAY */}
              <div className="p-8 bg-[#F4F3EF] border border-[rgba(26,26,26,0.08)] rounded-xl text-center space-y-4 shadow-2xs">
                <h3 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                  Request an Indicative Cash-Flow Schedule
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-lg mx-auto leading-relaxed font-body">
                  Our structuring team generates customized, transaction-specific debenture amortization schedules tailored to your allocation amount and desired coupon frequency.
                </p>
                <div className="pt-2">
                  <Button variant="primary" size="lg" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                    Connect with Advisory Desk
                  </Button>
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
