const SENSITIVE_KEY_PATTERN =
  /(password|secret|token|csrf|authorization|cookie|salt|signature|panNumber|idNumber|aadhaar|apiKey|privateKey|credential|resetToken|sessionToken|accessToken)/i;

/**
 * Strips query strings from URLs before writing logs or error responses so query tokens never leak.
 */
export function sanitizeUrlForLog(rawUrl: string | undefined): string {
  const value = String(rawUrl || "").trim();
  if (!value) return "/";
  const qIdx = value.indexOf("?");
  return qIdx >= 0 ? value.slice(0, qIdx) : value;
}

/**
 * Masks an email address so logs never store plaintext PII emails.
 * Example: "investor@example.com" -> "i***r@example.com"
 */
export function maskEmail(email: string): string {
  const parts = String(email || "").split("@");
  if (parts.length !== 2) return "***@***";
  const [local, domain] = parts;
  if (local.length <= 2) return `${local[0] || "*"}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

export function maskPan(pan: string): string {
  const clean = pan.trim().toUpperCase();
  if (clean.length < 4) return "**********";
  return `${clean.slice(0, 2)}*****${clean.slice(-2)}`;
}

export function maskIdNumber(idNum: string): string {
  const clean = idNum.trim();
  if (clean.length < 4) return "****";
  return "*".repeat(clean.length - 4) + clean.slice(-4);
}

/**
 * Redacts known credential and PII fields before writing structured logs.
 */
export function redactSensitiveValue(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[TRUNCATED]";
  if (value === null || value === undefined) return value;

  if (typeof value === "string") {
    if (value.includes("Bearer ")) {
      return "Bearer [REDACTED]";
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveValue(item, depth + 1));
  }

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        out[key] = "[REDACTED]";
      } else if (/email/i.test(key) && typeof val === "string") {
        out[key] = maskEmail(val);
      } else {
        out[key] = redactSensitiveValue(val, depth + 1);
      }
    }
    return out;
  }

  return value;
}
