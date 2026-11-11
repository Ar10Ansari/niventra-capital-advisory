import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { Response } from "express";
import { Public } from "../../common/decorators/auth-access.decorator";
import { HealthService } from "./health.service";

@ApiTags("Health")
@Controller("health")
@Public()
@SkipThrottle()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "Basic API liveness status probe" })
  @ApiResponse({ status: 200, description: "Service process is alive." })
  checkLiveness() {
    return this.healthService.getLiveness();
  }

  @Get("live")
  @ApiOperation({ summary: "Kubernetes/container liveness probe" })
  @ApiResponse({ status: 200, description: "Service process is alive." })
  live() {
    return this.healthService.getLiveness();
  }

  @Get("ready")
  @ApiOperation({ summary: "Readiness probe verifying PostgreSQL database connectivity" })
  @ApiResponse({ status: 200, description: "Service and database are ready." })
  @ApiResponse({ status: 503, description: "Database connectivity failed." })
  async ready(@Res() res: Response) {
    const readiness = await this.healthService.getReadiness();
    const statusCode = readiness.ready ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    res.setHeader("Cache-Control", "no-store");
    res.status(statusCode).json({
      status: readiness.status,
      database: readiness.database,
      timestamp: readiness.timestamp,
    });
  }
}

