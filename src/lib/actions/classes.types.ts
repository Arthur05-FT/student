import type {
  listClasses,
  getClassesById,
} from "./classes.action";

export type ClassesListItem = Awaited<ReturnType<typeof listClasses>>[number];
export type ClassesDetail = NonNullable<
  Awaited<ReturnType<typeof getClassesById>>
>;
