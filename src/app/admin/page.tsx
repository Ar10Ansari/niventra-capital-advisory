"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ExternalLink,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Enquiry {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone_number: string;
  category: string;
  capital_range: string;
  message: string;
  status: string;
  internal_notes: string | null;
  created_at: string;
}

interface Grievance {
  id: string;
  complainant_name: string;
  email: string;
  phone: string;
  transaction_ref: string | null;
  subject: string;
  description: string;
  status: string;
  resolution_notes: string | null;
  sla_deadline: string;
  created_at: string;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  indicative_yield: string;
  tenor: string;
  min_investment: string;
  security_type: string;
  status: string;
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

interface AuditLog {
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "enquiries" | "grievances" | "products" | "documents" | "audit">("overview");

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Action status notification
  const [actionMessage, setActionMessage] = useState<string>("");

  useEffect(() => {
    async function loadAdminData() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const meData = await meRes.json();
        if (meData.user.role !== "ADMIN" && meData.user.role !== "STAFF") {
          router.push("/dashboard");
          return;
        }
        setCurrentUser(meData.user);

        // Fetch Enquiries
        const enqRes = await fetch("/api/enquiries");
        if (enqRes.ok) {
          const d = await enqRes.json();
          setEnquiries(d.enquiries || []);
        }

        // Fetch Grievances
        const grvRes = await fetch("/api/grievances");
        if (grvRes.ok) {
          const d = await grvRes.json();
          setGrievances(d.grievances || []);
        }

        // Fetch Products
        const prodRes = await fetch("/api/products");
        if (prodRes.ok) {
          const d = await prodRes.json();
          setProducts(d.products || []);
        }

        // Fetch Documents
        const docRes = await fetch("/api/documents");
        if (docRes.ok) {
          const d = await docRes.json();
          setDocuments(d.documents || []);
        }

        // Fetch Audit logs if ADMIN
        if (meData.user.role === "ADMIN") {
          const auditRes = await fetch("/api/audit-logs");
          if (auditRes.ok) {
            const d = await auditRes.json();
            setAuditLogs(d.logs || []);
          }
        }
      } catch (err) {
        console.error("Admin load failure:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleUpdateEnquiry = async (id: string, status: string, notes: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNotes: notes }),
      });
      if (res.ok) {
        setActionMessage(`Enquiry ${id} updated to ${status}.`);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status, internal_notes: notes } : e))
        );
        setTimeout(() => setActionMessage(""), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateGrievance = async (id: string, status: string, notes: string) => {
    try {
      const res = await fetch(`/api/grievances/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolutionNotes: notes }),
      });
      if (res.ok) {
        setActionMessage(`Grievance ${id} status updated to ${status}.`);
        setGrievances((prev) =>
          prev.map((g) => (g.id === id ? { ...g, status, resolution_notes: notes } : g))
        );
        setTimeout(() => setActionMessage(""), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#5C5C5C] font-mono">Authenticating Administrative Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F1] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#1A1A1A] text-white border-b border-[#2D2D2D] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="font-heading text-lg font-bold tracking-tight text-white">NIVENTRA</span>
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[#D4AF37] border-l border-white/20 pl-2.5">
                Executive Desk
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-gray-300">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "overview" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("enquiries")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "enquiries" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Enquiries Pipeline ({enquiries.length})
              </button>
              <button
                onClick={() => setActiveTab("grievances")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "grievances" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Grievance Tickets ({grievances.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "products" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "documents" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Documents ({documents.length})
              </button>
              {currentUser?.role === "ADMIN" && (
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`px-3 py-1.5 rounded transition-colors ${activeTab === "audit" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
                >
                  Audit Logs ({auditLogs.length})
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{currentUser?.name}</span>
              <span className="text-[0.625rem] text-gray-400 font-mono">
                {currentUser?.role} • {currentUser?.email}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-white/10"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="bg-emerald-800 text-white text-xs px-6 py-2.5 text-center font-medium shadow-md transition-all">
          ✓ {actionMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
                Advisory Operational Command
              </h1>
              <p className="font-body text-xs text-[#5C5C5C] mt-1">
                Centralized oversight for CRM consultations, investor due diligence, statutory grievances, and immutable governance logs.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Total Enquiries
                </span>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {enquiries.length}
                </div>
                <div className="text-[0.6875rem] text-amber-700 font-medium mt-1">
                  {enquiries.filter((e) => e.status === "NEW" || e.status === "IN_REVIEW").length} requiring desk attention
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Grievance Tickets
                </span>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {grievances.length}
                </div>
                <div className="text-[0.6875rem] text-emerald-700 font-medium mt-1">
                  100% within statutory 30-day SLA
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  Active Products
                </span>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {products.length}
                </div>
                <div className="text-[0.6875rem] text-[#5C5C5C] mt-1">
                  {products.filter((p) => p.status === "PUBLISHED").length} published tranches
                </div>
              </div>

              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                  System Audit Trail
                </span>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {auditLogs.length}
                </div>
                <div className="text-[0.6875rem] text-emerald-700 font-medium mt-1">
                  Immutable SQLite WAL journal
                </div>
              </div>
            </div>

            {/* Quick Action Tables Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Enquiries */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
                  <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    Recent CRM Inquiries
                  </h2>
                  <button
                    onClick={() => setActiveTab("enquiries")}
                    className="text-xs text-[#9A7B2C] font-semibold hover:underline"
                  >
                    Manage All
                  </button>
                </div>
                <div className="space-y-3">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div key={enq.id} className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#1A1A1A]">{enq.id}</span>
                        <span className="text-[0.6875rem] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {enq.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#1A1A1A] mt-1">{enq.full_name} ({enq.email})</div>
                      <div className="text-[0.6875rem] text-[#5C5C5C] mt-0.5">
                        {enq.category} • {enq.capital_range}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grievance SLA Queue */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
                  <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    Grievance Escalation Queue
                  </h2>
                  <button
                    onClick={() => setActiveTab("grievances")}
                    className="text-xs text-[#9A7B2C] font-semibold hover:underline"
                  >
                    Manage Cases
                  </button>
                </div>
                <div className="space-y-3">
                  {grievances.slice(0, 4).map((grv) => (
                    <div key={grv.id} className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#1A1A1A]">{grv.id}</span>
                        <span className="text-[0.6875rem] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {grv.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#1A1A1A] mt-1">{grv.subject}</div>
                      <div className="text-[0.6875rem] text-[#5C5C5C] mt-0.5">
                        Complainant: {grv.complainant_name} ({grv.phone})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENQUIRIES PIPELINE */}
        {activeTab === "enquiries" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">CRM Enquiries & Deal Pipeline</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Review prospect submissions, assign advisory operators, and append confidential internal notes.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                  <tr>
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Client Details</th>
                    <th className="py-3 px-4">Category & Range</th>
                    <th className="py-3 px-4">Status Pipeline</th>
                    <th className="py-3 px-4">Internal Advisory Notes</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#FAFAF7]/50">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{enq.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1A1A1A]">{enq.full_name}</div>
                        <div className="text-[#5C5C5C] text-[0.6875rem]">{enq.email}</div>
                        <div className="text-[#8A8A8A] text-[0.6875rem]">{enq.phone_number}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#1A1A1A]">{enq.category}</div>
                        <div className="text-[#5C5C5C] text-[0.6875rem]">{enq.capital_range}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiry(enq.id, e.target.value, enq.internal_notes || "")}
                          className="text-xs p-1.5 rounded border border-[rgba(26,26,26,0.15)] bg-white font-medium"
                        >
                          <option value="NEW">NEW (Received)</option>
                          <option value="IN_REVIEW">IN_REVIEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          defaultValue={enq.internal_notes || ""}
                          placeholder="Confidential desk notes..."
                          onBlur={(e) => handleUpdateEnquiry(enq.id, enq.status, e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A]"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[0.6875rem] font-mono text-[#8A8A8A]">
                          {new Date(enq.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GRIEVANCE MANAGEMENT */}
        {activeTab === "grievances" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Grievance Case Tracking</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Official complaints monitored under institutional SLA (30 calendar days).</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                  <tr>
                    <th className="py-3 px-4">Ticket Ref</th>
                    <th className="py-3 px-4">Complainant</th>
                    <th className="py-3 px-4">Subject & Description</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Resolution Notes</th>
                    <th className="py-3 px-4">SLA Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {grievances.map((grv) => (
                    <tr key={grv.id} className="hover:bg-[#FAFAF7]/50">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{grv.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1A1A1A]">{grv.complainant_name}</div>
                        <div className="text-[#5C5C5C] text-[0.6875rem]">{grv.email} • {grv.phone}</div>
                        {grv.transaction_ref && (
                          <div className="text-[0.625rem] font-mono text-[#9A7B2C]">Ref: {grv.transaction_ref}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-[#1A1A1A]">{grv.subject}</div>
                        <p className="text-[#5C5C5C] text-[0.6875rem] line-clamp-2 mt-0.5">{grv.description}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={grv.status}
                          onChange={(e) => handleUpdateGrievance(grv.id, e.target.value, grv.resolution_notes || "")}
                          className="text-xs p-1.5 rounded border border-[rgba(26,26,26,0.15)] bg-white font-medium"
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                          <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="ESCALATED">ESCALATED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          defaultValue={grv.resolution_notes || ""}
                          placeholder="Resolution findings..."
                          onBlur={(e) => handleUpdateGrievance(grv.id, grv.status, e.target.value)}
                          className="w-full text-xs p-1.5 rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A]"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-[#8A8A8A]">
                        {new Date(grv.sla_deadline).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS */}
        {activeTab === "products" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)] flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Product Catalogue & Tranches</h2>
                <p className="text-xs text-[#5C5C5C] mt-1">Structured debentures and real estate debt products with indicative terms.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-5 rounded-lg border border-[rgba(26,26,26,0.08)] bg-[#FAFAF7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#1A1A1A]">{p.slug}</span>
                    <span className="text-[0.6875rem] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {p.status}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-[#1A1A1A]">{p.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[rgba(26,26,26,0.06)]">
                    <div>
                      <span className="text-[#8A8A8A] text-[0.6875rem] block">Indicative Yield</span>
                      <span className="font-semibold text-[#9A7B2C]">{p.indicative_yield}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] text-[0.6875rem] block">Tenor</span>
                      <span className="font-semibold text-[#1A1A1A]">{p.tenor}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] text-[0.6875rem] block">Minimum Ticket</span>
                      <span className="font-semibold text-[#1A1A1A]">{p.min_investment}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] text-[0.6875rem] block">Security Charge</span>
                      <span className="font-semibold text-[#1A1A1A]">{p.security_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Document Governance & Disclosure Files</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Authorized compliance documents, PAS-4 offer templates, and corporate governance files.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                  <tr>
                    <th className="py-3 px-4">Doc ID</th>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Access Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Direct Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {documents.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAFAF7]/50">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{d.id}</td>
                      <td className="py-3.5 px-4 font-medium text-[#1A1A1A]">{d.title}</td>
                      <td className="py-3.5 px-4 font-mono text-[#5C5C5C]">{d.doc_type}</td>
                      <td className="py-3.5 px-4">
                        {d.is_public ? (
                          <span className="px-2 py-0.5 rounded text-[0.625rem] bg-emerald-50 text-emerald-800 border border-emerald-200">Public</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[0.625rem] bg-purple-50 text-purple-800 border border-purple-200">Restricted (Investor)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-emerald-700">{d.status}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`/api/documents/${d.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] inline-flex items-center gap-1"
                        >
                          <span>Stream</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS (ADMIN ONLY) */}
        {activeTab === "audit" && currentUser?.role === "ADMIN" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Immutable Audit Trail</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Chronological record of authentication, data access, document downloads, and status transitions.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)] font-mono text-[0.6875rem]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAFAF7]/50">
                      <td className="py-3 px-4 text-[#8A8A8A] whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[#1A1A1A]">
                        {log.actor_email || "Anonymous"} ({log.actor_role || "PUBLIC"})
                      </td>
                      <td className="py-3 px-4 font-bold text-[#1A1A1A]">{log.action}</td>
                      <td className="py-3 px-4 text-[#5C5C5C]">
                        {log.resource_type}: {log.resource_id || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[0.625rem] ${log.status === "SUCCESS" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[rgba(26,26,26,0.08)] bg-white py-4 px-8 text-center text-[0.6875rem] text-[#8A8A8A]">
        Niventra Capital Advisory India • Administrative Console • Role: {currentUser?.role}
      </footer>
    </div>
  );
}
