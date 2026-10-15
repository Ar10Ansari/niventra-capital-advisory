"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send, ShieldCheck, Lock } from "lucide-react";
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

export const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    category: "Capital Provider / Investor",
    capitalRange: "₹25 Lakh - ₹1 Crore",
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
    if (
      !formData.phoneNumber.trim() ||
      !/^[0-9+\s-]{10,15}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please provide a valid 10-digit phone number.";
    }
    if (!formData.consent) {
      newErrors.consent = "You must agree to the data privacy terms.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate server action submission with Turnstile verification
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xl p-8 sm:p-10 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="font-serif-heading text-2xl font-bold text-[#0B192C]">
          Consultation Request Received
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          Thank you, <strong className="text-gray-900">{formData.fullName}</strong>.
          Our structured capital advisory team will review your enquiry and contact
          you within 1 business day.
        </p>
        <div className="pt-4">
          <Button
            variant="outline-dark"
            size="sm"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: "",
                email: "",
                phoneNumber: "",
                category: "Capital Provider / Investor",
                capitalRange: "₹25 Lakh - ₹1 Crore",
                message: "",
                consent: true,
              });
            }}
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FFFFFF] border border-gray-200/80 rounded-xl p-6 sm:p-8 shadow-xl shadow-black/5 space-y-5"
      noValidate
    >
      <div className="border-b border-gray-100 pb-4">
        <h3 className="font-serif-heading text-xl font-bold text-[#0B192C]">
          Schedule a Capital Consultation
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Confidential enquiry for accredited capital providers and real estate developers.
        </p>
      </div>

      {/* Full Name Input */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Full Legal Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="e.g. Vikramaditya Sharma"
          className={`w-full px-3.5 py-2.5 text-sm rounded-md border transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
            errors.fullName
              ? "border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-[#1E3E62] focus:ring-[#1E3E62]/10"
          }`}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.fullName}</span>
          </p>
        )}
      </div>

      {/* Grid: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@company.com"
            className={`w-full px-3.5 py-2.5 text-sm rounded-md border transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-[#1E3E62] focus:ring-[#1E3E62]/10"
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            placeholder="+91 98765 43210"
            className={`w-full px-3.5 py-2.5 text-sm rounded-md border transition-all focus:outline-none focus:ring-2 min-h-[44px] ${
              errors.phoneNumber
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-[#1E3E62] focus:ring-[#1E3E62]/10"
            }`}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
          />
          {errors.phoneNumber && (
            <p
              id="phoneNumber-error"
              className="text-xs text-red-600 mt-1 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.phoneNumber}</span>
            </p>
          )}
        </div>
      </div>

      {/* Grid: Category & Capital Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Interest Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:border-[#1E3E62] focus:ring-2 focus:ring-[#1E3E62]/10 focus:outline-none min-h-[44px] bg-white"
          >
            <option>Capital Provider / Investor</option>
            <option>Real Estate Developer</option>
            <option>Institutional Partner</option>
            <option>General Advisory Enquiry</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="capitalRange"
            className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
          >
            Anticipated Size
          </label>
          <select
            id="capitalRange"
            name="capitalRange"
            value={formData.capitalRange}
            onChange={(e) =>
              setFormData({ ...formData, capitalRange: e.target.value })
            }
            className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-300 focus:border-[#1E3E62] focus:ring-2 focus:ring-[#1E3E62]/10 focus:outline-none min-h-[44px] bg-white"
          >
            <option>₹10 Lakh - ₹25 Lakh</option>
            <option>₹25 Lakh - ₹1 Crore</option>
            <option>₹1 Crore - ₹5 Crore</option>
            <option>Above ₹5 Crore</option>
          </select>
        </div>
      </div>

      {/* Message Textarea */}
      <div>
        <label
          htmlFor="message"
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Specific Advisory Requirements (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Brief details regarding your capital allocation objectives or project evaluation request..."
          className="w-full px-3.5 py-2.5 text-sm rounded-md border border-gray-300 focus:border-[#1E3E62] focus:ring-2 focus:ring-[#1E3E62]/10 focus:outline-none resize-none"
        />
      </div>

      {/* Security & Cloudflare Turnstile Simulated Badge */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200/60 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>Cloudflare Turnstile Verified Protection</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Lock className="w-3 h-3" />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      {/* DPDP Act Consent Checkbox */}
      <div className="space-y-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 leading-snug">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) =>
              setFormData({ ...formData, consent: e.target.checked })
            }
            className="mt-0.5 rounded border-gray-300 text-[#0B192C] focus:ring-[#D4AF37] h-4 w-4"
          />
          <span>
            I consent to the collection and processing of my contact information by Niventra Capital Advisory India Pvt. Ltd. solely for the purpose of responding to this inquiry, in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.consent}</span>
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full justify-center"
        icon={<Send className="w-4 h-4" />}
      >
        {isSubmitting ? "Submitting Request..." : "Submit Consultation Request"}
      </Button>
    </form>
  );
};
