import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { logAudit } from "@/lib/audit";
import { dispatchProjectFundingNotification } from "@/lib/notifications";

const VALID_CATEGORIES = [
  "RESIDENTIAL",
  "COMMERCIAL",
  "MIXED_USE",
  "PLOTTED_DEVELOPMENT",
  "REDEVELOPMENT",
  "INDUSTRIAL",
  "OTHER",
];

const VALID_STAGES = [
  "LAND_ACQUISITION",
  "PLANNING_APPROVALS",
  "UNDER_CONSTRUCTION",
  "COMPLETED",
  "OTHER",
];

function generateReferenceNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 7).replace("-", "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PRJ-${dateStr}-${randomNum}`;
}

/**
 * POST /api/project-funding
 * Public project submission endpoint
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      website_hp,
      applicantName,
      organizationName,
      email,
      phone,
      role,
      website,
      projectName,
      category,
      address,
      city,
      state,
      pinCode,
      landStatus,
      stage,
      description,
      totalCost,
      fundingRequested,
      promoterContribution,
      useOfFunds,
      expectedTimeline,
      existingLoans,
      documents = [],
      consentGiven,
    } = body;

    // Honeypot bot protection
    if (website_hp) {
      return NextResponse.json(
        { success: true, message: "Application received for preliminary evaluation." },
        { status: 200 }
      );
    }

    // 1. Mandatory Validations
    if (!applicantName || typeof applicantName !== "string" || applicantName.trim().length < 2) {
      return NextResponse.json({ error: "Applicant full name is required (min 2 characters)." }, { status: 400 });
    }
    if (!organizationName || typeof organizationName !== "string" || organizationName.trim().length < 2) {
      return NextResponse.json({ error: "Organization/developer name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid business email address is required." }, { status: 400 });
    }
    if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
      return NextResponse.json({ error: "A valid contact phone number is required." }, { status: 400 });
    }
    if (!role || typeof role !== "string" || role.trim().length < 2) {
      return NextResponse.json({ error: "Applicant role/designation is required." }, { status: 400 });
    }
    if (!projectName || typeof projectName !== "string" || projectName.trim().length < 2) {
      return NextResponse.json({ error: "Project name is required." }, { status: 400 });
    }
    const normalizedCategory = String(category || "").toUpperCase();
    if (!VALID_CATEGORIES.includes(normalizedCategory)) {
      return NextResponse.json({ error: "Invalid project category." }, { status: 400 });
    }
    if (!address || typeof address !== "string" || address.trim().length < 5) {
      return NextResponse.json({ error: "Project address is required." }, { status: 400 });
    }
    if (!city || typeof city !== "string" || city.trim().length < 2) {
      return NextResponse.json({ error: "Project city is required." }, { status: 400 });
    }
    if (!state || typeof state !== "string" || state.trim().length < 2) {
      return NextResponse.json({ error: "Project state is required." }, { status: 400 });
    }
    if (!pinCode || typeof pinCode !== "string" || !/^\d{6}$/.test(pinCode.trim())) {
      return NextResponse.json({ error: "A valid 6-digit postal PIN code is required." }, { status: 400 });
    }
    if (!landStatus || typeof landStatus !== "string" || landStatus.trim().length < 2) {
      return NextResponse.json({ error: "Land ownership or development-rights status is required." }, { status: 400 });
    }
    const normalizedStage = String(stage || "").toUpperCase();
    if (!VALID_STAGES.includes(normalizedStage)) {
      return NextResponse.json({ error: "Invalid project stage." }, { status: 400 });
    }
    if (!description || typeof description !== "string" || description.trim().length < 20) {
      return NextResponse.json({ error: "Please provide a project description (at least 20 characters)." }, { status: 400 });
    }

    const numTotalCost = Number(totalCost);
    if (isNaN(numTotalCost) || numTotalCost <= 0) {
      return NextResponse.json({ error: "Total project cost must be a positive number." }, { status: 400 });
    }

    const numFundingRequested = Number(fundingRequested);
    if (isNaN(numFundingRequested) || numFundingRequested <= 0) {
      return NextResponse.json({ error: "Funding requested must be a positive number." }, { status: 400 });
    }
    if (numFundingRequested > numTotalCost) {
      return NextResponse.json({ error: "Funding requested cannot exceed the total project cost." }, { status: 400 });
    }

    const numPromoterContribution = promoterContribution ? Number(promoterContribution) : null;
    if (numPromoterContribution !== null && (isNaN(numPromoterContribution) || numPromoterContribution < 0)) {
      return NextResponse.json({ error: "Promoter's contribution must be a non-negative number." }, { status: 400 });
    }

    if (!useOfFunds || typeof useOfFunds !== "string" || useOfFunds.trim().length < 5) {
      return NextResponse.json({ error: "Proposed use of funds is required." }, { status: 400 });
    }
    if (!expectedTimeline || typeof expectedTimeline !== "string" || expectedTimeline.trim().length < 2) {
      return NextResponse.json({ error: "Expected project timeline is required." }, { status: 400 });
    }
    if (!consentGiven) {
      return NextResponse.json({ error: "Consent to process submitted information is required." }, { status: 400 });
    }

    // 2. Duplicate Check (within 10 minutes)
    const duplicateCheck = db.prepare(`
      SELECT id, reference_number FROM project_applications
      WHERE LOWER(email) = LOWER(?) AND LOWER(project_name) = LOWER(?)
        AND created_at >= datetime('now', '-10 minutes')
      LIMIT 1
    `).get(email.trim(), projectName.trim()) as { id: string; reference_number: string } | undefined;

    if (duplicateCheck) {
      return NextResponse.json(
        {
          success: true,
          referenceNumber: duplicateCheck.reference_number,
          applicationId: duplicateCheck.id,
          message: "Application already received. Our deal desk will follow up shortly.",
        },
        { status: 200 }
      );
    }

    // 3. Document Metadata Sanitization
    const sanitizedDocs = Array.isArray(documents)
      ? documents.map((doc: { name?: string; type?: string; size?: number; category?: string }) => ({
          name: String(doc.name || "").replace(/[^\w.-]/g, "_").slice(0, 100),
          category: String(doc.category || "GENERAL").slice(0, 50),
          size: typeof doc.size === "number" ? doc.size : 0,
          uploadedAt: new Date().toISOString(),
          status: "ATTACHED_METADATA",
        }))
      : [];

    // 4. Persistence
    const id = `prj_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const referenceNumber = generateReferenceNumber();

    const insertStmt = db.prepare(`
      INSERT INTO project_applications (
        id, reference_number, applicant_name, organization_name,
        email, phone, role, website,
        project_name, category, address, city, state, pin_code,
        land_status, stage, description, total_cost, funding_requested,
        promoter_contribution, use_of_funds, expected_timeline, existing_loans,
        documents, consent_given, status, is_demo
      ) VALUES (
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, 'RECEIVED', 0
      )
    `);

    insertStmt.run(
      id,
      referenceNumber,
      applicantName.trim(),
      organizationName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      role.trim(),
      website ? String(website).trim() : null,
      projectName.trim(),
      normalizedCategory,
      address.trim(),
      city.trim(),
      state.trim(),
      pinCode.trim(),
      landStatus.trim(),
      normalizedStage,
      description.trim(),
      numTotalCost,
      numFundingRequested,
      numPromoterContribution,
      useOfFunds.trim(),
      expectedTimeline.trim(),
      existingLoans ? String(existingLoans).trim() : null,
      JSON.stringify(sanitizedDocs),
      1
    );

    // 5. Initial Status History Record
    const historyStmt = db.prepare(`
      INSERT INTO project_status_history (
        id, project_id, previous_status, new_status, changed_by, change_note
      ) VALUES (?, ?, NULL, 'RECEIVED', 'SYSTEM', 'Application submitted online by developer')
    `);
    historyStmt.run(`psh_${crypto.randomUUID().slice(0, 12)}`, id);

    // 6. Audit Logging
    logAudit({
      actorRole: "PUBLIC_APPLICANT",
      actorEmail: email.trim().toLowerCase(),
      action: "PROJECT_FUNDING_SUBMITTED",
      resourceType: "PROJECT_APPLICATION",
      resourceId: id,
      details: JSON.stringify({ referenceNumber, projectName: projectName.trim(), category: normalizedCategory }),
    });

    // 7. Notification Dispatch
    await dispatchProjectFundingNotification({
      referenceNumber,
      applicantName: applicantName.trim(),
      organizationName: organizationName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phone.trim(),
      projectName: projectName.trim(),
      category: normalizedCategory,
      city: city.trim(),
      state: state.trim(),
      fundingRequested: numFundingRequested,
    });

    return NextResponse.json({
      success: true,
      referenceNumber,
      applicationId: id,
      message: "Your project funding application has been successfully submitted for preliminary evaluation.",
    });
  } catch (err: unknown) {
    console.error("Project submission error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your application. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/project-funding
 * Admin/Staff list endpoint with filters and pagination
 */
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized access to project applications." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const category = searchParams.get("category") || "ALL";
    const state = searchParams.get("state") || "ALL";
    const query = (searchParams.get("q") || "").trim().toLowerCase();

    let sql = `
      SELECT id, reference_number, applicant_name, organization_name, email, phone, role,
             project_name, category, city, state, pin_code, stage, total_cost, funding_requested,
             promoter_contribution, status, created_at, updated_at
      FROM project_applications
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (status !== "ALL") {
      sql += " AND status = ?";
      params.push(status);
    }
    if (category !== "ALL") {
      sql += " AND category = ?";
      params.push(category);
    }
    if (state !== "ALL") {
      sql += " AND LOWER(state) = LOWER(?)";
      params.push(state);
    }
    if (query) {
      sql += ` AND (
        LOWER(reference_number) LIKE ? OR
        LOWER(project_name) LIKE ? OR
        LOWER(organization_name) LIKE ? OR
        LOWER(applicant_name) LIKE ? OR
        LOWER(city) LIKE ?
      )`;
      const qParam = `%${query}%`;
      params.push(qParam, qParam, qParam, qParam, qParam);
    }

    sql += " ORDER BY created_at DESC LIMIT 100";

    const applications = db.prepare(sql).all(...params);

    // Summary counts
    const counts = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM project_applications
      GROUP BY status
    `).all() as { status: string; count: number }[];

    return NextResponse.json({
      applications,
      totalCount: applications.length,
      statusCounts: counts,
    });
  } catch (err: unknown) {
    console.error("Admin fetch projects error:", err);
    return NextResponse.json({ error: "Failed to retrieve project applications." }, { status: 500 });
  }
}
