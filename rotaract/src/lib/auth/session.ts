import type { SessionUser } from "@/types";

/**
 * Mock session layer.
 *
 * Sessions are HMAC-signed cookies built entirely on Web Crypto, so the exact
 * same verification runs in Middleware (Edge), Route Handlers and Server
 * Components. Swap `verifyCredentials` for Supabase Auth and nothing else here
 * needs to change.
 */

export const SESSION_COOKIE = "racpm_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const SECRET =
  process.env.SESSION_SECRET ??
  // Development-only fallback so the demo runs with zero configuration.
  "rotaract-demo-secret-change-me";

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(user: SessionUser): Promise<string> {
  const payload = toBase64Url(encoder.encode(JSON.stringify(user)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySession(token: string | undefined): Promise<SessionUser | null> {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(),
      fromBase64Url(signature),
      encoder.encode(payload),
    );
    if (!valid) return null;

    const user = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as SessionUser;
    const ageSeconds = (Date.now() - user.issuedAt) / 1000;
    if (!Number.isFinite(ageSeconds) || ageSeconds > SESSION_TTL_SECONDS) return null;
    return user;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
