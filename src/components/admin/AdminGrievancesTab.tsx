"use client";

import React from "react";
import { GrievanceItem } from "@/lib/api/client";

interface AdminGrievancesTabProps {
  grievances: GrievanceItem[];
  onUpdateGrievance: (id: string, status: string, notes: string) => void;
}

export const AdminGrievancesTab: React.FC<AdminGrievancesTabProps> = ({
  grievances,
  onUpdateGrievance,
}) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
          Grievance Redressal Tickets
        </h2>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Formal investor grievances tracked under strict 30-day statutory resolution SLAs.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
            <tr>
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Complainant</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">SLA Deadline</th>
              <th className="py-3 px-4">Resolution Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
            {grievances.map((g) => (
              <tr key={g.id} className="hover:bg-[#FAFAF7]/50">
                <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{g.id}</td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#1A1A1A]">{g.complainant_name}</div>
                  <div className="text-[0.6875rem] text-[#8A8A8A]">
                    {g.email} • {g.phone}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-[#1A1A1A]">{g.subject}</td>
                <td className="py-3.5 px-4">
                  <select
                    value={g.status}
                    onChange={(e) => onUpdateGrievance(g.id, e.target.value, g.resolution_notes || "")}
                    className="bg-white border border-[rgba(26,26,26,0.15)] rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                    <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="ESCALATED">ESCALATED</option>
                  </select>
                </td>
                <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-[#8A8A8A]">
                  {new Date(g.sla_deadline).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4">
                  <input
                    type="text"
                    defaultValue={g.resolution_notes || ""}
                    placeholder="Resolution details..."
                    onBlur={(e) => onUpdateGrievance(g.id, g.status, e.target.value)}
                    className="w-full text-xs border border-transparent hover:border-gray-200 focus:border-[#9A7B2C] rounded px-2 py-1 bg-transparent focus:bg-white"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
