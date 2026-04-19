"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { handlePrismaError } from "@/lib/errors";
import {
  assertRole,
  ROLES,
  requireSchoolMembershipBySlug,
} from "@/lib/auth-guards";
import {
  createClassesSchema,
  CreateClassesInput,
  deleteClassesSchema,
  DeleteClassesInput,
  updateClassesSchema,
  UpdateClassesInput,
} from "@/lib/schemas/classes.schema";

const classesSelect = {
  id: true,
  name: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { students: true } },
} as const;

export const listClasses = async (schoolSlug: string) => {
  const membership = await requireSchoolMembershipBySlug(schoolSlug);
  return prisma.classes.findMany({
    where: { schoolId: membership.schoolId },
    select: classesSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getClassesById = async (schoolSlug: string, id: string) => {
  const membership = await requireSchoolMembershipBySlug(schoolSlug);
  const cls = await prisma.classes.findFirst({
    where: { id, schoolId: membership.schoolId },
    select: {
      ...classesSelect,
      students: {
        select: {
          id: true,
          matricule: true,
          firstname: true,
          lastname: true,
          average: true,
        },
        orderBy: { lastname: "asc" },
      },
    },
  });
  return cls;
};

export const createClasses = async (input: CreateClassesInput) => {
  const data = createClassesSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.STAFF);

  try {
    const created = await prisma.classes.create({
      data: { name: data.name, schoolId: membership.schoolId },
      select: classesSelect,
    });
    revalidatePath(`/${data.schoolSlug}/classes`);
    return created;
  } catch (error) {
    throw handlePrismaError(error, {
      P2002: "Une classe avec ce nom existe déjà dans cette école.",
      default: "Erreur lors de la création de la classe.",
    });
  }
};

export const updateClasses = async (input: UpdateClassesInput) => {
  const data = updateClassesSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.STAFF);

  try {
    const updated = await prisma.classes.update({
      where: { id: data.id, schoolId: membership.schoolId },
      data: { name: data.name },
      select: classesSelect,
    });
    revalidatePath(`/${data.schoolSlug}/classes`);
    return updated;
  } catch (error) {
    throw handlePrismaError(error, {
      P2002: "Une classe avec ce nom existe déjà dans cette école.",
      P2025: "Classe introuvable.",
      default: "Erreur lors de la mise à jour de la classe.",
    });
  }
};

export const deleteClasses = async (input: DeleteClassesInput) => {
  const data = deleteClassesSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.ADMINS);

  try {
    await prisma.classes.delete({
      where: { id: data.id, schoolId: membership.schoolId },
    });
    revalidatePath(`/${data.schoolSlug}/classes`);
    return { ok: true as const };
  } catch (error) {
    throw handlePrismaError(error, {
      P2025: "Classe introuvable.",
      default: "Erreur lors de la suppression de la classe.",
    });
  }
};

