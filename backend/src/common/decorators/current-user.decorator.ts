import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  investor_category?: string | null;
  notify_consultations?: number;
  notify_disclosures?: number;
  notify_grievances?: number;
  status?: string;
  created_at?: string;
}

interface RequestWithUser extends Request {
  user?: AuthenticatedUser | null;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user ?? null;
  }
);
