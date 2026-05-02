import { z } from "zod";

export const createTeacherSchema = z.object({
  firstname: z.string().min(1, { message: "Prénom requis" }).max(80),
  lastname: z.string().min(1, { message: "Nom requis" }).max(80),
  email: z.string().email({ message: "Email invalide" }).optional(),
  phone: z.string().max(20).optional(),
});

export const updateTeacherSchema = z.object({
  firstname: z.string().min(1).max(80).optional(),
  lastname: z.string().min(1).max(80).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
});

export type CreateTeacherDto = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherDto = z.infer<typeof updateTeacherSchema>;
