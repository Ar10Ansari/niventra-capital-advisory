"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Building, Phone, Mail, Clock, ShieldCheck, AlertCircle, X, Info } from "lucide-react";
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
          <span className="text-eyebrow mb-2 block">Institutional Presence &amp; Regional Directory</span>
          <h2
            id="branch-directory-heading"
            className="font-heading text-2xl sm:text-3xl font-[600] text-[#1A1A1A]"
          >
            Office Locations &amp; Regional Network
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-2xl leading-relaxed">
            Browse our complete institutional directory across 25 locations in 6 states. Corporate head office, regional advisory desks, and historical regional network points.
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

      {/* Top Advisory Notice: Prior Travel Verification Guidance */}
      <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 sm:p-5 text-[#4A3B18] flex items-start gap-3.5 shadow-2xs">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <p className="font-semibold text-[#2C2411]">
            Notice on Network Locations &amp; Prior Travel Verification
          </p>
          <p className="text-[#5A4926]">
            Certain regional locations listed below represent historical directory records currently pending formal company verification. Lease agreements, exact office suites, and active operational statuses are being confirmed. Visitors are strictly advised not to travel to pending locations without first contacting our Central Advisory Desk (Toll-Free: <a href="tel:18008900818" className="font-semibold underline hover:text-[#1A1A1A]">1800 890 0818</a>) to confirm office availability and schedule an appointment.
          </p>
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
            No directory entry matches &ldquo;{searchQuery}&rdquo;. For advisory consultations in other districts or regions, our central advisory desk coordinates direct consultations.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map((branch) => (
            <article
              key={branch.id}
              className={`rounded-xl border p-6 flex flex-col justify-between transition-all shadow-2xs bg-white ${
                branch.isHeadOffice
                  ? "border-[#9A7B2C]/40 bg-gradient-to-br from-white to-[#FAFAF7] md:col-span-2 lg:col-span-3"
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

                  {branch.status === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                      Verified Office
                    </span>
                  ) : branch.status === "PENDING_CONFIRMATION" ? (
                    <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                      <Building className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                      Advisory Desk — Pending Confirmation
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                      Pending Verification
                    </span>
                  )}
                </div>

                {/* City & Address */}
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-[600] text-[#1A1A1A] flex items-center gap-2">
                    {branch.isHeadOffice ? (
                      <Building className="w-4 h-4 text-[#9A7B2C] shrink-0" aria-hidden="true" />
                    ) : (
                      <MapPin className="w-4 h-4 text-[#9A7B2C] shrink-0" aria-hidden="true" />
                    )}
                    <span>
                      {branch.city}{" "}
                      <span className="font-normal text-xs text-[#8A8A8A]">
                        {branch.isHeadOffice
                          ? "· Corporate Head Office"
                          : branch.tier === "REGIONAL_DESK"
                          ? "· Regional Advisory Desk"
                          : "· Regional Network"}
                      </span>
                    </span>
                  </h3>
                  <address className="not-italic text-xs sm:text-sm text-[#5C5C5C] leading-relaxed mt-2 font-body">
                    {branch.address}
                  </address>
                </div>

                {/* Metadata Details */}
                {branch.openingHours || branch.phone || branch.email ? (
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
                ) : (
                  <div className="pt-2 border-t border-[rgba(26,26,26,0.06)] text-[0.75rem] text-[#8A8A8A] flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#8A8A8A] shrink-0" aria-hidden="true" />
                    <span>
                      Inquiries via Central Advisory Desk:{" "}
                      <a
                        href="tel:18008900818"
                        className="text-[#1A1A1A] font-medium hover:text-[#9A7B2C] transition-colors"
                      >
                        1800 890 0818
                      </a>
                    </span>
                  </div>
                )}

                {/* Audit and Discrepancy Notes */}
                {branch.notes && (
                  <div className="pt-2 border-t border-[rgba(26,26,26,0.06)] flex items-start gap-1.5 text-[0.6875rem] text-[#8A8A8A]">
                    <Info className="w-3.5 h-3.5 text-[#B0B0B0] shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="italic leading-normal">
                      {branch.notes}
                    </p>
                  </div>
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
          For prospective capital providers and developers across Madhya Pradesh, Rajasthan, Uttar Pradesh, Haryana, and Maharashtra seeking in-person consultations in cities without an operational physical office, appointments and documentation reviews are coordinated directly through our Central Advisory Desk (Toll-Free: <strong>1800 890 0818</strong>).
        </p>
      </div>
    </section>
  );
};
