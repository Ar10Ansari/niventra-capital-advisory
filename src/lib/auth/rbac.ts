import { redirect } from "next/navigation";
import { getCurrentUser, SafeUser } from "./session";

export type UserRole = "PUBLIC" | "INVESTOR" | "STAFF" | "ADMIN";

/**
 * Checks whether user possesses at least one of the allowed roles
 */
export function hasRole(user: SafeUser | null, allowedRoles: UserRole[]): boolean {
  if (!user) return allowedRoles.includes("PUBLIC");
  return allowedRoles.includes(user.role);
}

/**
 * Server guard: requires authentication; redirects to /login if unauthenticated
 */
export async function requireAuth(redirectTo = "/login/"): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Server guard: requires a specific role; redirects if unauthorized
 */
export async function requireRole(allowedRoles: UserRole[], redirectTo = "/"): Promise<SafeUser> {
  const user = await requireAuth("/login/");
  if (!allowedRoles.includes(user.role)) {
    redirect(redirectTo);
  }
  return user;
}
