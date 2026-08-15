import "server-only";

import { cookies } from "next/headers";

import usersSeed from "@/data/users.json";
import { sbSelect } from "@/lib/backend/supabase";
import { SESSION_COOKIE, sha256Hex, verifySession } from "@/lib/auth/session";
import type { RotaractorProfile, SessionUser } from "@/types";

interface StoredUser extends RotaractorProfile {
  passwordHash: string;
}

const users = usersSeed as StoredUser[];

/** Demo password hashing. Replace with Supabase Auth for anything real. */
async function hashPassword(password: string): Promise<string> {
  return sha256Hex(`racpm::${password}`);
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const normalised = email.trim().toLowerCase();

  const remote = await sbSelect<StoredUser>(
    "profiles",
    `select=*&email=eq.${encodeURIComponent(normalised)}`,
  );
  const pool = remote?.length ? remote : users;

  const found = pool.find((user) => user.email.toLowerCase() === normalised);
  if (!found) return null;

  const attempt = await hashPassword(password);
  if (attempt !== found.passwordHash) return null;

  return {
    id: found.id,
    email: found.email,
    name: found.name,
    club: found.club,
    district: found.district,
    role: found.role,
    is_verified_rotaractor: found.is_verified_rotaractor,
    issuedAt: Date.now(),
  };
}

/** Current session, or `null` for anonymous visitors. Never throws. */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * The verification wall. A session alone is not enough — the profile must carry
 * `is_verified_rotaractor: true` before any write is allowed.
 */
export function canPostRequests(user: SessionUser | null): user is SessionUser {
  return Boolean(user?.is_verified_rotaractor);
}
