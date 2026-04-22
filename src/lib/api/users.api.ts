import type { UserRole } from "./enums";
import { apiFetch } from "./client";
import { serverApiFetch } from "./server";
import type { SafeUser, SchoolMember } from "./types";

export const usersApi = {
  me: () => apiFetch<SafeUser>("/me"),
  meServer: () => serverApiFetch<SafeUser>("/me"),

  updateMe: (body: Partial<{
    name: string;
    image: string;
    birthdate: string | Date;
    phone: string;
  }>) => apiFetch<SafeUser>("/me", { method: "PATCH", body }),

  listMembers: (slug: string, query: { search?: string } = {}) =>
    apiFetch<SchoolMember[]>(`/schools/${slug}/members`, { query }),

  updateMemberRole: (slug: string, targetUserId: string, role: UserRole) =>
    apiFetch<{ id: string; role: UserRole }>(
      `/schools/${slug}/members/${targetUserId}`,
      { method: "PATCH", body: { role } },
    ),

  removeMember: (slug: string, targetUserId: string) =>
    apiFetch<{ ok: true }>(`/schools/${slug}/members/${targetUserId}`, {
      method: "DELETE",
    }),
};
