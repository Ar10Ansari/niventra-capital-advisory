"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";

interface HeaderProps {
  activePath?: string;
}

export const Header: React.FC<HeaderProps> = ({ activePath = "/" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about/" },
    { label: "Debt & Debenture", href: "/debt-debenture/" },
    { label: "Real Estate", href: "/real-estate/" },
    { label: "Due Diligence", href: "/due-diligence/" },
    { label: "Capital Providers", href: "/capital-providers/" },
    { label: "Investor Info", href: "/investor-information/" },
    { label: "Contact", href: "/contact/" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "glass-header py-2.5 shadow-lg shadow-black/20"
            : "bg-[#0B192C] py-4 border-b border-[#D4AF37]/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Authentic Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-3.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-md p-1"
              aria-label="Niventra Capital Advisory Home"
            >
              <div className="relative w-12 h-10 sm:w-14 sm:h-12 shrink-0 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/assets/images/logo.png"
                  alt="Niventra Capital Advisory Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-heading text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                  NIVENTRA
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans-body uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                  Capital Advisory
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden xl:flex items-center gap-1.5"
              aria-label="Primary Navigation"
            >
              {navLinks.map((link) => {
                const isActive = activePath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-xs font-semibold tracking-wide rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                      isActive
                        ? "text-[#D4AF37] bg-white/5 font-bold"
                        : "text-gray-200 hover:text-[#D4AF37] hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden sm:flex items-center gap-4">
              <a
                href="tel:18008900818"
                className="flex items-center gap-2 text-xs text-gray-300 hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded px-2 py-1"
                aria-label="Call Toll Free: 1800 890 0818"
              >
                <div className="w-7 h-7 rounded-full bg-[#1E3E62] flex items-center justify-center text-[#D4AF37]">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider">
                    Toll-Free Desk
                  </span>
                  <span className="font-semibold text-white">1800 890 0818</span>
                </div>
              </a>

              <Button
                variant="primary"
                size="sm"
                href="/contact/"
                className="text-xs"
              >
                Contact Advisory
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] min-h-[44px] min-w-[44px]"
              aria-controls="mobile-navigation"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#D4AF37]" />
              ) : (
                <Menu className="w-6 h-6 text-[#D4AF37]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm xl:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Navigation Panel */}
      <div
        id="mobile-navigation"
        className={`fixed top-0 right-0 z-50 w-full sm:w-96 h-full bg-[#0B192C] border-l border-[#D4AF37]/30 shadow-2xl xl:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-8">
              <Image
                src="/assets/images/logo.png"
                alt="Niventra Capital Advisory Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-serif-heading font-bold text-white text-base block">
                NIVENTRA
              </span>
              <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider block">
                Capital Advisory
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6 text-[#D4AF37]" />
          </button>
        </div>

        {/* Navigation Links List */}
        <div className="p-4 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] px-3 mb-2">
            Navigation Menu
          </p>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = activePath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-white/10 text-[#D4AF37] font-bold"
                      : "text-gray-200 hover:bg-white/5 hover:text-[#D4AF37]"
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Contact & Verification Info */}
        <div className="p-5 bg-black/20 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Structured Debt & Capital Advisory</span>
          </div>

          <a
            href="tel:18008900818"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md bg-[#1E3E62] text-white text-sm font-semibold hover:bg-[#2B527E] transition-colors min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>Toll-Free: 1800 890 0818</span>
          </a>

          <Button
            variant="primary"
            size="md"
            href="/contact/"
            className="w-full justify-center"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Schedule Consultation
          </Button>
        </div>
      </div>
    </>
  );
};
