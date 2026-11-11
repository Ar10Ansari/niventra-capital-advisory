import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "../auth/auth.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import {
  UpdateProfileDto,
  UpdatePreferencesDto,
  ChangePasswordDto,
  DeletionRequestDto,
} from "./dto/update-profile.dto";

const ALLOWED_CATEGORIES = new Set(["HNI", "FAMILY_OFFICE", "CORPORATE", "INSTITUTIONAL"]);

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly auditLogs: AuditLogsService,
    private readonly notifications: NotificationsService
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        investorCategory: true,
        notifyConsultations: true,
        notifyDisclosures: true,
        notifyGrievances: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return this.authService.toSafeUser(user);
  }

  async updateProfile(user: AuthenticatedUser, dto: UpdateProfileDto) {
    const trimmedName = dto.name.trim();
    const trimmedPhone = dto.phone ? dto.phone.trim() : null;

    let normalizedCategory = user.investor_category ?? null;
    if (dto.investorCategory !== undefined) {
      const cat = dto.investorCategory ? dto.investorCategory.trim().toUpperCase() : "";
      if (!cat) {
        normalizedCategory = null;
      } else if (ALLOWED_CATEGORIES.has(cat)) {
        normalizedCategory = cat;
      } else {
        throw new BadRequestException("Unsupported investor category selection.");
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: trimmedName,
        phone: trimmedPhone,
        investorCategory: normalizedCategory,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        investorCategory: true,
        notifyConsultations: true,
        notifyDisclosures: true,
        notifyGrievances: true,
        status: true,
        createdAt: true,
      },
    });

    await this.auditLogs.logEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "USER_PROFILE_UPDATED",
      resourceType: "USER",
      resourceId: user.id,
      details: {
        updatedFields: [
          "name",
          "phone",
          ...(dto.investorCategory !== undefined ? ["investorCategory"] : []),
        ],
      },
    });

    return {
      success: true,
      message: "Profile updated successfully.",
      user: this.authService.toSafeUser(updated),
    };
  }

  async getPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        notifyConsultations: true,
        notifyDisclosures: true,
        notifyGrievances: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return {
      success: true,
      preferences: {
        notifyConsultations: user.notifyConsultations,
        notifyDisclosures: user.notifyDisclosures,
        notifyGrievances: user.notifyGrievances,
      },
    };
  }

  async updatePreferences(user: AuthenticatedUser, dto: UpdatePreferencesDto) {
    if (
      typeof dto.notifyConsultations !== "boolean" &&
      typeof dto.notifyDisclosures !== "boolean" &&
      typeof dto.notifyGrievances !== "boolean"
    ) {
      throw new BadRequestException("At least one boolean notification preference is required.");
    }

    const current = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: {
        notifyConsultations: true,
        notifyDisclosures: true,
        notifyGrievances: true,
      },
    });

    if (!current) {
      throw new NotFoundException("User not found.");
    }

    const nextConsultations =
      typeof dto.notifyConsultations === "boolean"
        ? dto.notifyConsultations
        : current.notifyConsultations;
    const nextDisclosures =
      typeof dto.notifyDisclosures === "boolean"
        ? dto.notifyDisclosures
        : current.notifyDisclosures;
    const nextGrievances =
      typeof dto.notifyGrievances === "boolean"
        ? dto.notifyGrievances
        : current.notifyGrievances;

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        notifyConsultations: nextConsultations,
        notifyDisclosures: nextDisclosures,
        notifyGrievances: nextGrievances,
      },
    });

    await this.auditLogs.logEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "NOTIFICATION_PREFERENCES_UPDATED",
      resourceType: "USER",
      resourceId: user.id,
      details: {
        notifyConsultations: nextConsultations,
        notifyDisclosures: nextDisclosures,
        notifyGrievances: nextGrievances,
      },
    });

    return {
      success: true,
      message: "Notification preferences updated successfully.",
      preferences: {
        notifyConsultations: nextConsultations,
        notifyDisclosures: nextDisclosures,
        notifyGrievances: nextGrievances,
      },
    };
  }

  async changePassword(user: AuthenticatedUser, dto: ChangePasswordDto) {
    const record = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, role: true, passwordHash: true, salt: true },
    });

    if (!record || !this.authService.verifyPassword(dto.currentPassword, record.passwordHash, record.salt)) {
      await this.auditLogs.logEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: "PASSWORD_CHANGE_FAILED",
        resourceType: "CREDENTIALS",
        status: "FAILED",
        details: { reason: "Incorrect current password" },
      });
      throw new ForbiddenException("Current password verification failed.");
    }

    const { hash, salt } = this.authService.hashPassword(dto.newPassword);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: hash, salt },
      });

      // Immediately revoke all existing session cookies and sid-bound Bearer JWTs
      await tx.session.deleteMany({
        where: { userId: user.id },
      });
    });

    await this.auditLogs.logEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "PASSWORD_CHANGED_SUCCESS",
      resourceType: "CREDENTIALS",
      details: { sessionsRevoked: true },
      status: "SUCCESS",
    });

    return {
      success: true,
      requiresReauth: true,
      message: "Password updated successfully. All active sessions have been revoked; please sign in again.",
    };
  }

  async requestDeletion(authUser: AuthenticatedUser | null, dto: DeletionRequestDto) {
    const requestEmail = authUser ? authUser.email : dto.email?.trim().toLowerCase();
    const requestName = authUser ? authUser.name : dto.fullName?.trim();
    const requestPhone = authUser ? authUser.phone || dto.phone?.trim() : dto.phone?.trim();

    if (!requestEmail || !requestName || !requestPhone) {
      throw new BadRequestException("Full legal name, email, and phone number are required.");
    }

    if (authUser) {
      if (!dto.password || !dto.password.trim()) {
        throw new BadRequestException(
          "Current password verification is required for authenticated account deletion."
        );
      }
      const userRow = await this.prisma.user.findUnique({
        where: { id: authUser.id },
        select: { passwordHash: true, salt: true },
      });
      if (!userRow || !this.authService.verifyPassword(dto.password, userRow.passwordHash, userRow.salt)) {
        throw new ForbiddenException("Incorrect password verification.");
      }
    }

    const count = await this.prisma.deletionRequest.count();
    const requestId = `DEL-2026-${String(count + 1).padStart(4, "0")}`;

    const statutoryRetentionNotes =
      "Subject to mandatory financial record retention (Companies Act 2013: 8 years for debenture registers; PMLA 2002: 5 years for CDD records; Income Tax Act 1961: audit assessment periods). Marketing and prospective enquiry profiles queued for purging.";

    const deletion = await this.prisma.$transaction(async (tx) => {
      const created = await tx.deletionRequest.create({
        data: {
          id: requestId,
          requestId,
          userId: authUser?.id || null,
          fullName: requestName,
          email: requestEmail,
          phone: requestPhone,
          reason: dto.reason?.trim() || null,
          status: "PENDING",
          statutoryRetentionNotes,
        },
      });

      if (authUser) {
        await tx.user.update({
          where: { id: authUser.id },
          data: { status: "PENDING_DELETION" },
        });
        await tx.session.deleteMany({
          where: { userId: authUser.id },
        });
      }

      return created;
    });

    if (authUser) {
      await this.notifications.createNotification(
        authUser.id,
        `Data Erasure Request Received: ${requestId}`,
        "Your request for personal data erasure has been queued (SLA: 7–14 business days). You will receive final confirmation once verified.",
        "SECURITY",
        "/dashboard/settings/"
      );
    }

    await this.auditLogs.logEvent({
      actorId: authUser?.id || null,
      actorEmail: requestEmail,
      actorRole: authUser?.role || "PUBLIC",
      action: "ACCOUNT_DELETION_REQUESTED",
      resourceType: "DATA_ERASURE",
      resourceId: requestId,
      details: { statutoryRetentionNotes },
    });

    return {
      success: true,
      requestId: deletion.requestId,
      slaDays: "7 to 14 Business Days",
      message: "Data erasure request successfully queued under DPDP Act 2023.",
    };
  }
}
