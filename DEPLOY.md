# Deploying Brill Legal to Vercel

The site is a Next.js 16 app and is fully Vercel-ready. It builds and runs with
**no environment variables** (serving the in-repo content); WordPress and
analytics are optional add-ons you can switch on later.

---

## 1. One-time setup

1. Push this repo to GitHub (already on the `claude/brill-legal-seo-content-Q6IsY`
   branch; merge to `main` when ready).
2. Go to **vercel.com → Add New → Project** and import the repository.
3. Vercel auto-detects Next.js. Leave the defaults:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (repo root)
   - **Build Command:** `next build` (default)
   - **Output:** handled automatically
   - Node.js 20+ (set by `engines` in `package.json`)
4. Click **Deploy**. First build takes ~1–2 minutes. You'll get a
   `*.vercel.app` URL to preview immediately.

`vercel.json` pins serverless functions to **Mumbai (bom1)** for low latency to
Indian users; static pages are served globally from Vercel's CDN.

---

## 2. Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** (all are
optional — see `.env.example`). Set for **Production** (and Preview if you like):

| Variable | Needed for | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Correct canonicals/sitemap | `https://brilllegal.in` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 | `G-XXXXXXXXXX` |
| `WP_GRAPHQL_ENDPOINT` | Pull content from WordPress | `https://cms.brilllegal.in/graphql` |
| `WP_APP_USERNAME` | Enquiry write-back | editor username |
| `WP_APP_PASSWORD` | Enquiry write-back | application password |
| `WP_REVALIDATE_SECRET` | Instant content updates | long random string |

> Set `NEXT_PUBLIC_SITE_URL` before launch so the sitemap and canonical tags use
> the real domain. Re-deploy after changing env vars.

---

## 3. Connect the domain (brilllegal.in)

1. Buy `brilllegal.in` (see the domain options shared earlier — ~$8/yr).
2. In **Vercel → Project → Settings → Domains**, add `brilllegal.in` and
   `www.brilllegal.in`.
3. At your registrar, set the DNS records Vercel shows you:
   - Apex `brilllegal.in` → **A** record `76.76.21.21` *(or the value Vercel
     displays)*, or an `ALIAS`/`ANAME` to `cname.vercel-dns.com` if supported.
   - `www` → **CNAME** `cname.vercel-dns.com`.
4. Vercel issues the SSL certificate automatically once DNS resolves.
5. Set the primary domain (recommend `brilllegal.in`, redirect `www` → apex).

---

## 4. After the first deploy

- **Google Search Console:** add `brilllegal.in`, submit `/sitemap.xml`.
- **Bing Webmaster Tools:** add the site, submit the sitemap.
- **Analytics:** set `NEXT_PUBLIC_GA_ID` and redeploy to enable GA4 + the
  `generate_lead` / `click_whatsapp` / `click_call` events.
- **Google Business Profile:** complete the real Pune office listing — the single
  biggest local-SEO lever.

---

## 5. Turning on WordPress later (optional)

When `cms.brilllegal.in` is live (see `wordpress/README.md`):

1. Set `WP_GRAPHQL_ENDPOINT` (+ `WP_APP_*`, `WP_REVALIDATE_SECRET`) in Vercel and
   redeploy. Content now comes from WordPress, with automatic fallback.
2. Wire instant updates: point a WordPress save hook at
   `POST https://brilllegal.in/api/revalidate` with
   `{ "secret": "<WP_REVALIDATE_SECRET>", "tag": "wp" }`.

---

## Notes

- The build reads the in-repo markdown/data at build time, so deploys are fully
  static + ISR — fast and cheap (Vercel Hobby tier is enough to launch).
- Security headers (HSTS, nosniff, frame options) are set in `next.config.ts`.
- No secrets are committed; everything sensitive is an env var.
