import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { WinstonLoggerService } from "../logger/winston-logger.service";
import { AuthenticatedUser } from "../decorators/current-user.decorator";
import { sanitizeUrlForLog } from "../utils/masking";

interface RequestWithUser extends Request {
  user?: AuthenticatedUser | null;
}

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<RequestWithUser>();
    const res = http.getResponse<Response>();
    const startedAt = Date.now();
    const safePath = sanitizeUrlForLog(req.originalUrl || req.url);

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - startedAt;
          this.logger.log(
            `${req.method} ${safePath} ${res.statusCode} ${durationMs}ms role=${req.user?.role || "PUBLIC"}`,
            "HttpRequest"
          );
        },
        error: (err: unknown) => {
          const durationMs = Date.now() - startedAt;
          const errStatus =
            typeof err === "object" && err !== null && "getStatus" in err
              ? (err as { getStatus: () => number }).getStatus()
              : 500;
          this.logger.warn(
            `${req.method} ${safePath} ${errStatus} ${durationMs}ms role=${req.user?.role || "PUBLIC"}`,
            "HttpRequest"
          );
        },
      })
    );
  }
}
