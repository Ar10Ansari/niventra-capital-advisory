"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Phone,
  Briefcase,
  Layers,
  Calendar,
  X,
  FileCheck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface DocumentMeta {
  name: string;
  category: string;
  size: number;
}

export default function ProjectFundingPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Applicant & Organization
    applicantName: "",
    organizationName: "",
    email: "",
    phone: "",
    role: "",
    website: "",
    consentGiven: true,

    // Step 2: Project Specifications & Capital
    projectName: "",
    category: "RESIDENTIAL",
    address: "",
    city: "",
    state: "Madhya Pradesh",
    pinCode: "",
    landStatus: "Freehold Ownership",
    stage: "UNDER_CONSTRUCTION",
    description: "",
    totalCost: "",
    fundingRequested: "",
    promoterContribution: "",
    useOfFunds: "Construction finance and working capital",
    expectedTimeline: "24–36 Months",
    existingLoans: "None",

    // Step 3: Documents
    documents: [] as DocumentMeta[],

    // Step 4: Fiduciary declaration
    declarationConfirmed: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Step 1 validation
  const validateStep1 = () => {
    if (!formData.applicantName.trim()) return "Full name of the applicant is required.";
    if (!formData.organizationName.trim()) return "Developer / Organization name is required.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "A valid official business email is required.";
    }
    if (!formData.phone.trim() || formData.phone.length < 8) return "A valid contact phone number is required.";
    if (!formData.role.trim()) return "Applicant designation or role is required.";
    if (!formData.consentGiven) return "Consent to process submitted information is required.";
    return null;
  };

  // Step 2 validation
  const validateStep2 = () => {
    if (!formData.projectName.trim()) return "Project name is required.";
    if (!formData.address.trim()) return "Project location address is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.state.trim()) return "State is required.";
    if (!formData.pinCode.trim() || !/^\d{6}$/.test(formData.pinCode)) return "Valid 6-digit postal PIN code is required.";
    if (!formData.description.trim() || formData.description.length < 20) {
      return "Please provide a concise project description (minimum 20 characters).";
    }
    const cost = Number(formData.totalCost);
    if (isNaN(cost) || cost <= 0) return "Total project cost must be a valid positive amount (in ₹ Lakhs).";
    const funding = Number(formData.fundingRequested);
    if (isNaN(funding) || funding <= 0) return "Funding requested must be a valid positive amount (in ₹ Lakhs).";
    if (funding > cost) return "Funding requested cannot exceed the total project cost.";
    if (!formData.useOfFunds.trim()) return "Proposed use of funds is required.";
    if (!formData.expectedTimeline.trim()) return "Expected project timeline is required.";
    return null;
  };

  const handleNext = () => {
    setErrorMessage("");
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  // Simulated Document Attachment
  const handleAddSampleDoc = (categoryName: string) => {
    const sampleNames: Record<string, string> = {
      "Company Profile": "Developer_Corporate_Profile_2026.pdf",
      "Project Overview": "Project_Information_Memorandum.pdf",
      "Land Title / JDA": "Registered_Development_Agreement_Copy.pdf",
      "Approvals & RERA": "RERA_Registration_And_Sanctions.pdf",
      "Cost & Cash Flows": "Estimated_Project_Cashflows_V2.xlsx",
    };
    const fileName = sampleNames[categoryName] || `${categoryName.replace(/\s+/g, "_")}.pdf`;
    
    // Check if already added
    if (formData.documents.some((d) => d.name === fileName)) return;

    setFormData((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          name: fileName,
          category: categoryName,
          size: Math.floor(1024 * 1024 * (1.2 + Math.random() * 2.5)), // 1.2MB - 3.7MB
        },
      ],
    }));
  };

  const handleRemoveDoc = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.declarationConfirmed) {
      setErrorMessage("Please accept the fiduciary declaration before final submission.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/project-funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please verify entered details.");
      }

      setSubmittedRef(data.referenceNumber);
      setCurrentStep(5); // Confirmation screen
      window.scrollTo({ top: 200, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit project. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/project-funding/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Institutional Banner
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] py-12 lg:py-16">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Real Estate Project Evaluation
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-[500] leading-[1.15] tracking-[-0.02em] text-[#1A1A1A] mb-4">
                Submit a Project for{" "}
                <em className="not-italic text-[#9A7B2C]">
                  Funding Consideration.
                </em>
              </h1>

              <p className="font-body text-sm sm:text-base text-[#5C5C5C] leading-relaxed max-w-2xl">
                Niventra Capital Advisory structures private debt, debentures, and mezzanine financing solutions for established developers with high-potential residential and commercial projects. All applications undergo comprehensive due diligence.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[#7A7A7A]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Strict Corporate Confidentiality</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#9A7B2C] shrink-0" />
                  <span>Structured Debt &amp; Mezzanine Capital</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#7A7A7A] shrink-0" />
                  <span>48–72 Hour Preliminary Review</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            MULTI-STEP FORM CONTAINER
            ================================================================== */}
        <section className="py-12 lg:py-16 bg-white border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">

            {/* Stepper Header (Only when not confirmed) */}
            {currentStep < 5 && (
              <div className="mb-10 pb-8 border-b border-[rgba(26,26,26,0.08)]">
                <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                  {[
                    { step: 1, label: "Developer", desc: "Applicant info" },
                    { step: 2, label: "Project Specs", desc: "Cost & capital" },
                    { step: 3, label: "Documents", desc: "Approvals & PIM" },
                    { step: 4, label: "Review", desc: "Verification" },
                  ].map((s) => (
                    <div
                      key={s.step}
                      className={`flex flex-col items-center transition-colors ${
                        currentStep === s.step
                          ? "text-[#1A1A1A]"
                          : currentStep > s.step
                          ? "text-emerald-700"
                          : "text-[#A0A0A0]"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold mb-2 transition-all ${
                          currentStep === s.step
                            ? "bg-[#1A1A1A] text-white shadow-xs"
                            : currentStep > s.step
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-[#F4F3EF] text-[#8A8A8A]"
                        }`}
                      >
                        {currentStep > s.step ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : s.step}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold tracking-tight">{s.label}</span>
                      <span className="text-[0.6875rem] text-[#8A8A8A] hidden sm:block mt-0.5">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ==============================================================
                STEP 1: Applicant and Organization
                ============================================================== */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                    Step 1: Developer &amp; Applicant Credentials
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
                    Provide the official corporate credentials of the developer or authorized representative submitting this project.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                  <div>
                    <label htmlFor="applicantName" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Applicant Full Name *
                    </label>
                    <input
                      id="applicantName"
                      type="text"
                      name="applicantName"
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rameshwar Singhania"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="organizationName" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Organization / Developer Entity *
                    </label>
                    <input
                      id="organizationName"
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="e.g. Skyline Infradevelopers Pvt. Ltd."
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Official Corporate Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. rameshwar@skylineinfra.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Direct Contact Phone *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98260 12345"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Applicant Role / Designation *
                    </label>
                    <input
                      id="role"
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. Managing Director / Promoter / CFO"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Corporate Website <span className="text-[#8A8A8A] font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://skylineinfra.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consentGiven"
                      checked={formData.consentGiven}
                      onChange={handleInputChange}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A1A1A] focus:ring-[#9A7B2C]"
                    />
                    <span className="text-xs text-[#5C5C5C] leading-relaxed">
                      I consent to Niventra Capital Advisory India Pvt. Ltd. processing this organization and contact data for evaluation and deal correspondence under the Digital Personal Data Protection (DPDP) Act, 2023.
                    </span>
                  </label>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-2xs"
                  >
                    <span>Proceed to Project Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                STEP 2: Project Specifications & Capital
                ============================================================== */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                    Step 2: Project Specifications &amp; Capital Structure
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
                    Detail the real estate asset, development approvals status, and specific structured debt capital required.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                  <div>
                    <label htmlFor="projectName" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Project Name *
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="e.g. Skyline Heights Phase II"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Asset Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    >
                      <option value="RESIDENTIAL">Residential (Apartments, Villas)</option>
                      <option value="COMMERCIAL">Commercial (Offices, Retail)</option>
                      <option value="MIXED_USE">Mixed-Use Development</option>
                      <option value="PLOTTED_DEVELOPMENT">Plotted Township Development</option>
                      <option value="REDEVELOPMENT">Urban Redevelopment / SRA</option>
                      <option value="INDUSTRIAL">Industrial / Logistics Park</option>
                      <option value="OTHER">Other Specialized Real Estate</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Site Address / Location *
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Plot No. / Sector / Landmark / Main Road"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Bhopal / Indore / Gwalior / Jaipur"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="state" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                        State *
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                      >
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Other">Other State</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pinCode" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        id="pinCode"
                        type="text"
                        name="pinCode"
                        maxLength={6}
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 462016"
                        className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="landStatus" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Land Title Status *
                    </label>
                    <select
                      id="landStatus"
                      name="landStatus"
                      value={formData.landStatus}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    >
                      <option value="Freehold Ownership (Clear Title)">Freehold Ownership (Clear Title)</option>
                      <option value="Joint Development Agreement (JDA)">Joint Development Agreement (JDA)</option>
                      <option value="Leasehold Authority Allotment">Leasehold Authority Allotment</option>
                      <option value="Development Rights Under Conveyance">Development Rights Under Conveyance</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="stage" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Current Development Stage *
                    </label>
                    <select
                      id="stage"
                      name="stage"
                      value={formData.stage}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    >
                      <option value="UNDER_CONSTRUCTION">Under Construction (Foundation/Superstructure)</option>
                      <option value="PLANNING_APPROVALS">Sanctions &amp; RERA in Progress</option>
                      <option value="LAND_ACQUISITION">Land Acquired / Pre-Launch</option>
                      <option value="COMPLETED">Near Completion / Finishing</option>
                      <option value="OTHER">Other Stage</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Project Description &amp; Salient Features *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Outline total saleable area, residential units/commercial floor plates, target buyer segment, and existing milestone progress..."
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="totalCost" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Total Project Cost (₹ Lakhs) *
                    </label>
                    <input
                      id="totalCost"
                      type="number"
                      name="totalCost"
                      value={formData.totalCost}
                      onChange={handleInputChange}
                      placeholder="e.g. 4500 (for ₹45 Crores)"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                    <span className="text-[0.6875rem] text-[#8A8A8A] mt-1 block">
                      Enter 100 for ₹1 Crore (100 Lakhs).
                    </span>
                  </div>

                  <div>
                    <label htmlFor="fundingRequested" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Funding Requested (₹ Lakhs) *
                    </label>
                    <input
                      id="fundingRequested"
                      type="number"
                      name="fundingRequested"
                      value={formData.fundingRequested}
                      onChange={handleInputChange}
                      placeholder="e.g. 1500 (for ₹15 Crores)"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                    <span className="text-[0.6875rem] text-[#8A8A8A] mt-1 block">
                      Typically 20% to 50% of total project cost.
                    </span>
                  </div>

                  <div>
                    <label htmlFor="promoterContribution" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Promoter&apos;s Equity / Infused Capital (₹ Lakhs)
                    </label>
                    <input
                      id="promoterContribution"
                      type="number"
                      name="promoterContribution"
                      value={formData.promoterContribution}
                      onChange={handleInputChange}
                      placeholder="e.g. 1800 (for ₹18 Crores)"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div>
                    <label htmlFor="expectedTimeline" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Expected Project Timeline *
                    </label>
                    <input
                      id="expectedTimeline"
                      type="text"
                      name="expectedTimeline"
                      value={formData.expectedTimeline}
                      onChange={handleInputChange}
                      placeholder="e.g. 30 Months / Target Handover Q3 2028"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="useOfFunds" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Proposed Use of Capital *
                    </label>
                    <input
                      id="useOfFunds"
                      type="text"
                      name="useOfFunds"
                      value={formData.useOfFunds}
                      onChange={handleInputChange}
                      placeholder="e.g. Construction milestones, procurement, working capital, approval fees"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="existingLoans" className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                      Existing Financial Encumbrances / Banking Limits
                    </label>
                    <input
                      id="existingLoans"
                      type="text"
                      name="existingLoans"
                      value={formData.existingLoans}
                      onChange={handleInputChange}
                      placeholder="e.g. ₹5 Cr Bank Construction Loan with HDFC Bank / Clear of debt"
                      className="w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]"
                    />
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] text-sm font-medium text-[#1A1A1A] hover:bg-[#F4F3EF] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-2xs"
                  >
                    <span>Proceed to Documents</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                STEP 3: Documents and Collateral Checklist
                ============================================================== */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                    Step 3: Document Verification Checklist
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
                    Attach preliminary documents supporting project legality, approvals, and financial models. Documents are held under strict confidentiality.
                  </p>
                </div>

                {/* Storage Mode Notice */}
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-semibold block mb-0.5">Secure Document Upload &amp; Verification Protocol</span>
                    Documents are indexed securely and made accessible strictly to authorized deal analysts. In local and demonstration environments, documents are validated and simulated via client-side metadata recording without public disclosure.
                  </div>
                </div>

                {/* Document Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {[
                    { cat: "Company Profile", desc: "Past completions, promoter background, audited financials", icon: Briefcase },
                    { cat: "Project Overview", desc: "Architectural drawings, master plan, PIM / pitch deck", icon: Layers },
                    { cat: "Land Title / JDA", desc: "Title clearance certificate, search report, registered deed", icon: FileText },
                    { cat: "Approvals & RERA", desc: "Sanction letter, building layout approval, RERA registration", icon: ShieldCheck },
                    { cat: "Cost & Cash Flows", desc: "Quantity surveyor estimate, monthly sales and cost projections", icon: Building2 },
                  ].map((item) => (
                    <div
                      key={item.cat}
                      className="p-4 rounded-xl border border-[rgba(26,26,26,0.1)] bg-[#FAFAF7] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-[#9A7B2C]" />
                          <h4 className="text-xs font-semibold text-[#1A1A1A]">{item.cat}</h4>
                        </div>
                        <p className="text-[0.6875rem] text-[#7A7A7A] leading-snug">{item.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddSampleDoc(item.cat)}
                        className="text-xs font-semibold text-[#9A7B2C] hover:text-[#7A5F1C] bg-white border border-[rgba(154,123,44,0.3)] hover:bg-[rgba(154,123,44,0.06)] px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0"
                      >
                        + Attach
                      </button>
                    </div>
                  ))}
                </div>

                {/* Attached Documents List */}
                <div className="pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-3">
                    Attached Supporting Files ({formData.documents.length})
                  </h3>

                  {formData.documents.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-xs text-[#8A8A8A] bg-[#FAFAF7]">
                      <Upload className="w-6 h-6 text-[#A0A0A0] mx-auto mb-2" />
                      <span>No files attached yet. Click &ldquo;+ Attach&rdquo; on the relevant categories above or attach your pitch deck. Supporting documents can also be submitted directly during due diligence.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white text-xs"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-medium text-[#1A1A1A] truncate">{doc.name}</span>
                            <span className="text-[0.6875rem] text-[#8A8A8A] px-2 py-0.5 rounded bg-gray-100 shrink-0">
                              {doc.category}
                            </span>
                            <span className="text-[0.6875rem] text-[#8A8A8A] shrink-0">
                              {(doc.size / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(idx)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                            aria-label={`Remove ${doc.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] text-sm font-medium text-[#1A1A1A] hover:bg-[#F4F3EF] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-2xs"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ==============================================================
                STEP 4: Review and Submission
                ============================================================== */}
            {currentStep === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                    Step 4: Application Review &amp; Declaration
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
                    Please review all entered project and organization parameters before submitting to our real estate deal desk.
                  </p>
                </div>

                {/* Summary Table */}
                <div className="rounded-xl border border-[rgba(26,26,26,0.1)] bg-[#FAFAF7] divide-y divide-[rgba(26,26,26,0.06)] overflow-hidden text-xs sm:text-sm">
                  {/* Developer Info */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C]">
                        1. Developer Information
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[#8A8A8A] block">Applicant</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.applicantName}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Organization</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.organizationName}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Designation</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.role}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Email</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.email}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Phone</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.phone}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Website</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.website || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C]">
                        2. Project Parameters
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[#8A8A8A] block">Project Name</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.projectName}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Category</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.category}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Location</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.city}, {formData.state} ({formData.pinCode})</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Land Status</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.landStatus}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Stage</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.stage}</span>
                      </div>
                      <div>
                        <span className="text-[#8A8A8A] block">Timeline</span>
                        <span className="font-medium text-[#1A1A1A]">{formData.expectedTimeline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Structure */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C]">
                        3. Financial &amp; Capital Structure
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-[#8A8A8A] block">Total Project Cost</span>
                        <span className="font-semibold text-sm text-[#1A1A1A]">
                          ₹{Number(formData.totalCost).toLocaleString("en-IN")} Lakhs
                        </span>
                        <span className="text-[0.625rem] text-[#8A8A8A] block">
                          (₹{(Number(formData.totalCost) / 100).toFixed(2)} Cr)
                        </span>
                      </div>

                      <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                        <span className="text-emerald-800 block font-medium">Funding Requested</span>
                        <span className="font-bold text-sm text-emerald-900">
                          ₹{Number(formData.fundingRequested).toLocaleString("en-IN")} Lakhs
                        </span>
                        <span className="text-[0.625rem] text-emerald-700 block">
                          (₹{(Number(formData.fundingRequested) / 100).toFixed(2)} Cr)
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-[#8A8A8A] block">Promoter Infusion</span>
                        <span className="font-semibold text-sm text-[#1A1A1A]">
                          {formData.promoterContribution ? `₹${Number(formData.promoterContribution).toLocaleString("en-IN")} Lakhs` : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs pt-1">
                      <span className="text-[#8A8A8A] block">Proposed Use of Capital:</span>
                      <p className="font-medium text-[#2D2D2D] mt-0.5">{formData.useOfFunds}</p>
                    </div>
                  </div>

                  {/* Documents Attached */}
                  <div className="p-4 sm:p-5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C] block">
                        4. Supporting Documents Attached
                      </span>
                      <span className="text-xs text-[#5C5C5C] mt-0.5 block">
                        {formData.documents.length} document(s) indexed for review.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]"
                    >
                      Manage Files
                    </button>
                  </div>
                </div>

                {/* Statutory Fiduciary Disclaimer */}
                <div className="p-4 rounded-xl bg-[rgba(154,123,44,0.06)] border border-[rgba(154,123,44,0.25)] text-xs text-[#4A3B18] space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
                    <ShieldCheck className="w-4 h-4 text-[#9A7B2C] shrink-0" />
                    <span>Statutory Evaluation &amp; Advisory Notice</span>
                  </div>
                  <p className="leading-relaxed">
                    Submission of project information does not constitute a commitment, sanctioned term sheet, or commercial obligation by Niventra Capital Advisory India Pvt. Ltd. All real estate debt proposals are subject to independent title verification, RERA due diligence, cash-flow stress testing, and formal approval by our Investment Committee.
                  </p>
                </div>

                {/* Final Confirmation Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="declarationConfirmed"
                      checked={formData.declarationConfirmed}
                      onChange={handleInputChange}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A1A1A] focus:ring-[#9A7B2C]"
                    />
                    <span className="text-xs text-[#2D2D2D] font-medium leading-relaxed">
                      I declare that the information submitted above is true, complete, and authorized by the developing entity. I understand this constitutes an initial screening submission and does not represent an approved capital allocation.
                    </span>
                  </label>
                </div>

                {/* Navigation Buttons */}
                <div className="pt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] text-sm font-medium text-[#1A1A1A] hover:bg-[#F4F3EF] transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.declarationConfirmed}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project for Consideration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ==============================================================
                STEP 5: Confirmation & Reference Number
                ============================================================== */}
            {currentStep === 5 && submittedRef && (
              <div className="text-center space-y-6 py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="text-eyebrow block">Application Received</span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-[600] text-[#1A1A1A]">
                    Project Application Submitted
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed">
                    Thank you, <strong className="text-[#1A1A1A]">{formData.applicantName}</strong>. Your project <strong className="text-[#1A1A1A]">{formData.projectName}</strong> has been assigned to our structured real estate advisory desk.
                  </p>
                </div>

                {/* Unique Reference Number Box */}
                <div className="max-w-md mx-auto p-6 rounded-xl border border-[rgba(154,123,44,0.3)] bg-gradient-to-br from-white to-[#FAFAF7] shadow-sm text-center space-y-2">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Official Application Reference Number
                  </span>
                  <div className="font-heading text-2xl font-bold tracking-tight text-[#1A1A1A]">
                    {submittedRef}
                  </div>
                  <p className="text-[0.75rem] text-[#7A7A7A]">
                    Please quote this reference in all communications with our advisory team.
                  </p>
                </div>

                {/* Next Steps Card */}
                <div className="max-w-xl mx-auto rounded-xl border border-gray-200 bg-[#FAFAF7] p-6 text-left space-y-4">
                  <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#9A7B2C]" />
                    <span>Evaluation Workflow &amp; Next Steps</span>
                  </h3>

                  <ol className="space-y-3 text-xs text-[#5C5C5C]">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center font-semibold text-[#1A1A1A] shrink-0 text-[0.6875rem]">
                        1
                      </span>
                      <div>
                        <strong className="text-[#1A1A1A]">Preliminary Deal Screening (48–72 Hours):</strong> Our team reviews land status, RERA approvals, and market micro-trends.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center font-semibold text-[#1A1A1A] shrink-0 text-[0.6875rem]">
                        2
                      </span>
                      <div>
                        <strong className="text-[#1A1A1A]">Technical &amp; Cash Flow Verification:</strong> A deal manager will coordinate directly regarding technical plans, financial models, and site inspection.
                      </div>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center font-semibold text-[#1A1A1A] shrink-0 text-[0.6875rem]">
                        3
                      </span>
                      <div>
                        <strong className="text-[#1A1A1A]">Investment Committee Presentation:</strong> Evaluated structures are packaged for eligible institutional and private debenture capital providers.
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Advisory Contact Callout */}
                <div className="max-w-lg mx-auto pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
                  <a
                    href="tel:18008900818"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] font-semibold hover:border-[#9A7B2C] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#9A7B2C]" />
                    <span>Call Deal Desk: 1800 890 0818</span>
                  </a>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A1A1A] text-white font-semibold hover:bg-[#2D2D2D] transition-colors"
                  >
                    <span>Return to Homepage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
