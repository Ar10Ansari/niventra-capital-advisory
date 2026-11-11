import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { validateEnvironment } from "./config/env.validation";

// Core Infrastructure
import { LoggerModule } from "./common/logger/logger.module";
import { HttpLoggingInterceptor } from "./common/interceptors/http-logging.interceptor";
import { CsrfGuard } from "./common/guards/csrf.guard";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { HealthModule } from "./modules/health/health.module";

// 15 Domain Modules
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ProjectFundingModule } from "./modules/project-funding/project-funding.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { InvestorAccountsModule } from "./modules/investor-accounts/investor-accounts.module";
import { InvestmentsModule } from "./modules/investments/investments.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { PortfolioModule } from "./modules/portfolio/portfolio.module";
import { BranchesModule } from "./modules/branches/branches.module";
import { CalculatorModule } from "./modules/calculator/calculator.module";
import { ChatbotModule } from "./modules/chatbot/chatbot.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { AdminModule } from "./modules/admin/admin.module";
import { AuditLogsModule } from "./modules/audit-logs/audit-logs.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../.env.local"],
      validate: validateEnvironment,
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    // Global Cross-Cutting Modules
    LoggerModule,
    PrismaModule,
    AuditLogsModule,
    NotificationsModule,

    // Domain Modules
    HealthModule,
    AuthModule,
    UsersModule,
    ProjectFundingModule,
    DocumentsModule,
    AppointmentsModule,
    InvestorAccountsModule,
    InvestmentsModule,
    TransactionsModule,
    PortfolioModule,
    BranchesModule,
    CalculatorModule,
    ChatbotModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
})
export class AppModule {}
