"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";

export const GrievanceForm: React.FC = () => {
  const [complainantName, setComplainantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [slaDeadline, setSlaDeadline] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complainantName,
          email,
          phone,
          transactionRef,
          subject,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to lodge grievance ticket.");
        setIsLoading(false);
        return;
      }

      setTicketId(data.ticketId || "GRV-CONFIRMED");
      setSlaDeadline(data.slaDeadline || "30 Business Days");
      setIsLoading(false);
    } catch {
      setErrorMessage("Network error connecting to grievance redressal cell.");
      setIsLoading(false);
    }
  };

  if (ticketId) {
    return (
      <div className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-8 sm:p-10 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="inline-block px-3 py-1 rounded bg-[#FAFAF7] border border-[rgba(26,26,26,0.1)] text-xs font-mono font-bold text-[#1A1A1A]">
          Grievance Ticket ID: {ticketId}
        </div>
        <h3 className="font-heading text-xl font-semibold text-[#1A1A1A]">
          Formal Grievance Acknowledged
        </h3>
        <p className="text-xs text-[#5C5C5C] max-w-md mx-auto leading-relaxed">
          Your complaint has been formally logged under ticket <strong className="font-mono text-[#1A1A1A]">{ticketId}</strong>.
          An initial acknowledgment has been recorded. Our Grievance Redressal Officer has been assigned to investigate and provide written resolution within statutory deadline (<strong className="text-[#1A1A1A]">{slaDeadline}</strong>).
        </p>
        <button
          onClick={() => {
            setTicketId(null);
            setComplainantName("");
            setEmail("");
            setPhone("");
            setTransactionRef("");
            setSubject("");
            setDescription("");
          }}
          className="text-xs text-[#9A7B2C] font-semibold underline hover:text-[#1A1A1A]"
        >
          Submit another ticket
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-8 shadow-sm space-y-5">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h3 className="font-heading text-xl font-semibold text-[#1A1A1A]">
          Lodge Formal Grievance Online
        </h3>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Registered directly into our statutory compliance queue with automated SLA tracking.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="grv-name">
          Complainant Full Legal Name *
        </label>
        <input
          id="grv-name"
          type="text"
          required
          value={complainantName}
          onChange={(e) => setComplainantName(e.target.value)}
          placeholder="e.g. Vikramaditya Sharma"
          className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="grv-email">
            Email Address *
          </label>
          <input
            id="grv-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="grv-phone">
            Phone Number *
          </label>
          <input
            id="grv-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="grv-ref">
            Transaction / Enquiry Reference <span className="text-[#8A8A8A] font-normal">(optional)</span>
          </label>
          <input
            id="grv-ref"
            type="text"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            placeholder="e.g. ENQ-2026-0001"
            className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="grv-subject">
            Grievance Subject *
          </label>
          <input
            id="grv-subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Clarification on ROC charge timeline"
            className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="grv-desc">
          Detailed Factual Description *
        </label>
        <textarea
          id="grv-desc"
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe the specific facts, dates, personnel involved, and desired resolution..."
          className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 mt-2"
      >
        {isLoading ? (
          <span>Lodging Grievance Ticket...</span>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            <span>Lodge Grievance Ticket</span>
          </>
        )}
      </button>
    </form>
  );
};
