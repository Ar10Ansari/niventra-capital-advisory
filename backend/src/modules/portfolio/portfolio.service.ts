import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PortfolioSummaryResult, summarizeActiveInvestments } from "../../common/utils/money";

@Injectable()
export class PortfolioService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string): Promise<PortfolioSummaryResult> {
    const investments = await this.prisma.investment.findMany({
      where: { userId, status: "ACTIVE" },
    });

    return summarizeActiveInvestments(investments);
  }
}
