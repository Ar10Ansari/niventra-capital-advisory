import { HealthService } from "./health.service";
import { PrismaService } from "../prisma/prisma.service";

describe("HealthService", () => {
  it("should return sanitized liveness status", () => {
    const mockPrisma = { $queryRaw: jest.fn() } as unknown as PrismaService;
    const service = new HealthService(mockPrisma);

    const live = service.getLiveness();
    expect(live.status).toBe("ok");
    expect(live.service).toBe("niventra-api");
    expect(typeof live.timestamp).toBe("string");
  });

  it("should report ready when database query succeeds", async () => {
    const mockPrisma = {
      $queryRaw: jest.fn().mockResolvedValueOnce([{ "?column?": 1 }]),
    } as unknown as PrismaService;
    const service = new HealthService(mockPrisma);

    const ready = await service.getReadiness();
    expect(ready).toEqual(
      expect.objectContaining({
        ready: true,
        status: "ready",
        database: "connected",
      })
    );
  });

  it("should sanitize readiness failure and hide raw DB error strings", async () => {
    const mockPrisma = {
      $queryRaw: jest.fn().mockRejectedValueOnce(new Error("postgresql://secret:pass@db:5432 failed")),
    } as unknown as PrismaService;
    const service = new HealthService(mockPrisma);

    const ready = await service.getReadiness();
    expect(ready.ready).toBe(false);
    expect(ready.status).toBe("not_ready");
    expect(ready.database).toBe("disconnected");
    expect(JSON.stringify(ready)).not.toContain("postgresql://");
    expect(JSON.stringify(ready)).not.toContain("secret");
  });
});

