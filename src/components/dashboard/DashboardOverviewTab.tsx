"use client";

import React from "react";
import NextLink from "next/link";
import { Clock, Download } from "lucide-react";
import {
  apiClient,
  InvestmentItem,
  InvestmentSummary,
  EnquiryItem,
  DocumentItem,
} from "@/lib/api/client";
import { formatINR } from "@/lib/calculator";
import {
  DashboardTabType,
  formatFileSize,
  getDashboardStatusBadge,
} from "./dashboardHelpers";

interface DashboardOverviewTabProps {
  invSummary: InvestmentSummary | null;
  investments: InvestmentItem[];
  enquiries: EnquiryItem[];
  documents: DocumentItem[];
  onSelectTab: (tab: DashboardTabType) => void;
  onViewInvestmentLedger: (invId: string) => void;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  invSummary,
  investments,
  enquiries,
  documents,
  onSelectTab,
  onViewInvestmentLedger,
}) => {
  return (
    <div className="space-y-8">
      {/* 4 Primary Portfolio Accounting Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Total Principal Invested
            </span>
            <span className="px-1.5 py-0.5 text-[0.5625rem] font-mono font-bold bg-amber-50 text-amber-700 rounded">
              DEMO
            </span>
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
            {invSummary ? formatINR(invSummary.totalPrincipal) : "₹0"}
          </div>
          <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
            Across {invSummary?.activeCount || 0} active debenture tranches
          </div>
        </div>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Interest Paid to Date
            </span>
            <span className="px-1.5 py-0.5 text-[0.5625rem] font-mono font-bold bg-emerald-50 text-emerald-700 rounded">
              DISBURSED
            </span>
          </div>
          <div className="text-2xl font-bold font-heading text-emerald-700 mt-2">
            {invSummary ? formatINR(invSummary.interestPaid) : "₹0"}
          </div>
          <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
            Contractual coupon payments processed
          </div>
        </div>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Accrued Interest (YTD)
            </span>
            <span className="px-1.5 py-0.5 text-[0.5625rem] font-mono font-bold bg-blue-50 text-blue-700 rounded">
              ACCRUED
            </span>
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
            {invSummary ? formatINR(invSummary.accruedInterest) : "₹0"}
          </div>
          <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
            Pending next payout: {invSummary ? formatINR(invSummary.pendingInterest) : "₹0"}
          </div>
        </div>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Next Scheduled Payout
            </span>
            <Clock className="w-3.5 h-3.5 text-[#9A7B2C]" />
          </div>
          <div className="text-xl font-bold font-heading text-[#9A7B2C] mt-2">
            {invSummary?.nextPayoutDate
              ? new Date(invSummary.nextPayoutDate).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "None Scheduled"}
          </div>
          <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
            Quarterly/Monthly direct bank credit
          </div>
        </div>
      </div>

      {/* Holdings Card in Overview */}
      <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
          <div>
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
              Active Secured Debenture Holdings
            </h2>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Individual bond series allocated under private placement offer letters.
            </p>
          </div>
          <button
            onClick={() => onSelectTab("investments")}
            className="text-xs text-[#9A7B2C] font-semibold hover:underline"
          >
            View Full Ledgers
          </button>
        </div>

        {investments.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8A8A8A] space-y-2">
            <p>No active debenture allocations associated with this investor profile.</p>
            <p className="text-[0.6875rem] text-[#5C5C5C]">
              All debenture investments require compliance onboarding and executed Form PAS-4 documentation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investments.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[0.6875rem] font-bold text-[#1A1A1A] block">
                      {inv.id}
                    </span>
                    <span className="text-xs font-bold text-[#1A1A1A] block mt-0.5">
                      {inv.product_title}
                    </span>
                  </div>
                  {getDashboardStatusBadge(inv.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[rgba(26,26,26,0.06)]">
                  <div>
                    <span className="text-[0.625rem] text-[#8A8A8A] block">Allocated Principal</span>
                    <span className="font-bold text-[#1A1A1A]">{formatINR(inv.principal_amount)}</span>
                  </div>
                  <div>
                    <span className="text-[0.625rem] text-[#8A8A8A] block">Contractual Rate</span>
                    <span className="font-bold text-[#9A7B2C]">{inv.interest_rate_pa}% p.a.</span>
                  </div>
                  <div>
                    <span className="text-[0.625rem] text-[#8A8A8A] block">Tenor & Frequency</span>
                    <span className="text-[#5C5C5C]">
                      {inv.tenor_months} Mo • {inv.payout_frequency}
                    </span>
                  </div>
                  <div>
                    <span className="text-[0.625rem] text-[#8A8A8A] block">Maturity Date</span>
                    <span className="text-[#5C5C5C]">
                      {new Date(inv.maturity_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[rgba(26,26,26,0.06)] flex items-center justify-between text-xs">
                  <span className="text-[0.6875rem] text-emerald-700 font-semibold">
                    Paid: {formatINR(inv.interest_paid)}
                  </span>
                  <button
                    onClick={() => onViewInvestmentLedger(inv.id)}
                    className="text-[0.6875rem] font-semibold text-[#1A1A1A] hover:text-[#9A7B2C] underline"
                  >
                    View Transactions &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Enquiries & Document Centre Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
              My Consultation Inquiries
            </h2>
            <button
              onClick={() => onSelectTab("enquiries")}
              className="text-xs text-[#9A7B2C] font-semibold hover:underline"
            >
              View All ({enquiries.length})
            </button>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-xs text-[#8A8A8A] py-6 text-center">
              No consultation requests submitted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {enquiries.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6875rem] font-bold text-[#1A1A1A]">
                      {item.id}
                    </span>
                    {getDashboardStatusBadge(item.status)}
                  </div>
                  <div className="text-xs font-semibold text-[#1A1A1A]">{item.category}</div>
                  <div className="text-[0.6875rem] text-[#5C5C5C]">
                    Capital Range: {item.capital_range}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
              Approved Document Centre
            </h2>
            <button
              onClick={() => onSelectTab("documents")}
              className="text-xs text-[#9A7B2C] font-semibold hover:underline"
            >
              View All ({documents.length})
            </button>
          </div>

          {documents.length === 0 ? (
            <p className="text-xs text-[#8A8A8A] py-6 text-center">
              No approved documents available at this time.
            </p>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-semibold text-[#1A1A1A]">{doc.title}</div>
                    <div className="text-[0.6875rem] text-[#8A8A8A] font-mono mt-0.5">
                      {doc.doc_type} • v{doc.version} • {formatFileSize(doc.file_size)}
                    </div>
                  </div>
                  <a
                    href={apiClient.documents.getDownloadUrl(doc.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-white border border-[rgba(26,26,26,0.15)] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
        <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-4">
          Compliance & Security Controls
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <NextLink
            href="/grievance/"
            className="p-4 rounded border border-[rgba(26,26,26,0.08)] hover:border-[#9A7B2C] transition-colors block"
          >
            <span className="font-semibold text-[#1A1A1A] block">Lodge Grievance Ticket</span>
            <span className="text-[0.6875rem] text-[#5C5C5C] mt-1 block">
              Escalate compliance or service matters under 30-day statutory SLA.
            </span>
          </NextLink>

          <NextLink
            href="/regulatory-disclosures/"
            className="p-4 rounded border border-[rgba(26,26,26,0.08)] hover:border-[#9A7B2C] transition-colors block"
          >
            <span className="font-semibold text-[#1A1A1A] block">Regulatory Disclosures</span>
            <span className="text-[0.6875rem] text-[#5C5C5C] mt-1 block">
              Review statutory disclosures, risk parameters, and ROC compliance.
            </span>
          </NextLink>

          <NextLink
            href="/delete-account/"
            className="p-4 rounded border border-[rgba(26,26,26,0.08)] hover:border-red-300 transition-colors block text-red-900"
          >
            <span className="font-semibold block">DPDP Account Deletion</span>
            <span className="text-[0.6875rem] text-[#5C5C5C] mt-1 block">
              Submit an official data erasure request under the DPDP Act 2023.
            </span>
          </NextLink>
        </div>
      </div>
    </div>
  );
};
