import { ConfigService } from "@nestjs/config";
import { CookieOptions, Response } from "express";
import { SESSION_COOKIE_NAME } from "../guards/auth.guard";
import { CookieSameSiteMode } from "../../config/env.validation";

export function getSessionCookieOptions(configService: ConfigService): CookieOptions {
  const isSecure = configService.get<boolean>("COOKIE_SECURE") ?? false;
  const sameSite = configService.get<CookieSameSiteMode>("COOKIE_SAMESITE") || "lax";
  const domain = configService.get<string>("COOKIE_DOMAIN");

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    path: "/",
    ...(domain ? { domain } : {}),
  };
}

export function clearSessionCookie(res: Response, configService: ConfigService): void {
  res.clearCookie(SESSION_COOKIE_NAME, getSessionCookieOptions(configService));
}

