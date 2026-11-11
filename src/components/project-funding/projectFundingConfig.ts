export interface DocumentMeta {
  name: string;
  category: string;
  size: number;
}

export type ProjectFundingFormState = {
  applicantName: string;
  organizationName: string;
  email: string;
  phone: string;
  role: string;
  website: string;
  consentGiven: boolean;
  projectName: string;
  category: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  landStatus: string;
  stage: string;
  description: string;
  totalCost: string;
  fundingRequested: string;
  promoterContribution: string;
  useOfFunds: string;
  expectedTimeline: string;
  existingLoans: string;
  documents: DocumentMeta[];
  declarationConfirmed: boolean;
};

export const INITIAL_PROJECT_FUNDING_FORM: ProjectFundingFormState = {
  applicantName: "",
  organizationName: "",
  email: "",
  phone: "",
  role: "",
  website: "",
  consentGiven: true,
  projectName: "",
  category: "RESIDENTIAL",
  address: "",
  city: "",
  state: "Madhya Pradesh",
  pinCode: "",
  landStatus: "Freehold Ownership",
  stage: "UNDER_CONSTRUCTION",
  description: "",
  totalCost: "",
  fundingRequested: "",
  promoterContribution: "",
  useOfFunds: "Construction finance and working capital",
  expectedTimeline: "24–36 Months",
  existingLoans: "None",
  documents: [],
  declarationConfirmed: false,
};

export const SAMPLE_PROJECT_DOCUMENTS: Record<string, { fileName: string; defaultBytes: number }> = {
  "Company Profile": { fileName: "Developer_Corporate_Profile_2026.pdf", defaultBytes: 1_850_000 },
  "Project Overview": { fileName: "Project_Information_Memorandum.pdf", defaultBytes: 2_600_000 },
  "Land Title / JDA": { fileName: "Registered_Development_Agreement_Copy.pdf", defaultBytes: 2_150_000 },
  "Approvals & RERA": { fileName: "RERA_Registration_And_Sanctions.pdf", defaultBytes: 1_450_000 },
  "Cost & Cash Flows": { fileName: "Estimated_Project_Cashflows_V2.xlsx", defaultBytes: 1_120_000 },
};

export function validateProjectFundingStep1(formData: ProjectFundingFormState): string | null {
  if (!formData.applicantName.trim()) return "Full name of the applicant is required.";
  if (!formData.organizationName.trim()) return "Developer / Organization name is required.";
  if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return "A valid official business email is required.";
  }
  if (!formData.phone.trim() || formData.phone.length < 8) return "A valid contact phone number is required.";
  if (!formData.role.trim()) return "Applicant designation or role is required.";
  if (!formData.consentGiven) return "Consent to process submitted information is required.";
  return null;
}

export function validateProjectFundingStep2(formData: ProjectFundingFormState): string | null {
  if (!formData.projectName.trim()) return "Project name is required.";
  if (!formData.address.trim()) return "Project location address is required.";
  if (!formData.city.trim()) return "City is required.";
  if (!formData.state.trim()) return "State is required.";
  if (!formData.pinCode.trim() || !/^\d{6}$/.test(formData.pinCode)) return "Valid 6-digit postal PIN code is required.";
  if (!formData.description.trim() || formData.description.length < 20) {
    return "Please provide a concise project description (minimum 20 characters).";
  }
  const cost = Number(formData.totalCost);
  if (isNaN(cost) || cost <= 0) return "Total project cost must be a valid positive amount (in ₹ Lakhs).";
  const funding = Number(formData.fundingRequested);
  if (isNaN(funding) || funding <= 0) return "Funding requested must be a valid positive amount (in ₹ Lakhs).";
  if (funding > cost) return "Funding requested cannot exceed the total project cost.";
  if (!formData.useOfFunds.trim()) return "Proposed use of funds is required.";
  if (!formData.expectedTimeline.trim()) return "Expected project timeline is required.";
  return null;
}
