export interface KnowledgeChunk {
  id: string;
  topic: string;
  keywords: string[];
  title: string;
  sourceUrl: string;
  content: string;
}

export const APPROVED_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "kb-yield-guidance",
    topic: "Debenture Returns & Yield Guidance",
    keywords: ["yield", "return", "interest", "rate", "percent", "percentage", "earn", "profit", "annual", "p.a.", "coupon", "12%", "16%", "guaranteed"],
    title: "Indicative Yield Guidance (12%–16% p.a.)",
    sourceUrl: "/debt-debenture/",
    content:
      "Niventra's structured debenture products operate with indicative business yield guidance of 12%–16% per annum. This guidance is strictly subject to definitive product approval, underlying collateral security, and applicable statutory conditions under the Companies Act, 2013. Niventra does not promise guaranteed, assured, or risk-free returns. Past performance does not indicate future results.",
  },
  {
    id: "kb-debenture-structure",
    topic: "Non-Convertible Debentures (NCDs) & Security",
    keywords: ["debenture", "ncd", "security", "collateral", "charge", "chg-9", "trustee", "bond", "fixed income", "repayment"],
    title: "Secured NCD Structure & ROC Charge Creation",
    sourceUrl: "/debt-debenture/",
    content:
      "Niventra structures senior secured Non-Convertible Debentures (NCDs) under the Companies Act, 2013 framework. Debentures are backed by collateral charges created on identified real estate assets or project receivables and formally registered with the Registrar of Companies under Form CHG-9 in favor of an independent SEBI-registered Debenture Trustee.",
  },
  {
    id: "kb-due-diligence",
    topic: "5-Point Due Diligence Framework",
    keywords: ["due diligence", "audit", "vetting", "evaluation", "framework", "title", "rera", "technical", "financial", "risk"],
    title: "5-Point Independent Due Diligence Methodology",
    sourceUrl: "/due-diligence/",
    content:
      "Niventra subjects every real estate asset to five rigorous diligence pillars before capital facilitation: (1) Legal & 30-Year Title Search, (2) Financial & Forensic Cash-Flow Modeling, (3) Technical On-Site Engineering Audits, (4) Micro-Market Absorption Analysis, and (5) Security Structuring with minimum 1.5x–2.0x collateral coverage ratios.",
  },
  {
    id: "kb-real-estate-workflow",
    topic: "Real Estate Developer Funding Workflow",
    keywords: ["developer", "real estate", "funding", "seed", "journey", "apply", "commercial", "residential", "stages"],
    title: "7-Stage Project Evaluation Journey",
    sourceUrl: "/real-estate/",
    content:
      "Real estate developers seeking project capital undergo a 7-stage evaluation: (1) Initial Application & Screening, (2) KYC & Statutory Clearances, (3) Independent Legal Title Due Diligence, (4) Technical & Financial Feasibility Review, (5) Investment Committee Approval, (6) Definitive Term Sheet & ROC Charge Creation, and (7) Milestone-Linked Disbursement strictly tied to architect-certified construction progress.",
  },
  {
    id: "kb-corporate-directory",
    topic: "Corporate Office & Contact Channels",
    keywords: ["contact", "phone", "email", "address", "office", "gwalior", "delhi", "whatsapp", "toll free", "location"],
    title: "Official Corporate Directory",
    sourceUrl: "/contact/",
    content:
      "Corporate Office: Patel Nagar City Centre, Gwalior, Madhya Pradesh — 474001, India (with representative advisory presence in New Delhi). Toll-Free Telephone: 1800 890 0818. Delhi Advisory Desk: +91 011 4051 5660. WhatsApp Desk: +91 74282 80200. Corporate Email: info@niventracapitaladvisory.com. Business Hours: Monday to Friday, 9:30 AM to 6:30 PM IST.",
  },
  {
    id: "kb-grievance-redressal",
    topic: "Grievance Redressal & Dispute Resolution",
    keywords: ["grievance", "complaint", "dispute", "officer", "sla", "48 hours", "30 days", "resolution"],
    title: "Grievance Redressal Mechanism & 48-Hour SLA",
    sourceUrl: "/grievance/",
    content:
      "Niventra maintains an independent dispute resolution mechanism managed by a designated Grievance Redressal Officer. We guarantee formal written acknowledgment within 48 business hours and a comprehensive determination within 30 days. Grievances can be submitted directly to grievance@niventracapitaladvisory.com.",
  },
  {
    id: "kb-privacy-dpdp",
    topic: "Data Privacy & Account Erasure (DPDP Act 2023)",
    keywords: ["privacy", "data", "dpdp", "erasure", "delete", "account", "retention", "gdpr", "personal data"],
    title: "DPDP Act 2023 Compliance & Data Erasure Workflow",
    sourceUrl: "/delete-account/",
    content:
      "Niventra adheres strictly to the Digital Personal Data Protection (DPDP) Act, 2023. User data is encrypted with 256-bit encryption and never sold to third parties. Data subjects can request complete record erasure by emailing info@niventracapitaladvisory.com with subject 'Account Deletion Request' (7–14 business days SLA), subject to statutory financial retention exemptions under the Companies Act and PMLA.",
  },
  {
    id: "kb-calculator-status",
    topic: "Financial Return Calculator Status",
    keywords: ["calculator", "calculate", "sip", "compound", "simple interest", "estimate", "projection"],
    title: "Formal Calculator Deferral Notice",
    sourceUrl: "/calculator/",
    content:
      "The public interactive calculator has been formally deferred under Decision 7. The legacy website's calculation tool contained mathematical flaws (applying an equity SIP compounding formula to fixed-income debentures and lacking statutory TDS deductions). A certified calculation tool will be published following written CFO and structuring committee approval. Custom repayment schedules are available on request via the advisory desk.",
  },
  {
    id: "kb-regulatory-status",
    topic: "Regulatory Framework & Private Placement",
    keywords: ["regulatory", "sebi", "rbi", "mca", "companies act", "section 42", "section 71", "pas-4", "compliance", "license"],
    title: "Statutory Operating Framework under Companies Act, 2013",
    sourceUrl: "/regulatory-disclosures/",
    content:
      "Niventra operates in strict compliance with the Companies Act, 2013 (Section 42 for private placement and Section 71 for debentures). Debenture offerings are made strictly on a private placement basis to accredited capital providers via formal Form PAS-4 letters without public solicitation. Niventra does not claim unverified licenses or guaranteed returns.",
  },
];

export interface GroundedAnswer {
  answer: string;
  citations: Array<{ title: string; url: string }>;
  isConfident: boolean;
  needsAdvisoryEscalation: boolean;
}

/**
 * High-precision grounding retrieval engine
 * Matches user query against approved institutional knowledge chunks,
 * prevents prompt injection, and generates citations.
 */
export function queryKnowledgeBase(query: string): GroundedAnswer {
  const sanitized = query.trim().toLowerCase();

  // 1. Guard against prompt injection or malicious exfiltration attempts
  if (
    sanitized.includes("ignore previous instructions") ||
    sanitized.includes("system prompt") ||
    sanitized.includes("reveal secrets") ||
    sanitized.includes("api key") ||
    sanitized.includes("internal notes")
  ) {
    return {
      answer:
        "I am an authorized advisory assistant for Niventra Capital Advisory India. I can only provide information grounded in our verified corporate disclosures, structured debt frameworks, and public documentation. How can I assist you with our advisory services?",
      citations: [{ title: "Regulatory Disclosures", url: "/regulatory-disclosures/" }],
      isConfident: true,
      needsAdvisoryEscalation: false,
    };
  }

  // 2. Score knowledge chunks based on keyword density
  const scored = APPROVED_KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (sanitized.includes(kw)) {
        score += kw.length > 4 ? 2 : 1;
      }
    }
    return { chunk, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      answer:
        "I do not have verified documentation directly addressing that specific inquiry in my approved knowledge repository. For bespoke transaction structuring, eligibility criteria, or detailed legal queries, please connect directly with our advisory desk.",
      citations: [
        { title: "Contact Advisory Team", url: "/contact/" },
        { title: "Support & FAQ", url: "/support-faq/" },
      ],
      isConfident: false,
      needsAdvisoryEscalation: true,
    };
  }

  // Pick top matching chunks (up to 2)
  const topMatches = scored.slice(0, 2);
  const primaryChunk = topMatches[0].chunk;

  let compositeAnswer = primaryChunk.content;
  if (topMatches.length > 1 && topMatches[1].score >= 2) {
    compositeAnswer += `\n\nAdditionally: ${topMatches[1].chunk.content}`;
  }

  const citations = topMatches.map((m) => ({
    title: m.chunk.title,
    url: m.chunk.sourceUrl,
  }));

  return {
    answer: compositeAnswer,
    citations,
    isConfident: true,
    needsAdvisoryEscalation: false,
  };
}
