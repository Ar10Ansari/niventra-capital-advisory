import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AdminService } from "./admin.service";
import { CreateGrievanceDto, UpdateGrievanceDto } from "./dto/grievance.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { OptionalAuth } from "../../common/decorators/auth-access.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Administrative Operations")
@Controller("grievances")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
export class GrievancesController {
  constructor(private readonly adminService: AdminService) {}

  @OptionalAuth()
  @Post()
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @ApiOperation({ summary: "Submit a formal grievance ticket under 48-hour acknowledgment SLA" })
  async submit(
    @CurrentUser() user: AuthenticatedUser | null,
    @Body() dto: CreateGrievanceDto
  ) {
    return this.adminService.createGrievance(dto, user);
  }

  @Get()
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "List grievances (strictly scoped to own user or full staff view)" })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query("status") status?: string
  ) {
    return this.adminService.listGrievances(user, status);
  }

  @Patch(":id")
  @Roles("ADMIN", "STAFF")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update grievance SLA status or resolution notes (Staff/Admin)" })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateGrievanceDto
  ) {
    return this.adminService.resolveGrievance(id, dto, user);
  }
}
