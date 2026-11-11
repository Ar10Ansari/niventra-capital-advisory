export type CookieSameSiteMode = "lax" | "strict" | "none";

export interface BackendEnvConfig {
  NODE_ENV: "development" | "test" | "production" | "staging";
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CSRF_SECRET: string;
  CORS_ORIGINS: string[];
  COOKIE_SAMESITE: CookieSameSiteMode;
  COOKIE_SECURE: boolean;
  COOKIE_DOMAIN?: string;
  TRUST_PROXY_HOPS: number;
  SWAGGER_ENABLED: boolean;
  DATABASE_URL?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM: string;
  LEAD_NOTIFICATION_EMAILS: string[];
  STAFF_LEAD_NOTIFICATION_EMAILS: string[];
  STORAGE_ROOT_DIR?: string;
  S3_BUCKET_NAME?: string;
  S3_REGION?: string;
  S3_ACCESS_KEY_ID?: string;
  S3_SECRET_ACCESS_KEY?: string;
}

const NONPROD_LOCAL_CORS_ORIGINS = [
  "https://niventra-capital-advisory.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const PROD_DEFAULT_CORS_ORIGINS = ["https://niventra-capital-advisory.vercel.app"];

const WEAK_PLACEHOLDER_SECRET = "niventra-nonprod-ephemeral-signing-secret-do-not-use-in-prod";

function parseCsvList(raw: unknown): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, "");
}

function parseBooleanFlag(raw: unknown, defaultValue: boolean): boolean {
  if (raw === undefined || raw === null || raw === "") return defaultValue;
  const val = String(raw).trim().toLowerCase();
  if (val === "true" || val === "1") return true;
  if (val === "false" || val === "0") return false;
  throw new Error(`Invalid boolean configuration value: ${String(raw)}`);
}

export function validateEnvironment(config: Record<string, unknown>): Record<string, unknown> {
  const rawNodeEnv = String(config.NODE_ENV || "development").toLowerCase();
  const nodeEnv: BackendEnvConfig["NODE_ENV"] =
    rawNodeEnv === "production" || rawNodeEnv === "test" || rawNodeEnv === "staging"
      ? rawNodeEnv
      : "development";

  const isStrictDeployedEnv = nodeEnv === "production" || nodeEnv === "staging";

  const rawPort = Number(config.PORT ?? 4000);
  if (!Number.isInteger(rawPort) || rawPort < 1 || rawPort > 65535) {
    throw new Error(`Invalid PORT configuration: ${String(config.PORT)}`);
  }

  const jwtSecret = typeof config.JWT_SECRET === "string" ? config.JWT_SECRET.trim() : "";
  const isPlaceholderSecret =
    jwtSecret.startsWith("replace_with_") || jwtSecret === WEAK_PLACEHOLDER_SECRET;

  if (isStrictDeployedEnv) {
    if (!jwtSecret || isPlaceholderSecret || jwtSecret.length < 32) {
      throw new Error(
        `FATAL: ${nodeEnv.toUpperCase()} boot blocked — JWT_SECRET must be set to a non-placeholder cryptographic secret (minimum 32 characters).`
      );
    }
    if (typeof config.DATABASE_URL !== "string" || !config.DATABASE_URL.trim()) {
      throw new Error(`FATAL: ${nodeEnv.toUpperCase()} boot blocked — DATABASE_URL is required.`);
    }
  }

  const resolvedJwtSecret = jwtSecret && !isPlaceholderSecret ? jwtSecret : WEAK_PLACEHOLDER_SECRET;

  const rawCsrfSecret = typeof config.CSRF_SECRET === "string" ? config.CSRF_SECRET.trim() : "";
  const isPlaceholderCsrf = rawCsrfSecret.startsWith("replace_with_");
  if (rawCsrfSecret && (isPlaceholderCsrf || rawCsrfSecret.length < 32)) {
    throw new Error("Invalid CSRF_SECRET configuration: must be at least 32 non-placeholder characters.");
  }
  const resolvedCsrfSecret =
    rawCsrfSecret && !isPlaceholderCsrf ? rawCsrfSecret : resolvedJwtSecret;

  const baseCors = isStrictDeployedEnv ? PROD_DEFAULT_CORS_ORIGINS : NONPROD_LOCAL_CORS_ORIGINS;
  const appUrlOrigin =
    typeof config.NEXT_PUBLIC_APP_URL === "string" && config.NEXT_PUBLIC_APP_URL.trim()
      ? [normalizeOrigin(config.NEXT_PUBLIC_APP_URL)]
      : [];

  const configuredCors = parseCsvList(config.CORS_ORIGINS).map(normalizeOrigin);
  for (const origin of [...configuredCors, ...appUrlOrigin]) {
    if (origin === "*" || origin.toLowerCase() === "null") {
      throw new Error(`FATAL: Disallowed CORS origin "${origin}" when credentials are enabled.`);
    }
    if (isStrictDeployedEnv && origin.toLowerCase().startsWith("http://")) {
      throw new Error(
        `FATAL: Insecure HTTP origin "${origin}" is not permitted in ${nodeEnv} CORS_ORIGINS; HTTPS is required.`
      );
    }
  }

  const corsOrigins = Array.from(new Set([...baseCors, ...configuredCors, ...appUrlOrigin]));

  const defaultCookieSecure = isStrictDeployedEnv;
  const cookieSecure = parseBooleanFlag(config.COOKIE_SECURE, defaultCookieSecure);

  const defaultSameSite: CookieSameSiteMode = isStrictDeployedEnv ? "none" : "lax";
  const rawSameSite =
    typeof config.COOKIE_SAMESITE === "string" && config.COOKIE_SAMESITE.trim()
      ? config.COOKIE_SAMESITE.trim().toLowerCase()
      : defaultSameSite;
  if (rawSameSite !== "lax" && rawSameSite !== "strict" && rawSameSite !== "none") {
    throw new Error(`Invalid COOKIE_SAMESITE configuration: ${String(config.COOKIE_SAMESITE)}`);
  }
  const cookieSameSite: CookieSameSiteMode = rawSameSite;

  if (cookieSameSite === "none" && !cookieSecure) {
    throw new Error("FATAL: COOKIE_SAMESITE=none requires COOKIE_SECURE=true (HTTPS only).");
  }

  const cookieDomain =
    typeof config.COOKIE_DOMAIN === "string" && config.COOKIE_DOMAIN.trim()
      ? config.COOKIE_DOMAIN.trim()
      : undefined;

  const defaultTrustProxyHops = isStrictDeployedEnv ? 1 : 0;
  const rawTrustProxy =
    config.TRUST_PROXY_HOPS !== undefined && config.TRUST_PROXY_HOPS !== ""
      ? Number(config.TRUST_PROXY_HOPS)
      : defaultTrustProxyHops;
  if (!Number.isInteger(rawTrustProxy) || rawTrustProxy < 0 || rawTrustProxy > 5) {
    throw new Error(`Invalid TRUST_PROXY_HOPS configuration: ${String(config.TRUST_PROXY_HOPS)}`);
  }

  const swaggerEnabled = parseBooleanFlag(config.SWAGGER_ENABLED, nodeEnv !== "production");

  return {
    ...config,
    NODE_ENV: nodeEnv,
    PORT: rawPort,
    JWT_SECRET: resolvedJwtSecret,
    JWT_EXPIRES_IN:
      typeof config.JWT_EXPIRES_IN === "string" && config.JWT_EXPIRES_IN.trim()
        ? config.JWT_EXPIRES_IN.trim()
        : "15m",
    CSRF_SECRET: resolvedCsrfSecret,
    CORS_ORIGINS: corsOrigins,
    COOKIE_SAMESITE: cookieSameSite,
    COOKIE_SECURE: cookieSecure,
    COOKIE_DOMAIN: cookieDomain,
    TRUST_PROXY_HOPS: rawTrustProxy,
    SWAGGER_ENABLED: swaggerEnabled,
    EMAIL_FROM:
      typeof config.EMAIL_FROM === "string" && config.EMAIL_FROM.trim()
        ? config.EMAIL_FROM.trim()
        : "Niventra Capital Advisory <notifications@niventracapitaladvisory.com>",
    LEAD_NOTIFICATION_EMAILS: parseCsvList(config.LEAD_NOTIFICATION_EMAILS),
    STAFF_LEAD_NOTIFICATION_EMAILS: parseCsvList(config.STAFF_LEAD_NOTIFICATION_EMAILS),
  };
}
