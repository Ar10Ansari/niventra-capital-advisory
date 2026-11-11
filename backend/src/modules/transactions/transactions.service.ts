import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listTransactions(requestingUser: AuthenticatedUser, targetUserId?: string) {
    if (requestingUser.role === "INVESTOR" && targetUserId && targetUserId !== requestingUser.id) {
      throw new ForbiddenException("Forbidden: You cannot access transactions of another investor.");
    }

    const userId =
      requestingUser.role === "ADMIN" || requestingUser.role === "STAFF"
        ? targetUserId || requestingUser.id
        : requestingUser.id;

    const rows = await this.prisma.investmentTransaction.findMany({
      where: { userId },
      orderBy: { effectiveDate: "desc" },
      include: {
        investment: { select: { productTitle: true } },
      },
    });

    return rows.map((txn) => ({
      id: txn.id,
      investment_id: txn.investmentId,
      user_id: txn.userId,
      product_title: txn.investment.productTitle,
      transaction_type: txn.transactionType,
      amount: Number(txn.amount),
      status: txn.status,
      payment_reference: txn.paymentReference || "",
      effective_date: txn.effectiveDate.toISOString().slice(0, 10),
      is_demo: txn.isDemo ? 1 : 0,
      created_at: txn.createdAt.toISOString(),
    }));
  }
}
