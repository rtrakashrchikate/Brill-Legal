import "server-only";

import { mutateStore, readStore } from "@/lib/backend/local-store";
import { sbUpsert, supabaseEnabled } from "@/lib/backend/supabase";
import { parseTargetKey } from "@/lib/engagement/keys";
import { seedFrom } from "@/lib/utils";
import {
  REACTION_KINDS,
  type EngagementCounts,
  type ReactionKind,
  type VisitorState,
} from "@/types";

const COUNTS_STORE = "engagement-counts";
const LEDGER_STORE = "engagement-ledger";

/** A view from the same visitor only counts again after this window. */
const VIEW_COOLDOWN_MS = 6 * 60 * 60 * 1000;

type CountsMap = Record<string, EngagementCounts>;

interface LedgerEntry {
  liked?: boolean;
  reactions?: ReactionKind[];
  viewedAt?: number;
}

type Ledger = Record<string, Record<string, LedgerEntry>>;

export const emptyCounts = (): EngagementCounts => ({
  views: 0,
  likes: 0,
  reactions: { clap: 0, heart: 0, fire: 0 },
});

/**
 * Deterministic starting numbers so a fresh install does not present a wall of
 * zeros. Derived from the target key, so they are stable across restarts.
 */
function seedCounts(key: string): EngagementCounts {
  const parsed = parseTargetKey(key);
  if (!parsed) return emptyCounts();
  const seed = seedFrom(key);
  const scale = parsed.type === "member" ? 0.4 : 1;
  const views = Math.round((180 + (seed % 1450)) * scale);
  return {
    views,
    likes: Math.round(views * (0.05 + ((seed >> 4) % 9) / 100)),
    reactions: {
      clap: Math.round(views * 0.03) + ((seed >> 8) % 11),
      heart: Math.round(views * 0.022) + ((seed >> 12) % 9),
      fire: Math.round(views * 0.014) + ((seed >> 16) % 7),
    },
  };
}

function allCounts(): CountsMap {
  return readStore<CountsMap>(COUNTS_STORE, {});
}

function ledger(): Ledger {
  return readStore<Ledger>(LEDGER_STORE, {});
}

export function countsFor(key: string): EngagementCounts {
  return allCounts()[key] ?? seedCounts(key);
}

export function visitorStateFor(visitor: string, key: string): VisitorState {
  const entry = ledger()[visitor]?.[key] ?? {};
  return {
    liked: Boolean(entry.liked),
    reactions: entry.reactions ?? [],
    viewed: Boolean(entry.viewedAt),
  };
}

function persist(key: string, counts: EngagementCounts): EngagementCounts {
  mutateStore<CountsMap>(COUNTS_STORE, {}, (current) => ({ ...current, [key]: counts }));

  if (supabaseEnabled()) {
    const parsed = parseTargetKey(key);
    if (parsed) {
      // Fire-and-forget mirror; the local store stays authoritative for the
      // response so a slow backend never blocks the interaction.
      void sbUpsert(
        "engagement_counts",
        {
          targetType: parsed.type,
          targetId: parsed.id,
          views: counts.views,
          likes: counts.likes,
          clap: counts.reactions.clap,
          heart: counts.reactions.heart,
          fire: counts.reactions.fire,
        },
        "targetType,targetId",
      );
    }
  }

  return counts;
}

function updateLedger(visitor: string, key: string, patch: LedgerEntry): void {
  mutateStore<Ledger>(LEDGER_STORE, {}, (current) => ({
    ...current,
    [visitor]: {
      ...(current[visitor] ?? {}),
      [key]: { ...(current[visitor]?.[key] ?? {}), ...patch },
    },
  }));
}

export interface MutationResult {
  counts: EngagementCounts;
  visitor: VisitorState;
  /** False when the action was deduplicated rather than applied. */
  applied: boolean;
}

export function registerView(visitor: string, key: string): MutationResult {
  const entry = ledger()[visitor]?.[key] ?? {};
  const now = Date.now();
  const counts = countsFor(key);

  if (entry.viewedAt && now - entry.viewedAt < VIEW_COOLDOWN_MS) {
    return { counts, visitor: visitorStateFor(visitor, key), applied: false };
  }

  const next = persist(key, { ...counts, views: counts.views + 1 });
  updateLedger(visitor, key, { viewedAt: now });
  return { counts: next, visitor: visitorStateFor(visitor, key), applied: true };
}

export function toggleLike(visitor: string, key: string): MutationResult {
  const state = visitorStateFor(visitor, key);
  const counts = countsFor(key);
  const liked = !state.liked;

  const next = persist(key, {
    ...counts,
    likes: Math.max(0, counts.likes + (liked ? 1 : -1)),
  });
  updateLedger(visitor, key, { liked });
  return { counts: next, visitor: visitorStateFor(visitor, key), applied: true };
}

export function toggleReaction(
  visitor: string,
  key: string,
  reaction: ReactionKind,
): MutationResult {
  if (!REACTION_KINDS.includes(reaction)) {
    return { counts: countsFor(key), visitor: visitorStateFor(visitor, key), applied: false };
  }

  const state = visitorStateFor(visitor, key);
  const counts = countsFor(key);
  const active = state.reactions.includes(reaction);

  const next = persist(key, {
    ...counts,
    reactions: {
      ...counts.reactions,
      [reaction]: Math.max(0, counts.reactions[reaction] + (active ? -1 : 1)),
    },
  });

  updateLedger(visitor, key, {
    reactions: active
      ? state.reactions.filter((r) => r !== reaction)
      : [...state.reactions, reaction],
  });

  return { counts: next, visitor: visitorStateFor(visitor, key), applied: true };
}

export function snapshot(
  visitor: string,
  keys: string[],
): Record<string, { counts: EngagementCounts; visitor: VisitorState }> {
  const out: Record<string, { counts: EngagementCounts; visitor: VisitorState }> = {};
  for (const key of keys) {
    if (!parseTargetKey(key)) continue;
    out[key] = { counts: countsFor(key), visitor: visitorStateFor(visitor, key) };
  }
  return out;
}
