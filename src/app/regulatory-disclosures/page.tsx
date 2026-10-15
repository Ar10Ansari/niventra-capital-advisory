import React from "react";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Scale, FileText, Building2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { CalloutNotice } from "@/components/ui/CalloutNotice";

export const metadata: Metadata = {
  title: "Regulatory Disclosures | Niventra Capital Advisory India",
  description:
    "Formal statutory compliance statement, private placement boundaries under the Companies Act 2013, and corporate transparency declarations.",
  alternates: {
    canonical: "/regulatory-disclosures/",
  },
};

export default function RegulatoryDisclosuresPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/regulatory-disclosures/" />

      <main id="main-content" className="flex-1">
        <PageHero
          breadcrumbItems={[{ label: "Regulatory Disclosures" }]}
          eyebrow="Compliance & Governance"
          title="Statutory & Regulatory"
          highlightedText="Disclosures."
          description={
            <p>
              Official governance declarations outlining corporate authority, statutory
              operating parameters under Indian law, private placement boundaries, and
              unconditional disclaimers regarding financial return guarantees.
            </p>
          }
          sideContent={
            <div className="p-6 bg-white rounded-lg border border-[rgba(26,26,26,0.08)] space-y-2">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A]">
                Governing Framework
              </span>
              <p className="font-heading text-lg font-[600] text-[#1A1A1A]">
                Ministry of Corporate Affairs
              </p>
              <p className="text-xs text-[#5C5C5C] leading-relaxed">
                Companies Act, 2013 · ROC Gwalior / New Delhi Jurisdiction.
              </p>
            </div>
          }
        />

        {/* ==================================================================
            PRIMARY STATUTORY DECLARATION CALLOUT
            ================================================================== */}
        <div className="container-editorial pt-8 pb-4">
          <CalloutNotice variant="brass" title="Core Regulatory Declaration">
            &ldquo;We do not offer guaranteed returns or risk-free investments. All representations
            and debenture structures are subject to regulatory scrutiny, corporate board resolutions,
            and formal charge creation with the Registrar of Companies (ROC Form CHG-9).&rdquo;
          </CalloutNotice>
        </div>

        {/* ==================================================================
            REGULATORY FRAMEWORK & DETAILED STATEMENTS
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-label="Regulatory Disclosures Content">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Main Content Column */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />
                    <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                      1. Corporate Legal Standing & Jurisdiction
                    </h2>
                  </div>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    Niventra Capital Advisory India Pvt. Ltd. is an incorporated corporate entity
                    domiciled in the Republic of India with registered corporate offices at Patel Nagar
                    City Centre, Gwalior, Madhya Pradesh — 474001, and representative presence in New Delhi.
                    Our operations are governed by the Companies Act, 2013 and applicable Ministry of
                    Corporate Affairs (MCA) regulations.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Scale className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />
                    <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                      2. Private Placement Framework (Section 42 & 71)
                    </h2>
                  </div>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    Any debenture instrument facilitated or issued through Niventra is offered strictly
                    pursuant to Section 42 (Offer or Invitation for Subscription of Securities on Private
                    Placement) and Section 71 (Debentures) of the Companies Act, 2013, read with the
                    Companies (Share Capital and Debentures) Rules, 2014:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs text-[#5C5C5C]">
                    <li><strong>No Public Advertisement:</strong> Private placement debentures are not offered through public advertisements, media broadcasts, or unrestricted marketing.</li>
                    <li><strong>Statutory PAS-4 Letter:</strong> Offers are addressed strictly to identified individuals who have expressed informed interest and qualified as accredited or eligible capital providers.</li>
                    <li><strong>Direct Banking Channels:</strong> Subscriptions are payable solely from the subscriber&rsquo;s own registered bank account via electronic banking (NEFT/RTGS/Escrow).</li>
                  </ul>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />
                    <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                      3. Collateral & Charge Registration (ROC Form CHG-9)
                    </h2>
                  </div>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    In accordance with statutory debenture rules, secured debentures are secured by
                    the creation of a charge on the properties or assets of the issuing company or its
                    identified project SPV. Such charges are formally filed and certified by the Registrar
                    of Companies (ROC) under Form CHG-9, establishing an enforceable public legal claim
                    in favor of the Debenture Trustee.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 sm:p-10 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-6 h-6 text-[#9A7B2C]" aria-hidden="true" />
                    <h2 className="font-heading text-xl sm:text-2xl font-[600] text-[#1A1A1A]">
                      4. Transparency on Ongoing Verifications
                    </h2>
                  </div>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    In adherence to ethical corporate conduct, Niventra does not fabricate regulatory
                    license numbers, third-party approvals, or credit ratings. Specific regulatory
                    approvals, tax deduction certificates, and issuing entity documentation remain
                    subject to formal internal governance policies. Inquiries regarding our corporate
                    standing may be addressed to our legal desk.
                  </p>
                </div>

                <div className="p-8 bg-[#F4F3EF] border border-[rgba(26,26,26,0.08)] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-1">
                      Compliance or Verification Inquiries
                    </h3>
                    <p className="text-xs text-[#5C5C5C]">
                      Contact our compliance team for corporate governance questions or formal documentation.
                    </p>
                  </div>
                  <Button variant="primary" size="md" href="/contact/" icon={<ArrowRight className="w-4 h-4" />}>
                    Contact Compliance Team
                  </Button>
                </div>
              </div>

              {/* Sticky Sidebar */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                <div className="bg-white p-6 rounded-lg border border-[rgba(26,26,26,0.08)] shadow-sm space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Statutory References
                  </p>
                  <div className="space-y-3 text-xs text-[#5C5C5C]">
                    <div className="p-3 bg-[#FAFAF7] rounded border border-[rgba(26,26,26,0.06)]">
                      <span className="font-semibold text-[#1A1A1A] block">Companies Act, 2013</span>
                      <span className="text-[0.6875rem] text-[#8A8A8A]">Section 42 (Private Placement) & Section 71 (Debentures)</span>
                    </div>
                    <div className="p-3 bg-[#FAFAF7] rounded border border-[rgba(26,26,26,0.06)]">
                      <span className="font-semibold text-[#1A1A1A] block">ROC Form CHG-9</span>
                      <span className="text-[0.6875rem] text-[#8A8A8A]">Creation of Charge on Immovable Assets</span>
                    </div>
                    <div className="p-3 bg-[#FAFAF7] rounded border border-[rgba(26,26,26,0.06)]">
                      <span className="font-semibold text-[#1A1A1A] block">Form PAS-4</span>
                      <span className="text-[0.6875rem] text-[#8A8A8A]">Statutory Private Placement Offer Letter</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#F4F3EF] rounded-lg border border-[rgba(26,26,26,0.08)] space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Legal Desk
                  </p>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Formal statutory inquiries may be directed to our corporate secretarial desk:
                  </p>
                  <a
                    href="mailto:info@niventracapitaladvisory.com"
                    className="text-xs font-semibold text-[#9A7B2C] hover:underline block break-all pt-1"
                  >
                    info@niventracapitaladvisory.com
                  </a>
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
