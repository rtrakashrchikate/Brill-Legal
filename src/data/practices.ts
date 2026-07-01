/**
 * The seven practice areas. Each article declares its `practice` slug, and the
 * loader groups clusters under their pillar(s) per area. `matterType` feeds the
 * contact form's pre-selected enquiry category (per-page contact context).
 */

/**
 * A sub-practice (service line) within a practice area. Each renders as its own
 * landing page at /practices/<practice>/<slug> — a rankable page for a specific
 * service keyword, interlinked to the guides that support it.
 */
export type SubPractice = {
  slug: string;
  name: string;
  /** One-line capability statement for cards (capability-led, no promises). */
  summary: string;
  /** Longer intro shown on the sub-practice page. */
  intro: string;
  /** Representative capabilities within this service line. */
  capabilities: string[];
  /** Article slugs that support this service line. */
  articles: string[];
  /** Page-level FAQs (feed FAQ schema). */
  faqs: { q: string; a: string }[];
};

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
  /** Service lines within this area — each a dedicated landing page. */
  subPractices: SubPractice[];
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
    subPractices: [
      {
        slug: "civil-litigation",
        name: "Civil Litigation",
        summary:
          "Suits, recovery, injunctions and appeals before the civil courts and High Court.",
        intro:
          "We advise and represent clients in civil disputes — money recovery, specific performance, declaration and injunction suits, and appeals. We assess the merits candidly, choose the right forum by valuation and cause of action, and pursue interim protection where a matter cannot wait for final judgment.",
        capabilities: [
          "Suits for recovery, declaration and specific performance",
          "Temporary and permanent injunctions",
          "Summary suits under Order XXXVII CPC",
          "First appeals, second appeals and revisions",
        ],
        articles: [
          "civil-litigation-india-guide",
          "file-civil-suit-india",
          "injunction-stay-order-india",
          "money-recovery-suit-india",
          "summary-suit-order-37",
        ],
        faqs: [
          {
            q: "How do I choose the right civil court for my suit?",
            a: "The court is fixed by pecuniary jurisdiction (the value of the claim) and territorial jurisdiction (where the defendant resides or the cause of action arose). We assess both before filing so the suit is not returned at the threshold.",
          },
          {
            q: "Can I get urgent relief before the suit is decided?",
            a: "Yes. A temporary injunction can restrain the other side from acting while the suit is pending, on the three-part test of prima facie case, balance of convenience and irreparable harm. Urgent matters can be moved ex-parte.",
          },
        ],
      },
      {
        slug: "criminal-defence",
        name: "Criminal Defence",
        summary:
          "FIR response, bail, quashing and trial representation before the criminal courts.",
        intro:
          "We defend individuals from the first information stage through bail and trial — advising on anticipatory and regular bail, FIR quashing under Section 528 BNSS, and representation at trial. The work is time-sensitive; early, well-prepared steps often shape the whole matter.",
        capabilities: [
          "Anticipatory and regular bail applications",
          "FIR quashing under Section 528 BNSS",
          "Response to summons and notices under the BNSS",
          "Trial defence and revisions",
        ],
        articles: [
          "criminal-defence-india-guide",
          "anticipatory-bail-india-guide",
          "bail-vs-anticipatory-bail",
          "quash-fir-india",
          "rights-on-arrest-india",
        ],
        faqs: [
          {
            q: "An FIR has been registered against me — what should I do first?",
            a: "Take advice before responding. Depending on the offence we may move for anticipatory bail, consider quashing the FIR, and prepare your response to any notice. Acting early, before a coercive step, gives the strongest position.",
          },
          {
            q: "What is the difference between anticipatory and regular bail?",
            a: "Anticipatory bail is protection obtained before arrest, where you apprehend it; regular bail is sought after arrest or on appearance. We advise which applies to your stage and prepare the application accordingly.",
          },
        ],
      },
      {
        slug: "cheque-bounce-recovery",
        name: "Cheque Bounce & Debt Recovery",
        summary:
          "Section 138 complaints and civil recovery for dishonoured cheques and unpaid debts.",
        intro:
          "We act for payees pursuing recovery and for persons facing complaints under Section 138 of the Negotiable Instruments Act — from the statutory demand notice and its strict timelines through complaint and trial — and run parallel civil recovery, including summary suits, where that fits.",
        capabilities: [
          "Section 138 demand notices and complaints",
          "Defence to cheque dishonour complaints",
          "Summary suits and money recovery",
          "Attachment before judgment and execution",
        ],
        articles: [
          "cheque-bounce-section-138-ni-act",
          "money-recovery-suit-india",
          "summary-suit-order-37",
        ],
        faqs: [
          {
            q: "What are the deadlines in a cheque bounce case?",
            a: "A demand notice must be sent within 30 days of the bank's return memo; the drawer then has 15 days to pay; and the complaint must be filed within a month of the cause of action arising. We track these dates closely.",
          },
          {
            q: "Can I pursue recovery as well as the criminal complaint?",
            a: "Yes. A Section 138 complaint is criminal; a civil recovery — often a summary suit — can run alongside it to enforce the debt directly. We advise on the best combination for your facts.",
          },
        ],
      },
      {
        slug: "writ-constitutional",
        name: "Writ & Constitutional",
        summary:
          "Writ petitions and constitutional remedies before the High Court and Supreme Court.",
        intro:
          "We advise on and pursue writ remedies — challenging arbitrary state action, enforcing rights, and seeking directions against public authorities — under Article 226 before the High Court and Article 32 before the Supreme Court in appropriate cases.",
        capabilities: [
          "Writ petitions under Article 226 and Article 32",
          "Challenges to arbitrary or illegal state action",
          "Service, licensing and regulatory grievances",
          "Public interest litigation in suitable matters",
        ],
        articles: ["civil-litigation-india-guide"],
        faqs: [
          {
            q: "When is a writ petition the right remedy?",
            a: "Where a public authority has acted illegally, arbitrarily or beyond its powers, or has failed to perform a public duty, a writ may lie. We assess whether a writ or an alternative statutory remedy fits your matter.",
          },
        ],
      },
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
    subPractices: [
      {
        slug: "pmla-ed-defence",
        name: "PMLA & ED Defence",
        summary:
          "Defence in money-laundering proceedings and Enforcement Directorate investigations.",
        intro:
          "We act in matters under the Prevention of Money Laundering Act — responding to summons, attachment of property and arrest under the Act, and representation before the Adjudicating Authority and Appellate Tribunal. The threshold for relief is high and the procedure exacting; we focus on documentation and protecting rights at every step.",
        capabilities: [
          "Response to ED summons under Section 50 PMLA",
          "Challenges to provisional attachment of property",
          "Bail in PMLA matters",
          "Representation before the Adjudicating Authority and PMLA Appellate Tribunal",
        ],
        articles: ["white-collar-crime-india-guide"],
        faqs: [
          {
            q: "I have received an ED summons under Section 50 — what does it mean?",
            a: "A Section 50 summons requires you to appear and give evidence or produce documents. Attendance is compulsory and statements are recorded on oath. Take advice before appearing so you understand your position and rights.",
          },
        ],
      },
      {
        slug: "economic-offences",
        name: "Economic Offences (EOW / SFIO / CBI)",
        summary:
          "Defence and advisory in bank fraud, EOW, SFIO and CBI investigations.",
        intro:
          "We advise and represent clients in economic-offence investigations by the Economic Offences Wing, the Serious Fraud Investigation Office and the CBI — bank fraud, cheating, criminal breach of trust and corporate fraud — with a focus on the facts, the paper trail and procedural safeguards.",
        capabilities: [
          "EOW and CBI investigation defence",
          "SFIO investigations under the Companies Act",
          "Bank-fraud and cheating allegations",
          "Anticipatory bail and quashing in economic offences",
        ],
        articles: [
          "white-collar-crime-india-guide",
          "anticipatory-bail-india-guide",
          "quash-fir-india",
        ],
        faqs: [
          {
            q: "How is a white-collar matter different from an ordinary criminal case?",
            a: "Economic offences are document-heavy, often involve multiple agencies, and courts apply a higher threshold for bail. Early forensic review of the paper trail and a disciplined, procedure-led defence matter more than in ordinary matters.",
          },
        ],
      },
      {
        slug: "sebi-securities",
        name: "SEBI & Securities Enforcement",
        summary:
          "Representation in SEBI enforcement, insider-trading and market-conduct inquiries.",
        intro:
          "We advise on SEBI show-cause notices, insider-trading and market-manipulation inquiries, and represent clients in adjudication and before the Securities Appellate Tribunal, alongside advice on disclosure and compliance to reduce exposure.",
        capabilities: [
          "Response to SEBI show-cause notices",
          "Insider-trading and market-manipulation inquiries",
          "Settlement (consent) applications",
          "Appeals before the Securities Appellate Tribunal",
        ],
        articles: ["white-collar-crime-india-guide"],
        faqs: [
          {
            q: "Can a SEBI proceeding be settled?",
            a: "SEBI's settlement mechanism allows certain proceedings to be resolved through a consent application without admission or denial, in appropriate cases. We advise on whether settlement or contest is the better course.",
          },
        ],
      },
      {
        slug: "internal-investigations",
        name: "Corporate Internal Investigations",
        summary:
          "Confidential internal investigations into fraud, misconduct and whistleblower complaints.",
        intro:
          "We conduct and advise on internal investigations for companies — fraud, financial irregularity, POSH and whistleblower complaints — with a structured, privileged process, findings that withstand scrutiny, and practical remediation advice.",
        capabilities: [
          "Fraud and financial-irregularity investigations",
          "Whistleblower and misconduct inquiries",
          "Privileged investigation process and reporting",
          "Remediation and regulatory-disclosure advice",
        ],
        articles: ["white-collar-crime-india-guide"],
        faqs: [
          {
            q: "Why run an internal investigation before regulators get involved?",
            a: "A well-run internal investigation lets a company understand its exposure, preserve privilege where possible, act on findings, and decide on disclosure from an informed position rather than reacting to an external inquiry.",
          },
        ],
      },
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
    subPractices: [
      {
        slug: "rera-homebuyer-disputes",
        name: "RERA & Homebuyer Disputes",
        summary:
          "MahaRERA complaints for delayed possession, refunds and project defaults.",
        intro:
          "We act for homebuyers before MahaRERA and the Maharashtra Real Estate Appellate Tribunal — delayed possession, refund with interest, carpet-area shortfalls and project defaults — preparing and arguing complaints and pursuing enforcement of orders.",
        capabilities: [
          "Delayed-possession and refund complaints",
          "Interest for delay under Section 18",
          "Carpet-area and specification disputes",
          "Appeals before MREAT and order enforcement",
        ],
        articles: [
          "rera-maharashtra-guide",
          "file-rera-complaint-maharashtra",
          "builder-delay-possession-rera",
          "rera-refund-rules",
        ],
        faqs: [
          {
            q: "My builder has delayed possession — what can I claim?",
            a: "Under Section 18 you may seek a refund with interest, or continue with the project and claim interest for the period of delay, at your option. We advise which remedy fits and prepare the MahaRERA complaint.",
          },
        ],
      },
      {
        slug: "property-transactions",
        name: "Property Transactions & Due Diligence",
        summary:
          "Title verification, document vetting and conveyancing for buyers and sellers.",
        intro:
          "We run structured title due diligence, vet documents, and advise buyers, sellers and societies on conveyancing — from the title chain and encumbrances to approvals, stamp duty and registration — so a transaction closes cleanly.",
        capabilities: [
          "Title search and due diligence",
          "Sale deed and agreement drafting and vetting",
          "Encumbrance, approval and RERA checks",
          "Registration and post-completion steps",
        ],
        articles: [
          "buying-property-india-checklist",
          "property-title-due-diligence",
          "stamp-duty-maharashtra",
        ],
        faqs: [
          {
            q: "What should I check before buying a property?",
            a: "Title chain, encumbrances, approved plans, RERA and society status, and correct stamp duty and registration. We run a structured due-diligence checklist before you commit.",
          },
        ],
      },
      {
        slug: "society-redevelopment",
        name: "Society Redevelopment",
        summary:
          "Advice for cooperative housing societies and members on redevelopment.",
        intro:
          "We advise cooperative housing societies and members on redevelopment — the development agreement and its key clauses, consent thresholds, corpus and transit rent, carpet-area guarantees and members' rights — under Maharashtra's cooperative and development-control framework.",
        capabilities: [
          "Development agreement review and negotiation",
          "Consent thresholds and member rights",
          "Corpus fund, transit rent and area guarantees",
          "Society and cooperative disputes",
        ],
        articles: ["society-redevelopment-guide", "property-title-due-diligence"],
        faqs: [
          {
            q: "What consent is needed for a society redevelopment?",
            a: "Maharashtra's framework prescribes consent thresholds of society members for redevelopment decisions, with procedural safeguards. We advise the committee and members on the process and on the development agreement terms.",
          },
        ],
      },
      {
        slug: "conveyancing-registration",
        name: "Conveyancing & Registration",
        summary:
          "Stamp duty, deed drafting and registration before the Sub-Registrar.",
        intro:
          "We handle conveyancing end to end — computing stamp duty on the higher of consideration or ready-reckoner value, drafting and executing the deed, and completing registration before the Sub-Registrar of Assurances — for sales, gifts, leases and other instruments.",
        capabilities: [
          "Stamp duty computation and e-payment",
          "Sale, gift and lease deed drafting",
          "Registration before the Sub-Registrar",
          "Adjudication of under-stamped documents",
        ],
        articles: ["stamp-duty-maharashtra", "buying-property-india-checklist"],
        faqs: [
          {
            q: "Is stamp duty charged on the price or the government value?",
            a: "On the higher of the two — the agreement value or the ready-reckoner value for the locality. We compute the correct duty and handle e-payment and registration.",
          },
        ],
      },
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
    subPractices: [
      {
        slug: "divorce-matrimonial",
        name: "Divorce & Matrimonial",
        summary:
          "Mutual-consent and contested divorce, judicial separation and matrimonial disputes.",
        intro:
          "We advise on mutual-consent and contested divorce, judicial separation and related matrimonial matters — settling terms in advance where consent is mutual, and representing clients firmly and discreetly where a matter is contested.",
        capabilities: [
          "Mutual-consent divorce and settlement terms",
          "Contested divorce and judicial separation",
          "Cooling-off period waiver applications",
          "NRI and cross-border matrimonial matters",
        ],
        articles: ["divorce-india-guide", "mutual-consent-divorce-india"],
        faqs: [
          {
            q: "How long does a mutual-consent divorce take?",
            a: "It involves two motions with a statutory gap that the court may waive in suitable cases. With a waiver, matters can conclude within weeks; without one, the minimum is six months from the first motion.",
          },
        ],
      },
      {
        slug: "custody-maintenance",
        name: "Child Custody & Maintenance",
        summary:
          "Custody, visitation, alimony and maintenance under the welfare-of-the-child principle.",
        intro:
          "We advise on custody and visitation, and on interim and permanent maintenance and alimony — under the paramount principle of the child's welfare, and across the statutory routes for maintenance available to spouses and children.",
        capabilities: [
          "Physical, legal and interim custody",
          "Visitation and access arrangements",
          "Interim and permanent maintenance",
          "Enforcement and variation of orders",
        ],
        articles: ["child-custody-india", "alimony-maintenance-india"],
        faqs: [
          {
            q: "What governs a custody decision?",
            a: "The welfare and best interests of the child override every other consideration — including the parents' arrangements. Courts weigh stability, attachment, each parent's circumstances and, for older children, the child's own wishes.",
          },
        ],
      },
      {
        slug: "wills-succession",
        name: "Wills, Probate & Succession",
        summary:
          "Will drafting, probate, letters of administration and succession disputes.",
        intro:
          "We draft wills, obtain probate and letters of administration, and advise on intestate succession and succession disputes — helping families provide for orderly transfer and resolve disagreements over an estate.",
        capabilities: [
          "Will drafting and execution",
          "Probate and letters of administration",
          "Succession certificates",
          "Intestate succession and estate disputes",
        ],
        articles: [],
        faqs: [
          {
            q: "Is probate always required to act on a will?",
            a: "Not always — the requirement depends on the type of property, the location and the community. We advise whether probate, letters of administration or a succession certificate is needed for your matter.",
          },
        ],
      },
      {
        slug: "estate-planning",
        name: "Estate Planning & Trusts",
        summary:
          "Private trusts, family arrangements and succession planning for individuals and families.",
        intro:
          "We advise individuals and families on estate planning — private trusts, family settlements and structured succession — to provide for the next generation, protect vulnerable beneficiaries and reduce the risk of future disputes.",
        capabilities: [
          "Private and family trusts",
          "Family settlements and arrangements",
          "Succession and legacy planning",
          "Guardianship and provision for dependants",
        ],
        articles: [],
        faqs: [
          {
            q: "When should I consider a private trust?",
            a: "Where you want to provide for beneficiaries over time, protect a vulnerable dependant, or hold family assets in an orderly structure. We advise on whether a trust or a will-based plan fits your circumstances.",
          },
        ],
      },
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
    subPractices: [
      {
        slug: "domestic-arbitration",
        name: "Domestic Arbitration",
        summary:
          "Conduct of ad hoc and institutional domestic arbitrations for commercial parties.",
        intro:
          "We advise on and conduct domestic arbitrations — from the Section 21 notice and constitution of the tribunal through the hearing and award — with clause and strategy advice at the outset to keep the process efficient.",
        capabilities: [
          "Commencement and tribunal constitution",
          "Conduct of ad hoc and institutional arbitrations",
          "Arbitration clause drafting and strategy",
          "Award-stage advice",
        ],
        articles: [
          "arbitration-india-beginners-guide",
          "arbitration-clause-drafting",
        ],
        faqs: [
          {
            q: "How does an arbitration begin?",
            a: "Ordinarily with a written notice under Section 21 invoking the arbitration clause, followed by constitution of the tribunal. We advise on the notice, appointment and early strategy.",
          },
        ],
      },
      {
        slug: "international-arbitration",
        name: "International & Institutional Arbitration",
        summary:
          "Cross-border and institutional arbitration, including seat and rules strategy.",
        intro:
          "We advise on international commercial arbitration and institutional arbitration — seat, rules, language and tribunal choices — and act in proceedings governed by institutional rules, coordinating on cross-border enforcement.",
        capabilities: [
          "Seat, rules and language strategy",
          "Institutional arbitration proceedings",
          "Cross-border dispute coordination",
          "New York Convention enforcement planning",
        ],
        articles: [
          "arbitration-clause-drafting",
          "enforcement-arbitral-award-india",
        ],
        faqs: [
          {
            q: "Why does the seat of arbitration matter?",
            a: "The seat determines the supervising courts and the law governing the arbitration, and affects enforceability. A clear seat clause avoids costly disputes later; we advise on the right choice for your contract.",
          },
        ],
      },
      {
        slug: "interim-relief-enforcement",
        name: "Interim Relief & Enforcement",
        summary:
          "Section 9 interim measures, Section 34 challenges and award enforcement.",
        intro:
          "We seek interim relief under Section 9 to preserve assets and the status quo, defend and bring Section 34 challenges within their strict limits, and enforce domestic and foreign awards — treating the award as a decree and pursuing execution.",
        capabilities: [
          "Section 9 interim measures",
          "Section 34 set-aside challenges",
          "Domestic award execution",
          "Foreign award enforcement under the New York Convention",
        ],
        articles: [
          "section-9-arbitration-interim-relief",
          "enforcement-arbitral-award-india",
        ],
        faqs: [
          {
            q: "Can I protect assets before the tribunal is even constituted?",
            a: "Yes. A Section 9 application to the court can seek interim measures — including attachment and injunctions — before or during the arbitration, and even after the award until it is enforced.",
          },
        ],
      },
      {
        slug: "mediation-conciliation",
        name: "Mediation & Conciliation",
        summary:
          "Structured settlement of disputes through mediation and conciliation.",
        intro:
          "We advise on and represent clients in mediation and conciliation — structured, without-prejudice processes that can resolve disputes faster and more privately than court or arbitration, and that increasingly sit as a first tier in dispute-resolution clauses.",
        capabilities: [
          "Pre-litigation and court-referred mediation",
          "Conciliation under the Arbitration and Conciliation Act",
          "Tiered dispute-resolution clause advice",
          "Settlement drafting and recording",
        ],
        articles: ["arbitration-india-beginners-guide"],
        faqs: [
          {
            q: "Is a mediated settlement binding?",
            a: "A settlement reached and recorded in a court-referred or statutory mediation, or a conciliation settlement under the Act, carries the status the law gives it — often that of a decree or an award. We advise on the process and draft the terms.",
          },
        ],
      },
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
    subPractices: [
      {
        slug: "incorporation-startups",
        name: "Company Incorporation & Startups",
        summary:
          "Private limited, LLP and OPC incorporation and early-stage advice for founders.",
        intro:
          "We help founders choose the right structure and incorporate — private limited, LLP or OPC — through the SPICe+ process, and advise on the founding documents and early compliance so a business starts on a sound footing.",
        capabilities: [
          "Entity choice and SPICe+ incorporation",
          "MoA, AoA and founding documents",
          "Post-incorporation registrations and compliance",
          "Startup structuring advice",
        ],
        articles: ["starting-business-india-guide", "pvt-ltd-registration-india"],
        faqs: [
          {
            q: "Should I register a private limited company or an LLP?",
            a: "A private limited company suits businesses raising external capital or issuing equity; an LLP suits professional or partner-run businesses wanting flexibility. We advise on the right fit for your plans.",
          },
        ],
      },
      {
        slug: "commercial-contracts",
        name: "Commercial Contracts",
        summary:
          "Drafting, review and negotiation of commercial contracts and NDAs.",
        intro:
          "We draft, review and negotiate commercial contracts — services and supply agreements, NDAs, vendor and customer paper — focusing on the clauses that carry real risk: scope, payment, IP, liability, indemnity and dispute resolution.",
        capabilities: [
          "Services, supply and distribution agreements",
          "NDAs and confidentiality arrangements",
          "IP assignment and licensing terms",
          "Liability, indemnity and dispute-resolution clauses",
        ],
        articles: ["commercial-contracts-guide"],
        faqs: [
          {
            q: "Who owns the IP created under a services contract?",
            a: "By default the contractor, not the client — unless there is an express written assignment. We make sure IP ownership is dealt with clearly so there is no dispute later.",
          },
        ],
      },
      {
        slug: "founders-shareholders",
        name: "Founders & Shareholders",
        summary:
          "Founders' and shareholders' agreements, ESOPs and investment documentation.",
        intro:
          "We advise founders and investors on founders' and shareholders' agreements, ESOP structures and investment documentation — vesting, transfer restrictions, tag- and drag-along, governance and exit — aligning the agreement with the company's articles.",
        capabilities: [
          "Founders' and shareholders' agreements",
          "Vesting and transfer restrictions",
          "ESOP structuring",
          "Investment and governance terms",
        ],
        articles: ["shareholders-agreement-india", "starting-business-india-guide"],
        faqs: [
          {
            q: "When should co-founders sign an agreement?",
            a: "As early as possible — ideally at incorporation. Vesting, roles, IP assignment and what happens when a founder leaves are far easier to settle while the relationship is good than in a later dispute.",
          },
        ],
      },
      {
        slug: "regulatory-compliance",
        name: "Regulatory & Employment Compliance",
        summary:
          "DPDP, POSH, employment and ongoing corporate compliance.",
        intro:
          "We provide practical compliance advice — data protection under the DPDP framework, POSH policies and committees, employment documentation and ongoing corporate compliance — with checklists and policies scaled to the size of the business.",
        capabilities: [
          "DPDP data-protection compliance",
          "POSH policies and committees",
          "Employment contracts and policies",
          "Ongoing corporate and annual compliance",
        ],
        articles: ["starting-business-india-guide", "commercial-contracts-guide"],
        faqs: [
          {
            q: "Does my company need DPDP and POSH compliance?",
            a: "Most do once they handle personal data or cross the employee thresholds for POSH. We provide practical, right-sized policies and checklists rather than boilerplate.",
          },
        ],
      },
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
    subPractices: [
      {
        slug: "nclt-insolvency",
        name: "NCLT & Insolvency (IBC)",
        summary:
          "Company-law matters and insolvency proceedings before the NCLT and NCLAT.",
        intro:
          "We act before the National Company Law Tribunal and NCLAT — corporate insolvency under the IBC, oppression and mismanagement, and other company-law matters — advising creditors, debtors and companies on strategy and representation.",
        capabilities: [
          "Corporate insolvency resolution under the IBC",
          "Operational and financial creditor claims",
          "Oppression and mismanagement petitions",
          "Appeals before the NCLAT",
        ],
        articles: ["court-vs-tribunal-india"],
        faqs: [
          {
            q: "Can an unpaid supplier start insolvency proceedings?",
            a: "An operational creditor can initiate corporate insolvency under the IBC subject to the threshold and procedure, beginning with a demand notice. We advise on whether the route is available and effective for your claim.",
          },
        ],
      },
      {
        slug: "drt-sarfaesi",
        name: "DRT & SARFAESI",
        summary:
          "Debt recovery and secured-asset enforcement before the DRT and DRAT.",
        intro:
          "We advise borrowers, guarantors and lenders in proceedings before the Debts Recovery Tribunal and under the SARFAESI Act — recovery applications, secured-asset enforcement, and challenges to measures under Section 13 — and appeals to the DRAT.",
        capabilities: [
          "Recovery applications before the DRT",
          "SARFAESI enforcement and Section 13 measures",
          "Securitisation applications under Section 17",
          "Appeals before the DRAT",
        ],
        articles: ["court-vs-tribunal-india", "money-recovery-suit-india"],
        faqs: [
          {
            q: "Can I challenge a bank's SARFAESI action?",
            a: "A borrower or affected person can challenge measures taken under Section 13 of the SARFAESI Act by a securitisation application under Section 17 before the DRT, within the prescribed period. We advise on the grounds and timing.",
          },
        ],
      },
      {
        slug: "consumer-disputes",
        name: "Consumer Disputes",
        summary:
          "Consumer complaints and appeals before the District, State and National Commissions.",
        intro:
          "We advise and represent consumers before the consumer commissions under the Consumer Protection Act 2019 — defective goods, deficient services and unfair trade practices — from choosing the right forum and filing on e-Daakhil through hearings and appeals.",
        capabilities: [
          "Complaints for defective goods and deficient service",
          "Forum selection and e-Daakhil filing",
          "Builder, insurance and e-commerce complaints",
          "Appeals to the State and National Commissions",
        ],
        articles: ["consumer-complaint-india", "consumer-protection-act-2019"],
        faqs: [
          {
            q: "Which consumer commission do I approach?",
            a: "It depends on the value of the goods or services and the compensation claimed — District, State or National Commission. We assess the right forum and can file online through the e-Daakhil portal.",
          },
        ],
      },
      {
        slug: "regulatory-tribunals",
        name: "Environmental & Regulatory Tribunals",
        summary:
          "Representation before the NGT, CAT, GSTAT and motor-accident claims tribunals.",
        intro:
          "We advise on and appear before specialised tribunals and fora — the National Green Tribunal, Central Administrative Tribunal, GST Appellate Tribunal and Motor Accident Claims Tribunal — and advise on where a dispute properly belongs.",
        capabilities: [
          "National Green Tribunal (environmental) matters",
          "Central Administrative Tribunal (service) matters",
          "GST Appellate Tribunal proceedings",
          "Motor Accident Claims Tribunal claims",
        ],
        articles: ["court-vs-tribunal-india"],
        faqs: [
          {
            q: "How do I know whether my matter goes to a court or a tribunal?",
            a: "Many disputes are assigned by statute to a specialised tribunal rather than the ordinary courts. We advise on the correct forum at the outset so time is not lost before the wrong body.",
          },
        ],
      },
    ],
  },
];

export const subPracticeBySlug = (
  practiceSlug: string,
  subSlug: string,
): { practice: Practice; sub: SubPractice } | undefined => {
  const practice = practices.find((p) => p.slug === practiceSlug);
  const sub = practice?.subPractices.find((s) => s.slug === subSlug);
  if (!practice || !sub) return undefined;
  return { practice, sub };
};

export const practiceBySlug = (slug: string) =>
  practices.find((p) => p.slug === slug);

export const practiceMap: Record<string, Practice> = Object.fromEntries(
  practices.map((p) => [p.slug, p]),
);
