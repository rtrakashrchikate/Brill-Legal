/**
 * The seven practice areas. Each article declares its `practice` slug, and the
 * loader groups clusters under their pillar(s) per area. `matterType` feeds the
 * contact form's pre-selected enquiry category (per-page contact context).
 */

export type Practice = {
  slug: string;
  name: string;
  short: string;
  /** One-line capability statement (capability-led, no outcome promises). */
  summary: string;
  /** Longer intro shown on the practice page. */
  intro: string;
  /** Pre-selected value for the contact form on this practice's pages. */
  matterType: string;
  /** Representative capabilities (framed as capability, not results). */
  capabilities: string[];
};

export const practices: Practice[] = [
  {
    slug: "dispute-resolution",
    name: "Dispute Resolution & Litigation",
    short: "Litigation",
    summary:
      "Civil and criminal litigation across trial courts, High Courts and the Supreme Court.",
    intro:
      "We advise and represent clients in civil and criminal disputes — from money recovery suits and injunctions to bail, FIR quashing and writ petitions. Our approach is measured: we assess the merits honestly, map the procedural route, and pursue the remedy that fits the matter.",
    matterType: "Dispute Resolution / Litigation",
    capabilities: [
      "Civil suits, recovery and injunctions",
      "Criminal defence and bail",
      "Writ petitions and public interest litigation",
      "Cheque dishonour and defamation matters",
    ],
  },
  {
    slug: "white-collar",
    name: "White-Collar Crime & Investigations",
    short: "White-Collar",
    summary:
      "Defence and advisory in economic offences, regulatory enforcement and internal investigations.",
    intro:
      "We act in white-collar and economic-offence matters — PMLA and ED proceedings, EOW and SFIO investigations, bank fraud and SEBI enforcement — and advise companies on internal investigations. The work is sensitive and fact-heavy; we focus on procedure, documentation and protecting clients' rights.",
    matterType: "White-Collar Crime / Investigations",
    capabilities: [
      "PMLA / Enforcement Directorate proceedings",
      "EOW, SFIO and bank-fraud matters",
      "SEBI enforcement and insider-trading inquiries",
      "Corporate internal investigations",
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate & Construction",
    short: "Real Estate",
    summary:
      "RERA, property transactions, title due diligence and society redevelopment.",
    intro:
      "We help homebuyers, owners and developers with RERA complaints, property purchases, title verification, redevelopment and society disputes. Maharashtra-specific practice — MahaRERA, stamp duty and registration — sits at the core of this team's work.",
    matterType: "Real Estate / RERA",
    capabilities: [
      "MahaRERA complaints and refunds",
      "Property purchase and title due diligence",
      "Society redevelopment and cooperative disputes",
      "Stamp duty, registration and conveyancing",
    ],
  },
  {
    slug: "private-client",
    name: "Private Client & Family",
    short: "Family",
    summary:
      "Divorce, custody, maintenance, wills, succession and estate planning.",
    intro:
      "We advise individuals and families on divorce and custody, maintenance, domestic-violence remedies, wills, probate, succession and estate planning. These matters are personal; we keep counsel clear, practical and confidential.",
    matterType: "Private Client / Family",
    capabilities: [
      "Mutual-consent and contested divorce",
      "Child custody, alimony and maintenance",
      "Wills, probate and succession",
      "Estate planning and private trusts",
    ],
  },
  {
    slug: "arbitration",
    name: "Arbitration & ADR",
    short: "Arbitration",
    summary:
      "Domestic and international arbitration, mediation and conciliation.",
    intro:
      "We advise on arbitration clauses, conduct domestic and institutional arbitrations, seek interim relief, and act in challenge and enforcement proceedings — including foreign awards under the New York Convention. We also advise on mediation and conciliation as alternatives to court.",
    matterType: "Arbitration / ADR",
    capabilities: [
      "Arbitration clause drafting and strategy",
      "Section 9 interim relief and Section 34 challenges",
      "Enforcement of domestic and foreign awards",
      "Mediation and conciliation",
    ],
  },
  {
    slug: "corporate",
    name: "Corporate & Commercial",
    short: "Corporate",
    summary:
      "Company formation, commercial contracts, employment and regulatory compliance.",
    intro:
      "We help founders and companies incorporate, raise capital, contract well and stay compliant — from private-limited and LLP registration and founders' agreements to commercial contracts, ESOPs, DPDP and POSH compliance, employment and trademarks.",
    matterType: "Corporate / Commercial",
    capabilities: [
      "Company and LLP incorporation",
      "Commercial contracts and NDAs",
      "Founders', shareholders' and ESOP arrangements",
      "DPDP, POSH and employment compliance",
    ],
  },
  {
    slug: "tribunal",
    name: "Tribunal & Regulatory",
    short: "Tribunal",
    summary:
      "Representation before NCLT, NCLAT, DRT, consumer fora and specialised tribunals.",
    intro:
      "We act before India's specialised tribunals and regulatory fora — NCLT and IBC insolvency, DRT and SARFAESI, consumer commissions, GSTAT, NGT, CAT and motor-accident claims tribunals — and advise on where a dispute properly belongs.",
    matterType: "Tribunal / Regulatory",
    capabilities: [
      "NCLT and IBC insolvency proceedings",
      "DRT, SARFAESI and debt recovery",
      "Consumer complaints and appeals",
      "GSTAT, NGT, CAT and MACT matters",
    ],
  },
];

export const practiceBySlug = (slug: string) =>
  practices.find((p) => p.slug === slug);

export const practiceMap: Record<string, Practice> = Object.fromEntries(
  practices.map((p) => [p.slug, p]),
);
