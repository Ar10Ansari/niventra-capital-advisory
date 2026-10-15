"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
  id: string;
  title: string;
  category?: string;
  content: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = "",
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={`border rounded-lg transition-colors bg-white ${
              isOpen
                ? "border-[rgba(26,26,26,0.2)] shadow-sm"
                : "border-[rgba(26,26,26,0.08)] hover:border-[rgba(26,26,26,0.15)]"
            }`}
          >
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-heading text-[1.0625rem] font-[600] text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded-lg min-h-[48px]"
              >
                <span className="flex-1">
                  {item.category && (
                    <span className="block text-[0.6875rem] font-body uppercase tracking-[0.1em] text-[#8A8A8A] font-semibold mb-1">
                      {item.category}
                    </span>
                  )}
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-[#8A8A8A] transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#9A7B2C]" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={`px-5 pb-5 pt-1 text-[0.9375rem] text-[#5C5C5C] leading-[1.75] border-t border-[rgba(26,26,26,0.06)] mt-1 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
