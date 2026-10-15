import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Terms & Conditions | Niventra Capital Advisory India",
  description:
    "Terms and conditions governing the use of the Niventra Capital Advisory website, advisory limitations, intellectual property, and legal disclaimers.",
  alternates: {
    canonical: "/terms-conditions/",
  },
};

export default function TermsConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/terms-conditions/" />

      <main id="main-content" className="flex-1">
        <PageHero
          breadcrumbItems={[{ label: "Terms & Conditions" }]}
          eyebrow="Legal Agreement"
          title="Terms &amp; Conditions"
          highlightedText="of Website Use."
          description={
            <p>
              Please read these terms and conditions carefully. By accessing or using the
              Niventra Capital Advisory website, you agree to be bound by these provisions,
              governing platform usage, advisory limitations, and legal liabilities.
            </p>
          }
        />

        {/* ==================================================================
            TERMS CONTENT & ASSET
            ================================================================== */}
        <section className="section-spacing bg-[#FAFAF7]" aria-label="Terms of Service Clauses">
          <div className="container-editorial">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Main Clauses */}
              <div className="lg:col-span-8 space-y-8">

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    1. Preamble &amp; Acceptance of Terms
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    This website (`https://niventracapitaladvisory.com`) is owned and operated
                    by Niventra Capital Advisory India Pvt. Ltd. (&ldquo;Niventra&rdquo;, &ldquo;we&rdquo;,
                    &ldquo;our&rdquo;, or &ldquo;us&rdquo;). Access to and use of this website, including all
                    informational content, advisory resources, forms, and tools, is subject to these
                    Terms &amp; Conditions. By accessing or browsing any page, you acknowledge that you
                    have read, understood, and agree to be bound by these terms.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    2. Use of Information &amp; No Investment Solicitation
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    The information provided on this website is for general informational and educational
                    purposes only. Nothing on this website constitutes an offer to sell, a solicitation
                    of an offer to buy, or a recommendation to purchase any security, debenture, or
                    financial instrument. Any prospective debt debenture issuance is conducted strictly
                    under Section 42 of the Companies Act, 2013 on a private placement basis to verified
                    eligible capital providers via formal Information Memoranda (Form PAS-4).
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    3. Service Limitations &amp; No Guarantee of Returns
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    Niventra acts as a capital advisory and structuring intermediary. We do not provide
                    guaranteed financial returns or capital assurance without verified underlying security.
                    Any reference to indicative target yields (e.g. 12%–16% p.a.) represents preliminary
                    business parameters subject to final product approval and specific contractual indenture terms.
                    Past performance does not guarantee future results.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    4. Intellectual Property Rights
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    All brand logos, emblems, typography, original text, analysis frameworks, design systems,
                    and graphics on this website are the proprietary intellectual property of Niventra
                    Capital Advisory India Pvt. Ltd. No content may be reproduced, distributed, modified,
                    or republished without our express prior written authorization.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    5. Limitation of Liability
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    To the maximum extent permitted by applicable Indian law, Niventra, its directors,
                    officers, and employees shall not be liable for any direct, indirect, incidental,
                    consequential, or punitive damages arising from the use of, or inability to use, this
                    website, including reliance on any informational material or inadvertent technical errors.
                  </p>
                </div>

                <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-8 shadow-sm space-y-4">
                  <h2 className="font-heading text-xl font-[600] text-[#1A1A1A]">
                    6. Governing Law &amp; Jurisdiction
                  </h2>
                  <p className="text-[0.9375rem] text-[#5C5C5C] leading-[1.8]">
                    These Terms &amp; Conditions are governed by and construed in accordance with the laws
                    of the Republic of India. Any legal dispute, controversy, or claim arising out of or
                    in connection with this website shall be subject to the exclusive jurisdiction of the
                    competent courts situated in Gwalior, Madhya Pradesh or New Delhi, India.
                  </p>
                </div>

              </div>

              {/* Side Column: Brand Asset & Key Points */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-4 rounded-xl border border-[rgba(26,26,26,0.1)] shadow-sm">
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-3">
                    <Image
                      src="/assets/images/terms_agreement.png"
                      alt="Legal terms agreement and corporate governance contract"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                    />
                  </div>
                  <p className="text-[0.6875rem] text-[#8A8A8A] text-center italic">
                    Formal legal covenants governing institutional transparency and fiduciary conduct.
                  </p>
                </div>

                <div className="p-6 bg-[#F4F3EF] rounded-lg border border-[rgba(26,26,26,0.08)] space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Related Policies
                  </p>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link href="/privacy-policy/" className="text-[#1A1A1A] hover:text-[#9A7B2C] flex items-center justify-between">
                        <span>Privacy Policy</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <li>
                      <Link href="/risk-disclosure/" className="text-[#1A1A1A] hover:text-[#9A7B2C] flex items-center justify-between">
                        <span>Risk Disclosure</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                    <li>
                      <Link href="/grievance/" className="text-[#1A1A1A] hover:text-[#9A7B2C] flex items-center justify-between">
                        <span>Grievance Redressal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                  </ul>
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
