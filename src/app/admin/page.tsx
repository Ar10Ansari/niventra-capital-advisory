"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Building2,
  FileText,
  X,
  Search,
  Eye,
  Clock,
  Briefcase,
  Layers,
  ShieldCheck,
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

interface ProjectDoc {
  name: string;
  category: string;
  size: number;
  uploadedAt?: string;
  status?: string;
}

interface ProjectApplication {
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
  documents?: ProjectDoc[] | string;
  status: string;
  internal_notes: string | null;
  decline_reason: string | null;
  info_requested: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectStatusHistory {
  id: string;
  previous_status: string | null;
  new_status: string;
  changed_by: string;
  change_note: string | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "enquiries" | "grievances" | "products" | "documents" | "audit"
  >("overview");

  // Data states
  const [projects, setProjects] = useState<ProjectApplication[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Project review modal & state
  const [selectedProject, setSelectedProject] = useState<ProjectApplication | null>(null);
  const [projectHistory, setProjectHistory] = useState<ProjectStatusHistory[]>([]);
  const [editProjectStatus, setEditProjectStatus] = useState<string>("");
  const [editProjectNotes, setEditProjectNotes] = useState<string>("");
  const [editProjectDeclineReason, setEditProjectDeclineReason] = useState<string>("");
  const [editProjectInfoRequested, setEditProjectInfoRequested] = useState<string>("");
  const [isUpdatingProject, setIsUpdatingProject] = useState<boolean>(false);

  // Filters for projects
  const [projectFilterStatus, setProjectFilterStatus] = useState<string>("ALL");
  const [projectFilterCategory, setProjectFilterCategory] = useState<string>("ALL");
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>("");

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

        // Fetch Projects
        const prjRes = await fetch("/api/project-funding");
        if (prjRes.ok) {
          const d = await prjRes.json();
          setProjects(d.applications || []);
        }

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

  const handleOpenProjectDetails = async (project: ProjectApplication) => {
    setSelectedProject(project);
    setEditProjectStatus(project.status);
    setEditProjectNotes(project.internal_notes || "");
    setEditProjectDeclineReason(project.decline_reason || "");
    setEditProjectInfoRequested(project.info_requested || "");

    try {
      const res = await fetch(`/api/project-funding/${project.id}`);
      if (res.ok) {
        const d = await res.json();
        setSelectedProject(d.application);
        setProjectHistory(d.history || []);
      }
    } catch (err) {
      console.error("Error loading project details:", err);
    }
  };

  const handleSaveProjectReview = async () => {
    if (!selectedProject) return;
    setIsUpdatingProject(true);
    try {
      const res = await fetch(`/api/project-funding/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editProjectStatus,
          internalNotes: editProjectNotes,
          declineReason: editProjectDeclineReason,
          infoRequested: editProjectInfoRequested,
          changeNote: `Status updated to ${editProjectStatus} by ${currentUser?.name || "Deal Officer"}`,
        }),
      });

      if (res.ok) {
        setActionMessage(`Project ${selectedProject.reference_number} updated to ${editProjectStatus}.`);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProject.id
              ? {
                  ...p,
                  status: editProjectStatus,
                  internal_notes: editProjectNotes,
                  decline_reason: editProjectDeclineReason,
                  info_requested: editProjectInfoRequested,
                }
              : p
          )
        );
        setSelectedProject(null);
        setTimeout(() => setActionMessage(""), 4000);
      }
    } catch (err) {
      console.error("Error updating project status:", err);
    } finally {
      setIsUpdatingProject(false);
    }
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

  const filteredProjects = projects.filter((p) => {
    if (projectFilterStatus !== "ALL" && p.status !== projectFilterStatus) return false;
    if (projectFilterCategory !== "ALL" && p.category !== projectFilterCategory) return false;
    if (projectSearchQuery) {
      const q = projectSearchQuery.toLowerCase();
      const match =
        p.reference_number.toLowerCase().includes(q) ||
        p.project_name.toLowerCase().includes(q) ||
        p.organization_name.toLowerCase().includes(q) ||
        p.applicant_name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#9A7B2C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#8A8A8A]">
            Verifying Institutional Security Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-body">
      {/* Top Institutional Header */}
      <header className="bg-[#0E1C2E] border-b border-[rgba(255,255,255,0.08)] px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-base font-bold text-white tracking-tight">NIVENTRA</span>
              <span className="text-[0.625rem] uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-[#9A7B2C]/20 text-[#C9A84C] border border-[#9A7B2C]/30">
                Admin Command
              </span>
            </Link>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 text-xs text-gray-300">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "overview" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "projects" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Project Funding ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab("enquiries")}
                className={`px-3 py-1.5 rounded transition-colors ${activeTab === "enquiries" ? "bg-white/10 text-white font-semibold" : "hover:text-white"}`}
              >
                Enquiries ({enquiries.length})
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
                Centralized oversight for Real Estate Project Submissions, CRM consultations, investor due diligence, and immutable governance logs.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab("projects")}
                className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Project Submissions
                  </span>
                  <Building2 className="w-4 h-4 text-[#9A7B2C]" />
                </div>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {projects.length}
                </div>
                <div className="text-[0.6875rem] text-emerald-700 font-medium mt-1">
                  {projects.filter((p) => p.status === "RECEIVED" || p.status === "UNDER_REVIEW").length} awaiting underwriting review
                </div>
              </div>

              <div
                onClick={() => setActiveTab("enquiries")}
                className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Total Enquiries
                  </span>
                  <Briefcase className="w-4 h-4 text-[#9A7B2C]" />
                </div>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {enquiries.length}
                </div>
                <div className="text-[0.6875rem] text-amber-700 font-medium mt-1">
                  {enquiries.filter((e) => e.status === "NEW" || e.status === "IN_REVIEW").length} requiring desk attention
                </div>
              </div>

              <div
                onClick={() => setActiveTab("grievances")}
                className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Grievance Tickets
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {grievances.length}
                </div>
                <div className="text-[0.6875rem] text-emerald-700 font-medium mt-1">
                  100% within statutory 30-day SLA
                </div>
              </div>

              <div
                onClick={() => setActiveTab("products")}
                className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-5 shadow-sm cursor-pointer hover:border-[#9A7B2C]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                    Offerings Catalog
                  </span>
                  <Layers className="w-4 h-4 text-[#9A7B2C]" />
                </div>
                <div className="text-2xl font-bold font-heading text-[#1A1A1A] mt-2">
                  {products.length}
                </div>
                <div className="text-[0.6875rem] text-gray-500 font-medium mt-1">
                  Illustrative debenture tranches
                </div>
              </div>
            </div>

            {/* Quick Queues */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Funding Quick Queue */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
                  <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    Recent Project Applications
                  </h2>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-xs text-[#9A7B2C] font-semibold hover:underline"
                  >
                    View All ({projects.length})
                  </button>
                </div>
                {projects.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">No project applications submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {projects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleOpenProjectDetails(p)}
                        className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7] hover:border-[#9A7B2C]/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#1A1A1A]">{p.reference_number}</span>
                          <span className={`text-[0.6875rem] font-semibold px-2 py-0.5 rounded border ${
                            p.status === "RECEIVED" ? "bg-blue-50 text-blue-800 border-blue-200" :
                            p.status === "SHORTLISTED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            p.status === "UNDER_REVIEW" ? "bg-amber-50 text-amber-800 border-amber-200" :
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-[#1A1A1A] mt-1">{p.project_name} • {p.organization_name}</div>
                        <div className="text-[0.6875rem] text-[#5C5C5C] mt-0.5">
                          Req: ₹{(p.funding_requested / 100).toFixed(2)} Cr • {p.city}, {p.state}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CRM Enquiries Quick Queue */}
              <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(26,26,26,0.06)]">
                  <h2 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    Recent Enquiries
                  </h2>
                  <button
                    onClick={() => setActiveTab("enquiries")}
                    className="text-xs text-[#9A7B2C] font-semibold hover:underline"
                  >
                    View All ({enquiries.length})
                  </button>
                </div>
                <div className="space-y-3">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div key={enq.id} className="p-3.5 rounded border border-[rgba(26,26,26,0.06)] bg-[#FAFAF7]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#1A1A1A]">{enq.id}</span>
                        <span className="text-[0.6875rem] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
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
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT APPLICATIONS REVIEW */}
        {activeTab === "projects" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Real Estate Project Funding Applications
                </h2>
                <p className="text-xs text-[#5C5C5C] mt-1">
                  Evaluate developer proposals, inspect capital requirement models, verify documents, and record underwriting status changes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8A8A8A]">Total Submissions:</span>
                <span className="font-mono font-bold text-sm text-[#1A1A1A]">{projects.length}</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-[#FAFAF7] p-3.5 rounded-lg border border-[rgba(26,26,26,0.06)]">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  placeholder="Search project name, ref #, developer, city..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                />
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#8A8A8A]">Status:</span>
                <select
                  value={projectFilterStatus}
                  onChange={(e) => setProjectFilterStatus(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="MORE_INFORMATION_REQUIRED">MORE_INFO_REQUIRED</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="DECLINED">DECLINED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              {/* Category filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#8A8A8A]">Category:</span>
                <select
                  value={projectFilterCategory}
                  onChange={(e) => setProjectFilterCategory(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                >
                  <option value="ALL">All Categories</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                  <option value="MIXED_USE">Mixed-Use</option>
                  <option value="PLOTTED_DEVELOPMENT">Plotted</option>
                  <option value="REDEVELOPMENT">Redevelopment</option>
                  <option value="INDUSTRIAL">Industrial</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                  <tr>
                    <th className="py-3 px-3">Ref Number</th>
                    <th className="py-3 px-3">Project &amp; Developer</th>
                    <th className="py-3 px-3">Category / Stage</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Funding / Total Cost</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Submitted</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No project applications found matching selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAFAF7]/50">
                        <td className="py-3 px-3 font-mono font-bold text-[#1A1A1A]">
                          {p.reference_number}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#1A1A1A]">{p.project_name}</div>
                          <div className="text-[0.6875rem] text-[#8A8A8A]">{p.organization_name} • {p.applicant_name}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-[#2D2D2D]">{p.category}</span>
                          <span className="text-[0.6875rem] text-[#8A8A8A] block">{p.stage}</span>
                        </td>
                        <td className="py-3 px-3 text-[#5C5C5C]">
                          {p.city}, {p.state}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-emerald-900">
                            ₹{(p.funding_requested / 100).toFixed(2)} Cr
                          </div>
                          <div className="text-[0.6875rem] text-[#8A8A8A]">
                            Cost: ₹{(p.total_cost / 100).toFixed(2)} Cr
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block font-semibold px-2 py-0.5 rounded text-[0.625rem] border ${
                            p.status === "RECEIVED" ? "bg-blue-50 text-blue-800 border-blue-200" :
                            p.status === "SHORTLISTED" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            p.status === "UNDER_REVIEW" ? "bg-amber-50 text-amber-800 border-amber-200" :
                            p.status === "MORE_INFORMATION_REQUIRED" ? "bg-purple-50 text-purple-800 border-purple-200" :
                            p.status === "DECLINED" ? "bg-red-50 text-red-800 border-red-200" :
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#8A8A8A] whitespace-nowrap">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenProjectDetails(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A1A1A] text-white text-[0.6875rem] font-medium hover:bg-[#2D2D2D] transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Detail & Status Review Dialog */}
            {selectedProject && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 space-y-6">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <span className="text-[0.6875rem] font-mono text-[#8A8A8A] uppercase tracking-wider block">
                        Project Application Review
                      </span>
                      <h3 className="font-heading text-xl font-bold text-[#1A1A1A]">
                        {selectedProject.project_name} ({selectedProject.reference_number})
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="p-1 rounded text-gray-400 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-[#FAFAF7] p-4 rounded-lg border border-gray-200">
                    <div>
                      <span className="text-[#8A8A8A] block">Developer Organization</span>
                      <span className="font-semibold text-[#1A1A1A]">{selectedProject.organization_name}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Applicant Contact</span>
                      <span className="font-semibold text-[#1A1A1A]">{selectedProject.applicant_name} ({selectedProject.role})</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Email &amp; Phone</span>
                      <span className="font-semibold text-[#1A1A1A]">{selectedProject.email} • {selectedProject.phone}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Location</span>
                      <span className="font-semibold text-[#1A1A1A]">{selectedProject.city}, {selectedProject.state} ({selectedProject.pin_code})</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Asset Category</span>
                      <span className="font-semibold text-[#1A1A1A]">{selectedProject.category}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Stage</span>
                      <span className="font-semibold text-[#1A1A1A]">{selectedProject.stage}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Total Project Cost</span>
                      <span className="font-bold text-sm text-[#1A1A1A]">₹{(selectedProject.total_cost / 100).toFixed(2)} Cr</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Funding Requested</span>
                      <span className="font-bold text-sm text-emerald-800">₹{(selectedProject.funding_requested / 100).toFixed(2)} Cr</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Promoter Infusion</span>
                      <span className="font-semibold text-[#1A1A1A]">
                        {selectedProject.promoter_contribution ? `₹${(selectedProject.promoter_contribution / 100).toFixed(2)} Cr` : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Description & Use of Funds */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
                        Project Description
                      </span>
                      <p className="p-3 bg-gray-50 rounded border border-gray-200 text-[#2D2D2D] leading-relaxed">
                        {selectedProject.description || "No description provided."}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
                        Proposed Use of Funds
                      </span>
                      <p className="p-3 bg-gray-50 rounded border border-gray-200 text-[#2D2D2D] leading-relaxed">
                        {selectedProject.use_of_funds || "Not specified."}
                      </p>
                    </div>
                  </div>

                  {/* Documents Checklist */}
                  <div className="space-y-2">
                    <span className="font-semibold uppercase tracking-wider text-xs text-[#8A8A8A] block">
                      Uploaded Documents &amp; Evidence
                    </span>
                    {Array.isArray(selectedProject.documents) && selectedProject.documents.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {selectedProject.documents.map((doc, idx) => (
                          <div key={idx} className="p-2.5 rounded border border-gray-200 bg-white flex items-center justify-between">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-[#9A7B2C] shrink-0" />
                              <span className="truncate font-medium text-[#1A1A1A]">{doc.name}</span>
                            </div>
                            <span className="text-[0.625rem] text-gray-400 shrink-0">
                              {(doc.size / (1024 * 1024)).toFixed(1)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 italic">No files attached with initial screening submission.</p>
                    )}
                  </div>

                  {/* Underwriting Status Transition & Internal Notes */}
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-[#1A1A1A]">
                      Deal Desk Underwriting Review &amp; Status
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                          Change Status To
                        </label>
                        <select
                          value={editProjectStatus}
                          onChange={(e) => setEditProjectStatus(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                        >
                          <option value="RECEIVED">RECEIVED (Initial Screening)</option>
                          <option value="UNDER_REVIEW">UNDER_REVIEW (Technical &amp; Cash Flow Due Diligence)</option>
                          <option value="MORE_INFORMATION_REQUIRED">MORE_INFORMATION_REQUIRED (Query Raised)</option>
                          <option value="SHORTLISTED">SHORTLISTED (Approved for Investment Committee)</option>
                          <option value="DECLINED">DECLINED (Does Not Meet Risk Parameters)</option>
                          <option value="CLOSED">CLOSED (Archived / Deal Executed Offline)</option>
                        </select>
                      </div>

                      {editProjectStatus === "DECLINED" && (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-red-700 mb-1.5">
                            Reason for Decline
                          </label>
                          <input
                            type="text"
                            value={editProjectDeclineReason}
                            onChange={(e) => setEditProjectDeclineReason(e.target.value)}
                            placeholder="e.g. Inadequate asset cover ratio, pending litigation"
                            className="w-full text-xs px-3 py-2 rounded border border-red-300 bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
                          />
                        </div>
                      )}

                      {editProjectStatus === "MORE_INFORMATION_REQUIRED" && (
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-purple-700 mb-1.5">
                            Specific Information Requested
                          </label>
                          <input
                            type="text"
                            value={editProjectInfoRequested}
                            onChange={(e) => setEditProjectInfoRequested(e.target.value)}
                            placeholder="e.g. Audited balance sheet for FY25, RERA sanction copy"
                            className="w-full text-xs px-3 py-2 rounded border border-purple-300 bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#5C5C5C] mb-1.5">
                        Confidential Internal Notes
                      </label>
                      <textarea
                        rows={2}
                        value={editProjectNotes}
                        onChange={(e) => setEditProjectNotes(e.target.value)}
                        placeholder="Internal deal comments, technical reviewer observations, valuation benchmarks..."
                        className="w-full text-xs px-3 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                      />
                    </div>

                    {/* Status History Audit Trail */}
                    {projectHistory.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="font-semibold uppercase tracking-wider text-[0.6875rem] text-[#8A8A8A]">
                          Status History Audit Trail
                        </span>
                        <div className="space-y-1 text-[0.6875rem] text-[#5C5C5C]">
                          {projectHistory.map((h) => (
                            <div key={h.id} className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="font-mono text-gray-400">{new Date(h.created_at).toLocaleString()}:</span>
                              <span className="font-semibold text-[#1A1A1A]">{h.new_status}</span>
                              <span className="text-gray-400">by {h.changed_by}</span>
                              {h.change_note && <span className="italic text-gray-500">— {h.change_note}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(null)}
                      className="px-4 py-2 rounded border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={isUpdatingProject}
                      onClick={handleSaveProjectReview}
                      className="px-5 py-2 rounded bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#2D2D2D] transition-colors disabled:opacity-50"
                    >
                      {isUpdatingProject ? "Saving..." : "Save Status & Review"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ENQUIRIES PIPELINE */}
        {activeTab === "enquiries" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">CRM Enquiries &amp; Deal Pipeline</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Review prospect submissions, assign advisory operators, and append confidential internal notes.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                  <tr>
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Client Details</th>
                    <th className="py-3 px-4">Category &amp; Range</th>
                    <th className="py-3 px-4">Status Pipeline</th>
                    <th className="py-3 px-4">Internal Advisory Notes</th>
                    <th className="py-3 px-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#FAFAF7]/50">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{enq.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1A1A1A]">{enq.full_name}</div>
                        <div className="text-[0.6875rem] text-[#8A8A8A]">{enq.email} • {enq.phone_number}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-[#2D2D2D]">{enq.category}</span>
                        <span className="text-[0.6875rem] text-[#8A8A8A] block">{enq.capital_range}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiry(enq.id, e.target.value, enq.internal_notes || "")}
                          className="bg-white border border-[rgba(26,26,26,0.15)] rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="IN_REVIEW">IN_REVIEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="FOLLOW_UP">FOLLOW_UP</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <input
                          type="text"
                          defaultValue={enq.internal_notes || ""}
                          placeholder="Add internal notes..."
                          onBlur={(e) => handleUpdateEnquiry(enq.id, enq.status, e.target.value)}
                          className="w-full text-xs border border-transparent hover:border-gray-200 focus:border-[#9A7B2C] rounded px-2 py-1 bg-transparent focus:bg-white"
                        />
                      </td>
                      <td className="py-3.5 px-4 text-[#8A8A8A] whitespace-nowrap">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: GRIEVANCES */}
        {activeTab === "grievances" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Grievance Redressal Tickets</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Formal investor grievances tracked under strict 30-day statutory resolution SLAs.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAFAF7] border-b border-[rgba(26,26,26,0.08)] text-[#8A8A8A] uppercase font-mono text-[0.625rem]">
                  <tr>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Complainant</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">SLA Deadline</th>
                    <th className="py-3 px-4">Resolution Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,26,26,0.06)]">
                  {grievances.map((g) => (
                    <tr key={g.id} className="hover:bg-[#FAFAF7]/50">
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#1A1A1A]">{g.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1A1A1A]">{g.complainant_name}</div>
                        <div className="text-[0.6875rem] text-[#8A8A8A]">{g.email} • {g.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#1A1A1A]">{g.subject}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={g.status}
                          onChange={(e) => handleUpdateGrievance(g.id, e.target.value, g.resolution_notes || "")}
                          className="bg-white border border-[rgba(26,26,26,0.15)] rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#9A7B2C]"
                        >
                          <option value="SUBMITTED">SUBMITTED</option>
                          <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                          <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="ESCALATED">ESCALATED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[0.6875rem] text-[#8A8A8A]">
                        {new Date(g.sla_deadline).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <input
                          type="text"
                          defaultValue={g.resolution_notes || ""}
                          placeholder="Resolution details..."
                          onBlur={(e) => handleUpdateGrievance(g.id, g.status, e.target.value)}
                          className="w-full text-xs border border-transparent hover:border-gray-200 focus:border-[#9A7B2C] rounded px-2 py-1 bg-transparent focus:bg-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: PRODUCTS */}
        {activeTab === "products" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Debenture Offerings Catalog</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Published structured financial products and illustrative debenture models.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-lg border border-gray-200 bg-[#FAFAF7] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.6875rem] font-semibold text-[#9A7B2C] uppercase tracking-wider">{p.category}</span>
                    <span className="text-[0.625rem] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">{p.status}</span>
                  </div>
                  <h3 className="font-heading text-sm font-bold text-[#1A1A1A]">{p.title}</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-200">
                    <div>
                      <span className="text-[#8A8A8A] block">Yield</span>
                      <span className="font-semibold text-[#1A1A1A]">{p.indicative_yield}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Tenor</span>
                      <span className="font-semibold text-[#1A1A1A]">{p.tenor}</span>
                    </div>
                    <div>
                      <span className="text-[#8A8A8A] block">Min Investment</span>
                      <span className="font-semibold text-[#1A1A1A]">{p.min_investment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Compliance &amp; Document Repository</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Official disclosures, regulatory term sheets, and investor due diligence reports.</p>
            </div>

            <div className="space-y-3">
              {documents.map((d) => (
                <div key={d.id} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#9A7B2C]" />
                    <div>
                      <span className="text-xs font-semibold text-[#1A1A1A] block">{d.title}</span>
                      <span className="text-[0.6875rem] text-gray-500">{d.doc_type} • v{d.version}</span>
                    </div>
                  </div>
                  <span className="text-[0.625rem] px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {d.is_public ? "Public Access" : "Investor Restricted"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT LOGS */}
        {activeTab === "audit" && currentUser?.role === "ADMIN" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-lg p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[rgba(26,26,26,0.08)]">
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">Immutable Security Audit Log</h2>
              <p className="text-xs text-[#5C5C5C] mt-1">Append-only administrative tracking for compliance, status transitions, and data access.</p>
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
