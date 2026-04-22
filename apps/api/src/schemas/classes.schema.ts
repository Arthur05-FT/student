import { z } from "zod";

export const createClassesSchema = z.object({
  name: z.string().min(1, { message: "Nom de la classe requis" }).max(80),
});

export const updateClassesSchema = z.object({
  name: z.string().min(1).max(80),
});

export type CreateClassesDto = z.infer<typeof createClassesSchema>;
export type UpdateClassesDto = z.infer<typeof updateClassesSchema>;
