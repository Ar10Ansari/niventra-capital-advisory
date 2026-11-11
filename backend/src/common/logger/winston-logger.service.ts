import { Injectable, LoggerService } from "@nestjs/common";
import * as winston from "winston";
import { redactSensitiveValue } from "../utils/masking";

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isProduction = process.env.NODE_ENV === "production";
    const isTest = process.env.NODE_ENV === "test";

    this.logger = winston.createLogger({
      level: isTest ? "warn" : isProduction ? "info" : "debug",
      silent: isTest && process.env.VERBOSE_TEST_LOGS !== "true",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format((info) => {
          return redactSensitiveValue(info) as winston.Logform.TransformableInfo;
        })(),
        isProduction
          ? winston.format.json()
          : winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              const ctx = context ? `[${String(context)}] ` : "";
              const metaKeys = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
              return `${String(timestamp)} ${level.toUpperCase()} ${ctx}${String(message)}${metaKeys}`;
            })
      ),
      transports: [new winston.transports.Console()],
    });
  }

  log(message: unknown, context?: string) {
    this.logger.info(String(message), { context });
  }

  error(message: unknown, trace?: string, context?: string) {
    this.logger.error(String(message), { context, trace });
  }

  warn(message: unknown, context?: string) {
    this.logger.warn(String(message), { context });
  }

  debug(message: unknown, context?: string) {
    this.logger.debug(String(message), { context });
  }

  verbose(message: unknown, context?: string) {
    this.logger.verbose(String(message), { context });
  }
}
