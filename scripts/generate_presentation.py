import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Tokens
    NAVY = RGBColor(11, 25, 44)         # #0B192C
    LIGHT_BG = RGBColor(250, 250, 247)  # #FAFAF7
    CARD_BG = RGBColor(255, 255, 255)   # #FFFFFF
    BORDER_COLOR = RGBColor(226, 232, 240)
    GOLD = RGBColor(197, 168, 128)      # #C5A880
    GOLD_LIGHT = RGBColor(245, 239, 230)
    TEXT_MAIN = RGBColor(26, 26, 26)    # #1A1A1A
    TEXT_MUTED = RGBColor(92, 92, 92)   # #5C5C5C
    TEXT_LIGHT = RGBColor(138, 138, 138)
    EMERALD = RGBColor(5, 150, 105)     # #059669
    EMERALD_BG = RGBColor(236, 253, 245)
    AMBER = RGBColor(217, 119, 6)       # #D97706
    AMBER_BG = RGBColor(254, 243, 199)
    BLUE = RGBColor(29, 78, 216)        # #1D4ED8
    BLUE_BG = RGBColor(239, 246, 255)

    blank_layout = prs.slide_layouts[6]
    logo_path = os.path.join(os.getcwd(), "public", "assets", "images", "logo.png")

    def add_header(slide, title_text, category_text="NIVENTRA CAPITAL ADVISORY"):
        # Header banner
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = cat_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category_text.upper()
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = GOLD

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_MAIN

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE (Dark Navy)
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, NAVY)

    # Accent Gold Line
    line = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(2.5), Inches(0.06))
    line.fill.solid()
    line.fill.fore_color.rgb = GOLD
    line.line.color.rgb = GOLD

    # Brand Title Box
    tbox = s1.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11.7), Inches(3.2))
    tf = tbox.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "NIVENTRA CAPITAL ADVISORY"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = GOLD

    p2 = tf.add_paragraph()
    p2.text = "Digital Platform Architecture & Investor Experience"
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(255, 255, 255)

    p3 = tf.add_paragraph()
    p3.text = "Branch Directory Authenticity • End-to-End Lead Pipeline • Accredited Client Portal"
    p3.font.size = Pt(16)
    p3.font.color.rgb = RGBColor(200, 210, 225)

    # Presenter Metadata Box
    meta_box = s1.shapes.add_textbox(Inches(0.8), Inches(5.6), Inches(11.7), Inches(1.2))
    tf_m = meta_box.text_frame
    pm = tf_m.paragraphs[0]
    pm.text = "EXECUTIVE MANAGEMENT PRESENTATION • OCTOBER 2026\nPresented by: Chief Technology Officer & Digital Product Owner\nEnvironment: Next.js 16.4 • React 19 • TypeScript • Scrypt Cryptography"
    pm.font.size = Pt(11)
    pm.font.color.rgb = RGBColor(160, 175, 195)

    # -------------------------------------------------------------
    # SLIDE 2: EXECUTIVE OVERVIEW & OBJECTIVES
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, LIGHT_BG)
    add_header(s2, "Executive Overview & Core Sprint Objectives")

    cards = [
        ("Branch Directory Authenticity", "Audit and isolate 24 legacy locality references. Publicly publish only verified Corporate Head Office (Gwalior) while preserving regional points in an internal audit register.", GOLD),
        ("Lead Generation Pipeline", "Build an automated consultation intake journey with bot honeypots, 60s duplicate throttling, serialized reference numbering, and observable mock delivery status.", BLUE),
        ("Accredited Investor Portal", "Establish client workspace with multi-tab holdings ledgers, simple-interest indicative calculation engine, and strict cross-investor authorization guards.", EMERALD),
        ("Fiduciary & DPDP Compliance", "Enforce Digital Personal Data Protection Act 2023 consent, PII masking, statutory TDS disclosures under Section 193, and zero unapproved financial claims.", NAVY),
    ]

    for i, (title, desc, color) in enumerate(cards):
        left = Inches(0.8 + (i % 2) * 6.0)
        top = Inches(1.8 + (i // 2) * 2.6)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 3: CURRENT OFFICIAL WEBSITE AUDIT
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, LIGHT_BG)
    add_header(s3, "Official Website Baseline Audit Findings")

    findings = [
        ("Defect 1: Unverified Branch Directory", "Contact page listed 24 regional partner towns (Neemuch, Vidisha, Shivpuri, etc.) lacking street addresses, premise identifiers, or lease documentation. Delhi entry suffered UTF-8 mojibake (â€¢). Gurugram entry had PIN code mismatch."),
        ("Defect 2: Ephemeral Lead Storage", "Enquiries were written to local/serverless filesystem storage (/tmp). On serverless hosting (Vercel), container termination caused enquiry records to be wiped, with no external email alert sent to staff."),
        ("Defect 3: Missing Statutory TDS Caveats", "Illustrative returns on debenture products were presented without clear Section 193/194A Income Tax TDS caveats or clear explanation of simple interest vs mutual fund compounding."),
    ]

    for i, (title, desc) in enumerate(findings):
        top = Inches(1.8 + i * 1.7)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.7), Inches(1.4))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = AMBER

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 4: ENHANCED DESIGN DIRECTION & BRAND HERITAGE
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, LIGHT_BG)
    add_header(s4, "Enhanced Institutional Design Direction")

    pillars = [
        ("Light Institutional Palette", "Deep navy (#0B192C) anchors institutional gravity, paired with clean ivory backgrounds and subtle gold accents (#C5A880) to reflect private wealth heritage."),
        ("Protected Real-Estate Assets", "All original high-resolution visual assets (re_hero_skyline, re_commercial_grade_a, etc.) and specialized advisory copy remain fully intact."),
        ("Accessible Mobile Typography", "Eliminated aggressive pop-ups and marketing noise. Emphasized crisp typography, high contrast ratios, and touch-target accessibility (min 44px)."),
    ]

    for i, (title, desc) in enumerate(pillars):
        left = Inches(0.8 + i * 4.0)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = NAVY

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 5: SERVICES & STRUCTURED DEBENTURES
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, LIGHT_BG)
    add_header(s5, "Corporate Services & Secured Debenture Structuring")

    services = [
        ("Secured Debenture Structuring", "Private placement non-convertible debentures (NCDs) backed by first pari-passu legal charges registered with the Registrar of Companies (ROC Form CHG-9). Structured coupon distributions.", GOLD),
        ("Urban Redevelopment Debt", "Mezzanine and senior credit facilities for urban renewal, residential redevelopment, and commercial revitalization projects with designated escrow cash-flow mechanisms.", BLUE),
        ("Institutional Due Diligence", "Fiduciary risk governance framework: comprehensive asset valuation, promoter background verification, independent title clearance, and debenture trustee oversight.", EMERALD),
    ]

    for i, (title, desc, color) in enumerate(services):
        left = Inches(0.8 + i * 4.0)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 6: BRANCH DIRECTORY ARCHITECTURE
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, LIGHT_BG)
    add_header(s6, "Branch Directory Architecture & Verification Status")

    card1 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0))
    card1.fill.solid()
    card1.fill.fore_color.rgb = CARD_BG
    card1.line.color.rgb = BORDER_COLOR
    tf1 = card1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Verified Public Directory (Live)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD
    p2 = tf1.add_paragraph()
    p2.text = "• Corporate Head Office (Gwalior): Patel Nagar City Centre, Gwalior - 474001. Verified under MCA filings.\n• Delhi Advisory Desk: The Nukleus Center, Shivaji Stadium Metro Station, Connaught Place - 110001 (Marked PENDING CONFIRMATION; in-person by appointment).\n• Interactive UI: Instant search by city, state, or PIN code, dynamic state counts, responsive cards."
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED

    card2 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    card2.fill.solid()
    card2.fill.fore_color.rgb = CARD_BG
    card2.line.color.rgb = BORDER_COLOR
    tf2 = card2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Internal Audit Registry (Isolated)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = AMBER
    p2 = tf2.add_paragraph()
    p2.text = "• 22 Regional Locations: Held strictly in legacy-unverified.ts. Not displayed to public.\n• Audit Defect Analysis: Identified lack of premise numbers in towns like Neemuch, Vidisha, Sehore.\n• Gurugram Discrepancy: Udyog Vihar flagged for PIN 122016 vs legacy 122001.\n• Management Protocol: Provided verification checklist requiring physical lease deeds before publishing."
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 7: LEAD GENERATION & NOTIFICATION PIPELINE
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, LIGHT_BG)
    add_header(s7, "Lead Generation, Deduplication & Safe Dispatch")

    steps = [
        ("1. Bot & Spam Shields", "Invisible honeypot field (website_hp) terminates automated submissions. 60-second duplicate submission window rejects identical double-submits idempotently.", NAVY),
        ("2. Reference Generation", "Unique serialized reference ID (ENQ-2026-0001) generated immediately for tracking across client and staff communication.", BLUE),
        ("3. Provider-Neutral Dispatch", "Decoupled notification adapter dispatches to live email gateway when configured, or writes to safe local audit sink (email_sink.log) in development.", GOLD),
        ("4. Observable Status", "Admin console displays transparent badge: 'MOCK SINK (Logged)' vs 'EXTERNAL DISPATCHED'. Never falsely claims delivery.", EMERALD),
    ]

    for i, (title, desc, color) in enumerate(steps):
        left = Inches(0.8 + i * 2.95)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(2.8), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 8: INVESTOR PORTAL OVERVIEW & AUTH
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, LIGHT_BG)
    add_header(s8, "Accredited Investor Portal & Security Controls")

    features = [
        ("Timing-Safe Cryptography", "Passwords secured with scrypt hashing (64-byte derived keys, 16-byte random salts). Session authentication uses HTTP-only secure cookies with lax same-site policies.", NAVY),
        ("Cross-Investor Isolation", "Strict server-side authorization: regular investors cannot access another investor's records, consultations, or KYC documents by altering URLs or API payloads (403 Forbidden).", EMERALD),
        ("Role-Based Access Control", "Granular four-tier hierarchy: PUBLIC, INVESTOR, STAFF, and ADMIN. Enforced across all API routes and server components.", GOLD),
        ("Immutable Audit Trails", "Every login, failed authentication, document download, and account status change is recorded in an immutable audit_logs database table.", BLUE),
    ]

    for i, (title, desc, color) in enumerate(features):
        left = Inches(0.8 + (i % 2) * 6.0)
        top = Inches(1.8 + (i // 2) * 2.6)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 9: INDICATIVE RETURN CALCULATOR
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, LIGHT_BG)
    add_header(s9, "Indicative Yield Calculator & Fiduciary Math")

    c1 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0))
    c1.fill.solid()
    c1.fill.fore_color.rgb = CARD_BG
    c1.line.color.rgb = BORDER_COLOR
    tf1 = c1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "Mathematical Principles"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p2 = tf1.add_paragraph()
    p2.text = "• Simple Interest Standard: Private debentures distribute periodic coupon payouts. Unlike mutual fund SIP calculators, they do not compound.\n• Strict Input Clamping: Enforces boundary ranges (₹1 Lakh to ₹10 Crore; 12% to 16% p.a.). Guards against non-numeric or negative inputs.\n• Payout Frequencies: Monthly, Quarterly, Semi-Annual, Annual, and Cumulative at Maturity."
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED

    c2 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = BORDER_COLOR
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Statutory Caveats & Taxes"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = GOLD
    p2 = tf2.add_paragraph()
    p2.text = "• Section 193/194A TDS: Explicitly displays estimated 10% withholding tax on gross coupon interest.\n• Non-Guaranteed Disclaimer: Calculations are marked as illustrative arithmetic models, not binding commitments.\n• Credit Risk Disclosure: Reminds investors that allocations are subject to Debenture Trust Deeds and borrower credit quality."
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 10: INVESTMENT HOLDINGS & LEDGERS
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, LIGHT_BG)
    add_header(s10, "Portfolio Holdings, Ledgers & Lifecycle Tracking")

    boxes = [
        ("Total Principal Invested", "Face value of debentures allocated across approved private placement tranches. Conspicuously marked [DEMO]."),
        ("Interest Paid to Date", "Certified cash distributions actually disbursed to investor's bank account via CMS/NEFT banking rails."),
        ("Accrued Interest (YTD)", "Interest accrued in accounting system under contractual simple interest schedule, pending upcoming payout date."),
        ("Transaction Ledger", "Detailed audit history of principal inflows, coupon disbursements, and statutory tax deductions with bank UTR references."),
    ]

    for i, (title, desc) in enumerate(boxes):
        left = Inches(0.8 + (i % 2) * 6.0)
        top = Inches(1.8 + (i // 2) * 2.6)
        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = NAVY

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 11: EXECUTIVE DESK & ADMIN CONSOLE
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, LIGHT_BG)
    add_header(s11, "Executive Desk & Operational Deal Pipeline")

    admin_cols = [
        ("CRM Lead Pipeline", "Centralized lead status tracking: NEW, IN_REVIEW, CONTACTED, QUALIFIED, FOLLOW_UP, CONVERTED, and CLOSED. Operators assign leads and append confidential follow-up notes.", NAVY),
        ("Investor KYC Review", "Review submitted identity credentials (PAN, Aadhaar) with masked identifiers. Administrators verify or reject submissions with explicit audit reasoning.", EMERALD),
        ("Audit Telemetry", "Comprehensive traceability: Every administrative update, credential submission, and document access event is logged with actor email, role, and IP address.", BLUE),
    ]

    for i, (title, desc, color) in enumerate(admin_cols):
        left = Inches(0.8 + i * 4.0)
        card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 12: TECHNICAL ARCHITECTURE & DATABASE
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, LIGHT_BG)
    add_header(s12, "Technical Architecture & Storage Decoupling")

    arch_points = [
        ("Decoupled DatabaseAdapter", "Built a provider-neutral interface in src/lib/database/adapter.ts. The application code is entirely agnostic of whether it is querying local SQLite or managed cloud PostgreSQL.", NAVY),
        ("Serverless PostgreSQL Ready", "Evaluated Neon and Supabase for production release. Zero-connection exhaustion over HTTP/WebSockets poolers, automated WAL point-in-time recovery, and SOC2 compliance.", BLUE),
        ("Next.js 16 & Turbopack", "Production build compiles in 2.5 seconds with zero diagnostic errors across 41 static and dynamic endpoints. High performance server components with optimized client bundles.", GOLD),
    ]

    for i, (title, desc, color) in enumerate(arch_points):
        left = Inches(0.8 + i * 4.0)
        card = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 13: SECURITY, PRIVACY & DPDP ACT
    # -------------------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13, LIGHT_BG)
    add_header(s13, "Data Privacy & DPDP Act 2023 Compliance")

    dpdp_cards = [
        ("Explicit Informed Consent", "All intake forms (Consultation, Registration, KYC) feature mandatory, unbundled consent checkboxes explicitly referencing processing purposes under the DPDP Act 2023.", EMERALD),
        ("Cryptographic PII Masking", "Personal email addresses in notification logs and identity numbers in KYC tables (PAN: AAAPN*****1F) are permanently masked to prevent personal data leaks.", BLUE),
        ("Statutory Erasure Workflow", "Integrated Account Deletion request flow (/delete-account/) allowing users to exercise their right to erasure, balanced against 8-year financial record retention mandates under PMLA.", NAVY),
    ]

    for i, (title, desc, color) in enumerate(dpdp_cards):
        left = Inches(0.8 + i * 4.0)
        card = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 14: QUALITY ASSURANCE & TEST RESULTS
    # -------------------------------------------------------------
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14, LIGHT_BG)
    add_header(s14, "Quality Assurance & Automated Verification Results")

    tests = [
        ("Automated Test Suite", "42 / 42 Tests Passed (100%)", "Covers canonical routes, math accuracy, TDS caveats, branch search/filtering, cross-investor authorization, and demo safety guards in 376ms.", EMERALD),
        ("Static Typechecking", "0 TypeScript Errors (tsc --noEmit)", "Strict typing across all components, API route handlers, database adapters, and calculation utilities.", NAVY),
        ("ESLint Quality Gate", "0 Lint Warnings / Errors", "Clean code standards adherence, zero unused variables, and proper hook dependency management.", BLUE),
        ("Next.js Production Build", "41 / 41 Routes Compiled", "Turbopack production build succeeds in 2.5s with all dynamic API routes and static pages optimized.", GOLD),
    ]

    for i, (title, badge, desc, color) in enumerate(tests):
        left = Inches(0.8 + (i % 2) * 6.0)
        top = Inches(1.8 + (i // 2) * 2.6)
        card = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(2.3))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = TEXT_MAIN

        p2 = tf.add_paragraph()
        p2.text = badge
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = color

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 15: LIMITATIONS & MANAGEMENT DECISIONS
    # -------------------------------------------------------------
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15, LIGHT_BG)
    add_header(s15, "Current Limitations & Required Management Decisions")

    decisions = [
        ("Decision 1: Regional Branch Approvals", "Provide verified physical lease agreements and premise identifiers before publishing any of the 22 legacy regional partner locations.", AMBER),
        ("Decision 2: Authorized Staff Lead Mailbox", "Designate the approved corporate mailbox (e.g. inquiries@niventracapitaladvisory.com) to receive inbound consultation alerts.", BLUE),
        ("Decision 3: Managed PostgreSQL Connection", "Provision serverless Postgres (Neon / Supabase) and configure DATABASE_URL in Vercel to transition beyond ephemeral /tmp storage.", NAVY),
        ("Decision 4: Outbound Email Gateway", "Configure transactional email gateway (Resend / AWS SES) and verify domain DNS records (SPF, DKIM, DMARC) for automated lead delivery.", GOLD),
    ]

    for i, (title, desc, color) in enumerate(decisions):
        top = Inches(1.8 + i * 1.3)
        card = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.7), Inches(1.15))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = BORDER_COLOR

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MUTED

    # -------------------------------------------------------------
    # SLIDE 16: LIVE DEMONSTRATION & CLOSING (Dark Navy)
    # -------------------------------------------------------------
    s16 = prs.slides.add_slide(blank_layout)
    set_slide_background(s16, NAVY)

    line = s16.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(2.5), Inches(0.06))
    line.fill.solid()
    line.fill.fore_color.rgb = GOLD
    line.line.color.rgb = GOLD

    tbox = s16.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(4.8))
    tf = tbox.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "LIVE DEMONSTRATION WALKTHROUGH"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = GOLD

    p2 = tf.add_paragraph()
    p2.text = "Ready for Management Walkthrough"
    p2.font.size = Pt(32)
    p2.font.bold = True
    p2.font.color.rgb = RGBColor(255, 255, 255)

    p3 = tf.add_paragraph()
    p3.text = "\nReproducible Presentation Accounts (Local Dev Server: http://localhost:3000):\n• Client Portal Persona: investor@example.com  (Pass: DemoInvestor2026!#)\n• Desk Staff Persona:   staff@niventra.local   (Pass: DemoStaff2026!#)\n• Executive Desk Admin: admin@niventra.local   (Pass: DemoAdmin2026!#)\n\nThank you for your review. We welcome your questions."
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(210, 220, 235)

    output_dir = os.path.join(os.getcwd(), "docs", "presentation")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "Niventra_Capital_Advisory_Website_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation generated successfully: {output_path}")

if __name__ == "__main__":
    build_deck()
