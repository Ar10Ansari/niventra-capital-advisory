import { Module } from "@nestjs/common";
import { ProjectFundingService } from "./project-funding.service";
import { ProjectFundingController } from "./project-funding.controller";

@Module({
  controllers: [ProjectFundingController],
  providers: [ProjectFundingService],
  exports: [ProjectFundingService],
})
export class ProjectFundingModule {}
