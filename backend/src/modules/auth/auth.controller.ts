import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto, ResetPasswordDto } from "./dto/password-reset.dto";
import {
  AuthSessionMeta,
  SESSION_COOKIE_NAME,
  SessionOrJwtAuthGuard,
} from "../../common/guards/auth.guard";
import { OptionalAuth, Public } from "../../common/decorators/auth-access.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { clearSessionCookie, getSessionCookieOptions } from "../../common/utils/cookie";

interface RequestWithAuthSession extends Request {
  authSession?: AuthSessionMeta | null;
}

@ApiTags("Authentication")
@Controller("auth")
@UseGuards(SessionOrJwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  private extractMeta(req: Request) {
    return {
      ipAddress: req.ip || req.socket?.remoteAddress,
      userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : undefined,
    };
  }

  private setSessionCookie(res: Response, sessionToken: string, expiresAt: Date) {
    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      ...getSessionCookieOptions(this.configService),
      expires: expiresAt,
    });
  }

  @OptionalAuth()
  @Get("csrf")
  @ApiOperation({ summary: "Retrieve CSRF token bound to the current active session cookie" })
  async getCsrfToken(
    @Req() req: RequestWithAuthSession,
    @Res({ passthrough: true }) res: Response
  ) {
    res.setHeader("Cache-Control", "no-store");
    const sessionToken = req.authSession?.sessionToken || req.cookies?.[SESSION_COOKIE_NAME];
    if (!sessionToken || !req.authSession) {
      return { csrfToken: null };
    }
    const csrfToken = this.authService.getCsrfTokenForSession(sessionToken);
    res.setHeader("X-CSRF-Token", csrfToken);
    return { csrfToken };
  }

  @Public()
  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: "Register a new investor account" })
  @ApiResponse({ status: 201, description: "User registered successfully." })
  @ApiResponse({ status: 409, description: "Email already registered." })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.register(dto, this.extractMeta(req));
    this.setSessionCookie(res, result.sessionToken, result.expiresAt);
    res.setHeader("X-CSRF-Token", result.csrfToken);
    return {
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      csrfToken: result.csrfToken,
    };
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: "Authenticate with email and password" })
  @ApiResponse({ status: 200, description: "Authentication successful." })
  @ApiResponse({ status: 401, description: "Invalid credentials." })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(dto, this.extractMeta(req));
    this.setSessionCookie(res, result.sessionToken, result.expiresAt);
    res.setHeader("X-CSRF-Token", result.csrfToken);
    return {
      success: true,
      user: result.user,
      accessToken: result.accessToken,
      csrfToken: result.csrfToken,
    };
  }

  @OptionalAuth()
  @Get("me")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user" })
  async me(
    @CurrentUser() user: AuthenticatedUser | null,
    @Req() req: RequestWithAuthSession,
    @Res({ passthrough: true }) res: Response
  ) {
    res.setHeader("Cache-Control", "no-store");
    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED);
      return { authenticated: false, user: null, csrfToken: null };
    }
    const csrfToken = req.authSession?.sessionToken
      ? this.authService.getCsrfTokenForSession(req.authSession.sessionToken)
      : null;
    if (csrfToken) {
      res.setHeader("X-CSRF-Token", csrfToken);
    }
    return { authenticated: true, user, csrfToken };
  }

  @OptionalAuth()
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Terminate active session and clear cookie" })
  async logout(
    @CurrentUser() user: AuthenticatedUser | null,
    @Req() req: RequestWithAuthSession,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = req.cookies?.[SESSION_COOKIE_NAME];
    await this.authService.logout(token, user, this.extractMeta(req), req.authSession?.sessionId);
    clearSessionCookie(res, this.configService);
    return { success: true, message: "Logged out successfully." };
  }

  @Public()
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: "Request single-use password recovery token" })
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    return this.authService.forgotPassword(dto, this.extractMeta(req));
  }

  @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: "Complete password recovery using single-use token" })
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    return this.authService.resetPassword(dto, this.extractMeta(req));
  }
}
