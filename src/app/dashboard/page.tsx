"use client";

import React, { useState, useEffect, useMemo } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Download,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Settings,
  Clock,
  Calculator as CalcIcon,
  Info,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface EnquiryItem {
  id: string;
  category: string;
  capital_range: string;
  message: string;
  status: string;
  created_at: string;
}

interface DocumentItem {
  id: string;
  title: string;
  doc_type: string;
  file_size: number;
  version: string;
  is_public: number;
  status: string;
}

interface GrievanceItem {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  sla_deadline: string;
}

interface InvestmentItem {
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

interface InvestmentSummary {
  totalPrincipal: number;
  activeCount: number;
  accruedInterest: number;
  interestPaid: number;
  pendingInterest: number;
  nextPayoutDate: string | null;
  currency: string;
}

interface KycRecord {
  id: string;
  pan_number_masked: string;
  id_type: string;
  id_number_masked: string;
  status: string;
  verified_at: string | null;
  rejection_reason: string | null;
  dpdp_consent: number;
}

interface LedgerTxn {
  id: string;
  transaction_type: string;
  amount: number;
  status: string;
  payment_reference: string;
  effective_date: string;
  is_demo: number;
}

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [invSummary, setInvSummary] = useState<InvestmentSummary | null>(null);
  const [kycRecord, setKycRecord] = useState<KycRecord | null>(null);
  const [selectedInvForLedger, setSelectedInvForLedger] = useState<string | null>(null);
  const [ledgerTxns, setLedgerTxns] = useState<LedgerTxn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  type TabType = "overview" | "investments" | "calculator" | "kyc" | "enquiries" | "documents" | "grievances";
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Interactive Calculator State inside Dashboard
  const [calcPrincipal, setCalcPrincipal] = useState<number>(1000000);
  const [calcRate, setCalcRate] = useState<number>(14.5);
  const [calcTenor, setCalcTenor] = useState<number>(36);
  const [calcFreq, setCalcFreq] = useState<string>("QUARTERLY");

  // Format INR helper
  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);

        // Fetch user investments & summary
        const invRes = await fetch("/api/investments");
        if (invRes.ok) {
          const invData = await invRes.json();
          setInvestments(invData.investments || []);
          setInvSummary(invData.summary || null);
        }

        // Fetch KYC record
        const kycRes = await fetch("/api/kyc");
        if (kycRes.ok) {
          const kData = await kycRes.json();
          setKycRecord(kData.kyc || null);
        }

        // Fetch user enquiries
        const enqRes = await fetch("/api/enquiries");
        if (enqRes.ok) {
          const enqData = await enqRes.json();
          setEnquiries(enqData.enquiries || []);
        }

        // Fetch documents
        const docRes = await fetch("/api/documents");
        if (docRes.ok) {
          const docData = await docRes.json();
          setDocuments(docData.documents || []);
        }

        // Fetch grievances
        const grvRes = await fetch("/api/grievances");
        if (grvRes.ok) {
          const grvData = await grvRes.json();
          setGrievances(grvData.grievances || []);
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  const loadLedger = async (invId: string) => {
    setSelectedInvForLedger(invId);
    try {
      const res = await fetch(`/api/investments/${invId}`);
      if (res.ok) {
        const data = await res.json();
        setLedgerTxns(data.transactions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
      case "SUBMITTED":
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Received</span>;
      case "IN_REVIEW":
      case "ACKNOWLEDGED":
      case "UNDER_INVESTIGATION":
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-amber-50 text-amber-800 border border-amber-200">In Review</span>;
      case "CONTACTED":
      case "QUALIFIED":
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Consultation Scheduled</span>;
      case "FOLLOW_UP":
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Follow-Up Required</span>;
      case "RESOLVED":
      case "CLOSED":
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Completed</span>;
      case "ACTIVE":
        return <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">ACTIVE HOLDING</span>;
      case "MATURED":
        return <span className="px-2.5 py-0.5 rounded-full text-[0.6875rem] font-bold bg-gray-100 text-gray-800 border border-gray-300">MATURED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  // Indicative Calculator Math (Simple Interest Debenture Standard)
  const calcOutput = useMemo(() => {
    const years = calcTenor / 12;
    const grossTotalInterest = calcPrincipal * (calcRate / 100) * years;
    const estTdsWithholding = grossTotalInterest * 0.10; // 10% standard Section 193/194A TDS
    const netTotalInterest = grossTotalInterest - estTdsWithholding;
    const maturityAmount = calcPrincipal + grossTotalInterest;

    let periodCount = 1;
    let periodName = "Per Year";
    if (calcFreq === "MONTHLY") {
      periodCount = calcTenor;
      periodName = "Per Month";
    } else if (calcFreq === "QUARTERLY") {
      periodCount = (calcTenor / 12) * 4;
      periodName = "Per Quarter";
    } else if (calcFreq === "SEMI_ANNUAL") {
      periodCount = (calcTenor / 12) * 2;
      periodName = "Every 6 Months";
    } else if (calcFreq === "CUMULATIVE") {
      periodCount = 1;
      periodName = "At Maturity";
    }

    const grossPeriodic = grossTotalInterest / periodCount;

    return {
      grossTotalInterest,
      estTdsWithholding,
      netTotalInterest,
      maturityAmount,
      grossPeriodic,
      periodName,
      periodCount,
    };
  }, [calcPrincipal, calcRate, calcTenor, calcFreq]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#9A7B2C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#5C5C5C] font-mono">Loading Institutional Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-[rgba(26,26,26,0.08)] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NextLink href="/" className="flex items-center gap-2.5">
              <span className="font-heading text-lg font-bold tracking-tight text-[#1A1A1A]">NIVENTRA</span>
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[#9A7B2C] border-l border-[rgba(26,26,26,0.15)] pl-2.5">
                Client Portal
              </span>
            </NextLink>

            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-[#5C5C5C]">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "overview" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("investments")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "investments" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Holdings & Ledgers ({investments.length})
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "calculator" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Calculator
              </button>
              <button
                onClick={() => setActiveTab("kyc")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "kyc" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                KYC & Compliance
              </button>
              <button
                onClick={() => setActiveTab("enquiries")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "enquiries" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Consultations ({enquiries.length})
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "documents" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Documents ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab("grievances")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "grievances" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Grievances ({grievances.length})
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-[#1A1A1A]">{user?.name}</span>
              <span className="text-[0.625rem] text-[#8A8A8A] font-mono">{user?.role} • {user?.email}</span>
            </div>

            <NextLink
              href="/dashboard/settings/"
              className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors p-2 rounded hover:bg-[rgba(26,26,26,0.04)] min-h-[44px]"
              title="Account Settings"
            >
              <Settings className="w-4 h-4 text-[#9A7B2C]" />
              <span className="hidden sm:inline">Settings</span>
            </NextLink>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50 min-h-[44px]"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pt-2.5 pb-1 border-t border-[rgba(26,26,26,0.06)] text-xs text-[#5C5C5C]">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === "overview" ? "bg-[#1A1A1A] text-white" : ""}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("investments")}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === "investments" ? "bg-[#1A1A1A] text-white" : ""}`}
          >
            Holdings ({investments.length})
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === "calculator" ? "bg-[#1A1A1A] text-white" : ""}`}
          >
            Calculator
          </button>
          <button
            onClick={() => setActiveTab("kyc")}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === "kyc" ? "bg-[#1A1A1A] text-white" : ""}`}
          >
            KYC
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === "enquiries" ? "bg-[#1A1A1A] text-white" : ""}`}
          >
            Consultations
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#9A7B2C]">
                  Institutional Client Workspace
                </span>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  DEMO FIXTURE ENVIRONMENT
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mt-1">
                Welcome back, {user?.name}
              </h1>
              <p className="font-body text-xs text-[#5C5C5C] mt-2 max-w-2xl leading-relaxed">
                Direct institutional visibility into your secured debenture allocations, contractual coupon payouts, compliance documentation, and statutory grievance records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NextLink
                href="/calculator/"
                className="px-4 py-2 rounded text-xs font-semibold bg-white border border-[rgba(26,26,26,0.15)] text-[#1A1A1A] hover:bg-[#FAFAF7] transition-colors inline-flex items-center gap-2"
              >
                <CalcIcon className="w-3.5 h-3.5 text-[#9A7B2C]" />
                <span>Yield Calculator</span>
              </NextLink>
              <NextLink
                href="/contact/"
                className="px-4 py-2 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] transition-colors inline-flex items-center gap-2"
              >
                <span>New Advisory Request</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NextLink>
            </div>
          </div>
        </div>

        {/* Factual Institutional Guardrail Callout */}
        <div className="bg-[rgba(154,123,44,0.05)] border border-[rgba(154,123,44,0.2)] rounded-lg p-4 sm:p-5 flex items-start gap-3.5 text-xs text-[#1A1A1A]">
          <Shield className="w-5 h-5 shrink-0 text-[#9A7B2C] mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-xs text-[#1A1A1A] block">
              Fiduciary Transparency & Regulatory Compliance Standards
            </span>
            <p className="text-[0.75rem] text-[#5C5C5C] leading-relaxed">
              In strict accordance with the Companies Act 2013 and SEBI Private Placement norms, debenture holdings are non-transferable instruments secured by legal charge filings (ROC Form CHG-9). Interest calculations shown reflect contractual simple-interest coupons before statutory withholding tax (TDS under Section 193/194A of the Income Tax Act).
            </p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 4 Primary Portfolio Accounting Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Total Principal Invested
                  </span>
                  <span className="px-1.5 py-0.5 text-[0.5625rem] font-mono font-bold bg-amber-50 text-amber-700 rounded">DEMO</span>
                </div>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {invSummary ? formatINR(invSummary.totalPrincipal) : "₹0"}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  Across {invSummary?.activeCount || 0} active debenture tranches
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Interest Paid to Date
                  </span>
                  <span className="px-1.5 py-0.5 text-[0.5625rem] font-mono font-bold bg-emerald-50 text-emerald-700 rounded">DISBURSED</span>
                </div>
                <div className="text-2xl font-bold font-heading text-emerald-700 mt-2">
                  {invSummary ? formatINR(invSummary.interestPaid) : "₹0"}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  Contractual coupon payments processed
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Accrued Interest (YTD)
                  </span>
                  <span className="px-1.5 py-0.5 text-[0.5625rem] font-mono font-bold bg-blue-50 text-blue-700 rounded">ACCRUED</span>
                </div>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {invSummary ? formatINR(invSummary.accruedInterest) : "₹0"}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  Pending next payout: {invSummary ? formatINR(invSummary.pendingInterest) : "₹0"}
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Next Scheduled Payout
                  </span>
                  <Clock className="w-3.5 h-3.5 text-[#9A7B2C]" />
                </div>
                <div className="text-xl font-bold font-heading text-[#9A7B2C] mt-2">
                  {invSummary?.nextPayoutDate ? new Date(invSummary.nextPayoutDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "None Scheduled"}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  Quarterly/Monthly direct bank credit
                </div>
              </div>
            </div>

            {/* Holdings Card in Overview */}
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
                <div>
                  <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    Active Secured Debenture Holdings
                  </h2>
                  <p className="text-xs text-[#5C5C5C] mt-0.5">
                    Individual bond series allocated under private placement offer letters.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("investments")}
                  className="text-xs text-[#9A7B2C] font-semibold hover:underline"
                >
                  View Full Ledgers
                </button>
              </div>

              {investments.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8A8A8A] space-y-2">
                  <p>No active debenture allocations associated with this investor profile.</p>
                  <p className="text-[0.6875rem] text-[#5C5C5C]">
                    All debenture investments require compliance onboarding and executed Form PAS-4 documentation.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investments.map((inv) => (
                    <div key={inv.id} className="p-4 rounded border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-[0.6875rem] font-bold text-[#1A1A1A] block">{inv.id}</span>
                          <span className="text-xs font-bold text-[#1A1A1A] block mt-0.5">{inv.product_title}</span>
                        </div>
                        {getStatusBadge(inv.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[rgba(26,26,26,0.06)]">
                        <div>
                          <span className="text-[0.625rem] text-[#8A8A8A] block">Allocated Principal</span>
                          <span className="font-bold text-[#1A1A1A]">{formatINR(inv.principal_amount)}</span>
                        </div>
                        <div>
                          <span className="text-[0.625rem] text-[#8A8A8A] block">Contractual Rate</span>
                          <span className="font-bold text-[#9A7B2C]">{inv.interest_rate_pa}% p.a.</span>
                        </div>
                        <div>
                          <span className="text-[0.625rem] text-[#8A8A8A] block">Tenor & Frequency</span>
                          <span className="text-[#5C5C5C]">{inv.tenor_months} Mo • {inv.payout_frequency}</span>
                        </div>
                        <div>
                          <span className="text-[0.625rem] text-[#8A8A8A] block">Maturity Date</span>
                          <span className="text-[#5C5C5C]">{new Date(inv.maturity_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[rgba(26,26,26,0.06)] flex items-center justify-between text-xs">
                        <span className="text-[0.6875rem] text-emerald-700 font-semibold">
                          Paid: {formatINR(inv.interest_paid)}
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab("investments");
                            loadLedger(inv.id);
                          }}
                          className="text-[0.6875rem] font-semibold text-[#1A1A1A] hover:text-[#9A7B2C] underline"
                        >
                          View Transactions &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Enquiries & Document Centre Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Consultations */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
                  <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    My Consultation Inquiries
                  </h2>
                  <button
                    onClick={() => setActiveTab("enquiries")}
                    className="text-xs text-[#9A7B2C] font-semibold hover:underline"
                  >
                    View All ({enquiries.length})
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <p className="text-xs text-[#8A8A8A] py-6 text-center">
                    No consultation requests submitted yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {enquiries.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[0.6875rem] font-bold text-[#1A1A1A]">{item.id}</span>
                          {getStatusBadge(item.status)}
                        </div>
                        <div className="text-xs font-semibold text-[#1A1A1A]">{item.category}</div>
                        <div className="text-[0.6875rem] text-[#5C5C5C]">Capital Range: {item.capital_range}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Document Repository */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
                  <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    Approved Document Centre
                  </h2>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className="text-xs text-[#9A7B2C] font-semibold hover:underline"
                  >
                    View All ({documents.length})
                  </button>
                </div>

                {documents.length === 0 ? (
                  <p className="text-xs text-[#8A8A8A] py-6 text-center">
                    No approved documents available at this time.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {documents.slice(0, 3).map((doc) => (
                      <div key={doc.id} className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-[#1A1A1A]">{doc.title}</div>
                          <div className="text-[0.6875rem] text-[#8A8A8A] font-mono mt-0.5">
                            {doc.doc_type} • v{doc.version} • {formatFileSize(doc.file_size)}
                          </div>
                        </div>
                        <a
                          href={`/api/documents/${doc.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded bg-white border border-[rgba(26,26,26,0.15)] hover:bg-[#1A1A1A] hover:text-white transition-colors"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
              <h2 className="font-heading text-sm font-semibold text-[#1A1A1A] mb-4">
                Compliance & Security Controls
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <NextLink
                  href="/grievance/"
                  className="p-4 rounded border border-[rgba(26,26,26,0.08)] hover:border-[#9A7B2C] transition-colors block"
                >
                  <span className="font-semibold text-[#1A1A1A] block">Lodge Grievance Ticket</span>
                  <span className="text-[0.6875rem] text-[#5C5C5C] mt-1 block">Escalate compliance or service matters under 30-day statutory SLA.</span>
                </NextLink>

                <NextLink
                  href="/regulatory-disclosures/"
                  className="p-4 rounded border border-[rgba(26,26,26,0.08)] hover:border-[#9A7B2C] transition-colors block"
                >
                  <span className="font-semibold text-[#1A1A1A] block">Regulatory Disclosures</span>
                  <span className="text-[0.6875rem] text-[#5C5C5C] mt-1 block">Review statutory disclosures, risk parameters, and ROC compliance.</span>
                </NextLink>

                <NextLink
                  href="/delete-account/"
                  className="p-4 rounded border border-[rgba(26,26,26,0.08)] hover:border-red-300 transition-colors block text-red-900"
                >
                  <span className="font-semibold block">DPDP Account Deletion</span>
                  <span className="text-[0.6875rem] text-[#5C5C5C] mt-1 block">Submit an official data erasure request under the DPDP Act 2023.</span>
                </NextLink>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HOLDINGS & INVESTMENTS LEDGERS */}
        {activeTab === "investments" && (
          <div className="space-y-6">
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                      Secured Debenture Holdings
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      DEMO ALLOCATIONS
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5C5C] mt-1">
                    Contractual terms, accrued interest calculations, and historical coupon transaction ledgers.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[0.6875rem] text-[#8A8A8A] block">Active Portfolio Value</span>
                  <span className="text-lg font-bold font-heading text-[#1A1A1A]">
                    {invSummary ? formatINR(invSummary.totalPrincipal) : "₹0"}
                  </span>
                </div>
              </div>

              {investments.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#8A8A8A]">
                  No debenture holdings found for this account.
                </div>
              ) : (
                <div className="divide-y divide-[rgba(26,26,26,0.08)]">
                  {investments.map((inv) => (
                    <div key={inv.id} className="py-6 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-[#1A1A1A] bg-[#FAFAF7] px-2.5 py-1 rounded border border-[rgba(26,26,26,0.1)]">
                              {inv.id}
                            </span>
                            {getStatusBadge(inv.status)}
                            <span className="text-xs text-[#8A8A8A] font-mono">
                              Allocated: {new Date(inv.start_date).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-heading text-base font-semibold text-[#1A1A1A] mt-1.5">
                            {inv.product_title}
                          </h3>
                          <p className="text-xs text-[#5C5C5C] mt-0.5">
                            Security: First Pari-Passu Charge registered with ROC (Form CHG-9)
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => loadLedger(inv.id)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                              selectedInvForLedger === inv.id
                                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                : "bg-white text-[#1A1A1A] border-[rgba(26,26,26,0.15)] hover:bg-[#FAFAF7]"
                            }`}
                          >
                            {selectedInvForLedger === inv.id ? "Close Transaction Ledger" : "View Transaction Ledger"}
                          </button>
                        </div>
                      </div>

                      {/* 4 Financial Columns */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.06)] text-xs">
                        <div>
                          <span className="text-[0.6875rem] text-[#8A8A8A] block">Principal Invested</span>
                          <span className="text-sm font-bold text-[#1A1A1A]">{formatINR(inv.principal_amount)}</span>
                        </div>
                        <div>
                          <span className="text-[0.6875rem] text-[#8A8A8A] block">Annual Coupon Rate</span>
                          <span className="text-sm font-bold text-[#9A7B2C]">{inv.interest_rate_pa}% p.a.</span>
                          <span className="text-[0.625rem] text-[#5C5C5C] block">({inv.payout_frequency})</span>
                        </div>
                        <div>
                          <span className="text-[0.6875rem] text-[#8A8A8A] block">Interest Actually Paid</span>
                          <span className="text-sm font-bold text-emerald-700">{formatINR(inv.interest_paid)}</span>
                          <span className="text-[0.625rem] text-[#5C5C5C] block">Disbursed to bank</span>
                        </div>
                        <div>
                          <span className="text-[0.6875rem] text-[#8A8A8A] block">Accrued Interest (Total)</span>
                          <span className="text-sm font-bold text-[#1A1A1A]">{formatINR(inv.accrued_interest)}</span>
                          <span className="text-[0.625rem] text-amber-700 block">Pending: {formatINR(inv.pending_interest)}</span>
                        </div>
                      </div>

                      {/* Expandable Transaction Ledger */}
                      {selectedInvForLedger === inv.id && (
                        <div className="mt-4 p-5 rounded-lg border border-[rgba(26,26,26,0.1)] bg-white space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-[rgba(26,26,26,0.08)]">
                            <div>
                              <h4 className="font-heading text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                                Transaction & Disbursement Ledger — {inv.id}
                              </h4>
                              <span className="text-[0.6875rem] text-[#5C5C5C]">
                                Certified record of capital inflow and quarterly coupon disbursements.
                              </span>
                            </div>
                            <span className="text-[0.625rem] font-mono text-[#8A8A8A]">
                              All figures INR (₹)
                            </span>
                          </div>

                          {ledgerTxns.length === 0 ? (
                            <p className="text-xs text-[#8A8A8A] py-4 text-center">Loading transaction ledger...</p>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-[#FAFAF7] text-[#8A8A8A] font-mono text-[0.625rem] uppercase">
                                  <tr>
                                    <th className="py-2.5 px-3">Transaction ID</th>
                                    <th className="py-2.5 px-3">Type</th>
                                    <th className="py-2.5 px-3">Effective Date</th>
                                    <th className="py-2.5 px-3">Reference / UTR</th>
                                    <th className="py-2.5 px-3 text-right">Amount</th>
                                    <th className="py-2.5 px-3 text-center">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[rgba(26,26,26,0.06)] font-mono text-xs">
                                  {ledgerTxns.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-[#FAFAF7]/60">
                                      <td className="py-2.5 px-3 font-semibold text-[#1A1A1A]">{tx.id}</td>
                                      <td className="py-2.5 px-3">
                                        <span className={`px-2 py-0.5 rounded text-[0.625rem] font-bold ${
                                          tx.transaction_type === "PRINCIPAL_ALLOCATION"
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-emerald-50 text-emerald-700"
                                        }`}>
                                          {tx.transaction_type}
                                        </span>
                                      </td>
                                      <td className="py-2.5 px-3 text-[#5C5C5C]">{tx.effective_date}</td>
                                      <td className="py-2.5 px-3 text-[#5C5C5C] text-[0.6875rem]">{tx.payment_reference}</td>
                                      <td className="py-2.5 px-3 text-right font-bold text-[#1A1A1A]">
                                        {formatINR(tx.amount)}
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <span className="px-2 py-0.5 rounded text-[0.625rem] font-bold bg-emerald-50 text-emerald-800">
                                          {tx.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: INDICATIVE CALCULATOR */}
        {activeTab === "calculator" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Illustrative Yield Calculation Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-[0.625rem] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  ILLUSTRATIVE MODEL
                </span>
              </div>
              <p className="text-xs text-[#5C5C5C] mt-1">
                Fiduciary standard: Simple-interest coupon model for corporate debentures. Non-compounded; statutory TDS caveats apply.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <label className="font-semibold text-[#1A1A1A]">Principal Investment Amount (INR)</label>
                    <span className="font-mono font-bold text-sm text-[#9A7B2C]">{formatINR(calcPrincipal)}</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={10000000}
                    step={100000}
                    value={calcPrincipal}
                    onChange={(e) => setCalcPrincipal(Number(e.target.value))}
                    className="w-full accent-[#9A7B2C] cursor-pointer"
                  />
                  <div className="flex gap-2 mt-2.5">
                    {[1000000, 2500000, 5000000, 10000000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setCalcPrincipal(amt)}
                        className={`text-[0.6875rem] px-2.5 py-1 rounded border ${
                          calcPrincipal === amt
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-[#FAFAF7] text-[#5C5C5C] border-[rgba(26,26,26,0.1)] hover:border-[#1A1A1A]"
                        }`}
                      >
                        {amt >= 10000000 ? "₹1 Crore" : `₹${amt / 100000} Lakh`}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <label className="font-semibold text-[#1A1A1A]">Indicative Coupon Rate (% p.a.)</label>
                    <span className="font-mono font-bold text-sm text-[#9A7B2C]">{calcRate.toFixed(1)}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min={12.0}
                    max={16.0}
                    step={0.5}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full accent-[#9A7B2C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[0.625rem] text-[#8A8A8A] font-mono mt-1">
                    <span>12.0% (Senior Debt)</span>
                    <span>14.5% (Secured Debenture)</span>
                    <span>16.0% (Structured Mezzanine)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Investment Tenor</label>
                    <select
                      value={calcTenor}
                      onChange={(e) => setCalcTenor(Number(e.target.value))}
                      className="w-full p-2.5 rounded border border-[rgba(26,26,26,0.15)] bg-white text-xs text-[#1A1A1A] font-medium"
                    >
                      <option value={12}>12 Months (1 Year)</option>
                      <option value={24}>24 Months (2 Years)</option>
                      <option value={36}>36 Months (3 Years)</option>
                      <option value={48}>48 Months (4 Years)</option>
                      <option value={60}>60 Months (5 Years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">Payout Distribution</label>
                    <select
                      value={calcFreq}
                      onChange={(e) => setCalcFreq(e.target.value)}
                      className="w-full p-2.5 rounded border border-[rgba(26,26,26,0.15)] bg-white text-xs text-[#1A1A1A] font-medium"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="SEMI_ANNUAL">Semi-Annual</option>
                      <option value="CUMULATIVE">At Maturity (Cumulative)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Output Summary Card */}
              <div className="p-6 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#9A7B2C] block">
                    Calculated Indicative Return Summary
                  </span>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[rgba(26,26,26,0.08)]">
                    <div>
                      <span className="text-[0.6875rem] text-[#8A8A8A] block">Indicative {calcOutput.periodName}</span>
                      <span className="text-lg font-bold text-[#1A1A1A]">{formatINR(calcOutput.grossPeriodic)}</span>
                    </div>
                    <div>
                      <span className="text-[0.6875rem] text-[#8A8A8A] block">Total Gross Coupon</span>
                      <span className="text-lg font-bold text-[#9A7B2C]">{formatINR(calcOutput.grossTotalInterest)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[rgba(26,26,26,0.06)] text-xs">
                    <div>
                      <span className="text-[0.625rem] text-[#8A8A8A] block">Statutory TDS (10%)</span>
                      <span className="text-[#5C5C5C] font-mono">-{formatINR(calcOutput.estTdsWithholding)}</span>
                    </div>
                    <div>
                      <span className="text-[0.625rem] text-[#8A8A8A] block">Net Projected Interest</span>
                      <span className="font-bold text-emerald-700">{formatINR(calcOutput.netTotalInterest)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(26,26,26,0.08)]">
                    <span className="text-[0.6875rem] text-[#8A8A8A] block">Total Illustrative Payout (Principal + Interest)</span>
                    <span className="text-2xl font-bold font-heading text-[#1A1A1A]">{formatINR(calcOutput.maturityAmount)}</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-amber-50/60 border border-amber-200/50 text-[0.6875rem] text-[#5C5C5C] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <Info className="w-3.5 h-3.5" />
                    <span>Statutory Tax & Risk Caveat</span>
                  </div>
                  <p>
                    Interest on debentures is subject to Tax Deducted at Source (TDS) under Section 193 of the Indian Income Tax Act, 1961. This calculation is an illustrative arithmetic model and does not constitute a guaranteed financial yield or binding commitment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KYC & COMPLIANCE */}
        {activeTab === "kyc" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Investor KYC & Statutory Identity Verification
                </h2>
                <p className="text-xs text-[#5C5C5C] mt-1">
                  Regulatory identity verification pursuant to SEBI Private Placement guidelines and PMLA rules.
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                kycRecord?.status === "VERIFIED"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}>
                {kycRecord?.status || "NOT_SUBMITTED"}
              </span>
            </div>

            {kycRecord ? (
              <div className="p-6 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Institutional Identity Documentation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-3 border-t border-[rgba(26,26,26,0.06)]">
                  <div>
                    <span className="text-[0.625rem] text-[#8A8A8A] block">Masked PAN Identifier</span>
                    <span className="font-mono font-bold text-sm text-[#1A1A1A]">{kycRecord.pan_number_masked}</span>
                  </div>
                  <div>
                    <span className="text-[0.625rem] text-[#8A8A8A] block">Document Type</span>
                    <span className="font-bold text-[#1A1A1A]">{kycRecord.id_type} ({kycRecord.id_number_masked})</span>
                  </div>
                  <div>
                    <span className="text-[0.625rem] text-[#8A8A8A] block">Verification Date</span>
                    <span className="text-[#5C5C5C]">
                      {kycRecord.verified_at ? new Date(kycRecord.verified_at).toLocaleDateString() : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="text-[0.6875rem] text-[#5C5C5C] pt-3 border-t border-[rgba(26,26,26,0.06)] leading-relaxed">
                  DPDP Act 2023 Notice: Your identity credentials are cryptographic tokens strictly isolated for regulatory AML/KYC adherence. Niventra Capital Advisory does not share identity documentation with external marketing networks.
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] text-center text-xs text-[#8A8A8A]">
                No KYC record on file. Please complete KYC submission under settings.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ENQUIRIES */}
        {activeTab === "enquiries" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">My Advisory Consultations</h2>
                <p className="text-xs text-[#5C5C5C] mt-1">Direct pipeline status of your investment & capital structuring inquiries.</p>
              </div>
              <NextLink
                href="/contact/"
                className="px-3.5 py-2 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D]"
              >
                Submit Consultation
              </NextLink>
            </div>

            {enquiries.length === 0 ? (
              <p className="text-xs text-[#8A8A8A] py-8 text-center">No inquiries logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                    <tr>
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Capital Range</th>
                      <th className="py-3 px-4">Submitted Date</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-[#FAFAF7]/50">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{enq.id}</td>
                        <td className="py-3.5 px-4 text-[#1A1A1A]">{enq.category}</td>
                        <td className="py-3.5 px-4 text-[#5C5C5C]">{enq.capital_range}</td>
                        <td className="py-3.5 px-4 text-[#5C5C5C]">{new Date(enq.created_at).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4">{getStatusBadge(enq.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Document Centre</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Authorized institutional offer documentation, governance frameworks, and corporate profiles.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-5 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.625rem] font-mono uppercase px-2 py-0.5 rounded bg-white border border-[rgba(26,26,26,0.1)] text-[#1A1A1A]">
                        {doc.doc_type}
                      </span>
                      <span className="text-[0.6875rem] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {doc.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A]">{doc.title}</h3>
                    <p className="text-xs text-[#5C5C5C] mt-1 font-mono">
                      Version: {doc.version} • Size: {formatFileSize(doc.file_size)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(26,26,26,0.08)] flex items-center justify-between">
                    <span className="text-[0.6875rem] text-[#8A8A8A]">Audited PDF Stream</span>
                    <a
                      href={`/api/documents/${doc.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: GRIEVANCES */}
        {activeTab === "grievances" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Grievance & Compliance Tickets</h2>
                <p className="text-xs text-[#5C5C5C] mt-1">Official complaints tracked under institutional 30-day statutory SLA.</p>
              </div>
              <NextLink
                href="/grievance/"
                className="px-3.5 py-2 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D]"
              >
                Lodge Grievance
              </NextLink>
            </div>

            {grievances.length === 0 ? (
              <p className="text-xs text-[#8A8A8A] py-8 text-center">No active grievance tickets found.</p>
            ) : (
              <div className="space-y-4">
                {grievances.map((g) => (
                  <div key={g.id} className="p-4 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#1A1A1A]">{g.id}</span>
                      {getStatusBadge(g.status)}
                    </div>
                    <div className="text-sm font-semibold text-[#1A1A1A]">{g.subject}</div>
                    <div className="flex items-center justify-between text-[0.6875rem] text-[#5C5C5C] pt-2 border-t border-[rgba(26,26,26,0.06)]">
                      <span>Logged: {new Date(g.created_at).toLocaleDateString()}</span>
                      <span className="font-mono text-[#9A7B2C]">SLA Deadline: {new Date(g.sla_deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Minimal */}
      <footer className="border-t border-[rgba(26,26,26,0.08)] bg-white py-4 px-8 text-center text-[0.6875rem] text-[#8A8A8A]">
        Niventra Capital Advisory India • Verified Client Workspace • Encrypted Session
      </footer>
    </div>
  );
}
