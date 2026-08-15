import { NextResponse } from "next/server";

import { parseTargetKey, targetKey } from "@/lib/engagement/keys";
import { rateLimit } from "@/lib/engagement/rate-limit";
import {
  registerView,
  snapshot,
  toggleLike,
  toggleReaction,
  type MutationResult,
} from "@/lib/engagement/store";
import { visitorKey } from "@/lib/engagement/visitor";
import { REACTION_KINDS, type ReactionKind } from "@/types";

export const dynamic = "force-dynamic";

/** Cap on how many targets one snapshot request may ask about. */
const MAX_TARGETS = 60;

/**
 * Anonymous engagement endpoint — no session required by design.
 *
 * Spam prevention is layered: a per-visitor sliding-window rate limit, a
 * six-hour view cooldown per target, and one like / one reaction-of-each-kind
 * per visitor per target in the server-side ledger.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("targets") ?? "";
  const keys = raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => parseTargetKey(value) !== null)
    .slice(0, MAX_TARGETS);

  if (keys.length === 0) {
    return NextResponse.json({ targets: {} });
  }

  const visitor = await visitorKey(request.headers);
  return NextResponse.json(
    { targets: snapshot(visitor, keys) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

interface EngagementBody {
  targetType?: string;
  targetId?: string;
  action?: string;
  reaction?: string;
}

export async function POST(request: Request) {
  let body: EngagementBody;
  try {
    body = (await request.json()) as EngagementBody;
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const parsed = parseTargetKey(`${body.targetType}:${body.targetId}`);
  if (!parsed) {
    return NextResponse.json({ error: "Unknown engagement target." }, { status: 400 });
  }

  const visitor = await visitorKey(request.headers);
  const limit = rateLimit(visitor);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Slow down a moment.", retryAfter: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const key = targetKey(parsed.type, parsed.id);
  let result: MutationResult;

  switch (body.action) {
    case "view":
      result = registerView(visitor, key);
      break;
    case "like":
      result = toggleLike(visitor, key);
      break;
    case "react": {
      const reaction = body.reaction as ReactionKind;
      if (!REACTION_KINDS.includes(reaction)) {
        return NextResponse.json({ error: "Unknown reaction." }, { status: 400 });
      }
      result = toggleReaction(visitor, key, reaction);
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  return NextResponse.json(
    { key, ...result, remaining: limit.remaining },
    { headers: { "Cache-Control": "no-store" } },
  );
}
