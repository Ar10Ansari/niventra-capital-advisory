import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TransactionsService } from "./transactions.service";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Transactions & Ledgers")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("transactions")
@UseGuards(SessionOrJwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: "List investor financial distributions, allocations and TDS deductions" })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query("userId") targetUserId?: string
  ) {
    return this.transactionsService.listTransactions(user, targetUserId);
  }
}
