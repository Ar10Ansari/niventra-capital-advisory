"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Building, Phone, Mail, Clock, ShieldCheck, AlertCircle, X } from "lucide-react";
import { BranchLocation } from "@/lib/branches/types";
import { PUBLISHED_BRANCHES, filterBranches, getStateCounts } from "@/lib/branches/data";

interface BranchDirectoryProps {
  initialBranches?: BranchLocation[];
  className?: string;
}

export const BranchDirectory: React.FC<BranchDirectoryProps> = ({
  initialBranches = PUBLISHED_BRANCHES,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("ALL");

  const filteredBranches = useMemo(() => {
    return filterBranches(initialBranches, searchQuery, selectedState);
  }, [initialBranches, searchQuery, selectedState]);

  const stateCounts = useMemo(() => {
    return getStateCounts(initialBranches);
  }, [initialBranches]);

  return (
    <section
      aria-labelledby="branch-directory-heading"
      className={`space-y-8 ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(26,26,26,0.08)] pb-6">
        <div>
          <span className="text-eyebrow mb-2 block">Institutional Presence</span>
          <h2
            id="branch-directory-heading"
            className="font-heading text-2xl sm:text-3xl font-[600] text-[#1A1A1A]"
          >
            Office Locations &amp; Advisory Desks
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-2xl leading-relaxed">
            Verified corporate offices and structured regional advisory desks. All physical consultations require prior appointment.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80 relative">
          <label htmlFor="branch-search" className="sr-only">
            Search branch by city, state, or PIN code
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="branch-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city, state, or PIN..."
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm rounded-lg border border-[rgba(26,26,26,0.12)] bg-white placeholder-[#8A8A8A] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#9A7B2C] focus:border-[#9A7B2C] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#1A1A1A] p-0.5 rounded"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* State Filter Pills */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filter offices by state"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedState === "ALL"}
          onClick={() => setSelectedState("ALL")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedState === "ALL"
              ? "bg-[#1A1A1A] text-white shadow-2xs font-semibold"
              : "bg-[#F4F3EF] text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#EBEAE4]"
          }`}
        >
          All Locations ({initialBranches.length})
        </button>

        {stateCounts.map(({ state, count }) => (
          <button
            key={state}
            type="button"
            role="tab"
            aria-selected={selectedState === state}
            onClick={() => setSelectedState(state)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedState === state
                ? "bg-[#1A1A1A] text-white shadow-2xs font-semibold"
                : "bg-[#F4F3EF] text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#EBEAE4]"
            }`}
          >
            {state} ({count})
          </button>
        ))}
      </div>

      {/* Branch Cards Grid */}
      {filteredBranches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[rgba(26,26,26,0.15)] p-10 text-center space-y-3 bg-[#FAFAF7]">
          <MapPin className="w-7 h-7 text-[#9A7B2C] mx-auto" aria-hidden="true" />
          <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
            No Location Found
          </h3>
          <p className="text-xs text-[#5C5C5C] max-w-md mx-auto leading-relaxed">
            No published office matches &ldquo;{searchQuery}&rdquo;. For advisory consultations in other districts, our central advisory desk coordinates direct consultations.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedState("ALL");
            }}
            className="text-xs text-[#9A7B2C] font-semibold underline underline-offset-2 hover:text-[#856925] mt-2 block mx-auto"
          >
            Reset search and filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBranches.map((branch) => (
            <article
              key={branch.id}
              className={`rounded-xl border p-6 sm:p-7 flex flex-col justify-between transition-all shadow-2xs bg-white ${
                branch.isHeadOffice
                  ? "border-[#9A7B2C]/30 bg-gradient-to-br from-white to-[#FAFAF7]"
                  : "border-[rgba(26,26,26,0.08)]"
              }`}
            >
              <div className="space-y-4">
                {/* Header & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9A7B2C]" aria-hidden="true" />
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9A7B2C]">
                      {branch.state}
                    </span>
                  </div>

                  {branch.isHeadOffice ? (
                    <span className="inline-flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                      Corporate Head Office
                    </span>
                  ) : branch.status === "PENDING_CONFIRMATION" ? (
                    <span className="inline-flex items-center gap-1 text-[0.625rem] font-medium uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 text-amber-600" aria-hidden="true" />
                      Advisory Desk
                    </span>
                  ) : null}
                </div>

                {/* City & Address */}
                <div>
                  <h3 className="font-heading text-xl font-[600] text-[#1A1A1A] flex items-center gap-2">
                    {branch.isHeadOffice ? (
                      <Building className="w-4 h-4 text-[#9A7B2C] shrink-0" aria-hidden="true" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#9A7B2C] shrink-0" aria-hidden="true" />
                    )}
                    {branch.city} {branch.isHeadOffice ? "· Global Headquarters" : "· Regional Desk"}
                  </h3>
                  <address className="not-italic text-xs sm:text-sm text-[#5C5C5C] leading-relaxed mt-2 font-body">
                    {branch.address}
                  </address>
                </div>

                {/* Metadata Details */}
                <div className="space-y-2 pt-2 border-t border-[rgba(26,26,26,0.06)] text-xs text-[#5C5C5C]">
                  {branch.openingHours && (
                    <div className="flex items-center gap-2 text-[0.75rem]">
                      <Clock className="w-3.5 h-3.5 text-[#8A8A8A] shrink-0" aria-hidden="true" />
                      <span>{branch.openingHours}</span>
                    </div>
                  )}

                  {branch.phone && (
                    <div className="flex items-center gap-2 text-[0.75rem]">
                      <Phone className="w-3.5 h-3.5 text-[#8A8A8A] shrink-0" aria-hidden="true" />
                      <a
                        href={`tel:${branch.phone.replace(/\s+/g, "")}`}
                        className="text-[#1A1A1A] font-medium hover:text-[#9A7B2C] transition-colors"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  )}

                  {branch.email && (
                    <div className="flex items-center gap-2 text-[0.75rem]">
                      <Mail className="w-3.5 h-3.5 text-[#8A8A8A] shrink-0" aria-hidden="true" />
                      <a
                        href={`mailto:${branch.email}`}
                        className="text-[#1A1A1A] font-medium hover:text-[#9A7B2C] transition-colors"
                      >
                        {branch.email}
                      </a>
                    </div>
                  )}
                </div>

                {branch.notes && (
                  <p className="text-[0.6875rem] text-[#8A8A8A] italic leading-normal pt-1">
                    {branch.notes}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Regional Network Policy Banner */}
      <div className="rounded-xl border border-[rgba(154,123,44,0.2)] bg-[rgba(154,123,44,0.04)] p-5 sm:p-6 text-xs text-[#5C5C5C] space-y-2">
        <div className="flex items-center gap-2 text-[#9A7B2C] font-semibold text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Regional Network Coordination Policy</span>
        </div>
        <p className="leading-relaxed">
          For prospective capital providers and developers across Madhya Pradesh, Rajasthan, Uttar Pradesh, Haryana, and Maharashtra seeking in-person consultations in cities without a dedicated public office card, appointments are coordinated and scheduled through our Central Advisory Desk (Toll-Free: <strong>1800 890 0818</strong>).
        </p>
      </div>
    </section>
  );
};
