import { SetMetadata } from "@nestjs/common";
import type { UserRole } from "../../../../../generated/prisma/enums";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const ROLES = {
  ALL: ["SUPER_ADMIN", "DIRECTOR", "ADMIN", "TEACHER"] as UserRole[],
  STAFF: ["SUPER_ADMIN", "DIRECTOR", "ADMIN"] as UserRole[],
  ADMINS: ["SUPER_ADMIN", "DIRECTOR"] as UserRole[],
  DIRECTOR_ONLY: ["SUPER_ADMIN", "DIRECTOR"] as UserRole[],
} as const;
