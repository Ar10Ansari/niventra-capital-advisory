import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PortfolioService } from "./portfolio.service";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Portfolio Metrics")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("portfolio")
@UseGuards(SessionOrJwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get("summary")
  @ApiOperation({ summary: "Get aggregated portfolio statistics for authenticated investor" })
  async getSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.portfolioService.getSummary(user.id);
  }
}
