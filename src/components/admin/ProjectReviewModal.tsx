"use client";

import React from "react";
import { X, FileText, Clock } from "lucide-react";
import { ProjectApplicationItem, ProjectStatusHistoryItem } from "@/lib/api/client";
import { formatProjectAmountCr } from "./adminFormatters";

interface ProjectReviewModalProps {
  project: ProjectApplicationItem;
  history: ProjectStatusHistoryItem[];
  editStatus: string;
  editNotes: string;
  editDeclineReason: string;
  editInfoRequested: string;
  isUpdating: boolean;
  onChangeStatus: (val: string) => void;
  onChangeNotes: (val: string) => void;
  onChangeDeclineReason: (val: string) => void;
  onChangeInfoRequested: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const ProjectReviewModal: React.FC<ProjectReviewModalProps> = ({
  project,
  history,
  editStatus,
  editNotes,
  editDeclineReason,
  editInfoRequested,
  isUpdating,
  onChangeStatus,
  onChangeNotes,
  onChangeDeclineReason,
  onChangeInfoRequested,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <span className="text-[0.6875rem] font-mono text-[#8A8A8A] uppercase tracking-wider block">
              Project Application Review
            </span>
            <h3 className="font-heading text-xl font-bold text-[#1A1A1A]">
              {project.project_name} ({project.reference_number})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-[#FAFAF7] p-4 rounded-lg border border-gray-200">
          <div>
            <span className="text-[#8A8A8A] block">Developer Organization</span>
            <span className="font-semibold text-[#1A1A1A]">{project.organization_name}</span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Applicant Contact</span>
            <span className="font-semibold text-[#1A1A1A]">
              {project.applicant_name} ({project.role})
            </span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Email &amp; Phone</span>
            <span className="font-semibold text-[#1A1A1A]">
              {project.email} • {project.phone}
            </span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Location</span>
            <span className="font-semibold text-[#1A1A1A]">
              {project.city}, {project.state} ({project.pin_code})
            </span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Asset Category</span>
            <span className="font-semibold text-[#1A1A1A]">{project.category}</span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Stage</span>
            <span className="font-semibold text-[#1A1A1A]">{project.stage}</span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Total Project Cost</span>
            <span className="font-bold text-sm text-[#1A1A1A]">
              {formatProjectAmountCr(project.total_cost)}
            </span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Funding Requested</span>
            <span className="font-bold text-sm text-emerald-800">
              {formatProjectAmountCr(project.funding_requested)}
            </span>
          </div>
          <div>
            <span className="text-[#8A8A8A] block">Promoter Infusion</span>
            <span className="font-semibold text-[#1A1A1A]">
              {formatProjectAmountCr(project.promoter_contribution)}
            </span>
          </div>
        </div>

        {/* Description & Use of Funds */}
        <div className="space-y-3 text-xs">
          <div>
            <span className="font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
              Project Description
            </span>
            <p className="p-3 bg-gray-50 rounded border border-gray-200 text-[#2D2D2D] leading-relaxed">
              {project.description || "No description provided."}
            </p>
          </div>

          <div>
            <span className="font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
              Proposed Use of Funds
            </span>
            <p className="p-3 bg-gray-50 rounded border border-gray-200 text-[#2D2D2D] leading-relaxed">
              {project.use_of_funds || "Not specified."}
            </p>
          </div>
        </div>

        {/* Documents Checklist */}
        <div className="space-y-2">
          <span className="font-semibold uppercase tracking-wider text-xs text-[#8A8A8A] block">
            Uploaded Documents &amp; Evidence
          </span>
          {Array.isArray(project.documents) && project.documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {project.documents.map((doc, idx) => (
                <div key={idx} className="p-2.5 rounded border border-gray-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-[#9A7B2C] shrink-0" />
                    <span className="truncate font-medium text-[#1A1A1A]">{doc.name}</span>
                  </div>
                  <span className="text-[0.625rem] text-gray-400 shrink-0">
                    {(doc.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">No files attached with initial screening submission.</p>
          )}
        </div>

        {/* Underwriting Status Transition & Internal Notes */}
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
            Deal Desk Underwriting Review &amp; Status
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                Change Status To
              </label>
              <select
                value={editStatus}
                onChange={(e) => onChangeStatus(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
              >
                <option value="RECEIVED">RECEIVED (Initial Screening)</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW (Technical &amp; Cash Flow Due Diligence)</option>
                <option value="MORE_INFORMATION_REQUIRED">MORE_INFORMATION_REQUIRED (Query Raised)</option>
                <option value="SHORTLISTED">SHORTLISTED (Approved for Investment Committee)</option>
                <option value="DECLINED">DECLINED (Does Not Meet Risk Parameters)</option>
                <option value="CLOSED">CLOSED (Archived / Deal Executed Offline)</option>
              </select>
            </div>

            {editStatus === "DECLINED" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-red-700 mb-1.5">
                  Reason for Decline
                </label>
                <input
                  type="text"
                  value={editDeclineReason}
                  onChange={(e) => onChangeDeclineReason(e.target.value)}
                  placeholder="e.g. Inadequate asset cover ratio, pending litigation"
                  className="w-full text-xs px-3 py-2 rounded border border-red-300 bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            )}

            {editStatus === "MORE_INFORMATION_REQUIRED" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-700 mb-1.5">
                  Specific Information Requested
                </label>
                <input
                  type="text"
                  value={editInfoRequested}
                  onChange={(e) => onChangeInfoRequested(e.target.value)}
                  placeholder="e.g. Audited balance sheet for FY25, RERA sanction copy"
                  className="w-full text-xs px-3 py-2 rounded border border-purple-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
              Confidential Internal Notes
            </label>
            <textarea
              rows={2}
              value={editNotes}
              onChange={(e) => onChangeNotes(e.target.value)}
              placeholder="Internal deal comments, technical reviewer observations, valuation benchmarks..."
              className="w-full text-xs px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
            />
          </div>

          {history.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="font-semibold uppercase tracking-wider text-[0.6875rem] text-[#8A8A8A]">
                Status History Audit Trail
              </span>
              <div className="space-y-1 text-[0.6875rem] text-[#5C5C5C]">
                {history.map((h) => (
                  <div key={h.id} className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                    <span className="font-mono text-gray-400">{new Date(h.created_at).toLocaleString()}:</span>
                    <span className="font-semibold text-[#1A1A1A]">{h.new_status}</span>
                    <span className="text-gray-400">by {h.changed_by}</span>
                    {h.change_note && <span className="italic text-gray-500">— {h.change_note}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={onSave}
            className="px-5 py-2 rounded bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#2D2D2D] transition-colors disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save Status & Review"}
          </button>
        </div>
      </div>
    </div>
  );
};
