"use client";

import React, { Suspense, useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  LogOut,
  ChevronRight,
  Settings,
  Calculator as CalcIcon,
} from "lucide-react";
import {
  apiClient,
  ApiClientError,
  AuthUser,
  EnquiryItem,
  DocumentItem,
  GrievanceItem,
  InvestmentItem,
  InvestmentSummary,
  KycRecordItem,
  LedgerTransactionItem,
} from "@/lib/api/client";
import { DashboardTabType } from "@/components/dashboard/dashboardHelpers";
import { DashboardOverviewTab } from "@/components/dashboard/DashboardOverviewTab";
import { HoldingsLedgerTab } from "@/components/dashboard/HoldingsLedgerTab";
import { DashboardCalculatorTab } from "@/components/dashboard/DashboardCalculatorTab";
import { KycComplianceTab } from "@/components/dashboard/KycComplianceTab";
import {
  DashboardEnquiriesTab,
  DashboardDocumentsTab,
  DashboardGrievancesTab,
} from "@/components/dashboard/ConsultationsDocumentsGrievancesTabs";

const ALLOWED_DASHBOARD_TABS = new Set<DashboardTabType>([
  "overview",
  "investments",
  "calculator",
  "kyc",
  "enquiries",
  "documents",
  "grievances",
]);

function resolveInitialDashboardTab(rawTab: string | null): DashboardTabType {
  if (rawTab && ALLOWED_DASHBOARD_TABS.has(rawTab as DashboardTabType)) {
    return rawTab as DashboardTabType;
  }
  return "overview";
}

function InvestorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [invSummary, setInvSummary] = useState<InvestmentSummary | null>(null);
  const [kycRecord, setKycRecord] = useState<KycRecordItem | null>(null);
  const [selectedInvForLedger, setSelectedInvForLedger] = useState<string | null>(null);
  const [ledgerTxns, setLedgerTxns] = useState<LedgerTransactionItem[]>([]);
  const [isLedgerLoading, setIsLedgerLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTabType>(() =>
    resolveInitialDashboardTab(searchParams.get("tab"))
  );

  useEffect(() => {
    async function loadData() {
      try {
        const meData = await apiClient.auth.me();
        if (!meData.user) {
          router.push("/login");
          return;
        }
        setUser(meData.user);

        const [invRes, kycRes, enqRes, docRes, grvRes] = await Promise.allSettled([
          apiClient.investments.list(),
          apiClient.kyc.get(),
          apiClient.enquiries.list(),
          apiClient.documents.list(),
          apiClient.grievances.list(),
        ]);

        if (invRes.status === "fulfilled") {
          setInvestments(invRes.value.investments || []);
          setInvSummary(invRes.value.summary || null);
        }
        if (kycRes.status === "fulfilled") {
          setKycRecord(kycRes.value.kyc || null);
        }
        if (enqRes.status === "fulfilled") {
          setEnquiries(enqRes.value.enquiries || []);
        }
        if (docRes.status === "fulfilled") {
          setDocuments(docRes.value.documents || []);
        }
        if (grvRes.status === "fulfilled") {
          setGrievances(grvRes.value.grievances || []);
        }
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          router.push("/login");
          return;
        }
        console.error("Dashboard load failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  const loadLedger = async (invId: string) => {
    setSelectedInvForLedger(invId);
    setIsLedgerLoading(true);
    setLedgerTxns([]);
    try {
      const data = await apiClient.investments.getById(invId);
      setLedgerTxns(data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch investment ledger:", err);
    } finally {
      setIsLedgerLoading(false);
    }
  };

  const handleToggleLedger = async (invId: string) => {
    if (selectedInvForLedger === invId) {
      setSelectedInvForLedger(null);
      setLedgerTxns([]);
      return;
    }
    await loadLedger(invId);
  };

  const handleViewInvestmentLedgerFromOverview = async (invId: string) => {
    setActiveTab("investments");
    await loadLedger(invId);
  };

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
    } finally {
      router.push("/login");
    }
  };

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
              <span className="font-heading text-lg font-bold tracking-tight text-[#1A1A1A]">
                NIVENTRA
              </span>
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
              <span className="text-[0.625rem] text-[#8A8A8A] font-mono">
                {user?.role} • {user?.email}
              </span>
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
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === "documents" ? "bg-[#1A1A1A] text-white" : ""}`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("grievances")}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === "grievances" ? "bg-[#1A1A1A] text-white" : ""}`}
          >
            Grievances
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

        {activeTab === "overview" && (
          <DashboardOverviewTab
            invSummary={invSummary}
            investments={investments}
            enquiries={enquiries}
            documents={documents}
            onSelectTab={setActiveTab}
            onViewInvestmentLedger={handleViewInvestmentLedgerFromOverview}
          />
        )}

        {activeTab === "investments" && (
          <HoldingsLedgerTab
            investments={investments}
            invSummary={invSummary}
            selectedInvId={selectedInvForLedger}
            ledgerTxns={ledgerTxns}
            isLedgerLoading={isLedgerLoading}
            onToggleLedger={handleToggleLedger}
          />
        )}

        {activeTab === "calculator" && <DashboardCalculatorTab />}

        {activeTab === "kyc" && (
          <KycComplianceTab
            kycRecord={kycRecord}
            onKycUpdated={setKycRecord}
          />
        )}

        {activeTab === "enquiries" && <DashboardEnquiriesTab enquiries={enquiries} />}

        {activeTab === "documents" && <DashboardDocumentsTab documents={documents} />}

        {activeTab === "grievances" && <DashboardGrievancesTab grievances={grievances} />}
      </main>

      <footer className="border-t border-[rgba(26,26,26,0.08)] bg-white py-4 px-8 text-center text-[0.6875rem] text-[#8A8A8A]">
        Niventra Capital Advisory India • Verified Client Workspace • Encrypted Session
      </footer>
    </div>
  );
}

export default function InvestorDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
          <p className="text-xs text-[#5C5C5C] font-mono">Loading Institutional Profile...</p>
        </div>
      }
    >
      <InvestorDashboardContent />
    </Suspense>
  );
}
