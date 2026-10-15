import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Hashes a password using crypto.scrypt with a unique random salt
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString("hex"),
    salt,
  };
}

/**
 * Verifies a candidate password against stored hash and salt
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const derivedKey = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHash, "hex");
    return timingSafeEqual(derivedKey, storedBuffer);
  } catch {
    return false;
  }
}
