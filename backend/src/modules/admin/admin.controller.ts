import { Controller, Get, Patch, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { UpdateGrievanceDto } from "./dto/grievance.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Administrative Operations")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("admin")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
@Roles("ADMIN", "STAFF")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("overview")
  @ApiOperation({ summary: "Executive platform metrics and domain counts" })
  async overview() {
    return this.adminService.getPlatformOverview();
  }

  @Get("grievances")
  @ApiOperation({ summary: "List formal customer grievances and 48-hr SLA status" })
  async listGrievances(
    @CurrentUser() user: AuthenticatedUser,
    @Query("status") status?: string
  ) {
    return this.adminService.listGrievances(user, status);
  }

  @Patch("grievances/:id")
  @ApiOperation({ summary: "Resolve or update a grievance ticket" })
  async resolveGrievance(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateGrievanceDto
  ) {
    return this.adminService.resolveGrievance(id, dto, user);
  }
}
