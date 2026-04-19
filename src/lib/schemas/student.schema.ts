import { z } from "zod";

const baseStudent = {
  matricule: z
    .string()
    .min(1, { message: "Matricule requis" })
    .max(40, { message: "Matricule trop long" }),
  firstname: z.string().min(1, { message: "Prénom requis" }).max(80),
  lastname: z.string().min(1, { message: "Nom requis" }).max(80),
  email: z
    .string()
    .email({ message: "Email invalide" })
    .or(z.literal(""))
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s().-]{8,20}$/, { message: "Téléphone invalide" })
    .or(z.literal(""))
    .optional(),
  classId: z.string().uuid().nullable().optional(),
  average: z
    .number()
    .min(0, { message: "Moyenne entre 0 et 20" })
    .max(20, { message: "Moyenne entre 0 et 20" })
    .nullable()
    .optional(),
};

export const createStudentSchema = z.object({
  schoolSlug: z.string().min(1),
  ...baseStudent,
});

export const updateStudentSchema = z.object({
  schoolSlug: z.string().min(1),
  id: z.string().uuid(),
  ...baseStudent,
});

export const deleteStudentSchema = z.object({
  schoolSlug: z.string().min(1),
  id: z.string().uuid(),
});

export const listStudentsSchema = z.object({
  schoolSlug: z.string().min(1),
  classId: z.string().uuid().optional(),
  search: z.string().trim().optional(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type DeleteStudentInput = z.infer<typeof deleteStudentSchema>;
export type ListStudentsInput = z.infer<typeof listStudentsSchema>;
