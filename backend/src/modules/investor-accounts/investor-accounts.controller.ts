import { Controller, Get, Post, Patch, Body, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InvestorAccountsService } from "./investor-accounts.service";
import { SubmitKycDto, UpdateKycStatusDto } from "./dto/submit-kyc.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Investor Accounts & KYC")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("kyc")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
export class InvestorAccountsController {
  constructor(private readonly investorAccountsService: InvestorAccountsService) {}

  @Get()
  @ApiOperation({ summary: "Get KYC verification status for investor" })
  async getKyc(
    @CurrentUser() user: AuthenticatedUser,
    @Query("userId") targetUserId?: string
  ) {
    return this.investorAccountsService.getKycRecord(user, targetUserId);
  }

  @Post()
  @ApiOperation({ summary: "Submit PAN and identification for compliance onboarding" })
  async submitKyc(@CurrentUser() user: AuthenticatedUser, @Body() dto: SubmitKycDto) {
    return this.investorAccountsService.submitKyc(user, dto);
  }

  @Patch()
  @Roles("ADMIN", "STAFF")
  @ApiOperation({ summary: "Update KYC verification status (Admin/Staff only)" })
  async updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateKycStatusDto
  ) {
    return this.investorAccountsService.updateKycStatus(dto, user);
  }
}
