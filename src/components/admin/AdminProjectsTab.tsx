"use client";

import React, { useState, useMemo } from "react";
import { Search, Eye } from "lucide-react";
import { ProjectApplicationItem } from "@/lib/api/client";
import { formatProjectAmountCr, getProjectStatusBadgeClass } from "./adminFormatters";

interface AdminProjectsTabProps {
  projects: ProjectApplicationItem[];
  onOpenProjectDetails: (project: ProjectApplicationItem) => void;
}

export const AdminProjectsTab: React.FC<AdminProjectsTabProps> = ({
  projects,
  onOpenProjectDetails,
}) => {
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
      if (filterCategory !== "ALL" && p.category !== filterCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          p.reference_number.toLowerCase().includes(q) ||
          p.project_name.toLowerCase().includes(q) ||
          p.organization_name.toLowerCase().includes(q) ||
          p.applicant_name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [projects, filterStatus, filterCategory, searchQuery]);

  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
            Real Estate Project Funding Applications
          </h2>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Evaluate developer proposals, inspect capital requirement models, verify documents, and record underwriting status changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8A8A8A]">Total Submissions:</span>
          <span className="font-mono font-bold text-sm text-[#1A1A1A]">{projects.length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#FAFAF7] p-3.5 rounded-lg border border-[rgba(26,26,26,0.06)]">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project name, ref #, developer, city..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#8A8A8A]">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          >
            <option value="ALL">All Statuses</option>
            <option value="RECEIVED">RECEIVED</option>
            <option value="UNDER_REVIEW">UNDER_REVIEW</option>
            <option value="MORE_INFORMATION_REQUIRED">MORE_INFO_REQUIRED</option>
            <option value="SHORTLISTED">SHORTLISTED</option>
            <option value="DECLINED">DECLINED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[#8A8A8A]">Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          >
            <option value="ALL">All Categories</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="MIXED_USE">Mixed-Use</option>
            <option value="PLOTTED_DEVELOPMENT">Plotted</option>
            <option value="REDEVELOPMENT">Redevelopment</option>
            <option value="INDUSTRIAL">Industrial</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
            <tr>
              <th className="py-3 px-3">Ref Number</th>
              <th className="py-3 px-3">Project &amp; Developer</th>
              <th className="py-3 px-3">Category / Stage</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3">Funding / Total Cost</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Submitted</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
            {filteredProjects.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No project applications found matching selected criteria.
                </td>
              </tr>
            ) : (
              filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFAF7]/50">
                  <td className="py-3 px-3 font-mono font-bold text-[#1A1A1A]">
                    {p.reference_number}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-[#1A1A1A]">{p.project_name}</div>
                    <div className="text-[0.6875rem] text-[#8A8A8A]">
                      {p.organization_name} • {p.applicant_name}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-[#2D2D2D]">{p.category}</span>
                    <span className="text-[0.6875rem] text-[#8A8A8A] block">{p.stage}</span>
                  </td>
                  <td className="py-3 px-3 text-[#5C5C5C]">
                    {p.city}, {p.state}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-emerald-900">
                      {formatProjectAmountCr(p.funding_requested)}
                    </div>
                    <div className="text-[0.6875rem] text-[#8A8A8A]">
                      Cost: {formatProjectAmountCr(p.total_cost)}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block font-semibold px-2 py-0.5 rounded text-[0.625rem] border ${getProjectStatusBadgeClass(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#8A8A8A] whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenProjectDetails(p)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A1A1A] text-white text-[0.6875rem] font-medium hover:bg-[#2D2D2D] transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
