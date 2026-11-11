/**
 * Niventra Capital Advisory — Centralized Typed API Client
 *
 * Provides a unified, type-safe interface for all platform communications.
 * Supports progressive migration to the standalone NestJS API via
 * `NEXT_PUBLIC_API_BASE_URL` while defaulting safely to Next.js Route Handlers.
 */

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  error?: string;
  status: number;
}

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

// -----------------------------------------------------------------------------
// SHARED DOMAIN TYPES
// -----------------------------------------------------------------------------

export type UserRole = "PUBLIC" | "INVESTOR" | "STAFF" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  investor_category?: string | null;
  notify_consultations?: number;
  notify_disclosures?: number;
  notify_grievances?: number;
  status?: string;
  created_at?: string;
}

export interface NotificationPreferences {
  notifyConsultations: boolean;
  notifyDisclosures: boolean;
  notifyGrievances: boolean;
}

export interface ProjectDocumentMeta {
  name: string;
  category: string;
  size: number;
  uploadedAt?: string;
  status?: string;
}

export interface ProjectApplicationItem {
  id: string;
  reference_number: string;
  applicant_name: string;
  organization_name: string;
  email: string;
  phone: string;
  role: string;
  website?: string | null;
  project_name: string;
  category: string;
  address?: string;
  city: string;
  state: string;
  pin_code: string;
  land_status?: string;
  stage: string;
  description?: string;
  total_cost: number;
  funding_requested: number;
  promoter_contribution: number | null;
  use_of_funds?: string;
  expected_timeline?: string;
  existing_loans?: string | null;
  documents?: ProjectDocumentMeta[] | string;
  status: string;
  internal_notes: string | null;
  decline_reason: string | null;
  info_requested: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectStatusHistoryItem {
  id: string;
  previous_status: string | null;
  new_status: string;
  changed_by: string;
  change_note: string | null;
  created_at: string;
}

export interface EnquiryItem {
  id: string;
  user_id?: string | null;
  full_name?: string;
  email?: string;
  phone_number?: string;
  category: string;
  capital_range: string;
  message: string | null;
  status: string;
  internal_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface GrievanceItem {
  id: string;
  complainant_name?: string;
  email?: string;
  phone?: string;
  transaction_ref?: string | null;
  subject: string;
  description?: string;
  status: string;
  resolution_notes?: string | null;
  sla_deadline: string;
  created_at: string;
  updated_at?: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  indicative_yield: string;
  tenor: string;
  min_investment: string;
  security_type: string;
  status: string;
  summary?: string;
  description?: string;
  risks_summary?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  doc_type: string;
  file_size: number;
  mime_type?: string;
  version: string;
  is_public: number;
  status: string;
  created_at?: string;
}

export interface InvestmentItem {
  id: string;
  user_id: string;
  product_id: string | null;
  product_title: string;
  product_slug?: string;
  security_type?: string;
  principal_amount: number;
  interest_rate_pa: number;
  tenor_months: number;
  payout_frequency: string;
  start_date: string;
  maturity_date: string;
  accrued_interest: number;
  interest_paid: number;
  pending_interest: number;
  next_payout_date: string | null;
  status: string;
  is_demo: number;
  created_at: string;
}

export interface InvestmentSummary {
  totalPrincipal: number;
  activeCount: number;
  accruedInterest: number;
  interestPaid: number;
  pendingInterest: number;
  nextPayoutDate: string | null;
  currency: string;
}

export interface LedgerTransactionItem {
  id: string;
  transaction_type: string;
  amount: number;
  status: string;
  payment_reference: string;
  effective_date: string;
  is_demo: number;
}

export interface KycRecordItem {
  id: string;
  pan_number_masked: string;
  id_type: string;
  id_number_masked: string;
  status: string;
  verified_at: string | null;
  rejection_reason: string | null;
  dpdp_consent: number;
}

export interface AuditLogItem {
  id: string;
  actor_email: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: string | null;
  ip_address: string | null;
  status: string;
  created_at: string;
}

// -----------------------------------------------------------------------------
// BASE URL RESOLUTION & HTTP TRANSPORT
// -----------------------------------------------------------------------------

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const CSRF_BOOTSTRAP_EXEMPT_ENDPOINTS = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]);

let inMemoryCsrfToken: string | null = null;

export function setCsrfToken(token: string | null | undefined): void {
  inMemoryCsrfToken = token && typeof token === "string" ? token : null;
}

export function clearCsrfToken(): void {
  inMemoryCsrfToken = null;
}

export function getInMemoryCsrfToken(): string | null {
  return inMemoryCsrfToken;
}

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "";
  return configured.replace(/\/+$/, "");
}

export function resolveApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return endpoint;
  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

async function refreshCsrfTokenIfCrossOrigin(): Promise<string | null> {
  if (!getApiBaseUrl()) return null;
  try {
    const res = await fetch(resolveApiUrl("/api/auth/csrf"), {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = (await res.json().catch(() => null)) as { csrfToken?: string | null } | null;
      if (data?.csrfToken) {
        inMemoryCsrfToken = data.csrfToken;
        return data.csrfToken;
      }
    }
  } catch {
    // Non-blocking fallback when backend gateway is unreachable
  }
  return null;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isCsrfRetry = false
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const method = (options.method || "GET").toUpperCase();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (STATE_CHANGING_METHODS.has(method) && inMemoryCsrfToken && !headers["X-CSRF-Token"]) {
    headers["X-CSRF-Token"] = inMemoryCsrfToken;
  }

  const response = await fetch(resolveApiUrl(endpoint), {
    ...options,
    headers,
    credentials: baseUrl ? "include" : "same-origin",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (data && typeof data === "object" && "csrfToken" in data) {
    setCsrfToken((data as { csrfToken?: string | null }).csrfToken ?? null);
  }

  if (
    !response.ok &&
    response.status === 403 &&
    !isCsrfRetry &&
    baseUrl &&
    STATE_CHANGING_METHODS.has(method) &&
    !CSRF_BOOTSTRAP_EXEMPT_ENDPOINTS.has(endpoint.split("?")[0].replace(/\/+$/, "")) &&
    typeof (data?.error || data?.message) === "string" &&
    String(data?.error || data?.message).toLowerCase().includes("csrf")
  ) {
    const refreshed = await refreshCsrfTokenIfCrossOrigin();
    if (refreshed) {
      return request<T>(endpoint, options, true);
    }
  }

  if (!response.ok) {
    const rawMsg = data?.error || data?.message;
    const errorMessage = Array.isArray(rawMsg)
      ? rawMsg.join(", ")
      : rawMsg || `Request failed with status ${response.status}`;
    throw new ApiClientError(errorMessage, response.status, data);
  }

  return data as T;
}

// -----------------------------------------------------------------------------
// DOMAIN-SPECIFIC API CLIENT CONTRACTS
// -----------------------------------------------------------------------------

export const apiClient = {
  // 1. Authentication
  auth: {
    csrf: () =>
      request<{ csrfToken: string | null }>("/api/auth/csrf", { method: "GET" }),

    login: (body: { email: string; password: string }) =>
      request<{ success: boolean; user: AuthUser; csrfToken?: string | null }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify(body) }
      ),

    register: (body: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      investorCategory?: string;
    }) =>
      request<{ success: boolean; user: AuthUser; csrfToken?: string | null }>(
        "/api/auth/register",
        { method: "POST", body: JSON.stringify(body) }
      ),

    me: () =>
      request<{ authenticated: boolean; user: AuthUser | null; csrfToken?: string | null }>(
        "/api/auth/me",
        { method: "GET" }
      ),

    logout: async () => {
      try {
        return await request<{ success: boolean; message: string }>("/api/auth/logout", {
          method: "POST",
        });
      } finally {
        clearCsrfToken();
      }
    },

    forgotPassword: (body: { email: string }) =>
      request<{ success: boolean; message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    resetPassword: (body: { token: string; newPassword: string }) =>
      request<{ success: boolean; message: string }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  // 2. Account, Profile & Preferences
  account: {
    updateProfile: (body: { name: string; phone?: string; investorCategory?: string }) =>
      request<{ success: boolean; message: string; user: AuthUser }>("/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),

    getPreferences: () =>
      request<{ success: boolean; preferences: NotificationPreferences }>("/api/account/preferences", {
        method: "GET",
      }),

    updatePreferences: (body: Partial<NotificationPreferences>) =>
      request<{ success: boolean; message: string; preferences: NotificationPreferences }>(
        "/api/account/preferences",
        {
          method: "PATCH",
          body: JSON.stringify(body),
        }
      ),

    changePassword: async (body: { currentPassword: string; newPassword: string }) => {
      const res = await request<{ success: boolean; message: string; requiresReauth?: boolean }>(
        "/api/account/change-password",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      if (res.requiresReauth) {
        clearCsrfToken();
      }
      return res;
    },

    requestDeletion: async (body: {
      fullName: string;
      email: string;
      phone: string;
      reason?: string;
      password?: string;
    }) => {
      const res = await request<{ success: boolean; requestId: string; slaDays: string; message: string }>(
        "/api/account/delete",
        { method: "POST", body: JSON.stringify(body) }
      );
      clearCsrfToken();
      return res;
    },
  },

  // 3. Real Estate Project Funding
  projects: {
    submit: (formData: Record<string, unknown>) =>
      request<{ success: boolean; referenceNumber: string; applicationId: string; message: string }>(
        "/api/project-funding",
        { method: "POST", body: JSON.stringify(formData) }
      ),

    list: (params?: { status?: string; category?: string; state?: string; q?: string }) => {
      const search = new URLSearchParams();
      if (params?.status) search.set("status", params.status);
      if (params?.category) search.set("category", params.category);
      if (params?.state) search.set("state", params.state);
      if (params?.q) search.set("q", params.q);
      const queryStr = search.toString();
      return request<{
        applications: ProjectApplicationItem[];
        totalCount: number;
        statusCounts: { status: string; count: number }[];
      }>(
        `/api/project-funding${queryStr ? `?${queryStr}` : ""}`,
        { method: "GET" }
      );
    },

    getById: (id: string) =>
      request<{ application: ProjectApplicationItem; history: ProjectStatusHistoryItem[] }>(
        `/api/project-funding/${id}`,
        { method: "GET" }
      ),

    updateStatus: (
      id: string,
      body: {
        status?: string;
        internalNotes?: string;
        declineReason?: string;
        infoRequested?: string;
        changeNote?: string;
      }
    ) =>
      request<{ success: boolean; message: string; status: string }>(
        `/api/project-funding/${id}`,
        { method: "PATCH", body: JSON.stringify(body) }
      ),
  },

  // 4. Consultation Enquiries & CRM
  enquiries: {
    submit: (body: {
      fullName: string;
      email: string;
      phoneNumber: string;
      category?: string;
      capitalRange?: string;
      message?: string;
      consent: boolean;
      website_hp?: string;
    }) =>
      request<{ success: boolean; referenceId: string; message: string }>("/api/enquiries", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    list: (status?: string) => {
      const query = status ? `?status=${encodeURIComponent(status)}` : "";
      return request<{ enquiries: EnquiryItem[] }>(`/api/enquiries${query}`, { method: "GET" });
    },

    update: (id: string, body: { status?: string; assignedTo?: string | null; internalNotes?: string }) =>
      request<{ success: boolean; message: string }>(`/api/enquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },

  // 5. Investments, Ledger & Products
  investments: {
    list: (params?: { userId?: string; status?: string }) => {
      const search = new URLSearchParams();
      if (params?.userId) search.set("userId", params.userId);
      if (params?.status) search.set("status", params.status);
      const queryStr = search.toString();
      return request<{ investments: InvestmentItem[]; summary: InvestmentSummary }>(
        `/api/investments${queryStr ? `?${queryStr}` : ""}`,
        { method: "GET" }
      );
    },

    getById: (id: string) =>
      request<{
        success: boolean;
        investment: InvestmentItem;
        transactions: LedgerTransactionItem[];
      }>(`/api/investments/${id}`, { method: "GET" }),
  },

  products: {
    list: () =>
      request<{ products: ProductItem[] }>("/api/products", { method: "GET" }),
  },

  // 6. KYC Verification
  kyc: {
    get: (userId?: string) => {
      const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
      return request<{ success: boolean; kyc: KycRecordItem | null; status: string }>(
        `/api/kyc${query}`,
        { method: "GET" }
      );
    },

    submit: (body: { panNumber: string; idType: string; idNumber: string; consent: boolean }) =>
      request<{ success: boolean; message: string; status: string }>("/api/kyc", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    updateStatus: (body: { userId: string; status: string; rejectionReason?: string }) =>
      request<{ success: boolean; message: string }>("/api/kyc", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },

  // 7. Grievance Redressal
  grievances: {
    submit: (body: {
      complainantName: string;
      email: string;
      phone: string;
      transactionRef?: string;
      subject: string;
      description: string;
    }) =>
      request<{ success: boolean; ticketId: string; slaDeadline: string; message: string }>(
        "/api/grievances",
        { method: "POST", body: JSON.stringify(body) }
      ),

    list: (status?: string) => {
      const query = status ? `?status=${encodeURIComponent(status)}` : "";
      return request<{ grievances: GrievanceItem[] }>(`/api/grievances${query}`, { method: "GET" });
    },

    update: (id: string, body: { status?: string; assignedTo?: string | null; resolutionNotes?: string }) =>
      request<{ success: boolean; message: string }>(`/api/grievances/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },

  // 8. Documents
  documents: {
    list: () =>
      request<{ documents: DocumentItem[] }>("/api/documents", { method: "GET" }),

    getDownloadUrl: (id: string) => resolveApiUrl(`/api/documents/${id}/download`),
  },

  // 9. Institutional Chatbot
  chat: {
    query: (message: string) =>
      request<{
        success: boolean;
        answer: string;
        citations: { title: string; url: string }[];
        isConfident: boolean;
        needsAdvisoryEscalation: boolean;
      }>(
        "/api/chat",
        { method: "POST", body: JSON.stringify({ message }) }
      ),
  },

  // 10. Audit Logs
  auditLogs: {
    list: () =>
      request<{ logs: AuditLogItem[] }>("/api/audit-logs", { method: "GET" }),
  },
};
