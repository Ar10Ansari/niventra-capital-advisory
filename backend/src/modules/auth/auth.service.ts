import {
  Injectable,
  Optional,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHash, scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { NotificationsService } from "../notifications/notifications.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { computeCsrfToken } from "../../common/utils/csrf";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/password-reset.dto";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

interface UserEntityShape {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  investorCategory: string | null;
  notifyConsultations: boolean;
  notifyDisclosures: boolean;
  notifyGrievances: boolean;
  status: string;
  createdAt: Date;
}

export interface RequestMeta {
  ipAddress?: string;
  userAgent?: string;
}

export interface ValidatedSessionContext {
  user: AuthenticatedUser;
  sessionId: string;
  sessionToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditLogs: AuditLogsService,
    private readonly notifications: NotificationsService,
    @Optional() private readonly configService?: ConfigService
  ) {}

  hashPassword(password: string): { hash: string; salt: string } {
    const salt = randomBytes(16).toString("hex");
    const derived = scryptSync(password, salt, 64);
    return { hash: derived.toString("hex"), salt };
  }

  verifyPassword(password: string, storedHash: string, salt: string): boolean {
    try {
      const derived = scryptSync(password, salt, 64);
      const storedBuffer = Buffer.from(storedHash, "hex");
      if (derived.length !== storedBuffer.length) {
        return false;
      }
      return timingSafeEqual(derived, storedBuffer);
    } catch {
      return false;
    }
  }

  private hashResetToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex");
  }

  toSafeUser(user: UserEntityShape): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      investor_category: user.investorCategory,
      notify_consultations: user.notifyConsultations ? 1 : 0,
      notify_disclosures: user.notifyDisclosures ? 1 : 0,
      notify_grievances: user.notifyGrievances ? 1 : 0,
      status: user.status,
      created_at: user.createdAt.toISOString(),
    };
  }

  getCsrfTokenForSession(sessionToken: string): string {
    const csrfSecret =
      this.configService?.get<string>("CSRF_SECRET") ||
      this.configService?.get<string>("JWT_SECRET") ||
      process.env.CSRF_SECRET ||
      process.env.JWT_SECRET ||
      "";
    return computeCsrfToken(sessionToken, csrfSecret);
  }

  private signAccessToken(
    user: { id: string; email: string; role: string },
    sessionId: string
  ): string {
    return this.jwtService.sign({
      sub: user.id,
      sid: sessionId,
      email: user.email,
      role: user.role,
    });
  }

  async register(dto: RegisterDto, meta: RequestMeta = {}) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException("An account with this email address already exists.");
    }

    const { hash, salt } = this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash: hash,
        salt,
        role: "INVESTOR",
        phone: dto.phone ? dto.phone.trim() : null,
        investorCategory: dto.investorCategory ?? null,
        status: "ACTIVE",
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

    const session = await this.createSession(user.id, meta);
    const accessToken = this.signAccessToken(user, session.id);
    const csrfToken = this.getCsrfTokenForSession(session.token);

    await this.auditLogs.logEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "AUTH_REGISTER",
      resourceType: "USER",
      resourceId: user.id,
      details: { name: user.name, investorCategory: user.investorCategory },
      ipAddress: meta.ipAddress,
      status: "SUCCESS",
    });

    return {
      success: true,
      user: this.toSafeUser(user),
      sessionToken: session.token,
      expiresAt: session.expiresAt,
      accessToken,
      csrfToken,
    };
  }

  async login(dto: LoginDto, meta: RequestMeta = {}) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !this.verifyPassword(dto.password, user.passwordHash, user.salt)) {
      await this.auditLogs.logEvent({
        actorEmail: email,
        action: "AUTH_LOGIN_FAILED",
        resourceType: "SESSION",
        details: { reason: "Invalid credentials" },
        ipAddress: meta.ipAddress,
        status: "FAILED",
      });
      throw new UnauthorizedException("Invalid email or password.");
    }

    if (user.status !== "ACTIVE") {
      await this.auditLogs.logEvent({
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: "AUTH_LOGIN_BLOCKED",
        resourceType: "SESSION",
        details: { accountStatus: user.status },
        ipAddress: meta.ipAddress,
        status: "BLOCKED",
      });
      throw new ForbiddenException("Your account is not active. Please contact support.");
    }

    const session = await this.createSession(user.id, meta);
    const accessToken = this.signAccessToken(user, session.id);
    const csrfToken = this.getCsrfTokenForSession(session.token);

    await this.auditLogs.logEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "AUTH_LOGIN_SUCCESS",
      resourceType: "SESSION",
      resourceId: session.id,
      ipAddress: meta.ipAddress,
      status: "SUCCESS",
    });

    return {
      success: true,
      user: this.toSafeUser(user),
      sessionToken: session.token,
      expiresAt: session.expiresAt,
      accessToken,
      csrfToken,
    };
  }

  async createSession(userId: string, meta: RequestMeta = {}) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    return this.prisma.session.create({
      data: {
        userId,
        token,
        ipAddress: meta.ipAddress || null,
        userAgent: meta.userAgent ? meta.userAgent.slice(0, 500) : null,
        expiresAt,
      },
    });
  }

  async validateSessionWithContext(token?: string): Promise<ValidatedSessionContext | null> {
    if (!token) return null;

    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date() || session.user.status !== "ACTIVE") {
      return null;
    }

    return {
      user: this.toSafeUser(session.user),
      sessionId: session.id,
      sessionToken: session.token,
    };
  }

  async validateSession(token?: string): Promise<AuthenticatedUser | null> {
    const validated = await this.validateSessionWithContext(token);
    return validated ? validated.user : null;
  }

  async validateActiveSessionById(userId: string, sessionId: string): Promise<AuthenticatedUser | null> {
    if (!userId || !sessionId) return null;
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (
      !session ||
      session.userId !== userId ||
      session.expiresAt < new Date() ||
      session.user.status !== "ACTIVE"
    ) {
      return null;
    }
    return this.toSafeUser(session.user);
  }

  async getActiveUserById(userId: string): Promise<AuthenticatedUser | null> {
    if (!userId) return null;
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || user.status !== "ACTIVE") {
      return null;
    }
    return this.toSafeUser(user);
  }

  async logout(
    token?: string,
    actor?: AuthenticatedUser | null,
    meta: RequestMeta = {},
    sessionId?: string
  ) {
    if (token) {
      await this.prisma.session.deleteMany({
        where: { token },
      });
    } else if (sessionId) {
      await this.prisma.session.deleteMany({
        where: { id: sessionId },
      });
    }

    if (actor) {
      await this.auditLogs.logEvent({
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        action: "AUTH_LOGOUT",
        resourceType: "SESSION",
        ipAddress: meta.ipAddress,
        status: "SUCCESS",
      });
    }

    return { success: true, message: "Logged out successfully." };
  }

  async forgotPassword(dto: ForgotPasswordDto, meta: RequestMeta = {}) {
    const email = dto.email.trim().toLowerCase();
    const uniformMessage =
      "If an active account exists for this email address, password recovery instructions have been dispatched.";

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    if (!user || user.status !== "ACTIVE") {
      return { success: true, message: uniformMessage };
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = this.hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      await tx.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });
    });

    await this.auditLogs.logEvent({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "PASSWORD_RESET_REQUESTED",
      resourceType: "CREDENTIALS",
      resourceId: user.id,
      details: { expiresAt: expiresAt.toISOString() },
      ipAddress: meta.ipAddress,
      status: "SUCCESS",
    });

    await this.notifications.dispatchPasswordResetEmail({
      email: user.email,
      recipientName: user.name,
      resetToken: rawToken,
      expiresAt,
    });

    return { success: true, message: uniformMessage };
  }

  async resetPassword(dto: ResetPasswordDto, meta: RequestMeta = {}) {
    const tokenHash = this.hashResetToken(dto.token.trim());
    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt !== null || resetRecord.expiresAt < new Date()) {
      throw new BadRequestException("Password recovery token is invalid or has expired.");
    }

    if (resetRecord.user.status !== "ACTIVE") {
      throw new ForbiddenException("Account is inactive or pending review.");
    }

    const { hash, salt } = this.hashPassword(dto.newPassword);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: hash, salt },
      });

      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      });

      await tx.session.deleteMany({
        where: { userId: resetRecord.userId },
      });
    });

    await this.auditLogs.logEvent({
      actorId: resetRecord.user.id,
      actorEmail: resetRecord.user.email,
      actorRole: resetRecord.user.role,
      action: "PASSWORD_RESET_COMPLETED",
      resourceType: "CREDENTIALS",
      resourceId: resetRecord.user.id,
      ipAddress: meta.ipAddress,
      status: "SUCCESS",
    });

    return {
      success: true,
      message: "Password reset completed. Please sign in with your updated credentials.",
    };
  }
}
