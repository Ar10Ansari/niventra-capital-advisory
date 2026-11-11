"use client";

import React from "react";
import { EnquiryItem } from "@/lib/api/client";

interface AdminEnquiriesTabProps {
  enquiries: EnquiryItem[];
  onUpdateEnquiry: (id: string, status: string, notes: string) => void;
}

export const AdminEnquiriesTab: React.FC<AdminEnquiriesTabProps> = ({
  enquiries,
  onUpdateEnquiry,
}) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
          CRM Enquiries &amp; Deal Pipeline
        </h2>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Review prospect submissions, assign advisory operators, and append confidential internal notes.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
            <tr>
              <th className="py-3 px-4">Ref ID</th>
              <th className="py-3 px-4">Client Details</th>
              <th className="py-3 px-4">Category &amp; Range</th>
              <th className="py-3 px-4">Status Pipeline</th>
              <th className="py-3 px-4">Internal Advisory Notes</th>
              <th className="py-3 px-4">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
            {enquiries.map((enq) => (
              <tr key={enq.id} className="hover:bg-[#FAFAF7]/50">
                <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{enq.id}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#1A1A1A]">{enq.full_name}</div>
                  <div className="text-[0.6875rem] text-[#8A8A8A]">
                    {enq.email} • {enq.phone_number}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-medium text-[#2D2D2D]">{enq.category}</span>
                  <span className="text-[0.6875rem] text-[#8A8A8A] block">{enq.capital_range}</span>
                </td>
                <td className="py-3.5 px-4">
                  <select
                    value={enq.status}
                    onChange={(e) => onUpdateEnquiry(enq.id, e.target.value, enq.internal_notes || "")}
                    className="bg-white border border-[rgba(26,26,26,0.15)] rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="FOLLOW_UP">FOLLOW_UP</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <input
                    type="text"
                    defaultValue={enq.internal_notes || ""}
                    placeholder="Add internal notes..."
                    onBlur={(e) => onUpdateEnquiry(enq.id, enq.status, e.target.value)}
                    className="w-full text-xs border border-transparent hover:border-gray-200 focus:border-[#9A7B2C] rounded px-2 py-1 bg-transparent focus:bg-white"
                  />
                </td>
                <td className="py-3.5 px-4 text-[#8A8A8A] whitespace-nowrap">
                  {new Date(enq.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
