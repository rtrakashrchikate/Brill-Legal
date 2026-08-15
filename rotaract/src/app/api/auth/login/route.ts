import { NextResponse } from "next/server";

import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/auth/session";
import { verifyCredentials } from "@/lib/auth/users";
import { rateLimit } from "@/lib/engagement/rate-limit";
import { visitorKey } from "@/lib/engagement/visitor";
import { clampText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = rateLimit(`login:${await visitorKey(request.headers)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const email = clampText(body.email, 160);
  const password = clampText(body.password, 200);

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const user = await verifyCredentials(email, password);
  if (!user) {
    // Deliberately identical message for unknown email and wrong password.
    return NextResponse.json({ error: "Those credentials don't match." }, { status: 401 });
  }

  const response = NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      club: user.club,
      role: user.role,
      is_verified_rotaractor: user.is_verified_rotaractor,
    },
  });
  response.cookies.set(SESSION_COOKIE, await signSession(user), sessionCookieOptions);
  return response;
}
