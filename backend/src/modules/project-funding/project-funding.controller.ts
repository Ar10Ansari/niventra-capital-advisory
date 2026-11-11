import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { ProjectFundingService } from "./project-funding.service";
import { CreateProjectDto, UpdateProjectStatusDto } from "./dto/create-project.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Public } from "../../common/decorators/auth-access.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Real Estate Project Funding")
@Controller("project-funding")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
export class ProjectFundingController {
  constructor(private readonly projectFundingService: ProjectFundingService) {}

  @Public()
  @Post()
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @ApiOperation({ summary: "Submit a new project funding application" })
  async submit(@Body() dto: CreateProjectDto) {
    return this.projectFundingService.submitApplication(dto);
  }

  @Get()
  @Roles("ADMIN", "STAFF")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "List project applications with filters (Staff/Admin)" })
  async list(
    @Query("status") status?: string,
    @Query("category") category?: string,
    @Query("state") state?: string,
    @Query("q") q?: string
  ) {
    return this.projectFundingService.listApplications({ status, category, state, q });
  }

  @Get(":id")
  @Roles("ADMIN", "STAFF")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get detailed project application record by ID" })
  async getById(@Param("id") id: string) {
    return this.projectFundingService.getApplicationById(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "STAFF")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update project application status and notes" })
  async updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateProjectStatusDto
  ) {
    return this.projectFundingService.updateStatus(id, dto, user);
  }
}
