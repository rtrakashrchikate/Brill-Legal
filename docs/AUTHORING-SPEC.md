# Article Authoring Spec — Brill Legal

Every article is a Markdown file with YAML frontmatter at:
`content/articles/<practice>/<slug>.md`

The canonical list (slug, title, type, keyword, practice, author, publishDate,
related) is in `content/manifest.json`. **Use those exact values** — do not
change slug, practice, type, keyword, author, publishDate or related.

## Frontmatter (exact shape)

```yaml
---
title: "Exact title from manifest"
slug: "exact-slug-from-manifest"
practice: "exact-practice-from-manifest"
type: pillar            # or cluster (from manifest)
keyword: "exact keyword from manifest"
description: "Meta description, 140–160 chars, plain, no superlatives."
author: "exact-author-slug-from-manifest"
publishDate: "YYYY-MM-DD"   # exact from manifest
related:
  - related-slug-1
  - related-slug-2
  - related-slug-3
faqs:
  - q: "A real question someone would search?"
    a: "A direct, factual one-paragraph answer on a single line."
  - q: "..."
    a: "..."
howto:                  # OPTIONAL — include ONLY for step-by-step "how to" articles
  name: "How to ..."
  steps:
    - name: "Step name"
      text: "What to do in this step."
---
```

### YAML safety (important)
- Wrap every `q`, `a`, `title`, `description` value in **double quotes**.
- Keep each `a:` answer on **one line** (no line breaks inside the value).
- If your text needs a double quote inside, rephrase to avoid it, or use single
  quotes inside. Do not use unescaped colons followed by a space inside unquoted
  values.
- `faqs`: 3–4 items per article. `related`: copy the 3 slugs from the manifest.

## Body requirements

- **Length:** pillars 1,600–2,400 words; clusters 750–1,100 words.
- **Structure:** open with a 2–3 sentence plain-English intro (no H1 — the page
  renders the title). Then `##` sections, `###` subsections, bullet/numbered
  lists, and a short markdown table where it genuinely helps.
- **Accuracy (India law, current as of 2026):**
  - Criminal law uses the 2023 codes now in force: **BNS** (Bharatiya Nyaya
    Sanhita) replaces the IPC, **BNSS** (Bharatiya Nagarik Suraksha Sanhita)
    replaces the CrPC, **BSA** (Bharatiya Sakshya Adhiniyam) replaces the
    Evidence Act. Anticipatory bail is under **Section 482 BNSS**; FIR quashing
    via the High Court's inherent powers under **Section 528 BNSS**. You may note
    the old section numbers in brackets for familiarity.
  - Cheque dishonour: **Section 138, Negotiable Instruments Act**.
  - Arbitration: **Arbitration and Conciliation Act, 1996** (Section 9 interim
    relief, Section 34 challenge, Section 36 enforcement, Part II for foreign
    awards / New York Convention).
  - RERA: **Real Estate (Regulation and Development) Act, 2016**; Maharashtra =
    **MahaRERA**; appeals to the Maharashtra Real Estate Appellate Tribunal.
  - Data protection: **Digital Personal Data Protection Act, 2023 (DPDP)**.
  - Consumer: **Consumer Protection Act, 2019** (District/State/National
    Commissions; e-Daakhil online filing).
  - Use Maharashtra / Pune / Mumbai / Bombay High Court detail where relevant.
- **Tone:** measured, second-person, instructional. **No superlatives** ("best",
  "leading", "guaranteed"), **no outcome promises**, **no fabricated statistics,
  case results or testimonials**.
- **Internal links (in the body, markdown):** link to
  - the practice page: `/practices/<practice>`
  - the practice **pillar** article and at least **2 sibling** articles (use the
    related slugs): `/insights/<slug>`
  - 1–2 relevant glossary terms where natural: `/glossary/<term-slug>`
  (Glossary slugs include: anticipatory-bail, bail, fir, quashing, writ-petition,
  pmla, enforcement-directorate, rera, carpet-area, stamp-duty, arbitration,
  arbitral-award, mediation, nclt, ibc, sarfaesi, will, probate, succession-certificate,
  mutual-consent-divorce, maintenance, esop, nda, dpdp-act, trademark, mact, etc.)
- **Close** with a short `## How Brill Legal can help` paragraph framed as
  capability (what we advise on / where we appear) — never a results claim — and
  one line inviting the reader to request a consultation.
- Do **not** include a generic legal disclaimer (the site footer carries it).

## Example skeleton

```markdown
---
title: "How to File a Civil Suit in India"
slug: "file-civil-suit-india"
practice: "dispute-resolution"
type: cluster
keyword: "how to file a civil suit"
description: "A step-by-step guide to filing a civil suit in India — jurisdiction, drafting the plaint, court fees, and what happens after filing."
author: "a-deshpande"
publishDate: "2026-03-21"
related:
  - civil-litigation-india-guide
  - money-recovery-suit-india
  - summary-suit-order-37
faqs:
  - q: "How long does a civil suit take in India?"
    a: "It varies widely with the court, the complexity of the matter and the conduct of the parties; some matters resolve in months while others take years."
howto:
  name: "How to file a civil suit in India"
  steps:
    - name: "Identify the right court"
      text: "Determine jurisdiction based on the value of the claim and where the cause of action arose."
---

Filing a civil suit begins long before you reach the courtroom...

## Where to file: jurisdiction
...
```
