import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { IS_OPTIONAL_AUTH_KEY, IS_PUBLIC_KEY } from "../decorators/auth-access.decorator";
import { AuthenticatedUser } from "../decorators/current-user.decorator";
import { AuthService } from "../../modules/auth/auth.service";
import { JWT_AUDIENCE, JWT_ISSUER } from "../constants/auth.constants";

export const SESSION_COOKIE_NAME = "niventra_session";

export interface AuthSessionMeta {
  sessionId: string;
  sessionToken?: string;
}

interface RequestWithUser extends Request {
  user?: AuthenticatedUser | null;
  authSession?: AuthSessionMeta | null;
}

interface JwtAccessPayload {
  sub: string;
  sid?: string;
  email: string;
  role: string;
  type?: string;
}

@Injectable()
export class SessionOrJwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const isOptional = this.reflector.getAllAndOverride<boolean>(IS_OPTIONAL_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const resolved = await this.resolveAuthContext(request);
    request.user = resolved?.user ?? null;
    request.authSession = resolved?.session ?? null;

    if (!request.user && !isOptional) {
      throw new UnauthorizedException("Authentication required.");
    }

    return true;
  }

  async resolveUserFromRequest(request: Request): Promise<AuthenticatedUser | null> {
    const resolved = await this.resolveAuthContext(request);
    return resolved?.user ?? null;
  }

  async resolveAuthContext(
    request: Request
  ): Promise<{ user: AuthenticatedUser; session: AuthSessionMeta } | null> {
    // 1. Check Authorization: Bearer <jwt> pinned strictly to HS256 & active DB session ID (`sid`)
    const authHeader = request.headers?.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.slice(7).trim();
      if (bearerToken) {
        try {
          const payload = await this.jwtService.verifyAsync<JwtAccessPayload>(bearerToken, {
            secret: this.configService.get<string>("JWT_SECRET"),
            algorithms: ["HS256"],
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
          });
          if (payload?.sub && payload?.sid) {
            const jwtUser = await this.authService.validateActiveSessionById(
              payload.sub,
              payload.sid
            );
            if (jwtUser) {
              return { user: jwtUser, session: { sessionId: payload.sid } };
            }
          }
        } catch {
          // Reject invalid/expired/revoked JWTs cleanly
        }
      }
    }

    // 2. Check HttpOnly niventra_session cookie backed by active DB session
    const sessionToken = request.cookies?.[SESSION_COOKIE_NAME];
    if (typeof sessionToken === "string" && sessionToken.trim()) {
      const sessionCtx = await this.authService.validateSessionWithContext(sessionToken);
      if (sessionCtx) {
        return {
          user: sessionCtx.user,
          session: { sessionId: sessionCtx.sessionId, sessionToken: sessionCtx.sessionToken },
        };
      }
    }

    return null;
  }
}
