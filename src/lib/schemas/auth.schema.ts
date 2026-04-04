import { z } from "zod";

const emailSchema = z.string();
const phoneSchema = z
  .string()
  .min(1, { message: "Numéro de téléphone invalide" })
  .max(9, { message: "Numéro de téléphone invalide" });
const passwordSchema = z
  .string()
  .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
  .regex(/[0-9]/, { message: "Doit contenir au moins un chiffre" })
  .regex(/[A-Z]/, { message: "Doit contenir au moins une majuscule" });
const identifierSchema = z
  .string()
  .min(1, { message: "Email ou numéro de téléphone requis" })
  .pipe(
    z.union([emailSchema.email({ message: "Email invalide" }), phoneSchema]),
  );

export const signUpSchema = z.object({
  firstname: z.string().min(1, { message: "Nom requis" }),
  lastname: z.string().min(1, { message: "Prénom requis" }),
  identifier: identifierSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

export type SignUpForm = z.infer<typeof signUpSchema>;
export type SignInForm = z.infer<typeof signInSchema>;
