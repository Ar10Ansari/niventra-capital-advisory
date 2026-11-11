import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BranchesService } from "./branches.service";

@ApiTags("Branch Directory")
@Controller("branches")
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: "List institutional and verified regional branches across India" })
  list(@Query("q") search?: string, @Query("tier") tier?: string) {
    return this.branchesService.getAllBranches(search, tier);
  }
}
