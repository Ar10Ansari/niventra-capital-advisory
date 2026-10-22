import type { BranchLocation } from "./types.ts";

/**
 * PUBLIC BRANCH DIRECTORY DATASET
 *
 * Contains all 25 institutional and regional locations across 6 states.
 *
 * Verification Status Breakdown:
 * - 1 Verified Office (Corporate Head Office, Gwalior)
 * - 1 Advisory Desk — Pending Confirmation (Delhi Advisory Desk)
 * - 23 Network Locations — Pending Verification (Legacy regional network records)
 *
 * Policy:
 * All legacy records are transparently displayed to visitors with explicit status
 * badges and prior-travel contact guidance. Discrepancies (e.g. Gurugram PIN) are
 * retained for public accuracy and internal follow-up.
 */
export const PUBLISHED_BRANCHES: BranchLocation[] = [
  // -------------------------------------------------------------------------
  // 1. CORPORATE HEAD OFFICE (VERIFIED)
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // 2. REGIONAL ADVISORY DESK (PENDING CONFIRMATION)
  // -------------------------------------------------------------------------
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
    notes: "Northern India Advisory Desk. Physical consultations scheduled via central desk. Lease and membership confirmation pending.",
  },

  // -------------------------------------------------------------------------
  // 3. MADHYA PRADESH REGIONAL NETWORK (PENDING VERIFICATION)
  // -------------------------------------------------------------------------
  {
    id: "branch_bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "Arera Colony, Bhopal, Madhya Pradesh - 462016",
    pinCode: "462016",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; sector and unit number pending verification.",
  },
  {
    id: "branch_indore",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "Vijay Nagar, Indore, Madhya Pradesh - 452010",
    pinCode: "452010",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; commercial building and suite pending verification.",
  },
  {
    id: "branch_ujjain",
    city: "Ujjain",
    state: "Madhya Pradesh",
    address: "Freeganj, Ujjain, Madhya Pradesh - 456010",
    pinCode: "456010",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; commercial suite pending verification.",
  },
  {
    id: "branch_dewas",
    city: "Dewas",
    state: "Madhya Pradesh",
    address: "A.B. Road, Dewas, Madhya Pradesh - 455001",
    pinCode: "455001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; highway premise identifier pending verification.",
  },
  {
    id: "branch_khandwa",
    city: "Khandwa",
    state: "Madhya Pradesh",
    address: "Civil Lines, Khandwa, Madhya Pradesh - 450001",
    pinCode: "450001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; building number pending verification.",
  },
  {
    id: "branch_neemuch",
    city: "Neemuch",
    state: "Madhya Pradesh",
    address: "Shastri Nagar, Neemuch, Madhya Pradesh - 458441",
    pinCode: "458441",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; premise number pending verification.",
  },
  {
    id: "branch_raisen",
    city: "Raisen",
    state: "Madhya Pradesh",
    address: "Nehru Nagar, Raisen, Madhya Pradesh - 464551",
    pinCode: "464551",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; premise number pending verification.",
  },
  {
    id: "branch_rewa",
    city: "Rewa",
    state: "Madhya Pradesh",
    address: "Saman Road, Rewa, Madhya Pradesh - 486001",
    pinCode: "486001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; building/shop number pending verification.",
  },
  {
    id: "branch_sehore",
    city: "Sehore",
    state: "Madhya Pradesh",
    address: "Station Road, Sehore, Madhya Pradesh - 466001",
    pinCode: "466001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; building number pending verification.",
  },
  {
    id: "branch_shivpuri",
    city: "Shivpuri",
    state: "Madhya Pradesh",
    address: "Gandhi Colony, Shivpuri, Madhya Pradesh - 473551",
    pinCode: "473551",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; premise identifier pending verification.",
  },
  {
    id: "branch_vidisha",
    city: "Vidisha",
    state: "Madhya Pradesh",
    address: "Tilak Ward, Vidisha, Madhya Pradesh - 464001",
    pinCode: "464001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; municipal ward suite pending verification.",
  },

  // -------------------------------------------------------------------------
  // 4. RAJASTHAN REGIONAL NETWORK (PENDING VERIFICATION)
  // -------------------------------------------------------------------------
  {
    id: "branch_jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    address: "Mansarovar, Jaipur, Rajasthan - 302020",
    pinCode: "302020",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; sector and building number pending verification.",
  },
  {
    id: "branch_udaipur",
    city: "Udaipur",
    state: "Rajasthan",
    address: "Hiran Magri, Udaipur, Rajasthan - 313001",
    pinCode: "313001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; sector and plot number pending verification.",
  },
  {
    id: "branch_bharatpur",
    city: "Bharatpur",
    state: "Rajasthan",
    address: "Kumher Gate, Bharatpur, Rajasthan - 321001",
    pinCode: "321001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; commercial premise pending verification.",
  },
  {
    id: "branch_banswara",
    city: "Banswara",
    state: "Rajasthan",
    address: "Dahod Road, Banswara, Rajasthan - 327001",
    pinCode: "327001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; office suite pending verification.",
  },
  {
    id: "branch_karauli",
    city: "Karauli",
    state: "Rajasthan",
    address: "Hindaun Road, Karauli, Rajasthan - 322241",
    pinCode: "322241",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; premise number pending verification.",
  },
  {
    id: "branch_dholpur",
    city: "Dholpur",
    state: "Rajasthan",
    address: "Bari Road, Dholpur, Rajasthan - 328001",
    pinCode: "328001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; premise number pending verification.",
  },
  {
    id: "branch_sawaimadhopur",
    city: "Sawai Madhopur",
    state: "Rajasthan",
    address: "Ranthambore Road, Sawai Madhopur, Rajasthan - 322001",
    pinCode: "322001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; commercial premise number pending verification.",
  },

  // -------------------------------------------------------------------------
  // 5. UTTAR PRADESH REGIONAL NETWORK (PENDING VERIFICATION)
  // -------------------------------------------------------------------------
  {
    id: "branch_agra",
    city: "Agra",
    state: "Uttar Pradesh",
    address: "Sikandra, Agra, Uttar Pradesh - 282007",
    pinCode: "282007",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; premise details pending verification.",
  },
  {
    id: "branch_mathura",
    city: "Mathura",
    state: "Uttar Pradesh",
    address: "Krishna Nagar, Mathura, Uttar Pradesh - 281001",
    pinCode: "281001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; building number pending verification.",
  },

  // -------------------------------------------------------------------------
  // 6. MAHARASHTRA REGIONAL NETWORK (PENDING VERIFICATION)
  // -------------------------------------------------------------------------
  {
    id: "branch_mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Nariman Point, Opposite Air India Building, Mumbai, Maharashtra - 400021",
    pinCode: "400021",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; landmark reference; commercial tower and suite pending verification.",
  },
  {
    id: "branch_nagpur",
    city: "Nagpur",
    state: "Maharashtra",
    address: "Civil Lines, Nagpur, Maharashtra - 440001",
    pinCode: "440001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "Historical directory entry; building number pending verification.",
  },

  // -------------------------------------------------------------------------
  // 7. HARYANA REGIONAL NETWORK (PENDING VERIFICATION)
  // -------------------------------------------------------------------------
  {
    id: "branch_gurugram",
    city: "Gurugram",
    state: "Haryana",
    address: "Udyog Vihar Gurugram, Haryana - 122001",
    pinCode: "122001",
    status: "PENDING_VERIFICATION",
    tier: "PARTNER_NETWORK",
    notes: "PIN discrepancy note: Udyog Vihar is typically PIN 122016 (122001 is Old Gurgaon GPO). Premise Phase pending verification.",
  },
];

/**
 * Filter branch records by state and search query (city, state, address, or PIN code)
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
    const notesMatch = branch.notes ? branch.notes.toLowerCase().includes(query) : false;

    return cityMatch || stateMatch || addressMatch || pinMatch || notesMatch;
  });
}

/**
 * Returns unique states present in the dataset with their respective counts,
 * sorted by count descending for optimal navigational ergonomics.
 */
export function getStateCounts(
  branches: BranchLocation[]
): { state: string; count: number }[] {
  const counts: Record<string, number> = {};

  for (const b of branches) {
    counts[b.state] = (counts[b.state] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([state, count]) => ({
      state,
      count,
    }));
}
