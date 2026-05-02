import { z } from "zod";

export const createClassesSchema = z.object({
  name: z.string().min(1, { message: "Nom de la classe requis" }).max(80),
  level: z.string().min(1, { message: "Niveau requis" }).max(50),
  headTeacherId: z.string().min(1).optional(),
  capacity: z.string().max(10).optional(),
  room: z.string().max(50).optional(),
  building: z.string().max(50).optional(),
});

export const updateClassesSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  level: z.string().min(1).max(50).optional(),
  headTeacherId: z.string().uuid().nullable().optional(),
  capacity: z.string().max(10).optional(),
  room: z.string().max(50).optional(),
  building: z.string().max(50).optional(),
});

export type CreateClassesDto = z.infer<typeof createClassesSchema>;
export type UpdateClassesDto = z.infer<typeof updateClassesSchema>;
