# Magic (21st.dev) — Design Backlog

Components to generate with the `@21st-dev/magic` MCP in a fresh session, then
adapt to the **oxblood** design system. Build order top-to-bottom.

## Design tokens to feed Magic (keep on-brand)
- Brand red (oxblood): `#8a2232`; deep wine: `#3d0c16`; deep accent: `#621420`
- Rose (for dark surfaces): `#d49aa1`; bone paper: `#f7f3ed`; ink: `#181014`
- Display serif: **Playfair Display**; UI sans: **Inter**
- Aesthetic: dramatic editorial, oversized serif, dark statement sections,
  grain + grid textures, restrained motion (respect `prefers-reduced-motion`)
- Stack: **Next.js 16 App Router, React 19, Tailwind v4, Framer Motion (`motion`)**
- Reuse existing utilities: `.bg-hero`, `.bg-wine`, `.noise`, `.bg-grid-dark`,
  `.text-outline-dark`, `.kicker`, `.card-lift`, `Reveal`/`StaggerGroup`/`CountUp`

## 1. Hero v2 — cinematic
- Keep current structure but push it: layered wine gradient, animated grain,
  a subtle parallax on the practice panel, a refined scroll-cue.
- Optional: kinetic underline / mask-reveal on "complex matters".
- Constraint: headline must stay readable on dark; no fake imagery.

## 2. Credentials / Trust strip (NOT testimonials)
- Legitimate signals only: "Practising since 2007", "Enrolled with the Bar
  Council of Maharashtra & Goa", "Appears before the Bombay High Court &
  tribunals", "7 practice areas", "90+ guides", "Pune · Mumbai · pan-India".
- Format: a quiet bone-on-wine band with iconography + the CountUp stats.
- Hard rule: no fabricated client quotes, ratings, logos, or numbers.

## 3. Animated practice cards (bento)
- 7 practices in an asymmetric bento; hover reveals a short capability list and
  an arrow; oxblood border-glow on hover; index numerals (01–07).
- Motion: stagger-in on scroll; magnetic/tilt hover (reduced-motion safe).

## 4. Stat / authority band
- Full-width wine band with 3–4 CountUp metrics + a one-line positioning
  statement. Reuse `CountUp`.

## 5. Article reading enhancements
- Sticky "on this page" table of contents (generated from `##` headings),
  reading progress already exists; add an end-of-article author card + next/prev.

## 6. Footer v2
- Editorial mega-footer: large wordmark, practice columns, locations, NAP from
  Site Settings, a thin oxblood top rule, newsletter/consult CTA.

## Execution notes
- Generate via Magic, then: recolor to tokens, swap fonts, wrap interactive bits
  in client components, gate animation on `useReducedMotion`, verify `npm run
  build`, and screenshot before/after.
- Keep everything white-hat: real capability, no fabricated trust signals.
