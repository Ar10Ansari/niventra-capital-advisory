import React from "react";
import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageSquare, Building } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { BranchDirectory } from "@/components/branches/BranchDirectory";

export const metadata: Metadata = {
  title: "Contact Us | Niventra Capital Advisory India",
  description:
    "Get in touch with Niventra Capital Advisory India. Office address in Patel Nagar Gwalior, toll-free phone 1800 890 0818, WhatsApp desk, and confidential project submission form.",
  alternates: {
    canonical: "/contact/",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/contact/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Clean Editorial Header
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Contact Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Direct Advisory Communication
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.4rem,4.5vw,4rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A] mb-4">
                Get in{" "}
                <em className="not-italic text-[#9A7B2C]">
                  touch.
                </em>
              </h1>

              <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                Connect with our advisory desk regarding structured debt opportunities, real estate evaluation, or governance matters. All inquiries are handled under strict corporate confidentiality.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            CONTACT CHANNELS & INTERACTIVE FORM GRID
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-white border-b border-[rgba(26,26,26,0.08)]" aria-label="Contact Channels & Form">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

              {/* Left Column: Consolidated Contact Channels */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-eyebrow mb-2 block">Corporate Directory</span>
                  <h2 className="font-heading text-2xl font-[600] text-[#1A1A1A] mb-3">
                    Contact Channels
                  </h2>
                </div>

                {/* Consolidated contact card */}
                <div className="rounded-xl border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] shadow-2xs divide-y divide-[rgba(26,26,26,0.06)] overflow-hidden">
                  {/* Phone */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#9A7B2C]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A] mb-0.5">
                        Toll-Free
                      </p>
                      <a
                        href="tel:18008900818"
                        className="font-heading text-base font-semibold text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded"
                      >
                        1800 890 0818
                      </a>
                      <p className="text-[0.6875rem] text-[#8A8A8A] mt-0.5">
                        Mon–Fri 9:30 AM – 6:30 PM IST
                      </p>
                    </div>
                  </div>

                  {/* Landline */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-[#9A7B2C]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A] mb-0.5">
                        Delhi Advisory Desk
                      </p>
                      <a
                        href="tel:+9101140515660"
                        className="font-heading text-base font-semibold text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded"
                      >
                        +91 011 4051 5660
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-[#9A7B2C]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A] mb-0.5">
                        WhatsApp
                      </p>
                      <a
                        href="https://wa.me/917428280200"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-heading text-base font-semibold text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded"
                      >
                        +91 74282 80200
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#9A7B2C]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A] mb-0.5">
                        Corporate Email
                      </p>
                      <a
                        href="mailto:info@niventracapitaladvisory.com"
                        className="font-heading text-sm font-semibold text-[#1A1A1A] hover:text-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded break-all"
                      >
                        info@niventracapitaladvisory.com
                      </a>
                    </div>
                  </div>

                  {/* Office Address */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[rgba(154,123,44,0.1)] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#9A7B2C]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A] mb-0.5">
                        Corporate Head Office
                      </p>
                      <address className="not-italic text-xs sm:text-sm text-[#2D2D2D] leading-relaxed font-body">
                        Patel Nagar City Centre<br />
                        Gwalior, Madhya Pradesh — 474001, India
                      </address>
                      <p className="text-[0.6875rem] text-[#8A8A8A] mt-1">
                        Meetings by prior appointment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Confidential Consultation Form */}
              <div className="lg:col-span-7">
                <ConsultationForm />
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================================
            BRANCH DIRECTORY & REGIONAL NETWORK
            ================================================================== */}
        <section className="py-16 lg:py-20 bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)]" aria-label="Branch Locations & Network">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <BranchDirectory />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
