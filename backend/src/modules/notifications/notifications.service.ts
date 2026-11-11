import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "node:fs";
import * as path from "node:path";
import { PrismaService } from "../prisma/prisma.service";
import { WinstonLoggerService } from "../../common/logger/winston-logger.service";
import { maskEmail } from "../../common/utils/masking";

export interface DispatchLeadPayload {
  referenceId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  category: string;
  capitalRange: string;
  message?: string | null;
}

export interface DispatchProjectFundingPayload {
  referenceNumber: string;
  applicantName: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
  projectName: string;
  category: string;
  city: string;
  state: string;
  fundingRequested: number;
}

export interface DispatchPasswordResetPayload {
  email: string;
  recipientName: string;
  resetToken: string;
  expiresAt: Date;
}

export interface DispatchResult {
  success: boolean;
  mode: "REST_API" | "MOCK_SINK" | "DISABLED";
  recipientCount: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly logger: WinstonLoggerService
  ) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    link?: string
  ) {
    try {
      return await this.prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          link: link || null,
          isRead: false,
        },
      });
    } catch (err) {
      this.logger.warn(
        `Unable to store in-app notification for user=${userId}: ${err instanceof Error ? err.message : String(err)}`,
        "NotificationsService"
      );
      return null;
    }
  }

  private writeToLocalSink(entry: Record<string, unknown>): void {
    if (this.configService.get<string>("NODE_ENV") === "test") {
      return;
    }
    try {
      const dataDir = path.join(process.cwd(), "..", "data");
      if (fs.existsSync(dataDir)) {
        fs.appendFileSync(path.join(dataDir, "email_sink.log"), `${JSON.stringify(entry)}\n`, "utf-8");
        return;
      }
    } catch {
      // Non-writable container or test runtime
    }
    this.logger.log(`Notification sink recorded: ${JSON.stringify(entry)}`, "NotificationsService");
  }

  private async sendViaResend(
    to: string[],
    subject: string,
    text: string
  ): Promise<boolean> {
    const resendApiKey = this.configService.get<string>("RESEND_API_KEY");
    const nodeEnv = this.configService.get<string>("NODE_ENV");
    if (!resendApiKey || nodeEnv === "test") {
      return false;
    }

    const fromEmail =
      this.configService.get<string>("EMAIL_FROM") ||
      "Niventra Capital Advisory <notifications@niventracapitaladvisory.com>";

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to,
          subject,
          text,
        }),
      });

      if (!response.ok) {
        this.logger.error(`Resend API error status=${response.status}`, undefined, "NotificationsService");
        return false;
      }
      return true;
    } catch (err) {
      this.logger.error(
        "Failed connecting to external email relay",
        err instanceof Error ? err.stack : String(err),
        "NotificationsService"
      );
      return false;
    }
  }

  async dispatchLeadNotification(payload: DispatchLeadPayload): Promise<DispatchResult> {
    const staffRecipients = this.configService.get<string[]>("LEAD_NOTIFICATION_EMAILS") || [];
    const maskedEmail = maskEmail(payload.email);

    if (staffRecipients.length > 0) {
      const sent = await this.sendViaResend(
        staffRecipients,
        `New Advisory Consultation Request — ${payload.referenceId} (${payload.category})`,
        `A new consultation enquiry has been recorded.\n\nReference ID: ${payload.referenceId}\nCategory: ${payload.category}\nCapital Range: ${payload.capitalRange}\nProspect Name: ${payload.fullName}\nEmail: ${payload.email}\nPhone: ${payload.phoneNumber}\nNotes: ${payload.message || "None provided"}`
      );
      if (sent) {
        return { success: true, mode: "REST_API", recipientCount: staffRecipients.length };
      }
    }

    this.writeToLocalSink({
      timestamp: new Date().toISOString(),
      event: "PUBLIC_LEAD_RECORDED",
      referenceId: payload.referenceId,
      category: payload.category,
      capitalRange: payload.capitalRange,
      maskedUserEmail: maskedEmail,
      recipientCount: staffRecipients.length,
    });

    return { success: true, mode: "MOCK_SINK", recipientCount: staffRecipients.length };
  }

  async dispatchProjectFundingNotification(
    payload: DispatchProjectFundingPayload
  ): Promise<DispatchResult> {
    const staffRecipients = this.configService.get<string[]>("STAFF_LEAD_NOTIFICATION_EMAILS") || [];
    const maskedEmail = maskEmail(payload.email);

    if (staffRecipients.length > 0) {
      const sent = await this.sendViaResend(
        staffRecipients,
        `New Real Estate Project Funding Application — ${payload.referenceNumber}`,
        `A new developer application has been submitted.\n\nReference: ${payload.referenceNumber}\nProject: ${payload.projectName}\nOrganization: ${payload.organizationName}\nLocation: ${payload.city}, ${payload.state}\nFunding Requested: INR ${payload.fundingRequested}`
      );
      if (sent) {
        return { success: true, mode: "REST_API", recipientCount: staffRecipients.length };
      }
    }

    this.writeToLocalSink({
      timestamp: new Date().toISOString(),
      event: "PROJECT_FUNDING_APPLICATION_RECORDED",
      referenceNumber: payload.referenceNumber,
      projectName: payload.projectName,
      organizationName: payload.organizationName,
      location: `${payload.city}, ${payload.state}`,
      fundingRequested: payload.fundingRequested,
      maskedUserEmail: maskedEmail,
    });

    return { success: true, mode: "MOCK_SINK", recipientCount: staffRecipients.length };
  }

  async dispatchPasswordResetEmail(
    payload: DispatchPasswordResetPayload
  ): Promise<DispatchResult> {
    const appUrl =
      this.configService.get<string>("NEXT_PUBLIC_APP_URL") || "https://niventra-capital-advisory.vercel.app";
    const resetLink = `${appUrl.replace(/\/+$/, "")}/login?resetToken=${encodeURIComponent(payload.resetToken)}`;

    const sent = await this.sendViaResend(
      [payload.email],
      "Niventra Capital Advisory — Password Recovery Request",
      `Dear ${payload.recipientName},\n\nWe received a request to reset your Niventra Capital Advisory investor portal password.\n\nUse this single-use recovery link (valid until ${payload.expiresAt.toISOString()}):\n${resetLink}\n\nIf you did not request this reset, contact compliance@niventracapitaladvisory.com immediately.`
    );

    if (sent) {
      return { success: true, mode: "REST_API", recipientCount: 1 };
    }

    // Security rule: Never write plaintext reset tokens into logs or sinks.
    this.writeToLocalSink({
      timestamp: new Date().toISOString(),
      event: "PASSWORD_RESET_DISPATCHED_SANDBOX",
      maskedUserEmail: maskEmail(payload.email),
      expiresAt: payload.expiresAt.toISOString(),
      deliveryStatus: "RESEND_API_KEY_UNCONFIGURED",
    });

    return { success: true, mode: "MOCK_SINK", recipientCount: 1 };
  }
}
