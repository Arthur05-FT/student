import { apiFetch } from "./client";
import { serverApiFetch } from "./server";
import type { ClassesDetail, ClassesListItem } from "./types";

export const classesApi = {
  list: (slug: string) =>
    apiFetch<ClassesListItem[]>(`/schools/${slug}/classes`),
  listServer: (slug: string) =>
    serverApiFetch<ClassesListItem[]>(`/schools/${slug}/classes`),

  byId: (slug: string, id: string) =>
    apiFetch<ClassesDetail>(`/schools/${slug}/classes/${id}`),

  create: (
    slug: string,
    body: {
      name: string;
      level: string;
      headTeacherId?: string;
      capacity?: string;
      room?: string;
      building?: string;
    },
  ) =>
    apiFetch<ClassesListItem>(`/schools/${slug}/classes`, {
      method: "POST",
      body,
    }),

  update: (
    slug: string,
    id: string,
    body: {
      name?: string;
      level?: string;
      headTeacherId?: string | null;
      capacity?: string;
      room?: string;
      building?: string;
    },
  ) =>
    apiFetch<ClassesListItem>(`/schools/${slug}/classes/${id}`, {
      method: "PATCH",
      body,
    }),

  remove: (slug: string, id: string) =>
    apiFetch<{ ok: true }>(`/schools/${slug}/classes/${id}`, {
      method: "DELETE",
    }),
};
