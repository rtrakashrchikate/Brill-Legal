/**
 * Location / city pages — legitimate service-in-location SEO.
 *
 * IMPORTANT (anti-spam + compliance): these are NOT fake office pages. Each
 * page speaks to *serving clients in* that city via consults + a counsel
 * network, and routes contact to the real Pune office. Every page must carry
 * genuinely UNIQUE copy (local courts/forums named, local process notes) —
 * templated layout is fine, templated TEXT is a penalty. The unique copy lives
 * in `localContext`, `courts` and `faqs` below; never duplicate across cities.
 */

export type LocationPage = {
  slug: string; // e.g. "criminal-lawyer-in-pune"
  service: string; // human label, e.g. "Criminal"
  city: "Pune" | "Mumbai";
  practice: string; // practice slug
  /** Article slugs to link to from this page. */
  articles: string[];
  title: string;
  metaDescription: string;
  /** Unique local copy — distinct per page. */
  localContext: string;
  /** Local courts / forums named for this service + city. */
  courts: string[];
  faqs: { q: string; a: string }[];
};

export const locations: LocationPage[] = [
  // ---------------- PUNE (priority — real base) ----------------
  {
    slug: "criminal-lawyer-in-pune",
    service: "Criminal",
    city: "Pune",
    practice: "dispute-resolution",
    articles: ["criminal-defence-india-guide", "anticipatory-bail-india-guide", "rights-on-arrest-india"],
    title: "Criminal Lawyer in Pune | Brill Legal",
    metaDescription:
      "Criminal defence for clients in Pune — bail, FIR quashing, trial representation. Brill Legal appears before Pune's criminal courts. Talk to us.",
    localContext:
      "Criminal matters in Pune are heard across the Sessions Court at Shivajinagar, the Magistrate courts, and — for bail and quashing — the Bombay High Court. We advise clients in and around Pune from the first information stage through bail and trial, coordinating with local counsel where a personal appearance is required.",
    courts: [
      "District & Sessions Court, Pune (Shivajinagar)",
      "Metropolitan Magistrate courts, Pune",
      "Bombay High Court (for bail, quashing and revisions)",
    ],
    faqs: [
      {
        q: "Where are criminal cases heard in Pune?",
        a: "Depending on the offence, matters are filed before the Magistrate or Sessions Court in Pune; bail and FIR-quashing applications often go to the Bombay High Court. We advise on the correct forum for your matter.",
      },
      {
        q: "Can you help if an FIR has been registered against me in Pune?",
        a: "Yes. We can advise on anticipatory bail, the possibility of quashing the FIR under Section 528 BNSS, and how to respond to summons or notices.",
      },
      {
        q: "Do I need to come to your office in person?",
        a: "Not necessarily. We offer phone, video and WhatsApp consultations, and meet in person where the matter requires it.",
      },
    ],
  },
  {
    slug: "anticipatory-bail-lawyer-in-pune",
    service: "Anticipatory Bail",
    city: "Pune",
    practice: "dispute-resolution",
    articles: ["anticipatory-bail-india-guide", "bail-vs-anticipatory-bail", "rights-on-arrest-india"],
    title: "Anticipatory Bail Lawyer in Pune | Brill Legal",
    metaDescription:
      "Apprehending arrest in Pune? Brill Legal advises on anticipatory bail before the Sessions Court and Bombay High Court. Talk to us today.",
    localContext:
      "An anticipatory bail application in Pune is ordinarily moved before the Sessions Court at Shivajinagar, and before the Bombay High Court where the Sessions Court declines or the matter warrants it. Timing matters — we help assess the risk and prepare the application promptly.",
    courts: [
      "District & Sessions Court, Pune",
      "Bombay High Court",
    ],
    faqs: [
      {
        q: "Which court grants anticipatory bail in Pune?",
        a: "Applications are usually filed before the Sessions Court in Pune; if declined, the Bombay High Court may be approached. The forum depends on the offence and stage.",
      },
      {
        q: "How quickly should I apply?",
        a: "As soon as you reasonably apprehend arrest. Early advice lets us prepare the grounds and supporting documents before any coercive step is taken.",
      },
      {
        q: "Can anticipatory bail be filed without an FIR?",
        a: "It can be considered where there is a reasonable apprehension of arrest, even before an FIR is formally registered. We assess this case by case.",
      },
    ],
  },
  {
    slug: "cheque-bounce-lawyer-in-pune",
    service: "Cheque Bounce",
    city: "Pune",
    practice: "dispute-resolution",
    articles: ["cheque-bounce-section-138-ni-act", "money-recovery-suit-india", "summary-suit-order-37"],
    title: "Cheque Bounce Lawyer in Pune | Brill Legal",
    metaDescription:
      "Cheque dishonour under Section 138 NI Act in Pune — notices, complaints and recovery. Brill Legal acts for payees and accused. Talk to us.",
    localContext:
      "Section 138 complaints in Pune are filed before the Magistrate courts having jurisdiction where the cheque was presented. We act for both payees pursuing recovery and persons facing complaints, beginning with the statutory demand notice and its strict timelines.",
    courts: [
      "Metropolitan Magistrate courts, Pune",
      "Sessions Court, Pune (appeals/revisions)",
    ],
    faqs: [
      {
        q: "Where do I file a cheque bounce case in Pune?",
        a: "Before the Magistrate court with jurisdiction over the place where the cheque was presented to the drawer's bank. We confirm the correct court for your facts.",
      },
      {
        q: "What is the time limit?",
        a: "A demand notice must be sent within 30 days of the bank's return memo, and the complaint filed within the period prescribed after the notice. We track these deadlines closely.",
      },
      {
        q: "Can I recover the money as well as pursue the case?",
        a: "Section 138 is a criminal complaint; a parallel civil recovery (including a summary suit) may also be available. We advise on the best combination.",
      },
    ],
  },
  {
    slug: "divorce-lawyer-in-pune",
    service: "Divorce",
    city: "Pune",
    practice: "private-client",
    articles: ["divorce-india-guide", "mutual-consent-divorce-india", "child-custody-india"],
    title: "Divorce Lawyer in Pune | Brill Legal",
    metaDescription:
      "Divorce, custody and maintenance for clients in Pune — mutual-consent and contested. Brill Legal advises before the Family Court, Pune. Talk to us.",
    localContext:
      "Matrimonial matters in Pune are heard by the Family Court at Pune. We advise on mutual-consent and contested divorce, custody and maintenance, and handle the procedure with discretion — many steps can be progressed without repeated court visits.",
    courts: ["Family Court, Pune"],
    faqs: [
      {
        q: "Which court handles divorce in Pune?",
        a: "The Family Court at Pune hears divorce, custody and maintenance matters for the district. We advise on jurisdiction based on where the parties last resided together.",
      },
      {
        q: "How long does a mutual-consent divorce take in Pune?",
        a: "It involves two motions with a statutory gap that the court may, in suitable cases, waive. Timelines vary with the court's calendar; we set realistic expectations.",
      },
      {
        q: "Can NRIs file for divorce in Pune?",
        a: "Yes, subject to jurisdiction. We regularly advise NRI clients on cross-border matrimonial issues and representation through a power of attorney where permitted.",
      },
    ],
  },
  {
    slug: "property-lawyer-in-pune",
    service: "Property",
    city: "Pune",
    practice: "real-estate",
    articles: ["buying-property-india-checklist", "property-title-due-diligence", "stamp-duty-maharashtra"],
    title: "Property Lawyer in Pune | Brill Legal",
    metaDescription:
      "Property purchase, title due diligence and registration in Pune. Brill Legal advises buyers, owners and societies. Talk to us about your property.",
    localContext:
      "Property transactions in Pune involve title verification, stamp duty and registration before the Sub-Registrar of Assurances, and — for disputes — the civil courts. We carry out due diligence, vet documents and advise on conveyancing for buyers, sellers and housing societies in Pune and PCMC.",
    courts: [
      "Sub-Registrar of Assurances, Pune",
      "Civil Court, Pune (title and possession disputes)",
    ],
    faqs: [
      {
        q: "What should I check before buying property in Pune?",
        a: "Title chain, encumbrances, approved plans and society/RERA status, plus correct stamp duty and registration. We run a structured due-diligence checklist.",
      },
      {
        q: "Where is property registered in Pune?",
        a: "At the office of the Sub-Registrar of Assurances having jurisdiction over the property's location. We handle document preparation and the registration process.",
      },
      {
        q: "Can you help with a property dispute in Pune?",
        a: "Yes — from title and possession disputes to society and redevelopment issues, before the civil courts and relevant forums.",
      },
    ],
  },
  {
    slug: "rera-lawyer-in-pune",
    service: "RERA",
    city: "Pune",
    practice: "real-estate",
    articles: ["rera-maharashtra-guide", "file-rera-complaint-maharashtra", "builder-delay-possession-rera"],
    title: "RERA Lawyer in Pune | Brill Legal",
    metaDescription:
      "MahaRERA complaints for Pune homebuyers — delayed possession, refunds, defects. Brill Legal files and argues before MahaRERA. Talk to us.",
    localContext:
      "MahaRERA complaints for Pune projects are filed online and heard by the Authority and its benches, with appeals to the Maharashtra Real Estate Appellate Tribunal. We act for Pune homebuyers facing delayed possession, refund claims and project defaults.",
    courts: [
      "MahaRERA (Maharashtra Real Estate Regulatory Authority)",
      "Maharashtra Real Estate Appellate Tribunal",
    ],
    faqs: [
      {
        q: "Where do Pune homebuyers file a RERA complaint?",
        a: "Before MahaRERA, which covers projects across Maharashtra including Pune. Complaints are filed online; we prepare and argue them.",
      },
      {
        q: "Can I get a refund for a delayed Pune project?",
        a: "Where a builder fails to hand over possession on time, the law provides for refund with interest or interest for the delay, at the buyer's option. We advise on which remedy fits.",
      },
      {
        q: "Is there an appeal from MahaRERA?",
        a: "Yes, to the Maharashtra Real Estate Appellate Tribunal within the prescribed period. We handle appeals on both sides.",
      },
    ],
  },
  {
    slug: "civil-lawyer-in-pune",
    service: "Civil",
    city: "Pune",
    practice: "dispute-resolution",
    articles: ["civil-litigation-india-guide", "file-civil-suit-india", "injunction-stay-order-india"],
    title: "Civil Lawyer in Pune | Brill Legal",
    metaDescription:
      "Civil litigation in Pune — suits, recovery, injunctions and appeals before the Pune civil courts. Brill Legal advises and represents. Talk to us.",
    localContext:
      "Civil disputes in Pune are filed before the Civil Judge (Junior/Senior Division) depending on valuation, with appeals to the District Court and the Bombay High Court. We handle suits for recovery, declaration, injunction and specific performance for clients in Pune.",
    courts: [
      "Civil Court (Junior & Senior Division), Pune",
      "District Court, Pune",
      "Bombay High Court",
    ],
    faqs: [
      {
        q: "Which civil court do I approach in Pune?",
        a: "It depends on the value and nature of the claim — the Junior or Senior Division civil court. We assess valuation and jurisdiction before filing.",
      },
      {
        q: "Can I get an urgent stay or injunction?",
        a: "Yes, interim injunctions and stay orders can be sought at the outset of a suit in appropriate cases. We advise on the threshold the court applies.",
      },
      {
        q: "How long do civil suits take in Pune?",
        a: "Timelines vary widely with the court's docket and the nature of the dispute. We give a realistic assessment and consider faster routes like summary suits where available.",
      },
    ],
  },
  {
    slug: "corporate-lawyer-in-pune",
    service: "Corporate",
    city: "Pune",
    practice: "corporate",
    articles: ["starting-business-india-guide", "pvt-ltd-registration-india", "commercial-contracts-guide"],
    title: "Corporate Lawyer in Pune | Brill Legal",
    metaDescription:
      "Company formation, contracts and compliance for Pune startups and businesses. Brill Legal advises founders and companies. Talk to us.",
    localContext:
      "We advise Pune's startups and established businesses — from Hinjewadi and Kharadi tech firms to manufacturing in PCMC — on incorporation, founders' and shareholders' agreements, commercial contracts, ESOPs and DPDP/POSH compliance.",
    courts: [
      "Registrar of Companies, Pune (incorporations/filings)",
      "NCLT Mumbai bench (company matters)",
    ],
    faqs: [
      {
        q: "Can you help register a company in Pune?",
        a: "Yes — private limited, LLP or OPC. We advise on the right structure and handle incorporation and the founding documents.",
      },
      {
        q: "Do Pune startups need DPDP and POSH compliance?",
        a: "Most do once they handle personal data or cross employee thresholds. We provide practical compliance checklists and policies.",
      },
      {
        q: "Can you review our commercial contracts remotely?",
        a: "Yes. Contract drafting and review are handled efficiently over email and call; we meet in person where useful.",
      },
    ],
  },
  {
    slug: "arbitration-lawyer-in-pune",
    service: "Arbitration",
    city: "Pune",
    practice: "arbitration",
    articles: ["arbitration-india-beginners-guide", "arbitration-clause-drafting", "section-9-arbitration-interim-relief"],
    title: "Arbitration Lawyer in Pune | Brill Legal",
    metaDescription:
      "Arbitration and ADR for Pune businesses — clauses, interim relief, awards and enforcement. Brill Legal advises and represents. Talk to us.",
    localContext:
      "We advise Pune businesses on arbitration clauses, conduct arbitrations, and seek interim relief under Section 9 and award-related reliefs before the Bombay High Court and Pune commercial courts. We also act in enforcement of domestic and foreign awards.",
    courts: [
      "Commercial Court, Pune",
      "Bombay High Court (Section 9, 34 and enforcement)",
    ],
    faqs: [
      {
        q: "Can interim relief be sought from a Pune court in arbitration?",
        a: "Yes — Section 9 applications for interim measures can be made to the appropriate court, including before the arbitral tribunal is constituted.",
      },
      {
        q: "Do you draft arbitration clauses for Pune contracts?",
        a: "Yes. A well-drafted clause — seat, rules, number of arbitrators, language — avoids costly disputes later. We tailor it to the contract.",
      },
      {
        q: "Can a foreign award be enforced from Pune?",
        a: "Foreign awards from New York Convention countries are enforceable in India subject to the Act. We advise on the process and likely defences.",
      },
    ],
  },
  {
    slug: "consumer-complaint-lawyer-in-pune",
    service: "Consumer Complaint",
    city: "Pune",
    practice: "tribunal",
    articles: ["consumer-complaint-india", "consumer-protection-act-2019", "court-vs-tribunal-india"],
    title: "Consumer Complaint Lawyer in Pune | Brill Legal",
    metaDescription:
      "File a consumer complaint in Pune — defective goods, deficient services, refunds. Brill Legal advises before the District Consumer Commission. Talk to us.",
    localContext:
      "Consumer disputes in Pune are filed before the District Consumer Disputes Redressal Commission, Pune, with appeals to the State Commission in Mumbai. We help Pune consumers with complaints over defective products, deficient services and unfair trade practices.",
    courts: [
      "District Consumer Disputes Redressal Commission, Pune",
      "Maharashtra State Consumer Commission (appeals)",
    ],
    faqs: [
      {
        q: "Where do I file a consumer complaint in Pune?",
        a: "Before the District Consumer Commission in Pune, depending on the claim value; higher-value claims go to the State or National Commission.",
      },
      {
        q: "Can I file a consumer complaint online?",
        a: "Yes, the e-Daakhil portal allows online filing. We can prepare and file the complaint and represent you at hearings.",
      },
      {
        q: "What can I claim?",
        a: "Refund, replacement, compensation for loss and, in suitable cases, costs. We advise on realistic reliefs for your facts.",
      },
    ],
  },

  // ---------------- MUMBAI (Phase-2 city) ----------------
  {
    slug: "criminal-lawyer-in-mumbai",
    service: "Criminal",
    city: "Mumbai",
    practice: "dispute-resolution",
    articles: ["criminal-defence-india-guide", "anticipatory-bail-india-guide", "quash-fir-india"],
    title: "Criminal Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "Criminal defence for clients in Mumbai — bail, FIR quashing and trial. Brill Legal appears before Mumbai's criminal courts and the Bombay High Court.",
    localContext:
      "Criminal matters in Mumbai are heard across the Sessions Court at Kala Ghoda, the Metropolitan Magistrate courts, and the Bombay High Court for bail, quashing and revisions. We advise clients facing investigation, arrest or trial in Mumbai.",
    courts: [
      "City Civil & Sessions Court, Mumbai (Kala Ghoda)",
      "Metropolitan Magistrate courts, Mumbai",
      "Bombay High Court",
    ],
    faqs: [
      {
        q: "Where are criminal cases heard in Mumbai?",
        a: "At the Magistrate or Sessions Court depending on the offence, with bail and quashing often before the Bombay High Court. We advise on the right forum.",
      },
      {
        q: "Can you act on an FIR registered in Mumbai?",
        a: "Yes — we advise on anticipatory bail, quashing under Section 528 BNSS and responding to summons.",
      },
      {
        q: "Are remote consultations available?",
        a: "Yes. We consult by phone, video and WhatsApp and coordinate appearances with counsel in Mumbai.",
      },
    ],
  },
  {
    slug: "anticipatory-bail-lawyer-in-mumbai",
    service: "Anticipatory Bail",
    city: "Mumbai",
    practice: "dispute-resolution",
    articles: ["anticipatory-bail-india-guide", "bail-vs-anticipatory-bail", "rights-on-arrest-india"],
    title: "Anticipatory Bail Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "Apprehending arrest in Mumbai? Brill Legal advises on anticipatory bail before the Sessions Court and Bombay High Court. Talk to us today.",
    localContext:
      "Anticipatory bail in Mumbai is moved before the City Sessions Court and the Bombay High Court. Given the pace of investigations in the city, early, well-prepared applications matter — we move quickly on the grounds and documents.",
    courts: ["City Civil & Sessions Court, Mumbai", "Bombay High Court"],
    faqs: [
      {
        q: "Which court grants anticipatory bail in Mumbai?",
        a: "The Sessions Court at Mumbai, and the Bombay High Court if declined or where warranted by the offence and stage.",
      },
      {
        q: "How soon should I act?",
        a: "As soon as arrest is reasonably apprehended. Early instructions allow a stronger application.",
      },
      {
        q: "Can it be filed before an FIR?",
        a: "It may be considered where there is a reasonable apprehension of arrest. We assess each matter on its facts.",
      },
    ],
  },
  {
    slug: "rera-lawyer-in-mumbai",
    service: "RERA",
    city: "Mumbai",
    practice: "real-estate",
    articles: ["rera-maharashtra-guide", "file-rera-complaint-maharashtra", "rera-refund-rules"],
    title: "RERA Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "MahaRERA complaints for Mumbai homebuyers — delayed possession, refunds and defects. Brill Legal files and argues before MahaRERA. Talk to us.",
    localContext:
      "MahaRERA is headquartered in Mumbai and hears complaints for projects across the MMR. We act for Mumbai homebuyers on delayed possession, refunds and carpet-area disputes, with appeals to the Maharashtra Real Estate Appellate Tribunal.",
    courts: [
      "MahaRERA, Mumbai",
      "Maharashtra Real Estate Appellate Tribunal",
    ],
    faqs: [
      {
        q: "Where do Mumbai homebuyers file RERA complaints?",
        a: "Before MahaRERA, with its principal bench in Mumbai. Complaints are filed online and we argue them on your behalf.",
      },
      {
        q: "What remedies are available for a delayed Mumbai project?",
        a: "Refund with interest, or interest for the period of delay if you wish to continue — at the buyer's option, subject to the facts.",
      },
      {
        q: "Can carpet-area shortfalls be claimed?",
        a: "Yes, RERA defines carpet area and provides remedies for shortfalls. We advise on quantification and procedure.",
      },
    ],
  },
  {
    slug: "property-lawyer-in-mumbai",
    service: "Property",
    city: "Mumbai",
    practice: "real-estate",
    articles: ["buying-property-india-checklist", "property-title-due-diligence", "society-redevelopment-guide"],
    title: "Property Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "Property purchase, title due diligence and society redevelopment in Mumbai. Brill Legal advises buyers, owners and societies. Talk to us.",
    localContext:
      "Mumbai property work is document- and society-heavy — title due diligence, stamp duty and registration, and especially redevelopment of cooperative housing societies. We advise buyers, owners and society committees across the city.",
    courts: [
      "Sub-Registrar of Assurances, Mumbai",
      "Bombay High Court / City Civil Court (property disputes)",
    ],
    faqs: [
      {
        q: "What is special about buying property in Mumbai?",
        a: "Most flats are in cooperative societies, so society records, share certificates and approvals matter alongside title. We check all of it.",
      },
      {
        q: "Can you advise on a society redevelopment in Mumbai?",
        a: "Yes — from development agreements to member rights and the regulatory framework governing redevelopment.",
      },
      {
        q: "How is stamp duty calculated in Mumbai?",
        a: "On the agreement value or ready-reckoner value, whichever is higher, with applicable surcharges. We compute it for your transaction.",
      },
    ],
  },
  {
    slug: "divorce-lawyer-in-mumbai",
    service: "Divorce",
    city: "Mumbai",
    practice: "private-client",
    articles: ["divorce-india-guide", "mutual-consent-divorce-india", "alimony-maintenance-india"],
    title: "Divorce Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "Divorce, custody and maintenance for clients in Mumbai — mutual-consent and contested. Brill Legal advises before the Family Court, Mumbai.",
    localContext:
      "Matrimonial matters in Mumbai are heard by the Family Court at Bandra. We advise on mutual-consent and contested divorce, custody and maintenance, handling proceedings with discretion and, for NRIs, through appropriate representation.",
    courts: ["Family Court, Mumbai (Bandra)"],
    faqs: [
      {
        q: "Which court handles divorce in Mumbai?",
        a: "The Family Court at Bandra, subject to jurisdiction based on where the parties last resided together or where the marriage took place.",
      },
      {
        q: "How long does mutual-consent divorce take in Mumbai?",
        a: "Two motions with a statutory gap that may be waived in suitable cases; actual timelines depend on the court's calendar.",
      },
      {
        q: "Do you handle NRI divorce from Mumbai?",
        a: "Yes, including cross-border jurisdiction issues and representation through a power of attorney where permitted.",
      },
    ],
  },
  {
    slug: "arbitration-lawyer-in-mumbai",
    service: "Arbitration",
    city: "Mumbai",
    practice: "arbitration",
    articles: ["arbitration-india-beginners-guide", "section-9-arbitration-interim-relief", "enforcement-arbitral-award-india"],
    title: "Arbitration Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "Arbitration and ADR for Mumbai businesses — clauses, interim relief, challenges and enforcement. Brill Legal advises and represents. Talk to us.",
    localContext:
      "Mumbai is a hub for commercial arbitration, including institutional arbitration. We advise on clauses and strategy, seek interim relief under Section 9, and act in Section 34 challenges and enforcement before the Bombay High Court.",
    courts: [
      "Bombay High Court (Section 9, 34 and enforcement)",
      "Mumbai Centre for International Arbitration (institutional)",
    ],
    faqs: [
      {
        q: "Is institutional arbitration available in Mumbai?",
        a: "Yes — Mumbai hosts established arbitral institutions. We advise on whether institutional or ad hoc arbitration suits your contract.",
      },
      {
        q: "Where are Section 9 and 34 applications filed?",
        a: "Typically before the Bombay High Court for Mumbai-seated arbitrations. We assess the correct court for your matter.",
      },
      {
        q: "Can you enforce an award in Mumbai?",
        a: "Yes — domestic and foreign awards, subject to the Act and available defences. We advise on the enforcement route.",
      },
    ],
  },
  {
    slug: "corporate-lawyer-in-mumbai",
    service: "Corporate",
    city: "Mumbai",
    practice: "corporate",
    articles: ["starting-business-india-guide", "commercial-contracts-guide", "shareholders-agreement-india"],
    title: "Corporate Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "Company formation, contracts, fundraising and compliance for Mumbai businesses. Brill Legal advises founders and companies. Talk to us.",
    localContext:
      "We advise Mumbai businesses — from BKC and Lower Parel corporates to startups — on incorporation, shareholders' and founders' agreements, commercial contracts, fundraising documentation and DPDP/POSH compliance. Company matters go to the NCLT Mumbai bench.",
    courts: [
      "Registrar of Companies, Mumbai",
      "NCLT, Mumbai bench",
    ],
    faqs: [
      {
        q: "Can you help incorporate a company in Mumbai?",
        a: "Yes — private limited, LLP or OPC — with the right founding documents and post-incorporation compliance.",
      },
      {
        q: "Where are company disputes heard in Mumbai?",
        a: "Before the NCLT Mumbai bench for matters under the Companies Act and IBC. We advise and appear.",
      },
      {
        q: "Do you draft shareholders' agreements?",
        a: "Yes — covering rights, transfers, governance and exits, tailored to the company and investors.",
      },
    ],
  },
  {
    slug: "cheque-bounce-lawyer-in-mumbai",
    service: "Cheque Bounce",
    city: "Mumbai",
    practice: "dispute-resolution",
    articles: ["cheque-bounce-section-138-ni-act", "money-recovery-suit-india", "summary-suit-order-37"],
    title: "Cheque Bounce Lawyer in Mumbai | Brill Legal",
    metaDescription:
      "Cheque dishonour under Section 138 NI Act in Mumbai — notices, complaints and recovery. Brill Legal acts for payees and accused. Talk to us.",
    localContext:
      "Section 138 complaints in Mumbai are filed before the Metropolitan Magistrate courts with jurisdiction over the place of presentation. We act for payees and accused, beginning with the statutory demand notice and its strict 30-day timeline.",
    courts: [
      "Metropolitan Magistrate courts, Mumbai",
      "Sessions Court, Mumbai (appeals/revisions)",
    ],
    faqs: [
      {
        q: "Where do I file a cheque bounce case in Mumbai?",
        a: "Before the Magistrate court with jurisdiction over where the cheque was presented. We confirm the right court for your facts.",
      },
      {
        q: "What are the deadlines?",
        a: "A demand notice within 30 days of the return memo, then a complaint within the prescribed period after the notice. We track these closely.",
      },
      {
        q: "Can I also recover the amount civilly?",
        a: "Yes — a civil recovery, including a summary suit, may run alongside the Section 138 complaint. We advise on the best route.",
      },
    ],
  },
];

export const locationBySlug = (slug: string) =>
  locations.find((l) => l.slug === slug);
