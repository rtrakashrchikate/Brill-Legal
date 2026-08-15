import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/**
 * Edge-side half of the verification wall.
 *
 * The session signature is verified here with Web Crypto, so an unsigned or
 * tampered cookie never reaches the dashboard. The `is_verified_rotaractor`
 * check is *also* enforced in the route handler — middleware is a fast path,
 * never the only gate.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    const response = NextResponse.redirect(url);
    if (token) response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
