import { sha256Hex } from "@/lib/auth/session";

/**
 * Anonymous visitor identity.
 *
 * No cookie, no account, no stored IP. We hash `ip + user-agent + a daily
 * rotating salt`, keep only the first 16 hex characters, and use that as the
 * engagement ledger key. The hash cannot be reversed to an address, and it
 * rotates every day so the identifier is not a durable tracker — it exists only
 * to stop one visitor inflating a counter.
 */

const DAY_MS = 86_400_000;

const SALT = process.env.ENGAGEMENT_SALT ?? "rotaract-engagement-salt";

function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    // Local dev and any proxy that strips the headers land here; the
    // user-agent component still separates most visitors.
    "0.0.0.0"
  );
}

export async function visitorKey(headers: Headers): Promise<string> {
  const day = Math.floor(Date.now() / DAY_MS);
  const agent = headers.get("user-agent") ?? "unknown";
  const language = headers.get("accept-language") ?? "";
  const digest = await sha256Hex(`${SALT}|${day}|${clientIp(headers)}|${agent}|${language}`);
  return digest.slice(0, 16);
}
