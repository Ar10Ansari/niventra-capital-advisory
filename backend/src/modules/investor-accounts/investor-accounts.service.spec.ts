import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InvestorAccountsService } from "./investor-accounts.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";

describe("InvestorAccountsService", () => {
  let service: InvestorAccountsService;
  let mockPrisma: {
    kycRecord: { findUnique: jest.Mock; upsert: jest.Mock; update: jest.Mock };
  };
  let mockAuditLogs: { logEvent: jest.Mock };
  let mockNotifications: { createNotification: jest.Mock };

  const investor: AuthenticatedUser = {
    id: "usr_inv_1",
    name: "Investor One",
    email: "inv1@example.com",
    role: "INVESTOR",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  const complianceAdmin: AuthenticatedUser = {
    id: "usr_admin",
    name: "Compliance Admin",
    email: "admin@niventra.local",
    role: "ADMIN",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  beforeEach(() => {
    mockPrisma = {
      kycRecord: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
      },
    };
    mockAuditLogs = { logEvent: jest.fn().mockResolvedValue(undefined) };
    mockNotifications = { createNotification: jest.fn().mockResolvedValue(undefined) };

    service = new InvestorAccountsService(
      mockPrisma as unknown as PrismaService,
      mockAuditLogs as unknown as AuditLogsService,
      mockNotifications as unknown as NotificationsService
    );
  });

  it("should reject cross-investor KYC lookup with ForbiddenException (403)", async () => {
    await expect(service.getKycRecord(investor, "usr_inv_other")).rejects.toThrow(
      ForbiddenException
    );
    expect(mockPrisma.kycRecord.findUnique).not.toHaveBeenCalled();
  });

  it("should enforce mandatory DPDP Act consent during KYC submission", async () => {
    await expect(
      service.submitKyc(investor, {
        panNumber: "ABCDE1234F",
        idType: "AADHAAR",
        idNumber: "123456789012",
        consent: false,
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should mask sensitive PAN and identity numbers before persisting KYC", async () => {
    mockPrisma.kycRecord.upsert.mockResolvedValueOnce({
      id: "kyc_1",
      userId: investor.id,
      status: "PENDING_VERIFICATION",
    });

    const result = await service.submitKyc(investor, {
      panNumber: "ABCDE1234F",
      idType: "AADHAAR",
      idNumber: "123456789012",
      consent: true,
    });

    expect(mockPrisma.kycRecord.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          panMasked: "AB*****4F",
          idNumberMasked: "********9012",
          status: "PENDING_VERIFICATION",
          dpdpConsent: true,
        }),
      })
    );
    expect(result.status).toBe("PENDING_VERIFICATION");
    expect(mockAuditLogs.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "KYC_SUBMITTED" })
    );
  });

  it("should update KYC status, notify investor, and throw NotFoundException if record missing", async () => {
    mockPrisma.kycRecord.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.updateKycStatus({ userId: "missing", status: "VERIFIED" }, complianceAdmin)
    ).rejects.toThrow(NotFoundException);

    mockPrisma.kycRecord.findUnique.mockResolvedValueOnce({
      id: "kyc_1",
      userId: investor.id,
      status: "PENDING_VERIFICATION",
    });
    mockPrisma.kycRecord.update.mockResolvedValueOnce({
      id: "kyc_1",
      userId: investor.id,
      status: "VERIFIED",
    });

    const res = await service.updateKycStatus(
      { userId: investor.id, status: "VERIFIED" },
      complianceAdmin
    );
    expect(res.success).toBe(true);
    expect(mockNotifications.createNotification).toHaveBeenCalledWith(
      investor.id,
      expect.stringContaining("VERIFIED"),
      expect.any(String),
      "SYSTEM",
      "/dashboard/settings/"
    );
  });
});
