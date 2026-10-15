import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 flex items-center justify-center py-20 bg-[#FAFAF7]">
        <div className="container-editorial text-center max-w-xl space-y-6">
          <p className="text-eyebrow">Error 404</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-[500] text-[#1A1A1A] tracking-tight">
            Page not found
          </h1>
          <p className="text-[1rem] text-[#5C5C5C] leading-relaxed">
            The page you requested does not exist or has been relocated to another section
            of our advisory platform. Please verify the URL or return to our homepage.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="md" href="/" icon={<ArrowRight className="w-4 h-4" />}>
              Return to Homepage
            </Button>
            <Button variant="primary-outline" size="md" href="/contact/">
              Contact Advisory Desk
            </Button>
          </div>

          <div className="pt-8 border-t border-[rgba(26,26,26,0.08)]">
            <p className="text-xs uppercase tracking-wider text-[#8A8A8A] font-semibold mb-3">
              Popular Sections:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-[#5C5C5C]">
              <Link href="/debt-debenture/" className="hover:text-[#9A7B2C] transition-colors">
                Debt &amp; Debenture
              </Link>
              <span>·</span>
              <Link href="/real-estate/" className="hover:text-[#9A7B2C] transition-colors">
                Real Estate Capital
              </Link>
              <span>·</span>
              <Link href="/due-diligence/" className="hover:text-[#9A7B2C] transition-colors">
                Due Diligence Framework
              </Link>
              <span>·</span>
              <Link href="/capital-providers/" className="hover:text-[#9A7B2C] transition-colors">
                Capital Providers
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
