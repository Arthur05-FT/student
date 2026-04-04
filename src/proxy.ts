import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default function proxy(request: NextRequest) {
  console.log("proxy exécuté sur :", request.nextUrl.pathname);
  const session = getSessionCookie(request);

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/schools", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/schools/:path*", "/sign-in", "/sign-up"],
};
