"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { handlePrismaError, AppError } from "@/lib/errors";
import {
  assertRole,
  ROLES,
  requireSchoolMembershipBySlug,
} from "@/lib/auth-guards";
import {
  createStudentSchema,
  CreateStudentInput,
  deleteStudentSchema,
  DeleteStudentInput,
  listStudentsSchema,
  ListStudentsInput,
  updateStudentSchema,
  UpdateStudentInput,
} from "@/lib/schemas/student.schema";

const studentSelect = {
  id: true,
  matricule: true,
  firstname: true,
  lastname: true,
  email: true,
  phone: true,
  average: true,
  classId: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
  class: { select: { id: true, name: true } },
} as const;

const assertClassBelongsToSchool = async (
  classId: string | null | undefined,
  schoolId: string,
) => {
  if (!classId) return;
  const cls = await prisma.classes.findFirst({
    where: { id: classId, schoolId },
    select: { id: true },
  });
  if (!cls) {
    throw new AppError(
      "La classe sélectionnée n'appartient pas à cette école.",
      "VALIDATION",
    );
  }
};

const normalizeOptional = (v?: string | null): string | null =>
  v && v.trim() ? v.trim() : null;

export const listStudents = async (input: ListStudentsInput) => {
  const data = listStudentsSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);

  const where = {
    schoolId: membership.schoolId,
    ...(data.classId ? { classId: data.classId } : {}),
    ...(data.search
      ? {
          OR: [
            { firstname: { contains: data.search, mode: "insensitive" as const } },
            { lastname: { contains: data.search, mode: "insensitive" as const } },
            { matricule: { contains: data.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where,
      select: studentSelect,
      orderBy: [{ lastname: "asc" }, { firstname: "asc" }],
      skip: (data.page - 1) * data.pageSize,
      take: data.pageSize,
    }),
    prisma.student.count({ where }),
  ]);

  return { items, total, page: data.page, pageSize: data.pageSize };
};

export const getStudentById = async (schoolSlug: string, id: string) => {
  const membership = await requireSchoolMembershipBySlug(schoolSlug);
  return prisma.student.findFirst({
    where: { id, schoolId: membership.schoolId },
    select: studentSelect,
  });
};

export const createStudent = async (input: CreateStudentInput) => {
  const data = createStudentSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.STAFF);
  await assertClassBelongsToSchool(data.classId ?? null, membership.schoolId);

  try {
    const created = await prisma.student.create({
      data: {
        schoolId: membership.schoolId,
        matricule: data.matricule,
        firstname: data.firstname,
        lastname: data.lastname,
        email: normalizeOptional(data.email),
        phone: normalizeOptional(data.phone),
        average: data.average ?? null,
        classId: data.classId ?? null,
      },
      select: studentSelect,
    });
    revalidatePath(`/${data.schoolSlug}/classes`);
    if (created.classId) {
      revalidatePath(`/${data.schoolSlug}/classes/${created.classId}`);
    }
    return created;
  } catch (error) {
    throw handlePrismaError(error, {
      P2002: "Un étudiant avec ce matricule existe déjà.",
      default: "Erreur lors de la création de l'étudiant.",
    });
  }
};

export const updateStudent = async (input: UpdateStudentInput) => {
  const data = updateStudentSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.STAFF);
  await assertClassBelongsToSchool(data.classId ?? null, membership.schoolId);

  try {
    const updated = await prisma.student.update({
      where: { id: data.id, schoolId: membership.schoolId },
      data: {
        matricule: data.matricule,
        firstname: data.firstname,
        lastname: data.lastname,
        email: normalizeOptional(data.email),
        phone: normalizeOptional(data.phone),
        average: data.average ?? null,
        classId: data.classId ?? null,
      },
      select: studentSelect,
    });
    revalidatePath(`/${data.schoolSlug}/classes`);
    if (updated.classId) {
      revalidatePath(`/${data.schoolSlug}/classes/${updated.classId}`);
    }
    return updated;
  } catch (error) {
    throw handlePrismaError(error, {
      P2002: "Un étudiant avec ce matricule existe déjà.",
      P2025: "Étudiant introuvable.",
      default: "Erreur lors de la mise à jour de l'étudiant.",
    });
  }
};

export const deleteStudent = async (input: DeleteStudentInput) => {
  const data = deleteStudentSchema.parse(input);
  const membership = await requireSchoolMembershipBySlug(data.schoolSlug);
  assertRole(membership, ROLES.STAFF);

  try {
    await prisma.student.delete({
      where: { id: data.id, schoolId: membership.schoolId },
    });
    revalidatePath(`/${data.schoolSlug}/classes`);
    return { ok: true as const };
  } catch (error) {
    throw handlePrismaError(error, {
      P2025: "Étudiant introuvable.",
      default: "Erreur lors de la suppression de l'étudiant.",
    });
  }
};
