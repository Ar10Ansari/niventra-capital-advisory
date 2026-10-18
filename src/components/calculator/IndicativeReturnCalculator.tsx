"use client";

import React, { useState, useId, useMemo } from "react";
import Link from "next/link";
import {
  calculateIndicativeReturn,
  formatINR,
  PayoutFrequency,
  CALCULATOR_BOUNDS,
  TDS_STATUTORY_CAVEAT,
  STATUTORY_FIDUCIARY_DISCLAIMER,
} from "@/lib/calculator";
import { ArrowRight, Info, ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface IndicativeReturnCalculatorProps {
  initialPrincipal?: number;
  initialRate?: number;
  initialTenor?: number;
  initialFrequency?: PayoutFrequency;
  productTitle?: string;
  className?: string;
}

const PRINCIPAL_PRESETS = [
  { label: "₹5 Lakh", value: 500_000 },
  { label: "₹10 Lakh", value: 1_000_000 },
  { label: "₹25 Lakh", value: 2_500_000 },
  { label: "₹50 Lakh", value: 5_000_000 },
  { label: "₹1 Crore", value: 10_000_000 },
];

const TENOR_PRESETS = [
  { label: "12 Mo (1 Yr)", value: 12 },
  { label: "24 Mo (2 Yr)", value: 24 },
  { label: "36 Mo (3 Yr)", value: 36 },
  { label: "60 Mo (5 Yr)", value: 60 },
];

const FREQUENCY_OPTIONS: { label: string; value: PayoutFrequency; sub: string }[] = [
  { label: "Monthly", value: "MONTHLY", sub: "12 payouts/yr" },
  { label: "Quarterly", value: "QUARTERLY", sub: "4 payouts/yr" },
  { label: "Semi-Annual", value: "SEMI_ANNUAL", sub: "2 payouts/yr" },
  { label: "Annual", value: "ANNUAL", sub: "1 payout/yr" },
  { label: "Cumulative", value: "CUMULATIVE", sub: "At Maturity" },
];

export const IndicativeReturnCalculator: React.FC<IndicativeReturnCalculatorProps> = ({
  initialPrincipal = CALCULATOR_BOUNDS.DEFAULT_PRINCIPAL,
  initialRate = CALCULATOR_BOUNDS.DEFAULT_RATE,
  initialTenor = CALCULATOR_BOUNDS.DEFAULT_TENOR_MONTHS,
  initialFrequency = "QUARTERLY",
  productTitle,
  className = "",
}) => {
  const principalId = useId();
  const rateId = useId();
  const tenorId = useId();

  const [principal, setPrincipal] = useState<number>(initialPrincipal);
  const [rate, setRate] = useState<number>(initialRate);
  const [tenor, setTenor] = useState<number>(initialTenor);
  const [frequency, setFrequency] = useState<PayoutFrequency>(initialFrequency);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Compute calculated return
  const result = useMemo(() => {
    return calculateIndicativeReturn({
      principal,
      annualRatePct: rate,
      tenorMonths: tenor,
      payoutFrequency: frequency,
    });
  }, [principal, rate, tenor, frequency]);

  return (
    <div
      className={`rounded-2xl border border-[rgba(26,26,26,0.08)] bg-white shadow-xs overflow-hidden ${className}`}
      aria-label="Indicative Return Calculator"
    >
      {/* Header Banner */}
      <div className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#9A7B2C]" aria-hidden="true" />
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
              Simple-Interest Amortization Engine
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[0.6875rem] font-medium bg-[rgba(154,123,44,0.08)] text-[#9A7B2C] border border-[rgba(154,123,44,0.2)]">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Approved Yield Guidance: 12%–16% p.a.*
          </span>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A] mt-2">
          {productTitle ? `Illustrative Cash-Flow Model: ${productTitle}` : "Indicative Debenture Return Calculator"}
        </h3>
        <p className="font-body text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-2xl leading-relaxed">
          Model gross simple-interest coupon yields and periodic distributions. Non-convertible debentures do not apply compound interest or equity SIP reinvestment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(26,26,26,0.08)]">
        {/* ====================================================================
            LEFT COLUMN: Inputs & Controls
            ==================================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-7">
          {/* 1. Principal Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor={principalId} className="font-heading text-sm font-semibold text-[#1A1A1A]">
                Indicative Principal Amount (₹)
              </label>
              <span className="font-heading text-lg font-bold text-[#1A1A1A]">
                {formatINR(principal)}
              </span>
            </div>

            {/* Slider */}
            <input
              id={principalId}
              type="range"
              min={CALCULATOR_BOUNDS.MIN_PRINCIPAL}
              max={20_000_000} // Up to 2 Cr on slider for granular control
              step={100_000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-[#9A7B2C] h-2 bg-[#EBEBE6] rounded-lg cursor-pointer"
              aria-valuemin={CALCULATOR_BOUNDS.MIN_PRINCIPAL}
              aria-valuemax={20_000_000}
              aria-valuenow={principal}
              aria-label="Investment Principal Amount Slider"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Principal presets">
              {PRINCIPAL_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setPrincipal(preset.value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-all ${
                    principal === preset.value
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] font-medium shadow-2xs"
                      : "bg-[#FAFAF7] text-[#5C5C5C] border-[rgba(26,26,26,0.12)] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Indicative Coupon Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <label htmlFor={rateId} className="font-heading text-sm font-semibold text-[#1A1A1A]">
                  Indicative Coupon Rate (% p.a.)
                </label>
                <span className="text-[0.6875rem] text-[#9A7B2C] font-semibold">
                  (12%–16% approved range)
                </span>
              </div>
              <span className="font-heading text-lg font-bold text-[#9A7B2C]">
                {rate.toFixed(1)}% p.a.*
              </span>
            </div>

            <input
              id={rateId}
              type="range"
              min={10}
              max={18}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#9A7B2C] h-2 bg-[#EBEBE6] rounded-lg cursor-pointer"
              aria-valuemin={10}
              aria-valuemax={18}
              aria-valuenow={rate}
              aria-label="Indicative Coupon Rate Slider"
            />

            <div className="flex justify-between text-[0.6875rem] text-[#7A7A7A]">
              <span>10.0% p.a.</span>
              <span className="text-[#9A7B2C] font-semibold">12%–16% Approved Guidance</span>
              <span>18.0% p.a.</span>
            </div>
          </div>

          {/* 3. Tenor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor={tenorId} className="font-heading text-sm font-semibold text-[#1A1A1A]">
                Contractual Tenor (Months)
              </label>
              <span className="font-heading text-lg font-bold text-[#1A1A1A]">
                {tenor} Months ({ (tenor / 12).toFixed(tenor % 12 === 0 ? 0 : 1) } Yrs)
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Tenor options">
              {TENOR_PRESETS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTenor(t.value)}
                  className={`py-2 px-3 text-xs rounded-lg border text-center transition-all ${
                    tenor === t.value
                      ? "bg-[#9A7B2C] text-white border-[#9A7B2C] font-semibold shadow-2xs"
                      : "bg-[#FAFAF7] text-[#4A4A4A] border-[rgba(26,26,26,0.1)] hover:border-[#9A7B2C] hover:text-[#1A1A1A]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Payout Frequency */}
          <div className="space-y-3">
            <label className="font-heading text-sm font-semibold text-[#1A1A1A] block">
              Coupon Distribution Frequency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Payout frequency">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={frequency === opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    frequency === opt.value
                      ? "bg-[rgba(154,123,44,0.08)] border-[#9A7B2C] ring-1 ring-[#9A7B2C]"
                      : "bg-[#FAFAF7] border-[rgba(26,26,26,0.08)] hover:border-[rgba(26,26,26,0.2)]"
                  }`}
                >
                  <span className={`block text-xs font-semibold ${frequency === opt.value ? "text-[#9A7B2C]" : "text-[#1A1A1A]"}`}>
                    {opt.label}
                  </span>
                  <span className="block text-[0.6875rem] text-[#7A7A7A] mt-0.5">
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================
            RIGHT COLUMN: Computed Output Summary Card
            ==================================================================== */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FAFAF7] flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[rgba(26,26,26,0.08)] pb-4">
              <span className="text-eyebrow">Arithmetic Output</span>
              <span className="text-[0.6875rem] font-mono text-[#7A7A7A]">Gross Simple-Interest</span>
            </div>

            {/* Periodic Payout Display (if not cumulative) */}
            {result.periodicPayout !== null && (
              <div className="p-4 rounded-xl bg-white border border-[rgba(154,123,44,0.25)] shadow-2xs">
                <span className="text-[0.6875rem] uppercase tracking-wider text-[#9A7B2C] font-semibold block mb-1">
                  Indicative {frequency === "MONTHLY" ? "Monthly" : frequency === "QUARTERLY" ? "Quarterly" : frequency === "SEMI_ANNUAL" ? "Semi-Annual" : "Annual"} Distribution
                </span>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  {formatINR(result.periodicPayout)}
                </div>
                <span className="text-[0.6875rem] text-[#7A7A7A] block mt-1">
                  Total of {result.numberOfPayouts} distributions over {tenor} months
                </span>
              </div>
            )}

            {/* Total Gross Interest */}
            <div className="flex items-center justify-between py-2 border-b border-[rgba(26,26,26,0.06)]">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-[#5C5C5C] block">Total Gross Coupon</span>
                <span className="text-[0.6875rem] text-[#8A8A8A] block">Before statutory TDS</span>
              </div>
              <span className="font-heading text-lg font-bold text-[#9A7B2C]">
                {formatINR(result.totalGrossInterest)}
              </span>
            </div>

            {/* Principal Recovery */}
            <div className="flex items-center justify-between py-2 border-b border-[rgba(26,26,26,0.06)]">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-[#5C5C5C] block">Contractual Principal Repayment</span>
                <span className="text-[0.6875rem] text-[#8A8A8A] block">At maturity bullet</span>
              </div>
              <span className="font-heading text-base font-semibold text-[#1A1A1A]">
                {formatINR(result.principal)}
              </span>
            </div>

            {/* Total Maturity Value */}
            <div className="p-4 rounded-xl bg-[#1A1A1A] text-white">
              <span className="text-[0.6875rem] uppercase tracking-widest text-[#C9A84C] font-semibold block mb-1">
                Total Indicative Value (Principal + Interest)
              </span>
              <div className="font-heading text-2xl sm:text-3xl font-bold text-white">
                {formatINR(result.totalMaturityAmount)}
              </div>
              <span className="text-[0.6875rem] text-[rgba(255,255,255,0.6)] block mt-1">
                Net realized value subject to individual investor tax bracket and TDS
              </span>
            </div>

            {/* Schedule Toggle */}
            {result.schedule.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[rgba(26,26,26,0.08)] rounded-lg hover:bg-[#F2F2EC] transition-colors"
                  aria-expanded={showSchedule}
                >
                  <span>View Indicative Cash-Flow Schedule ({result.schedule.length} Periods)</span>
                  {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showSchedule && (
                  <div className="mt-2 max-h-52 overflow-y-auto border border-[rgba(26,26,26,0.08)] rounded-lg bg-white text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.06)] sticky top-0">
                        <tr>
                          <th className="py-2 px-3 text-[0.6875rem] font-semibold text-[#5C5C5C]">Period</th>
                          <th className="py-2 px-3 text-[0.6875rem] font-semibold text-[#5C5C5C] text-right">Distribution</th>
                          <th className="py-2 px-3 text-[0.6875rem] font-semibold text-[#5C5C5C] text-right">Cumulative</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(26,26,26,0.04)] font-mono text-[0.75rem]">
                        {result.schedule.map((row) => (
                          <tr key={row.periodNumber} className="hover:bg-[#FAFAF7]">
                            <td className="py-1.5 px-3 text-[#1A1A1A] font-sans text-xs">{row.periodLabel}</td>
                            <td className="py-1.5 px-3 text-right text-[#9A7B2C] font-semibold">{formatINR(row.payoutAmount)}</td>
                            <td className="py-1.5 px-3 text-right text-[#5C5C5C]">{formatINR(row.cumulativeInterest)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Consultation CTA */}
          <div className="pt-2">
            <Link
              href="/contact/"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#9A7B2C] hover:bg-[#856925] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] focus-visible:ring-offset-2"
            >
              <span>Schedule Institutional Consultation</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* ====================================================================
          STATUTORY COMPLIANCE & TDS DISCLOSURE FOOTER
          ==================================================================== */}
      <div className="bg-[#F6F5F0] border-t border-[rgba(26,26,26,0.08)] p-4 sm:p-6 space-y-2.5">
        <div className="flex items-start gap-2.5 text-[0.6875rem] text-[#5C5C5C] leading-relaxed">
          <Info className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-[#1A1A1A] font-semibold">TDS Statutory Withholding: </strong>
            {TDS_STATUTORY_CAVEAT}
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-[0.6875rem] text-[#6E6E6E] leading-relaxed border-t border-[rgba(26,26,26,0.06)] pt-2.5">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-[#1A1A1A] font-semibold">Indicative Model Notice: </strong>
            {STATUTORY_FIDUCIARY_DISCLAIMER}
          </div>
        </div>
      </div>
    </div>
  );
};
