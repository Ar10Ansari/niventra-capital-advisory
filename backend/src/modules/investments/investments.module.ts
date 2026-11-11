import { Module } from "@nestjs/common";
import { InvestmentsService } from "./investments.service";
import { InvestmentsController } from "./investments.controller";
import { ProductsController } from "./products.controller";

@Module({
  controllers: [InvestmentsController, ProductsController],
  providers: [InvestmentsService],
  exports: [InvestmentsService],
})
export class InvestmentsModule {}
