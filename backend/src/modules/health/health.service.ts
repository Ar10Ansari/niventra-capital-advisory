import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface LivenessStatus {
  status: "ok";
  service: "niventra-api";
  timestamp: string;
}

export interface ReadinessStatus {
  ready: boolean;
  status: "ready" | "not_ready";
  database: "connected" | "disconnected";
  timestamp: string;
}

const READINESS_TIMEOUT_MS = 2000;

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getLiveness(): LivenessStatus {
    return {
      status: "ok",
      service: "niventra-api",
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<ReadinessStatus> {
    const timestamp = new Date().toISOString();
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        this.prisma.$queryRaw`SELECT 1`,
        new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => reject(new Error("Readiness probe timeout")), READINESS_TIMEOUT_MS);
        }),
      ]);

      return {
        ready: true,
        status: "ready",
        database: "connected",
        timestamp,
      };
    } catch {
      // Never expose database driver error messages, connection strings, or stack traces
      return {
        ready: false,
        status: "not_ready",
        database: "disconnected",
        timestamp,
      };
    } finally {
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle);
      }
    }
  }
}

