import { BadRequestException, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InvestmentsService } from "./investments.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";

describe("InvestmentsService", () => {
  let service: InvestmentsService;
  let mockPrisma: {
    investment: { findMany: jest.Mock; findUnique: jest.Mock };
    product: { findMany: jest.Mock; findUnique: jest.Mock; create: jest.Mock };
  };
  let mockAuditLogs: { logEvent: jest.Mock };

  const investorA: AuthenticatedUser = {
    id: "usr_investor_a",
    name: "Investor A",
    email: "a@example.com",
    role: "INVESTOR",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  const adminUser: AuthenticatedUser = {
    id: "usr_admin",
    name: "Admin",
    email: "admin@niventra.local",
    role: "ADMIN",
    status: "ACTIVE",
    created_at: "2026-10-01T00:00:00.000Z",
  };

  beforeEach(() => {
    mockPrisma = {
      investment: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    mockAuditLogs = { logEvent: jest.fn().mockResolvedValue(undefined) };

    service = new InvestmentsService(
      mockPrisma as unknown as PrismaService,
      mockAuditLogs as unknown as AuditLogsService
    );
  });

  it("should strictly forbid an investor from querying another investor's investments (403)", async () => {
    await expect(service.listInvestments(investorA, "usr_investor_b")).rejects.toThrow(
      ForbiddenException
    );
    expect(mockPrisma.investment.findMany).not.toHaveBeenCalled();
  });

  it("should compute portfolio summary using only ACTIVE investments for owning investor", async () => {
    mockPrisma.investment.findMany.mockResolvedValueOnce([
      {
        id: "INV-1",
        userId: investorA.id,
        productId: "prod_1",
        productTitle: "Secured NCD Tranche A",
        product: { slug: "ncd-a", securityType: "ROC CHG-9" },
        principalAmount: "1500000.00",
        interestRatePa: "14.50",
        tenorMonths: 36,
        payoutFrequency: "QUARTERLY",
        startDate: new Date("2026-01-15"),
        maturityDate: new Date("2029-01-15"),
        accruedInterest: "100000.00",
        interestPaid: "50000.00",
        pendingInterest: "50000.00",
        nextPayoutDate: new Date("2026-10-15"),
        status: "ACTIVE",
        isDemo: false,
        createdAt: new Date("2026-01-15"),
      },
      {
        id: "INV-2",
        userId: investorA.id,
        productId: "prod_1",
        productTitle: "Prior Matured Holding",
        product: { slug: "ncd-old", securityType: "ROC CHG-9" },
        principalAmount: "500000.00",
        interestRatePa: "13.00",
        tenorMonths: 12,
        payoutFrequency: "ANNUAL",
        startDate: new Date("2024-01-01"),
        maturityDate: new Date("2025-01-01"),
        accruedInterest: "65000.00",
        interestPaid: "65000.00",
        pendingInterest: "0.00",
        nextPayoutDate: null,
        status: "MATURED",
        isDemo: false,
        createdAt: new Date("2024-01-01"),
      },
    ]);

    const res = await service.listInvestments(investorA);
    expect(res.investments).toHaveLength(2);
    expect(res.summary.activeCount).toBe(1);
    expect(res.summary.totalPrincipal).toBe(1500000);
    expect(res.summary.accruedInterest).toBe(100000);
    expect(res.summary.pendingInterest).toBe(50000);
    expect(res.summary.nextPayoutDate).toBe("2026-10-15");
  });

  it("should forbid Investor A from inspecting Investor B's holding detail via getInvestmentById", async () => {
    mockPrisma.investment.findUnique.mockResolvedValueOnce({
      id: "INV-B",
      userId: "usr_investor_b",
      transactions: [],
    });

    await expect(service.getInvestmentById("INV-B", investorA)).rejects.toThrow(
      ForbiddenException
    );
  });

  it("should allow ADMIN to inspect any investor holding detail and throw 404 when absent", async () => {
    mockPrisma.investment.findUnique.mockResolvedValueOnce(null);
    await expect(service.getInvestmentById("INV-MISSING", adminUser)).rejects.toThrow(
      NotFoundException
    );
  });

  it("should reject unsupported status filters cleanly with 400 BadRequestException", async () => {
    await expect(service.listInvestments(investorA, undefined, "INVALID_FILTER")).rejects.toThrow(
      BadRequestException
    );
    expect(mockPrisma.investment.findMany).not.toHaveBeenCalled();
  });
});
