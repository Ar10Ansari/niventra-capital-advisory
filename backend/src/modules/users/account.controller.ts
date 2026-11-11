import { Controller, Get, Patch, Post, Body, HttpCode, HttpStatus, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { UsersService } from "./users.service";
import {
  UpdateProfileDto,
  UpdatePreferencesDto,
  ChangePasswordDto,
  DeletionRequestDto,
} from "./dto/update-profile.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { OptionalAuth } from "../../common/decorators/auth-access.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";
import { clearSessionCookie } from "../../common/utils/cookie";

@ApiTags("Users & Profiles")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("account")
@UseGuards(SessionOrJwtAuthGuard)
export class AccountController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  @Get("profile")
  @ApiOperation({ summary: "Get currently authenticated account profile" })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Update legal name, phone, or investor category" })
  async updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user, dto);
  }

  @Get("preferences")
  @ApiOperation({ summary: "Get account notification preferences" })
  async getPreferences(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getPreferences(user.id);
  }

  @Patch("preferences")
  @ApiOperation({ summary: "Update account notification preferences" })
  async updatePreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePreferencesDto
  ) {
    return this.usersService.updatePreferences(user, dto);
  }

  @Post("change-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify current password, update credentials, and revoke all active sessions" })
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.usersService.changePassword(user, dto);
    clearSessionCookie(res, this.configService);
    return result;
  }

  @OptionalAuth()
  @Post("delete")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Queue DPDP Act 2023 personal data erasure request" })
  async requestDeletion(
    @CurrentUser() user: AuthenticatedUser | null,
    @Body() dto: DeletionRequestDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.usersService.requestDeletion(user, dto);
    if (user) {
      clearSessionCookie(res, this.configService);
    }
    return result;
  }
}
