import type { BranchLocation } from "./types.ts";

/**
 * PUBLISHED AUTHORIZED BRANCH LOCATIONS
 * 
 * Policy:
 * Only corporate premises supported by official company records (MCA filings or authorized
 * corporate advisory desks) are published to the public directory.
 * 
 * Regional locations pending lease deed verification are held in `legacy-unverified.ts`
 * and will be imported only upon explicit executive authorization.
 */
export const PUBLISHED_BRANCHES: BranchLocation[] = [
  {
    id: "branch_gwalior_ho",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Patel Nagar City Centre, Gwalior, Madhya Pradesh - 474001",
    pinCode: "474001",
    isHeadOffice: true,
    status: "VERIFIED",
    tier: "HEAD_OFFICE",
    phone: "1800 890 0818",
    email: "info@niventracapitaladvisory.com",
    openingHours: "Mon–Fri: 9:30 AM – 6:30 PM IST",
    notes: "Corporate Head Office registered under the Companies Act, 2013. In-person advisory meetings by prior appointment.",
  },
  {
    id: "branch_delhi_desk",
    city: "Delhi",
    state: "Delhi",
    address: "The Nukleus Center, Mezzanine Level (Adjacent to Visa Consultation Office), Shivaji Stadium Metro Station, Connaught Place, New Delhi – 110001",
    pinCode: "110001",
    isHeadOffice: false,
    status: "PENDING_CONFIRMATION",
    tier: "REGIONAL_DESK",
    phone: "+91 011 4051 5660",
    email: "info@niventracapitaladvisory.com",
    openingHours: "Mon–Fri: 10:00 AM – 5:00 PM IST (By Prior Appointment)",
    notes: "Northern India Advisory Desk. Physical consultations scheduled via central desk.",
  },
];

/**
 * Filter branch records by state and search query (city, state, or PIN code)
 */
export function filterBranches(
  branches: BranchLocation[],
  searchQuery: string,
  selectedState: string
): BranchLocation[] {
  const query = searchQuery.trim().toLowerCase();

  return branches.filter((branch) => {
    // State filter match
    const matchesState =
      selectedState === "ALL" ||
      branch.state.toLowerCase() === selectedState.toLowerCase();

    if (!matchesState) return false;

    // Search query match
    if (!query) return true;

    const cityMatch = branch.city.toLowerCase().includes(query);
    const stateMatch = branch.state.toLowerCase().includes(query);
    const addressMatch = branch.address.toLowerCase().includes(query);
    const pinMatch = branch.pinCode ? branch.pinCode.includes(query) : false;

    return cityMatch || stateMatch || addressMatch || pinMatch;
  });
}

/**
 * Returns unique states present in the dataset with their respective counts
 */
export function getStateCounts(
  branches: BranchLocation[]
): { state: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const b of branches) {
    counts[b.state] = (counts[b.state] || 0) + 1;
  }

  return Object.entries(counts).map(([state, count]) => ({
    state,
    count,
  }));
}
