/**
 * Plain-English legal glossary — a long-tail traffic engine. Each term links to
 * the most relevant practice and/or article. Keep definitions short, accurate
 * and free of superlatives. Grow toward 40–60 terms over time.
 */

export type GlossaryTerm = {
  term: string;
  slug: string;
  definition: string;
  practice?: string;
  article?: string;
};

export const glossary: GlossaryTerm[] = [
  { term: "Anticipatory Bail", slug: "anticipatory-bail", definition: "An order granting bail in anticipation of arrest, so a person who fears arrest for a non-bailable offence can be released on conditions if arrested.", practice: "dispute-resolution", article: "anticipatory-bail-india-guide" },
  { term: "Bail", slug: "bail", definition: "The release of an accused person from custody, usually on conditions and security, pending investigation or trial.", practice: "dispute-resolution", article: "bail-vs-anticipatory-bail" },
  { term: "Affidavit", slug: "affidavit", definition: "A written statement of facts sworn or affirmed to be true, used as evidence in legal proceedings.", practice: "dispute-resolution" },
  { term: "Injunction", slug: "injunction", definition: "A court order requiring a party to do, or refrain from doing, a specific act; may be temporary (interim) or permanent.", practice: "dispute-resolution", article: "injunction-stay-order-india" },
  { term: "FIR", slug: "fir", definition: "First Information Report — the document recording information about a cognizable offence that sets the criminal process in motion.", practice: "dispute-resolution", article: "quash-fir-india" },
  { term: "Quashing", slug: "quashing", definition: "A High Court's power to set aside an FIR or proceedings, used where continuing them would be an abuse of process.", practice: "dispute-resolution", article: "quash-fir-india" },
  { term: "Writ Petition", slug: "writ-petition", definition: "A petition to a High Court or the Supreme Court seeking enforcement of fundamental or legal rights through writs such as habeas corpus or mandamus.", practice: "dispute-resolution", article: "writ-petition-india" },
  { term: "PIL", slug: "pil", definition: "Public Interest Litigation — a petition filed in the public interest, allowing courts to address issues affecting the community.", practice: "dispute-resolution", article: "file-pil-india" },
  { term: "Summary Suit", slug: "summary-suit", definition: "A fast-track civil suit under Order XXXVII for recovery of debts or liquidated demands, where the defendant must seek leave to defend.", practice: "dispute-resolution", article: "summary-suit-order-37" },
  { term: "Decree", slug: "decree", definition: "The formal expression of a court's adjudication that conclusively determines the rights of the parties in a suit.", practice: "dispute-resolution" },
  { term: "Cheque Bounce (Section 138)", slug: "cheque-bounce", definition: "The offence of dishonour of a cheque for insufficiency of funds under Section 138 of the Negotiable Instruments Act.", practice: "dispute-resolution", article: "cheque-bounce-section-138-ni-act" },
  { term: "Defamation", slug: "defamation", definition: "Harm to a person's reputation by a false statement; actionable as a civil wrong and, in defined circumstances, an offence.", practice: "dispute-resolution", article: "defamation-law-india" },

  { term: "PMLA", slug: "pmla", definition: "The Prevention of Money Laundering Act — the law under which the Enforcement Directorate investigates money laundering and can attach proceeds of crime.", practice: "white-collar", article: "pmla-enforcement-directorate-explained" },
  { term: "Enforcement Directorate (ED)", slug: "enforcement-directorate", definition: "The agency that enforces economic laws including the PMLA and FEMA, with powers to summon, investigate and attach property.", practice: "white-collar", article: "ed-summons-what-to-do" },
  { term: "Money Laundering", slug: "money-laundering", definition: "Concealing the origins of money obtained from crime by passing it through legitimate-looking transactions.", practice: "white-collar", article: "money-laundering-offence-india" },
  { term: "EOW", slug: "eow", definition: "Economic Offences Wing — a specialised police wing that investigates financial frauds and economic crimes.", practice: "white-collar", article: "economic-offences-wing-eow" },
  { term: "SFIO", slug: "sfio", definition: "Serious Fraud Investigation Office — investigates serious corporate frauds under the Companies Act.", practice: "white-collar", article: "sfio-investigation" },
  { term: "Insider Trading", slug: "insider-trading", definition: "Dealing in a company's securities using unpublished price-sensitive information, prohibited under SEBI regulations.", practice: "white-collar", article: "sebi-insider-trading-india" },
  { term: "Attachment of Property", slug: "attachment-of-property", definition: "A legal step by which property is seized or frozen — under the PMLA, the provisional attachment of suspected proceeds of crime.", practice: "white-collar", article: "pmla-attachment-property" },

  { term: "RERA", slug: "rera", definition: "The Real Estate (Regulation and Development) Act, which regulates real-estate projects and protects homebuyers; MahaRERA is its Maharashtra authority.", practice: "real-estate", article: "rera-maharashtra-guide" },
  { term: "Carpet Area", slug: "carpet-area", definition: "The net usable floor area within a flat's walls, as defined under RERA — the basis on which homes must be sold.", practice: "real-estate", article: "rera-carpet-area" },
  { term: "Title Due Diligence", slug: "title-due-diligence", definition: "The investigation of a property's ownership chain, encumbrances and approvals before purchase.", practice: "real-estate", article: "property-title-due-diligence" },
  { term: "Stamp Duty", slug: "stamp-duty", definition: "A state tax payable on certain instruments such as sale deeds and agreements; rates vary by state.", practice: "real-estate", article: "stamp-duty-maharashtra" },
  { term: "Sale Deed", slug: "sale-deed", definition: "The registered instrument that transfers ownership of immovable property from seller to buyer.", practice: "real-estate", article: "sale-deed-vs-agreement-to-sell" },
  { term: "Power of Attorney", slug: "power-of-attorney", definition: "A document authorising one person to act on another's behalf for specified purposes, such as property transactions.", practice: "real-estate", article: "power-of-attorney-property" },
  { term: "Redevelopment", slug: "redevelopment", definition: "Reconstruction of an ageing housing society building, usually through a developer, under an agreement with the members.", practice: "real-estate", article: "society-redevelopment-guide" },

  { term: "Mutual Consent Divorce", slug: "mutual-consent-divorce", definition: "Divorce where both spouses agree to separate and on terms such as maintenance and custody, granted after the statutory process.", practice: "private-client", article: "mutual-consent-divorce-india" },
  { term: "Alimony", slug: "alimony", definition: "Financial support paid by one spouse to the other after separation or divorce; may be one-time or periodic.", practice: "private-client", article: "alimony-maintenance-india" },
  { term: "Maintenance", slug: "maintenance", definition: "Financial support for a spouse, child or parent who cannot maintain themselves, ordered under family or criminal law.", practice: "private-client", article: "alimony-maintenance-india" },
  { term: "Custody", slug: "custody", definition: "The right to care for and make decisions about a child; courts decide custody on the child's welfare.", practice: "private-client", article: "child-custody-india" },
  { term: "Will", slug: "will", definition: "A legal declaration of how a person wishes their property to be distributed after death.", practice: "private-client", article: "valid-will-india" },
  { term: "Probate", slug: "probate", definition: "A court's certification that a will is valid and that the executor may administer the estate.", practice: "private-client", article: "probate-process-india" },
  { term: "Succession Certificate", slug: "succession-certificate", definition: "A certificate from a civil court authorising the holder to collect debts and securities of a deceased person who left no will.", practice: "private-client", article: "succession-certificate-india" },
  { term: "Intestate", slug: "intestate", definition: "Dying without a valid will, so that property passes according to the applicable succession law.", practice: "private-client", article: "hindu-succession-act" },

  { term: "Arbitration", slug: "arbitration", definition: "A private dispute-resolution process where parties refer their dispute to one or more arbitrators whose decision (the award) is binding.", practice: "arbitration", article: "arbitration-india-beginners-guide" },
  { term: "Arbitral Award", slug: "arbitral-award", definition: "The binding decision of an arbitral tribunal, enforceable like a court decree subject to limited challenge.", practice: "arbitration", article: "enforcement-arbitral-award-india" },
  { term: "Arbitration Clause", slug: "arbitration-clause", definition: "A contract clause by which parties agree to resolve future disputes by arbitration.", practice: "arbitration", article: "arbitration-clause-drafting" },
  { term: "Section 9 Relief", slug: "section-9-relief", definition: "Interim measures a court may grant in support of arbitration, such as preserving assets or evidence.", practice: "arbitration", article: "section-9-arbitration-interim-relief" },
  { term: "Mediation", slug: "mediation", definition: "A voluntary process where a neutral mediator helps parties reach their own settlement, now structured by the Mediation Act 2023.", practice: "arbitration", article: "mediation-act-india" },
  { term: "Conciliation", slug: "conciliation", definition: "A process where a conciliator actively suggests terms to help parties settle, leading to a settlement with the status of an award.", practice: "arbitration", article: "conciliation-india" },

  { term: "Private Limited Company", slug: "private-limited-company", definition: "A company with limited liability and restrictions on share transfer, the common structure for Indian startups.", practice: "corporate", article: "pvt-ltd-registration-india" },
  { term: "LLP", slug: "llp", definition: "Limited Liability Partnership — a hybrid structure combining partnership flexibility with limited liability.", practice: "corporate", article: "llp-vs-private-limited" },
  { term: "ESOP", slug: "esop", definition: "Employee Stock Option Plan — a scheme giving employees the right to acquire company shares, often used by startups.", practice: "corporate", article: "esop-india-guide" },
  { term: "NDA", slug: "nda", definition: "Non-Disclosure Agreement — a contract protecting confidential information shared between parties.", practice: "corporate", article: "nda-india-guide" },
  { term: "DPDP Act", slug: "dpdp-act", definition: "The Digital Personal Data Protection Act, 2023 — India's data-protection law governing the processing of personal data.", practice: "corporate", article: "dpdp-act-2023-compliance-checklist" },
  { term: "POSH Act", slug: "posh-act", definition: "The law on prevention of sexual harassment of women at the workplace, requiring committees and policies.", practice: "corporate", article: "posh-act-compliance-india" },
  { term: "Trademark", slug: "trademark", definition: "A sign — word, logo or mark — that distinguishes a business's goods or services and can be registered for protection.", practice: "corporate", article: "trademark-registration-india" },

  { term: "Tribunal", slug: "tribunal", definition: "A specialised adjudicatory body, outside the regular court system, set up to decide a particular class of disputes.", practice: "tribunal", article: "tribunals-india-guide" },
  { term: "NCLT", slug: "nclt", definition: "National Company Law Tribunal — adjudicates company-law matters and insolvency under the IBC.", practice: "tribunal", article: "nclt-explained" },
  { term: "IBC", slug: "ibc", definition: "Insolvency and Bankruptcy Code — the framework for resolving insolvency of companies and individuals.", practice: "tribunal", article: "ibc-insolvency-guide" },
  { term: "SARFAESI", slug: "sarfaesi", definition: "A law allowing banks to enforce security and recover dues without court intervention in defined cases.", practice: "tribunal", article: "drt-sarfaesi-explained" },
  { term: "Consumer Complaint", slug: "consumer-complaint", definition: "A complaint by a consumer over defective goods, deficient services or unfair trade practices, filed before a consumer commission.", practice: "tribunal", article: "consumer-complaint-india" },
  { term: "MACT", slug: "mact", definition: "Motor Accident Claims Tribunal — decides compensation claims arising from motor-vehicle accidents.", practice: "tribunal", article: "mact-claim-india" },
];

export const glossaryBySlug = (slug: string) =>
  glossary.find((g) => g.slug === slug);
