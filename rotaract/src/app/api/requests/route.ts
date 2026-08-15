import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { canPostRequests, getSession } from "@/lib/auth/users";
import { rateLimit } from "@/lib/engagement/rate-limit";
import { visitorKey } from "@/lib/engagement/visitor";
import { createRequest, getRequests, validateRequest } from "@/lib/source/requests";

export const dynamic = "force-dynamic";

/** Reading the hub is deliberately public — no session required. */
export async function GET() {
  return NextResponse.json(
    { requests: await getRequests() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Creating a listing sits behind the verification wall:
 *   1. a valid session cookie, and
 *   2. `is_verified_rotaractor === true` on the profile.
 *
 * The check lives here rather than only in the UI — a hand-rolled POST from an
 * unverified account is rejected with 403.
 */
export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Sign in with your Rotaract account to post a request." },
      { status: 401 },
    );
  }

  if (!canPostRequests(session)) {
    return NextResponse.json(
      {
        error:
          "Your account is not a verified Rotaractor yet. Ask your club secretary to verify you before posting.",
        code: "NOT_VERIFIED",
      },
      { status: 403 },
    );
  }

  const limit = rateLimit(`post:${await visitorKey(request.headers)}`);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const validation = validateRequest(payload);
  if (!validation.ok || !validation.value) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", errors: validation.errors },
      { status: 422 },
    );
  }

  const created = await createRequest(validation.value, session);
  revalidatePath("/hub");

  return NextResponse.json({ request: created }, { status: 201 });
}
