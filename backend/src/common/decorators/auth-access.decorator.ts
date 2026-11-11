import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";
export const IS_OPTIONAL_AUTH_KEY = "isOptionalAuth";

/**
 * Marks an endpoint as publicly accessible (no session cookie or Bearer JWT required).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Resolves authenticated user when present, while permitting unauthenticated requests.
 */
export const OptionalAuth = () => SetMetadata(IS_OPTIONAL_AUTH_KEY, true);
