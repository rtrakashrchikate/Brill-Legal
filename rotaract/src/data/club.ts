/** Editorial content for the Home and About pages. */

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  caption: string;
}

export const stats: Stat[] = [
  { label: "Service hours", value: 14200, suffix: "+", caption: "logged since charter" },
  { label: "Lives touched", value: 26800, suffix: "+", caption: "across 6 districts" },
  { label: "Active projects", value: 19, caption: "running this Rotary year" },
  { label: "Blood units", value: 2400, suffix: "+", caption: "mobilised since 2022" },
];

export interface Pillar {
  title: string;
  description: string;
  accent: "cranberry" | "gold" | "royal";
  metric: string;
}

export const pillars: Pillar[] = [
  {
    title: "Community Service",
    description:
      "Anganwadi refurbishment, blood drives and literacy circles — run structurally first, photographed second.",
    accent: "cranberry",
    metric: "14 centres rebuilt",
  },
  {
    title: "Professional Development",
    description:
      "A mentorship ladder, placement sprints and a district-wide skills lab that pairs students with working professionals.",
    accent: "gold",
    metric: "120 pairings",
  },
  {
    title: "Environment",
    description:
      "An open urban-canopy dataset, river recovery phases and a caretaker-first planting standard.",
    accent: "royal",
    metric: "4,100 saplings tracked",
  },
  {
    title: "International Service",
    description:
      "Twinning with clubs in Colombo and Nairobi, and the district's first approved global grant.",
    accent: "cranberry",
    metric: "3 twin clubs",
  },
];

export const mission =
  "To give young professionals in Pune a serious place to practise service — with real budgets, real deadlines and published results.";

export const vision =
  "A district where every unmet need is visible to every club, and where asking for help is as ordinary as offering it.";

export const values = [
  {
    title: "Structural before cosmetic",
    body: "We fix water, sanitation and safety before we paint a wall. If the budget runs out, the project stops at the last structural step.",
  },
  {
    title: "Publish the number that embarrasses you",
    body: "Our sapling survival rate, our deferral rates, our unaudited quarters — all public. Precision about our own limits is what earns the trust.",
  },
  {
    title: "Reading is never gated",
    body: "Anyone can read every listing, contact any member and use the Requirement Hub without an account. Only posting is verified.",
  },
  {
    title: "Hand over in writing",
    body: "Every project ends with a one-page note: what we fixed, what we did not, who to call, when the next visit is due.",
  },
];

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  badge?: string;
}

export const history: TimelineEntry[] = [
  {
    year: "2004",
    title: "Chartered under RID 3131",
    body: "Twenty-two founding members, sponsored by the Rotary Club of Pune Deccan, with a first-year budget of ₹40,000.",
    badge: "Charter",
  },
  {
    year: "2009",
    title: "First district award",
    body: "The literacy circle model — weekly, small-group, same volunteers — won Outstanding Community Project and was adopted by four clubs.",
  },
  {
    year: "2014",
    title: "Anganwadi programme begins",
    body: "The first six refurbishments taught us the difference between a project and a maintenance commitment. The programme has run every year since.",
  },
  {
    year: "2019",
    title: "Open books",
    body: "The club began publishing quarterly receipts, project-level spend and closing balances publicly. Three neighbouring clubs have since adopted the format.",
    badge: "Governance",
  },
  {
    year: "2022",
    title: "Blood drive becomes a district programme",
    body: "What began as one club's Saturday became a standing arrangement between eleven clubs and three hospitals.",
  },
  {
    year: "2024",
    title: "First global grant approved",
    body: "Eleven months, three rejections and a seven-week community assessment. Water and sanitation, with maintenance funded by the gram panchayat.",
    badge: "International",
  },
  {
    year: "2026",
    title: "Requirement Hub goes district-wide",
    body: "A public bulletin board for unmet needs — open to read, verified to post. Ninety-one requests matched in the first two quarters.",
    badge: "Platform",
  },
];

export const achievements = [
  { label: "District Outstanding President", year: "2024-25" },
  { label: "Best Community Service Project", year: "2023-24" },
  { label: "Highest Blood Units Mobilised", year: "2022-23, 2024-25" },
  { label: "Outstanding Club Bulletin", year: "2021-22" },
  { label: "Presidential Citation", year: "2019-20 → 2025-26" },
];
