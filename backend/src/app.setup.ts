import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { Express } from "express";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";

export function configureNestApplication(
  app: INestApplication,
  configService: ConfigService,
  options: { setupSwagger?: boolean } = {}
): void {
  const expressInstance = app.getHttpAdapter().getInstance() as Express;
  expressInstance.disable("x-powered-by");

  const trustProxyHops = configService.get<number>("TRUST_PROXY_HOPS") ?? 0;
  if (trustProxyHops > 0) {
    expressInstance.set("trust proxy", trustProxyHops);
  }

  const corsOrigins = (configService.get<string[]>("CORS_ORIGINS") || []).map((origin) =>
    origin.trim().replace(/\/+$/, "")
  );
  const allowedOriginSet = new Set(corsOrigins);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", ...corsOrigins],
          frameAncestors: ["'none'"],
        },
      },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      frameguard: { action: "deny" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      noSniff: true,
    })
  );

  app.use(cookieParser());
  app.setGlobalPrefix("api");

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, origin?: boolean | string) => void
    ) => {
      if (!requestOrigin) {
        callback(null, true);
        return;
      }
      const normalized = requestOrigin.trim().replace(/\/+$/, "");
      if (normalized.toLowerCase() === "null" || normalized === "*" || !allowedOriginSet.has(normalized)) {
        callback(null, false);
        return;
      }
      callback(null, normalized);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Requested-With"],
    exposedHeaders: ["X-CSRF-Token", "Content-Disposition"],
    maxAge: 600,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerEnabled =
    options.setupSwagger !== false && (configService.get<boolean>("SWAGGER_ENABLED") ?? false);

  if (swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Niventra Capital Advisory — Enterprise API")
      .setDescription(
        "Modular financial services backend powering debt debentures, real estate project funding, KYC compliance, and investor portfolios."
      )
      .setVersion("1.0.0")
      .addTag("Authentication")
      .addTag("Users & Profiles")
      .addTag("Real Estate Project Funding")
      .addTag("Document Management")
      .addTag("Appointments & Scheduling")
      .addTag("Investor Accounts & KYC")
      .addTag("Investments & Holdings")
      .addTag("Transactions & Ledgers")
      .addTag("Portfolio Metrics")
      .addTag("Branch Directory")
      .addTag("Indicative Return Calculator")
      .addTag("Institutional Chatbot")
      .addTag("Notifications")
      .addTag("Administrative Operations")
      .addTag("Audit Logging")
      .addTag("Health")
      .addCookieAuth("niventra_session")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document);
  }
}
