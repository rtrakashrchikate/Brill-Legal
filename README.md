# Brill Legal

The website for Brill Legal — a full-service Indian law practice. A Next.js 16
(App Router, TypeScript, Tailwind v4) front-end with a premium editorial design,
tasteful motion, a full SEO system, and an **optional headless WordPress**
content backend (works fully without it).

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

No environment variables are required for local dev — the site serves the
in-repo content under `content/` and `src/data/`.

## What's inside

- **Pages:** home, practices (+ detail), insights (+ article), location pages
  (`/[service]-lawyer-in-[city]`), FAQ hub, glossary, resources, people, news,
  HTML sitemap, contact, about.
- **SEO:** full JSON-LD schema suite, XML sitemap + robots, canonicals, content
  calendar, internal-linking model. The Next.js app is the canonical site.
- **Design/motion:** authority-navy + trust-gold, Playfair Display + Inter,
  scroll reveals / staggers / hero word-reveal / count-ups — all respect
  `prefers-reduced-motion`.
- **Conversion:** sticky contact dock, contextual CTA bands, matter-pre-filled
  enquiry form (`/api/enquiry`), WhatsApp/call, GA4 events.
- **Content engine:** markdown + frontmatter articles with a scheduled-publish
  calendar; `scripts/gen-manifest.mjs` regenerates the 90-article manifest.

## Headless WordPress (optional)

Content can be served from WordPress via WPGraphQL. The integration is
**fallback-first**: unset `WP_GRAPHQL_ENDPOINT` → in-repo content; set it →
WordPress. See **[`wordpress/README.md`](./wordpress/README.md)** for the CMS
setup (a single mu-plugin registers everything) and the field → front-end map.

## Deploy

See **[`DEPLOY.md`](./DEPLOY.md)** for Vercel + domain (brilllegal.in) setup.
Environment variables are documented in **`.env.example`**.

## Project layout

```
src/app/          routes (App Router)
src/components/    UI, motion, schema, conversion surfaces
src/data/          structured content (practices, people, locations, …)
src/lib/wp/        WPGraphQL client, queries, mappers
src/lib/source/    unified WP-first / local-fallback data layer
content/articles/  markdown guides + manifest
wordpress/         headless WordPress backend (mu-plugin + docs)
docs/              authoring spec + content calendar
```
