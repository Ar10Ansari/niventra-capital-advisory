import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldAlert, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B192C] text-gray-300 border-t border-[#D4AF37]/25 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Column 1: Brand Info (Spans 2 on desktop) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative w-12 h-10 shrink-0">
                <Image
                  src="/assets/images/logo.png"
                  alt="Niventra Capital Advisory Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif-heading text-xl font-bold tracking-tight text-white block">
                  NIVENTRA
                </span>
                <span className="text-[10px] font-sans-body uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block">
                  Capital Advisory India
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              Connecting eligible capital with professionally evaluated real-estate
              opportunities through structured debt and debenture channels.
              Committed to fiduciary integrity, rigorous due diligence, and
              transparent corporate governance.
            </p>

            <div className="space-y-2.5 text-xs text-gray-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Patel Nagar City Centre, Gwalior, Madhya Pradesh - 474001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Toll-Free: 1800 890 0818 | Landline: +91 011 4051 5660</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>info@niventracapitaladvisory.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Core Solutions */}
          <div>
            <h3 className="font-serif-heading text-sm font-bold text-white tracking-wider uppercase mb-4 text-[#D4AF37]">
              Core Solutions
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/debt-debenture/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                >
                  <span>Debt & Debenture</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link
                  href="/real-estate/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Real Estate Capital
                </Link>
              </li>
              <li>
                <Link
                  href="/capital-providers/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Capital Providers Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/due-diligence/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  5-Point Due Diligence
                </Link>
              </li>
              <li>
                <Link
                  href="/about/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Institutional Approach
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate & Governance */}
          <div>
            <h3 className="font-serif-heading text-sm font-bold text-white tracking-wider uppercase mb-4 text-[#D4AF37]">
              Governance
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/investor-information/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Investor Information
                </Link>
              </li>
              <li>
                <Link
                  href="/regulatory-disclosures/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Regulatory Disclosures
                </Link>
              </li>
              <li>
                <Link
                  href="/risk-disclosure/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Risk Factors & Disclosures
                </Link>
              </li>
              <li>
                <Link
                  href="/grievance/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Grievance Redressal (48h SLA)
                </Link>
              </li>
              <li>
                <Link
                  href="/delete-account/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Data Protection & Erasure
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Support & Legal */}
          <div>
            <h3 className="font-serif-heading text-sm font-bold text-white tracking-wider uppercase mb-4 text-[#D4AF37]">
              Client Advisory
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/contact/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Schedule Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/support-faq/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Support & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-conditions/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy/"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/917428280200"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline font-semibold"
                >
                  WhatsApp: +91 74282 80200
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Statutory Regulatory Disclaimer Banner */}
        <div className="py-6 border-b border-white/10">
          <div className="bg-[#132742]/80 border border-[#D4AF37]/30 rounded-lg p-4 flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="text-[11px] text-gray-300 leading-relaxed">
              <strong className="text-white block mb-0.5">
                Statutory Financial Risk & Regulatory Notice:
              </strong>
              Investments in debt debentures, non-convertible securities, and real
              estate capital instruments are subject to market risks, credit
              risks, and execution factors. Past indicative yields do not
              guarantee future performance. Niventra Capital Advisory India Pvt.
              Ltd. facilitates and structures capital transactions in accordance
              with applicable statutory frameworks and does not guarantee returns
              or promise capital assurance without verified underlying security.
              Please read all offering memoranda and term sheets carefully before
              investing.
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Compliance Notes */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Niventra Capital Advisory India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy-policy/"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/terms-conditions/"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Terms of Engagement
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/grievance/"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Grievance Officer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
