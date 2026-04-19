"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { handlePrismaError, AppError } from "@/lib/errors";
import {
  assertRole,
  ROLES,
  requireSchoolMembershipBySlug,
  requireSession,
} from "@/lib/auth-guards";
import {
  ListSchoolMembersInput,
  listSchoolMembersSchema,
  RemoveMembershipInput,
  removeMembershipSchema,
  UpdateMembershipRoleInput,
  updateMembershipRoleSchema,
  UpdateUserProfileInput,
  updateUserProfileSchema,
} from "@/lib/schemas/user.schema";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  status: true,
  isActive: true,
  emailVerified: true,
  birthdate: true,
  createdAt: true,
  updatedAt: true,
  schools: {
    select: {
      id: true,
      schoolId: true,
      role: true,
      joinedAt: true,
      school: {
        select: { id: true, name: true, slug: true, status: true },
      },
    },
  },
} as const;

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: safeUserSelect,
  });
};

export const getCurrentUser = async () => {
  const session = await requireSession();
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: safeUserSelect,
  });
};

export const updateUserProfile = async (input: UpdateUserProfileInput) => {
  const data = updateUserProfileSchema.parse(input);
  const session = await requireSession();

  try {
    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name: data.name,
        image: data.image !== undefined ? (data.image || null) : undefined,
        phone: data.phone !== undefined ? (data.phone || null) : undefined,
        birthdate: data.birthdate,
      },
      select: safeUserSelect,
    });
    revalidatePath("/");
    return updated;
  } catch (error) {
    throw handlePrismaError(error, {
      P2002: "Cet email ou téléphone est déjà utilisé.",
      P2025: "Utilisateur introuvable.",
      default: "Erreur lors de la mise à jour du profil.",
    });
  }
};

export const listSchoolMembers = async (input: ListSchoolMembersInput) => {
  const data = listSchoolMembersSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);

  return prisma.userSchool.findMany({
    where: {
      schoolId: membership.schoolId,
      ...(data.search
        ? {
            user: {
              OR: [
                { name: { contains: data.search, mode: "insensitive" as const } },
                { email: { contains: data.search, mode: "insensitive" as const } },
              ],
            },
          }
        : {}),
    },
    select: {
      id: true,
      role: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          status: true,
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });
};

export const updateMembershipRole = async (input: UpdateMembershipRoleInput) => {
  const data = updateMembershipRoleSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.DIRECTOR_ONLY);

  if (data.targetUserId === membership.userId) {
    throw new AppError(
      "Vous ne pouvez pas modifier votre propre rôle.",
      "FORBIDDEN",
    );
  }

  try {
    const updated = await prisma.userSchool.update({
      where: {
        userId_schoolId: {
          userId: data.targetUserId,
          schoolId: membership.schoolId,
        },
      },
      data: { role: data.role },
      select: { id: true, role: true },
    });
    revalidatePath(`/${data.schoolSlug}`);
    return updated;
  } catch (error) {
    throw handlePrismaError(error, {
      P2025: "Membre introuvable.",
      default: "Erreur lors de la mise à jour du rôle.",
    });
  }
};

export const removeMembership = async (input: RemoveMembershipInput) => {
  const data = removeMembershipSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.DIRECTOR_ONLY);

  if (data.targetUserId === membership.userId) {
    throw new AppError(
      "Vous ne pouvez pas vous retirer vous-même.",
      "FORBIDDEN",
    );
  }

  try {
    await prisma.userSchool.delete({
      where: {
        userId_schoolId: {
          userId: data.targetUserId,
          schoolId: membership.schoolId,
        },
      },
    });
    revalidatePath(`/${data.schoolSlug}`);
    return { ok: true as const };
  } catch (error) {
    throw handlePrismaError(error, {
      P2025: "Membre introuvable.",
      default: "Erreur lors du retrait du membre.",
    });
  }
};
