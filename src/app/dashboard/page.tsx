"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Download,
  LogOut,
  CheckCircle2,
  ChevronRight,
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

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "enquiries" | "documents" | "grievances">("overview");

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
      case "RESOLVED":
      case "CLOSED":
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Completed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[0.6875rem] font-semibold bg-gray-100 text-gray-700">{status}</span>;
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
      <header className="sticky top-0 z-40 bg-white border-b border-[rgba(26,26,26,0.08)] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NextLink href="/" className="flex items-center gap-2.5">
              <span className="font-heading text-lg font-bold tracking-tight text-[#1A1A1A]">NIVENTRA</span>
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[#9A7B2C] border-l border-[rgba(26,26,26,0.15)] pl-2.5">
                Client Portal
              </span>
            </NextLink>

            <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-[#5C5C5C]">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "overview" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("enquiries")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "enquiries" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                My Consultations ({enquiries.length})
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "documents" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Document Centre ({documents.length})
              </button>
              <button
                onClick={() => setActiveTab("grievances")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "grievances" ? "bg-[rgba(154,123,44,0.1)] text-[#9A7B2C] font-semibold" : "hover:text-[#1A1A1A]"}`}
              >
                Grievance Tickets ({grievances.length})
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-[#1A1A1A]">{user?.name}</span>
              <span className="text-[0.625rem] text-[#8A8A8A] font-mono">{user?.role} • {user?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#9A7B2C]">
                Institutional Advisory Workspace
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#1A1A1A] mt-1">
                Welcome back, {user?.name}
              </h1>
              <p className="font-body text-xs text-[#5C5C5C] mt-2 max-w-2xl leading-relaxed">
                Your portal provides direct visibility into submitted advisory consultations, approved disclosure documentation, and formal compliance communications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <NextLink
                href="/contact/"
                className="px-4 py-2 rounded text-xs font-semibold bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] transition-colors inline-flex items-center gap-2"
              >
                <span>New Advisory Consultation</span>
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
              Regulatory Due Diligence & Transparency Notice
            </span>
            <p className="text-[0.75rem] text-[#5C5C5C] leading-relaxed">
              In strict accordance with SEBI Private Placement guidelines and the Companies Act, 2013, Niventra Capital Advisory does not process unapproved real-money investment transactions or display simulated portfolio ledgers. All debenture allocations require formal execution of PAS-4 documentation and independent ROC charge filings.
            </p>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Active Enquiries
                </span>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {enquiries.length}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  Structured debt & capital requests
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Available Documents
                </span>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {documents.length}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  Approved policies & term references
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Grievance Tickets
                </span>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {grievances.length}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  30-day statutory SLA tracking
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Account Status
                </span>
                <div className="text-sm font-bold font-heading text-emerald-700 mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Client</span>
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  DPDP Act 2023 Compliant
                </div>
              </div>
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
                    View All
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
                    View All
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
                  <span className="text-[0.6875rem] text-[#5C5C5C] mt-1 block">Escalate compliance or service matters to the official grievance officer.</span>
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

        {/* Tab 2: Enquiries */}
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

        {/* Tab 3: Documents */}
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

        {/* Tab 4: Grievances */}
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
