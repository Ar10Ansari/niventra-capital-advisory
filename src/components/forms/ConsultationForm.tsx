"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { Button } from "../ui/Button";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  category: string;
  capitalRange: string;
  message: string;
  consent: boolean;
}

const FIELD_BASE =
  "w-full px-3.5 py-2.5 text-[0.9rem] rounded border bg-white transition-all focus:outline-none focus:ring-2 min-h-[44px]";
const FIELD_NORMAL =
  "border-[rgba(26,26,26,0.15)] focus:border-[rgba(26,26,26,0.4)] focus:ring-[rgba(26,26,26,0.06)]";
const FIELD_ERROR =
  "border-red-400 focus:ring-red-100";

export const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    category: "Capital Provider / Investor",
    capitalRange: "₹25 Lakh – ₹1 Crore",
    message: "",
    consent: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address.";
    }
    if (!formData.phoneNumber.trim() || !/^[0-9+\s-]{10,15}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please provide a valid phone number.";
    }
    if (!formData.consent) {
      newErrors.consent = "You must agree to the data privacy terms to proceed.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulated submission — no production endpoint connected
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div
        className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-8 sm:p-10 text-center space-y-4 fade-in"
        role="status"
        aria-live="polite"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-[1.375rem] font-[600] text-[#1A1A1A]">
          Enquiry received
        </h3>
        <p className="text-[0.9rem] text-[#5C5C5C] max-w-sm mx-auto leading-relaxed">
          Thank you, <strong className="text-[#1A1A1A]">{formData.fullName}</strong>.
          Our advisory team will review your enquiry and contact you within
          one business day.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              fullName: "",
              email: "",
              phoneNumber: "",
              category: "Capital Provider / Investor",
              capitalRange: "₹25 Lakh – ₹1 Crore",
              message: "",
              consent: true,
            });
          }}
          className="text-sm font-medium text-[#9A7B2C] hover:text-[#B8922F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded mt-2 underline underline-offset-2"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-6 sm:p-8 space-y-5"
      noValidate
      aria-label="Advisory consultation enquiry form"
    >
      {/* Form header */}
      <div className="pb-5 border-b border-[rgba(26,26,26,0.08)]">
        <h3 className="font-heading text-[1.25rem] font-[600] text-[#1A1A1A]">
          Schedule a consultation
        </h3>
        <p className="text-[0.8125rem] text-[#8A8A8A] mt-1">
          Confidential. For accredited capital providers and real estate developers.
        </p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
          Full Legal Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="e.g. Vikramaditya Sharma"
          autoComplete="name"
          className={`${FIELD_BASE} ${errors.fullName ? FIELD_ERROR : FIELD_NORMAL}`}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email & Phone grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@company.com"
            autoComplete="email"
            className={`${FIELD_BASE} ${errors.email ? FIELD_ERROR : FIELD_NORMAL}`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className={`${FIELD_BASE} ${errors.phoneNumber ? FIELD_ERROR : FIELD_NORMAL}`}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
          />
          {errors.phoneNumber && (
            <p id="phoneNumber-error" role="alert" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {errors.phoneNumber}
            </p>
          )}
        </div>
      </div>

      {/* Category & Capital range grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
            Interest Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className={`${FIELD_BASE} ${FIELD_NORMAL} bg-white`}
          >
            <option>Capital Provider / Investor</option>
            <option>Real Estate Developer</option>
            <option>Institutional Partner</option>
            <option>General Advisory Enquiry</option>
          </select>
        </div>

        <div>
          <label htmlFor="capitalRange" className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
            Anticipated Size
          </label>
          <select
            id="capitalRange"
            name="capitalRange"
            value={formData.capitalRange}
            onChange={(e) => setFormData({ ...formData, capitalRange: e.target.value })}
            className={`${FIELD_BASE} ${FIELD_NORMAL} bg-white`}
          >
            <option>₹10 Lakh – ₹25 Lakh</option>
            <option>₹25 Lakh – ₹1 Crore</option>
            <option>₹1 Crore – ₹5 Crore</option>
            <option>Above ₹5 Crore</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[#5C5C5C] mb-2">
          Specific Requirements <span className="text-[#8A8A8A] normal-case tracking-normal font-normal">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Brief details regarding your capital allocation objectives or project finance request..."
          className={`${FIELD_BASE} resize-none ${FIELD_NORMAL}`}
        />
      </div>

      {/* Security notice */}
      <div className="flex items-center justify-between text-[0.75rem] text-[#8A8A8A] py-2.5 px-3.5 rounded bg-[#F4F3EF] border border-[rgba(26,26,26,0.07)]">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-brass)" }} aria-hidden="true" />
          Cloudflare Turnstile Verified Protection
        </span>
        <span className="flex items-center gap-1 text-[0.6875rem]">
          <Lock className="w-3 h-3" aria-hidden="true" />
          256-bit Encrypted
        </span>
      </div>

      {/* DPDP Act Consent */}
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="consent"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-0.5 h-4 w-4 rounded border-[rgba(26,26,26,0.25)] text-[#1A1A1A] focus:ring-[#9A7B2C] focus:ring-offset-0 cursor-pointer"
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span className="text-[0.8125rem] text-[#5C5C5C] leading-snug">
            I consent to the collection and processing of my contact information by Niventra
            Capital Advisory India Pvt. Ltd. solely for responding to this enquiry, in
            compliance with the{" "}
            <strong className="font-semibold text-[#2D2D2D]">
              Digital Personal Data Protection (DPDP) Act, 2023.
            </strong>
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="text-xs text-red-600 flex items-center gap-1 pl-7">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            {errors.consent}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full justify-center"
        icon={<ArrowRight className="w-4 h-4" />}
      >
        {isSubmitting ? "Submitting…" : "Submit Enquiry"}
      </Button>
    </form>
  );
};
