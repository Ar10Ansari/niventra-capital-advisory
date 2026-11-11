import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { GrievancesController } from "./grievances.controller";

@Module({
  controllers: [AdminController, GrievancesController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
