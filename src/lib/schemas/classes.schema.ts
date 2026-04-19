import { z } from "zod";

export const createClassesSchema = z.object({
  schoolSlug: z.string().min(1),
  name: z
    .string()
    .min(1, { message: "Nom de la classe requis" })
    .max(80, { message: "Nom trop long (80 max)" }),
});

export const updateClassesSchema = z.object({
  schoolSlug: z.string().min(1),
  id: z.string().uuid({ message: "Identifiant de classe invalide" }),
  name: z.string().min(1).max(80),
});

export const deleteClassesSchema = z.object({
  schoolSlug: z.string().min(1),
  id: z.string().uuid(),
});

export type CreateClassesInput = z.infer<typeof createClassesSchema>;
export type UpdateClassesInput = z.infer<typeof updateClassesSchema>;
export type DeleteClassesInput = z.infer<typeof deleteClassesSchema>;
