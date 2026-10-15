# Niventra Capital Advisory — Brand & Asset Inventory

**Audit Date:** October 15, 2026  
**Auditor:** Lead Technical Architect & UI/UX Design Specialist  
**Target Domain:** `https://niventracapitaladvisory.com`  
**Classification:** Brand Asset Preservation & Visual Architecture Audit  

---

## 1. Executive Asset Summary

A comprehensive inventory was performed on all visual, typographic, stylesheet, script, and document assets utilized across the live Niventra Capital Advisory website.

Key findings:
1. **Original Official Logo:** Successfully located and preserved at `/assets/images/logo.png`. It is a high-resolution 1355 × 1160 pixel PNG (671.6 KB) with authentic alpha transparency.
2. **Brand Imagery MIME Anomaly:** Four secondary feature graphics (`bond-plant.png`, `premium_corporate_real_estate.png`, `privacy_lock.png`, `terms_agreement.png`) are encoded as **JPEG/JFIF** files despite carrying a `.png` file extension.
3. **Missing Document Artifacts:** Both sample investment documents advertised to prospective capital providers (`sample_offer_document.pdf` and `sample_term_sheet.pdf`) return HTML fallback pages and do not physically exist on the server.
4. **Third-Party CDN Dependencies:** The existing site relies on 6 external CDN links (Bootstrap 5.3.7, Bootstrap Icons 1.13.1, Swiper 11, AOS 2.3.4, Google Fonts Poppins, Unsplash images), presenting external availability and privacy risks.

---

## 2. Official Brand Identity & Logo Audit

### 2.1 Logo Specifications
- **Primary Live Location:** `https://niventracapitaladvisory.com/assets/images/logo.png`
- **Relative Path References:** `/assets/images/logo.png`, `assets/images/logo.png`, `../assets/images/logo.png`
- **File Format:** Portable Network Graphics (PNG-24 with alpha channel)
- **Magic Bytes:** `\x89PNG\r\n\x1a\n` (Verified authentic PNG)
- **Pixel Dimensions:** **1355 × 1160 px** (High Resolution)
- **File Size:** **687,686 bytes (671.6 KB)**
- **Color Palette in Logo:** Deep Navy / Midnight Blue (`#0B192C`), Warm Gold / Champagne Accents (`#D4AF37` / `#C5A880`), White text (`#FFFFFF`).
- **Visual Elements:** Stylized capital emblem incorporating dynamic geometric pillar motifs symbolizing structured capital growth, accompanied by formal typographic wordmark "NIVENTRA CAPITAL ADVISORY INDIA".
- **Preservation Policy:** **STRICT PRESERVATION.** In strict compliance with project instructions, the logo must **NOT** be recreated, redesigned, recolored, or AI-approximated. The exact 1355 × 1160 asset has been downloaded bit-for-bit to local project storage for direct use in the rebuilt application.
- **Favicon:** Located at `https://niventracapitaladvisory.com/favicon.ico` (15,406 bytes, ICO format, 16×16, 32×32, 48×48 multi-resolution icon).

---

## 3. Visual & Graphic Asset Register

| Asset Name | Live URL Path | File Format (Declared vs Actual) | Dimensions | File Size | Description & Usage | Status & Preservation Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `logo.png` | `/assets/images/logo.png` | PNG / PNG | 1355 × 1160 px | 671.6 KB | Official corporate logo used in navbar and footer. | **PRESERVED.** Bit-for-bit download verified. |
| `favicon.ico` | `/favicon.ico` | ICO / ICO | 16x16, 32x32, 48x48 | 15.4 KB | Browser tab favicon. | **PRESERVED.** |
| `bond-plant.png` | `/assets/images/bond-plant.png` | Declared: `.png`<br>**Actual: JPEG (JFIF)** | 1024 × 1024 px (approx) | 751.1 KB | Graphic of plant growing out of coins/bonds used on `/debt-debenture/`. | **PRESERVED.** Correct MIME type to `.jpg` or convert losslessly to WebP in rebuild. |
| `premium_corporate_real_estate.png` | `/assets/images/premium_corporate_real_estate.png` | Declared: `.png`<br>**Actual: JPEG (JFIF)** | 1024 × 1024 px (approx) | 825.0 KB | Modern corporate glass skyscrapers used on `/real-estate/`. | **PRESERVED.** Correct MIME type / convert to modern WebP format. |
| `privacy_lock.png` | `/assets/images/privacy_lock.png` | Declared: `.png`<br>**Actual: JPEG (JFIF)** | 1024 × 1024 px (approx) | 848.9 KB | 3D biometric padlock emblem used on `/privacy-policy/`. | **PRESERVED.** Correct MIME type / convert to modern WebP format. |
| `terms_agreement.png`| `/assets/images/terms_agreement.png` | Declared: `.png`<br>**Actual: JPEG (JFIF)** | 1024 × 1024 px (approx) | 741.2 KB | Corporate contract signing graphic used on `/terms-conditions/`. | **PRESERVED.** Correct MIME type / convert to modern WebP format. |

---

## 4. Third-Party Stock Photography Inventory

The current website embeds 17 external images directly from Unsplash CDN. Because external links can break or expire, all stock references have been cataloged:

| Stock Image Reference | Page Location | Context / Depiction | Rebuild Recommendation |
| :--- | :--- | :--- | :--- |
| `photo-1486406146926-c627a92ad1ab` | `/`, `/about/` | Architectural low-angle glass skyscraper (Financial District). | Self-host optimized local WebP asset. |
| `photo-1497366216548-37526070297c` | `/`, `/due-diligence/` | Modern corporate office meeting room / boardroom. | Self-host optimized local WebP asset. |
| `photo-1554224155-6726b3ff858f` | `/`, `/capital-providers/` | Financial spreadsheets, charts, and executive review table. | Self-host optimized local WebP asset. |
| `photo-1521791136064-7986c2920216` | `/about/` | Professional executive handshake / partnership trust. | Self-host optimized local WebP asset. |
| `photo-1454165804606-c3d57bc86b40` | `/due-diligence/` | Financial auditing, analytics, and due diligence review. | Self-host optimized local WebP asset. |
| `photo-1560520653-9e0e4c89eb11` | `/real-estate/` | Luxury residential development and urban architecture. | Self-host optimized local WebP asset. |
| `photo-1589829085413-56de8ae18c73` | `/risk-disclosure/` | Legal scales of justice and corporate compliance library. | Self-host optimized local WebP asset. |
| `photo-1552664730-d307ca884978` | `/support-faq/` | Professional support team / corporate operations desk. | Self-host optimized local WebP asset. |

---

## 5. Document & Downloadable Artifact Audit

| Document Name | Declared URL | Declared MIME | Actual Server Response | Content Analysis & Compliance Risk |
| :--- | :--- | :--- | :--- | :--- |
| **Sample Offer Document** | `https://niventracapitaladvisory.com/assets/docs/sample_offer_document.pdf` | `application/pdf` | `HTTP 200 OK` (`text/html; charset=UTF-8`, 38,056 bytes) | **MISSING ARTIFACT.** Server returns homepage HTML via catch-all rewrite. Prospective investors attempting to download the sample offer document receive an unrendered HTML page. **Company action required:** Obtain verified, approved sample Information Memorandum from legal counsel. |
| **Sample Term Sheet** | `https://niventracapitaladvisory.com/assets/docs/sample_term_sheet.pdf` | `application/pdf` | `HTTP 200 OK` (`text/html; charset=UTF-8`, 38,056 bytes) | **MISSING ARTIFACT.** Server returns homepage HTML via catch-all rewrite. Term sheet is physically absent. **Company action required:** Obtain approved sample term sheet. |

---

## 6. Code & Script Asset Inventory

| Asset Name | Path | Size | Tech Stack / Library | Role & Functionality |
| :--- | :--- | :--- | :--- | :--- |
| `style.css` | `/assets/css/style.css` | 28.3 KB | Vanilla CSS | Primary global styling, custom utility classes, cards, color definitions. |
| `responsive.css` | `/assets/css/responsive.css` | 7.7 KB | CSS Media Queries | Mobile/tablet breakpoint rules (`@media max-width: 991px`, `767px`, `575px`). |
| `calculator.css` | `/calculator/calculator.css` | 3.9 KB | Vanilla CSS | Scoped styling for `/calculator/` layout, button toggles, and results grid. |
| `script.js` | `/assets/js/script.js` | 4.8 KB | Vanilla JS | Sticky header toggle, counter animation, back-to-top button, Swiper sliders, Hero SIP calculator. |
| `calculator.js` | `/calculator/calculator.js` | 9.5 KB | Vanilla JS | Simple interest logic, Indian number-to-words parser, date range duration parser. |
| `bootstrap.min.css` | CDN (jsDelivr) | 5.3.7 | Bootstrap CSS | Grid system, form controls, modals. |
| `bootstrap.bundle.min.js` | CDN (jsDelivr) | 5.3.7 | Bootstrap JS | Navbar toggling, dropdowns. |
| `swiper-bundle.min.css` | CDN (jsDelivr) | 11.x | Swiper Slider | Styles for hero and testimonial carousels. |
| `aos.css` / `aos.js` | CDN (unpkg) | 2.3.4 | Animate on Scroll | Scroll-triggered entrance animations. |

---

## 7. Current Design System Audit

### 7.1 Typography
- **Primary Font Family:** `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Loaded Font Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold), 800 (Extra Bold).
- **Audit Assessment:** Poppins is legible and modern, but commonly associated with retail tech startups rather than institutional, discreet private capital advisory firms.
- **Recommendation:** Elevate typography in the rebuild by pairing an authoritative, high-trust serif or neo-grotesque header font (e.g., `Cinzel`, `Playfair Display`, or `Plus Jakarta Sans`) with an ultra-clean body face (`Inter` or `Plus Jakarta Sans`).

### 7.2 Color System
- **Current Color Tokens Observed:**
  - Primary Dark / Brand Base: `#0B192C` (Deep Blue / Midnight Navy)
  - Secondary Brand: `#1E3E62` (Slate Blue)
  - Accent / Gold: `#E65100` / `#D4AF37` / `#C5A880` (Amber / Warm Gold)
  - Card Backgrounds: `#FFFFFF` (Pure White) and `#F8F9FA` (Soft Off-White)
  - Body Text: `#4A5568` (Cool Grey) / `#2D3748` (Slate Grey)
- **Audit Assessment:** The dark blue and gold palette is fundamentally sound for financial services. However, contrast ratios in several secondary badges and subtle card borders fail WCAG AA 4.5:1 standards against light grey backgrounds.

### 7.3 Spacing, Layout & Responsiveness
- **Grid Architecture:** 12-column Bootstrap grid container (`max-width: 1320px` at `xxl`).
- **Responsive Breakpoints:** 576px, 768px, 992px, 1200px.
- **Observed Flaws:**
  - Mobile header navigation collapses into a basic hamburger menu with unstyled sub-items.
  - The hero SIP slider overflows horizontally on viewports narrower than 380px.
  - Footer column padding collapses awkwardly on tablet portrait (`768px - 991px`), causing line wraps on telephone numbers.

---

## 8. Recommended Financial-Services Design Direction

For the upcoming Phase 4 rebuild, the UI/UX direction should reflect:
1. **Understated Institutional Elegance:** Clean lines, generous negative space, refined micro-borders (`border: 1px solid rgba(212, 175, 55, 0.15)`), and dark-mode accents.
2. **Human-Crafted, Non-Generic Aesthetic:** Avoid generic AI-generated glassmorphism templates or neon gradients. Utilize authentic typography, subtle tactile hover states, and institutional grade financial tables.
3. **High-Trust Signals:** Prominent regulatory disclosures, explicit verification badges, clear document download cards with file-size and SHA-256 metadata indicators, and dedicated grievance channels.
4. **Zero Layout Shifts:** Pre-calculated asset aspect ratios and self-hosted fonts to achieve 100% Core Web Vitals compliance.
