import React from "react";
import type { Metadata } from "next";
import { Trash2, ShieldAlert, Mail } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";
import { AccountDeletionForm } from "@/components/forms/AccountDeletionForm";

export const metadata: Metadata = {
  title: "Delete Account & Data Erasure | Niventra Capital Advisory India",
  description:
    "Instructions for requesting personal data deletion and record erasure under the Digital Personal Data Protection (DPDP) Act, 2023.",
  alternates: {
    canonical: "/delete-account/",
  },
};

export default function DeleteAccountPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/delete-account/" />

      <main id="main-content" className="flex-1">
        <PageHero
          breadcrumbItems={[{ label: "Data Erasure Request" }]}
          eyebrow="Data Protection &amp; DPDP Act, 2023"
          title="Account Deletion &amp;"
          highlightedText="Data Erasure Request."
          description={
            <p>
              In accordance with the Digital Personal Data Protection (DPDP) Act, 2023,
              you have the right to request the permanent erasure of your personal data
              and contact records maintained in our systems.
            </p>
          }
          sideContent={
            <div className="p-5 bg-white rounded-lg border border-[rgba(26,26,26,0.08)] space-y-2">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A]">
                Processing SLA
              </p>
              <p className="font-heading text-xl font-[600] text-[#1A1A1A]">
                7 to 14 Business Days
              </p>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                Subject to identity verification and statutory financial record retention rules.
              </p>
            </div>
          }
        />

        {/* ==================================================================
            WARNING NOTICE
            ================================================================== */}
        <div className="container-editorial pt-8 pb-4">
          <CalloutNotice variant="warning" title="Irreversible Action Warning">
            Data erasure is permanent and cannot be undone. Once processed, your consultation
            history, contact preferences, and subscription records will be permanently removed
            from our active communication databases.
          </CalloutNotice>
        </div>

        {/* ==================================================================
            ERASURE PROCEDURE & STATUTORY EXEMPTIONS
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-label="Data Erasure Details">
          <div className="container-editorial">
            <div className="max-w-4xl space-y-10">

              {/* Scope of Deletion */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Trash2 className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />
                  <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                    Scope of Data Erasure
                  </h2>
                </div>
                <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                  The current public website does not operate self-service user login accounts;
                  personal data collected comprises advisory inquiries, project submissions,
                  newsletter subscriptions, and correspondence records. Submitting an erasure
                  request covers:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-[#5C5C5C]">
                  <li>Permanent removal of your name, phone number, and email from our marketing and advisory outreach systems.</li>
                  <li>Deletion of preliminary consultation requests and correspondence records where no active contractual debenture subscription exists.</li>
                  <li>Purging of digital analytics and IP logs associated with your contact profile.</li>
                </ul>
              </div>

              {/* Online DPDP Erasure Request Form */}
              <AccountDeletionForm />

              {/* How to Request */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm space-y-6">
                <div>
                  <p className="text-eyebrow mb-2">Submission Instructions</p>
                  <h3 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    How to Submit an Erasure Request
                  </h3>
                </div>

                <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                  To initiate personal data erasure, send an email to our data protection team
                  from the email address you previously used to communicate with us:
                </p>

                <div className="p-6 bg-[#F4F3EF] rounded-lg border border-[rgba(26,26,26,0.08)] space-y-4 text-xs">
                  <div>
                    <span className="font-semibold text-[#8A8A8A] uppercase tracking-wider block mb-1">
                      Recipient Email:
                    </span>
                    <a
                      href="mailto:info@niventracapitaladvisory.com?subject=Account%20Deletion%20Request"
                      className="font-medium text-sm text-[#9A7B2C] hover:underline"
                    >
                      info@niventracapitaladvisory.com
                    </a>
                  </div>

                  <div>
                    <span className="font-semibold text-[#8A8A8A] uppercase tracking-wider block mb-1">
                      Subject Line:
                    </span>
                    <code className="bg-white px-2 py-1 rounded border border-[rgba(26,26,26,0.1)] text-[#1A1A1A]">
                      Account Deletion Request — [Your Full Legal Name]
                    </code>
                  </div>

                  <div>
                    <span className="font-semibold text-[#8A8A8A] uppercase tracking-wider block mb-1">
                      Required Email Body Details:
                    </span>
                    <ul className="list-disc pl-5 space-y-1 text-[#5C5C5C]">
                      <li>Full Legal Name</li>
                      <li>Registered Contact Phone Number</li>
                      <li>Associated Email Address</li>
                      <li>Brief statement: &ldquo;I request the permanent deletion of my personal data under the DPDP Act, 2023.&rdquo;</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    href="mailto:info@niventracapitaladvisory.com?subject=Account%20Deletion%20Request"
                    icon={<Mail className="w-4 h-4" />}
                  >
                    Compose Erasure Request Email
                  </Button>
                </div>
              </div>

              {/* Statutory Data Retention Exemptions */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className="w-6 h-6 text-amber-600" aria-hidden="true" />
                  <h3 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    Statutory Data Retention Exceptions
                  </h3>
                </div>
                <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                  Please note that while marketing and prospective enquiry records are erased promptly,
                  the DPDP Act and Indian financial statutes mandate that certain transactional
                  records must be preserved for statutory periods:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-[#5C5C5C]">
                  <li>
                    <strong>Companies Act, 2013 &amp; MCA Rules:</strong> Records of debenture holders, registers of securities, and ROC charges must be maintained for a statutory minimum of 8 years.
                  </li>
                  <li>
                    <strong>Income Tax Act, 1961:</strong> Information relating to coupon interest payments, tax deductions (TDS certificates), and corporate audit filings must be maintained for mandatory assessment periods.
                  </li>
                  <li>
                    <strong>Prevention of Money Laundering Act (PMLA), 2002:</strong> Customer Due Diligence (CDD) records and KYC verification documentation must be preserved for 5 years after the cessation of the transaction relationship.
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
