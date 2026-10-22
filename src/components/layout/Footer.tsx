import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

/* ============================================================================
   FOOTER — Niventra Capital Advisory India
   Dark anchor background with clean typographic structure.
   Compact, refined, compliant.
   ============================================================================ */

const FOOTER_LINKS = {
  services: [
    { label: "Debt & Debenture", href: "/debt-debenture/" },
    { label: "Real Estate Capital", href: "/real-estate/" },
    { label: "Capital Providers", href: "/capital-providers/" },
    { label: "Offerings Catalog", href: "/products/" },
    { label: "Return Calculator", href: "/calculator/" },
    { label: "Due Diligence", href: "/due-diligence/" },
    { label: "Project Funding", href: "/project-funding/" },
    { label: "About Niventra", href: "/about/" },
  ],
  governance: [
    { label: "Investor Information", href: "/investor-information/" },
    { label: "Regulatory Disclosures", href: "/regulatory-disclosures/" },
    { label: "Risk Factors", href: "/risk-disclosure/" },
    { label: "Grievance Redressal", href: "/grievance/" },
    { label: "Data Protection & Erasure", href: "/delete-account/" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms-conditions/" },
    { label: "Privacy Policy", href: "/privacy-policy/" },
    { label: "Support & FAQ", href: "/support-faq/" },
    { label: "Contact Us", href: "/contact/" },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E1C2E] text-[#A8B4C0]" role="contentinfo">
      {/* Main grid */}
      <div className="container-editorial pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-10 border-b border-[rgba(255,255,255,0.08)]">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded"
              aria-label="Niventra Capital Advisory — Home"
            >
              <div className="relative h-9 w-9 shrink-0 opacity-90 group-hover:opacity-100 transition-opacity">
                <Image
                  src="/assets/images/logo.png"
                  alt="Niventra Capital Advisory emblem"
                  fill
                  className="object-contain"
                  sizes="36px"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading text-[1rem] font-semibold text-white tracking-tight">
                  NIVENTRA
                </span>
                <span className="font-body text-[0.625rem] uppercase tracking-[0.15em] font-semibold mt-0.5" style={{ color: "#C9A84C" }}>
                  Capital Advisory India
                </span>
              </div>
            </Link>

            <p className="text-[0.875rem] leading-relaxed max-w-xs">
              Connecting eligible capital with professionally evaluated
              real-estate opportunities through structured debt and debenture
              channels. Committed to fiduciary integrity and transparent
              governance.
            </p>

            {/* Contact details */}
            <div className="space-y-3 text-[0.8125rem]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 mt-[2px]" style={{ color: "#C9A84C" }} aria-hidden="true" />
                <address className="not-italic">
                  Patel Nagar City Centre, Gwalior<br />
                  Madhya Pradesh — 474001
                </address>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: "#C9A84C" }} aria-hidden="true" />
                <div>
                  <a href="tel:18008900818" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded">
                    1800 890 0818
                  </a>
                  <span className="mx-2 text-[rgba(255,255,255,0.2)]">·</span>
                  <a href="tel:+9101140515660" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded">
                    +91 011 4051 5660
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0" style={{ color: "#C9A84C" }} aria-hidden="true" />
                <a
                  href="mailto:info@niventracapitaladvisory.com"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded"
                >
                  info@niventracapitaladvisory.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 shrink-0 flex items-center justify-center text-[0.625rem] font-bold" style={{ color: "#C9A84C" }} aria-hidden="true">W</span>
                <a
                  href="https://wa.me/917428280200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded"
                  aria-label="WhatsApp: +91 74282 80200 (opens in new tab)"
                >
                  +91 74282 80200 <span className="text-[0.75rem] text-[rgba(255,255,255,0.35)]">(WhatsApp)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Services column */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-body text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance column */}
          <div className="lg:col-span-3">
            <h3 className="font-body text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white mb-5">
              Governance
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.governance.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal column */}
          <div className="lg:col-span-3">
            <h3 className="font-body text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white mb-5">
              Legal &amp; Support
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Statutory disclaimer */}
        <div className="py-8 border-b border-[rgba(255,255,255,0.08)]">
          <p className="text-[0.75rem] text-[#7A8C9A] leading-relaxed max-w-5xl">
            <strong className="text-[#A8B4C0] font-semibold">Statutory Financial Risk &amp; Regulatory Notice:</strong>{" "}
            Investments in debt debentures, non-convertible securities, and real estate capital
            instruments are subject to market risks, credit risks, liquidity risks, and project
            execution risks. Indicative returns do not guarantee future performance or capital
            safety. Niventra Capital Advisory India Pvt. Ltd. facilitates and structures capital
            transactions in accordance with applicable statutory frameworks and does not guarantee
            returns or promise capital assurance without verified underlying security. Regulatory
            registration details are subject to ongoing verification. Please read all offering
            memoranda and term sheets carefully before investing.
          </p>
        </div>

        {/* Copyright row */}
        <div className="pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[0.75rem] text-[#5C6F7A]">
          <p>© 2026 Niventra Capital Advisory India Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy/" className="hover:text-[#A8B4C0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions/" className="hover:text-[#A8B4C0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded">
              Terms of Engagement
            </Link>
            <Link href="/grievance/" className="hover:text-[#A8B4C0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] rounded">
              Grievance Officer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
