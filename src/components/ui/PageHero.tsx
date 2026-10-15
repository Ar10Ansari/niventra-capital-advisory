import React from "react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  highlightedText?: string;
  description: string | React.ReactNode;
  breadcrumbItems: BreadcrumbItem[];
  sideContent?: React.ReactNode;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  highlightedText,
  description,
  breadcrumbItems,
  sideContent,
  className = "",
}) => {
  return (
    <section
      className={`bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] pt-8 pb-14 sm:pb-16 ${className}`}
      aria-label="Page overview"
    >
      <div className="container-editorial">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className={sideContent ? "lg:col-span-8" : "lg:col-span-9"}>
            {eyebrow && <p className="text-eyebrow mb-4">{eyebrow}</p>}
            <h1 className="font-heading text-[clamp(2rem,4vw,3.25rem)] font-[500] leading-[1.12] tracking-[-0.02em] text-[#1A1A1A] mb-5">
              {title}{" "}
              {highlightedText && (
                <em className="not-italic" style={{ color: "var(--color-brass)" }}>
                  {highlightedText}
                </em>
              )}
            </h1>
            <div className="text-[1.0625rem] text-[#5C5C5C] leading-[1.7] max-w-2xl">
              {description}
            </div>
          </div>

          {sideContent && (
            <div className="lg:col-span-4 flex flex-col justify-end lg:border-l lg:border-[rgba(26,26,26,0.08)] lg:pl-8">
              {sideContent}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
