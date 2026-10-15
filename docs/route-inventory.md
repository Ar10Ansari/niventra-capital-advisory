# Niventra Capital Advisory — Route Inventory

**Audit Date:** October 15, 2026  
**Auditor:** Lead Technical Architect & Financial Systems Auditor  
**Target Domain:** `https://niventracapitaladvisory.com`  
**Classification:** Complete Live Route Discovery & Mapping  

---

## 1. Route Discovery Methodology

The live website was audited using a multi-vector discovery process:
1. **Root Navigation & Header Links:** Dynamic inspection of primary navigation menus and dropdown hierarchies.
2. **Footer Directory Links:** Exhaustive scan of company, legal, contact, and support links across every page.
3. **Robots.txt & XML Sitemap:** Extraction and verification of declarations in `robots.txt` and `sitemap.xml`.
4. **Deep Anchor Traversal:** Programmatic extraction of all internal relative and absolute links.
5. **Catch-All Fallback Detection:** Testing non-existent paths to determine server rewrite behaviors and HTTP response patterns.

---

## 2. Complete Discovered Route Table

| # | Route Path | Full Live URL | HTTP Status | Page Title | Document Purpose & Target Audience | Related Assets & Disclosures |
| :-: | :--- | :--- | :-: | :--- | :--- | :--- |
| **1** | `/` | `https://niventracapitaladvisory.com/` | `200 OK` | Niventra Capital Advisory India \| Professional Structured Capital & Real Estate Advisory | Corporate homepage establishing brand identity, service pillars, operational flow, and value proposition for developers and investors. | Logo (`logo.png`), Hero Swiper, SIP Estimator Slider, 4 Unsplash cards, Footer legal links. |
| **2** | `/about/` | `https://niventracapitaladvisory.com/about/` | `200 OK` | About Us \| Niventra Capital Advisory India | Company background, mission, vision, and strategic approach to structured financing. | Hero imagery, structured mission/vision/approach text blocks, standard corporate footer. |
| **3** | `/debt-debenture/` | `https://niventracapitaladvisory.com/debt-debenture/` | `200 OK` | Debt & Debenture \| Niventra Capital Advisory India | Educational and commercial overview of debentures (NCDs, PCDs, FCDs), target yields (14%-16%), risk breakdown, and due diligence checklist. | `bond-plant.png` (JPEG format), Mojibake currency symbols (`â‚¹`), Phone mismatch (`01140515660` vs `18008900818`). |
| **4** | `/real-estate/` | `https://niventracapitaladvisory.com/real-estate/` | `200 OK` | Real Estate \| Niventra Capital Advisory India | Presentation of real estate funding categories (Residential, Commercial, Mixed Use, Redevelopment) and 7-stage seed funding workflow. | `premium_corporate_real_estate.png`, Consultation CTA (`/contact/`), Information Memorandum request button. |
| **5** | `/due-diligence/` | `https://niventracapitaladvisory.com/due-diligence/` | `200 OK` | Due Diligence \| Niventra Capital Advisory India | Explanation of the 5-point evaluation framework (Legal, Financial, Technical, Market, Risk Mitigation) to establish investor trust. | 5-pillar grid cards, compliance statements, contact advisory CTAs. |
| **6** | `/capital-providers/` | `https://niventracapitaladvisory.com/capital-providers/` | `200 OK` | Capital Providers \| Niventra Capital Advisory India | Detailed instrument information for HNIs and institutional capital providers, target returns, sample documents, bond vs stock comparison, and bond yields. | Broken PDF links (`sample_offer_document.pdf`, `sample_term_sheet.pdf`), external CRM link (`crm-teal-one-29.vercel.app`), illustrative calculation card. |
| **7** | `/investor-information/` | `https://niventracapitaladvisory.com/investor-information/` | `200 OK` | Investor Information \| Niventra Capital Advisory India | High-level regulatory and engagement parameters for prospective investors. | Discontinuous numbering (jumps directly to 8, 11, 12; clauses 1-7, 9, 10 missing), links to Risk Disclosure and Grievance. |
| **8** | `/calculator/` | `https://niventracapitaladvisory.com/calculator/` | `200 OK` | Simple Interest Calculator \| Niventra Capital Advisory India | Interactive interest and tenure calculator allowing users to compute returns in Rupee/month or Percent/annum. | `calculator.css`, `calculator.js`, form `#siForm`, dynamic date picker, number-to-words converter. |
| **9** | `/contact/` | `https://niventracapitaladvisory.com/contact/` | `200 OK` | Contact Us \| Niventra Capital Advisory India | Public contact page, direct office address, toll-free number, WhatsApp link, and real estate developer project submission form. | Project submission form (`action="contact.php"`), WhatsApp CTA (`wa.me/917428280200`), office address, Google Map link. |
| **10** | `/risk-disclosure/` | `https://niventracapitaladvisory.com/risk-disclosure/` | `200 OK` | Risk Disclosure \| Niventra Capital Advisory India | Statutory risk disclosure covering market risk, credit risk, construction/execution delay risk, and liquidity lock-in risk. | Dedicated legal disclosure text, warning against unguided investments. |
| **11** | `/terms-conditions/` | `https://niventracapitaladvisory.com/terms-conditions/` | `200 OK` | Terms & Conditions \| Niventra Capital Advisory India | Platform terms of use, IP rights, service limitations, and limitation of liability. | `terms_agreement.png`, formal disclaimer that Niventra is an advisory entity and does not guarantee returns. |
| **12** | `/privacy-policy/` | `https://niventracapitaladvisory.com/privacy-policy/` | `200 OK` | Privacy Policy \| Niventra Capital Advisory India | Data protection commitments, personal data collection, usage, third-party sharing terms, and cookies disclosure. | `privacy_lock.png`, privacy safeguards declaration. |
| **13** | `/regulatory-disclosures/` | `https://niventracapitaladvisory.com/regulatory-disclosures/` | `200 OK` | Regulatory Disclosures \| Niventra Capital Advisory India | Formal compliance statement declaring operations under applicable statutory frameworks and disclaiming guaranteed returns. | Explicit statement: *"We do not offer guaranteed returns or risk-free investments."* |
| **14** | `/grievance/` | `https://niventracapitaladvisory.com/grievance/` | `200 OK` | Grievance & Contact \| Niventra Capital Advisory India | Dispute resolution mechanism, grievance officer contact, 48-hour response, and 30-day resolution timeline. | Dedicated email: `grievance@niventracapitaladvisory.com`. |
| **15** | `/support-faq/` | `https://niventracapitaladvisory.com/support-faq/` | `200 OK` | Support & FAQ \| Niventra Capital Advisory India | Help centre landing page listing support categories (General Queries, Contact Support, Technical Help, Account & Security). | Category cards; note: no expandable accordion FAQ questions currently exist in the HTML. |
| **16** | `/delete-account/` | `https://niventracapitaladvisory.com/delete-account/` | `200 OK` | Delete Account \| Niventra Capital Advisory India | Account and personal data deletion request instructions, 7-14 business day SLA, and regulatory data retention notice. | Instructions to email `info@niventracapitaladvisory.com` with subject "Account Deletion Request". |
| **17** | `/robots.txt` | `https://niventracapitaladvisory.com/robots.txt` | `200 OK` | N/A (Plain Text) | Search engine indexing directives and XML sitemap declaration. | `User-agent: *`, `Allow: /`, `Sitemap: https://niventracapitaladvisory.com/sitemap.xml`. |
| **18** | `/sitemap.xml` | `https://niventracapitaladvisory.com/sitemap.xml` | `200 OK` | N/A (XML) | Search engine indexing sitemap. | 13 URLs listed with `lastmod: 2026-09-08` (Note: `/investor-information/`, `/support-faq/`, and `/delete-account/` are omitted from sitemap.xml). |

---

## 3. Discovered External & Third-Party Target Endpoints

| URL | Originating Page | Purpose | Risk / Finding |
| :--- | :--- | :--- | :--- |
| `https://crm-teal-one-29.vercel.app/debenture-application?ref=MDSDWK-00I` | `/capital-providers/` (Button: "Application Form / Subscription Form") | Third-party investor application intake form hosted on free Vercel domain. | **Critical Security & Compliance Finding:** Real investor KYC/application data is redirected off-domain to an unverified Vercel deployment with referral code `MDSDWK-00I`. |
| `https://wa.me/917428280200` | `/contact/` (Button: "Start Chat") | WhatsApp Web/Mobile direct chat integration. | WhatsApp phone number (`+91 74282 80200`) differs from the main toll-free (`18008900818`) and landline (`01140515660`). |
| `https://maps.google.com` | `/contact/` (Office location link) | Map navigation to Patel Nagar, Gwalior. | Generic Google Maps link without exact place coordinates. |

---

## 4. Server Routing & Catch-All Behavior

The server is configured with a wildcard or Single Page Application rewrite rule:
- Any requested non-existent URL (e.g. `/random_404_test_xyz123`, `/assets/docs/sample_offer_document.pdf`, `/assets/docs/sample_term_sheet.pdf`) returns `HTTP 200 OK` with the homepage HTML payload (38,056 bytes).
- **Architectural Implication:** 
  1. The server fails to return standard `404 Not Found` status codes for missing documents or dead URLs.
  2. Search engines may index duplicate content under non-existent URLs (soft 404 issue).
  3. Linked PDF documents appear active to automated link check tools while being completely missing.

---

## 5. Route Preservation Requirements for Phase 4 Rebuild

1. **Exact Path Parity:** All 16 public HTML routes, plus `robots.txt` and `sitemap.xml`, must be preserved verbatim (including trailing slashes).
2. **Missing Sitemap Routes:** The new sitemap must add `/investor-information/`, `/support-faq/`, and `/delete-account/`, which are currently active in the footer but omitted from `sitemap.xml`.
3. **Canonical 404 Response:** The new Next.js architecture must return genuine `404 Not Found` HTTP responses with a branded 404 error page for non-existent routes.
