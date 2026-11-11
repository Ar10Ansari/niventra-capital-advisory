import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { maskIdNumber, maskPan } from "../../common/utils/masking";
import { SubmitKycDto, UpdateKycStatusDto } from "./dto/submit-kyc.dto";

@Injectable()
export class InvestorAccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
    private readonly notifications: NotificationsService
  ) {}

  async getKycRecord(requestingUser: AuthenticatedUser, targetUserId?: string) {
    if (requestingUser.role === "INVESTOR" && targetUserId && targetUserId !== requestingUser.id) {
      throw new ForbiddenException("Forbidden: You cannot access KYC records of another investor.");
    }

    const queryUserId =
      (requestingUser.role === "ADMIN" || requestingUser.role === "STAFF") && targetUserId
        ? targetUserId
        : requestingUser.id;

    const kyc = await this.prisma.kycRecord.findUnique({
      where: { userId: queryUserId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!kyc) {
      return { success: true, kyc: null, status: "NOT_SUBMITTED" };
    }

    return {
      success: true,
      kyc: {
        id: kyc.id,
        user_id: kyc.userId,
        user_name: kyc.user.name,
        user_email: kyc.user.email,
        pan_number_masked: kyc.panMasked || "",
        id_type: kyc.idType || "PAN",
        id_number_masked: kyc.idNumberMasked || "",
        status: kyc.status,
        verified_at: kyc.verifiedAt ? kyc.verifiedAt.toISOString() : null,
        rejection_reason: kyc.rejectionReason,
        dpdp_consent: kyc.dpdpConsent ? 1 : 0,
      },
      status: kyc.status,
    };
  }

  async submitKyc(user: AuthenticatedUser, dto: SubmitKycDto) {
    if (!dto.consent) {
      throw new BadRequestException("DPDP Act consent is mandatory for regulatory identity verification.");
    }

    const panMasked = maskPan(dto.panNumber);
    const idNumberMasked = maskIdNumber(dto.idNumber);

    const kyc = await this.prisma.kycRecord.upsert({
      where: { userId: user.id },
      update: {
        panMasked,
        idType: dto.idType,
        idNumberMasked,
        status: "PENDING_VERIFICATION",
        rejectionReason: null,
        dpdpConsent: true,
      },
      create: {
        userId: user.id,
        panMasked,
        idType: dto.idType,
        idNumberMasked,
        status: "PENDING_VERIFICATION",
        dpdpConsent: true,
      },
    });

    await this.auditLogs.logEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "KYC_SUBMITTED",
      resourceType: "KYC",
      resourceId: kyc.id,
      details: { maskedPan: panMasked, idType: dto.idType },
    });

    return {
      success: true,
      message: "KYC documentation submitted for institutional compliance verification.",
      status: kyc.status,
    };
  }

  async updateKycStatus(dto: UpdateKycStatusDto, actor: AuthenticatedUser) {
    const existing = await this.prisma.kycRecord.findUnique({
      where: { userId: dto.userId },
    });

    if (!existing) {
      throw new NotFoundException("KYC record not found for user.");
    }

    const verifiedAt = dto.status === "VERIFIED" ? new Date() : null;
    const rejectionReason =
      dto.status === "REJECTED" ? dto.rejectionReason || "Identity document mismatch" : null;

    const updated = await this.prisma.kycRecord.update({
      where: { userId: dto.userId },
      data: {
        status: dto.status,
        verifiedAt,
        rejectionReason,
      },
    });

    await this.auditLogs.logEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "KYC_STATUS_UPDATED",
      resourceType: "KYC",
      resourceId: existing.id,
      details: {
        previousStatus: existing.status,
        newStatus: updated.status,
        reason: rejectionReason,
      },
    });

    await this.notifications.createNotification(
      dto.userId,
      `KYC Compliance Status: ${updated.status}`,
      updated.status === "VERIFIED"
        ? "Your institutional KYC documents have been reviewed and verified by compliance."
        : `Your KYC submission was not approved: ${rejectionReason}. Please update your identity details.`,
      "SYSTEM",
      "/dashboard/settings/"
    );

    return {
      success: true,
      message: `KYC status transitioned to ${updated.status}.`,
    };
  }
}
