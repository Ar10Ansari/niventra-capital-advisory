import { ProjectApplicationItem } from "@/lib/api/client";

/**
 * Formats project funding / total cost amounts cleanly in Crores (`Cr`) while
 * handling both INR-denominated DB/API records (e.g. `480000000` -> ₹48.00 Cr)
 * and legacy Lakhs-entered submissions (`4800` -> ₹48.00 Cr).
 */
export function formatProjectAmountCr(rawAmount: number | null | undefined): string {
  if (typeof rawAmount !== "number" || !Number.isFinite(rawAmount) || rawAmount <= 0) {
    return "—";
  }
  const amountInCrores = rawAmount >= 1_000_000 ? rawAmount / 10_000_000 : rawAmount / 100;
  return `₹${amountInCrores.toFixed(2)} Cr`;
}

export function getProjectStatusBadgeClass(status: ProjectApplicationItem["status"] | string): string {
  switch (status) {
    case "RECEIVED":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "SHORTLISTED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "UNDER_REVIEW":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "MORE_INFORMATION_REQUIRED":
      return "bg-purple-50 text-purple-800 border-purple-200";
    case "DECLINED":
      return "bg-red-50 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

