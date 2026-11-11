import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { CreateEnquiryDto, UpdateEnquiryDto } from "./dto/create-enquiry.dto";

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
    private readonly notifications: NotificationsService
  ) {}

  async createEnquiry(dto: CreateEnquiryDto, currentUser: AuthenticatedUser | null) {
    if (dto.website_hp) {
      throw new BadRequestException("Automated submission rejected.");
    }

    if (dto.consent === false) {
      throw new BadRequestException("DPDP Act data processing consent is required to proceed.");
    }

    const cleanEmail = dto.email.trim().toLowerCase();
    const cleanPhone = dto.phoneNumber.trim();
    const cleanName = dto.fullName.trim();
    const category = dto.category || "Capital Provider / Investor";
    const capitalRange = dto.capitalRange || "₹25 Lakh – ₹1 Crore";
    const message = dto.message?.trim() || null;

    const sixtySecsAgo = new Date(Date.now() - 60 * 1000);
    const recent = await this.prisma.enquiry.findFirst({
      where: {
        email: cleanEmail,
        phoneNumber: cleanPhone,
        createdAt: { gte: sixtySecsAgo },
      },
      select: { referenceId: true },
    });

    if (recent) {
      return {
        success: true,
        referenceId: recent.referenceId,
        message: "Enquiry already recorded. Our advisory desk has your details.",
      };
    }

    const count = await this.prisma.enquiry.count();
    const referenceId = `ENQ-2026-${String(count + 1).padStart(4, "0")}`;

    const enquiry = await this.prisma.enquiry.create({
      data: {
        id: referenceId,
        referenceId,
        userId: currentUser?.id || null,
        fullName: cleanName,
        email: cleanEmail,
        phoneNumber: cleanPhone,
        category,
        capitalRange,
        message,
        consent: true,
        status: "NEW",
      },
    });

    await this.auditLogs.logEvent({
      actorId: currentUser?.id || null,
      actorEmail: cleanEmail,
      actorRole: currentUser?.role || "PUBLIC",
      action: "ENQUIRY_SUBMITTED",
      resourceType: "ENQUIRY",
      resourceId: referenceId,
      details: {
        category,
        capitalRange,
        hasUserAccount: Boolean(currentUser),
      },
    });

    await this.notifications.dispatchLeadNotification({
      referenceId,
      fullName: cleanName,
      email: cleanEmail,
      phoneNumber: cleanPhone,
      category,
      capitalRange,
      message,
    });

    if (currentUser) {
      await this.notifications.createNotification(
        currentUser.id,
        `Enquiry Received: ${referenceId}`,
        `Your consultation enquiry (${category}) has been logged. Our advisory desk will review and contact you within one business day.`,
        "ENQUIRY",
        "/dashboard/?tab=enquiries"
      );
    }

    return {
      success: true,
      referenceId: enquiry.referenceId,
      message: "Enquiry successfully logged in advisory registry.",
    };
  }

  async listEnquiries(user: AuthenticatedUser, statusFilter?: string) {
    if (user.role === "ADMIN" || user.role === "STAFF") {
      const where: Prisma.EnquiryWhereInput = {};
      if (statusFilter && statusFilter !== "ALL") {
        where.status = statusFilter;
      }

      const rows = await this.prisma.enquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          assignedStaff: { select: { name: true } },
        },
      });

      return {
        enquiries: rows.map((row) => ({
          id: row.referenceId || row.id,
          user_id: row.userId,
          full_name: row.fullName,
          email: row.email,
          phone_number: row.phoneNumber,
          category: row.category,
          capital_range: row.capitalRange,
          message: row.message,
          status: row.status,
          assigned_to: row.assignedTo,
          assigned_to_name: row.assignedStaff?.name || null,
          internal_notes: row.internalNotes,
          created_at: row.createdAt.toISOString(),
          updated_at: row.updatedAt.toISOString(),
        })),
      };
    }

    const rows = await this.prisma.enquiry.findMany({
      where: {
        OR: [{ userId: user.id }, { email: user.email }],
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      enquiries: rows.map((row) => ({
        id: row.referenceId || row.id,
        category: row.category,
        capital_range: row.capitalRange,
        message: row.message,
        status: row.status,
        created_at: row.createdAt.toISOString(),
        updated_at: row.updatedAt.toISOString(),
      })),
    };
  }

  async updateEnquiry(id: string, dto: UpdateEnquiryDto, actor: AuthenticatedUser) {
    const existing = await this.prisma.enquiry.findFirst({
      where: { OR: [{ id }, { referenceId: id }] },
    });

    if (!existing) {
      throw new NotFoundException("Enquiry not found.");
    }

    await this.prisma.enquiry.update({
      where: { id: existing.id },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.assignedTo !== undefined ? { assignedTo: dto.assignedTo || null } : {}),
        ...(dto.internalNotes !== undefined ? { internalNotes: dto.internalNotes } : {}),
      },
    });

    await this.auditLogs.logEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "ENQUIRY_UPDATED",
      resourceType: "ENQUIRY",
      resourceId: existing.referenceId || existing.id,
      details: {
        previousStatus: existing.status,
        newStatus: dto.status ?? existing.status,
        assignedTo: dto.assignedTo ?? existing.assignedTo,
      },
    });

    if (dto.status && dto.status !== existing.status && existing.userId) {
      await this.notifications.createNotification(
        existing.userId,
        `Enquiry Status Update: ${existing.referenceId}`,
        `Your advisory enquiry status has transitioned to "${dto.status}".`,
        "ENQUIRY",
        "/dashboard/?tab=enquiries"
      );
    }

    return { success: true, message: "Enquiry updated successfully." };
  }
}
