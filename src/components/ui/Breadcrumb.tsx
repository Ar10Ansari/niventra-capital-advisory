import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 text-[#8A8A8A]">
        <li>
          <Link
            href="/"
            className="hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-[#A8A8A8] shrink-0" aria-hidden="true" />
              {isLast || !item.href ? (
                <span className="text-[#1A1A1A] font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#9A7B2C] rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
