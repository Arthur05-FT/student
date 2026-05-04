import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

const ROLE_PREFIXES: Record<string, string[]> = {
  "/owner":    ["OWNER", "SUPER_ADMIN"],
  "/director": ["DIRECTOR", "SUPER_ADMIN"],
  "/teacher":  ["TEACHER", "DIRECTOR", "SUPER_ADMIN"],
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // La vérification fine des rôles se fait dans les Server Actions.
  // Le middleware garantit uniquement qu'une session existe.
  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((p) =>
    pathname.startsWith(p),
  );

  if (!matchedPrefix) return NextResponse.next();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
