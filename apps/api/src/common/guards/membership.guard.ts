import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { AppError } from "../errors";
import { ROLES_KEY } from "../decorators/roles.decorator";
import type { UserRole } from "../../../../../generated/prisma/enums";
import type { SessionContext } from "./session.guard";

export type Membership = {
  userId: string;
  schoolId: string;
  schoolSlug: string;
  role: UserRole;
};

/**
 * Lit `:schoolSlug` depuis les params, vérifie l'appartenance, applique éventuellement les @Roles().
 * Doit être utilisé APRÈS SessionGuard.
 */
@Injectable()
export class MembershipGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<
      Request & {
        session?: SessionContext;
        membership?: Membership;
        params: { schoolSlug?: string };
      }
    >();

    const session = req.session;
    if (!session) {
      throw new AppError("Veuillez vous reconnecter.", "UNAUTHORIZED");
    }
    const slug = req.params.schoolSlug;
    if (!slug) {
      throw new AppError("Slug d'école manquant.", "VALIDATION");
    }

    const school = await this.prisma.school.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!school) throw new AppError("École introuvable.", "NOT_FOUND");

    const membership = await this.prisma.userSchool.findUnique({
      where: { userId_schoolId: { userId: session.userId, schoolId: school.id } },
      select: { role: true },
    });
    if (!membership) {
      throw new AppError("Accès refusé à cette école.", "FORBIDDEN");
    }

    req.membership = {
      userId: session.userId,
      schoolId: school.id,
      schoolSlug: slug,
      role: membership.role,
    };

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRoles && !requiredRoles.includes(membership.role)) {
      throw new AppError(
        "Vous n'avez pas les droits pour cette action.",
        "FORBIDDEN",
      );
    }

    return true;
  }
}
