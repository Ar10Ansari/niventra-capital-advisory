"use client";

import React from "react";

export type DashboardTabType =
  | "overview"
  | "investments"
  | "calculator"
  | "kyc"
  | "enquiries"
  | "documents"
  | "grievances";

export function formatFileSize(bytes: number): string {
  if (!bytes) return "0 KB";
  return `${(bytes / 1024).toFixed(0)} KB`;
}

export function getDashboardStatusBadge(status: string): React.ReactNode {
  switch (status) {
    case "NEW":
    case "SUBMITTED":
      return (
        <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          Received
        </span>
      );
    case "IN_REVIEW":
    case "ACKNOWLEDGED":
    case "UNDER_INVESTIGATION":
      return (
        <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          In Review
        </span>
      );
    case "CONTACTED":
    case "QUALIFIED":
      return (
        <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          Consultation Scheduled
        </span>
      );
    case "FOLLOW_UP":
      return (
        <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          Follow-Up Required
        </span>
      );
    case "RESOLVED":
    case "CLOSED":
      return (
        <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          Completed
        </span>
      );
    case "ACTIVE":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          ACTIVE HOLDING
        </span>
      );
    case "MATURED":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-gray-100 text-gray-800 border border-gray-300">
          MATURED
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-gray-100 text-gray-700">
          {status}
        </span>
      );
  }
}
