"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  apiClient,
  ApiClientError,
  AuthUser,
  ProjectApplicationItem,
  ProjectStatusHistoryItem,
  EnquiryItem,
  GrievanceItem,
  ProductItem,
  DocumentItem,
  AuditLogItem,
} from "@/lib/api/client";
import { AdminOverviewTab, AdminTabType } from "@/components/admin/AdminOverviewTab";
import { AdminProjectsTab } from "@/components/admin/AdminProjectsTab";
import { ProjectReviewModal } from "@/components/admin/ProjectReviewModal";
import { AdminEnquiriesTab } from "@/components/admin/AdminEnquiriesTab";
import { AdminGrievancesTab } from "@/components/admin/AdminGrievancesTab";
import { AdminProductsTab, AdminDocumentsTab } from "@/components/admin/AdminCatalogAndDocsTabs";
import { AdminAuditLogsTab } from "@/components/admin/AdminAuditLogsTab";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTabType>("overview");

  // Data states
  const [projects, setProjects] = useState<ProjectApplicationItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [grievances, setGrievances] = useState<GrievanceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  // Project review modal state
  const [selectedProject, setSelectedProject] = useState<ProjectApplicationItem | null>(null);
  const [projectHistory, setProjectHistory] = useState<ProjectStatusHistoryItem[]>([]);
  const [editProjectStatus, setEditProjectStatus] = useState<string>("");
  const [editProjectNotes, setEditProjectNotes] = useState<string>("");
  const [editProjectDeclineReason, setEditProjectDeclineReason] = useState<string>("");
  const [editProjectInfoRequested, setEditProjectInfoRequested] = useState<string>("");
  const [isUpdatingProject, setIsUpdatingProject] = useState<boolean>(false);

  // Action status notification
  const [actionMessage, setActionMessage] = useState<string>("");

  useEffect(() => {
    async function loadAdminData() {
      try {
        const meData = await apiClient.auth.me();
        if (!meData.user) {
          router.push("/login");
          return;
        }
        if (meData.user.role !== "ADMIN" && meData.user.role !== "STAFF") {
          router.push("/dashboard");
          return;
        }
        setCurrentUser(meData.user);

        const [prjRes, enqRes, grvRes, prodRes, docRes] = await Promise.allSettled([
          apiClient.projects.list(),
          apiClient.enquiries.list(),
          apiClient.grievances.list(),
          apiClient.products.list(),
          apiClient.documents.list(),
        ]);

        if (prjRes.status === "fulfilled") setProjects(prjRes.value.applications || []);
        if (enqRes.status === "fulfilled") setEnquiries(enqRes.value.enquiries || []);
        if (grvRes.status === "fulfilled") setGrievances(grvRes.value.grievances || []);
        if (prodRes.status === "fulfilled") setProducts(prodRes.value.products || []);
        if (docRes.status === "fulfilled") setDocuments(docRes.value.documents || []);

        if (meData.user.role === "ADMIN") {
          try {
            const auditRes = await apiClient.auditLogs.list();
            setAuditLogs(auditRes.logs || []);
          } catch (err) {
            console.error("Failed to fetch audit logs:", err);
          }
        }
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          router.push("/login");
          return;
        }
        console.error("Admin load failure:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdminData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.auth.logout();
    } finally {
      router.push("/login");
    }
  };

  const handleOpenProjectDetails = async (project: ProjectApplicationItem) => {
    setSelectedProject(project);
    setEditProjectStatus(project.status);
    setEditProjectNotes(project.internal_notes || "");
    setEditProjectDeclineReason(project.decline_reason || "");
    setEditProjectInfoRequested(project.info_requested || "");

    try {
      const details = await apiClient.projects.getById(project.id);
      setSelectedProject(details.application);
      setProjectHistory(details.history || []);
    } catch (err) {
      console.error("Error loading project details:", err);
    }
  };

  const handleSaveProjectReview = async () => {
    if (!selectedProject) return;
    setIsUpdatingProject(true);
    try {
      await apiClient.projects.updateStatus(selectedProject.id, {
        status: editProjectStatus,
        internalNotes: editProjectNotes,
        declineReason: editProjectDeclineReason,
        infoRequested: editProjectInfoRequested,
        changeNote: `Status updated to ${editProjectStatus} by ${currentUser?.name || "Deal Officer"}`,
      });

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
    } catch (err) {
      console.error("Error updating project status:", err);
    } finally {
      setIsUpdatingProject(false);
    }
  };

  const handleUpdateEnquiry = async (id: string, status: string, notes: string) => {
    try {
      await apiClient.enquiries.update(id, { status, internalNotes: notes });
      setActionMessage(`Enquiry ${id} updated to ${status}.`);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status, internal_notes: notes } : e))
      );
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      console.error("Error updating enquiry:", err);
    }
  };

  const handleUpdateGrievance = async (id: string, status: string, notes: string) => {
    try {
      await apiClient.grievances.update(id, { status, resolutionNotes: notes });
      setActionMessage(`Grievance ${id} status updated to ${status}.`);
      setGrievances((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status, resolution_notes: notes } : g))
      );
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      console.error("Error updating grievance:", err);
    }
  };

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
        {activeTab === "overview" && (
          <AdminOverviewTab
            projects={projects}
            enquiries={enquiries}
            grievances={grievances}
            products={products}
            onSelectTab={setActiveTab}
            onOpenProjectDetails={handleOpenProjectDetails}
          />
        )}

        {activeTab === "projects" && (
          <AdminProjectsTab
            projects={projects}
            onOpenProjectDetails={handleOpenProjectDetails}
          />
        )}

        {activeTab === "enquiries" && (
          <AdminEnquiriesTab
            enquiries={enquiries}
            onUpdateEnquiry={handleUpdateEnquiry}
          />
        )}

        {activeTab === "grievances" && (
          <AdminGrievancesTab
            grievances={grievances}
            onUpdateGrievance={handleUpdateGrievance}
          />
        )}

        {activeTab === "products" && <AdminProductsTab products={products} />}

        {activeTab === "documents" && <AdminDocumentsTab documents={documents} />}

        {activeTab === "audit" && currentUser?.role === "ADMIN" && (
          <AdminAuditLogsTab logs={auditLogs} />
        )}
      </main>

      {selectedProject && (
        <ProjectReviewModal
          project={selectedProject}
          history={projectHistory}
          editStatus={editProjectStatus}
          editNotes={editProjectNotes}
          editDeclineReason={editProjectDeclineReason}
          editInfoRequested={editProjectInfoRequested}
          isUpdating={isUpdatingProject}
          onChangeStatus={setEditProjectStatus}
          onChangeNotes={setEditProjectNotes}
          onChangeDeclineReason={setEditProjectDeclineReason}
          onChangeInfoRequested={setEditProjectInfoRequested}
          onClose={() => setSelectedProject(null)}
          onSave={handleSaveProjectReview}
        />
      )}

      <footer className="border-t border-[rgba(26,26,26,0.08)] bg-white py-4 px-8 text-center text-[0.6875rem] text-[#8A8A8A]">
        Niventra Capital Advisory India • Administrative Console • Role: {currentUser?.role}
      </footer>
    </div>
  );
}
