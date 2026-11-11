import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const CSRF_HEADER_NAME = "x-csrf-token";

export function deriveCsrfSigningKey(csrfSecret: string): Buffer {
  return createHash("sha256").update(`niventra-csrf-key:${csrfSecret}`).digest();
}

export function computeCsrfToken(sessionToken: string, csrfSecret: string): string {
  const key = deriveCsrfSigningKey(csrfSecret);
  return createHmac("sha256", key).update(`csrf-v1:${sessionToken}`).digest("base64url");
}

export function verifyCsrfToken(providedToken: string | undefined, expectedToken: string): boolean {
  if (!providedToken || !expectedToken) {
    return false;
  }
  const providedBuf = Buffer.from(providedToken.trim(), "utf8");
  const expectedBuf = Buffer.from(expectedToken, "utf8");
  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }
  return timingSafeEqual(providedBuf, expectedBuf);
}

