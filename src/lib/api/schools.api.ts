import type { CreateSchoolForm } from "@/lib/schemas/school.schema";
import { apiFetch } from "./client";
import { serverApiFetch } from "./server";
import type {
  SchoolDetail,
  SchoolListItem,
} from "./types";

export const schoolsApi = {
  list: () => apiFetch<SchoolListItem[]>("/schools"),
  listServer: () => serverApiFetch<SchoolListItem[]>("/schools"),

  bySlug: (slug: string) => apiFetch<SchoolDetail>(`/schools/${slug}`),
  bySlugServer: (slug: string) =>
    serverApiFetch<SchoolDetail>(`/schools/${slug}`),

  create: (body: CreateSchoolForm) =>
    apiFetch<{ id: string; name: string; slug: string }>("/schools", {
      method: "POST",
      body,
    }),

  update: (
    slug: string,
    body: Partial<{
      name: string;
      email: string;
      city: string;
      country: string;
      type: string;
      onboardingCompleted: boolean;
    }>,
  ) =>
    apiFetch<SchoolDetail>(`/schools/${slug}`, {
      method: "PATCH",
      body,
    }),

  remove: (slug: string) =>
    apiFetch<{ ok: true }>(`/schools/${slug}`, { method: "DELETE" }),

  lookupByEmail: (email: string) =>
    serverApiFetch<{
      schoolName: string | null;
      schoolSlug: string | null;
      role: string | null;
    }>("/schools/lookup-by-email", { query: { email } }),
};
