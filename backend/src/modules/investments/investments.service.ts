import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InvestmentStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import {
  paiseToInrNumber,
  parseDecimalToPaise,
  summarizeActiveInvestments,
} from "../../common/utils/money";
import { CreateProductDto } from "./dto/create-product.dto";

const VALID_INVESTMENT_STATUSES = new Set<string>(Object.values(InvestmentStatus));

@Injectable()
export class InvestmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService
  ) {}

  async listInvestments(
    requestingUser: AuthenticatedUser,
    targetUserId?: string,
    statusFilter?: string
  ) {
    if (requestingUser.role === "INVESTOR" && targetUserId && targetUserId !== requestingUser.id) {
      throw new ForbiddenException("Forbidden: You cannot access investments of another investor.");
    }

    const where: Prisma.InvestmentWhereInput = {};
    if (requestingUser.role === "ADMIN" || requestingUser.role === "STAFF") {
      if (targetUserId) {
        where.userId = targetUserId;
      }
    } else {
      where.userId = requestingUser.id;
    }

    if (statusFilter && statusFilter !== "ALL") {
      if (!VALID_INVESTMENT_STATUSES.has(statusFilter)) {
        throw new BadRequestException("Unsupported investment status filter.");
      }
      where.status = statusFilter as InvestmentStatus;
    }

    const rows = await this.prisma.investment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { slug: true, securityType: true } },
      },
    });

    const summary = summarizeActiveInvestments(rows);

    const investments = rows.map((inv) => {
      const principalAmount = paiseToInrNumber(parseDecimalToPaise(inv.principalAmount));
      const accrued = paiseToInrNumber(parseDecimalToPaise(inv.accruedInterest));
      const paid = paiseToInrNumber(parseDecimalToPaise(inv.interestPaid));
      const pending = paiseToInrNumber(parseDecimalToPaise(inv.pendingInterest));
      const nextPayoutStr = inv.nextPayoutDate ? inv.nextPayoutDate.toISOString().slice(0, 10) : null;

      return {
        id: inv.id,
        user_id: inv.userId,
        product_id: inv.productId,
        product_title: inv.productTitle,
        product_slug: inv.product?.slug,
        security_type: inv.product?.securityType,
        principal_amount: principalAmount,
        interest_rate_pa: paiseToInrNumber(parseDecimalToPaise(inv.interestRatePa)),
        tenor_months: inv.tenorMonths,
        payout_frequency: inv.payoutFrequency,
        start_date: inv.startDate.toISOString().slice(0, 10),
        maturity_date: inv.maturityDate.toISOString().slice(0, 10),
        accrued_interest: accrued,
        interest_paid: paid,
        pending_interest: pending,
        next_payout_date: nextPayoutStr,
        status: inv.status,
        is_demo: inv.isDemo ? 1 : 0,
        created_at: inv.createdAt.toISOString(),
      };
    });

    return {
      success: true,
      investments,
      summary,
    };
  }

  async getInvestmentById(id: string, requestingUser: AuthenticatedUser) {
    const inv = await this.prisma.investment.findUnique({
      where: { id },
      include: {
        product: {
          select: { slug: true, securityType: true, summary: true, risksSummary: true },
        },
        transactions: {
          orderBy: { effectiveDate: "desc" },
        },
      },
    });

    if (!inv) {
      throw new NotFoundException("Investment record not found.");
    }

    if (
      inv.userId !== requestingUser.id &&
      requestingUser.role !== "ADMIN" &&
      requestingUser.role !== "STAFF"
    ) {
      throw new ForbiddenException("Forbidden: You are not authorized to view this investment.");
    }

    return {
      success: true,
      investment: {
        id: inv.id,
        user_id: inv.userId,
        product_id: inv.productId,
        product_title: inv.productTitle,
        product_slug: inv.product?.slug,
        security_type: inv.product?.securityType,
        product_summary: inv.product?.summary,
        risks_summary: inv.product?.risksSummary,
        principal_amount: Number(inv.principalAmount),
        interest_rate_pa: Number(inv.interestRatePa),
        tenor_months: inv.tenorMonths,
        payout_frequency: inv.payoutFrequency,
        start_date: inv.startDate.toISOString().slice(0, 10),
        maturity_date: inv.maturityDate.toISOString().slice(0, 10),
        accrued_interest: Number(inv.accruedInterest),
        interest_paid: Number(inv.interestPaid),
        pending_interest: Number(inv.pendingInterest),
        next_payout_date: inv.nextPayoutDate ? inv.nextPayoutDate.toISOString().slice(0, 10) : null,
        status: inv.status,
        is_demo: inv.isDemo ? 1 : 0,
        created_at: inv.createdAt.toISOString(),
      },
      transactions: inv.transactions.map((txn) => ({
        id: txn.id,
        investment_id: txn.investmentId,
        user_id: txn.userId,
        transaction_type: txn.transactionType,
        amount: Number(txn.amount),
        status: txn.status,
        payment_reference: txn.paymentReference || "",
        effective_date: txn.effectiveDate.toISOString().slice(0, 10),
        is_demo: txn.isDemo ? 1 : 0,
        created_at: txn.createdAt.toISOString(),
      })),
    };
  }

  async listProducts(user: AuthenticatedUser | null) {
    const where: Prisma.ProductWhereInput =
      !user || (user.role !== "ADMIN" && user.role !== "STAFF")
        ? { status: "PUBLISHED" }
        : {};

    const rows = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return {
      products: rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        indicative_yield: p.indicativeYield,
        tenor: p.tenor,
        min_investment: p.minInvestment,
        security_type: p.securityType,
        status: p.status,
        summary: p.summary,
        description: p.description,
        risks_summary: p.risksSummary,
        created_at: p.createdAt.toISOString(),
      })),
    };
  }

  async createProduct(dto: CreateProductDto, actor: AuthenticatedUser) {
    const normalizedSlug = dto.slug.trim().toLowerCase();
    const existing = await this.prisma.product.findUnique({
      where: { slug: normalizedSlug },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException("A product with this slug already exists.");
    }

    const id = `prod_${Date.now()}`;
    const created = await this.prisma.product.create({
      data: {
        id,
        slug: normalizedSlug,
        title: dto.title.trim(),
        category: dto.category || "DEBENTURE",
        indicativeYield: dto.indicativeYield,
        tenor: dto.tenor,
        minInvestment: dto.minInvestment || "₹10,00,000",
        securityType: dto.securityType || "Secured (ROC Form CHG-9)",
        status: "PUBLISHED",
        summary: dto.summary || "",
        description: dto.description || "",
        risksSummary: dto.risksSummary || "",
      },
    });

    await this.auditLogs.logEvent({
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      action: "PRODUCT_CREATED",
      resourceType: "PRODUCT",
      resourceId: created.id,
      details: { slug: created.slug, title: created.title, indicativeYield: created.indicativeYield },
    });

    return {
      success: true,
      productId: created.id,
      message: "Product published successfully.",
    };
  }
}
