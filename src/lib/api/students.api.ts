import { apiFetch } from "./client";
import type { StudentItem, StudentListResult } from "./types";

export type StudentInput = {
  matricule: string;
  firstname: string;
  lastname: string;
  email?: string;
  phone?: string;
  classId?: string | null;
  average?: number | null;
};

export const studentsApi = {
  list: (
    slug: string,
    query: { classId?: string; search?: string; page?: number; pageSize?: number } = {},
  ) => apiFetch<StudentListResult>(`/schools/${slug}/students`, { query }),

  byId: (slug: string, id: string) =>
    apiFetch<StudentItem>(`/schools/${slug}/students/${id}`),

  create: (slug: string, body: StudentInput) =>
    apiFetch<StudentItem>(`/schools/${slug}/students`, {
      method: "POST",
      body,
    }),

  update: (slug: string, id: string, body: StudentInput) =>
    apiFetch<StudentItem>(`/schools/${slug}/students/${id}`, {
      method: "PATCH",
      body,
    }),

  remove: (slug: string, id: string) =>
    apiFetch<{ ok: true }>(`/schools/${slug}/students/${id}`, {
      method: "DELETE",
    }),
};
