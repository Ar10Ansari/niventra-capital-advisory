import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | Niventra Capital Advisory India",
  description:
    "Privacy policy and data protection commitments under the Digital Personal Data Protection (DPDP) Act, 2023. How Niventra collects, secures, and handles personal information.",
  alternates: {
    canonical: "/privacy-policy/",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/privacy-policy/" />

      <main id="main-content" className="flex-1">
        <PageHero
          breadcrumbItems={[{ label: "Privacy Policy" }]}
          eyebrow="Data Protection Governance"
          title="Privacy Policy &amp;"
          highlightedText="Data Protection Commitments."
          description={
            <p>
              Niventra Capital Advisory India Pvt. Ltd. is committed to protecting your personal
              data in accordance with the Digital Personal Data Protection (DPDP) Act, 2023
              and applicable Indian information security rules.
            </p>
          }
        />

        {/* ==================================================================
            PRIVACY CLAUSES & BRAND ASSET
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-label="Privacy Policy Details">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Main Policy Content */}
              <div className="lg:col-span-8 space-y-8">

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    1. Information We Collect
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    We collect personal and professional information provided voluntarily by you
                    when submitting consultation requests, project evaluation proposals, or
                    subscribing to institutional updates:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C5C5C]">
                    <li>Full legal name, email address, telephone / WhatsApp contact numbers.</li>
                    <li>Investor category (Individual HNI, Family Office, Corporate Treasury, Real Estate Developer).</li>
                    <li>Anticipated capital allocation size or project financing requirements.</li>
                    <li>Technical metadata including IP address, browser type, and interaction timestamps collected for security and fraud prevention.</li>
                  </ul>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    2. Purpose &amp; Lawful Basis for Data Processing
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    Under the DPDP Act, 2023, we process personal information strictly based on
                    explicit consent provided at the time of submission for specified purposes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C5C5C]">
                    <li>Responding to your advisory enquiries and structuring consultations.</li>
                    <li>Conducting mandatory KYC/AML screening and investor suitability assessments.</li>
                    <li>Fulfilling statutory corporate reporting obligations under the Companies Act, 2013.</li>
                    <li>Maintaining security, preventing automated bot submissions, and safeguarding network integrity.</li>
                  </ul>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    3. Data Security &amp; Encryption Standards
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    We employ industry-standard technical, operational, and physical safeguards
                    to protect personal data against unauthorized access, loss, or alteration.
                    All web transmissions are encrypted using modern Transport Layer Security (TLS 1.3),
                    and stored data is protected with 256-bit encryption with restricted role-based
                    access controls.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    4. Third-Party Sharing Policy
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    <strong>We do not sell, rent, or trade your personal data under any circumstances.</strong>{" "}
                    Information is shared only with vetted institutional data processors under strict
                    confidentiality agreements (such as Debenture Trustees, ROC filing agents, and
                    statutory auditors) or when required by court orders, regulatory agencies (SEBI, RBI, MCA),
                    or applicable Indian statutory mandates.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    5. Cookies &amp; Tracking Technologies
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    We use minimal, privacy-respecting cookies strictly necessary for website
                    navigation, session security, and anti-fraud verification (e.g. Cloudflare Turnstile).
                    We do not utilize invasive cross-site advertising trackers or sell browsing data
                    to commercial ad brokers.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    6. Your Rights &amp; Data Erasure (DPDP Act, 2023)
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    Under the DPDP Act, you have the right to access, review, correct, or request
                    the complete erasure of your personal data held in our systems, subject to statutory
                    retention exemptions required under financial regulations. To submit an erasure
                    request, visit our dedicated Data Protection &amp; Erasure channel.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/delete-account/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#B8922F] transition-colors"
                    >
                      Learn How to Request Data Erasure <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

              </div>

              {/* Side Column: Brand Asset & Key Privacy Badges */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-4 rounded-xl border border-[rgba(26,26,26,0.1)] shadow-sm">
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-3">
                    <Image
                      src="/assets/images/privacy_lock.png"
                      alt="Data security and 256-bit encryption protection lock"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                    />
                  </div>
                  <p className="text-[0.6875rem] text-[#8A8A8A] text-center italic">
                    Enterprise cryptographic safeguards protecting institutional data integrity.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-lg border border-[rgba(26,26,26,0.08)] space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Data Protection Desk
                  </p>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    For privacy inquiries or compliance matters:
                  </p>
                  <a
                    href="mailto:info@niventracapitaladvisory.com"
                    className="text-xs font-medium text-[#1A1A1A] hover:text-[#9A7B2C] block break-all"
                  >
                    info@niventracapitaladvisory.com
                  </a>
                  <p className="text-[0.6875rem] text-[#8A8A8A]">
                    Attn: Data Protection &amp; Compliance Officer
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
