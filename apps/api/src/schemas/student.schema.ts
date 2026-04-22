import { z } from "zod";

const baseStudent = {
  matricule: z.string().min(1).max(40),
  firstname: z.string().min(1).max(80),
  lastname: z.string().min(1).max(80),
  email: z.string().email().or(z.literal("")).optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s().-]{8,20}$/)
    .or(z.literal(""))
    .optional(),
  classId: z.string().uuid().nullable().optional(),
  average: z.number().min(0).max(20).nullable().optional(),
};

export const createStudentSchema = z.object(baseStudent);
export const updateStudentSchema = z.object(baseStudent);

export const listStudentsSchema = z.object({
  classId: z.string().uuid().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateStudentDto = z.infer<typeof createStudentSchema>;
export type UpdateStudentDto = z.infer<typeof updateStudentSchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsSchema>;
