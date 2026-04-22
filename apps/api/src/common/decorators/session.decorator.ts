import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { SessionContext } from "../guards/session.guard";

export const Session = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): SessionContext => {
    const req = ctx.switchToHttp().getRequest<Request & { session?: SessionContext }>();
    if (!req.session) {
      throw new Error("Session decorator used without SessionGuard");
    }
    return req.session;
  },
);
