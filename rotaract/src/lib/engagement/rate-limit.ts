/**
 * Sliding-window rate limiter for the anonymous engagement endpoint.
 *
 * In-memory by design: it protects a single server instance from a visitor
 * hammering the like button. Behind multiple instances, back it with Supabase
 * or Redis — the call signature stays the same.
 */

interface Window {
  hits: number[];
}

const WINDOW_MS = 60_000;
const MAX_HITS = 40;
const MAX_KEYS = 5_000;

const windows = new Map<string, Window>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();

  // Cheap eviction so a long-running process cannot grow without bound.
  if (windows.size > MAX_KEYS) windows.clear();

  const window = windows.get(key) ?? { hits: [] };
  window.hits = window.hits.filter((stamp) => now - stamp < WINDOW_MS);

  if (window.hits.length >= MAX_HITS) {
    windows.set(key, window);
    const oldest = window.hits[0];
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)),
    };
  }

  window.hits.push(now);
  windows.set(key, window);
  return { ok: true, remaining: MAX_HITS - window.hits.length, retryAfterSeconds: 0 };
}
