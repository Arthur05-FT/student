import type { listStudents, getStudentById } from "./student.action";

export type StudentListResult = Awaited<ReturnType<typeof listStudents>>;
export type StudentListItem = StudentListResult["items"][number];
export type StudentDetail = NonNullable<
  Awaited<ReturnType<typeof getStudentById>>
>;
