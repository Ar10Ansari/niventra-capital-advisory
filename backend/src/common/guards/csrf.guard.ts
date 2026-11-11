import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { SESSION_COOKIE_NAME } from "./auth.guard";
import { CSRF_HEADER_NAME, computeCsrfToken, verifyCsrfToken } from "../utils/csrf";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CREDENTIAL_BOOTSTRAP_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]);

function extractOriginFromReferer(refererHeader: string | undefined): string | null {
  if (!refererHeader) return null;
  try {
    const parsed = new URL(refererHeader);
    return parsed.origin;
  } catch {
    return "INVALID";
  }
}

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== "http") {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const method = (request.method || "GET").toUpperCase();
    if (SAFE_METHODS.has(method)) {
      return true;
    }

    const allowedOrigins = new Set(
      (this.configService.get<string[]>("CORS_ORIGINS") || []).map((o) =>
        o.trim().replace(/\/+$/, "")
      )
    );

    const originHeader =
      typeof request.headers.origin === "string" ? request.headers.origin.trim() : undefined;
    if (originHeader !== undefined) {
      const normalizedOrigin = originHeader.replace(/\/+$/, "");
      if (
        !normalizedOrigin ||
        normalizedOrigin.toLowerCase() === "null" ||
        normalizedOrigin === "*" ||
        !allowedOrigins.has(normalizedOrigin)
      ) {
        throw new ForbiddenException("Cross-origin request blocked: Untrusted Origin header.");
      }
    } else if (typeof request.headers.referer === "string") {
      const refererOrigin = extractOriginFromReferer(request.headers.referer);
      if (
        !refererOrigin ||
        refererOrigin === "INVALID" ||
        !allowedOrigins.has(refererOrigin.replace(/\/+$/, ""))
      ) {
        throw new ForbiddenException("Cross-origin request blocked: Untrusted Referer origin.");
      }
    }

    const requestPath = (request.originalUrl || request.url || "").split("?")[0].replace(/\/+$/, "");
    const sessionCookie =
      typeof request.cookies?.[SESSION_COOKIE_NAME] === "string"
        ? request.cookies[SESSION_COOKIE_NAME].trim()
        : "";
    const authHeader =
      typeof request.headers.authorization === "string" ? request.headers.authorization.trim() : "";
    const usesBearerToken = authHeader.startsWith("Bearer ");

    // Require cryptographic X-CSRF-Token on all state-changing requests authenticated by cookies
    // (unless the request explicitly supplies a Bearer header or resets credentials via login/register/reset).
    if (sessionCookie && !usesBearerToken && !CREDENTIAL_BOOTSTRAP_PATHS.has(requestPath)) {
      const providedCsrf =
        typeof request.headers[CSRF_HEADER_NAME] === "string"
          ? request.headers[CSRF_HEADER_NAME]
          : undefined;
      const csrfSecret =
        this.configService.get<string>("CSRF_SECRET") ||
        this.configService.get<string>("JWT_SECRET") ||
        "";
      const expectedCsrf = computeCsrfToken(sessionCookie, csrfSecret);
      if (!verifyCsrfToken(providedCsrf, expectedCsrf)) {
        throw new ForbiddenException("CSRF validation failed: missing or invalid X-CSRF-Token header.");
      }
    }

    return true;
  }
}

