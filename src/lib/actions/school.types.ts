import type {
  findSchoolBySlug,
  listMySchools,
  updateSchool,
} from "./school.action";

export type SchoolDetail = NonNullable<
  Awaited<ReturnType<typeof findSchoolBySlug>>
>;
export type SchoolListItem = Awaited<ReturnType<typeof listMySchools>>[number];
export type SchoolUpdated = Awaited<ReturnType<typeof updateSchool>>;
