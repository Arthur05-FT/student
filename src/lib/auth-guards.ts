import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./prisma";
import { AppError } from "./errors";
import type { UserRole } from "../../generated/prisma/enums";

export type SessionContext = {
  userId: string;
  email: string | null;
};

export const requireSession = async (): Promise<SessionContext> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new AppError("Veuillez vous reconnecter.", "UNAUTHORIZED");
  }
  return { userId: session.user.id, email: session.user.email ?? null };
};

export type Membership = {
  userId: string;
  schoolId: string;
  role: UserRole;
};

export const requireSchoolMembership = async (
  schoolId: string,
): Promise<Membership> => {
  const session = await requireSession();
  const membership = await prisma.userSchool.findUnique({
    where: { userId_schoolId: { userId: session.userId, schoolId } },
    select: { role: true },
  });
  if (!membership) {
    throw new AppError("Accès refusé à cette école.", "FORBIDDEN");
  }
  return { userId: session.userId, schoolId, role: membership.role };
};

export const requireSchoolMembershipBySlug = async (
  slug: string,
): Promise<Membership> => {
  const session = await requireSession();
  const school = await prisma.school.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!school) throw new AppError("École introuvable.", "NOT_FOUND");

  const membership = await prisma.userSchool.findUnique({
    where: { userId_schoolId: { userId: session.userId, schoolId: school.id } },
    select: { role: true },
  });
  if (!membership) {
    throw new AppError("Accès refusé à cette école.", "FORBIDDEN");
  }
  return { userId: session.userId, schoolId: school.id, role: membership.role };
};

export const assertRole = (
  membership: Membership,
  allowedRoles: readonly UserRole[],
): void => {
  if (!allowedRoles.includes(membership.role)) {
    throw new AppError(
      "Vous n'avez pas les droits pour cette action.",
      "FORBIDDEN",
    );
  }
};

export const ROLES = {
  ALL: ["SUPER_ADMIN", "DIRECTOR", "ADMIN", "TEACHER"] as const,
  STAFF: ["SUPER_ADMIN", "DIRECTOR", "ADMIN"] as const,
  ADMINS: ["SUPER_ADMIN", "DIRECTOR"] as const,
  DIRECTOR_ONLY: ["SUPER_ADMIN", "DIRECTOR"] as const,
} as const;
