import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Prisma, ProjectCategory, ProjectStatus } from "@prisma/client";
import { randomInt } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateProjectDto, UpdateProjectStatusDto } from "./dto/create-project.dto";

export interface ProjectApplicationListFilters {
  status?: string;
  category?: string;
  state?: string;
  q?: string;
}

const VALID_PROJECT_STATUSES = new Set<string>(Object.values(ProjectStatus));
const VALID_PROJECT_CATEGORIES = new Set<string>(Object.values(ProjectCategory));

@Injectable()
export class ProjectFundingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
    private readonly notifications: NotificationsService
  ) {}

  private generateReferenceNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 7).replace("-", "");
    const randomNum = randomInt(1000, 9999);
    return `PRJ-${dateStr}-${randomNum}`;
  }

  async submitApplication(dto: CreateProjectDto) {
    if (dto.website_hp) {
      return {
        success: true,
        message: "Application received for preliminary evaluation.",
      };
    }

    if (dto.consentGiven === false) {
      throw new BadRequestException("Consent to process submitted information is required.");
    }

    if (dto.fundingRequested > dto.totalCost) {
      throw new BadRequestException("Funding requested cannot exceed the total project cost.");
    }

    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanProjectName = dto.projectName.trim();

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existing = await this.prisma.projectApplication.findFirst({
      where: {
        email: cleanEmail,
        projectName: cleanProjectName,
        createdAt: { gte: tenMinutesAgo },
      },
      select: { id: true, referenceNumber: true },
    });

    if (existing) {
      return {
        success: true,
        referenceNumber: existing.referenceNumber,
        applicationId: existing.id,
        message: "Application already received. Our deal desk will follow up shortly.",
      };
    }

    const sanitizedDocs = (dto.documents || []).map((doc) => ({
      name: String(doc.name || "").replace(/[^\w.-]/g, "_").slice(0, 100),
      category: String(doc.category || "GENERAL").slice(0, 50),
      size: typeof doc.size === "number" ? doc.size : 0,
      uploadedAt: new Date().toISOString(),
      status: "ATTACHED_METADATA",
    }));

    const referenceNumber = this.generateReferenceNumber();

    const application = await this.prisma.projectApplication.create({
      data: {
        referenceNumber,
        applicantName: dto.applicantName.trim(),
        organizationName: dto.organizationName.trim(),
        email: cleanEmail,
        phone: dto.phone.trim(),
        role: dto.role.trim(),
        website: dto.website ? dto.website.trim() : null,
        projectName: cleanProjectName,
        category: dto.category,
        address: dto.address.trim(),
        city: dto.city.trim(),
        state: dto.state.trim(),
        pinCode: dto.pinCode.trim(),
        landStatus: dto.landStatus.trim(),
        stage: dto.stage,
        description: dto.description.trim(),
        totalCost: dto.totalCost,
        fundingRequested: dto.fundingRequested,
        promoterContribution: dto.promoterContribution ?? null,
        useOfFunds: dto.useOfFunds.trim(),
        expectedTimeline: dto.expectedTimeline.trim(),
        existingLoans: dto.existingLoans ? dto.existingLoans.trim() : null,
        documents: sanitizedDocs as Prisma.InputJsonValue,
        consentGiven: true,
        status: "RECEIVED",
        isDemo: false,
        statusHistory: {
          create: {
            previousStatus: null,
            newStatus: "RECEIVED",
            changedBy: "SYSTEM",
            changeNote: "Application submitted online by developer",
          },
        },
      },
    });

    await this.auditLogs.logEvent({
      actorEmail: cleanEmail,
      actorRole: "PUBLIC_APPLICANT",
      action: "PROJECT_FUNDING_SUBMITTED",
      resourceType: "PROJECT_APPLICATION",
      resourceId: application.id,
      details: {
        referenceNumber: application.referenceNumber,
        projectName: application.projectName,
        category: application.category,
      },
    });

    await this.notifications.dispatchProjectFundingNotification({
      referenceNumber: application.referenceNumber,
      applicantName: application.applicantName,
      organizationName: application.organizationName,
      email: application.email,
      phoneNumber: application.phone,
      projectName: application.projectName,
      category: application.category,
      city: application.city,
      state: application.state,
      fundingRequested: Number(application.fundingRequested),
    });

    return {
      success: true,
      referenceNumber: application.referenceNumber,
      applicationId: application.id,
      message:
        "Your project funding application has been successfully submitted for preliminary evaluation.",
    };
  }

  async listApplications(filters: ProjectApplicationListFilters) {
    const where: Prisma.ProjectApplicationWhereInput = {};

    if (filters.status && filters.status !== "ALL") {
      if (!VALID_PROJECT_STATUSES.has(filters.status)) {
        throw new BadRequestException("Unsupported project status filter.");
      }
      where.status = filters.status as ProjectStatus;
    }
    if (filters.category && filters.category !== "ALL") {
      if (!VALID_PROJECT_CATEGORIES.has(filters.category)) {
        throw new BadRequestException("Unsupported project category filter.");
      }
      where.category = filters.category as ProjectCategory;
    }
    if (filters.state && filters.state !== "ALL") {
      where.state = { equals: filters.state, mode: "insensitive" };
    }
    if (filters.q) {
      const q = filters.q.trim();
      where.OR = [
        { referenceNumber: { contains: q, mode: "insensitive" } },
        { projectName: { contains: q, mode: "insensitive" } },
        { organizationName: { contains: q, mode: "insensitive" } },
        { applicantName: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
      ];
    }

    const [rows, counts] = await Promise.all([
      this.prisma.projectApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      this.prisma.projectApplication.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    const applications = rows.map((app) => ({
      id: app.id,
      reference_number: app.referenceNumber,
      applicant_name: app.applicantName,
      organization_name: app.organizationName,
      email: app.email,
      phone: app.phone,
      role: app.role,
      website: app.website,
      project_name: app.projectName,
      category: app.category,
      city: app.city,
      state: app.state,
      pin_code: app.pinCode,
      stage: app.stage,
      total_cost: Number(app.totalCost),
      funding_requested: Number(app.fundingRequested),
      promoter_contribution: app.promoterContribution ? Number(app.promoterContribution) : null,
      status: app.status,
      internal_notes: app.internalNotes,
      decline_reason: app.declineReason,
      info_requested: app.infoRequested,
      created_at: app.createdAt.toISOString(),
      updated_at: app.updatedAt.toISOString(),
    }));

    const statusCounts = counts.map((c) => ({
      status: c.status,
      count: c._count.status,
    }));

    return {
      applications,
      totalCount: applications.length,
      statusCounts,
    };
  }

  async getApplicationById(id: string) {
    const application = await this.prisma.projectApplication.findUnique({
      where: { id },
      include: {
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
        assignedStaff: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!application) {
      throw new NotFoundException("Project application not found.");
    }

    return {
      application: {
        id: application.id,
        reference_number: application.referenceNumber,
        applicant_name: application.applicantName,
        organization_name: application.organizationName,
        email: application.email,
        phone: application.phone,
        role: application.role,
        website: application.website,
        project_name: application.projectName,
        category: application.category,
        address: application.address,
        city: application.city,
        state: application.state,
        pin_code: application.pinCode,
        land_status: application.landStatus,
        stage: application.stage,
        description: application.description,
        total_cost: Number(application.totalCost),
        funding_requested: Number(application.fundingRequested),
        promoter_contribution: application.promoterContribution
          ? Number(application.promoterContribution)
          : null,
        use_of_funds: application.useOfFunds,
        expected_timeline: application.expectedTimeline,
        existing_loans: application.existingLoans,
        documents: application.documents,
        status: application.status,
        internal_notes: application.internalNotes,
        decline_reason: application.declineReason,
        info_requested: application.infoRequested,
        assigned_staff: application.assignedStaff,
        created_at: application.createdAt.toISOString(),
        updated_at: application.updatedAt.toISOString(),
      },
      history: application.statusHistory.map((item) => ({
        id: item.id,
        previous_status: item.previousStatus,
        new_status: item.newStatus,
        changed_by: item.changedBy,
        change_note: item.changeNote,
        created_at: item.createdAt.toISOString(),
      })),
    };
  }

  async updateStatus(id: string, dto: UpdateProjectStatusDto, actor: AuthenticatedUser) {
    const current = await this.prisma.projectApplication.findUnique({
      where: { id },
    });

    if (!current) {
      throw new NotFoundException("Project application not found.");
    }

    const previousStatus = current.status;
    const newStatus = dto.status || current.status;
    const actorName = actor.name || actor.email;

    await this.prisma.$transaction(async (tx) => {
      await tx.projectApplication.update({
        where: { id },
        data: {
          status: newStatus,
          internalNotes: dto.internalNotes !== undefined ? dto.internalNotes : current.internalNotes,
          declineReason: dto.declineReason !== undefined ? dto.declineReason : current.declineReason,
          infoRequested: dto.infoRequested !== undefined ? dto.infoRequested : current.infoRequested,
          assignedTo: current.assignedTo || actor.id,
        },
      });

      if (newStatus !== previousStatus || dto.changeNote) {
        await tx.projectStatusHistory.create({
          data: {
            projectId: id,
            previousStatus,
            newStatus,
            changedBy: actorName,
            changeNote:
              dto.changeNote || `Status updated from ${previousStatus} to ${newStatus}`,
          },
        });
      }
    });

    await this.auditLogs.logEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "PROJECT_FUNDING_STATUS_UPDATED",
      resourceType: "PROJECT_APPLICATION",
      resourceId: id,
      details: {
        previousStatus,
        newStatus,
        referenceNumber: current.referenceNumber,
      },
    });

    return {
      success: true,
      message: `Project application ${current.referenceNumber} updated successfully.`,
      status: newStatus,
    };
  }
}
