export type BranchVerificationStatus =
  | "VERIFIED"
  | "PENDING_CONFIRMATION"
  | "PENDING_VERIFICATION"
  | "UNVERIFIED";

export type BranchTier = "HEAD_OFFICE" | "REGIONAL_DESK" | "PARTNER_NETWORK";

export interface BranchLocation {
  id: string;
  city: string;
  state: string;
  address: string;
  pinCode?: string;
  isHeadOffice?: boolean;
  status: BranchVerificationStatus;
  tier: BranchTier;
  phone?: string;
  email?: string;
  openingHours?: string;
  mapUrl?: string;
  notes?: string;
}

export interface BranchFilterState {
  searchQuery: string;
  selectedState: string;
}
