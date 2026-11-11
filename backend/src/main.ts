import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./common/logger/winston-logger.service";
import { configureNestApplication } from "./app.setup";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

  const configService = app.get(ConfigService);
  configureNestApplication(app, configService, { setupSwagger: true });

  const port = configService.get<number>("PORT") || 4000;
  await app.listen(port);
  logger.log(`Niventra Enterprise Backend listening on port ${port} (/api)`, "Bootstrap");

  if (configService.get<boolean>("SWAGGER_ENABLED")) {
    logger.log("Swagger OpenAPI Specification active at /api/docs", "Bootstrap");
  }
}

bootstrap();
