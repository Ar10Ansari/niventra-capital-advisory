"use client";

import React from "react";
import { AuditLogItem } from "@/lib/api/client";

export const AdminAuditLogsTab: React.FC<{ logs: AuditLogItem[] }> = ({ logs }) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
          Immutable Security Audit Log
        </h2>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Append-only administrative tracking for compliance, status transitions, and data access.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Resource</th>
              <th className="py-3 px-4">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(26,26,26,0.06)] font-mono text-[0.6875rem]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#FAFAF7]/50">
                <td className="py-3 px-4 text-[#8A8A8A] whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-[#1A1A1A]">
                  {log.actor_email || "Anonymous"} ({log.actor_role || "PUBLIC"})
                </td>
                <td className="py-3 px-4 font-bold text-[#1A1A1A]">{log.action}</td>
                <td className="py-3 px-4 text-[#5C5C5C]">
                  {log.resource_type}: {log.resource_id || "N/A"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[0.625rem] ${
                      log.status === "SUCCESS" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
