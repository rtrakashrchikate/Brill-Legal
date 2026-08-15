"use client";

import { useEffect, useState } from "react";

export interface ClientSession {
  name: string;
  email: string;
  club: string;
  role: string;
  is_verified_rotaractor: boolean;
}

let cached: ClientSession | null | undefined;
let inFlight: Promise<ClientSession | null> | null = null;

async function load(): Promise<ClientSession | null> {
  if (cached !== undefined) return cached;
  if (!inFlight) {
    inFlight = fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data: { user: ClientSession | null }) => {
        cached = data.user;
        return cached;
      })
      .catch(() => {
        cached = null;
        return null;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}

export function clearSessionCache(): void {
  cached = undefined;
}

/** Read-only view of the session for navigation and CTA copy. */
export function useSession(): { user: ClientSession | null; loading: boolean } {
  const [user, setUser] = useState<ClientSession | null>(cached ?? null);
  const [loading, setLoading] = useState(cached === undefined);

  useEffect(() => {
    let active = true;
    void load().then((next) => {
      if (!active) return;
      setUser(next);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { user, loading };
}
