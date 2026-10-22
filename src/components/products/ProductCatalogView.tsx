"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Filter } from "lucide-react";

interface RawDbProduct {
  id: string;
  slug: string;
  title: string;
  category: string;
  indicative_yield: string;
  tenor: string;
  min_investment: string;
  security_type: string;
  summary: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  category: "DEBENTURE" | "REAL_ESTATE_DEBT" | string;
  indicativeYield: string;
  tenor: string;
  minInvestment: string;
  securityType: string;
  summary: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isIllustrative?: boolean;
}

// Built-in illustrative models adhering strictly to company-approved 12%–16% p.a. guidance
const ILLUSTRATIVE_PRODUCTS: ProductItem[] = [
  {
    id: "prod_ncd_tranche_a",
    slug: "secured-ncd-tranche-a",
    title: "[ILLUSTRATIVE MODEL] Secured Real Estate Debenture Tranche A",
    category: "DEBENTURE",
    indicativeYield: "14.5% p.a.*",
    tenor: "36 Months",
    minInvestment: "₹10,00,000",
    securityType: "First Pari-Passu Charge on Commercial Assets (ROC Form CHG-9)",
    summary: "Commercial lease receivables-backed model with ROC Form CHG-9 first pari-passu charge.",
    isIllustrative: true,
  },
  {
    id: "prod_redevelopment_series_1",
    slug: "redevelopment-debt-series-1",
    title: "[ILLUSTRATIVE MODEL] Urban Redevelopment Debt Series 1",
    category: "REAL_ESTATE_DEBT",
    indicativeYield: "15.0% p.a.*",
    tenor: "24 Months",
    minInvestment: "₹25,00,000",
    securityType: "Escrow Cash-Flow Waterfall + Subordinated Mortgage Charge",
    summary: "Milestone-disbursed urban renewal tranche with dual-signatory escrow waterfall covenants.",
    isIllustrative: true,
  },
  {
    id: "prod_commercial_credit_ii",
    slug: "commercial-credit-facility-ii",
    title: "[ILLUSTRATIVE MODEL] Prime Commercial Credit Facility II",
    category: "DEBENTURE",
    indicativeYield: "13.5% p.a.*",
    tenor: "48 Months",
    minInvestment: "₹50,00,000",
    securityType: "Exclusive Hypothecation of Receivables & ROC Charge Creation",
    summary: "Receivables-hypothecated facility with quarterly coupon distributions and structured amortization.",
    isIllustrative: true,
  },
];

export const ProductCatalogView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [products, setProducts] = useState<ProductItem[]>(ILLUSTRATIVE_PRODUCTS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPublishedProducts, setHasPublishedProducts] = useState<boolean>(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            // Map published products
            const mapped: ProductItem[] = data.products.map((p: RawDbProduct) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              category: p.category,
              indicativeYield: p.indicative_yield,
              tenor: p.tenor,
              minInvestment: p.min_investment,
              securityType: p.security_type,
              summary: p.summary,
              status: p.status,
              isIllustrative: false,
            }));
            setProducts(mapped);
            setHasPublishedProducts(true);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not fetch live products, displaying illustrative catalog fixtures:", err);
      }
      // Fallback: Display illustrative models
      setProducts(ILLUSTRATIVE_PRODUCTS);
      setHasPublishedProducts(false);
      setIsLoading(false);
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === "ALL") return true;
    if (selectedCategory === "DEBENTURE") return p.category === "DEBENTURE";
    if (selectedCategory === "REAL_ESTATE_DEBT") return p.category === "REAL_ESTATE_DEBT";
    return true;
  });

  return (
    <div className="space-y-10">
      {/* ====================================================================
          STATUTORY SECTION 42 PRIVATE PLACEMENT CALLOUT
          ==================================================================== */}
      <div className="rounded-xl border border-[rgba(154,123,44,0.25)] bg-[rgba(154,123,44,0.04)] p-5 sm:p-6 text-xs text-[#5C5C5C] space-y-2">
        <div className="flex items-center gap-2 text-[#9A7B2C] font-semibold text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Statutory Framework: Private Placement Under Section 42 of Companies Act, 2013</span>
        </div>
        <p className="leading-relaxed">
          Debenture offerings are addressed solely to verified, eligible investors on a private placement basis under Section 42 of the Companies Act, 2013. This website does not solicit public investments.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[0.6875rem] font-medium text-[#1A1A1A]">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
            Approved Indicative Guidance: 12%–16% p.a.*
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
            Non-Guaranteed Principal &amp; Yield
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B2C]" />
            Zero Public Solicitation
          </span>
        </div>
      </div>

      {/* ====================================================================
          CATEGORY FILTER TABS & STATUS INDICATOR
          ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(26,26,26,0.08)] pb-5">
        <div className="flex items-center gap-1.5 p-1 bg-[#F2F2EC] rounded-lg w-fit" role="tablist" aria-label="Product categories">
          {[
            { label: "All Structures", value: "ALL" },
            { label: "Senior Secured NCDs", value: "DEBENTURE" },
            { label: "Structured Project Debt", value: "REAL_ESTATE_DEBT" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={selectedCategory === tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-3.5 py-1.5 text-xs rounded-md transition-all font-medium ${
                selectedCategory === tab.value
                  ? "bg-white text-[#1A1A1A] shadow-2xs font-semibold"
                  : "text-[#5C5C5C] hover:text-[#1A1A1A]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Catalog Mode Pill */}
        <div className="flex items-center gap-2 text-xs">
          {!hasPublishedProducts && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Catalog Mode: Illustrative Architectural Fixtures
            </span>
          )}
          <span className="text-[#7A7A7A] font-mono">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "structure" : "structures"}
          </span>
        </div>
      </div>

      {/* ====================================================================
          PRODUCT CARDS GRID
          ==================================================================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-[rgba(26,26,26,0.08)] bg-white p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-16 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[rgba(26,26,26,0.15)] p-12 text-center space-y-3 bg-[#FAFAF7]">
          <Filter className="w-8 h-8 text-[#9A7B2C] mx-auto" aria-hidden="true" />
          <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">No Structures in Selected Category</h3>
          <p className="text-xs text-[#5C5C5C] max-w-md mx-auto">
            Please choose another category filter above or contact our advisory desk for bespoke placement structures.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className="text-xs text-[#9A7B2C] font-semibold underline mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col justify-between rounded-xl border border-[rgba(26,26,26,0.08)] bg-white hover:border-[#9A7B2C]/40 transition-all duration-200 shadow-2xs hover:shadow-xs overflow-hidden"
            >
              {/* Card Header & Status */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] px-2.5 py-0.5 rounded">
                    {product.category === "DEBENTURE" ? "Secured NCD" : "Structured Debt"}
                  </span>
                  {product.isIllustrative && (
                    <span className="text-[0.625rem] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Illustrative Model
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading text-xl font-[600] text-[#1A1A1A] group-hover:text-[#9A7B2C] transition-colors leading-snug">
                    <Link href={`/products/${product.slug}/`} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded">
                      {product.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed mt-2 line-clamp-3 font-body">
                    {product.summary}
                  </p>
                </div>

                {/* Key Metrics Matrix */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[rgba(26,26,26,0.06)]">
                  <div className="p-3 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.04)]">
                    <span className="text-[0.625rem] uppercase tracking-wider text-[#7A7A7A] block mb-0.5">
                      Indicative Yield
                    </span>
                    <span className="font-heading text-base font-bold text-[#9A7B2C]">
                      {product.indicativeYield}
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.04)]">
                    <span className="text-[0.625rem] uppercase tracking-wider text-[#7A7A7A] block mb-0.5">
                      Tenor
                    </span>
                    <span className="font-heading text-base font-semibold text-[#1A1A1A]">
                      {product.tenor}
                    </span>
                  </div>

                  <div className="col-span-2 p-3 bg-[#FAFAF7] rounded-lg border border-[rgba(26,26,26,0.04)]">
                    <span className="text-[0.625rem] uppercase tracking-wider text-[#7A7A7A] block mb-0.5">
                      Security &amp; ROC Charge Creation
                    </span>
                    <span className="text-xs font-medium text-[#1A1A1A] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B2C] shrink-0" aria-hidden="true" />
                      {product.securityType}
                    </span>
                  </div>
                </div>

                <div className="text-[0.6875rem] text-[#7A7A7A] flex items-center justify-between pt-1">
                  <span>Minimum Allocation:</span>
                  <span className="font-semibold text-[#1A1A1A] font-mono">{product.minInvestment}</span>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-6 bg-[#FAFAF7] border-t border-[rgba(26,26,26,0.06)] flex items-center justify-between">
                <span className="text-[0.6875rem] text-[#7A7A7A]">
                  Non-Transactable Model
                </span>
                <Link
                  href={`/products/${product.slug}/`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] group-hover:text-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded py-1 px-2"
                >
                  <span>View Structure &amp; Terms</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ====================================================================
          ADVISORY ENGAGEMENT CALLOUT
          ==================================================================== */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#0E1C2E] text-white space-y-4">
        <div className="max-w-3xl space-y-2">
          <span className="text-[0.6875rem] uppercase tracking-widest text-[#C9A84C] font-semibold block">
            Institutional Capital Allocation
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-[500] text-white">
            Looking for Custom Debenture Tranches?
          </h3>
          <p className="text-xs sm:text-sm text-[rgba(255,255,255,0.7)] leading-relaxed">
            Our structuring desk creates bespoke private debenture structures with tailored escrow waterfalls, security trusteeship, and ROC Form CHG-9 filings.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] hover:bg-[#b08e36] text-[#0E1C2E] text-xs font-semibold uppercase tracking-wider transition-colors shadow-2xs"
          >
            <span>Connect with Structuring Desk</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <Link
            href="/due-diligence/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(255,255,255,0.2)] hover:bg-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <span>Review 5-Point Due Diligence Framework</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
