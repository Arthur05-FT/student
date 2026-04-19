import type {
  findUserById,
  listSchoolMembers,
} from "./user.action";

export type SafeUser = NonNullable<Awaited<ReturnType<typeof findUserById>>>;
export type SchoolMember = Awaited<ReturnType<typeof listSchoolMembers>>[number];
