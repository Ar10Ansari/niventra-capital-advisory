"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Briefcase,
  Layers,
  X,
  FileCheck,
} from "lucide-react";
import { ProjectFundingFormState } from "./projectFundingConfig";

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 text-sm rounded border border-[rgba(26,26,26,0.15)] bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C]";

const LABEL_CLASS =
  "block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5";

type InputChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

export const ProjectStepDeveloper: React.FC<{
  formData: ProjectFundingFormState;
  onChange: InputChangeHandler;
  onNext: () => void;
}> = ({ formData, onChange, onNext }) => (
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
        <label htmlFor="applicantName" className={LABEL_CLASS}>Applicant Full Name *</label>
        <input id="applicantName" type="text" name="applicantName" value={formData.applicantName} onChange={onChange} placeholder="e.g. Rameshwar Singhania" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="organizationName" className={LABEL_CLASS}>Organization / Developer Entity *</label>
        <input id="organizationName" type="text" name="organizationName" value={formData.organizationName} onChange={onChange} placeholder="e.g. Skyline Infradevelopers Pvt. Ltd." className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="email" className={LABEL_CLASS}>Official Corporate Email *</label>
        <input id="email" type="email" name="email" value={formData.email} onChange={onChange} placeholder="e.g. rameshwar@skylineinfra.com" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="phone" className={LABEL_CLASS}>Direct Contact Phone *</label>
        <input id="phone" type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="e.g. +91 98260 12345" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="role" className={LABEL_CLASS}>Applicant Role / Designation *</label>
        <input id="role" type="text" name="role" value={formData.role} onChange={onChange} placeholder="e.g. Managing Director / Promoter / CFO" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="website" className={LABEL_CLASS}>
          Corporate Website <span className="text-[#8A8A8A] font-normal lowercase">(optional)</span>
        </label>
        <input id="website" type="url" name="website" value={formData.website} onChange={onChange} placeholder="https://skylineinfra.com" className={INPUT_CLASS} />
      </div>
    </div>

    <div className="pt-2">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={onChange} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A1A1A] focus:ring-[#9A7B2C]" />
        <span className="text-xs text-[#5C5C5C] leading-relaxed">
          I consent to Niventra Capital Advisory India Pvt. Ltd. processing this organization and contact data for evaluation and deal correspondence under the Digital Personal Data Protection (DPDP) Act, 2023.
        </span>
      </label>
    </div>

    <div className="pt-6 flex justify-end">
      <button type="button" onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-2xs">
        <span>Proceed to Project Details</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const ProjectStepSpecs: React.FC<{
  formData: ProjectFundingFormState;
  onChange: InputChangeHandler;
  onBack: () => void;
  onNext: () => void;
}> = ({ formData, onChange, onBack, onNext }) => (
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
        <label htmlFor="projectName" className={LABEL_CLASS}>Project Name *</label>
        <input id="projectName" type="text" name="projectName" value={formData.projectName} onChange={onChange} placeholder="e.g. Skyline Heights Phase II" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="category" className={LABEL_CLASS}>Asset Category *</label>
        <select id="category" name="category" value={formData.category} onChange={onChange} className={INPUT_CLASS}>
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
        <label htmlFor="address" className={LABEL_CLASS}>Site Address / Location *</label>
        <input id="address" type="text" name="address" value={formData.address} onChange={onChange} placeholder="Plot No. / Sector / Landmark / Main Road" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="city" className={LABEL_CLASS}>City *</label>
        <input id="city" type="text" name="city" value={formData.city} onChange={onChange} placeholder="e.g. Bhopal / Indore / Gwalior / Jaipur" className={INPUT_CLASS} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="state" className={LABEL_CLASS}>State *</label>
          <select id="state" name="state" value={formData.state} onChange={onChange} className={INPUT_CLASS}>
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
          <label htmlFor="pinCode" className={LABEL_CLASS}>PIN Code *</label>
          <input id="pinCode" type="text" name="pinCode" maxLength={6} value={formData.pinCode} onChange={onChange} placeholder="e.g. 462016" className={INPUT_CLASS} />
        </div>
      </div>
      <div>
        <label htmlFor="landStatus" className={LABEL_CLASS}>Land Title Status *</label>
        <select id="landStatus" name="landStatus" value={formData.landStatus} onChange={onChange} className={INPUT_CLASS}>
          <option value="Freehold Ownership (Clear Title)">Freehold Ownership (Clear Title)</option>
          <option value="Joint Development Agreement (JDA)">Joint Development Agreement (JDA)</option>
          <option value="Leasehold Authority Allotment">Leasehold Authority Allotment</option>
          <option value="Development Rights Under Conveyance">Development Rights Under Conveyance</option>
        </select>
      </div>
      <div>
        <label htmlFor="stage" className={LABEL_CLASS}>Current Development Stage *</label>
        <select id="stage" name="stage" value={formData.stage} onChange={onChange} className={INPUT_CLASS}>
          <option value="UNDER_CONSTRUCTION">Under Construction (Foundation/Superstructure)</option>
          <option value="PLANNING_APPROVALS">Sanctions &amp; RERA in Progress</option>
          <option value="LAND_ACQUISITION">Land Acquired / Pre-Launch</option>
          <option value="COMPLETED">Near Completion / Finishing</option>
          <option value="OTHER">Other Stage</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="description" className={LABEL_CLASS}>Project Description &amp; Salient Features *</label>
        <textarea id="description" name="description" rows={3} value={formData.description} onChange={onChange} placeholder="Outline total saleable area, residential units/commercial floor plates, target buyer segment, and existing milestone progress..." className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="totalCost" className={LABEL_CLASS}>Total Project Cost (₹ Lakhs) *</label>
        <input id="totalCost" type="number" name="totalCost" value={formData.totalCost} onChange={onChange} placeholder="e.g. 4500 (for ₹45 Crores)" className={INPUT_CLASS} />
        <span className="text-[0.6875rem] text-[#8A8A8A] mt-1 block">Enter 100 for ₹1 Crore (100 Lakhs).</span>
      </div>
      <div>
        <label htmlFor="fundingRequested" className={LABEL_CLASS}>Funding Requested (₹ Lakhs) *</label>
        <input id="fundingRequested" type="number" name="fundingRequested" value={formData.fundingRequested} onChange={onChange} placeholder="e.g. 1500 (for ₹15 Crores)" className={INPUT_CLASS} />
        <span className="text-[0.6875rem] text-[#8A8A8A] mt-1 block">Typically 20% to 50% of total project cost.</span>
      </div>
      <div>
        <label htmlFor="promoterContribution" className={LABEL_CLASS}>Promoter&apos;s Equity / Infused Capital (₹ Lakhs)</label>
        <input id="promoterContribution" type="number" name="promoterContribution" value={formData.promoterContribution} onChange={onChange} placeholder="e.g. 1800 (for ₹18 Crores)" className={INPUT_CLASS} />
      </div>
      <div>
        <label htmlFor="expectedTimeline" className={LABEL_CLASS}>Expected Project Timeline *</label>
        <input id="expectedTimeline" type="text" name="expectedTimeline" value={formData.expectedTimeline} onChange={onChange} placeholder="e.g. 30 Months / Target Handover Q3 2028" className={INPUT_CLASS} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="useOfFunds" className={LABEL_CLASS}>Proposed Use of Capital *</label>
        <input id="useOfFunds" type="text" name="useOfFunds" value={formData.useOfFunds} onChange={onChange} placeholder="e.g. Construction milestones, procurement, working capital, approval fees" className={INPUT_CLASS} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="existingLoans" className={LABEL_CLASS}>Existing Financial Encumbrances / Banking Limits</label>
        <input id="existingLoans" type="text" name="existingLoans" value={formData.existingLoans} onChange={onChange} placeholder="e.g. ₹5 Cr Bank Construction Loan with HDFC Bank / Clear of debt" className={INPUT_CLASS} />
      </div>
    </div>

    <div className="pt-6 flex items-center justify-between">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] text-sm font-medium text-[#1A1A1A] hover:bg-[#F4F3EF] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>
      <button type="button" onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-2xs">
        <span>Proceed to Documents</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const DOC_CATEGORIES = [
  { cat: "Company Profile", desc: "Past completions, promoter background, audited financials", icon: Briefcase },
  { cat: "Project Overview", desc: "Architectural drawings, master plan, PIM / pitch deck", icon: Layers },
  { cat: "Land Title / JDA", desc: "Title clearance certificate, search report, registered deed", icon: FileText },
  { cat: "Approvals & RERA", desc: "Sanction letter, building layout approval, RERA registration", icon: ShieldCheck },
  { cat: "Cost & Cash Flows", desc: "Quantity surveyor estimate, monthly sales and cost projections", icon: Building2 },
];

export const ProjectStepDocuments: React.FC<{
  formData: ProjectFundingFormState;
  storageNotice: React.ReactNode;
  onAttachSample: (categoryName: string) => void;
  onRemoveDoc: (idx: number) => void;
  onBack: () => void;
  onNext: () => void;
}> = ({ formData, storageNotice, onAttachSample, onRemoveDoc, onBack, onNext }) => (
  <div className="space-y-6">
    <div>
      <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
        Step 3: Document Verification Checklist
      </h2>
      <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
        Attach preliminary documents supporting project legality, approvals, and financial models. Documents are held under strict confidentiality.
      </p>
    </div>

    {storageNotice}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
      {DOC_CATEGORIES.map((item) => (
        <div key={item.cat} className="p-4 rounded-xl border border-[rgba(26,26,26,0.1)] bg-[#FAFAF7] flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <item.icon className="w-4 h-4 text-[#9A7B2C]" />
              <h4 className="text-xs font-semibold text-[#1A1A1A]">{item.cat}</h4>
            </div>
            <p className="text-[0.6875rem] text-[#7A7A7A] leading-snug">{item.desc}</p>
          </div>
          <button
            type="button"
            onClick={() => onAttachSample(item.cat)}
            className="text-xs font-semibold text-[#9A7B2C] hover:text-[#7A5F1C] bg-white border border-[rgba(154,123,44,0.3)] hover:bg-[rgba(154,123,44,0.06)] px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0"
          >
            + Attach
          </button>
        </div>
      ))}
    </div>

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
            <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[#1A1A1A] truncate">{doc.name}</span>
                <span className="text-[0.6875rem] text-[#8A8A8A] px-2 py-0.5 rounded bg-gray-100 shrink-0">{doc.category}</span>
                <span className="text-[0.6875rem] text-[#8A8A8A] shrink-0">{(doc.size / (1024 * 1024)).toFixed(1)} MB</span>
              </div>
              <button type="button" onClick={() => onRemoveDoc(idx)} className="p-1 text-gray-400 hover:text-red-600 rounded" aria-label={`Remove ${doc.name}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="pt-6 flex items-center justify-between">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] text-sm font-medium text-[#1A1A1A] hover:bg-[#F4F3EF] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>
      <button type="button" onClick={onNext} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-2xs">
        <span>Proceed to Review</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const ProjectStepReview: React.FC<{
  formData: ProjectFundingFormState;
  isSubmitting: boolean;
  disclaimerBlock: React.ReactNode;
  onChange: InputChangeHandler;
  onJumpStep: (step: number) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}> = ({ formData, isSubmitting, disclaimerBlock, onChange, onJumpStep, onBack, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
        Step 4: Application Review &amp; Declaration
      </h2>
      <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1">
        Please review all entered project and organization parameters before submitting to our real estate deal desk.
      </p>
    </div>

    <div className="rounded-xl border border-[rgba(26,26,26,0.1)] bg-[#FAFAF7] divide-y divide-[rgba(26,26,26,0.06)] overflow-hidden text-xs sm:text-sm">
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C]">1. Developer Information</span>
          <button type="button" onClick={() => onJumpStep(1)} className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]">Edit</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div><span className="text-[#8A8A8A] block">Applicant</span><span className="font-medium text-[#1A1A1A]">{formData.applicantName}</span></div>
          <div><span className="text-[#8A8A8A] block">Organization</span><span className="font-medium text-[#1A1A1A]">{formData.organizationName}</span></div>
          <div><span className="text-[#8A8A8A] block">Designation</span><span className="font-medium text-[#1A1A1A]">{formData.role}</span></div>
          <div><span className="text-[#8A8A8A] block">Email</span><span className="font-medium text-[#1A1A1A]">{formData.email}</span></div>
          <div><span className="text-[#8A8A8A] block">Phone</span><span className="font-medium text-[#1A1A1A]">{formData.phone}</span></div>
          <div><span className="text-[#8A8A8A] block">Website</span><span className="font-medium text-[#1A1A1A]">{formData.website || "—"}</span></div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C]">2. Project Parameters</span>
          <button type="button" onClick={() => onJumpStep(2)} className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]">Edit</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div><span className="text-[#8A8A8A] block">Project Name</span><span className="font-medium text-[#1A1A1A]">{formData.projectName}</span></div>
          <div><span className="text-[#8A8A8A] block">Category</span><span className="font-medium text-[#1A1A1A]">{formData.category}</span></div>
          <div><span className="text-[#8A8A8A] block">Location</span><span className="font-medium text-[#1A1A1A]">{formData.city}, {formData.state} ({formData.pinCode})</span></div>
          <div><span className="text-[#8A8A8A] block">Land Status</span><span className="font-medium text-[#1A1A1A]">{formData.landStatus}</span></div>
          <div><span className="text-[#8A8A8A] block">Stage</span><span className="font-medium text-[#1A1A1A]">{formData.stage}</span></div>
          <div><span className="text-[#8A8A8A] block">Timeline</span><span className="font-medium text-[#1A1A1A]">{formData.expectedTimeline}</span></div>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C]">3. Financial &amp; Capital Structure</span>
          <button type="button" onClick={() => onJumpStep(2)} className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]">Edit</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <span className="text-[#8A8A8A] block">Total Project Cost</span>
            <span className="font-semibold text-sm text-[#1A1A1A]">₹{Number(formData.totalCost).toLocaleString("en-IN")} Lakhs</span>
            <span className="text-[0.625rem] text-[#8A8A8A] block">(₹{(Number(formData.totalCost) / 100).toFixed(2)} Cr)</span>
          </div>
          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
            <span className="text-emerald-800 block font-medium">Funding Requested</span>
            <span className="font-bold text-sm text-emerald-900">₹{Number(formData.fundingRequested).toLocaleString("en-IN")} Lakhs</span>
            <span className="text-[0.625rem] text-emerald-700 block">(₹{(Number(formData.fundingRequested) / 100).toFixed(2)} Cr)</span>
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

      <div className="p-4 sm:p-5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-xs uppercase tracking-wider text-[#9A7B2C] block">4. Supporting Documents Attached</span>
          <span className="text-xs text-[#5C5C5C] mt-0.5 block">{formData.documents.length} document(s) indexed for review.</span>
        </div>
        <button type="button" onClick={() => onJumpStep(3)} className="text-xs text-[#9A7B2C] underline hover:text-[#7A5F1C]">Manage Files</button>
      </div>
    </div>

    {disclaimerBlock}

    <div className="pt-2">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" name="declarationConfirmed" checked={formData.declarationConfirmed} onChange={onChange} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#1A1A1A] focus:ring-[#9A7B2C]" />
        <span className="text-xs text-[#2D2D2D] font-medium leading-relaxed">
          I declare that the information submitted above is true, complete, and authorized by the developing entity. I understand this constitutes an initial screening submission and does not represent an approved capital allocation.
        </span>
      </label>
    </div>

    <div className="pt-6 flex items-center justify-between">
      <button type="button" onClick={onBack} disabled={isSubmitting} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] text-sm font-medium text-[#1A1A1A] hover:bg-[#F4F3EF] transition-colors disabled:opacity-50">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>
      <button type="submit" disabled={isSubmitting || !formData.declarationConfirmed} className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-[#2D2D2D] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
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
);

export const ProjectStepConfirmation: React.FC<{
  applicantName: string;
  projectName: string;
  submittedRef: string;
}> = ({ applicantName, projectName, submittedRef }) => (
  <div className="text-center space-y-6 py-6">
    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
      <CheckCircle2 className="w-9 h-9" />
    </div>
    <div className="space-y-2 max-w-lg mx-auto">
      <span className="text-eyebrow block">Application Received</span>
      <h2 className="font-heading text-2xl sm:text-3xl font-[600] text-[#1A1A1A]">Project Application Submitted</h2>
      <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed">
        Thank you, <strong className="text-[#1A1A1A]">{applicantName}</strong>. Your project <strong className="text-[#1A1A1A]">{projectName}</strong> has been assigned to our structured real estate advisory desk.
      </p>
    </div>
    <div className="max-w-md mx-auto p-6 rounded-xl border border-[rgba(154,123,44,0.3)] bg-gradient-to-br from-white to-[#FAFAF7] shadow-sm text-center space-y-2">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">Official Application Reference Number</span>
      <div className="font-heading text-2xl font-bold tracking-tight text-[#1A1A1A]">{submittedRef}</div>
      <p className="text-[0.75rem] text-[#7A7A7A]">Please quote this reference in all communications with our advisory team.</p>
    </div>
    <div className="max-w-xl mx-auto rounded-xl border border-gray-200 bg-[#FAFAF7] p-6 text-left space-y-4">
      <h3 className="font-heading text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#9A7B2C]" />
        <span>Evaluation Workflow &amp; Next Steps</span>
      </h3>
      <ol className="space-y-3 text-xs text-[#5C5C5C]">
        <li className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center font-semibold text-[#1A1A1A] shrink-0 text-[0.6875rem]">1</span>
          <div><strong className="text-[#1A1A1A]">Preliminary Deal Screening (48–72 Hours):</strong> Our team reviews land status, RERA approvals, and market micro-trends.</div>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center font-semibold text-[#1A1A1A] shrink-0 text-[0.6875rem]">2</span>
          <div><strong className="text-[#1A1A1A]">Technical &amp; Cash Flow Verification:</strong> A deal manager will coordinate directly regarding technical plans, financial models, and site inspection.</div>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center font-semibold text-[#1A1A1A] shrink-0 text-[0.6875rem]">3</span>
          <div><strong className="text-[#1A1A1A]">Investment Committee Presentation:</strong> Evaluated structures are packaged for eligible institutional and private debenture capital providers.</div>
        </li>
      </ol>
    </div>
    <div className="max-w-lg mx-auto pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
      <a href="tel:18008900818" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] font-semibold hover:border-[#9A7B2C] transition-colors">
        <Phone className="w-3.5 h-3.5 text-[#9A7B2C]" />
        <span>Call Deal Desk: 1800 890 0818</span>
      </a>
      <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A1A1A] text-white font-semibold hover:bg-[#2D2D2D] transition-colors">
        <span>Return to Homepage</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  </div>
);

