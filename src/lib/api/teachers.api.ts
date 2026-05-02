import { apiFetch } from "./client";
import { serverApiFetch } from "./server";
import type { TeacherItem } from "./types";

export const teachersApi = {
  list: (slug: string) =>
    apiFetch<TeacherItem[]>(`/schools/${slug}/teachers`),

  listServer: (slug: string) =>
    serverApiFetch<TeacherItem[]>(`/schools/${slug}/teachers`),

  byId: (slug: string, id: string) =>
    apiFetch<TeacherItem>(`/schools/${slug}/teachers/${id}`),

  create: (
    slug: string,
    body: { firstname: string; lastname: string; email?: string; phone?: string },
  ) =>
    apiFetch<TeacherItem>(`/schools/${slug}/teachers`, {
      method: "POST",
      body,
    }),

  update: (
    slug: string,
    id: string,
    body: {
      firstname?: string;
      lastname?: string;
      email?: string;
      phone?: string;
    },
  ) =>
    apiFetch<TeacherItem>(`/schools/${slug}/teachers/${id}`, {
      method: "PATCH",
      body,
    }),

  remove: (slug: string, id: string) =>
    apiFetch<{ ok: true }>(`/schools/${slug}/teachers/${id}`, {
      method: "DELETE",
    }),
};
