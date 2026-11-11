"use client";

import React from "react";
import { FileText } from "lucide-react";
import { ProductItem, DocumentItem } from "@/lib/api/client";

export const AdminProductsTab: React.FC<{ products: ProductItem[] }> = ({ products }) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
          Debenture Offerings Catalog
        </h2>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Published structured financial products and illustrative debenture models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="p-4 rounded-lg border border-gray-200 bg-[#FAFAF7] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[0.6875rem] font-semibold text-[#9A7B2C] uppercase tracking-wider">
                {p.category}
              </span>
              <span className="text-[0.625rem] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {p.status}
              </span>
            </div>
            <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">{p.title}</h3>
            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-200">
              <div>
                <span className="text-[#8A8A8A] block">Yield</span>
                <span className="font-semibold text-[#1A1A1A]">{p.indicative_yield}</span>
              </div>
              <div>
                <span className="text-[#8A8A8A] block">Tenor</span>
                <span className="font-semibold text-[#1A1A1A]">{p.tenor}</span>
              </div>
              <div>
                <span className="text-[#8A8A8A] block">Min Investment</span>
                <span className="font-semibold text-[#1A1A1A]">{p.min_investment}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminDocumentsTab: React.FC<{ documents: DocumentItem[] }> = ({ documents }) => {
  return (
    <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
      <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
        <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
          Compliance &amp; Document Repository
        </h2>
        <p className="text-xs text-[#5C5C5C] mt-1">
          Official disclosures, regulatory term sheets, and investor due diligence reports.
        </p>
      </div>

      <div className="space-y-3">
        {documents.map((d) => (
          <div key={d.id} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-[#9A7B2C]" />
              <div>
                <span className="text-xs font-semibold text-[#1A1A1A] block">{d.title}</span>
                <span className="text-[0.6875rem] text-gray-500">
                  {d.doc_type} • v{d.version}
                </span>
              </div>
            </div>
            <span className="text-[0.625rem] px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              {d.is_public ? "Public Access" : "Investor Restricted"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
