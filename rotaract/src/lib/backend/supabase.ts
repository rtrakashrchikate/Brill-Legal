/**
 * Dependency-free Supabase PostgREST client.
 *
 * The whole platform is designed to run with **no backend at all** — when the
 * Supabase environment variables are absent every read falls back to the seed
 * JSON in `src/data` and every write goes to the local file store. Setting the
 * variables flips the same call sites over to Supabase without touching a
 * component.
 */

const URL_ENV = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY_ENV =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function supabaseEnabled(): boolean {
  return Boolean(URL_ENV && KEY_ENV);
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: KEY_ENV as string,
    Authorization: `Bearer ${KEY_ENV}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function endpoint(table: string, query = ""): string {
  const base = `${URL_ENV}/rest/v1/${table}`;
  return query ? `${base}?${query}` : base;
}

/**
 * Reads rows from a table. Returns `null` — never throws — so callers can fall
 * back to local seed data if the backend is misconfigured or unreachable.
 */
export async function sbSelect<T>(
  table: string,
  query = "select=*",
  init: RequestInit = {},
): Promise<T[] | null> {
  if (!supabaseEnabled()) return null;
  try {
    const res = await fetch(endpoint(table, query), {
      ...init,
      headers: headers(),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export async function sbInsert<T>(table: string, row: unknown): Promise<T | null> {
  if (!supabaseEnabled()) return null;
  try {
    const res = await fetch(endpoint(table), {
      method: "POST",
      headers: headers({ Prefer: "return=representation" }),
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as T[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function sbUpsert<T>(
  table: string,
  row: unknown,
  onConflict: string,
): Promise<T | null> {
  if (!supabaseEnabled()) return null;
  try {
    const res = await fetch(endpoint(table, `on_conflict=${onConflict}`), {
      method: "POST",
      headers: headers({ Prefer: "return=representation,resolution=merge-duplicates" }),
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as T[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
