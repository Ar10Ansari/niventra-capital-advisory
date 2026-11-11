"use client";

import React from "react";
import { InvestmentItem, InvestmentSummary, LedgerTransactionItem } from "@/lib/api/client";
import { formatINR } from "@/lib/calculator";
import { getDashboardStatusBadge } from "./dashboardHelpers";

interface HoldingsLedgerTabProps {
  investments: InvestmentItem[];
  invSummary: InvestmentSummary | null;
  selectedInvId: string | null;
  ledgerTxns: LedgerTransactionItem[];
  isLedgerLoading?: boolean;
  onToggleLedger: (invId: string) => void;
}

export const HoldingsLedgerTab: React.FC<HoldingsLedgerTabProps> = ({
  investments,
  invSummary,
  selectedInvId,
  ledgerTxns,
  isLedgerLoading = false,
  onToggleLedger,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                Secured Debenture Holdings
              </h2>
              <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                DEMO ALLOCATIONS
              </span>
            </div>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Contractual terms, accrued interest calculations, and historical coupon transaction ledgers.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[0.6875rem] text-[#8A8A8A] block">Active Portfolio Value</span>
            <span className="text-lg font-bold font-heading text-[#1A1A1A]">
              {invSummary ? formatINR(invSummary.totalPrincipal) : "₹0"}
            </span>
          </div>
        </div>

        {investments.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#8A8A8A]">
            No debenture holdings found for this account.
          </div>
        ) : (
          <div className="divide-y divide-[rgba(26,26,26,0.08)]">
            {investments.map((inv) => (
              <div key={inv.id} className="py-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#1A1A1A] bg-[#FAFAF7] px-2.5 py-1 rounded border border-[rgba(26,26,26,0.1)]">
                        {inv.id}
                      </span>
                      {getDashboardStatusBadge(inv.status)}
                      <span className="text-xs text-[#8A8A8A] font-mono">
                        Allocated: {new Date(inv.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mt-1.5">
                      {inv.product_title}
                    </h3>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Security: First Pari-Passu Charge registered with ROC (Form CHG-9)
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleLedger(inv.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                        selectedInvId === inv.id
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-white text-[#1A1A1A] border-[rgba(26,26,26,0.15)] hover:bg-[#FAFAF7]"
                      }`}
                    >
                      {selectedInvId === inv.id ? "Close Transaction Ledger" : "View Transaction Ledger"}
                    </button>
                  </div>
                </div>

                {/* 4 Financial Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.06)] text-xs">
                  <div>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block">Principal Invested</span>
                    <span className="text-sm font-bold text-[#1A1A1A]">
                      {formatINR(inv.principal_amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block">Annual Coupon Rate</span>
                    <span className="text-sm font-bold text-[#9A7B2C]">{inv.interest_rate_pa}% p.a.</span>
                    <span className="text-[0.625rem] text-[#5C5C5C] block">({inv.payout_frequency})</span>
                  </div>
                  <div>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block">Interest Actually Paid</span>
                    <span className="text-sm font-bold text-emerald-700">
                      {formatINR(inv.interest_paid)}
                    </span>
                    <span className="text-[0.625rem] text-[#5C5C5C] block">Disbursed to bank</span>
                  </div>
                  <div>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block">Accrued Interest (Total)</span>
                    <span className="text-sm font-bold text-[#1A1A1A]">
                      {formatINR(inv.accrued_interest)}
                    </span>
                    <span className="text-[0.625rem] text-amber-700 block">
                      Pending: {formatINR(inv.pending_interest)}
                    </span>
                  </div>
                </div>

                {/* Expandable Transaction Ledger */}
                {selectedInvId === inv.id && (
                  <div className="mt-4 p-5 rounded-lg border border-[rgba(26,26,26,0.1)] bg-white space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[rgba(26,26,26,0.08)]">
                      <div>
                        <h4 className="font-heading text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                          Transaction & Disbursement Ledger — {inv.id}
                        </h4>
                        <span className="text-[0.6875rem] text-[#5C5C5C]">
                          Certified record of capital inflow and quarterly coupon disbursements.
                        </span>
                      </div>
                      <span className="text-[0.625rem] font-mono text-[#8A8A8A]">
                        All figures INR (₹)
                      </span>
                    </div>

                    {isLedgerLoading ? (
                      <p className="text-xs text-[#8A8A8A] py-4 text-center">
                        Loading transaction ledger...
                      </p>
                    ) : ledgerTxns.length === 0 ? (
                      <p className="text-xs text-[#8A8A8A] py-4 text-center">
                        No ledger transactions recorded yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAFAF7] text-[#8A8A8A] font-mono text-[0.625rem] uppercase">
                            <tr>
                              <th className="py-2.5 px-3">Transaction ID</th>
                              <th className="py-2.5 px-3">Type</th>
                              <th className="py-2.5 px-3">Effective Date</th>
                              <th className="py-2.5 px-3">Reference / UTR</th>
                              <th className="py-2.5 px-3 text-right">Amount</th>
                              <th className="py-2.5 px-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgba(26,26,26,0.06)] font-mono text-xs">
                            {ledgerTxns.map((tx) => (
                              <tr key={tx.id} className="hover:bg-[#FAFAF7]/60">
                                <td className="py-2.5 px-3 font-semibold text-[#1A1A1A]">{tx.id}</td>
                                <td className="py-2.5 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[0.625rem] font-bold ${
                                      tx.transaction_type === "PRINCIPAL_ALLOCATION"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-emerald-50 text-emerald-700"
                                    }`}
                                  >
                                    {tx.transaction_type}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-[#5C5C5C]">{tx.effective_date}</td>
                                <td className="py-2.5 px-3 text-[#5C5C5C] text-[0.6875rem]">
                                  {tx.payment_reference}
                                </td>
                                <td className="py-2.5 px-3 text-right font-bold text-[#1A1A1A]">
                                  {formatINR(tx.amount)}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-emerald-50 text-emerald-800">
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
