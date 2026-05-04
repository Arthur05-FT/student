import { z } from "zod";

export const RegisterSchema = z
  .object({
    firstName:       z.string().min(2, "Minimum 2 caractères"),
    lastName:        z.string().min(2, "Minimum 2 caractères"),
    phone:           z.string().min(8, "Numéro invalide").regex(/^[+\d\s()-]+$/, "Format invalide"),
    email:           z.email("Email invalide"),
    password:        z.string().min(8, "Minimum 8 caractères"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email:    z.email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const OtpSchema = z.object({
  email: z.email(),
  otp:   z.string().length(6, "Le code doit contenir 6 chiffres"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput    = z.infer<typeof LoginSchema>;
export type OtpInput      = z.infer<typeof OtpSchema>;
