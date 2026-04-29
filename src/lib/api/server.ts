"use server";

// Helper pour appeler l'API depuis les Server Components / Server Actions.
// Forward le cookie Better Auth de la requête entrante au backend NestJS.
import { headers } from "next/headers";
import { apiFetch, type ApiFetchOptions } from "./client";

export async function serverApiFetch<T>(
  path: string,
  opts: Omit<ApiFetchOptions, "cookieHeader"> = {},
): Promise<T> {
  const h = await headers();
  const cookieHeader = h.get("cookie") ?? undefined;
  return apiFetch<T>(path, { ...opts, cookieHeader });
}
