import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InvestmentsService } from "./investments.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { OptionalAuth } from "../../common/decorators/auth-access.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Investments & Holdings")
@Controller("products")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @OptionalAuth()
  @Get()
  @ApiOperation({ summary: "List structured debenture product offerings" })
  async list(@CurrentUser() user: AuthenticatedUser | null) {
    return this.investmentsService.listProducts(user);
  }

  @Post()
  @Roles("ADMIN")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Publish a new debenture offering to product catalog (Admin only)" })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProductDto) {
    return this.investmentsService.createProduct(dto, user);
  }
}
