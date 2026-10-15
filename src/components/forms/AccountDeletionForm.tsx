"use client";

import React, { useState } from "react";
import { Trash2, AlertCircle, CheckCircle2 } from "lucide-react";

export const AccountDeletionForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [confirmUnderstood, setConfirmUnderstood] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmUnderstood) {
      setErrorMessage("Please confirm you understand that data erasure is irreversible.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit data erasure request.");
        setIsLoading(false);
        return;
      }

      setResultId(data.requestId || "DEL-CONFIRMED");
      setIsLoading(false);
    } catch {
      setErrorMessage("Network error connecting to data protection gateway.");
      setIsLoading(false);
    }
  };

  if (resultId) {
    return (
      <div className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-8 sm:p-10 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="inline-block px-3 py-1 rounded bg-[#FAFAF7] border border-[rgba(26,26,26,0.1)] text-xs font-mono font-bold text-[#1A1A1A]">
          Request Reference: {resultId}
        </div>
        <h3 className="font-heading text-xl font-semibold text-[#1A1A1A]">
          Erasure Request Queued Under DPDP Act, 2023
        </h3>
        <p className="text-xs text-[#5C5C5C] max-w-md mx-auto leading-relaxed">
          Your formal request for data erasure has been recorded with reference <strong className="font-mono text-[#1A1A1A]">{resultId}</strong>.
          Our compliance team will verify identity credentials and process purging of marketing and correspondence records within 7 to 14 business days, subject to statutory retention exemptions (Companies Act & PMLA).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-8 space-y-5">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
          Online Data Erasure Request
        </h3>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Initiate statutory personal data purging directly via the compliance queue.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="del-name">
          Full Legal Name *
        </label>
        <input
          id="del-name"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Vikramaditya Sharma"
          className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="del-email">
            Registered Email Address *
          </label>
          <input
            id="del-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="del-phone">
            Mobile Contact Number *
          </label>
          <input
            id="del-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="del-reason">
          Reason for Erasure <span className="text-[#8A8A8A] font-normal">(optional)</span>
        </label>
        <textarea
          id="del-reason"
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Revoking consent for marketing outreach and advisory consultations..."
          className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] resize-none"
        />
      </div>

      <div className="pt-2">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmUnderstood}
            onChange={(e) => setConfirmUnderstood(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#9A7B2C] focus:ring-[#9A7B2C]"
          />
          <span className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed">
            I confirm that I am requesting the permanent erasure of my contact information and understand that statutory records required under the Companies Act and PMLA may be retained for mandatory assessment periods.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-red-700 text-white hover:bg-red-800 text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 mt-2"
      >
        {isLoading ? (
          <span>Queuing Erasure Request...</span>
        ) : (
          <>
            <Trash2 className="w-3.5 h-3.5" />
            <span>Submit Data Erasure Request (DPDP Act)</span>
          </>
        )}
      </button>
    </form>
  );
};
