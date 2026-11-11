import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { AppointmentsService } from "./appointments.service";
import { CreateEnquiryDto, UpdateEnquiryDto } from "./dto/create-enquiry.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { OptionalAuth } from "../../common/decorators/auth-access.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Appointments & Scheduling")
@Controller("enquiries")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @OptionalAuth()
  @Post()
  @Throttle({ default: { limit: 5, ttl: 300000 } })
  @ApiOperation({ summary: "Submit an advisory consultation inquiry" })
  async create(
    @CurrentUser() user: AuthenticatedUser | null,
    @Body() dto: CreateEnquiryDto
  ) {
    return this.appointmentsService.createEnquiry(dto, user);
  }

  @Get()
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "List inquiries (strictly scoped to own investor account or full staff view)" })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query("status") status?: string
  ) {
    return this.appointmentsService.listEnquiries(user, status);
  }

  @Patch(":id")
  @Roles("ADMIN", "STAFF")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update consultation enquiry status or CRM notes (Staff/Admin)" })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateEnquiryDto
  ) {
    return this.appointmentsService.updateEnquiry(id, dto, user);
  }
}
