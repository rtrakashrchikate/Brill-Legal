/**
 * Team profiles power author bylines, /people pages and Person/Attorney schema —
 * strong E-E-A-T signals for legal (YMYL) content.
 *
 * PLACEHOLDER DATA: replace names, credentials, enrolment numbers and bios with
 * the firm's real team before launch. Article `author` fields reference `slug`.
 */

export type Person = {
  slug: string;
  name: string;
  title: string;
  /** Practice slugs this person leads/contributes to. */
  practices: string[];
  /** Topics for schema knowsAbout + on-page focus list. */
  focus: string[];
  education: string[];
  enrolment: string;
  bio: string;
};

export const people: Person[] = [
  {
    slug: "brill-legal",
    name: "Brill Legal",
    title: "Editorial team",
    practices: [],
    focus: ["Indian law", "legal explainers"],
    education: [],
    enrolment: "",
    bio: "Guides published under the firm's editorial review.",
  },
  {
    slug: "a-deshpande",
    name: "A. Deshpande",
    title: "Partner — Disputes",
    practices: ["dispute-resolution", "white-collar", "arbitration"],
    focus: [
      "Civil and commercial litigation",
      "Criminal defence and bail",
      "Arbitration",
    ],
    education: ["LL.B.", "LL.M."],
    enrolment: "Enrolled with the Bar Council of Maharashtra & Goa",
    bio: "Advises and represents clients in civil, criminal and commercial disputes before trial courts, the High Court and tribunals, with a focus on practical, procedure-led strategy.",
  },
  {
    slug: "s-iyer",
    name: "S. Iyer",
    title: "Partner — Corporate & Real Estate",
    practices: ["corporate", "real-estate", "tribunal"],
    focus: [
      "Company formation and commercial contracts",
      "RERA and property",
      "Regulatory compliance",
    ],
    education: ["B.A. LL.B.", "Company Secretary (qualified)"],
    enrolment: "Enrolled with the Bar Council of Maharashtra & Goa",
    bio: "Works with founders and companies on incorporation, contracts, compliance and property matters, with particular depth in Maharashtra RERA and corporate regulatory work.",
  },
  {
    slug: "r-khan",
    name: "R. Khan",
    title: "Partner — Private Client & Family",
    practices: ["private-client"],
    focus: [
      "Divorce, custody and maintenance",
      "Wills, probate and succession",
      "Estate planning",
    ],
    education: ["LL.B."],
    enrolment: "Enrolled with the Bar Council of Maharashtra & Goa",
    bio: "Advises individuals and families on matrimonial, custody and succession matters, with an emphasis on clear, confidential and practical counsel.",
  },
];

export const personBySlug = (slug: string) =>
  people.find((p) => p.slug === slug);

/** Author shown on a byline; falls back to the editorial profile. */
export const authorOf = (slug: string) =>
  personBySlug(slug) ?? people[0];
