import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth/users";

export const dynamic = "force-dynamic";

/**
 * Lets client components learn who is signed in without forcing every page into
 * dynamic rendering — the pages themselves stay statically generated.
 */
export async function GET() {
  const session = await getSession();
  return NextResponse.json(
    {
      user: session
        ? {
            name: session.name,
            email: session.email,
            club: session.club,
            role: session.role,
            is_verified_rotaractor: session.is_verified_rotaractor,
          }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
