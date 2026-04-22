import { z } from "zod";
import { UserRole } from "../../../../generated/prisma/enums";

export const updateUserProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  image: z.string().url().or(z.literal("")).optional(),
  birthdate: z.coerce.date().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s().-]{8,20}$/)
    .or(z.literal(""))
    .optional(),
});

export const updateMembershipRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const listSchoolMembersSchema = z.object({
  search: z.string().trim().optional(),
});

export type UpdateUserProfileDto = z.infer<typeof updateUserProfileSchema>;
export type UpdateMembershipRoleDto = z.infer<typeof updateMembershipRoleSchema>;
export type ListSchoolMembersQuery = z.infer<typeof listSchoolMembersSchema>;
