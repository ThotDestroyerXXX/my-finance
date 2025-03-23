import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  if (request.nextUrl.pathname.startsWith("/user/") && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  } else if (request.nextUrl.pathname.startsWith("/auth/") && session) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
