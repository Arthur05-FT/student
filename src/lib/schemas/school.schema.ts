import z from "zod";

const optionalEmail = z
  .string()
  .email({ message: "Email invalide" })
  .or(z.literal(""))
  .optional();

export const createSchoolSchema = z.object({
  name: z.string().min(1, { message: "Nom de l'école requis" }),
  email: optionalEmail,
  city: z.string().min(1, { message: "Ville de l'école requise" }),
  country: z.string().min(1, { message: "Pays de l'école requis" }),
  type: z.string().min(1, { message: "Type d'école requis" }),
});

export const updateSchoolSchema = z.object({
  schoolSlug: z.string().min(1),
  name: z.string().min(1).optional(),
  email: optionalEmail,
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  onboardingCompleted: z.boolean().optional(),
});

export const deleteSchoolSchema = z.object({
  schoolSlug: z.string().min(1),
});

export type CreateSchoolForm = z.infer<typeof createSchoolSchema>;
export type UpdateSchoolInput = z.infer<typeof updateSchoolSchema>;
export type DeleteSchoolInput = z.infer<typeof deleteSchoolSchema>;
