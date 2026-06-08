/**
 * Resources / guides — linkable lead-magnet assets (checklists, templates).
 * These are the honest backlink earners. `items` describe what each download
 * contains; the email-capture is optional and routes to the contact flow.
 */

export type Resource = {
  slug: string;
  title: string;
  description: string;
  practice: string;
  /** Bullet contents of the checklist/template. */
  items: string[];
  relatedArticle?: string;
};

export const resources: Resource[] = [
  {
    slug: "property-due-diligence-checklist",
    title: "Property Due-Diligence Checklist",
    description:
      "A practical checklist of documents and searches to run before buying property in India — title chain, encumbrances, approvals and registration.",
    practice: "real-estate",
    relatedArticle: "property-title-due-diligence",
    items: [
      "30-year title chain and mother deed",
      "Encumbrance certificate and search report",
      "Approved building plans and occupancy/commencement certificates",
      "RERA registration and project status (where applicable)",
      "Society documents, share certificate and NOC",
      "Property tax receipts and utility dues",
      "Correct stamp duty computation and registration plan",
    ],
  },
  {
    slug: "startup-legal-checklist",
    title: "Startup Legal Checklist",
    description:
      "The legal foundations every Indian startup should put in place — entity, founders' terms, contracts and core compliance.",
    practice: "corporate",
    relatedArticle: "starting-business-india-guide",
    items: [
      "Choice of entity (Private Limited / LLP / OPC)",
      "Founders' agreement and vesting",
      "Shareholders'/investment documents",
      "Standard customer and vendor contracts",
      "Employment agreements and offer letters",
      "IP assignment and trademark filing",
      "DPDP and POSH compliance basics",
    ],
  },
  {
    slug: "rera-complaint-checklist",
    title: "RERA Complaint Checklist",
    description:
      "What homebuyers need to prepare before filing a MahaRERA complaint over delay, refund or defects.",
    practice: "real-estate",
    relatedArticle: "file-rera-complaint-maharashtra",
    items: [
      "Agreement for sale and allotment letter",
      "Payment receipts and ledger",
      "Project RERA registration number",
      "Correspondence on possession/delay",
      "Computation of interest or refund claimed",
      "Reliefs sought and supporting documents",
    ],
  },
  {
    slug: "will-drafting-checklist",
    title: "Will-Drafting Checklist",
    description:
      "The essentials of a valid will in India — what to include so your wishes are clear and enforceable.",
    practice: "private-client",
    relatedArticle: "valid-will-india",
    items: [
      "Full details of the testator and sound-mind declaration",
      "Clear identification of all assets",
      "Named beneficiaries and their shares",
      "Appointment of an executor",
      "Two attesting witnesses (not beneficiaries)",
      "Date, signature and (optional) registration",
    ],
  },
  {
    slug: "commercial-contract-checklist",
    title: "Commercial Contract Checklist",
    description:
      "Key clauses to review in any commercial contract before you sign.",
    practice: "corporate",
    relatedArticle: "essential-contract-clauses",
    items: [
      "Clear scope, deliverables and timelines",
      "Payment terms and taxes",
      "Confidentiality and IP ownership",
      "Limitation of liability and indemnity",
      "Term, termination and consequences",
      "Governing law and dispute-resolution clause",
    ],
  },
];

export const resourceBySlug = (slug: string) =>
  resources.find((r) => r.slug === slug);
