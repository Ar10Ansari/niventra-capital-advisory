import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { WinstonLoggerService } from "../../common/logger/winston-logger.service";
import { redactSensitiveValue } from "../../common/utils/masking";

export interface CreateAuditLogDto {
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  details?: Record<string, unknown> | string | null;
  ipAddress?: string | null;
  status?: "SUCCESS" | "FAILED" | "BLOCKED";
}

export interface AuditLogItemDto {
  id: string;
  actor_id: string | null;
  actor_email: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: string | null;
  ip_address: string | null;
  status: string;
  created_at: string;
}

@Injectable()
export class AuditLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: WinstonLoggerService
  ) {}

  async logEvent(dto: CreateAuditLogDto): Promise<void> {
    try {
      let jsonDetails: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput = Prisma.JsonNull;
      if (dto.details !== undefined && dto.details !== null) {
        const sanitized = redactSensitiveValue(dto.details);
        jsonDetails = sanitized as Prisma.InputJsonValue;
      }

      await this.prisma.auditLog.create({
        data: {
          actorId: dto.actorId || null,
          actorEmail: dto.actorEmail || null,
          actorRole: dto.actorRole || null,
          action: dto.action,
          resourceType: dto.resourceType,
          resourceId: dto.resourceId || null,
          details: jsonDetails,
          ipAddress: dto.ipAddress || null,
          status: dto.status || "SUCCESS",
        },
      });
    } catch (err) {
      this.logger.error(
        "Failed to append immutable audit log record",
        err instanceof Error ? err.stack : String(err),
        "AuditLogsService"
      );
    }
  }

  async listRecentLogs(limit = 100): Promise<{ logs: AuditLogItemDto[] }> {
    const safeLimit = Math.min(Math.max(1, Number(limit) || 100), 250);
    const rows = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: safeLimit,
    });

    const logs: AuditLogItemDto[] = rows.map((row) => ({
      id: row.id,
      actor_id: row.actorId,
      actor_email: row.actorEmail || "SYSTEM",
      actor_role: row.actorRole || "SYSTEM",
      action: row.action,
      resource_type: row.resourceType,
      resource_id: row.resourceId,
      details:
        row.details === null
          ? null
          : typeof row.details === "string"
            ? row.details
            : JSON.stringify(row.details),
      ip_address: row.ipAddress,
      status: row.status,
      created_at: row.createdAt.toISOString(),
    }));

    return { logs };
  }
}
