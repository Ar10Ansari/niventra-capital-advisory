import React from "react";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";
import { IndicativeReturnCalculator } from "@/components/calculator/IndicativeReturnCalculator";

export const metadata: Metadata = {
  title: "Return Calculator — Under Review & Illustrative Model | Niventra Capital Advisory India",
  description:
    "Notice regarding the deferral and mathematical restructuring of the financial return calculator pending formal CFO certification, with educational simple-interest preview.",
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
            HERO: Clean Header with Deferral Notice
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Calculator Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Development Preview · Formally Deferred
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A] mb-4">
                Return Calculator —{" "}
                <em className="not-italic text-[#9A7B2C]">
                  Under Review.
                </em>
              </h1>

              <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                The formal return calculator is Formally Deferred pending written certification by the Chief Financial Officer. An illustrative simple-interest model is provided below for educational reference.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 1: ILLUSTRATIVE SIMPLE-INTEREST CALCULATOR
            ================================================================== */}
        <section className="py-12 lg:py-16 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="illustrative-calculator-heading">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-8">
              <span className="text-eyebrow mb-2 block">Educational Preview</span>
              <h2 id="illustrative-calculator-heading" className="font-heading text-2xl sm:text-3xl font-[600] text-[#1A1A1A]">
                Illustrative Simple-Interest Calculator
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-2 leading-relaxed font-body">
                This model uses standard simple-interest mathematics matching fixed-income debenture conventions. Binding terms require CFO certification.
              </p>
            </div>

            <IndicativeReturnCalculator initialPrincipal={1000000} initialRate={14.0} initialTenor={36} initialFrequency="QUARTERLY" />
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: DEFERRAL CONTEXT & ADVISORY
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)]" aria-labelledby="deferral-rationale">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mb-10">
              <CalloutNotice variant="brass" title="Mathematical Accuracy Commitment">
                Niventra will not publish calculation widgets that produce arithmetic discrepancies. Custom cash-flow schedules are available through our structuring desk.
              </CalloutNotice>
            </div>

            <div className="max-w-4xl space-y-8">
              {/* Concise Deferral Rationale */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-8 sm:p-10 shadow-2xs space-y-5">
                <div>
                  <span className="text-eyebrow mb-2 block">Governance Note</span>
                  <h2
                    id="deferral-rationale"
                    className="font-heading text-2xl font-[600] text-[#1A1A1A]"
                  >
                    Why the Legacy Calculator was Decommissioned
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                  The original calculator applied equity SIP compounding formulas inappropriate for fixed-income NCDs, used non-standard day-count divisors, and omitted mandatory TDS withholding under Section 193/194A. The replacement engine requires Chief Financial Officer certification before publication.
                </p>
              </div>

              {/* Alternative Advisory Pathway */}
              <div className="p-8 bg-[#F4F3EF] border border-[rgba(26,26,26,0.08)] rounded-xl text-center space-y-4 shadow-2xs">
                <h3 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                  Request a Custom Cash-Flow Schedule
                </h3>
                <p className="text-xs sm:text-sm text-[#5C5C5C] max-w-lg mx-auto leading-relaxed font-body">
                  Our structuring team generates transaction-specific debenture amortization schedules tailored to your allocation and coupon frequency.
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
