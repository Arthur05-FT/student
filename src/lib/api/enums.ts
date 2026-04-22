// Énumérations dupliquées du modèle Prisma pour découpler le frontend
// du package @prisma/client (qui ne tourne plus côté Next.js).
// Garder en synchro avec prisma/schema.prisma.

export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  DIRECTOR: "DIRECTOR",
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const SchoolStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type SchoolStatus = (typeof SchoolStatus)[keyof typeof SchoolStatus];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
