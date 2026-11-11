import { Module } from "@nestjs/common";
import { InvestorAccountsService } from "./investor-accounts.service";
import { InvestorAccountsController } from "./investor-accounts.controller";

@Module({
  controllers: [InvestorAccountsController],
  providers: [InvestorAccountsService],
  exports: [InvestorAccountsService],
})
export class InvestorAccountsModule {}
