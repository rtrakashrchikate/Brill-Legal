// Generates the canonical 90-article manifest + the content calendar.
// Output:
//   content/manifest.json   — consumed by content authors (the source list)
//   docs/content-calendar.md — the publish schedule handoff doc
//
// Publishing cadence (white-hat): launch with 12 pillars + 15 clusters
// (publishDate on/before today), then 8–12 articles/month thereafter. Future
// dates render as "scheduled" (noindex) until their day arrives.

import fs from "node:fs";
import path from "node:path";

const TODAY = "2026-06-06";

// [slug, title, type, keyword]
const data = {
  "dispute-resolution": [
    ["civil-litigation-india-guide", "Civil Litigation in India: A Complete Guide", "pillar", "civil litigation India"],
    ["file-civil-suit-india", "How to File a Civil Suit in India", "cluster", "how to file a civil suit"],
    ["money-recovery-suit-india", "Money Recovery Suits: Recovering Unpaid Dues", "cluster", "money recovery suit"],
    ["summary-suit-order-37", "Summary Suits under Order XXXVII Explained", "cluster", "summary suit"],
    ["injunction-stay-order-india", "Injunctions & Stay Orders: How They Work", "cluster", "injunction order"],
    ["criminal-defence-india-guide", "Criminal Defence in India: A Practical Guide", "pillar", "criminal lawyer India"],
    ["anticipatory-bail-india-guide", "Anticipatory Bail in India: A Practical Guide", "cluster", "anticipatory bail"],
    ["bail-vs-anticipatory-bail", "Regular Bail vs Anticipatory Bail", "cluster", "difference between bail and anticipatory bail"],
    ["quash-fir-india", "How to Quash an FIR (Section 528 BNSS)", "cluster", "how to quash FIR"],
    ["cheque-bounce-section-138-ni-act", "Cheque Bounce under Section 138: Your Options", "cluster", "cheque bounce case"],
    ["rights-on-arrest-india", "What to Do If You're Arrested: Your Rights", "cluster", "rights when arrested in India"],
    ["defamation-law-india", "Defamation Law in India: Civil & Criminal", "cluster", "defamation case India"],
    ["writ-petition-india", "Writ Petitions Explained: Types & When to File", "cluster", "writ petition"],
    ["file-pil-india", "How to File a PIL in India", "cluster", "how to file a PIL"],
  ],
  "white-collar": [
    ["white-collar-crime-india", "White-Collar Crime in India: An Overview", "pillar", "white collar crime India"],
    ["pmla-enforcement-directorate-explained", "Understanding the PMLA: When the ED Can Act", "cluster", "PMLA explained"],
    ["ed-summons-what-to-do", "ED Summons: What to Do If You Receive One", "cluster", "ED summons"],
    ["money-laundering-offence-india", "Money Laundering Offences Explained", "cluster", "money laundering law India"],
    ["economic-offences-wing-eow", "Economic Offences Wing (EOW): How It Works", "cluster", "EOW complaint"],
    ["prevention-of-corruption-act", "The Prevention of Corruption Act Explained", "cluster", "prevention of corruption act"],
    ["bank-fraud-law-india", "Bank Fraud & Cheating: Legal Provisions", "cluster", "bank fraud case"],
    ["corporate-internal-investigations-guide", "Corporate Internal Investigations: A Guide", "cluster", "internal investigation"],
    ["sfio-investigation", "SFIO Investigations under the Companies Act", "cluster", "SFIO investigation"],
    ["sebi-insider-trading-india", "SEBI Enforcement: Insider Trading & Fraud", "cluster", "insider trading SEBI"],
    ["pmla-attachment-property", "Attachment of Property under the PMLA", "cluster", "PMLA attachment of property"],
    ["bail-economic-offences", "Bail in Economic Offence Cases", "cluster", "bail in PMLA cases"],
  ],
  "real-estate": [
    ["rera-maharashtra-guide", "RERA in Maharashtra: A Complete Guide", "pillar", "MahaRERA"],
    ["file-rera-complaint-maharashtra", "How to File a RERA Complaint in Maharashtra", "cluster", "RERA complaint Maharashtra"],
    ["rera-carpet-area", "RERA Carpet Area Rules Explained", "cluster", "carpet area RERA"],
    ["builder-delay-possession-rera", "Builder Delay in Possession: Your RERA Remedies", "cluster", "builder delay possession"],
    ["rera-refund-rules", "RERA Refund Rules: Getting Your Money Back", "cluster", "RERA refund"],
    ["buying-property-india-checklist", "Buying Property in India: A Legal Checklist", "pillar", "property buying checklist"],
    ["property-title-due-diligence", "Property Title Due Diligence: What to Check", "cluster", "title verification property"],
    ["stamp-duty-maharashtra", "Stamp Duty & Registration in Maharashtra", "cluster", "stamp duty Maharashtra"],
    ["sale-deed-vs-agreement-to-sell", "Sale Deed vs Agreement to Sell", "cluster", "sale deed vs agreement to sell"],
    ["society-redevelopment-guide", "Redevelopment of Housing Societies: A Guide", "cluster", "society redevelopment"],
    ["cooperative-society-disputes", "Cooperative Society Disputes & Remedies", "cluster", "cooperative society dispute"],
    ["nri-property-disputes-india", "NRI Property Disputes in India", "cluster", "NRI property dispute"],
    ["power-of-attorney-property", "Power of Attorney for Property, Done Right", "cluster", "POA for property"],
    ["tenant-landlord-rights-maharashtra", "Tenant & Landlord Rights in Maharashtra", "cluster", "rent agreement law Maharashtra"],
  ],
  "private-client": [
    ["divorce-india-guide", "Divorce in India: Types, Process & Grounds", "pillar", "divorce process India"],
    ["mutual-consent-divorce-india", "Mutual Consent Divorce: Process & Timeline", "cluster", "mutual divorce"],
    ["contested-divorce-india", "Contested Divorce: Grounds & Procedure", "cluster", "contested divorce"],
    ["child-custody-india", "Child Custody Laws in India", "cluster", "child custody law India"],
    ["alimony-maintenance-india", "Alimony & Maintenance: How It's Decided", "cluster", "alimony India"],
    ["domestic-violence-act-india", "The Domestic Violence Act: Protections & Remedies", "cluster", "domestic violence case"],
    ["nri-divorce-india", "NRI Divorce: Cross-Border Issues", "cluster", "NRI divorce"],
    ["wills-succession-india-guide", "Wills & Succession in India: A Practical Guide", "pillar", "how to make a will India"],
    ["valid-will-india", "How to Make a Valid Will in India", "cluster", "valid will requirements"],
    ["probate-process-india", "Probate of a Will: Process Explained", "cluster", "probate process India"],
    ["hindu-succession-act", "The Hindu Succession Act: Who Inherits What", "cluster", "Hindu succession act"],
    ["succession-certificate-india", "Succession Certificate: When You Need One", "cluster", "succession certificate"],
    ["estate-planning-trusts-india", "Estate Planning & Private Trusts in India", "cluster", "estate planning India"],
    ["prenuptial-agreement-india", "Prenuptial Agreements in India: Are They Valid?", "cluster", "prenup India"],
  ],
  "arbitration": [
    ["arbitration-india-beginners-guide", "Arbitration in India: A Beginner's Guide", "pillar", "arbitration process India"],
    ["arbitration-clause-drafting", "Drafting an Arbitration Clause: Key Points", "cluster", "arbitration clause"],
    ["section-9-arbitration-interim-relief", "Section 9: Interim Relief in Arbitration", "cluster", "section 9 arbitration"],
    ["section-34-challenge-award", "Challenging an Arbitral Award (Section 34)", "cluster", "section 34 arbitration"],
    ["enforcement-arbitral-award-india", "Enforcement of Arbitral Awards in India", "cluster", "enforcement of arbitral award"],
    ["foreign-award-enforcement-india", "Enforcing Foreign Awards (New York Convention)", "cluster", "foreign award enforcement"],
    ["institutional-vs-ad-hoc-arbitration", "Institutional vs Ad Hoc Arbitration", "cluster", "institutional arbitration"],
    ["mediation-act-india", "Mediation in India: The Mediation Act 2023", "cluster", "mediation act 2023"],
    ["conciliation-india", "Conciliation as a Dispute-Resolution Tool", "cluster", "conciliation"],
    ["arbitration-vs-litigation", "Arbitration vs Litigation: Which to Choose", "cluster", "arbitration vs litigation"],
  ],
  "corporate": [
    ["starting-business-india-guide", "Starting a Business in India: A Legal Guide", "pillar", "how to start a company in India"],
    ["pvt-ltd-registration-india", "Private Limited Company Registration: Steps", "cluster", "company registration India"],
    ["llp-vs-private-limited", "LLP vs Private Limited: Which to Choose", "cluster", "LLP vs Pvt Ltd"],
    ["founders-agreement-india", "Founders' Agreement: What to Include", "cluster", "founders agreement"],
    ["esop-india-guide", "ESOPs in India: A Startup Guide", "cluster", "ESOP India"],
    ["commercial-contracts-guide", "Commercial Contracts: A Practical Guide", "pillar", "commercial contract drafting"],
    ["essential-contract-clauses", "Key Clauses Every Contract Should Have", "cluster", "important contract clauses"],
    ["nda-india-guide", "Non-Disclosure Agreements (NDA): A Guide", "cluster", "NDA India"],
    ["dpdp-act-2023-compliance-checklist", "The DPDP Act 2023: A Compliance Checklist", "cluster", "DPDP Act compliance"],
    ["posh-act-compliance-india", "POSH Act Compliance: What Companies Need", "cluster", "POSH compliance"],
    ["employment-contract-india", "Employment Contracts & Offer Letters", "cluster", "employment agreement India"],
    ["fdi-india-guide", "FDI in India: Routes & Approvals", "cluster", "FDI India"],
    ["shareholders-agreement-india", "Shareholders' Agreements Explained", "cluster", "shareholders agreement"],
    ["trademark-registration-india", "Trademark Registration in India: A Guide", "cluster", "trademark registration India"],
  ],
  "tribunal": [
    ["tribunals-india-guide", "Tribunals in India: A Complete Guide", "pillar", "tribunals in India"],
    ["court-vs-tribunal-india", "Court vs Tribunal: Where Your Dispute Belongs", "cluster", "court vs tribunal"],
    ["nclt-explained", "NCLT: Jurisdiction & Procedure", "cluster", "NCLT"],
    ["ibc-insolvency-guide", "Insolvency under the IBC: A Quick Guide", "cluster", "IBC insolvency"],
    ["consumer-complaint-india", "How to File a Consumer Complaint in India", "cluster", "consumer complaint"],
    ["consumer-protection-act-2019", "The Consumer Protection Act 2019: Key Changes", "cluster", "consumer protection act 2019"],
    ["gstat-gst-appellate-tribunal-explained", "GSTAT: India's GST Appellate Tribunal", "cluster", "GSTAT"],
    ["drt-sarfaesi-explained", "DRT & SARFAESI: Debt Recovery Explained", "cluster", "SARFAESI act"],
    ["ngt-explained", "The National Green Tribunal (NGT): How It Works", "cluster", "National Green Tribunal"],
    ["cat-service-matters", "CAT: The Central Administrative Tribunal", "cluster", "CAT tribunal"],
    ["mact-claim-india", "Motor Accident Claims (MACT): How to Claim", "cluster", "motor accident claim"],
    ["appeal-tribunal-order", "Appealing a Tribunal Order: Your Options", "cluster", "appeal against tribunal order"],
  ],
};

// Author assignment by practice.
const authorByPractice = {
  "dispute-resolution": "a-deshpande",
  "white-collar": "a-deshpande",
  "arbitration": "a-deshpande",
  "real-estate": "s-iyer",
  "corporate": "s-iyer",
  "tribunal": "s-iyer",
  "private-client": "r-khan",
};

// Build a flat list with practice attached.
const all = [];
for (const [practice, items] of Object.entries(data)) {
  for (const [slug, title, type, keyword] of items) {
    all.push({ slug, title, type, keyword, practice });
  }
}

// Related links: practice pillar(s) + nearest siblings (3 total, no self).
function relatedFor(article) {
  const sib = all.filter((a) => a.practice === article.practice && a.slug !== article.slug);
  const pillars = sib.filter((a) => a.type === "pillar");
  const others = sib.filter((a) => a.type !== "pillar");
  const picks = [];
  for (const p of pillars) if (picks.length < 3) picks.push(p.slug);
  for (const o of others) if (picks.length < 3) picks.push(o.slug);
  return picks.slice(0, 3);
}

// Publishing schedule.
// Launch published set: all 12 pillars + the first 2 clusters of each practice
// (+ a couple extra) so ~27 pieces are live on/before TODAY; the rest schedule
// forward across the following months.
function addDays(base, n) {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const pillars = all.filter((a) => a.type === "pillar");
const clusters = all.filter((a) => a.type === "cluster");

// launch clusters: first 2 per practice in listing order
const launchClusterSlugs = new Set();
for (const practice of Object.keys(data)) {
  const cl = clusters.filter((c) => c.practice === practice).slice(0, 2);
  cl.forEach((c) => launchClusterSlugs.add(c.slug));
}
// one extra to reach 15
launchClusterSlugs.add(clusters.find((c) => !launchClusterSlugs.has(c.slug)).slug);

const dateMap = {};
// pillars: 2026-01-05 .. weekly
pillars.forEach((p, i) => (dateMap[p.slug] = addDays("2026-01-05", i * 7)));
// launch clusters: 2026-03-21 .. every 5 days (stay <= TODAY)
[...launchClusterSlugs].forEach((slug, i) => (dateMap[slug] = addDays("2026-03-21", i * 5)));
// remaining clusters: schedule forward from 2026-06-16, ~ every 3 days (≈10/month)
const remaining = clusters.filter((c) => !launchClusterSlugs.has(c.slug));
remaining.forEach((c, i) => (dateMap[c.slug] = addDays("2026-06-16", i * 3)));

const manifest = all.map((a) => ({
  ...a,
  author: authorByPractice[a.practice],
  publishDate: dateMap[a.slug],
  related: relatedFor(a),
  published: dateMap[a.slug] <= TODAY,
}));

// Write manifest.
const root = process.cwd();
fs.mkdirSync(path.join(root, "content"), { recursive: true });
fs.writeFileSync(
  path.join(root, "content", "manifest.json"),
  JSON.stringify(manifest, null, 2),
);

// Write content calendar.
const byMonth = {};
for (const a of manifest) {
  const month = a.publishDate.slice(0, 7);
  (byMonth[month] ||= []).push(a);
}
let cal = `# Brill Legal — Content Calendar (90 Articles)\n\n`;
cal += `Generated by \`scripts/gen-manifest.mjs\`. Cadence: launch with 12 pillars + 15 clusters (live on/before ${TODAY}), then publish forward each month. Articles with a future date render as "scheduled" (noindex) until their day.\n\n`;
cal += `- **Total:** ${manifest.length} articles (${pillars.length} pillars, ${clusters.length} clusters)\n`;
cal += `- **Live at launch:** ${manifest.filter((a) => a.published).length}\n`;
cal += `- **Scheduled:** ${manifest.filter((a) => !a.published).length}\n\n`;
for (const month of Object.keys(byMonth).sort()) {
  const rows = byMonth[month].sort((a, b) => (a.publishDate < b.publishDate ? -1 : 1));
  cal += `## ${month}\n\n`;
  cal += `| Date | Status | Practice | Type | Title |\n|------|--------|----------|------|-------|\n`;
  for (const a of rows) {
    const status = a.published ? "Live" : "Scheduled";
    cal += `| ${a.publishDate} | ${status} | ${a.practice} | ${a.type} | ${a.title} |\n`;
  }
  cal += `\n`;
}
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(path.join(root, "docs", "content-calendar.md"), cal);

console.log(
  `Wrote manifest (${manifest.length} articles) and content calendar. Live: ${manifest.filter((a) => a.published).length}, scheduled: ${manifest.filter((a) => !a.published).length}.`,
);
