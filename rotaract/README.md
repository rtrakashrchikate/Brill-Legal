# Rotaract Club — website

A premium, glassmorphic website for a Rotaract club, built with **Next.js 15
(App Router)**, **Tailwind CSS v4**, **Framer Motion** and a **Supabase-or-local**
backend. It runs end to end with zero configuration — no database, no keys.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

Node 20+ required.

---

## What's in it

Seven public pages plus the verified-only surfaces:

| Route | What it is |
| --- | --- |
| `/` | Hero with dynamic gradients, counting statistics, next-project countdown, live hub excerpt |
| `/about` | Mission/vision, operating principles, animated history timeline, citations |
| `/blogs`, `/blogs/[slug]` | Publication grid with category + search filters; full article view |
| `/members` | Photo directory of the board and roster, filterable by **name, year and role**, with a profile sheet |
| `/events`, `/events/[slug]` | Vertical animated timeline with a **live countdown** on every upcoming event; detail page with venue, organiser and registration |
| `/news`, `/news/[slug]` | Masonry feed of district projects, filterable by **district and impact area**; detail page with the full write-up and a "how to copy this" panel |
| `/hub` | **Requirement Hub** — public bulletin board of live resource requests |
| `/login`, `/dashboard` | Mock auth and the posting surface behind the verification wall |

### Branding

The official palette is applied as design tokens in `src/app/globals.css`:

| Token | Value | Role |
| --- | --- | --- |
| `--color-cranberry-600` | `#D91B5C` | Primary accent |
| `--color-gold-500` | `#F7A81B` | Secondary highlight |
| `--color-royal-700` | `#0050A1` | Structural accent |
| `--canvas` (light) | `#FFFFFF` | Light base |
| `--canvas` (dark) | `#0B0F19` | Dark base |

Dark/light is class-based, remembered in LocalStorage and applied by an inline
script before first paint, so there is no flash of the wrong theme. Every
animation is wrapped in `prefers-reduced-motion` handling.

---

## SEO

| Surface | Where |
| --- | --- |
| XML sitemap (all public routes, including every blog, event and news slug) | `src/app/sitemap.ts` |
| `robots.txt`, disallowing `/api/`, `/dashboard`, `/login` | `src/app/robots.ts` |
| Canonical URLs on every page | `canonical()` in `src/lib/seo.ts` |
| Open Graph / Twitter cards, generated per route | `src/lib/og.tsx` + `opengraph-image.tsx` files |
| JSON-LD structured data | `src/lib/seo.ts`, emitted by `<JsonLd>` |
| Web manifest and icon | `src/app/manifest.ts`, `src/app/icon.svg` |

Structured data is scoped so nothing describes content the page does not show:
`NGO` + `WebSite` once in the root layout (referenced by `@id` everywhere
else), `BlogPosting` on articles, `Event` per upcoming event, `NewsArticle` on
district projects, `CollectionPage` + `ItemList` on index pages, and
`BreadcrumbList` wherever a trail is rendered — generated from the same array
that renders the visible breadcrumbs, so the two cannot drift.

OG cards are drawn from typography and the brand gradient only. No remote
images and no dynamic font fetches, so the render cannot fail on a network
hiccup at build time.

---

## The two engagement tiers

### A. Public — no login, anywhere

Any visitor can read every page, use every filter, copy any contact detail, and
**view / like / react** on blogs, events, news, members and hub listings.

Identity for the anonymous ledger is a **rotating hash**, not a tracker:

```
sha256(salt | day-number | ip | user-agent | accept-language).slice(0, 16)
```

No IP is stored, the hash cannot be reversed to an address, and it rotates every
24 hours. It exists purely to stop one visitor inflating a counter.

Spam prevention is layered:

| Layer | Rule | Where |
| --- | --- | --- |
| Rate limit | 40 actions / 60s per visitor, sliding window | `src/lib/engagement/rate-limit.ts` |
| View dedupe | One counted view per target per 6 hours | `src/lib/engagement/store.ts` |
| Action dedupe | One like and one of each reaction per visitor per target | server-side ledger |
| Client throttle | 350 ms between identical actions, in-flight guard | `src/lib/engagement/client.ts` |

The client batches every visible target into a single snapshot request per tick,
mirrors the visitor's own actions to LocalStorage for instant correct state on
return visits, and applies each action optimistically before the server replies.

### B. Verified Rotaractors — posting only

Publishing to the Requirement Hub requires **both**:

1. a valid signed session cookie, and
2. `is_verified_rotaractor === true` on the profile.

Enforcement is in two places, deliberately:

- `src/middleware.ts` verifies the cookie's HMAC signature at the edge before
  `/dashboard` renders.
- `POST /api/requests` re-checks the session **and** the verification flag,
  returning `401` when signed out and `403 { code: "NOT_VERIFIED" }` otherwise.
  A hand-rolled POST from an unverified account is rejected, not just hidden.

Listings from verified accounts carry the accent **VERIFIED** badge on the
public board.

#### Demo accounts

| Email | Password | State |
| --- | --- | --- |
| `president@racpunemetro.org` | `rotaract2026` | Verified — can post |
| `community@racpunemetro.org` | `rotaract2026` | Verified — can post |
| `prospect@example.org` | `service2026` | Signed in, **not** verified — blocked |

Passwords are SHA-256 hashed in `src/data/users.json`. This is a **mock** layer
for exercising the wall — replace `verifyCredentials` with Supabase Auth for
anything real.

---

## Backend: Supabase or local

`src/lib/backend/supabase.ts` is a dependency-free PostgREST client. Every
accessor tries Supabase first and falls back to the in-repo seed data, so the
site is identical with or without a backend.

- **Unset env** → reads from `src/data/*.json`; writes go to `.data/*.json`
  (git-ignored), mirrored in memory and degrading to memory-only on a read-only
  filesystem.
- **Env set** → reads and writes hit Supabase; the local store stays as the
  fallback path.

### Schema

```bash
supabase db push                 # or paste supabase/migrations/0001_init.sql
node supabase/seed.mjs           # loads src/data/*.json (idempotent upserts)
node supabase/seed.mjs --dry-run # preview payloads, send nothing
```

Column names are camelCase and quoted on purpose: PostgREST returns them
verbatim, so the Supabase path and the local fallback produce byte-identical
shapes with no mapping layer to drift.

Row-level security mirrors the application's verification wall rather than
restating it loosely — the two are meant to fail closed together:

| Table | anon | authenticated |
| --- | --- | --- |
| `members`, `blogs`, `events`, `news` | read | read |
| `resource_requests` | read | read; **insert only when `is_verified_rotaractor()`**; update own listing |
| `engagement_counts` | read | read (no write grant to either role) |
| `profiles` | none | own row only |

Two triggers enforce what a `WITH CHECK` cannot, because policy expressions
cannot see the previous row:

- `freeze_verification` — a signed-in user can never flip their own
  `is_verified_rotaractor`. Only a privileged path (service role, or a club
  secretary tool running as one) may grant it.
- `freeze_request_badge` — `isVerified` is a snapshot taken at posting time, so
  editing a listing later cannot change what the badge claimed.

`is_verified_rotaractor()` is `SECURITY DEFINER` with a pinned `search_path`: a
policy on `profiles` that itself selects from `profiles` would recurse.

The migration and every policy above were applied to a real PostgreSQL 16 and
exercised — verified insert succeeds, unverified insert is rejected by RLS,
self-verification and badge edits raise, anon reads listings but sees no
profiles and cannot write counts.

See `.env.example` for every variable.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx                 root shell: fonts, theme, nav, footer
│   ├── page.tsx                   home
│   ├── about|blogs|members|events|news|hub|login|dashboard/
│   └── api/
│       ├── engagement/route.ts    anonymous view/like/react + snapshots
│       ├── requests/route.ts      public GET, verified-only POST
│       └── auth/{login,logout,session}/route.ts
├── components/
│   ├── auth/                      login form, sign-out
│   ├── blogs/ events/ hub/ members/ news/ home/
│   ├── engagement/EngagementBar   views, likes, 👏 ❤️ 🔥 reactions
│   ├── layout/                    navbar, footer, page header
│   ├── motion/primitives.tsx      Reveal, Stagger, CountUp, Tilt, Magnetic, WordReveal
│   ├── theme/                     provider + no-flash script + toggle
│   └── ui/                        glass card, button, badge, filters, copy button, generated art
│   └── seo/JsonLd                 structured-data emitter
├── config/site.ts                 club identity, nav, taxonomies
├── data/                          seed JSON + editorial content
├── lib/
│   ├── auth/                      session signing, user lookup, verification gate
│   ├── backend/                   supabase client, local write-through store
│   ├── engagement/                visitor hash, rate limit, server store, client hook
│   ├── og.tsx                     shared Open Graph card renderer
│   ├── seo.ts                     canonicals + JSON-LD builders
│   └── source/                    unified read layer
├── middleware.ts                  edge session check for /dashboard
└── types/index.ts                 domain model

supabase/
├── migrations/0001_init.sql       schema, RLS, triggers, grants
└── seed.mjs                       idempotent loader for src/data/*.json
```

## Notes on the seed content

The club, members, projects and district news are **placeholder content** for a
fictional club (RAC Pune Metro, RID 3131) — replace `src/data/*.json` with real
records. Member portraits are optional: set `photo` on a member and it renders,
otherwise a deterministic monogram is generated from the record id, so the
directory never shows a broken image. Event dates are absolute, so the seed
timeline will need refreshing over time for the countdowns to stay meaningful.
