import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Support & FAQ | Niventra Capital Advisory India",
  description:
    "Frequently asked questions and support directory for Niventra Capital Advisory India. Overview of structured debt, real estate project evaluation, and investor protection.",
  alternates: {
    canonical: "/support-faq/",
  },
};

const FAQ_ITEMS: AccordionItem[] = [
  // General Queries
  {
    id: "general-1",
    category: "General Queries",
    title: "What is Niventra Capital Advisory India?",
    content:
      "Niventra Capital Advisory India Pvt. Ltd. is an institutional advisory firm specializing in structured capital solutions, real estate project evaluation, and private debt facilitation. We connect qualified capital providers (HNIs, Family Offices, Corporate Treasuries) with rigorously vetted real estate developments across India.",
  },
  {
    id: "general-2",
    category: "General Queries",
    title: "Where is Niventra domiciled and located?",
    content:
      "Niventra is an Indian corporate entity with corporate offices at Patel Nagar City Centre, Gwalior, Madhya Pradesh — 474001, and representative advisory presence in New Delhi. Direct meetings with our advisory team are available by prior appointment.",
  },
  {
    id: "general-3",
    category: "General Queries",
    title: "Is Niventra a retail bank or deposit-taking institution?",
    content:
      "No. Niventra does not accept retail public deposits, does not operate savings accounts, and is not a commercial bank. Capital solutions facilitated by Niventra involve private placement debentures issued under Section 42 of the Companies Act, 2013 strictly to accredited capital providers.",
  },

  // Debt & Debentures
  {
    id: "debt-1",
    category: "Debt & Debentures",
    title: "What are Non-Convertible Debentures (NCDs)?",
    content:
      "Non-Convertible Debentures (NCDs) are fixed-income debt securities issued under the Companies Act, 2013. They offer defined coupon interest payments on scheduled intervals and full principal repayment upon maturity. Unlike convertible debentures, NCDs cannot be converted into equity shares, providing pure debt exposure without dilution.",
  },
  {
    id: "debt-2",
    category: "Debt & Debentures",
    title: "What does the 12%–16% p.a. yield guidance represent?",
    content:
      "The 12%–16% per annum range is internal indicative yield guidance for the structured debenture products facilitated through our advisory framework. It is not a guaranteed, assured, or risk-free return. Final coupon terms, payment frequencies, tenures, and security coverage ratios are determined by the definitive Information Memorandum (PAS-4) and term sheet for each issue.",
  },
  {
    id: "debt-3",
    category: "Debt & Debentures",
    title: "How is debenture capital secured?",
    content:
      "Secured debentures facilitated through Niventra are backed by collateral charges created on identified real estate assets or project receivables. These charges are formally filed and certified by the Registrar of Companies (ROC Form CHG-9) in favor of an independent Debenture Trustee.",
  },

  // Real Estate Advisory
  {
    id: "re-1",
    category: "Real Estate Advisory",
    title: "How do real estate developers submit projects for funding?",
    content:
      "Developers can initiate an evaluation through our online project submission portal or by contacting our real estate advisory team. Submission requires preliminary land ownership documentation, sanctioned architectural approvals, active RERA registration certificates, and company financial profiles.",
  },
  {
    id: "re-2",
    category: "Real Estate Advisory",
    title: "What is Niventra's 5-point due diligence framework?",
    content:
      "Every project evaluated by Niventra undergoes five independent audits: Legal (30-year title search & litigation check), Financial (cash-flow sensitivity & cost audit), Technical (physical site inspection & structural engineering review), Market (micro-market absorption & competitive pricing), and Security Structuring (ROC Form CHG-9 collateral charge).",
  },

  // Privacy & Governance
  {
    id: "gov-1",
    category: "Privacy & Governance",
    title: "How is my personal data handled under the DPDP Act, 2023?",
    content:
      "We process personal data strictly in compliance with the Digital Personal Data Protection (DPDP) Act, 2023. Information submitted is encrypted using 256-bit encryption, used exclusively for the advisory purpose consented to, and never sold to third parties. Stakeholders have the statutory right to request complete data erasure.",
  },
  {
    id: "gov-2",
    category: "Privacy & Governance",
    title: "What is the procedure for lodging an investor grievance?",
    content:
      "Grievances can be emailed directly to our designated Grievance Redressal Officer at grievance@niventracapitaladvisory.com. Our policy guarantees formal acknowledgment within 48 business hours and a comprehensive written resolution determination within 30 days.",
  },
];

export default function SupportFaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/support-faq/" />

      <main id="main-content" className="flex-1">
        <PageHero
          breadcrumbItems={[{ label: "Support & FAQ" }]}
          eyebrow="Help Centre &amp; Inquiries"
          title="Frequently Asked"
          highlightedText="Questions &amp; Support."
          description={
            <p>
              Answers to common inquiries regarding structured debt instruments, real estate
              project underwriting, regulatory disclosures, and investor support services.
            </p>
          }
          sideContent={
            <div className="p-5 bg-white rounded-lg border border-[rgba(26,26,26,0.08)] space-y-2">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#8A8A8A]">
                Direct Assistance
              </p>
              <p className="font-heading text-lg font-[600] text-[#1A1A1A]">
                Toll-Free: 1800 890 0818
              </p>
              <p className="text-xs text-[#8A8A8A]">
                Advisory desk active Monday through Friday, 9:30 AM to 6:30 PM IST.
              </p>
            </div>
          }
        />

        {/* ==================================================================
            FAQ ACCORDIONS
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-label="Support Questions">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* FAQ Accordion List */}
              <div className="lg:col-span-8">
                <Accordion items={FAQ_ITEMS} allowMultiple={false} />
              </div>

              {/* Quick Contact Box */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-4">
                  <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                    Still Have Questions?
                  </h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Our structuring desk offers confidential consultations to accredited
                    capital providers and real estate developers with no obligation.
                  </p>

                  <div className="pt-2 space-y-3">
                    <Button variant="primary" size="md" href="/contact/" className="w-full justify-center">
                      Submit Consultation Request
                    </Button>
                    <a
                      href="tel:18008900818"
                      className="flex items-center justify-center gap-2 py-2.5 px-4 rounded border border-[rgba(26,26,26,0.15)] text-xs font-semibold text-[#1A1A1A] hover:bg-[#F4F3EF] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#9A7B2C]" />
                      Call Toll-Free: 1800 890 0818
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-[#F4F3EF] rounded-lg border border-[rgba(26,26,26,0.08)] space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Grievance Desk
                  </p>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    Have an unresolved operational query or formal concern?
                  </p>
                  <Link
                    href="/grievance/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:underline pt-1"
                  >
                    View Grievance Redressal Procedure <ArrowRight className="w-3 h-3" />
                  </Link>
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
