"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { targetKey } from "@/lib/engagement/keys";
import type {
  EngageableType,
  EngagementCounts,
  ReactionKind,
  VisitorState,
} from "@/types";

/**
 * Client half of the anonymous engagement system.
 *
 * Three jobs:
 *  1. Batch every visible target into a single snapshot request per tick.
 *  2. Mirror the visitor's own actions in LocalStorage so the UI is correct
 *     immediately on repeat visits, before the server responds.
 *  3. Throttle locally so a rapid tapper never reaches the server rate limit.
 */

const LOCAL_KEY = "racpm:engagement:v1";
const BATCH_MS = 40;
const MIN_ACTION_GAP_MS = 350;

export interface Entry {
  counts: EngagementCounts;
  visitor: VisitorState;
}

type LocalMirror = Record<string, VisitorState>;

const cache = new Map<string, Entry>();
const listeners = new Map<string, Set<() => void>>();
const pending = new Set<string>();
const lastAction = new Map<string, number>();
const inFlight = new Set<string>();

let flushHandle: ReturnType<typeof setTimeout> | null = null;

/* -------------------------------------------------------------------------- */
/* LocalStorage mirror                                                        */
/* -------------------------------------------------------------------------- */

function readMirror(): LocalMirror {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) ?? "{}") as LocalMirror;
  } catch {
    return {};
  }
}

function writeMirror(key: string, visitor: VisitorState): void {
  if (typeof window === "undefined") return;
  try {
    const mirror = readMirror();
    mirror[key] = visitor;
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(mirror));
  } catch {
    /* private mode / quota — the server ledger still holds the truth */
  }
}

/* -------------------------------------------------------------------------- */
/* Tiny external store                                                        */
/* -------------------------------------------------------------------------- */

function emit(key: string): void {
  listeners.get(key)?.forEach((listener) => listener());
}

function setEntry(key: string, entry: Entry): void {
  cache.set(key, entry);
  writeMirror(key, entry.visitor);
  emit(key);
}

function subscribe(key: string, listener: () => void): () => void {
  const set = listeners.get(key) ?? new Set();
  set.add(listener);
  listeners.set(key, set);
  return () => {
    set.delete(listener);
    if (set.size === 0) listeners.delete(key);
  };
}

async function flush(): Promise<void> {
  flushHandle = null;
  const keys = [...pending];
  pending.clear();
  if (keys.length === 0) return;

  try {
    const res = await fetch(`/api/engagement?targets=${encodeURIComponent(keys.join(","))}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = (await res.json()) as { targets: Record<string, Entry> };
    for (const [key, entry] of Object.entries(data.targets ?? {})) setEntry(key, entry);
  } catch {
    /* offline — components keep rendering their optimistic/local state */
  }
}

function schedule(key: string): void {
  pending.add(key);
  if (flushHandle === null) flushHandle = setTimeout(() => void flush(), BATCH_MS);
}

async function send(
  key: string,
  type: EngageableType,
  id: string,
  action: "view" | "like" | "react",
  reaction?: ReactionKind,
): Promise<void> {
  const guardKey = `${key}:${action}:${reaction ?? ""}`;
  const now = Date.now();
  if (inFlight.has(guardKey)) return;
  if (now - (lastAction.get(guardKey) ?? 0) < MIN_ACTION_GAP_MS) return;

  lastAction.set(guardKey, now);
  inFlight.add(guardKey);

  try {
    const res = await fetch("/api/engagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType: type, targetId: id, action, reaction }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as Entry;
    if (data?.counts) setEntry(key, { counts: data.counts, visitor: data.visitor });
  } catch {
    /* keep the optimistic state */
  } finally {
    inFlight.delete(guardKey);
  }
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

const EMPTY: Entry = {
  counts: { views: 0, likes: 0, reactions: { clap: 0, heart: 0, fire: 0 } },
  visitor: { liked: false, reactions: [], viewed: false },
};

export interface UseEngagementOptions {
  /** Registers a (deduplicated, server-side cooled-down) view on mount. */
  trackView?: boolean;
  /** Server-rendered counts, used until the live snapshot lands. */
  initialCounts?: EngagementCounts;
}

export function useEngagement(
  type: EngageableType,
  id: string,
  options: UseEngagementOptions = {},
) {
  const key = targetKey(type, id);
  const { trackView = false, initialCounts } = options;

  const entry = useSyncExternalStore(
    (listener) => subscribe(key, listener),
    () => cache.get(key),
    () => undefined,
  );

  useEffect(() => {
    if (!cache.has(key)) {
      const mirrored = readMirror()[key];
      if (initialCounts || mirrored) {
        cache.set(key, {
          counts: initialCounts ?? EMPTY.counts,
          visitor: mirrored ?? EMPTY.visitor,
        });
      }
      schedule(key);
    }
    if (trackView) void send(key, type, id, "view");
  }, [key, type, id, trackView, initialCounts]);

  const like = useCallback(() => {
    const current = cache.get(key) ?? EMPTY;
    const liked = !current.visitor.liked;
    // Optimistic: the button responds on the same frame as the tap.
    setEntry(key, {
      counts: { ...current.counts, likes: Math.max(0, current.counts.likes + (liked ? 1 : -1)) },
      visitor: { ...current.visitor, liked },
    });
    void send(key, type, id, "like");
  }, [key, type, id]);

  const react = useCallback(
    (reaction: ReactionKind) => {
      const current = cache.get(key) ?? EMPTY;
      const active = current.visitor.reactions.includes(reaction);
      setEntry(key, {
        counts: {
          ...current.counts,
          reactions: {
            ...current.counts.reactions,
            [reaction]: Math.max(0, current.counts.reactions[reaction] + (active ? -1 : 1)),
          },
        },
        visitor: {
          ...current.visitor,
          reactions: active
            ? current.visitor.reactions.filter((r) => r !== reaction)
            : [...current.visitor.reactions, reaction],
        },
      });
      void send(key, type, id, "react", reaction);
    },
    [key, type, id],
  );

  const resolved = entry ?? (initialCounts ? { ...EMPTY, counts: initialCounts } : EMPTY);

  return {
    counts: resolved.counts,
    visitor: resolved.visitor,
    /** True until the first server snapshot for this target has landed. */
    loading: entry === undefined,
    like,
    react,
  };
}

export function formatCompact(value: number): string {
  if (value < 1000) return String(value);
  if (value < 100_000) return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}k`;
  return `${(value / 100_000).toFixed(1)}L`;
}
