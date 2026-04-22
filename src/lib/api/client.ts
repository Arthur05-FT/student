// Client API typé vers le backend NestJS.
// Toutes les requêtes incluent les cookies (Better Auth).
// À utiliser depuis le navigateur (pages "use client") ou depuis les Server Components
// — dans ce dernier cas, il faut transmettre les cookies via headers.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly issues?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiFetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  // Pour les Server Components : passer les cookies de la requête entrante.
  cookieHeader?: string;
  signal?: AbortSignal;
};

const buildUrl = (
  path: string,
  query?: ApiFetchOptions["query"],
): string => {
  const url = new URL(path.startsWith("/") ? path.slice(1) : path, `${API_URL}/`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
};

export async function apiFetch<T>(
  path: string,
  opts: ApiFetchOptions = {},
): Promise<T> {
  const headers = new Headers(opts.headers);
  if (opts.body !== undefined) headers.set("Content-Type", "application/json");
  if (opts.cookieHeader) headers.set("cookie", opts.cookieHeader);

  const res = await fetch(buildUrl(path, opts.query), {
    method: opts.method ?? "GET",
    credentials: "include",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    if (typeof payload === "object" && payload !== null) {
      const p = payload as {
        message?: string;
        code?: string;
        issues?: unknown;
      };
      throw new ApiError(
        res.status,
        p.code ?? "INTERNAL",
        p.message ?? "Erreur API",
        p.issues,
      );
    }
    throw new ApiError(res.status, "INTERNAL", String(payload));
  }

  return payload as T;
}
