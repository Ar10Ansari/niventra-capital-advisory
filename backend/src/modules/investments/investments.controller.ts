import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InvestmentsService } from "./investments.service";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { OptionalAuth } from "../../common/decorators/auth-access.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Investments & Holdings")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("investments")
@UseGuards(SessionOrJwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Get()
  @ApiOperation({ summary: "List investor debenture holdings & portfolio summary" })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query("userId") targetUserId?: string,
    @Query("status") status?: string
  ) {
    return this.investmentsService.listInvestments(user, targetUserId, status);
  }

  @OptionalAuth()
  @Get("products")
  @ApiOperation({ summary: "List published fixed-income products and debenture series" })
  async listProducts(@CurrentUser() user: AuthenticatedUser | null) {
    return this.investmentsService.listProducts(user);
  }

  @Get(":id")
  @ApiOperation({ summary: "Retrieve single investment holding and payout ledger transactions" })
  async getById(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.investmentsService.getInvestmentById(id, user);
  }
}
