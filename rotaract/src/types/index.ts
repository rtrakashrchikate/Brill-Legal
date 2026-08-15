/**
 * Domain model for the Rotaract club platform.
 *
 * Every entity that a visitor can react to implements {@link Engageable} so the
 * anonymous engagement layer can address it with a single `targetType:targetId`
 * key, regardless of which page it is rendered on.
 */

export type EngageableType = "blog" | "event" | "news" | "member" | "request";

export type ReactionKind = "clap" | "heart" | "fire";

export const REACTION_KINDS: ReactionKind[] = ["clap", "heart", "fire"];

export interface Engageable {
  id: string;
}

export interface EngagementCounts {
  views: number;
  likes: number;
  reactions: Record<ReactionKind, number>;
}

export interface EngagementSnapshot extends EngagementCounts {
  targetType: EngageableType;
  targetId: string;
}

/** What the current anonymous visitor has already done to a target. */
export interface VisitorState {
  liked: boolean;
  reactions: ReactionKind[];
  viewed: boolean;
}

/* -------------------------------------------------------------------------- */
/* People                                                                     */
/* -------------------------------------------------------------------------- */

export type MemberCategory = "bod" | "member" | "alumni";

export interface Member extends Engageable {
  slug: string;
  name: string;
  /** Board portfolio, or "Member" for the general roster. */
  role: string;
  category: MemberCategory;
  /** Rotary year the record belongs to, e.g. "2025-26". */
  year: string;
  /** Sort weight for the board hierarchy (president = 1). */
  rank: number;
  avenue?: string;
  bio: string;
  since: number;
  email: string;
  whatsapp: string;
  linkedin?: string;
  instagram?: string;
  /** Optional high-resolution portrait. Falls back to generated monogram art. */
  photo?: string;
  highlights: string[];
}

/* -------------------------------------------------------------------------- */
/* Publications                                                               */
/* -------------------------------------------------------------------------- */

export interface Blog extends Engageable {
  slug: string;
  title: string;
  excerpt: string;
  /** Plain-text paragraphs; headings are prefixed with "## ". */
  body: string[];
  category: string;
  tags: string[];
  authorSlug: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  readMinutes: number;
  featured?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

export type EventStatus = "upcoming" | "ongoing" | "completed";

export interface ClubEvent extends Engageable {
  slug: string;
  title: string;
  summary: string;
  description: string;
  avenue: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  city: string;
  /** Registration or RSVP destination; omitted for internal meets. */
  registerUrl?: string;
  contactName: string;
  contactWhatsapp: string;
  seats?: number;
  highlights: string[];
}

/* -------------------------------------------------------------------------- */
/* District news                                                              */
/* -------------------------------------------------------------------------- */

export interface NewsItem extends Engageable {
  slug: string;
  title: string;
  club: string;
  district: string;
  impactArea: string;
  summary: string;
  publishedAt: string;
  /** Headline impact figure, e.g. "1,200 units collected". */
  impactMetric: string;
  beneficiaries: number;
  /** Full write-up for the detail page; headings are prefixed with "## ". */
  body?: string[];
  /** What another club would need to copy this. */
  replicate?: string[];
  sourceUrl?: string;
  /** Controls the masonry tile aspect so the grid reads as editorial. */
  weight: "tall" | "regular" | "wide";
}

/* -------------------------------------------------------------------------- */
/* Requirement hub                                                            */
/* -------------------------------------------------------------------------- */

export type RequestCategory =
  | "blood"
  | "funding"
  | "collaboration"
  | "volunteers"
  | "materials"
  | "mentorship";

export type RequestUrgency = "critical" | "high" | "normal";

export type RequestStatus = "open" | "fulfilled" | "expired";

export interface ResourceRequest extends Engageable {
  title: string;
  category: RequestCategory;
  urgency: RequestUrgency;
  status: RequestStatus;
  description: string;
  city: string;
  district: string;
  needBy: string;
  createdAt: string;
  contactName: string;
  contactWhatsapp: string;
  contactEmail: string;
  postedByClub: string;
  /**
   * Mirrors the poster's `is_verified_rotaractor` flag at the time of posting.
   * Drives the accent VERIFIED badge on the hub.
   */
  isVerified: boolean;
}

export interface NewRequestInput {
  title: string;
  category: RequestCategory;
  urgency: RequestUrgency;
  description: string;
  city: string;
  district: string;
  needBy: string;
  contactWhatsapp: string;
  contactEmail: string;
}

/* -------------------------------------------------------------------------- */
/* Accounts                                                                   */
/* -------------------------------------------------------------------------- */

export interface RotaractorProfile {
  id: string;
  email: string;
  name: string;
  club: string;
  district: string;
  role: string;
  /** The verification wall's single source of truth. */
  is_verified_rotaractor: boolean;
}

export interface SessionUser extends RotaractorProfile {
  issuedAt: number;
}
