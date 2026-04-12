import z from "zod";

const nameSchema = z.string().min(1, { message: "Nom de l'école requis" });
const emailSchema = z.string().email({ message: "Email de l'école requis" });
const citySchema = z.string().min(1, { message: "Ville de l'école requis" });
const countrySchema = z.string().min(1, { message: "Pays de l'école requis" });
const schoolTypeSchema = z
  .string()
  .min(1, { message: "Pays de l'école requis" });

export const createSchoolSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  city: citySchema,
  country: countrySchema,
  type: schoolTypeSchema,
});

export type CreateSchoolForm = z.infer<typeof createSchoolSchema>;
