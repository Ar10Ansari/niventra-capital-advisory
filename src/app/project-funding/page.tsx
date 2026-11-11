"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, AlertCircle, Calendar, FileCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { apiClient } from "@/lib/api/client";
import {
  INITIAL_PROJECT_FUNDING_FORM,
  ProjectFundingFormState,
  SAMPLE_PROJECT_DOCUMENTS,
  validateProjectFundingStep1,
  validateProjectFundingStep2,
} from "@/components/project-funding/projectFundingConfig";
import {
  ProjectStepConfirmation,
  ProjectStepDeveloper,
  ProjectStepDocuments,
  ProjectStepReview,
  ProjectStepSpecs,
} from "@/components/project-funding/ProjectFundingSteps";

const FORM_STEPS = [
  { step: 1, label: "Developer", desc: "Applicant info" },
  { step: 2, label: "Project Specs", desc: "Cost & capital" },
  { step: 3, label: "Documents", desc: "Approvals & PIM" },
  { step: 4, label: "Review", desc: "Verification" },
];

export default function ProjectFundingPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFundingFormState>(INITIAL_PROJECT_FUNDING_FORM);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    setErrorMessage("");
    if (currentStep === 1) {
      const err = validateProjectFundingStep1(formData);
      if (err) {
        setErrorMessage(err);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateProjectFundingStep2(formData);
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

  const handleAddSampleDoc = (categoryName: string) => {
    const template = SAMPLE_PROJECT_DOCUMENTS[categoryName];
    const fileName = template?.fileName || `${categoryName.replace(/\s+/g, "_")}.pdf`;
    const deterministicSize = template?.defaultBytes ?? 1_500_000;
    if (formData.documents.some((d) => d.name === fileName)) return;

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { name: fileName, category: categoryName, size: deterministicSize }],
    }));
  };

  const handleRemoveDoc = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.declarationConfirmed) {
      setErrorMessage("Please accept the fiduciary declaration before final submission.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await apiClient.projects.submit(formData);
      setSubmittedRef(data.referenceNumber);
      setCurrentStep(5);
      window.scrollTo({ top: 200, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit project. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const storageNotice = (
    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
      <div className="leading-relaxed">
        <span className="font-semibold block mb-0.5">Secure Document Upload &amp; Verification Protocol</span>
        Documents are indexed securely and made accessible strictly to authorized deal analysts. In local and demonstration environments, documents are recorded as metadata fixtures pending S3 object storage integration.
      </div>
    </div>
  );

  const disclaimerBlock = (
    <div className="p-4 rounded-xl bg-[rgba(154,123,44,0.06)] border border-[rgba(154,123,44,0.25)] text-xs text-[#4A3B18] space-y-2">
      <div className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
        <ShieldCheck className="w-4 h-4 text-[#9A7B2C] shrink-0" />
        <span>Statutory Evaluation &amp; Advisory Notice</span>
      </div>
      <p className="leading-relaxed">
        Submission of project information does not constitute a commitment, sanctioned term sheet, or commercial obligation by Niventra Capital Advisory India Pvt. Ltd. All real estate debt proposals are subject to independent title verification, RERA due diligence, cash-flow stress testing, and formal approval by our Investment Committee.
      </p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/project-funding/" />

      <main id="main-content" className="flex-1">
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
                <em className="not-italic text-[#9A7B2C]">Funding Consideration.</em>
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

        <section className="py-12 lg:py-16 bg-white border-b border-[rgba(26,26,26,0.08)]">
          <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
            {currentStep < 5 && (
              <div className="mb-10 pb-8 border-b border-[rgba(26,26,26,0.08)]">
                <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                  {FORM_STEPS.map((s) => (
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

            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {currentStep === 1 && (
              <ProjectStepDeveloper formData={formData} onChange={handleInputChange} onNext={handleNext} />
            )}
            {currentStep === 2 && (
              <ProjectStepSpecs formData={formData} onChange={handleInputChange} onBack={handleBack} onNext={handleNext} />
            )}
            {currentStep === 3 && (
              <ProjectStepDocuments
                formData={formData}
                storageNotice={storageNotice}
                onAttachSample={handleAddSampleDoc}
                onRemoveDoc={handleRemoveDoc}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
            {currentStep === 4 && (
              <ProjectStepReview
                formData={formData}
                isSubmitting={isSubmitting}
                disclaimerBlock={disclaimerBlock}
                onChange={handleInputChange}
                onJumpStep={setCurrentStep}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            )}
            {currentStep === 5 && submittedRef && (
              <ProjectStepConfirmation
                applicantName={formData.applicantName}
                projectName={formData.projectName}
                submittedRef={submittedRef}
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
