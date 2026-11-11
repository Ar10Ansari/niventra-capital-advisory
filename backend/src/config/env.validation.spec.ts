import { validateEnvironment } from "./env.validation";

describe("Environment Validation", () => {
  it("should allow local development defaults cleanly without production secrets", () => {
    const resolved = validateEnvironment({ NODE_ENV: "development", PORT: "4000" });
    expect(resolved.NODE_ENV).toBe("development");
    expect(resolved.COOKIE_SECURE).toBe(false);
    expect(resolved.COOKIE_SAMESITE).toBe("lax");
    expect(resolved.TRUST_PROXY_HOPS).toBe(0);
    expect(resolved.SWAGGER_ENABLED).toBe(true);
  });

  it("should block staging and production boot when JWT_SECRET or DATABASE_URL is missing or weak", () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: "staging",
        JWT_SECRET: "short",
        DATABASE_URL: "postgresql://user:pass@host:5432/db?sslmode=require",
      })
    ).toThrow(/STAGING boot blocked/i);

    expect(() =>
      validateEnvironment({
        NODE_ENV: "staging",
        JWT_SECRET: "A_very_strong_staging_cryptographic_secret_exceeding_32_characters",
      })
    ).toThrow(/DATABASE_URL is required/i);

    expect(() =>
      validateEnvironment({
        NODE_ENV: "production",
        JWT_SECRET: "niventra-nonprod-ephemeral-signing-secret-do-not-use-in-prod",
        DATABASE_URL: "postgresql://user:pass@host:5432/db?sslmode=require",
      })
    ).toThrow(/PRODUCTION boot blocked/i);
  });

  it("should reject wildcard, null, and insecure HTTP origins in staging/production CORS_ORIGINS", () => {
    const validSecret = "B_very_strong_cryptographic_secret_at_least_64_characters_long_123456";
    const dbUrl = "postgresql://user:pass@host:5432/db?sslmode=require";

    expect(() =>
      validateEnvironment({
        NODE_ENV: "production",
        JWT_SECRET: validSecret,
        DATABASE_URL: dbUrl,
        CORS_ORIGINS: "*",
      })
    ).toThrow(/Disallowed CORS origin/i);

    expect(() =>
      validateEnvironment({
        NODE_ENV: "staging",
        JWT_SECRET: validSecret,
        DATABASE_URL: dbUrl,
        CORS_ORIGINS: "http://staging.example.com",
      })
    ).toThrow(/HTTPS is required/i);
  });

  it("should enforce SameSite=none HTTPS requirement and disable Swagger by default in production", () => {
    const validSecret = "C_very_strong_cryptographic_secret_at_least_64_characters_long_123456";
    const dbUrl = "postgresql://user:pass@host:5432/db?sslmode=require";

    expect(() =>
      validateEnvironment({
        NODE_ENV: "staging",
        JWT_SECRET: validSecret,
        DATABASE_URL: dbUrl,
        COOKIE_SAMESITE: "none",
        COOKIE_SECURE: "false",
      })
    ).toThrow(/COOKIE_SAMESITE=none requires COOKIE_SECURE=true/i);

    const prod = validateEnvironment({
      NODE_ENV: "production",
      JWT_SECRET: validSecret,
      DATABASE_URL: dbUrl,
      CORS_ORIGINS: "https://niventra-capital-advisory.vercel.app",
    });

    expect(prod.COOKIE_SECURE).toBe(true);
    expect(prod.COOKIE_SAMESITE).toBe("none");
    expect(prod.TRUST_PROXY_HOPS).toBe(1);
    expect(prod.SWAGGER_ENABLED).toBe(false);
    expect(prod.CORS_ORIGINS).not.toContain("http://localhost:3000");
  });
});

