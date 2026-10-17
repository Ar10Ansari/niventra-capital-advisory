import React from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { GrievanceForm } from "@/components/forms/GrievanceForm";

export const metadata: Metadata = {
  title: "Grievance & Contact | Niventra Capital Advisory India",
  description:
    "Formal dispute resolution mechanism and investor grievance redressal officer details. 48-hour acknowledgment and 30-day resolution commitment.",
  alternates: {
    canonical: "/grievance/",
  },
};

export default function GrievancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/grievance/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Editorial Header
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Investor Protection &amp; Dispute Resolution
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A] mb-4">
                Grievance Redressal{" "}
                <em className="not-italic text-[#9A7B2C]">
                  Mechanism.
                </em>
              </h1>

              <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                Niventra Capital Advisory India maintains an independent, transparent grievance redressal framework to ensure prompt, equitable resolution of investor inquiries, operational complaints, and contractual concerns with a strict 48-hour response SLA.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            GRIEVANCE REDRESSAL OFFICER DETAILS & WORKFLOW
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-label="Grievance Officer Information">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

              {/* Left Column: Redressal Workflow & Online Submission */}
              <div className="lg:col-span-7 space-y-10">
                <GrievanceForm />

                <div>
                  <span className="text-eyebrow mb-2 block">Resolution Process</span>
                  <h2 className="font-heading text-2xl font-[600] text-[#1A1A1A] mb-3">
                    How We Resolve Stakeholder Concerns
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                    Our multi-tier dispute redressal process is designed to handle queries fairly, impartially, and within documented timelines:
                  </p>
                </div>

                <ol className="space-y-4">
                  {[
                    {
                      step: "01",
                      title: "Lodge Formal Grievance",
                      desc: "Submit your written grievance via the form above or email to grievance@niventracapitaladvisory.com including your full name, contact details, transaction / application reference, and factual summary of the issue.",
                    },
                    {
                      step: "02",
                      title: "Formal Acknowledgment (Within 48 Hours)",
                      desc: "Our Grievance Redressal Officer reviews the intake, assigns a unique tracking ticket number, and issues a formal written acknowledgment within 48 business hours.",
                    },
                    {
                      step: "03",
                      title: "Investigation & Internal Audit",
                      desc: "The complaint is referred to the relevant department (Structuring, Legal, Escrow Operations) for thorough factual examination and internal audit review.",
                    },
                    {
                      step: "04",
                      title: "Resolution & Communication (Within 30 Days)",
                      desc: "A comprehensive written resolution notice detailing the remedial actions taken or explanatory determinations is sent to the complainant within 30 calendar days.",
                    },
                    {
                      step: "05",
                      title: "Governance Escalation",
                      desc: "If the resolution is deemed unsatisfactory by the complainant, the matter is escalated directly to the Corporate Governance Committee and Managing Director for final determination.",
                    },
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-5 flex items-start gap-4 shadow-2xs"
                    >
                      <span
                        className="font-mono text-xs font-bold shrink-0 mt-0.5"
                        style={{ color: "var(--color-brass)" }}
                      >
                        STAGE {item.step}
                      </span>
                      <div className="space-y-1">
                        <h3 className="font-heading text-base font-semibold text-[#1A1A1A]">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right Column: Officer Directory & Escalation Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] rounded-xl p-8 shadow-2xs space-y-6">
                  <div>
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
                      Designated Authority
                    </span>
                    <h3 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                      Grievance Redressal Officer
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm font-body">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">Official Email:</p>
                        <a
                          href="mailto:grievance@niventracapitaladvisory.com"
                          className="text-[#9A7B2C] hover:underline break-all"
                        >
                          grievance@niventracapitaladvisory.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">Physical Address for Written Notices:</p>
                        <address className="not-italic text-[#5C5C5C] mt-0.5 leading-relaxed">
                          Grievance Redressal Cell<br />
                          Niventra Capital Advisory India Pvt. Ltd.<br />
                          Patel Nagar City Centre, Gwalior,<br />
                          Madhya Pradesh — 474001, India
                        </address>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-[#1A1A1A]">Operating Hours:</p>
                        <p className="text-[#5C5C5C] mt-0.5">
                          Monday through Friday, 9:30 AM to 6:30 PM IST (Excluding statutory bank holidays)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[rgba(26,26,26,0.08)]">
                    <Button
                      variant="primary"
                      size="md"
                      href="mailto:grievance@niventracapitaladvisory.com?subject=Grievance%20Redressal%20Request"
                      className="w-full justify-center"
                    >
                      Email Grievance Cell
                    </Button>
                  </div>
                </div>

                <div className="p-6 bg-[#F4F3EF] rounded-xl border border-[rgba(26,26,26,0.08)] space-y-2 shadow-2xs">
                  <h4 className="font-heading text-sm font-semibold text-[#1A1A1A]">
                    Investor Protection Note
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5C5C5C] leading-relaxed font-body">
                    No fee or charge is levied on any investor or stakeholder for submitting a grievance or undergoing the dispute resolution procedure.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
