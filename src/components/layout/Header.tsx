"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, Lock, ChevronDown, ArrowRight } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

const ADVISORY_ITEMS: DropdownItem[] = [
  {
    label: "Debt & Debenture Advisory",
    href: "/debt-debenture/",
    description: "Senior secured private debentures",
  },
  {
    label: "Real Estate Capital",
    href: "/real-estate/",
    description: "Structured debt & mezzanine finance",
  },
  {
    label: "Capital Providers",
    href: "/capital-providers/",
    description: "Co-investment for family offices & HNIs",
  },
  {
    label: "Offerings Catalog",
    href: "/products/",
    description: "Evaluated debenture structures",
  },
  {
    label: "Return Calculator",
    href: "/calculator/",
    description: "Simple-interest cash-flow modeling",
  },
];

const GOVERNANCE_ITEMS: DropdownItem[] = [
  {
    label: "Investor Information",
    href: "/investor-information/",
    description: "Trustee safeguards & ROC compliance",
  },
  {
    label: "Regulatory Disclosures",
    href: "/regulatory-disclosures/",
    description: "Section 42 statutory framework",
  },
  {
    label: "Risk Disclosures",
    href: "/risk-disclosure/",
    description: "Investment & credit risk factors",
  },
  {
    label: "Support & FAQ",
    href: "/support-faq/",
    description: "Operational guidelines & queries",
  },
  {
    label: "Grievance Redressal",
    href: "/grievance/",
    description: "Dispute resolution with 30-day SLA",
  },
];

interface HeaderProps {
  activePath?: string;
}

export const Header: React.FC<HeaderProps> = ({ activePath = "/" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const advisoryRef = useRef<HTMLDivElement>(null);
  const governanceRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect scroll for subtle header elevation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileMenuOpen(false);
    mobileToggleRef.current?.focus();
  }, []);

  const closeDropdowns = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        advisoryRef.current && !advisoryRef.current.contains(target) &&
        governanceRef.current && !governanceRef.current.contains(target)
      ) {
        closeDropdowns();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdowns]);

  // Global ESC key handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openDropdown) {
          closeDropdowns();
        }
        if (isMobileMenuOpen) {
          closeMobile();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openDropdown, isMobileMenuOpen, closeDropdowns, closeMobile]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Delayed dropdown close on mouse leave
  const handleMouseEnter = (id: string) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const isAdvisoryActive = ADVISORY_ITEMS.some((i) => activePath === i.href);
  const isGovernanceActive = GOVERNANCE_ITEMS.some((i) => activePath === i.href);

  return (
    <>
      {/* ============================================================
          HEADER: Premium Institutional · Minimal · Uncluttered
          ============================================================ */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? "header-light bg-[#FAFAF7]/95 backdrop-blur-md shadow-[0_1px_3px_0_rgba(26,26,26,0.06)] border-b border-[rgba(26,26,26,0.08)]"
            : "bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.06)]"
        }`}
      >
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[74px]">
            {/* Logo Unit */}
            <div className="flex items-center shrink-0 lg:mr-8 xl:mr-10">
              <Link
                href="/"
                className="flex items-center gap-3.5 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] focus-visible:ring-offset-2 py-1 min-h-[44px]"
                aria-label="Niventra Capital Advisory — Home"
              >
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-[2px] transition-opacity duration-200 group-hover:opacity-90">
                  <Image
                    src="/assets/images/logo.png"
                    alt="Niventra Capital Advisory emblem"
                    fill
                    className="object-contain"
                    priority
                    sizes="40px"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-heading text-lg sm:text-[1.125rem] font-semibold tracking-tight text-[#1A1A1A] leading-none">
                    NIVENTRA
                  </span>
                  <span className="font-body text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.18em] font-semibold text-[#9A7B2C] mt-0.5">
                    Capital Advisory
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-2 whitespace-nowrap"
              aria-label="Primary institutional navigation"
            >
              {/* 1. Advisory & Capital Dropdown */}
              <div
                ref={advisoryRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("advisory")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "advisory" ? null : "advisory")}
                  aria-expanded={openDropdown === "advisory"}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-medium tracking-normal rounded transition-colors duration-150 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] ${
                    isAdvisoryActive || openDropdown === "advisory"
                      ? "text-[#9A7B2C] font-semibold bg-[rgba(154,123,44,0.06)]"
                      : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.03)]"
                  }`}
                >
                  <span>Advisory &amp; Capital</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-[#8A8A8A] ${
                      openDropdown === "advisory" ? "rotate-180 text-[#9A7B2C]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {openDropdown === "advisory" && (
                  <div
                    role="menu"
                    aria-label="Advisory and capital offerings"
                    className="absolute top-full left-0 mt-1 w-72 rounded-lg bg-white border border-[rgba(26,26,26,0.09)] shadow-[0_8px_30px_rgba(26,26,26,0.08)] p-2 z-50 animate-in fade-in duration-150"
                  >
                    {ADVISORY_ITEMS.map((item) => {
                      const isActive = activePath === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeDropdowns}
                          className={`block px-3 py-2 rounded-md transition-colors group/item ${
                            isActive
                              ? "bg-[rgba(154,123,44,0.08)]"
                              : "hover:bg-[#FAFAF7]"
                          }`}
                        >
                          <div
                            className={`text-xs font-semibold tracking-tight transition-colors ${
                              isActive ? "text-[#9A7B2C]" : "text-[#1A1A1A] group-hover/item:text-[#9A7B2C]"
                            }`}
                          >
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-[0.6875rem] text-[#7A7A7A] mt-0.5 leading-tight font-normal">
                              {item.description}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Due Diligence (Direct Link) */}
              <Link
                href="/due-diligence/"
                className={`px-3 py-2 text-[0.8125rem] font-medium tracking-normal rounded transition-colors duration-150 min-h-[40px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] ${
                  activePath === "/due-diligence/"
                    ? "text-[#9A7B2C] font-semibold bg-[rgba(154,123,44,0.06)]"
                    : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.03)]"
                }`}
              >
                Due Diligence
              </Link>

              {/* 3. Investor Governance Dropdown */}
              <div
                ref={governanceRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("governance")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === "governance" ? null : "governance")}
                  aria-expanded={openDropdown === "governance"}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-medium tracking-normal rounded transition-colors duration-150 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] ${
                    isGovernanceActive || openDropdown === "governance"
                      ? "text-[#9A7B2C] font-semibold bg-[rgba(154,123,44,0.06)]"
                      : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.03)]"
                  }`}
                >
                  <span>Governance &amp; Info</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-[#8A8A8A] ${
                      openDropdown === "governance" ? "rotate-180 text-[#9A7B2C]" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {openDropdown === "governance" && (
                  <div
                    role="menu"
                    aria-label="Investor governance and regulatory disclosures"
                    className="absolute top-full left-0 mt-1 w-76 rounded-lg bg-white border border-[rgba(26,26,26,0.09)] shadow-[0_8px_30px_rgba(26,26,26,0.08)] p-2 z-50 animate-in fade-in duration-150"
                  >
                    {GOVERNANCE_ITEMS.map((item) => {
                      const isActive = activePath === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={closeDropdowns}
                          className={`block px-3 py-2 rounded-md transition-colors group/item ${
                            isActive
                              ? "bg-[rgba(154,123,44,0.08)]"
                              : "hover:bg-[#FAFAF7]"
                          }`}
                        >
                          <div
                            className={`text-xs font-semibold tracking-tight transition-colors ${
                              isActive ? "text-[#9A7B2C]" : "text-[#1A1A1A] group-hover/item:text-[#9A7B2C]"
                            }`}
                          >
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-[0.6875rem] text-[#7A7A7A] mt-0.5 leading-tight font-normal">
                              {item.description}
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. About (Direct Link) */}
              <Link
                href="/about/"
                className={`px-3 py-2 text-[0.8125rem] font-medium tracking-normal rounded transition-colors duration-150 min-h-[40px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] ${
                  activePath === "/about/"
                    ? "text-[#9A7B2C] font-semibold bg-[rgba(154,123,44,0.06)]"
                    : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.03)]"
                }`}
              >
                About
              </Link>

              {/* 5. Contact (Direct Link) */}
              <Link
                href="/contact/"
                className={`px-3 py-2 text-[0.8125rem] font-medium tracking-normal rounded transition-colors duration-150 min-h-[40px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] ${
                  activePath === "/contact/"
                    ? "text-[#9A7B2C] font-semibold bg-[rgba(154,123,44,0.06)]"
                    : "text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.03)]"
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Toll-free phone */}
              <a
                href="tel:18008900818"
                className="hidden xl:inline-flex items-center gap-2 text-[0.8125rem] font-medium text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors py-1.5 px-2 rounded min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] whitespace-nowrap"
                aria-label="Call toll-free: 1800 890 0818"
              >
                <Phone className="w-3.5 h-3.5 shrink-0 text-[#9A7B2C]" aria-hidden="true" />
                <span className="font-semibold text-[#1A1A1A]">1800 890 0818</span>
              </a>

              <a
                href="tel:18008900818"
                className="hidden lg:inline-flex xl:hidden items-center justify-center w-10 h-10 rounded-md border border-[rgba(26,26,26,0.12)] text-[#5C5C5C] hover:text-[#1A1A1A] hover:border-[#9A7B2C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C]"
                aria-label="Call toll-free: 1800 890 0818"
                title="Call toll-free: 1800 890 0818"
              >
                <Phone className="w-3.5 h-3.5 text-[#9A7B2C]" aria-hidden="true" />
              </a>

              {/* Investor Portal */}
              <Link
                href="/login/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-medium text-[#4A4A4A] hover:text-[#9A7B2C] transition-colors min-h-[40px] whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C]"
              >
                <Lock className="w-3.5 h-3.5 text-[#9A7B2C] shrink-0" aria-hidden="true" />
                <span>Investor Portal</span>
              </Link>

              {/* Primary Consultation CTA */}
              <Link
                href="/contact/"
                className="inline-flex items-center justify-center px-4 py-2 text-[0.8125rem] font-semibold rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] transition-colors duration-150 min-h-[40px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C]"
              >
                <span>Schedule a Consultation</span>
              </Link>

              {/* Mobile Drawer Toggle */}
              <button
                ref={mobileToggleRef}
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C]"
                aria-controls="mobile-navigation"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(26,26,26,0.4)] backdrop-blur-xs lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation menu"
        className={`fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] bg-[#FAFAF7] border-l border-[rgba(26,26,26,0.08)] shadow-xl lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-[74px] border-b border-[rgba(26,26,26,0.08)] bg-white">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[2px]">
              <Image
                src="/assets/images/logo.png"
                alt="Niventra emblem"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <span className="font-heading text-base font-semibold tracking-tight text-[#1A1A1A]">
              NIVENTRA
            </span>
          </div>
          <button
            type="button"
            onClick={closeMobile}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-md text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C]"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-5 py-5 space-y-5" aria-label="Mobile site links">
          {/* Quick Home Link */}
          <div>
            <Link
              href="/"
              onClick={closeMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-semibold transition-colors min-h-[44px] ${
                activePath === "/"
                  ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] font-bold"
                  : "text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.04)]"
              }`}
            >
              <span>Home</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8A8A8A]" />
            </Link>
          </div>

          {/* Section: Advisory & Capital */}
          <div className="space-y-1">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#8A8A8A] px-3 block mb-1">
              Advisory &amp; Capital
            </span>
            {ADVISORY_ITEMS.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`flex flex-col justify-center px-3 py-2 rounded-md transition-colors min-h-[44px] ${
                    isActive
                      ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] font-semibold"
                      : "text-[#2D2D2D] hover:bg-[rgba(26,26,26,0.04)]"
                  }`}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-[0.6875rem] text-[#7A7A7A] mt-0.5 leading-tight">
                      {item.description}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Section: Due Diligence */}
          <div className="space-y-1">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#8A8A8A] px-3 block mb-1">
              Methodology
            </span>
            <Link
              href="/due-diligence/"
              onClick={closeMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                activePath === "/due-diligence/"
                  ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] font-semibold"
                  : "text-[#2D2D2D] hover:bg-[rgba(26,26,26,0.04)]"
              }`}
            >
              <span>Due Diligence Framework</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8A8A8A]" />
            </Link>
          </div>

          {/* Section: Governance & Investor Information */}
          <div className="space-y-1">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#8A8A8A] px-3 block mb-1">
              Investor Governance
            </span>
            {GOVERNANCE_ITEMS.map((item) => {
              const isActive = activePath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] font-semibold"
                      : "text-[#3D3D3D] hover:bg-[rgba(26,26,26,0.04)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3 h-3 text-[#A0A0A0]" />
                </Link>
              );
            })}
          </div>

          {/* Section: Corporate */}
          <div className="space-y-1">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#8A8A8A] px-3 block mb-1">
              Corporate
            </span>
            <Link
              href="/about/"
              onClick={closeMobile}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors min-h-[44px] ${
                activePath === "/about/"
                  ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] font-semibold"
                  : "text-[#3D3D3D] hover:bg-[rgba(26,26,26,0.04)]"
              }`}
            >
              <span>About Niventra</span>
              <ArrowRight className="w-3 h-3 text-[#A0A0A0]" />
            </Link>
            <Link
              href="/contact/"
              onClick={closeMobile}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors min-h-[44px] ${
                activePath === "/contact/"
                  ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.08)] font-semibold"
                  : "text-[#3D3D3D] hover:bg-[rgba(26,26,26,0.04)]"
              }`}
            >
              <span>Contact</span>
              <ArrowRight className="w-3 h-3 text-[#A0A0A0]" />
            </Link>
          </div>
        </nav>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[rgba(26,26,26,0.08)] bg-white space-y-2.5 shrink-0">
          <a
            href="tel:18008900818"
            className="flex items-center justify-center gap-2 text-xs font-medium text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors py-2 rounded-md border border-[rgba(26,26,26,0.1)] min-h-[44px]"
          >
            <Phone className="w-3.5 h-3.5 text-[#9A7B2C]" aria-hidden="true" />
            <span>1800 890 0818 <span className="text-[#8A8A8A]">(Toll-Free)</span></span>
          </a>

          <Link
            href="/login/"
            onClick={closeMobile}
            className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 text-xs font-semibold rounded-md border border-[rgba(26,26,26,0.16)] bg-white text-[#1A1A1A] hover:bg-[#FAFAF7] hover:border-[#9A7B2C] transition-colors min-h-[44px]"
          >
            <Lock className="w-3.5 h-3.5 text-[#9A7B2C]" />
            <span>Investor Portal</span>
          </Link>

          <Link
            href="/contact/"
            onClick={closeMobile}
            className="flex items-center justify-center w-full text-center px-4 py-2.5 text-xs font-semibold rounded-md bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] transition-colors min-h-[44px]"
          >
            <span>Schedule a Consultation</span>
          </Link>
        </div>
      </div>
    </>
  );
};
