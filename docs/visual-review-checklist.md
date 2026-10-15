# Niventra Capital Advisory — Visual & Responsive Review Checklist

**Project Phase:** Phase 4 Visual Art Direction & Responsive Verification  
**Date:** October 15, 2026  
**Auditor / Designer:** Senior Product Designer & Frontend Architect  
**Workspace:** `d:\Projects\niventra website`  
**Classification:** Visual Acceptance & Responsive Quality Matrix  

---

## 1. Visual Art Direction & Aesthetic Standards

The website rebuild adheres to the **Modern Institutional** design direction:
- **Palette Discipline:** Warm ivory canvas (`#FAFAF7`), crisp white cards (`#FFFFFF`), deep ink headings (`#1A1A1A`), muted slate body text (`#5C5C5C`), refined brass accents (`#9A7B2C`), and deep anchor dark footer (`#0E1C2E`).
- **Typography Hierarchy:** Editorial headings rendered in `Cormorant Garamond` (300–700 weights); data labels and body copy set in `Plus Jakarta Sans` with tabular numerals (`tnum`).
- **Restrained Decoration:** Elimination of saturated neon gradients, oversized rounded cards, generic icon grids, and fake financial charts. Replaced with asymmetric editorial composition, fine hairline rules, and generous whitespace.

---

## 2. Multi-Device Responsive Verification Matrix

| Viewport Profile | Width (px) | Tested Routes / Components | Verification Observations | Status |
| :--- | :---: | :--- | :--- | :---: |
| **Large Desktop** | `1440 × 900` | Homepage, `/debt-debenture/`, `/real-estate/`, `/due-diligence/`, `/capital-providers/` | Asymmetric split-hero layout, 4-column credential strip, service row alignment, balanced spacing. | ✅ **PASS** |
| **Standard Laptop** | `1280 × 800` | All 16 routes, Footer, Header navigation bar | Clean navigation wrapping, container maximum width 1240px, legible typography scale. | ✅ **PASS** |
| **Tablet Portrait** | `768 × 1024` | Services grid, 7-stage evaluation journey, Due diligence cards | 2-column responsive layout, touch targets ≥ 44px, full table horizontal scroll containment. | ✅ **PASS** |
| **Standard Mobile** | `390 × 844` | Mobile header, hamburger drawer, consultation form, FAQ accordion | Drawer opens smoothly from right with backdrop blur; body scroll locks; form fields stack vertically. | ✅ **PASS** |
| **Narrow Mobile** | `320 × 568` | Header, Consultation form, Hero display typography | Display text scales gracefully via `clamp(2.25rem, 5vw, 4rem)`; zero horizontal overflow. | ✅ **PASS** |

---

## 3. Component & Design Token Verification Checklist

- [x] **Original Logo Integrity:** Authentic binary file `public/assets/images/logo.png` (687,686 bytes, 1355 × 1160 px) rendered with crisp proportions; no redrawing or AI generation.
- [x] **Light Institutional Header:** Glass background (`rgba(250, 250, 247, 0.95)`), hairline border (`rgba(26,26,26,0.08)`), toll-free phone shortcut, and consultation CTA.
- [x] **Mobile Drawer Navigation:** Accessible hamburger toggle with `aria-expanded` and `aria-controls`; Escape key support; backdrop click-to-close; full 8-item navigation tree.
- [x] **Dark Anchor Footer:** Refined deep navy canvas (`#0E1C2E`), complete corporate directory, 12 governance links, statutory risk disclaimer, copyright notice.
- [x] **Editorial Section Typography:** Brass uppercase eyebrows (`tracking-[0.15em]`), elegant Cormorant Garamond headings (`tracking-[-0.02em]`), comfortable line lengths (60–75 characters).
- [x] **Reusable UI Components:**
  - [x] `Button.tsx`: Primary (solid deep ink), Primary-Outline, Brass, Ghost variants.
  - [x] `Badge.tsx`: Institutional status tags with subtle border styling.
  - [x] `Breadcrumb.tsx`: Accessible semantic trail with Home link and Chevron dividers.
  - [x] `PageHero.tsx`: Consistent editorial header across all 15 inner pages.
  - [x] `Accordion.tsx`: Accessible toggle behavior with smooth rotation indicators and `aria-expanded`.
  - [x] `CalloutNotice.tsx`: Institutional disclaimer boxes (brass, neutral, warning, success variants).
  - [x] `ConsultationForm.tsx`: DPDP Act 2023 consent checkbox, real-time validation, accessible `role="alert"` errors, and honest simulated submission.
- [x] **Asset Integration:**
  - [x] `bond-plant.png` rendered on `/debt-debenture/`.
  - [x] `premium_corporate_real_estate.png` rendered on `/real-estate/`.
  - [x] `terms_agreement.png` rendered on `/terms-conditions/`.
  - [x] `privacy_lock.png` rendered on `/privacy-policy/`.
- [x] **Zero Visual Flaws:** No overlapping text, broken image icons, horizontal page scroll, or unaligned containers.

---

## 4. Visual Artifacts Directory & Image Paths

All screenshots captured during testing are stored in the conversation artifacts directory:

- Desktop Homepage: `homepage_hero_services_1792087788106.png`
- Debt & Debenture: `debt_debenture_page_1792087802523.png`
- Real Estate Advisory: `real_estate_page_1792087814245.png`
- Due Diligence: `due_diligence_page_1792087827822.png`
- Capital Providers: `capital_providers_page_1792087843176.png`
- Calculator Deferral: `calculator_page_1792087857955.png`
- Contact & Directory: `contact_page_1792087871499.png`
- Support & FAQ Accordions: `support_faq_page_1792087892661.png` & `support_faq_expanded_1792087901103.png`
- Account Deletion & DPDP: `delete_account_page_1792087910813.png`
- Mobile Viewport (390px): `mobile_homepage_1792087922452.png`, `mobile_menu_open_1792087930971.png`, `mobile_menu_closed_1792087939808.png`
- Custom 404 Error: `custom_404_page_1792087951895.png`
- Full Video Recording: `full_site_visual_review_1792087778119.webp`
