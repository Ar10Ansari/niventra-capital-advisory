import { Controller, Get, Patch, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Notifications")
@ApiCookieAuth("niventra_session")
@ApiBearerAuth()
@Controller("notifications")
@UseGuards(SessionOrJwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Get notifications for currently authenticated user" })
  async list(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.getUserNotifications(user.id);
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Mark a notification as read" })
  async markRead(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.notificationsService.markAsRead(id, user.id);
  }
}
