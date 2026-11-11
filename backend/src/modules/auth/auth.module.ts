import { Global, Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { JWT_AUDIENCE, JWT_ISSUER } from "../../common/constants/auth.constants";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: {
          algorithm: "HS256",
          expiresIn: (config.get<string>("JWT_EXPIRES_IN") || "15m") as NonNullable<
            JwtModuleOptions["signOptions"]
          >["expiresIn"],
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
        },
        verifyOptions: {
          algorithms: ["HS256"],
          issuer: JWT_ISSUER,
          audience: JWT_AUDIENCE,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionOrJwtAuthGuard, RolesGuard],
  exports: [AuthService, SessionOrJwtAuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
