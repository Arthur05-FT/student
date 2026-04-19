import { z } from "zod";
import { UserRole } from "../../../generated/prisma/enums";

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  image: z.string().url().or(z.literal("")).optional(),
  birthdate: z.coerce.date().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s().-]{8,20}$/, { message: "Téléphone invalide" })
    .or(z.literal(""))
    .optional(),
});

export const updateMembershipRoleSchema = z.object({
  schoolSlug: z.string().min(1),
  targetUserId: z.string().min(1),
  role: z.nativeEnum(UserRole),
});

export const removeMembershipSchema = z.object({
  schoolSlug: z.string().min(1),
  targetUserId: z.string().min(1),
});

export const listSchoolMembersSchema = z.object({
  schoolSlug: z.string().min(1),
  search: z.string().trim().optional(),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UpdateMembershipRoleInput = z.infer<typeof updateMembershipRoleSchema>;
export type RemoveMembershipInput = z.infer<typeof removeMembershipSchema>;
export type ListSchoolMembersInput = z.infer<typeof listSchoolMembersSchema>;
