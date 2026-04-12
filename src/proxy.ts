import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default function proxy(request: NextRequest) {
  const session = getSessionCookie(request);

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/:schoolSlug*", "/sign-in", "/sign-up"],
};
