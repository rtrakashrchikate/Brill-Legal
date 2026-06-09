# Headless WordPress backend — Brill Legal

This folder contains the WordPress side of the headless setup. The public site
is the Next.js app in this repo; WordPress runs separately at
`cms.brilllegal.in` and is used **only for editing content**, exposed to the
front-end via **WPGraphQL**.

The integration is **opt-in**. Until `WP_GRAPHQL_ENDPOINT` is set in the Next.js
environment, the site serves the in-repo content (`/content`, `/src/data`). Set
the endpoint and articles are pulled from WordPress instead — no code changes.

## What's here

- `mu-plugins/brill-legal-headless.php` — a single must-use plugin that registers
  **everything in code** (version-controlled, no clicking around):
  - Taxonomies: `vertical`, `city`, `glossary_letter`
  - Post types: `practice`, `sector`, `person`, `location`, `glossary`,
    `resource`, `news`, `linkedin_feature`, `enquiry` (Articles use native Posts)
  - ACF field groups for each type (`articleFields`, `practiceFields`, …) with
    GraphQL exposure and the exact field names the Next.js queries expect
  - The **Site Settings** ACF options page (`siteSettings`)
  - A custom **`createEnquiry`** GraphQL mutation (the contact form's inbox)
  - GraphQL CORS for the front-end origin, and CMS `noindex`

## Install

1. Stand up WordPress on `cms.brilllegal.in` (Cloudways/Kinsta/any host). SSL on.
   **Settings → Permalinks → Post name.** **Settings → Reading → discourage
   search engines.**
2. Install + activate plugins: **WPGraphQL**, **Advanced Custom Fields PRO**,
   **WPGraphQL for ACF**, and (recommended) **WPGraphQL Smart Cache**,
   **RankMath SEO**, **WP Mail SMTP**.
3. Copy `mu-plugins/brill-legal-headless.php` to `wp-content/mu-plugins/`
   (create the folder if it doesn't exist). It loads automatically.
4. Create the **`vertical`** terms with slugs that match the front-end routes:
   `dispute-resolution`, `white-collar`, `real-estate`, `private-client`,
   `arbitration`, `corporate`, `tribunal`. Create **`city`** terms `pune`,
   `mumbai`. *(The plugin also maps the Setup-Pack's longer slugs, but matching
   the front-end slugs keeps URLs clean.)*
5. **Site Settings** (left admin menu) → fill phone, WhatsApp, address, etc.
6. Create an **Editor** user and generate an **Application Password**
   (Users → Profile → Application Passwords) for the enquiry mutation.
7. Confirm `cms.brilllegal.in/graphql` works (GraphQL → GraphiQL IDE). Try the
   `Articles` query from `src/lib/wp/queries.ts`.

## Wire the front-end

Set these in the Next.js host (Vercel) / `.env.local` — see `.env.example`:

```
WP_GRAPHQL_ENDPOINT=https://cms.brilllegal.in/graphql
WP_APP_USERNAME=<editor-user>
WP_APP_PASSWORD=<application-password>
WP_REVALIDATE_SECRET=<long-random-string>
```

## Live updates (revalidation)

The front-end statically renders and caches WordPress data (1h ISR + cache
tags). To push edits instantly, have WordPress call the webhook on save:

```
POST https://brilllegal.in/api/revalidate
Content-Type: application/json
{ "secret": "<WP_REVALIDATE_SECRET>", "tag": "wp:articles" }
```

You can wire this from a `save_post` hook, WPGraphQL Smart Cache, or a plugin
like WP Webhooks. Pass a `path` (e.g. `/insights/<slug>`) to refresh one page.

## Enquiries

The contact form POSTs to `/api/enquiry`, which calls the `createEnquiry`
mutation (authenticated with the application password) and stores each lead as a
draft **Enquiry** in WordPress — your private inbox. With WP disabled, leads are
logged server-side so the form always works.

## What maps to what

| Front-end (Next.js)        | WordPress source                          |
|----------------------------|-------------------------------------------|
| `/insights/[slug]`         | Post + `articleFields` (incl. `isPillar`) |
| Article practice/route     | `vertical` term slug → practice slug       |
| `/practices/[slug]`        | `practice` CPT + `practiceFields`          |
| `/[service]-lawyer-in-[city]` | `location` CPT + `locationFields`      |
| `/people/[slug]`           | `person` CPT + `personFields`             |
| `/glossary/[term]`         | `glossary` CPT + `glossaryFields`         |
| `/resources/[slug]`        | `resource` CPT + `resourceFields`         |
| `/news/[slug]`             | `news` CPT + `newsFields`                 |
| Header/footer/contact NAP  | `siteSettings` options page               |
| Contact form               | `createEnquiry` → `enquiry` CPT           |

> **All content types are wired** through `src/lib/source/*` (articles +
> `structured.ts` for practices, people, locations, glossary, resources, news,
> and `settings.ts` for the Site Settings options page). Each is WP-first and
> falls back to the in-repo content, so the site is identical until you populate
> WordPress — then each type switches over as you add entries. Rich WYSIWYG
> fields are converted to clean text on the way in (article bodies keep full
> HTML). The fixed practice taxonomy (the 7 route slugs + the contact form's
> matter-type dropdown) stays in code by design, so set the `vertical`/`practice`
> slugs in WordPress to match.

## SEO ownership

The **Next.js app is canonical**: it generates the public sitemap, robots and
JSON-LD schema. Keep RankMath for titles/meta only and leave the WP sitemap
noindexed (the plugin already forces `noindex` on the CMS).
