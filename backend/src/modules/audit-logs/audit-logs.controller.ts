import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuditLogsService } from "./audit-logs.service";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("Audit Logging")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("audit-logs")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: "Inspect immutable security audit log (Admin only)" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  async list(@Query("limit") limit?: string) {
    const parsedLimit = limit ? Number(limit) : 100;
    return this.auditLogsService.listRecentLogs(parsedLimit);
  }
}
