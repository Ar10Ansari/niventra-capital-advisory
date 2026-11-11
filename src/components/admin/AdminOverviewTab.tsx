"use client";

import React from "react";
import { Building2, Briefcase, Layers, ShieldCheck } from "lucide-react";
import { ProjectApplicationItem, EnquiryItem, GrievanceItem, ProductItem } from "@/lib/api/client";
import { formatProjectAmountCr, getProjectStatusBadgeClass } from "./adminFormatters";

export type AdminTabType =
  | "overview"
  | "projects"
  | "enquiries"
  | "grievances"
  | "products"
  | "documents"
  | "audit";

interface AdminOverviewTabProps {
  projects: ProjectApplicationItem[];
  enquiries: EnquiryItem[];
  grievances: GrievanceItem[];
  products: ProductItem[];
  onSelectTab: (tab: AdminTabType) => void;
  onOpenProjectDetails: (project: ProjectApplicationItem) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  projects,
  enquiries,
  grievances,
  products,
  onSelectTab,
  onOpenProjectDetails,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
          Advisory Operational Command
        </h1>
        <p className="font-body text-xs text-[#5C5C5C] mt-1">
          Centralized oversight for Real Estate Project Submissions, CRM consultations, investor due diligence, and immutable governance logs.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectTab("projects")}
          className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Project Submissions
            </span>
            <Building2 className="w-4 h-4 text-[#9A7B2C]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
            {projects.length}
          </div>
          <div className="text-[0.6875rem] text-emerald-700 font-medium mt-1">
            {projects.filter((p) => p.status === "RECEIVED" || p.status === "UNDER_REVIEW").length} awaiting underwriting review
          </div>
        </div>

        <div
          onClick={() => onSelectTab("enquiries")}
          className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Total Enquiries
            </span>
            <Briefcase className="w-4 h-4 text-[#9A7B2C]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
            {enquiries.length}
          </div>
          <div className="text-[0.6875rem] text-amber-700 font-medium mt-1">
            {enquiries.filter((e) => e.status === "NEW" || e.status === "IN_REVIEW").length} requiring desk attention
          </div>
        </div>

        <div
          onClick={() => onSelectTab("grievances")}
          className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Grievance Tickets
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
            {grievances.length}
          </div>
          <div className="text-[0.6875rem] text-emerald-700 font-medium mt-1">
            100% within statutory 30-day SLA
          </div>
        </div>

        <div
          onClick={() => onSelectTab("products")}
          className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Offerings Catalog
            </span>
            <Layers className="w-4 h-4 text-[#9A7B2C]" />
          </div>
          <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
            {products.length}
          </div>
          <div className="text-[0.6875rem] text-gray-500 font-medium mt-1">
            Illustrative debenture tranches
          </div>
        </div>
      </div>

      {/* Quick Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
              Recent Project Applications
            </h2>
            <button
              onClick={() => onSelectTab("projects")}
              className="text-xs text-[#9A7B2C] font-semibold hover:underline"
            >
              View All ({projects.length})
            </button>
          </div>
          {projects.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">No project applications submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => onOpenProjectDetails(p)}
                  className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] hover:border-[#9A7B2C]/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1A1A1A]">{p.reference_number}</span>
                    <span
                      className={`text-[0.6875rem] font-semibold px-2 py-0.5 rounded border ${getProjectStatusBadgeClass(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#1A1A1A] mt-1">
                    {p.project_name} • {p.organization_name}
                  </div>
                  <div className="text-[0.6875rem] text-[#5C5C5C] mt-0.5">
                    Req: {formatProjectAmountCr(p.funding_requested)} • {p.city}, {p.state}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
            <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
              Recent Enquiries
            </h2>
            <button
              onClick={() => onSelectTab("enquiries")}
              className="text-xs text-[#9A7B2C] font-semibold hover:underline"
            >
              View All ({enquiries.length})
            </button>
          </div>
          <div className="space-y-3">
            {enquiries.slice(0, 4).map((enq) => (
              <div key={enq.id} className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#1A1A1A]">{enq.id}</span>
                  <span className="text-[0.6875rem] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {enq.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#1A1A1A] mt-1">
                  {enq.full_name} ({enq.email})
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-0.5">
                  {enq.category} • {enq.capital_range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
