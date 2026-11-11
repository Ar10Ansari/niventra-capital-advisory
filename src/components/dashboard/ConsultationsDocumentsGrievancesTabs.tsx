"use client";

import React from "react";
import NextLink from "next/link";
import { Download } from "lucide-react";
import { apiClient, EnquiryItem, DocumentItem, GrievanceItem } from "@/lib/api/client";
import { formatFileSize, getDashboardStatusBadge } from "./dashboardHelpers";

export const DashboardEnquiriesTab: React.FC<{ enquiries: EnquiryItem[] }> = ({ enquiries }) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
            My Advisory Consultations
          </h2>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Direct pipeline status of your investment & capital structuring inquiries.
          </p>
        </div>
        <NextLink
          href="/contact/"
          className="px-3.5 py-2 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D]"
        >
          Submit Consultation
        </NextLink>
      </div>

      {enquiries.length === 0 ? (
        <p className="text-xs text-[#8A8A8A] py-8 text-center">No inquiries logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
              <tr>
                <th className="py-3 px-4">Ref ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Capital Range</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-[#FAFAF7]/50">
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{enq.id}</td>
                  <td className="py-3.5 px-4 text-[#1A1A1A]">{enq.category}</td>
                  <td className="py-3.5 px-4 text-[#5C5C5C]">{enq.capital_range}</td>
                  <td className="py-3.5 px-4 text-[#5C5C5C]">
                    {new Date(enq.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">{getDashboardStatusBadge(enq.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const DashboardDocumentsTab: React.FC<{ documents: DocumentItem[] }> = ({ documents }) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Document Centre</h2>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Authorized institutional offer documentation, governance frameworks, and corporate profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.625rem] font-mono uppercase px-2 py-0.5 rounded bg-white border border-[rgba(26,26,26,0.1)] text-[#1A1A1A]">
                  {doc.doc_type}
                </span>
                <span className="text-[0.6875rem] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {doc.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#1A1A1A]">{doc.title}</h3>
              <p className="text-xs text-[#5C5C5C] mt-1 font-mono">
                Version: {doc.version} • Size: {formatFileSize(doc.file_size)}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(26,26,26,0.08)] flex items-center justify-between">
              <span className="text-[0.6875rem] text-[#8A8A8A]">Audited PDF Stream</span>
              <a
                href={apiClient.documents.getDownloadUrl(doc.id)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardGrievancesTab: React.FC<{ grievances: GrievanceItem[] }> = ({
  grievances,
}) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
            Grievance & Compliance Tickets
          </h2>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Official complaints tracked under institutional 30-day statutory SLA.
          </p>
        </div>
        <NextLink
          href="/grievance/"
          className="px-3.5 py-2 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D]"
        >
          Lodge Grievance
        </NextLink>
      </div>

      {grievances.length === 0 ? (
        <p className="text-xs text-[#8A8A8A] py-8 text-center">No active grievance tickets found.</p>
      ) : (
        <div className="space-y-4">
          {grievances.map((g) => (
            <div
              key={g.id}
              className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1A1A1A]">{g.id}</span>
                {getDashboardStatusBadge(g.status)}
              </div>
              <div className="text-sm font-semibold text-[#1A1A1A]">{g.subject}</div>
              <div className="flex items-center justify-between text-[0.6875rem] text-[#5C5C5C] pt-2 border-t border-[rgba(26,26,26,0.06)]">
                <span>Logged: {new Date(g.created_at).toLocaleDateString()}</span>
                <span className="font-mono text-[#9A7B2C]">
                  SLA Deadline: {new Date(g.sla_deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
