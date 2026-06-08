/**
 * Firm news / updates — a freshness signal and a home for legal-update
 * commentary. Keep factual; no outcome promises or fabricated milestones.
 * PLACEHOLDER entries to be maintained by the firm.
 */

export type NewsItem = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  body: string;
  category: "Firm update" | "Legal update";
};

export const news: NewsItem[] = [
  {
    slug: "brill-legal-insights-launch",
    title: "Brill Legal launches its Insights library",
    date: "2026-01-15",
    category: "Firm update",
    summary:
      "We have begun publishing a structured library of plain-English legal guides across our seven practice areas.",
    body:
      "Brill Legal has launched an Insights library — a growing set of practical, plain-English guides covering litigation, white-collar matters, real estate and RERA, family law, arbitration, corporate work and tribunal practice. The guides are written for clients and businesses who want to understand the process before they pick up the phone. New guides are published on a regular calendar rather than all at once, so the library deepens steadily over the year.",
  },
  {
    slug: "dpdp-act-what-businesses-should-do",
    title: "DPDP Act 2023: what businesses should be doing now",
    date: "2026-02-20",
    category: "Legal update",
    summary:
      "A short note on practical first steps for companies preparing for the Digital Personal Data Protection Act.",
    body:
      "As the Digital Personal Data Protection Act, 2023 framework takes shape, companies that handle personal data should begin mapping what data they collect, why, and where it flows. Practical first steps include updating privacy notices, putting consent mechanisms in place, reviewing vendor contracts for data-processing terms, and assigning internal responsibility for compliance. Our corporate team has published a DPDP compliance checklist in the Insights library.",
  },
  {
    slug: "rera-focus-for-homebuyers",
    title: "A continued focus on RERA matters for homebuyers",
    date: "2026-03-10",
    category: "Firm update",
    summary:
      "Our real-estate team continues to advise homebuyers on delayed-possession and refund claims before MahaRERA.",
    body:
      "Delayed possession and refund claims remain among the most common issues homebuyers bring to us. Our real-estate team advises buyers in Pune and Mumbai on filing and arguing complaints before MahaRERA, and on appeals to the Maharashtra Real Estate Appellate Tribunal. We have added several RERA guides to the Insights library to help buyers understand their remedies before they file.",
  },
];

export const newsBySlug = (slug: string) => news.find((n) => n.slug === slug);
