# Niventra Capital Advisory — Link & Functionality Audit

**Audit Date:** October 15, 2026  
**Auditor:** Quality Assurance Lead & Senior Security Engineer  
**Target Domain:** `https://niventracapitaladvisory.com`  
**Classification:** Comprehensive Link, Interactive Feature & Script Audit  

---

## 1. Executive Summary

An exhaustive functional and link audit of the live Niventra Capital Advisory website revealed several critical functional discrepancies, security vulnerabilities, and broken asset links that must be remediated in the Phase 4 architectural rebuild:

1. **Dead Document Downloads (Soft 404s):** The two primary downloadable investment documents (`sample_offer_document.pdf` and `sample_term_sheet.pdf`) return HTTP 200 with the HTML homepage instead of PDF binaries.
2. **Broken Third-Party CRM Link (HTTP 404):** The "Application Form" button on `/capital-providers/` links off-domain to an unverified third-party Vercel deployment (`crm-teal-one-29.vercel.app`). Live verification confirms this endpoint currently returns **HTTP 404 (Not Found)**, completely blocking application submissions while raising data governance questions.
3. **Telephony Inconsistency:** Telephone links on `/debt-debenture/` and `/capital-providers/` exhibit visual/destination discrepancies (displaying Delhi landline `+91 01140515660` while the `tel:` protocol calls toll-free `18008900818`).
4. **Unsecured Form Submission:** The project intake form on `/contact/` submits directly via HTTP POST to a legacy `contact.php` script without CSRF tokens, anti-spam validation, or rate-limiting.
5. **Product Misalignment in Calculators:** The homepage features an interactive SIP (Systematic Investment Plan) calculator with a hardcoded 16% compounding return, which conflicts with fixed-income debenture debt mechanics.

---

## 2. Broken & Problematic Link Register

| Source Page | Anchor Text / Element | Declared `href` Target | Observed Behavior | Severity | Remediation Requirement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/capital-providers/` | "Offer Document / Information Memorandum" | `https://niventracapitaladvisory.com/assets/docs/sample_offer_document.pdf` | **Soft 404 Failure:** Server returns HTML homepage (38,056 bytes, `text/html`). No PDF document is served. | **CRITICAL** | Obtain authorized PDF Information Memorandum from legal/compliance; host via private/public asset storage with real binary streaming. |
| `/capital-providers/` | "Term Sheet / Key Investment Terms" | `https://niventracapitaladvisory.com/assets/docs/sample_term_sheet.pdf` | **Soft 404 Failure:** Server returns HTML homepage (`text/html`). No PDF document is served. | **CRITICAL** | Obtain authorized sample Term Sheet; replace dead link with verified document. |
| `/capital-providers/` | "Application Form / Subscription Form" | `https://crm-teal-one-29.vercel.app/debenture-application?ref=MDSDWK-00I` | **HTTP 404 Dead Link & External Exposure:** Live check confirms endpoint returns HTTP 404 Not Found. Link is broken and points off-domain to unverified Vercel deployment with tracking `ref=MDSDWK-00I`. | **CRITICAL** | Rebuild native, secure investor onboarding workflow within Niventra platform with end-to-end data encryption and DPDP compliance. |
| `/debt-debenture/` | `+91 01140515660` (Footer) | `tel:18008900818` | **Telephony Mismatch:** Clicking the Delhi landline dials the toll-free number on mobile devices. | **HIGH** | Align displayed text and `tel:` href to authorized primary contact number. |
| `/capital-providers/` | `+91 01140515660` (Footer) | `tel:18008900818` | **Telephony Mismatch:** Displays landline, dials toll-free number. | **HIGH** | Align display and anchor attributes. |
| `/contact/` | "Visit Office" | `https://maps.google.com` | **Unanchored Map Link:** Opens generic Google Maps homepage without specifying Patel Nagar, Gwalior coordinates. | **MEDIUM** | Embed verified Google Maps place pin for Patel Nagar City Centre, Gwalior. |
| `sitemap.xml` | Multiple URLs | Relative vs Canonical | 3 public footer pages (`/investor-information/`, `/support-faq/`, `/delete-account/`) are missing from sitemap. | **MEDIUM** | Regenerate complete dynamic sitemap in Phase 4. |

---

## 3. Interactive Forms Audit

### 3.1 Contact & Project Submission Form (`/contact/`)
- **Location:** `https://niventracapitaladvisory.com/contact/`
- **Form Attributes:** `action="contact.php"`, `method="POST"`
- **Input Fields Catalog:**
  1. `full_name` (`<input type="text" placeholder="Your Name" required>`)
  2. `email` (`<input type="email" placeholder="Your Email" required>`)
  3. `phone` (`<input type="tel" placeholder="Your Phone Number" required>`)
  4. `subject` (`<input type="text" placeholder="Subject">`)
  5. `investment_interest` (`<select>` with options: Residential, Commercial, Mixed Use, Redevelopment)
  6. `message` (`<textarea placeholder="Your Message" required>`)
  7. Submit Button (`<button type="submit">Submit Message</button>`)
- **Security & Quality Deficiencies:**
  - **No Anti-CSRF Token:** Vulnerable to cross-site request forgery.
  - **No Spam / Bot Protection:** Absence of Cloudflare Turnstile or Google reCAPTCHA v3.
  - **No Client-Side Real-Time Validation:** Relies solely on basic HTML5 constraints.
  - **No Async Submission State:** Submits synchronously, resulting in full-page reload.
  - **Target Endpoint Exposure:** Direct path `contact.php` exposes legacy PHP server stack.

### 3.2 Standalone Simple Interest Calculator (`/calculator/`)
- **Location:** `https://niventracapitaladvisory.com/calculator/`
- **Form Identifier:** `<form id="siForm">`
- **Form Controls:**
  - `principalInput`: Numeric input for investment capital.
  - `amountInWords`: Dynamic DOM container rendering Indian words (Lakhs, Crores).
  - `typeRupeeBtn` / `typePercentBtn`: Dual-mode toggle buttons (`rupee` vs `percent`).
  - `rateInput`: Interest rate field with dynamic label updates.
  - `showEquivalentToggle`: Checkbox toggling per-annum / per-month rate equivalence.
  - `fromDateInput` / `toDateInput`: Date pickers defaulting to today and +1 month.
  - `clearFieldsBtn`: Reset button clearing inputs and resetting output cards.
- **Observed Calculation Methodology (`calculator.js`):**
  - Uses simple interest formula: `Interest = P × (rate / 100) × MonthsFraction`.
  - Day calculation uses a hardcoded 30-day divisor: `totalMonthsFraction = years * 12 + months + days / 30`.
  - Ignores leap years, actual calendar month durations (28, 30, 31 days), compounding intervals, TDS deduction, and GST.

---

## 4. Client-Side Script & Animation Audit (`script.js`)

| Feature | Script Implementation | Behavioral Analysis | Deficiencies & Edge Cases |
| :--- | :--- | :--- | :--- |
| **Sticky Navigation** | Listens to `window.scroll`, toggles `.shadow` class on `.header-area` when `scrollY > 50`. | Functional on desktop. | Not throttled with `requestAnimationFrame` or passive event listeners; minor scroll jank on low-end devices. |
| **Stats Counter Animation** | Iterates over `.counter` elements on `window.load`, increments target by `target / 150` every 20ms. | Animated numbers load on page entry. | Triggers unconditionally on `window.load` before elements are scrolled into viewport; users scrolling down later miss the animation entirely. |
| **Back To Top Button** | Listens to `window.scroll`, displays `#topBtn` when `scrollY > 400`, smooth scrolls to top on click. | Functional. | Button position overlaps footer contact cards on mobile viewports. |
| **Hero Carousel** | Initializes Swiper 11 on `.heroSwiper` with cross-fade effect and 5000ms autoplay delay. | Smooth slider on desktop. | Autoplay does not pause on hover or focus, creating accessibility barrier for screen readers (WCAG 2.2.2). |
| **Testimonial Slider** | Initializes Swiper 11 on `.testimonialSwiper` with responsive breakpoints (1, 2, 3 slides). | Responsive grid carousel. | Script checks for `.testimonialSwiper` on every page, throwing silent initialization passes. |
| **Hero SIP Estimator** | Listens to `input` on `#heroSipRange` and `#heroSipTenure`. Computes: `FV = P * (((1+i)^n - 1)/i) * (1+i)` at `i = 0.16/12`. | Interactively updates output labels. | **Financial Misrepresentation:** Computes a mutual-fund SIP compounding model at 16% p.a. for a debt debenture corporate advisory site. |

---

## 5. Telephony & Communication Channel Verification

| Channel | Displayed Value | Machine-Readable Link | Physical Recipient | Inconsistency Identified |
| :--- | :--- | :--- | :--- | :--- |
| **Toll-Free Phone** | `18008900818` | `tel:18008900818` | Central Customer Support | Consistent across 14 pages. |
| **Delhi Landline** | `+91 01140515660` | `tel:18008900818` | Central Toll-Free Desk | **Mismatch:** Screen reads Delhi landline (`011`), but dialer executes toll-free (`1800`). |
| **WhatsApp Support** | "Start Chat" | `https://wa.me/917428280200` | Mobile (`+91 74282 80200`) | Third unlinked mobile number not referenced in standard headers. |
| **Primary Email** | `info@niventracapitaladvisory.com` | `mailto:info@niventracapitaladvisory.com` | General Corporate Inquiries | Consistent across all 16 pages. |
| **Grievance Email** | `grievance@niventracapitaladvisory.com` | `mailto:grievance@niventracapitaladvisory.com` | Grievance Redressal Officer | Declared on `/grievance/`. |

---

## 6. Functional Architecture Recommendations for Phase 4 Rebuild

1. **Integrated Server Actions:** Replace `contact.php` with type-safe Next.js Server Actions backed by Zod schema validation, Rate Limiting (Upstash / Redis), and Cloudflare Turnstile verification.
2. **First-Party Investor Portal:** Eliminate the external `crm-teal-one-29.vercel.app` redirect. Implement an authenticated, secure investor onboarding workflow within the main domain.
3. **Institutional Financial Calculators:**
   - Retire the misleading SIP compounding formula from the homepage hero.
   - Build a certified Debenture Yield & Cash Flow Calculator supporting institutional day-count conventions (Actual/365, 30/360), monthly/quarterly/annual coupon payout schedules, and explicit TDS modeling.
4. **Resilient Telephony Schema:** Standardize contact definitions across metadata, footers, and microdata schema (`schema.org/FinancialService`).
