import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCatalogView } from "@/components/products/ProductCatalogView";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Debenture Catalog & Structured Debt Opportunities | Niventra Capital Advisory India",
  description:
    "Explore illustrative senior secured debentures and structured real estate debt models. Private placement under Section 42 of the Companies Act, 2013.",
  alternates: {
    canonical: "/products/",
  },
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/products/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Institutional Catalog Header & Breadcrumb
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Product Catalog Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1.5 text-xs text-[#5C5C5C]">
                <li>
                  <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight className="w-3.5 h-3.5 text-[#A0A0A0]" aria-hidden="true" />
                </li>
                <li className="font-semibold text-[#1A1A1A]" aria-current="page">
                  Offerings Catalog
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] w-fit mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                  Private Debt &amp; Debenture Structures
                </span>
              </div>

              <h1 className="font-heading text-[clamp(2.2rem,4vw,3.6rem)] font-[500] leading-[1.1] tracking-[-0.025em] text-[#1A1A1A] mb-4">
                Structured Debentures &amp;{" "}
                <em className="not-italic text-[#9A7B2C]">
                  Capital Placement.
                </em>
              </h1>

              <p className="font-body text-base sm:text-lg text-[#5C5C5C] leading-relaxed max-w-2xl">
                Explore evaluated fixed-income opportunities structured for institutional co-investors, family offices, and accredited capital providers. Governed by formal debenture trust deeds and ROC charge creation.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            MAIN CONTENT: Catalog Grid & Filters
            ================================================================== */}
        <section className="py-12 lg:py-16 bg-white" aria-label="Offerings Catalog Grid">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <ProductCatalogView />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
