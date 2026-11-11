import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateGrievanceDto, UpdateGrievanceDto } from "./dto/grievance.dto";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
    private readonly notifications: NotificationsService
  ) {}

  async getPlatformOverview() {
    const [
      usersCount,
      enquiriesCount,
      projectsCount,
      grievancesCount,
      activeInvestments,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.enquiry.count(),
      this.prisma.projectApplication.count(),
      this.prisma.grievance.count(),
      this.prisma.investment.count({ where: { status: "ACTIVE" } }),
    ]);

    return {
      totalUsers: usersCount,
      totalEnquiries: enquiriesCount,
      totalProjectApplications: projectsCount,
      totalGrievances: grievancesCount,
      activeInvestments,
      health: "HEALTHY",
      timestamp: new Date().toISOString(),
    };
  }

  async createGrievance(dto: CreateGrievanceDto, currentUser: AuthenticatedUser | null) {
    const count = await this.prisma.grievance.count();
    const ticketId = `GRV-2026-${String(count + 1).padStart(4, "0")}`;
    const slaDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const cleanEmail = dto.email.trim().toLowerCase();

    await this.prisma.grievance.create({
      data: {
        id: ticketId,
        ticketId,
        userId: currentUser?.id || null,
        complainantName: dto.complainantName.trim(),
        email: cleanEmail,
        phone: dto.phone.trim(),
        transactionRef: dto.transactionRef?.trim() || null,
        subject: dto.subject.trim(),
        description: dto.description.trim(),
        status: "SUBMITTED",
        slaDeadline,
      },
    });

    await this.auditLogs.logEvent({
      actorId: currentUser?.id || null,
      actorEmail: cleanEmail,
      actorRole: currentUser?.role || "PUBLIC",
      action: "GRIEVANCE_LODGED",
      resourceType: "GRIEVANCE",
      resourceId: ticketId,
      details: { subject: dto.subject.trim(), hasTransactionRef: Boolean(dto.transactionRef) },
    });

    if (currentUser) {
      await this.notifications.createNotification(
        currentUser.id,
        `Grievance Ticket Lodged: ${ticketId}`,
        `Your grievance regarding "${dto.subject.trim()}" has been registered. Our Grievance Redressal Officer will acknowledge within 48 business hours.`,
        "GRIEVANCE",
        "/dashboard/?tab=grievances"
      );
    }

    return {
      success: true,
      ticketId,
      slaDeadline: slaDeadline.toISOString(),
      message: "Grievance successfully registered with Grievance Redressal Officer.",
    };
  }

  async listGrievances(user: AuthenticatedUser, statusFilter?: string) {
    if (user.role === "ADMIN" || user.role === "STAFF") {
      const where: Prisma.GrievanceWhereInput = {};
      if (statusFilter && statusFilter !== "ALL") {
        where.status = statusFilter;
      }

      const rows = await this.prisma.grievance.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          assignedStaff: { select: { name: true } },
        },
      });

      return {
        grievances: rows.map((row) => ({
          id: row.ticketId || row.id,
          user_id: row.userId,
          complainant_name: row.complainantName,
          email: row.email,
          phone: row.phone,
          transaction_ref: row.transactionRef,
          subject: row.subject,
          description: row.description,
          status: row.status,
          assigned_to: row.assignedTo,
          assigned_to_name: row.assignedStaff?.name || null,
          resolution_notes: row.resolutionNotes,
          sla_deadline: row.slaDeadline.toISOString(),
          created_at: row.createdAt.toISOString(),
          updated_at: row.updatedAt.toISOString(),
        })),
      };
    }

    const rows = await this.prisma.grievance.findMany({
      where: {
        OR: [{ userId: user.id }, { email: user.email }],
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      grievances: rows.map((row) => ({
        id: row.ticketId || row.id,
        subject: row.subject,
        description: row.description,
        status: row.status,
        sla_deadline: row.slaDeadline.toISOString(),
        resolution_notes: row.resolutionNotes,
        created_at: row.createdAt.toISOString(),
        updated_at: row.updatedAt.toISOString(),
      })),
    };
  }

  async resolveGrievance(id: string, dto: UpdateGrievanceDto, actor: AuthenticatedUser) {
    const existing = await this.prisma.grievance.findFirst({
      where: { OR: [{ id }, { ticketId: id }] },
    });

    if (!existing) {
      throw new NotFoundException("Grievance ticket not found.");
    }

    const resolutionNotes =
      dto.resolutionNotes !== undefined ? dto.resolutionNotes : dto.notes;

    const updated = await this.prisma.grievance.update({
      where: { id: existing.id },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.assignedTo !== undefined ? { assignedTo: dto.assignedTo || null } : {}),
        ...(resolutionNotes !== undefined ? { resolutionNotes } : {}),
      },
    });

    await this.auditLogs.logEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "GRIEVANCE_UPDATED",
      resourceType: "GRIEVANCE",
      resourceId: existing.ticketId || existing.id,
      details: {
        previousStatus: existing.status,
        newStatus: updated.status,
        assignedTo: updated.assignedTo,
      },
    });

    if (dto.status && dto.status !== existing.status && existing.userId) {
      await this.notifications.createNotification(
        existing.userId,
        `Grievance Status Update: ${existing.ticketId}`,
        `Your grievance ticket status has transitioned to "${dto.status}".`,
        "GRIEVANCE",
        "/dashboard/?tab=grievances"
      );
    }

    return { success: true, message: "Grievance ticket updated successfully." };
  }
}
