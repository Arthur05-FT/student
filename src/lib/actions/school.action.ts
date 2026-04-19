"use server";

import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/generate-slug";
import { prisma } from "@/lib/prisma";
import {
  CreateSchoolForm,
  createSchoolSchema,
  DeleteSchoolInput,
  deleteSchoolSchema,
  UpdateSchoolInput,
  updateSchoolSchema,
} from "@/lib/schemas/school.schema";
import { handlePrismaError } from "@/lib/errors";
import {
  assertRole,
  requireSchoolMembershipBySlug,
  requireSession,
  ROLES,
} from "@/lib/auth-guards";

const schoolDetailSelect = {
  id: true,
  name: true,
  slug: true,
  email: true,
  city: true,
  country: true,
  type: true,
  status: true,
  onboardingCompleted: true,
  classes: {
    select: { id: true, name: true, createdAt: true },
    orderBy: { createdAt: "desc" as const },
  },
  _count: { select: { students: true, classes: true, users: true } },
} as const;

export const findSchoolByEmailUserName = async (email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email },
      select: {
        role: true,
        schools: {
          select: {
            school: { select: { name: true, slug: true } },
          },
        },
      },
    });

    const firstSchool = user?.schools?.[0]?.school;

    return {
      schoolName: firstSchool?.name ?? null,
      schoolSlug: firstSchool?.slug ?? null,
      role: user?.role ?? null,
    };
  } catch {
    return { schoolName: null, schoolSlug: null, role: null };
  }
};

export const createSchool = async (data: CreateSchoolForm) => {
  const parsed = createSchoolSchema.parse(data);
  const session = await requireSession();
  const slug = generateSlug(parsed.name);

  try {
    const created = await prisma.school.create({
      data: {
        name: parsed.name,
        email: parsed.email?.trim() ? parsed.email.trim() : null,
        slug,
        city: parsed.city,
        country: parsed.country,
        type: parsed.type,
        users: {
          create: { userId: session.userId, role: "DIRECTOR" },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
    revalidatePath("/");
    return created;
  } catch (error: unknown) {
    throw handlePrismaError(error, {
      P2002: "Une école avec ce nom existe déjà.",
      default: "Erreur lors de la création de l'école.",
    });
  }
};

export const findSchoolBySlug = async (slug: string) => {
  return prisma.school.findUnique({
    where: { slug },
    select: schoolDetailSelect,
  });
};

export const findUserSchoolMembership = async (
  userId: string,
  schoolId: string,
) => {
  return prisma.userSchool.findUnique({
    where: { userId_schoolId: { userId, schoolId } },
    select: { id: true, role: true },
  });
};

export const listMySchools = async () => {
  const session = await requireSession();
  return prisma.school.findMany({
    where: { users: { some: { userId: session.userId } } },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      country: true,
      status: true,
      _count: { select: { students: true, classes: true } },
    },
    orderBy: { name: "asc" },
  });
};

export const updateSchool = async (input: UpdateSchoolInput) => {
  const data = updateSchoolSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.ADMINS);

  const nextSlug = data.name ? generateSlug(data.name) : undefined;

  try {
    const updated = await prisma.school.update({
      where: { id: membership.schoolId },
      data: {
        name: data.name,
        slug: nextSlug,
        email: data.email !== undefined
          ? (data.email.trim() ? data.email.trim() : null)
          : undefined,
        city: data.city,
        country: data.country,
        type: data.type,
        onboardingCompleted: data.onboardingCompleted,
      },
      select: schoolDetailSelect,
    });
    revalidatePath(`/${data.schoolSlug}`);
    if (nextSlug && nextSlug !== data.schoolSlug) {
      revalidatePath(`/${nextSlug}`);
    }
    return updated;
  } catch (error) {
    throw handlePrismaError(error, {
      P2002: "Une école avec ce nom existe déjà.",
      P2025: "École introuvable.",
      default: "Erreur lors de la mise à jour de l'école.",
    });
  }
};

export const deleteSchool = async (input: DeleteSchoolInput) => {
  const data = deleteSchoolSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.DIRECTOR_ONLY);

  try {
    await prisma.school.delete({ where: { id: membership.schoolId } });
    revalidatePath("/");
    return { ok: true as const };
  } catch (error) {
    throw handlePrismaError(error, {
      P2025: "École introuvable.",
      default: "Erreur lors de la suppression de l'école.",
    });
  }
};
