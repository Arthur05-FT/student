import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import type { Membership } from "../guards/membership.guard";

export const CurrentMembership = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Membership => {
    const req = ctx.switchToHttp().getRequest<Request & { membership?: Membership }>();
    if (!req.membership) {
      throw new Error("CurrentMembership decorator used without MembershipGuard");
    }
    return req.membership;
  },
);
