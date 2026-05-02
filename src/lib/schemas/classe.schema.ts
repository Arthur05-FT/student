import { z } from "zod";

export const classeSchema = z.object({
  name: z.string().min(1, { message: "Nom requis" }).max(80),
  level: z.string().min(1, { message: "Niveau requis" }).max(50),
  headTeacherLabel: z.string().optional(),
  capacity: z.string().max(10).optional(),
  room: z.string().max(50).optional(),
  building: z.string().max(50).optional(),
});

export type ClasseForm = z.infer<typeof classeSchema>;
