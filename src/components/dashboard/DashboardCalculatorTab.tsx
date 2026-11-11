"use client";

import React, { useState, useMemo } from "react";
import { Info } from "lucide-react";
import {
  calculateIndicativeReturn,
  formatINR,
  PayoutFrequency,
  TDS_STATUTORY_CAVEAT,
} from "@/lib/calculator";

const PERIOD_LABELS: Record<PayoutFrequency, string> = {
  MONTHLY: "Per Month",
  QUARTERLY: "Per Quarter",
  SEMI_ANNUAL: "Every 6 Months",
  ANNUAL: "Per Year",
  CUMULATIVE: "At Maturity",
};

export const DashboardCalculatorTab: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1_000_000);
  const [rate, setRate] = useState<number>(14.5);
  const [tenor, setTenor] = useState<number>(36);
  const [frequency, setFrequency] = useState<PayoutFrequency>("QUARTERLY");

  const summary = useMemo(() => {
    const result = calculateIndicativeReturn({
      principal,
      annualRatePct: rate,
      tenorMonths: tenor,
      payoutFrequency: frequency,
    });
    const estTdsWithholding = Math.round(result.totalGrossInterest * 0.10);
    const netTotalInterest = result.totalGrossInterest - estTdsWithholding;
    const grossPeriodic =
      result.periodicPayout !== null ? result.periodicPayout : result.totalGrossInterest;

    return {
      result,
      estTdsWithholding,
      netTotalInterest,
      grossPeriodic,
      periodName: PERIOD_LABELS[frequency],
    };
  }, [principal, rate, tenor, frequency]);

  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 sm:p-8 space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
            Illustrative Yield Calculation Engine
          </h2>
          <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            ILLUSTRATIVE MODEL
          </span>
        </div>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Fiduciary standard: Simple-interest coupon model for corporate debentures. Non-compounded; statutory TDS caveats apply.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <label className="font-semibold text-[#1A1A1A]">
                Principal Investment Amount (INR)
              </label>
              <span className="font-mono font-bold text-sm text-[#9A7B2C]">
                {formatINR(principal)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={10000000}
              step={100000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-[#9A7B2C] cursor-pointer"
            />
            <div className="flex gap-2 mt-2.5 flex-wrap">
              {[1000000, 2500000, 5000000, 10000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPrincipal(amt)}
                  className={`text-[0.6875rem] px-2.5 py-1 rounded border ${
                    principal === amt
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-[#FAFAF7] text-[#5C5C5C] border-[rgba(26,26,26,0.1)] hover:border-[#1A1A1A]"
                  }`}
                >
                  {amt >= 10000000 ? "₹1 Crore" : `₹${amt / 100000} Lakh`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <label className="font-semibold text-[#1A1A1A]">Indicative Coupon Rate (% p.a.)</label>
              <span className="font-mono font-bold text-sm text-[#9A7B2C]">
                {rate.toFixed(1)}% p.a.
              </span>
            </div>
            <input
              type="range"
              min={12.0}
              max={16.0}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-[#9A7B2C] cursor-pointer"
            />
            <div className="flex justify-between text-[0.625rem] text-[#8A8A8A] font-mono mt-1">
              <span>12.0% (Senior Debt)</span>
              <span>14.5% (Secured Debenture)</span>
              <span>16.0% (Structured Mezzanine)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                Investment Tenor
              </label>
              <select
                value={tenor}
                onChange={(e) => setTenor(Number(e.target.value))}
                className="w-full p-2.5 rounded border border-[rgba(26,26,26,0.15)] bg-white text-xs text-[#1A1A1A] font-medium"
              >
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
                <option value={48}>48 Months (4 Years)</option>
                <option value={60}>60 Months (5 Years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
                Payout Distribution
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as PayoutFrequency)}
                className="w-full p-2.5 rounded border border-[rgba(26,26,26,0.15)] bg-white text-xs text-[#1A1A1A] font-medium"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="SEMI_ANNUAL">Semi-Annual</option>
                <option value="CUMULATIVE">At Maturity (Cumulative)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Output Summary Card */}
        <div className="p-6 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#9A7B2C] block">
              Calculated Indicative Return Summary
            </span>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
              <div>
                <span className="text-[0.6875rem] text-[#8A8A8A] block">
                  Indicative {summary.periodName}
                </span>
                <span className="text-lg font-bold text-[#1A1A1A]">
                  {formatINR(summary.grossPeriodic)}
                </span>
              </div>
              <div>
                <span className="text-[0.6875rem] text-[#8A8A8A] block">Total Gross Coupon</span>
                <span className="text-lg font-bold text-[#9A7B2C]">
                  {formatINR(summary.result.totalGrossInterest)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[rgba(26,26,26,0.06)] text-xs">
              <div>
                <span className="text-[0.625rem] text-[#8A8A8A] block">Statutory TDS (10%)</span>
                <span className="text-[#5C5C5C] font-mono">
                  -{formatINR(summary.estTdsWithholding)}
                </span>
              </div>
              <div>
                <span className="text-[0.625rem] text-[#8A8A8A] block">Net Projected Interest</span>
                <span className="font-bold text-emerald-700">
                  {formatINR(summary.netTotalInterest)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(26,26,26,0.08)]">
              <span className="text-[0.6875rem] text-[#8A8A8A] block">
                Total Illustrative Payout (Principal + Interest)
              </span>
              <span className="text-2xl font-bold font-heading text-[#1A1A1A]">
                {formatINR(summary.result.totalMaturityAmount)}
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-amber-50/60 border border-amber-200/50 text-[0.6875rem] text-[#5C5C5C] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900">
              <Info className="w-3.5 h-3.5" />
              <span>Statutory Tax & Risk Caveat</span>
            </div>
            <p>{TDS_STATUTORY_CAVEAT}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
