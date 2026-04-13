// lib/store/selectors/school.selectors.ts
import { useSchoolStore } from "../school.store";

export const useSchoolName = () =>
  useSchoolStore((state) => state.schoolData?.name);

export const useSchoolStudents = () =>
  useSchoolStore((state) => state.schoolData?.students);

export const useSchoolUsers = () =>
  useSchoolStore((state) => state.schoolData?.users);
