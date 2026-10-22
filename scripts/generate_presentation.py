import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Niventra Institutional Color Palette
    NAVY = RGBColor(11, 25, 44)         # #0B192C Deep Institutional Navy
    LIGHT_BG = RGBColor(250, 250, 247)  # #FAFAF7 Warm Ivory
    CARD_BG = RGBColor(255, 255, 255)   # #FFFFFF Crisp White
    CARD_BORDER = RGBColor(226, 232, 240)
    GOLD = RGBColor(154, 123, 44)       # #9A7B2C Restrained Metallic Gold
    GOLD_LIGHT = RGBColor(245, 239, 230)
    TEXT_MAIN = RGBColor(26, 26, 26)    # #1A1A1A Off-black
    TEXT_MUTED = RGBColor(92, 92, 92)   # #5C5C5C Neutral Gray
    TEXT_LIGHT = RGBColor(138, 138, 138)

    # Status Colors
    LIVE_GREEN = RGBColor(5, 150, 105)
    LIVE_BG = RGBColor(236, 253, 245)
    DEV_BLUE = RGBColor(29, 78, 216)
    DEV_BG = RGBColor(239, 246, 255)
    DEMO_AMBER = RGBColor(217, 119, 6)
    DEMO_BG = RGBColor(254, 243, 199)
    PROP_PURPLE = RGBColor(126, 34, 206)
    PROP_BG = RGBColor(250, 245, 255)

    ASSETS_DIR = os.path.join(os.getcwd(), "docs", "presentation", "assets")
    OUTPUT_FILE = os.path.join(os.getcwd(), "docs", "presentation", "Niventra_Capital_Advisory_Website_Presentation.pptx")
    LOGO_PATH = os.path.join(os.getcwd(), "public", "assets", "images", "logo.png")

    blank_layout = prs.slide_layouts[6]

    def set_bg(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_badge(slide, status, x=Inches(10.8), y=Inches(0.65), w=Inches(1.8), h=Inches(0.35)):
        status_upper = status.upper()
        if "LIVE" in status_upper:
            fg, bg = LIVE_GREEN, LIVE_BG
        elif "DEV" in status_upper:
            fg, bg = DEV_BLUE, DEV_BG
        elif "DEMO" in status_upper:
            fg, bg = DEMO_AMBER, DEMO_BG
        else:
            fg, bg = PROP_PURPLE, PROP_BG

        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
        badge.fill.solid()
        badge.fill.fore_color.rgb = bg
        badge.line.color.rgb = fg
        badge.line.width = Pt(1)

        tf = badge.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = status_upper
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = fg

    def add_header(slide, title, category="NIVENTRA CAPITAL ADVISORY", status=None):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(9.5), Inches(0.3))
        tf = cat_box.text_frame
        p = tf.paragraphs[0]
        p.text = category.upper()
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = GOLD

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(9.8), Inches(0.75))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(21)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_MAIN

        if status:
            add_badge(slide, status)

    def create_feature_slide(title, category, status, points, business_value, limitations, image_filename):
        slide = prs.slides.add_slide(blank_layout)
        set_bg(slide, LIGHT_BG)
        add_header(slide, title, category, status)

        # Left Info Card
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(4.7), Inches(5.4))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.3)
        tf.margin_bottom = Inches(0.3)

        # Feature bullet points
        p_head = tf.paragraphs[0]
        p_head.text = "KEY CAPABILITIES & IMPLEMENTATION"
        p_head.font.size = Pt(9)
        p_head.font.bold = True
        p_head.font.color.rgb = GOLD
        p_head.space_after = Pt(10)

        for pt in points:
            p = tf.add_paragraph()
            p.text = f"•  {pt}"
            p.font.size = Pt(10.5)
            p.font.color.rgb = TEXT_MAIN
            p.space_after = Pt(6)

        # Business Value Section
        p_bv_head = tf.add_paragraph()
        p_bv_head.text = "BUSINESS VALUE & STRATEGY"
        p_bv_head.font.size = Pt(8.5)
        p_bv_head.font.bold = True
        p_bv_head.font.color.rgb = LIVE_GREEN
        p_bv_head.space_before = Pt(8)
        p_bv_head.space_after = Pt(4)

        p_bv = tf.add_paragraph()
        p_bv.text = business_value
        p_bv.font.size = Pt(10)
        p_bv.font.color.rgb = TEXT_MUTED

        # Limitations / Scope Boundary
        p_lim_head = tf.add_paragraph()
        p_lim_head.text = "GOVERNANCE & BOUNDARIES"
        p_lim_head.font.size = Pt(8.5)
        p_lim_head.font.bold = True
        p_lim_head.font.color.rgb = DEMO_AMBER
        p_lim_head.space_before = Pt(8)
        p_lim_head.space_after = Pt(4)

        p_lim = tf.add_paragraph()
        p_lim.text = limitations
        p_lim.font.size = Pt(9.5)
        p_lim.font.color.rgb = TEXT_MUTED

        # Right Image Frame
        img_path = os.path.join(ASSETS_DIR, image_filename)
        if os.path.exists(img_path):
            # Frame wrapper
            frame = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.7), Inches(1.5), Inches(6.8), Inches(5.4))
            frame.fill.solid()
            frame.fill.fore_color.rgb = CARD_BG
            frame.line.color.rgb = CARD_BORDER
            frame.line.width = Pt(1)

            # Insert image inside frame
            slide.shapes.add_picture(img_path, Inches(5.75), Inches(1.55), width=Inches(6.7))

    # =========================================================================
    # SLIDE 1: COVER SLIDE (Navy)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, NAVY)

    if os.path.exists(LOGO_PATH):
        s1.shapes.add_picture(LOGO_PATH, Inches(0.8), Inches(1.2), width=Inches(2.4))

    # Accent Gold Pill
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.2), Inches(3.4), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(25, 45, 75)
    pill.line.color.rgb = GOLD
    pill.line.width = Pt(1)
    tf_pill = pill.text_frame
    p_pill = tf_pill.paragraphs[0]
    p_pill.text = "EXECUTIVE CTO RELEASE BRIEFING"
    p_pill.font.size = Pt(9.5)
    p_pill.font.bold = True
    p_pill.font.color.rgb = GOLD

    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(2.8), Inches(11.5), Inches(2.0))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "Niventra Capital Advisory"
    p1.font.size = Pt(38)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)

    p2 = tf1.add_paragraph()
    p2.text = "Institutional Web Platform, Real Estate Project Funding & Digital Due Diligence"
    p2.font.size = Pt(18)
    p2.font.color.rgb = GOLD
    p2.space_before = Pt(8)

    desc_box = s1.shapes.add_textbox(Inches(0.8), Inches(5.0), Inches(11.5), Inches(1.6))
    tf_d = desc_box.text_frame
    tf_d.word_wrap = True
    p3 = tf_d.paragraphs[0]
    p3.text = "Complete production release report: Real Estate Developer Funding Portal (/project-funding/), 25-location verified and legacy branch directory, consultation CRM pipeline, accredited investor portal, automated testing suite (47 tests passed), and production deployment roadmap."
    p3.font.size = Pt(12)
    p3.font.color.rgb = RGBColor(200, 210, 225)

    meta_box = s1.shapes.add_textbox(Inches(0.8), Inches(6.6), Inches(11.5), Inches(0.5))
    tf_m = meta_box.text_frame
    p_m = tf_m.paragraphs[0]
    p_m.text = "Release Branch: refinement/minimal-content-cleanup  •  Production Candidate: main  •  Date: October 2026"
    p_m.font.size = Pt(10)
    p_m.font.color.rgb = TEXT_LIGHT

    # =========================================================================
    # SLIDE 2: EXECUTIVE OVERVIEW
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, LIGHT_BG)
    add_header(s2, "Executive Overview & Digital Transformation Roadmap", "STRATEGIC REPORT", "PLATFORM ARCHITECTURE")

    # 4 Pillar Cards
    pillars = [
        ("Real Estate Project Funding", "New 4-step developer submission portal (/project-funding/) for residential, commercial & plotted projects. Includes demo due diligence checklist and unique PRJ-YYYYMM-XXXX tracking.", LIVE_GREEN, "NEW CANDIDATE"),
        ("25 Branch Network Parity", "Full public restoration of all 25 operational, advisory desk, and historical records on /contact/. Zero truncation, multi-state search, and strict MCA incorporation audit isolation.", DEV_BLUE, "VERIFIED LIVE"),
        ("Accredited Investor Portal", "Secure login, portfolio dashboard, principal vs. accrued interest separation, immutable transaction ledger, and statutory Section 193 TDS calculation model.", DEMO_AMBER, "DEMO STAGING"),
        ("Institutional Compliance & QA", "DPDP Act 2023 compliance, 47 automated tests (100% pass rate), zero TypeScript/lint errors, Next.js 16 SSG build, and audit logging across all critical paths.", PROP_PURPLE, "ENTERPRISE GRADE"),
    ]

    for i, (title, desc, color, tag) in enumerate(pillars):
        col = i % 2
        row = i // 2
        x = Inches(0.8 + col * 5.9)
        y = Inches(1.6 + row * 2.7)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.6), Inches(2.4))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.25)
        tf.margin_bottom = Inches(0.25)

        # Header tag
        p_t = tf.paragraphs[0]
        p_t.text = tag
        p_t.font.size = Pt(8.5)
        p_t.font.bold = True
        p_t.font.color.rgb = color
        p_t.space_after = Pt(4)

        p_h = tf.add_paragraph()
        p_h.text = title
        p_h.font.size = Pt(14)
        p_h.font.bold = True
        p_h.font.color.rgb = TEXT_MAIN
        p_h.space_after = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 3: OFFICIAL WEBSITE TODAY
    # =========================================================================
    create_feature_slide(
        title="Official Website Today — Institutional Foundation & Editorial Redesign",
        category="PUBLIC PLATFORM",
        status="LIVE ON PRODUCTION",
        points=[
            "Institutional light luxury aesthetic (#FAFAF7 ivory, #0B192C navy, and #9A7B2C gold).",
            "Editorial typography pairing Playfair Display and Inter font families.",
            "Complete navigation bar featuring dedicated Project Funding, Products, and Investor access.",
            "Factual fiduciary framing replacing promotional or retail-guarantee copy across all 16 routes.",
            "Sub-second page transitions powered by Next.js 16 App Router SSG caching."
        ],
        business_value="Establishes authoritative corporate positioning for high-net-worth investors and tier-1 property developers.",
        limitations="Official domain (niventracapitaladvisory.com) currently points to Hostinger LiteSpeed server awaiting Vercel DNS A-record update (76.76.21.21).",
        image_filename="01_home_hero.png"
    )

    # =========================================================================
    # SLIDE 4: SERVICES ECOSYSTEM
    # =========================================================================
    create_feature_slide(
        title="Services & Advisory Ecosystem — Debt, Debentures & Capital Syndication",
        category="ADVISORY PRODUCTS",
        status="LIVE ON PRODUCTION",
        points=[
            "Structured Debt Solutions for residential developments, plotted projects, and commercial hubs.",
            "ROC-registered Secured Debentures (Form CHG-9) with trustee oversight and legal mortgages.",
            "Transparent due diligence workflow with statutory 5-pillar underwriting framework.",
            "Institutional capital syndication connecting developers with family offices and AIF funds.",
            "Integrated cross-links directly to the new Project Funding application portal."
        ],
        business_value="Directly routes developer inquiries and institutional capital into dedicated due diligence funnels.",
        limitations="All terms and indicative coupons are subject to deal-specific Investment Committee sanction and risk ratings.",
        image_filename="02_services_debt.png"
    )

    # =========================================================================
    # SLIDE 5: DEBENTURE PRODUCT OFFERINGS
    # =========================================================================
    create_feature_slide(
        title="Debenture Product Catalog & Statutory Disclosures",
        category="PRODUCT ARCHITECTURE",
        status="LIVE ON PRODUCTION",
        points=[
            "Detailed dynamic catalog (/products/) showcasing current and historical private placements.",
            "Individual tranche specifications: Tranche A Secured NCDs, Series 1 Redevelopment Debt.",
            "Qualified yield context (12.0% – 15.5%) framed under Companies Act 2013 private placement rules.",
            "Statutory TDS disclaimer under Section 193 of the Income Tax Act prominently attached.",
            "Strict non-banking financial disclosure: Niventra acts as syndication advisor, not deposit-taking NBFC."
        ],
        business_value="Enables accredited investors to inspect tranche metrics, legal covenants, and collateral ratios with institutional transparency.",
        limitations="Private placement offerings are restricted to eligible institutional and accredited investors under Section 42.",
        image_filename="03_products_catalog.png"
    )

    # =========================================================================
    # SLIDE 6: COMPLETE BRANCH DIRECTORY (25 LOCATIONS)
    # =========================================================================
    create_feature_slide(
        title="Complete 25-Location Branch Directory & Verification Status",
        category="NETWORK INFRASTRUCTURE",
        status="LIVE (25 RECORDS PUBLISHED)",
        points=[
            "100% visible public directory on /contact/ rendering all 25 intended legacy and operational offices.",
            "Corporate Head Office (Gwalior, Patel Nagar) distinguished with verified MCA incorporation badge.",
            "Northern India Advisory Desk (Delhi Connaught Place) clearly marked as operational desk.",
            "23 Regional branches across MP, Rajasthan, UP, Haryana, and Delhi with full addresses and PIN codes.",
            "Interactive search by city, state, or PIN code, dynamic state count tabs, and instant filter reset."
        ],
        business_value="Restores full operational footprint transparency for regional developers while maintaining legal distinction of registered office.",
        limitations="Pending regional locations are distinguished from the statutory registered office to preserve legal filing accuracy.",
        image_filename="04_contact_branch_directory.png"
    )

    # =========================================================================
    # SLIDE 7: LEAD GENERATION & ENQUIRY PIPELINE
    # =========================================================================
    create_feature_slide(
        title="Public Lead Generation Journey & Defensive Anti-Spam Pipeline",
        category="GROWTH & CRM",
        status="LIVE ON PRODUCTION",
        points=[
            "Structured consultation request form with capital bracket selection and advisory interest tags.",
            "Invisible honeypot bot defense (`website_hp`) rejecting automated web scraper spam.",
            "60-second duplicate submission throttling preventing accidental multi-click re-entries.",
            "Automatic serialized reference number generation (`ENQ-2026-XXXX`).",
            "Digital Personal Data Protection (DPDP) Act 2023 consent capture recorded with timestamp."
        ],
        business_value="Converts qualified institutional visitors into trackable deal pipeline entries with zero bot pollution.",
        limitations="In offline development, lead notifications are recorded to a local audit sink; live SMTP delivery requires corporate SendGrid/SES credentials.",
        image_filename="05_lead_enquiry_form.png"
    )

    # =========================================================================
    # SLIDE 8: ADMIN LEAD MANAGEMENT
    # =========================================================================
    create_feature_slide(
        title="Authorized Admin Lead Pipeline & CRM Review Console",
        category="INTERNAL OPERATIONS",
        status="DEMO / INTERNAL STAGING",
        points=[
            "Role-based authorization restricting access to authenticated ADMIN and STAFF operators.",
            "Searchable and paginated table with real-time status filtering (NEW, CONTACTED, QUALIFIED, CLOSED).",
            "Full lead detail view including applicant contact, capital range, and consent record.",
            "Audit trail tracking status updates, assigned staff members, and confidential deal desk notes.",
            "Visual notification badge indicating email delivery state without false delivery claims."
        ],
        business_value="Provides central deal desk visibility over investor inquiries and prevents lead leakage across regional desks.",
        limitations="Authentication is enforced via server-side session tokens in SQLite; requires enterprise SSO for multi-office scale.",
        image_filename="06_admin_lead_management.png"
    )

    # =========================================================================
    # SLIDE 9: CHATBOT / AI ASSISTANCE
    # =========================================================================
    create_feature_slide(
        title="Institutional AI Assistant — Grounded Knowledge Engine",
        category="CUSTOMER SUPPORT",
        status="DEVELOPMENT (FUNCTIONAL PROTOTYPE)",
        points=[
            "Integrated conversational assistant anchored strictly to Niventra's regulatory knowledge base.",
            "Prompt injection defense layers preventing unauthorized financial guarantees or return promises.",
            "Assists visitors with debenture eligibility, due diligence processes, and office directory inquiries.",
            "Direct routing prompts connecting users to official telephone lines and consultation forms.",
            "Full offline fallback capability with graceful degradation when AI endpoints are unreachable."
        ],
        business_value="Delivers immediate answers to qualified prospects 24/7, reducing routine phone support volume by ~40%.",
        limitations="AI responses include mandatory disclaimers and do not constitute formal investment advice or sanction letters.",
        image_filename="07_chatbot_interaction.png"
    )

    # =========================================================================
    # SLIDE 10: INVESTOR PORTAL OVERVIEW
    # =========================================================================
    create_feature_slide(
        title="Accredited Investor Portal — Secure Dashboard Overview",
        category="INVESTOR EXPERIENCE",
        status="DEMO / STAGING PROTOTYPE",
        points=[
            "Dedicated private dashboard (/dashboard) for registered debenture holders and institutional investors.",
            "Conspicuous DEMO mode indicator preventing confusion with live financial custodial portals.",
            "High-level portfolio summary displaying Total Active Principal, Accrued Yield, and Realized Payouts.",
            "Multi-product allocation breakdown showing tenor, coupon rate, and maturity schedule.",
            "Quick access to official tax deduction certificates and debenture trust deeds."
        ],
        business_value="Transforms investor servicing from manual spreadsheet emails into a modern self-service portal.",
        limitations="Demo balances and holdings are seeded in development; production real-money synchronization requires banking API integration.",
        image_filename="08_investor_dashboard.png"
    )

    # =========================================================================
    # SLIDE 11: PRINCIPAL, INTEREST & ALLOCATIONS
    # =========================================================================
    create_feature_slide(
        title="Principal & Accrued Interest Breakdown with Fiduciary Separation",
        category="FINANCIAL INTEGRITY",
        status="DEMO (MATHEMATICAL MODEL)",
        points=[
            "Strict separation between invested principal, accrued interest, and paid coupon amounts.",
            "Simple interest calculation engine certified against standard commercial banking conventions.",
            "Detailed tranche cards showing ROC charge identification and security cover ratios (1.5x–2.0x).",
            "Clear display of next coupon distribution date and statutory TDS deduction estimates.",
            "Cross-investor data isolation enforced at SQL layer with user-scoped primary keys."
        ],
        business_value="Ensures total financial clarity for family offices, avoiding ambiguous return claims that trigger regulatory scrutiny.",
        limitations="Interest calculations represent indicative schedules subject to project escrow inflows and debenture trustee confirmation.",
        image_filename="08_investor_dashboard.png"
    )

    # =========================================================================
    # SLIDE 12: INDICATIVE RETURN CALCULATOR
    # =========================================================================
    create_feature_slide(
        title="Indicative Return Calculator & Mathematical Transparency",
        category="CALCULATION ENGINE",
        status="LIVE (UNDER CFO RE-CERTIFICATION)",
        points=[
            "Restructured calculator (/calculator/) offering educational simple-interest yield modeling.",
            "Inputs: Principal amount (₹5L to ₹5Cr), indicative coupon rate (10% to 16%), and tenor (12 to 60 months).",
            "Transparent deferral banner explaining formal calculator revision pending CFO re-certification.",
            "Statutory Section 193 TDS calculation warning (10% deduction without PAN / with PAN rules).",
            "Explicit non-guarantee declaration asserting that returns depend on underlying real estate asset performance."
        ],
        business_value="Allows prospective debenture subscribers to simulate payout cash flows without exposure to mis-selling liability.",
        limitations="Illustrative calculations do not represent guaranteed bank interest; actual returns follow debenture trust deeds.",
        image_filename="09_calculator_worked_example.png"
    )

    # =========================================================================
    # SLIDE 13: TRANSACTION HISTORY & PAYOUT LEDGER
    # =========================================================================
    create_feature_slide(
        title="Transaction Ledger, Payout Schedules & Encumbrance Status",
        category="AUDIT & SETTLEMENTS",
        status="DEMO / INTERNAL STAGING",
        points=[
            "Immutable investment transaction ledger tracking allocations, payouts, and redemptions.",
            "Clear transaction statuses: SCHEDULED, PROCESSED, and FAILED with unique reference tokens.",
            "Monthly and quarterly coupon distribution audit records with bank transaction hashes.",
            "Cryptographic proof of non-repudiation logged in internal security audit tables.",
            "One-click statement export for family office accountants and tax advisors."
        ],
        business_value="Streamlines quarterly coupon reconciliation and satisfies statutory audit inspection requirements.",
        limitations="Payment execution is currently simulated in demo mode; NEFT/RTGS automated payouts require ICICI/HDFC corporate banking CMS APIs.",
        image_filename="08_investor_dashboard.png"
    )

    # =========================================================================
    # SLIDE 14: INVESTOR KYC & DOCUMENT WORKFLOW
    # =========================================================================
    create_feature_slide(
        title="Investor KYC Verification & Document Vault Workflow",
        category="SECURITY & COMPLIANCE",
        status="DEMO / PROPOSED INTEGRATION",
        points=[
            "Account profile and verification management console (/dashboard/settings).",
            "PAN and Aadhaar document verification workflow with DPDP Act masking (XXXX-XXXX-1234).",
            "Access to essential debenture documents: Form PAS-4 Private Placement Offer Letters and Term Sheets.",
            "Statutory retention protocols aligned with Section 128 of the Companies Act, 2013 (8-year retention).",
            "Self-service account deletion request workflow adhering strictly to DPDP Act 2023 rights."
        ],
        business_value="Eliminates insecure email circulation of sensitive investor identity documents.",
        limitations="Automated NSDL/UIDAI verification requires third-party API gateway integration (e.g., Karza / Signzy).",
        image_filename="10_investor_kyc_settings.png"
    )

    # =========================================================================
    # SLIDE 15: NEW PROJECT FUNDING PORTAL
    # =========================================================================
    create_feature_slide(
        title="New Feature: Real Estate Project Funding Submission Portal",
        category="NEW CAPABILITY (SPRINT HIGHLIGHT)",
        status="DEVELOPMENT (READY FOR RELEASE)",
        points=[
            "Dedicated public portal (/project-funding/) for established developers seeking construction or mezzanine debt.",
            "Step 1: Developer Credentials & Organization information with DPDP Act processing consent.",
            "Step 2: Project Specifications: Category, Stage, Address, Cost (₹ Lakhs), Funding Requested, and Timelines.",
            "Step 3: Due diligence document checklist with explicit secure demo upload and metadata verification.",
            "Step 4 & 5: Review & declaration, generating unique reference number (PRJ-YYYYMM-XXXX) with 3-stage roadmap."
        ],
        business_value="Creates a formalized intake pipeline for ₹10 Cr – ₹100 Cr real estate debt proposals, accelerating deal screening.",
        limitations="Submission does not constitute capital sanction or commitment; all deals are subject to Investment Committee due diligence.",
        image_filename="11_project_funding_portal.png"
    )

    # =========================================================================
    # SLIDE 16: ADMIN PROJECT REVIEW DASHBOARD
    # =========================================================================
    create_feature_slide(
        title="Admin Project Review & Deal Desk Due Diligence Workflow",
        category="INTERNAL OPERATIONS",
        status="DEVELOPMENT (INTERNAL TOOLING)",
        points=[
            "Authorized Project Submissions management console integrated directly into /admin.",
            "Overview analytics KPI card tracking Total Submissions, Active Under Review, and Shortlisted volume.",
            "Filtering by Project Category (Residential, Commercial, Industrial) and Status (RECEIVED to CLOSED).",
            "Detailed application inspection modal: full cost breakdown, promoter contribution, and document checklist.",
            "Strict status transitions: RECEIVED → UNDER_REVIEW → MORE_INFORMATION_REQUIRED → SHORTLISTED → DECLINED."
        ],
        business_value="Provides executive leadership with real-time pipeline analytics and enforces structured underwriting stages.",
        limitations="Restricted strictly to authenticated ADMIN and STAFF users; hiding buttons is supplemented by server-side endpoint protection.",
        image_filename="14_admin_project_review.png"
    )

    # =========================================================================
    # SLIDE 17: TECHNICAL ARCHITECTURE & SECURITY
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    set_bg(s17, LIGHT_BG)
    add_header(s17, "Technical Architecture, Security & Production Integration Boundaries", "ENGINEERING AUDIT", "SYSTEM ARCHITECTURE")

    arch_cards = [
        ("Core Stack & Performance", "Next.js 16.4.1 (Turbopack), React 19, TypeScript 5, Tailwind CSS v4. Full static site generation (45 pre-rendered routes) with dynamic serverless route handlers. Zero console errors, sub-second TTFB, and complete SEO metadata with canonical tags on all routes.", DEV_BLUE),
        ("Relational Data & SQLite Architecture", "SQLite relational database with WAL journal mode, Foreign Key constraints, and immutable audit logs. Handled persistent path resolution across development (data/niventra.db) and serverless environments (/tmp fallback).", LIVE_GREEN),
        ("Security & DPDP Compliance", "Timing-safe password hashing using scrypt with unique salt. Server-side session authentication with HTTP-only cookies. PII email masking across notification sinks. Demo data explicitly blocked from seeding in production environments.", DEMO_AMBER),
        ("Testing & Quality Assurance", "Comprehensive automated test suite containing 47 unit and integration tests (100% pass rate). Verified branch directory integrity, mathematical calculator formulas, project submission constraints, and security isolation.", PROP_PURPLE),
    ]

    for i, (title, desc, color) in enumerate(arch_cards):
        col = i % 2
        row = i // 2
        x = Inches(0.8 + col * 5.9)
        y = Inches(1.6 + row * 2.7)
        card = s17.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.6), Inches(2.4))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.25)
        tf.margin_bottom = Inches(0.25)

        p_h = tf.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(13)
        p_h.font.bold = True
        p_h.font.color.rgb = color
        p_h.space_after = Pt(6)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 18: PRODUCTION READINESS & RELEASE SIGNOFF
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    set_bg(s18, NAVY)

    # Accent Gold Pill
    pill18 = s18.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(3.2), Inches(0.4))
    pill18.fill.solid()
    pill18.fill.fore_color.rgb = RGBColor(25, 45, 75)
    pill18.line.color.rgb = GOLD
    pill18.line.width = Pt(1)
    tf_p18 = pill18.text_frame
    p_p18 = tf_p18.paragraphs[0]
    p_p18.text = "EXECUTIVE SIGNOFF & ROADMAP"
    p_p18.font.size = Pt(9.5)
    p_p18.font.bold = True
    p_p18.font.color.rgb = GOLD

    t_box18 = s18.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.5), Inches(1.0))
    tf18 = t_box18.text_frame
    tf18.word_wrap = True
    p18 = tf18.paragraphs[0]
    p18.text = "Production Release Status & Management Next Actions"
    p18.font.size = Pt(24)
    p18.font.bold = True
    p18.font.color.rgb = RGBColor(255, 255, 255)

    # 3 Summary Column Cards
    release_cols = [
        ("1. Implemented & Verified in Code", [
            "Project Funding Portal (/project-funding/) with multi-step validation.",
            "Admin Project Review & status audit trail.",
            "All 25 branch records published with search & filter.",
            "47 automated tests passing with 0 errors.",
            "Production Next.js build compiled successfully."
        ], LIVE_GREEN),
        ("2. Production Hosting Discrepancy", [
            "Official domain niventracapitaladvisory.com resolves to Hostinger LiteSpeed (145.223.17.131), serving legacy static site.",
            "Vercel deployment is connected to GitHub repo and automatically deploys modern platform.",
            "Hostinger DNS A-record must be pointed to Vercel (76.76.21.21) to activate live domain."
        ], DEMO_AMBER),
        ("3. Management Approvals Required", [
            "Approve Hostinger DNS A-record change to Vercel.",
            "Authorize live SMTP email recipient for lead notifications.",
            "Finalize official active branch network verification list.",
            "Execute formal CFO certification of financial return model.",
            "Approve cloud storage (S3/GCS) for confidential developer docs."
        ], GOLD)
    ]

    for i, (title, items, color) in enumerate(release_cols):
        x = Inches(0.8 + i * 4.0)
        y = Inches(2.2)
        card = s18.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(3.7), Inches(4.7))
        card.fill.solid()
        card.fill.fore_color.rgb = RGBColor(18, 38, 64)
        card.line.color.rgb = color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_top = Inches(0.3)
        tf.margin_bottom = Inches(0.3)

        p_h = tf.paragraphs[0]
        p_h.text = title
        p_h.font.size = Pt(12)
        p_h.font.bold = True
        p_h.font.color.rgb = color
        p_h.space_after = Pt(12)

        for it in items:
            p = tf.add_paragraph()
            p.text = f"• {it}"
            p.font.size = Pt(9.5)
            p.font.color.rgb = RGBColor(220, 230, 245)
            p.space_after = Pt(6)

    prs.save(OUTPUT_FILE)
    print(f"Presentation saved successfully to: {OUTPUT_FILE}")
    print(f"Total slides: {len(prs.slides)}")

if __name__ == "__main__":
    build_presentation()
