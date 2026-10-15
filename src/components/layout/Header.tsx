"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/about/" },
  { label: "Debt & Debenture", href: "/debt-debenture/" },
  { label: "Real Estate", href: "/real-estate/" },
  { label: "Due Diligence", href: "/due-diligence/" },
  { label: "Capital Providers", href: "/capital-providers/" },
  { label: "Investor Info", href: "/investor-information/" },
  { label: "Contact", href: "/contact/" },
];

interface HeaderProps {
  activePath?: string;
}

export const Header: React.FC<HeaderProps> = ({ activePath = "/" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = useCallback(() => setIsMobileMenuOpen(false), []);

  // ESC key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) closeMobile();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, closeMobile]);

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ============================================================
          HEADER: Light glass, hairline border, minimal presence
          ============================================================ */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "header-light shadow-[0_1px_0_0_rgba(26,26,26,0.08)]"
            : "bg-[#FAFAF7]/95 border-b border-[rgba(26,26,26,0.08)]"
        }`}
      >
        <div className="container-editorial">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] focus-visible:ring-offset-2"
              aria-label="Niventra Capital Advisory — Home"
            >
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-[3px] transition-opacity duration-200 group-hover:opacity-85">
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
                <span className="font-heading text-[1.0625rem] font-semibold tracking-tight text-[#1A1A1A] leading-none">
                  NIVENTRA
                </span>
                <span
                  className="font-body text-[0.625rem] uppercase tracking-[0.15em] font-600 mt-0.5"
                  style={{ color: "var(--color-brass)", fontWeight: 600 }}
                >
                  Capital Advisory
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-0.5"
              aria-label="Primary navigation"
            >
              {NAV_LINKS.map((link) => {
                const isActive = activePath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-[0.8125rem] font-medium tracking-wide rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] focus-visible:ring-offset-1 ${
                      isActive
                        ? "text-[#9A7B2C] font-semibold"
                        : "text-[#5C5C5C] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Header Actions */}
            <div className="hidden sm:flex items-center gap-5">
              <a
                href="tel:18008900818"
                className="flex items-center gap-2 text-[0.8125rem] text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded px-1 py-1"
                aria-label="Call toll-free: 1800 890 0818"
              >
                <Phone
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "var(--color-brass)" }}
                  aria-hidden="true"
                />
                <span className="font-medium">1800 890 0818</span>
              </a>

              <Link
                href="/contact/"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.8125rem] font-semibold rounded border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] focus-visible:ring-offset-2 min-h-[38px]"
              >
                Schedule Consultation
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C]"
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          MOBILE DRAWER: Full-height slide-in, minimal, clean
          ============================================================ */}

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[rgba(26,26,26,0.35)] backdrop-blur-[2px] lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-full bg-[#FAFAF7] border-l border-[rgba(26,26,26,0.08)] shadow-2xl lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-[rgba(26,26,26,0.08)]">
          <span className="font-heading text-base font-semibold tracking-tight text-[#1A1A1A]">
            NIVENTRA
          </span>
          <button
            type="button"
            onClick={closeMobile}
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.05)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C]"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile navigation">
          <ul className="space-y-0.5">
            {/* Home link */}
            <li>
              <Link
                href="/"
                onClick={closeMobile}
                className={`flex items-center px-3 py-3 rounded text-sm font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] ${
                  activePath === "/"
                    ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.07)] font-semibold"
                    : "text-[#2D2D2D] hover:bg-[rgba(26,26,26,0.04)] hover:text-[#1A1A1A]"
                }`}
              >
                Home
              </Link>
            </li>
            {NAV_LINKS.map((link) => {
              const isActive = activePath === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className={`flex items-center px-3 py-3 rounded text-sm font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] ${
                      isActive
                        ? "text-[#9A7B2C] bg-[rgba(154,123,44,0.07)] font-semibold"
                        : "text-[#2D2D2D] hover:bg-[rgba(26,26,26,0.04)] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="px-6 py-6 border-t border-[rgba(26,26,26,0.08)] space-y-4">
          <a
            href="tel:18008900818"
            className="flex items-center gap-2 text-sm text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded min-h-[44px]"
          >
            <Phone className="w-4 h-4 shrink-0" style={{ color: "var(--color-brass)" }} aria-hidden="true" />
            <span>1800 890 0818 <span className="text-[#8A8A8A]">(Toll-Free)</span></span>
          </a>
          <Link
            href="/contact/"
            onClick={closeMobile}
            className="block w-full text-center px-4 py-3 text-sm font-semibold rounded border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] min-h-[44px]"
          >
            Schedule Consultation
          </Link>
        </div>
      </div>
    </>
  );
};
