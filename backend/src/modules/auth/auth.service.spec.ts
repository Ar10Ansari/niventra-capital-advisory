import { BadRequestException, ConflictException, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash } from "node:crypto";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";

interface MockPrismaBag {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  session: {
    create: jest.Mock;
    findUnique: jest.Mock;
    deleteMany: jest.Mock;
  };
  passwordResetToken: {
    findUnique: jest.Mock;
    updateMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
}

describe("AuthService", () => {
  let service: AuthService;
  let mockPrisma: MockPrismaBag;
  let mockJwt: { sign: jest.Mock };
  let mockAuditLogs: { logEvent: jest.Mock };
  let mockNotifications: { dispatchPasswordResetEmail: jest.Mock };

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      session: {
        create: jest.fn(),
        findUnique: jest.fn(),
        deleteMany: jest.fn(),
      },
      passwordResetToken: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(async (cb: (tx: MockPrismaBag) => Promise<unknown>) => cb(mockPrisma)),
    };

    mockJwt = {
      sign: jest.fn().mockReturnValue("mock-jwt-token"),
    };

    mockAuditLogs = {
      logEvent: jest.fn().mockResolvedValue(undefined),
    };

    mockNotifications = {
      dispatchPasswordResetEmail: jest.fn().mockResolvedValue({
        success: true,
        mode: "MOCK_SINK",
        recipientCount: 1,
      }),
    };

    service = new AuthService(
      mockPrisma as unknown as PrismaService,
      mockJwt as unknown as JwtService,
      mockAuditLogs as unknown as AuditLogsService,
      mockNotifications as unknown as NotificationsService
    );
  });

  it("should securely hash password with scrypt and unique salt", () => {
    const password = "InstitutionalSecret2026!";
    const { hash, salt } = service.hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash.length).toBe(128);
    expect(salt).toBeDefined();
    expect(salt.length).toBe(32);
  });

  it("should timing-safely verify matching candidate password", () => {
    const password = "ValidPassword123#";
    const { hash, salt } = service.hashPassword(password);

    expect(service.verifyPassword(password, hash, salt)).toBe(true);
    expect(service.verifyPassword("WrongPassword!", hash, salt)).toBe(false);
    expect(service.verifyPassword(password, "abcd", salt)).toBe(false);
  });

  it("should register a new investor, force INVESTOR role, issue session + JWT, and log audit event", async () => {
    const now = new Date();
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    mockPrisma.user.create.mockResolvedValueOnce({
      id: "usr_new_01",
      name: "Ananya Sharma",
      email: "ananya@example.com",
      role: "INVESTOR",
      phone: "+91 9876543210",
      investorCategory: "FAMILY_OFFICE",
      notifyConsultations: true,
      notifyDisclosures: true,
      notifyGrievances: true,
      status: "ACTIVE",
      createdAt: now,
    });
    mockPrisma.session.create.mockResolvedValueOnce({
      id: "sess_01",
      token: "session_tok_01",
      expiresAt: new Date(Date.now() + 86400000),
    });

    const result = await service.register(
      {
        name: "Ananya Sharma",
        email: "Ananya@Example.COM ",
        password: "Password2026!",
        phone: "+91 9876543210",
        investorCategory: "FAMILY_OFFICE",
      },
      { ipAddress: "127.0.0.1", userAgent: "JestTest" }
    );

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: "ananya@example.com",
          role: "INVESTOR",
          investorCategory: "FAMILY_OFFICE",
          status: "ACTIVE",
        }),
      })
    );
    expect(result.success).toBe(true);
    expect(result.accessToken).toBe("mock-jwt-token");
    expect(result.sessionToken).toBe("session_tok_01");
    expect(result.csrfToken).toBeDefined();
    expect(mockJwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: "usr_new_01",
        sid: "sess_01",
        email: "ananya@example.com",
        role: "INVESTOR",
      })
    );
    expect(result.user.investor_category).toBe("FAMILY_OFFICE");
    expect(mockAuditLogs.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "AUTH_REGISTER", status: "SUCCESS" })
    );
  });

  it("should reject duplicate email registration with ConflictException (409)", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({ id: "usr_existing" });

    await expect(
      service.register({
        name: "Duplicate User",
        email: "existing@example.com",
        password: "Password2026!",
      })
    ).rejects.toThrow(ConflictException);
  });

  it("should reject invalid login credentials with UnauthorizedException and log failure", async () => {
    const { hash, salt } = service.hashPassword("CorrectPass123!");
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: "usr_1",
      email: "client@example.com",
      passwordHash: hash,
      salt,
      status: "ACTIVE",
    });

    await expect(
      service.login({ email: "client@example.com", password: "WrongPassword!" })
    ).rejects.toThrow(UnauthorizedException);

    expect(mockAuditLogs.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "AUTH_LOGIN_FAILED", status: "FAILED" })
    );
  });

  it("should block suspended user login with ForbiddenException (403)", async () => {
    const { hash, salt } = service.hashPassword("CorrectPass123!");
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: "usr_suspended",
      email: "suspended@example.com",
      role: "INVESTOR",
      passwordHash: hash,
      salt,
      status: "SUSPENDED",
    });

    await expect(
      service.login({ email: "suspended@example.com", password: "CorrectPass123!" })
    ).rejects.toThrow(ForbiddenException);

    expect(mockAuditLogs.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "AUTH_LOGIN_BLOCKED", status: "BLOCKED" })
    );
  });

  it("should return uniform response on forgotPassword for unknown email (anti-enumeration)", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);

    const res = await service.forgotPassword({ email: "nonexistent@example.com" });
    expect(res.success).toBe(true);
    expect(res.message).toContain("password recovery instructions");
    expect(mockPrisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mockNotifications.dispatchPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("should hash reset token via SHA-256 and revoke all active sessions upon password reset", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: "usr_active",
      name: "Active Client",
      email: "client@example.com",
      role: "INVESTOR",
      status: "ACTIVE",
    });

    await service.forgotPassword({ email: "client@example.com" });

    expect(mockNotifications.dispatchPasswordResetEmail).toHaveBeenCalledTimes(1);
    const emailPayload = mockNotifications.dispatchPasswordResetEmail.mock.calls[0][0] as {
      resetToken: string;
    };
    const expectedHash = createHash("sha256").update(emailPayload.resetToken).digest("hex");

    expect(mockPrisma.passwordResetToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "usr_active",
          tokenHash: expectedHash,
        }),
      })
    );

    mockPrisma.passwordResetToken.findUnique.mockResolvedValueOnce({
      id: "prt_1",
      userId: "usr_active",
      tokenHash: expectedHash,
      expiresAt: new Date(Date.now() + 600000),
      usedAt: null,
      user: {
        id: "usr_active",
        email: "client@example.com",
        role: "INVESTOR",
        status: "ACTIVE",
      },
    });

    const resetResult = await service.resetPassword({
      token: emailPayload.resetToken,
      newPassword: "UpdatedStrongPassword2026!",
    });

    expect(resetResult.success).toBe(true);
    expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
      where: { userId: "usr_active" },
    });
    expect(mockAuditLogs.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action: "PASSWORD_RESET_COMPLETED", status: "SUCCESS" })
    );
  });

  it("should reject expired or already-used password reset token with BadRequestException", async () => {
    mockPrisma.passwordResetToken.findUnique.mockResolvedValueOnce({
      id: "prt_expired",
      userId: "usr_active",
      tokenHash: "abc",
      expiresAt: new Date(Date.now() - 10000),
      usedAt: null,
      user: { id: "usr_active", status: "ACTIVE" },
    });

    await expect(
      service.resetPassword({ token: "expired-token", newPassword: "NewPassword123!" })
    ).rejects.toThrow(BadRequestException);
  });

  it("should revoke session by sessionId when logout is triggered via Bearer JWT", async () => {
    await service.logout(undefined, { id: "usr_1", name: "User", email: "user@example.com", role: "INVESTOR" }, {}, "sess_99");
    expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
      where: { id: "sess_99" },
    });
  });

  it("should reject validateActiveSessionById for revoked, mismatched, or expired sessions", async () => {
    mockPrisma.session.findUnique.mockResolvedValueOnce(null);
    expect(await service.validateActiveSessionById("usr_1", "sess_missing")).toBeNull();

    mockPrisma.session.findUnique.mockResolvedValueOnce({
      id: "sess_expired",
      userId: "usr_1",
      expiresAt: new Date(Date.now() - 1000),
      user: {
        id: "usr_1",
        name: "User",
        email: "user@example.com",
        role: "INVESTOR",
        phone: null,
        investorCategory: null,
        notifyConsultations: true,
        notifyDisclosures: true,
        notifyGrievances: true,
        status: "ACTIVE",
        createdAt: new Date(),
      },
    });
    expect(await service.validateActiveSessionById("usr_1", "sess_expired")).toBeNull();
  });
});
