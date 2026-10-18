import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IndicativeReturnCalculator } from "@/components/calculator/IndicativeReturnCalculator";
import {
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileText,
  Building2,
  Scale,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ProductDetailData {
  slug: string;
  title: string;
  category: string;
  indicativeYield: string;
  numericYield: number;
  tenor: string;
  numericTenor: number;
  minInvestment: string;
  numericPrincipal: number;
  securityType: string;
  assetCoverRatio: string;
  escrowMechanism: string;
  payoutFrequency: "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "ANNUAL" | "CUMULATIVE";
  payoutFrequencyLabel: string;
  principalRepayment: string;
  governingLaw: string;
  summary: string;
  description: string;
  underwritingHighlights: string[];
  riskAnalysis: {
    creditRisk: string;
    constructionRisk: string;
    liquidityRisk: string;
    taxRisk: string;
  };
  sampleDocuments: {
    title: string;
    type: string;
    status: string;
  }[];
}

const PRODUCTS_DATABASE: Record<string, ProductDetailData> = {
  "secured-ncd-tranche-a": {
    slug: "secured-ncd-tranche-a",
    title: "[ILLUSTRATIVE MODEL] Secured Real Estate Debenture Tranche A",
    category: "Senior Secured Non-Convertible Debenture (NCD)",
    indicativeYield: "14.5% p.a.*",
    numericYield: 14.5,
    tenor: "36 Months",
    numericTenor: 36,
    minInvestment: "₹10,00,000",
    numericPrincipal: 1000000,
    securityType: "First Pari-Passu Charge on Commercial Real Estate Assets (ROC Form CHG-9)",
    assetCoverRatio: "1.50x Asset Coverage",
    escrowMechanism: "Designated Escrow Account with Waterfall Priority",
    payoutFrequency: "QUARTERLY",
    payoutFrequencyLabel: "Quarterly Distribution (4/year)",
    principalRepayment: "Contractual Bullet Repayment at Month 36",
    governingLaw: "Companies Act, 2013 (Section 42 & Section 71)",
    summary:
      "Illustrative debenture structure for institutional evaluation and cash-flow modeling. Structured against contracted lease receivables and underlying commercial collateral with independent Debenture Trustee oversight.",
    description:
      "Tranche A debentures represent an illustrative institutional fixed-income structure designed to demonstrate security covenant creation under Indian statutory provisions. All terms shown are illustrative models for development and platform testing. Genuine debenture offerings require approved Form PAS-4 documentation, Registrar of Companies filings, and Board authorization before capital commitment.",
    underwritingHighlights: [
      "First ranking mortgage registered with Registrar of Companies via Form CHG-9 within 30 days of allotment",
      "Asset cover ratio maintained at minimum 1.50x of outstanding principal throughout tenor",
      "Receivables routed through SEBI-regulated scheduled commercial bank escrow account",
      "Independent SEBI-registered Debenture Trustee holding charge on behalf of debenture holders",
    ],
    riskAnalysis: {
      creditRisk:
        "Obligor credit risk arises from potential adverse operational conditions impacting the underlying borrower's ability to service quarterly coupon obligations. Mitigated by asset cover and hypothecated cash flows.",
      constructionRisk:
        "Minimal project completion risk as collateral is based on completed or near-completion Grade-A commercial asset inventory with existing occupancy certifications.",
      liquidityRisk:
        "Non-convertible debentures are fixed-term illiquid debt instruments. No secondary exchange liquidity is promised or implied; capital is committed until contractual 36-month maturity.",
      taxRisk:
        "Subject to mandatory Tax Deducted at Source (TDS) under Section 193 of the Income Tax Act, 1961 (standard 10% for resident individuals presenting PAN, or Form 15G/15H exemptions).",
    },
    sampleDocuments: [
      {
        title: "Private Placement Offer Letter (Form PAS-4) — Sample Architecture",
        type: "Statutory Offer Document",
        status: "Available Upon Verification",
      },
      {
        title: "Debenture Trust Deed & Security Covenants — Draft Model",
        type: "Trustee Agreement",
        status: "Available Upon Verification",
      },
      {
        title: "Independent Title & Valuation Report — Reference Template",
        type: "Technical Diligence",
        status: "Available Upon Verification",
      },
    ],
  },
  "redevelopment-debt-series-1": {
    slug: "redevelopment-debt-series-1",
    title: "[ILLUSTRATIVE MODEL] Urban Redevelopment Debt Series 1",
    category: "Structured Project Debt Tranche",
    indicativeYield: "15.0% p.a.*",
    numericYield: 15.0,
    tenor: "24 Months",
    numericTenor: 24,
    minInvestment: "₹25,00,000",
    numericPrincipal: 2500000,
    securityType: "Escrow Cash-Flow Waterfall + Subordinated Mortgage Charge",
    assetCoverRatio: "1.65x Realizable Value",
    escrowMechanism: "Milestone-Linked Construction Account with Chartered Engineer Sign-Off",
    payoutFrequency: "MONTHLY",
    payoutFrequencyLabel: "Monthly Distribution (12/year)",
    principalRepayment: "Amortized Principal Returns Over Months 18 to 24",
    governingLaw: "Companies Act, 2013 & Indian Contract Act, 1872",
    summary:
      "Targeted project debt tranche supporting structured urban renewal evaluation with project escrow covenants and milestone-based disbursement tranches.",
    description:
      "Series 1 Redevelopment Debt models a structured project financing tranche supporting evaluated brownfield rehabilitation projects. Features strict milestone-based capital deployment and dual-signatory escrow accounts. This record is an illustrative architectural fixture; no genuine financial transactions can be executed against this model.",
    underwritingHighlights: [
      "Capital deployed strictly in tranches upon independent Chartered Engineer certification of project milestones",
      "Sales receivables locked into project escrow account with predetermined waterfall priority",
      "Personal and corporate promoter guarantees backing debt service obligations",
      "Comprehensive RERA compliance and title verification across historical registry records",
    ],
    riskAnalysis: {
      creditRisk:
        "Developer credit standing and working capital adequacy. Evaluated through financial cash-flow underwriting and promoter track record analysis.",
      constructionRisk:
        "Risk of civil execution or municipal approval delays. Mitigated by tranche-based disbursements and retention accounts.",
      liquidityRisk:
        "Private placement debt cannot be transferred without regulatory notification and Issuer approval. No active secondary market exists.",
      taxRisk:
        "Coupon income treated as interest income taxable at applicable investor slab rates, subject to statutory Section 194A TDS withholding.",
    },
    sampleDocuments: [
      {
        title: "Urban Redevelopment Information Memorandum — Sample Format",
        type: "Project Memorandum",
        status: "Available Upon Verification",
      },
      {
        title: "Escrow Agreement & Cash-Flow Waterfall Covenants",
        type: "Escrow Contract",
        status: "Available Upon Verification",
      },
      {
        title: "RERA Registration & Municipal Approval Dossier (Sample)",
        type: "Regulatory Diligence",
        status: "Available Upon Verification",
      },
    ],
  },
  "commercial-credit-facility-ii": {
    slug: "commercial-credit-facility-ii",
    title: "[ILLUSTRATIVE MODEL] Prime Commercial Credit Facility II",
    category: "Senior Secured Corporate Debenture",
    indicativeYield: "13.5% p.a.*",
    numericYield: 13.5,
    tenor: "48 Months",
    numericTenor: 48,
    minInvestment: "₹50,00,000",
    numericPrincipal: 5000000,
    securityType: "Exclusive Hypothecation of Receivables & ROC Charge Creation",
    assetCoverRatio: "1.75x Debt Service Coverage",
    escrowMechanism: "Direct Lease Inflow Collection Account with Auto-Sweep",
    payoutFrequency: "QUARTERLY",
    payoutFrequencyLabel: "Quarterly Distribution (4/year)",
    principalRepayment: "Bullet Repayment at Month 48 with Amortization Option",
    governingLaw: "Companies Act, 2013 (Section 42 & Section 71)",
    summary:
      "Commercial grade cash-flow secured debenture model with quarterly coupon distribution and structured principal amortization waterfall.",
    description:
      "Facility II models senior secured credit extended against operational commercial office assets with long-term corporate tenant leases. Focuses on debt service coverage ratio (DSCR) preservation and bankruptcy-remote escrow ringfencing. Model presented solely for institutional architectural evaluation.",
    underwritingHighlights: [
      "100% of underlying lease rentals escrowed directly with Debenture Trustee's designated bank",
      "Minimum Debt Service Coverage Ratio (DSCR) covenant of 1.40x throughout facility lifecycle",
      "Subordinated sponsor equity buffer absorbing preliminary market vacancy shocks",
      "Prepayment lock-in protection preserving yield curve predictability",
    ],
    riskAnalysis: {
      creditRisk:
        "Tenant concentration or corporate lease default risk. Mitigated by multi-tenant diversification and security deposits.",
      constructionRisk:
        "Zero greenfield risk; asset is fully operational with occupancy certificate and active lease agreements.",
      liquidityRisk:
        "Locked until contractual maturity (48 months) with limited institutional secondary co-sale options.",
      taxRisk:
        "TDS deducted at source under Section 193. Capital providers receive Form 16A quarterly certificates for tax reconciliation.",
    },
    sampleDocuments: [
      {
        title: "Commercial Credit Information Memorandum — Model Tranche",
        type: "Credit Memorandum",
        status: "Available Upon Verification",
      },
      {
        title: "Lease Assignment & Hypothecation Deed (Reference Copy)",
        type: "Security Document",
        status: "Available Upon Verification",
      },
      {
        title: "ROC Form CHG-9 Charge Creation Filing Protocol",
        type: "ROC Documentation",
        status: "Available Upon Verification",
      },
    ],
  },
};

export async function generateStaticParams() {
  return [
    { slug: "secured-ncd-tranche-a" },
    { slug: "redevelopment-debt-series-1" },
    { slug: "commercial-credit-facility-ii" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS_DATABASE[slug];

  if (!product) {
    return {
      title: "Structure Not Found | Niventra Capital Advisory",
      alternates: { canonical: `/products/${slug}/` },
    };
  }

  return {
    title: `${product.title} | Niventra Capital Advisory`,
    description: product.summary,
    alternates: {
      canonical: `/products/${slug}/`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS_DATABASE[slug];

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF7]">
      <Header activePath="/products/" />

      <main id="main-content" className="flex-1">
        {/* ==================================================================
            HERO: Detail Header & Breadcrumb
            ================================================================== */}
        <section className="relative bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] overflow-hidden" aria-label="Product Overview">
          <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
            {/* Breadcrumb Navigation */}
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
                <li>
                  <Link href="/products/" className="hover:text-[#1A1A1A] transition-colors">
                    Offerings Catalog
                  </Link>
                </li>
                <li>
                  <ChevronRight className="w-3.5 h-3.5 text-[#A0A0A0]" aria-hidden="true" />
                </li>
                <li className="font-semibold text-[#1A1A1A] truncate max-w-xs sm:max-w-md" aria-current="page">
                  {product.title}
                </li>
              </ol>
            </nav>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] px-2.5 py-0.5 rounded">
                {product.category}
              </span>
              <span className="text-[0.625rem] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Illustrative Model — Non-Transactable
              </span>
              <span className="text-[0.625rem] font-medium text-[#7A7A7A] bg-white border border-[rgba(26,26,26,0.1)] px-2 py-0.5 rounded">
                Section 42 Private Placement
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="font-heading text-[clamp(2rem,3.8vw,3.2rem)] font-[500] leading-[1.15] tracking-[-0.025em] text-[#1A1A1A] mb-4">
                {product.title}
              </h1>

              <p className="font-body text-base text-[#5C5C5C] leading-relaxed max-w-3xl">
                {product.description}
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            CORE CONTENT: Grid Layout
            ================================================================== */}
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-14">

          {/* SECTION A: KEY TERMS MATRIX & UNDERWRITING HIGHLIGHTS */}
          <section aria-labelledby="key-terms-heading" className="space-y-6">
            <div>
              <span className="text-eyebrow mb-2 block">Institutional Specifications</span>
              <h2 id="key-terms-heading" className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                Key Commercial &amp; Security Terms
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Key Terms Table */}
              <div className="lg:col-span-7 rounded-xl border border-[rgba(26,26,26,0.08)] bg-white overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <tbody className="divide-y divide-[rgba(26,26,26,0.06)] font-body">
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7] w-1/3">
                        Instrument Classification
                      </th>
                      <td className="py-3.5 px-5 text-[#1A1A1A] font-medium">
                        {product.category}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Indicative Coupon Yield
                      </th>
                      <td className="py-3.5 px-5 font-heading font-bold text-[#9A7B2C] text-base">
                        {product.indicativeYield}
                        <span className="block font-body text-[0.6875rem] font-normal text-[#7A7A7A] mt-0.5">
                          Within company-approved 12%–16% p.a. guidance
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Contractual Tenor
                      </th>
                      <td className="py-3.5 px-5 text-[#1A1A1A] font-medium">
                        {product.tenor}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Security Covenant
                      </th>
                      <td className="py-3.5 px-5 text-[#1A1A1A] font-medium">
                        {product.securityType}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Asset Coverage Ratio
                      </th>
                      <td className="py-3.5 px-5 text-[#1A1A1A] font-mono">
                        {product.assetCoverRatio}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Distribution Frequency
                      </th>
                      <td className="py-3.5 px-5 text-[#1A1A1A]">
                        {product.payoutFrequencyLabel}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Principal Amortization
                      </th>
                      <td className="py-3.5 px-5 text-[#1A1A1A]">
                        {product.principalRepayment}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Minimum Ticket Size
                      </th>
                      <td className="py-3.5 px-5 text-[#1A1A1A] font-semibold font-mono">
                        {product.minInvestment}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3.5 px-5 font-semibold text-[#5C5C5C] bg-[#FAFAF7]">
                        Governing Legal Framework
                      </th>
                      <td className="py-3.5 px-5 text-[#5C5C5C] text-xs">
                        {product.governingLaw}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Underwriting Highlights & Structuring Safeguards */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 sm:p-7 rounded-xl border border-[rgba(26,26,26,0.08)] bg-white shadow-2xs space-y-4">
                  <h3 className="font-heading text-lg font-[600] text-[#1A1A1A] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#9A7B2C]" aria-hidden="true" />
                    <span>Underwriting &amp; Structural Safeguards</span>
                  </h3>
                  <ul className="space-y-3 font-body text-xs text-[#5C5C5C] leading-relaxed">
                    {product.underwritingHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consultation Pathway */}
                <div className="p-6 rounded-xl bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-3">
                  <h4 className="font-heading text-sm font-semibold text-[#1A1A1A]">
                    Interested in Similar Debenture Placements?
                  </h4>
                  <p className="font-body text-xs text-[#5C5C5C] leading-relaxed">
                    Connect with our capital advisory team to review private placement memorandums (Form PAS-4) and discuss tailored institutional participation.
                  </p>
                  <Link
                    href={`/contact/?ref=${product.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2C] hover:text-[#856925] transition-colors pt-1"
                  >
                    <span>Schedule Structuring Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION B: PRE-LOADED INDICATIVE RETURN CALCULATOR */}
          <section aria-labelledby="detail-calculator-heading" className="space-y-6">
            <div>
              <span className="text-eyebrow mb-2 block">Interactive Cash-Flow Engine</span>
              <h2 id="detail-calculator-heading" className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                Model Returns for {product.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-2xl font-body">
                Adjust allocation amounts and payout frequency to project indicative gross simple-interest coupon yields pre-loaded with this instrument&apos;s parameters ({product.indicativeYield}, {product.tenor}).
              </p>
            </div>

            <IndicativeReturnCalculator
              initialPrincipal={product.numericPrincipal}
              initialRate={product.numericYield}
              initialTenor={product.numericTenor}
              initialFrequency={product.payoutFrequency}
              productTitle={product.title}
            />
          </section>

          {/* SECTION C: 4-PILLAR STATUTORY RISK ANALYSIS */}
          <section aria-labelledby="risk-analysis-heading" className="space-y-6">
            <div>
              <span className="text-eyebrow mb-2 block">Statutory Disclosure</span>
              <h2 id="risk-analysis-heading" className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                Comprehensive 4-Pillar Risk Evaluation
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-2xl font-body">
                In strict adherence to regulatory standards, all private debt structures involve inherent financial, operational, and liquidity risks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-[rgba(26,26,26,0.08)] bg-white space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>1. Obligor Credit &amp; Default Risk</span>
                </div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                  {product.riskAnalysis.creditRisk}
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[rgba(26,26,26,0.08)] bg-white space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold text-sm">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>2. Construction &amp; Regulatory Delay Risk</span>
                </div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                  {product.riskAnalysis.constructionRisk}
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[rgba(26,26,26,0.08)] bg-white space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold text-sm">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>3. Liquidity &amp; Secondary Lock-in Risk</span>
                </div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                  {product.riskAnalysis.liquidityRisk}
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[rgba(26,26,26,0.08)] bg-white space-y-2.5 shadow-2xs">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-semibold text-sm">
                  <Scale className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>4. Statutory Taxation &amp; TDS Withholding</span>
                </div>
                <p className="text-xs text-[#5C5C5C] leading-relaxed font-body">
                  {product.riskAnalysis.taxRisk}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION D: DOCUMENT GOVERNANCE REPOSITORY (TRANSACTION GATED) */}
          <section aria-labelledby="document-governance-heading" className="space-y-6">
            <div>
              <span className="text-eyebrow mb-2 block">Institutional Governance</span>
              <h2 id="document-governance-heading" className="font-heading text-2xl font-[600] text-[#1A1A1A]">
                Regulatory Document Repository
              </h2>
              <p className="text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-2xl font-body">
                Official offer documents are confidential private placement records provided exclusively to accredited capital providers following identity verification and suitability evaluation.
              </p>
            </div>

            <div className="rounded-xl border border-[rgba(26,26,26,0.08)] bg-white divide-y divide-[rgba(26,26,26,0.06)] shadow-2xs">
              {product.sampleDocuments.map((doc, idx) => (
                <div key={idx} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[#9A7B2C] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                        {doc.title}
                      </h4>
                      <span className="text-[0.6875rem] text-[#7A7A7A] block mt-0.5">
                        {doc.type} · Statutory Private Placement Classification
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[0.6875rem] font-medium bg-[#FAFAF7] text-[#5C5C5C] border border-[rgba(26,26,26,0.1)]">
                      <Lock className="w-3.5 h-3.5 text-[#8A8A8A]" aria-hidden="true" />
                      Download Gated (KYC Required)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Statutory Gating Notice */}
            <div className="p-4 rounded-lg bg-[rgba(26,26,26,0.02)] border border-[rgba(26,26,26,0.06)] text-xs text-[#7A7A7A] flex items-center justify-between">
              <span>
                Real-money transactions, automatic checkouts, and unauthenticated document downloads are strictly disabled on this platform.
              </span>
              <Link href="/contact/" className="text-xs font-semibold text-[#9A7B2C] hover:underline shrink-0 ml-4">
                Request Access
              </Link>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
