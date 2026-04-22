import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "../../auth/auth.service";
import { AppError } from "../errors";

export type SessionContext = {
  userId: string;
  email: string | null;
};

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { session?: SessionContext }>();
    const session = await this.authService.getSession(req);
    if (!session?.user?.id) {
      throw new AppError("Veuillez vous reconnecter.", "UNAUTHORIZED");
    }
    req.session = { userId: session.user.id, email: session.user.email ?? null };
    return true;
  }
}
