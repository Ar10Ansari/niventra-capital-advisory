import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AuthenticatedUser } from "../decorators/current-user.decorator";

interface RequestWithUser extends Request {
  user?: AuthenticatedUser | null;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user || !user.role) {
      throw new ForbiddenException("Access denied: User does not possess a verified institutional role.");
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Access denied: Requires role [${requiredRoles.join(", ")}].`);
    }

    return true;
  }
}
