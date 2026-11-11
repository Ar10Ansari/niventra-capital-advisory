"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { apiClient, KycRecordItem } from "@/lib/api/client";

interface KycComplianceTabProps {
  kycRecord: KycRecordItem | null;
  onKycUpdated: (record: KycRecordItem | null) => void;
}

export const KycComplianceTab: React.FC<KycComplianceTabProps> = ({
  kycRecord,
  onKycUpdated,
}) => {
  const [panNumber, setPanNumber] = useState("");
  const [idType, setIdType] = useState("PAN");
  const [idNumber, setIdNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await apiClient.kyc.submit({
        panNumber,
        idType,
        idNumber,
        consent,
      });
      setSuccessMessage(res.message);
      const refreshed = await apiClient.kyc.get();
      onKycUpdated(refreshed.kyc);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit KYC record.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
            Investor KYC & Statutory Identity Verification
          </h2>
          <p className="text-xs text-[#5C5C5C] mt-1">
            Regulatory identity verification pursuant to SEBI Private Placement guidelines and PMLA rules.
          </p>
        </div>
        <span
          className={`px-2.5 py-1 rounded text-xs font-bold border ${
            kycRecord?.status === "VERIFIED"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          {kycRecord?.status || "NOT_SUBMITTED"}
        </span>
      </div>

      {successMessage && (
        <div
          role="alert"
          className="p-3.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {kycRecord ? (
        <div className="p-6 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Institutional Identity Documentation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-3 border-t border-[rgba(26,26,26,0.06)]">
            <div>
              <span className="text-[0.625rem] text-[#8A8A8A] block">Masked PAN Identifier</span>
              <span className="font-mono font-bold text-sm text-[#1A1A1A]">
                {kycRecord.pan_number_masked}
              </span>
            </div>
            <div>
              <span className="text-[0.625rem] text-[#8A8A8A] block">Document Type</span>
              <span className="font-bold text-[#1A1A1A]">
                {kycRecord.id_type} ({kycRecord.id_number_masked})
              </span>
            </div>
            <div>
              <span className="text-[0.625rem] text-[#8A8A8A] block">Verification Date</span>
              <span className="text-[#5C5C5C]">
                {kycRecord.verified_at
                  ? new Date(kycRecord.verified_at).toLocaleDateString()
                  : "Pending"}
              </span>
            </div>
          </div>

          {kycRecord.status === "REJECTED" && kycRecord.rejection_reason && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800">
              Rejection Reason: {kycRecord.rejection_reason}
            </div>
          )}

          <div className="text-[0.6875rem] text-[#5C5C5C] pt-3 border-t border-[rgba(26,26,26,0.06)] leading-relaxed">
            DPDP Act 2023 Notice: Your identity credentials are cryptographic tokens strictly isolated for regulatory AML/KYC adherence. Niventra Capital Advisory does not share identity documentation with external marketing networks.
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-4 max-w-2xl">
          <div>
            <h3 className="font-heading text-sm font-semibold text-[#1A1A1A]">
              Submit Statutory KYC Identification
            </h3>
            <p className="text-xs text-[#5C5C5C] mt-0.5">
              Identifiers are masked immediately upon storage in compliance with DPDP Act 2023 data minimization controls.
            </p>
          </div>

          {errorMessage && (
            <div role="alert" className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="kyc-pan">
                PAN Number *
              </label>
              <input
                id="kyc-pan"
                type="text"
                required
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="kyc-id-type">
                Secondary ID Type *
              </label>
              <select
                id="kyc-id-type"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
              >
                <option value="PAN">PAN Card</option>
                <option value="AADHAAR">Aadhaar (Last 4 Digits)</option>
                <option value="PASSPORT">Passport</option>
                <option value="VOTER_ID">Voter ID</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="kyc-id-num">
                Document Number *
              </label>
              <input
                id="kyc-id-num"
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Document reference"
                className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#9A7B2C] focus:ring-[#9A7B2C]"
            />
            <span className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed">
              I authorize Niventra Capital Advisory India Pvt. Ltd. to verify and store masked identity references for SEBI private placement and PMLA AML/KYC compliance under the DPDP Act, 2023.
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#2D2D2D] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting KYC..." : "Submit KYC for Verification"}
          </button>
        </form>
      )}
    </div>
  );
};
