import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { redactSensitiveValue, sanitizeUrlForLog } from "../utils/masking";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const env = String(process.env.NODE_ENV || "development").toLowerCase();
    const hideInternalErrors = env === "production" || env === "staging";
    const safePath = sanitizeUrlForLog(request.originalUrl || request.url);

    let message = "Internal server error";
    if (typeof exceptionResponse === "string") {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === "object" &&
      exceptionResponse !== null &&
      "message" in exceptionResponse
    ) {
      const msg = (exceptionResponse as { message: string | string[] }).message;
      message = Array.isArray(msg) ? msg.join("; ") : msg;
    } else if (
      typeof exceptionResponse === "object" &&
      exceptionResponse !== null &&
      "error" in exceptionResponse
    ) {
      message = String((exceptionResponse as { error: unknown }).error);
    } else if (exception instanceof Error && status < 500) {
      message = exception.message;
    } else if (exception instanceof Error && !hideInternalErrors) {
      message = exception.message;
    }

    if (status >= 500) {
      const sanitizedDetail =
        exception instanceof Error
          ? redactSensitiveValue(exception.message)
          : "Unknown internal error";
      this.logger.error(`${request.method} ${safePath} -> ${status}: ${String(sanitizedDetail)}`);
      if (hideInternalErrors) {
        message = "An unexpected server error occurred. Please contact support.";
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: safePath,
      error: message,
    });
  }
}
