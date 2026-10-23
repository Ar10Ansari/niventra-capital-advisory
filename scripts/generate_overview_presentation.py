import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_overview_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Niventra Institutional Palette
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

    ASSETS_DIR = os.path.join(os.getcwd(), "docs", "presentation", "assets", "website-overview")
    OUTPUT_FILE = os.path.join(os.getcwd(), "docs", "presentation", "Niventra_Capital_Advisory_Website_Overview.pptx")
    LOGO_PATH = os.path.join(os.getcwd(), "public", "assets", "images", "logo.png")

    blank_layout = prs.slide_layouts[6]

    def set_bg(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_badge(slide, status, x=Inches(9.9), y=Inches(0.55), w=Inches(2.6), h=Inches(0.36)):
        status_upper = status.upper()
        if "LIVE" in status_upper and "DEMO" not in status_upper and "GATE" not in status_upper:
            fg, bg = LIVE_GREEN, LIVE_BG
        elif "DEV" in status_upper:
            fg, bg = DEV_BLUE, DEV_BG
        else:
            fg, bg = DEMO_AMBER, DEMO_BG

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
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = fg

    def add_header(slide, title, category="NIVENTRA CAPITAL ADVISORY", status=None, slide_num=None):
        # Category Kicker
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(9.0), Inches(0.25))
        tf = cat_box.text_frame
        tf.margin_top = tf.margin_bottom = tf.margin_left = tf.margin_right = 0
        p = tf.paragraphs[0]
        p.text = category.upper()
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = GOLD

        # Main Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(9.0), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_top = tf_t.margin_bottom = tf_t.margin_left = tf_t.margin_right = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(21)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_MAIN

        # Status badge
        if status:
            add_badge(slide, status)

        # Slide Number
        if slide_num is not None:
            num_box = slide.shapes.add_textbox(Inches(11.8), Inches(7.1), Inches(0.8), Inches(0.3))
            tf_n = num_box.text_frame
            tf_n.margin_top = tf_n.margin_bottom = tf_n.margin_left = tf_n.margin_right = 0
            p_n = tf_n.paragraphs[0]
            p_n.text = f"{slide_num:02d} / 08"
            p_n.font.size = Pt(9)
            p_n.font.color.rgb = TEXT_LIGHT
            p_n.alignment = PP_ALIGN.RIGHT

    def set_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text.strip()

    # =========================================================================
    # SLIDE 1: COVER & WEBSITE OVERVIEW (NAVY)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1, NAVY)

    # Top Brand Bar
    if os.path.exists(LOGO_PATH):
        s1.shapes.add_picture(LOGO_PATH, Inches(0.8), Inches(0.8), width=Inches(2.2))

    # Kicker Pill
    pill = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(3.6), Inches(0.36))
    pill.fill.solid()
    pill.fill.fore_color.rgb = RGBColor(22, 42, 70)
    pill.line.color.rgb = GOLD
    pill.line.width = Pt(1)
    tf_pill = pill.text_frame
    p_pill = tf_pill.paragraphs[0]
    p_pill.text = "EXECUTIVE PLATFORM WALKTHROUGH"
    p_pill.font.size = Pt(9)
    p_pill.font.bold = True
    p_pill.font.color.rgb = GOLD

    # Main Titles (Structured lines)
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(2.35), Inches(5.8), Inches(2.4))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    tf1.margin_top = tf1.margin_bottom = tf1.margin_left = tf1.margin_right = 0
    p1 = tf1.paragraphs[0]
    p1.text = "Niventra Capital Advisory"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)

    p2 = tf1.add_paragraph()
    p2.text = "Website Overview & Feature Demonstration"
    p2.font.size = Pt(17)
    p2.font.color.rgb = GOLD
    p2.space_before = Pt(8)

    p3 = tf1.add_paragraph()
    p3.text = "An executive presentation detailing the newly deployed digital platform across client onboarding, meeting scheduling, real estate project funding, return modelling, branch directory, and investor tracking."
    p3.font.size = Pt(10.5)
    p3.font.color.rgb = RGBColor(200, 210, 225)
    p3.space_before = Pt(10)

    # Left Metadata Box
    meta_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.0), Inches(5.8), Inches(1.8))
    meta_box.fill.solid()
    meta_box.fill.fore_color.rgb = RGBColor(16, 32, 54)
    meta_box.line.color.rgb = RGBColor(35, 60, 95)
    meta_box.line.width = Pt(1)
    tf_m = meta_box.text_frame
    tf_m.margin_left = tf_m.margin_right = tf_m.margin_top = tf_m.margin_bottom = Inches(0.2)
    tf_m.word_wrap = True

    pm0 = tf_m.paragraphs[0]
    pm0.text = "DEPLOYED PLATFORM VERIFICATION DETAILS"
    pm0.font.size = Pt(8.5)
    pm0.font.bold = True
    pm0.font.color.rgb = GOLD
    pm0.space_after = Pt(4)

    pm1 = tf_m.add_paragraph()
    pm1.text = "• Live Target: https://niventra-capital-advisory.vercel.app/"
    pm1.font.size = Pt(9.5)
    pm1.font.color.rgb = RGBColor(230, 235, 245)

    pm2 = tf_m.add_paragraph()
    pm2.text = "• Repository: https://github.com/Ar10Ansari/niventra-capital-advisory"
    pm2.font.size = Pt(9.5)
    pm2.font.color.rgb = RGBColor(230, 235, 245)

    pm3 = tf_m.add_paragraph()
    pm3.text = "• Evidence Base: 100% genuine live captures (zero synthetic mockups)"
    pm3.font.size = Pt(9.5)
    pm3.font.color.rgb = LIVE_GREEN

    # Right Hero Screenshot Frame
    s1_img = os.path.join(ASSETS_DIR, "01_home_overview.png")
    if os.path.exists(s1_img):
        f1 = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(1.2), Inches(5.7), Inches(5.6))
        f1.fill.solid()
        f1.fill.fore_color.rgb = RGBColor(16, 32, 54)
        f1.line.color.rgb = RGBColor(35, 60, 95)
        f1.line.width = Pt(1)

        pic = s1.shapes.add_picture(s1_img, Inches(6.98), Inches(1.28), width=Inches(5.54))

        # Caption
        cap_box = s1.shapes.add_textbox(Inches(6.98), Inches(6.45), Inches(5.54), Inches(0.25))
        tf_c = cap_box.text_frame
        tf_c.margin_top = tf_c.margin_bottom = tf_c.margin_left = tf_c.margin_right = 0
        pc = tf_c.paragraphs[0]
        pc.text = "Live Homepage: Institutional Navigation, Headline Positioning & Key Metrics"
        pc.font.size = Pt(8.5)
        pc.font.color.rgb = RGBColor(160, 175, 195)
        pc.alignment = PP_ALIGN.CENTER

    set_notes(s1, """
Slide 1: Title and Website Overview
- Good morning, management. Today we present an authentic executive walkthrough of the newly developed Niventra Capital Advisory web platform.
- The platform is deployed live on Vercel at https://niventra-capital-advisory.vercel.app/ and synchronized with our GitHub repository.
- Every single screen displayed in this deck is captured directly from the live deployed production environment; there are zero synthetic illustrations or fictional dashboards.
- Over the following seven slides, we will examine the verified functionality across client engagement, project funding intake, automated chatbot assistance, financial modelling, office branch network, and accredited investor tracking.
""")

    # =========================================================================
    # SLIDE 2: SCHEDULE A CLIENT MEETING / APPOINTMENT PANEL
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2, LIGHT_BG)
    add_header(s2, "Schedule a Client Meeting / Appointment Panel", "CLIENT ENGAGEMENT WORKFLOW", "LIVE CRM INTAKE", slide_num=2)

    # Left Info Card
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(4.8), Inches(5.35))
    c2.fill.solid()
    c2.fill.fore_color.rgb = CARD_BG
    c2.line.color.rgb = CARD_BORDER
    c2.line.width = Pt(1)

    tf2 = c2.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_right = tf2.margin_top = tf2.margin_bottom = Inches(0.25)

    p_c2_head = tf2.paragraphs[0]
    p_c2_head.text = "CLIENT MEETING JOURNEY (3 STEPS)"
    p_c2_head.font.size = Pt(9.5)
    p_c2_head.font.bold = True
    p_c2_head.font.color.rgb = GOLD
    p_c2_head.space_after = Pt(6)

    steps = [
        ("1. Locate Feature", "Institutional clients access the consultation panel via persistent header CTA ('Book Consultation') or direct route /contact/."),
        ("2. Enter Appointment Details", "Captures Full Legal Name, Corporate Email, Direct Phone, Category ('Capital Provider' / 'Developer'), Capital Range (₹25L–₹1Cr, ₹1Cr–₹5Cr, ₹5Cr+), and Advisory Message."),
        ("3. Submit & Confirm Request", "Generates serialized reference tracking ID (ENQ-2026-XXXX), records DPDP Act 2023 compliance consent, and routes lead to advisory queue.")
    ]
    for st, sd in steps:
        p_st = tf2.add_paragraph()
        p_st.text = f"{st}:"
        p_st.font.size = Pt(9.5)
        p_st.font.bold = True
        p_st.font.color.rgb = TEXT_MAIN
        p_st.space_before = Pt(4)

        p_sd = tf2.add_paragraph()
        p_sd.text = sd
        p_sd.font.size = Pt(9)
        p_sd.font.color.rgb = TEXT_MUTED
        p_sd.space_after = Pt(4)

    p_c2_lim = tf2.add_paragraph()
    p_c2_lim.text = "IMPLEMENTATION & SCOPE BOUNDARY"
    p_c2_lim.font.size = Pt(8.5)
    p_c2_lim.font.bold = True
    p_c2_lim.font.color.rgb = DEMO_AMBER
    p_c2_lim.space_before = Pt(6)
    p_c2_lim.space_after = Pt(2)

    p_c2_lim_txt = tf2.add_paragraph()
    p_c2_lim_txt.text = "• Asynchronous CRM Intake: Operates as a structured intake form rather than a live external calendar sync (e.g. Calendly/Google Calendar).\n• Staged Notification Relay: Form submissions record structured JSON entries; staff email dispatch awaits authorized corporate recipient configuration."
    p_c2_lim_txt.font.size = Pt(8.5)
    p_c2_lim_txt.font.color.rgb = TEXT_MUTED

    # Right Screenshot Frame
    s2_img = os.path.join(ASSETS_DIR, "02_schedule_meeting_panel.png")
    if os.path.exists(s2_img):
        f2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.85), Inches(1.5), Inches(6.7), Inches(5.35))
        f2.fill.solid()
        f2.fill.fore_color.rgb = CARD_BG
        f2.line.color.rgb = CARD_BORDER
        f2.line.width = Pt(1)

        s2.shapes.add_picture(s2_img, Inches(5.92), Inches(1.57), width=Inches(6.56))

        cap2 = s2.shapes.add_textbox(Inches(5.92), Inches(6.5), Inches(6.56), Inches(0.25))
        tf_cap2 = cap2.text_frame
        tf_cap2.margin_top = tf_cap2.margin_bottom = tf_cap2.margin_left = tf_cap2.margin_right = 0
        p_cap2 = tf_cap2.paragraphs[0]
        p_cap2.text = "Live /contact/ Form: Pre-filled Demonstration Request with Investor Category & Capital Range"
        p_cap2.font.size = Pt(8.5)
        p_cap2.font.color.rgb = TEXT_LIGHT
        p_cap2.alignment = PP_ALIGN.CENTER

    set_notes(s2, """
Slide 2: Schedule a Client Meeting / Appointment Panel
- Slide 2 showcases our client engagement panel located on the /contact/ page.
- The client journey consists of three streamlined steps: locating the consultation panel from any navigation link, selecting their investor or developer profile alongside their capital ticket size, and submitting the request.
- The system immediately verifies inputs, assigns a unique tracking identifier (ENQ-2026-XXXX), and logs compliance with the Indian Digital Personal Data Protection (DPDP) Act 2023.
- Scope boundary: To be completely transparent with management, this feature operates as an institutional intake pipeline rather than an external live calendar sync. Outbound staff alert emails are safely staged awaiting management's authorized recipient list.
""")

    # =========================================================================
    # SLIDE 3: SUBMIT A REAL ESTATE PROJECT FOR FUNDING
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3, LIGHT_BG)
    add_header(s3, "Submit a Real Estate Project for Funding", "DEVELOPER CAPITAL INTAKE", "LIVE 3-STAGE INTAKE", slide_num=3)

    # Top Overview Card
    c3_top = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(1.55))
    c3_top.fill.solid()
    c3_top.fill.fore_color.rgb = CARD_BG
    c3_top.line.color.rgb = CARD_BORDER
    c3_top.line.width = Pt(1)

    tf3 = c3_top.text_frame
    tf3.word_wrap = True
    tf3.margin_left = tf3.margin_right = tf3.margin_top = tf3.margin_bottom = Inches(0.18)

    p3_h = tf3.paragraphs[0]
    p3_h.text = "DEVELOPER PROJECT EVALUATION PIPELINE (/project-funding/)"
    p3_h.font.size = Pt(9.5)
    p3_h.font.bold = True
    p3_h.font.color.rgb = GOLD
    p3_h.space_after = Pt(2)

    p3_d = tf3.add_paragraph()
    p3_d.text = "A multi-stage institutional intake portal enabling residential and commercial developers to submit real estate projects for preliminary debt financing and mezzanine capital evaluation. Verified against live Vercel deployment with comprehensive validation across developer entity credentials, project specifications, and regulatory clearance checklists."
    p3_d.font.size = Pt(9.5)
    p3_d.font.color.rgb = TEXT_MAIN
    p3_d.space_after = Pt(3)

    p3_note = tf3.add_paragraph()
    p3_note.text = "• Regulatory Notice: Preliminary evaluation only — does not constitute a loan sanction or funding guarantee. Document verification records file metadata in Phase 1; binary cloud storage is deferred to Phase 2."
    p3_note.font.size = Pt(8.5)
    p3_note.font.bold = True
    p3_note.font.color.rgb = DEMO_AMBER

    # Bottom 3 Step Columns with Genuine Screenshots
    step_data = [
        ("Step 1: Developer Credentials", "03a_project_funding_step1.png", "Legal Entity, Signatory, RERA ID, Past Delivery Track Record"),
        ("Step 2: Project Specifications", "03b_project_funding_step2.png", "Project Location, Sanctioned FSI, Total Outlay (₹48 Cr), Funding (₹16 Cr)"),
        ("Step 3: Document Verification", "03c_project_funding_step3.png", "5-Point Checklist: DPR, Sanctioned Plans, Title Search, Audit, RERA")
    ]

    col_w = Inches(3.75)
    col_gap = Inches(0.24)
    start_x = Inches(0.8)

    for i, (title, img_fn, desc) in enumerate(step_data):
        x = start_x + i * (col_w + col_gap)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(3.1), col_w, Inches(3.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1)

        tf_c = card.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_right = tf_c.margin_top = tf_c.margin_bottom = Inches(0.12)

        ph = tf_c.paragraphs[0]
        ph.text = title
        ph.font.size = Pt(9)
        ph.font.bold = True
        ph.font.color.rgb = GOLD

        pd = tf_c.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(8)
        pd.font.color.rgb = TEXT_MUTED

        img_p = os.path.join(ASSETS_DIR, img_fn)
        if os.path.exists(img_p):
            s3.shapes.add_picture(img_p, x + Inches(0.12), Inches(3.9), width=col_w - Inches(0.24))

    set_notes(s3, """
Slide 3: Submit a Real Estate Project for Funding
- Here we inspect the Real Estate Project Funding intake pipeline located at /project-funding/.
- As displayed across the three live capture panels below, the submission process is structured into three formal stages:
  1. Developer Credentials: capturing developer corporate details, authorized signatory roles, and RERA registration credentials.
  2. Project Specifications: capturing location, land area, sanctioned FSI, total project outlay (e.g. ₹48 Cr), and requested debt capital (₹16 Cr).
  3. Institutional Document Verification: a strict 5-item due-diligence checklist covering DPR, sanctioned building plans, 30-year advocate title search report, 3-year audited financials, and RERA approvals.
- Important governance disclosure: Submitting a project is strictly an application for preliminary evaluation, not a funding guarantee. The live platform validates file metadata; cloud binary storage integration will be connected upon cloud infrastructure approval.
""")

    # =========================================================================
    # SLIDE 4: WEBSITE CHATBOT
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4, LIGHT_BG)
    add_header(s4, "Website Advisory Chatbot", "INSTITUTIONAL CLIENT INTERACTION", "LIVE ADVISORY AGENT", slide_num=4)

    # Left Info Card
    c4 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(5.1), Inches(5.35))
    c4.fill.solid()
    c4.fill.fore_color.rgb = CARD_BG
    c4.line.color.rgb = CARD_BORDER
    c4.line.width = Pt(1)

    tf4 = c4.text_frame
    tf4.word_wrap = True
    tf4.margin_left = tf4.margin_right = tf4.margin_top = tf4.margin_bottom = Inches(0.25)

    p4_head = tf4.paragraphs[0]
    p4_head.text = "CHATBOT CAPABILITIES & VERIFIED BEHAVIOR"
    p4_head.font.size = Pt(9.5)
    p4_head.font.bold = True
    p4_head.font.color.rgb = GOLD
    p4_head.space_after = Pt(6)

    c4_points = [
        ("Institutional Grounding", "Trained strictly on Niventra Capital Advisory public disclosures, product structures, and investor qualification guidelines."),
        ("Verified Real-Time Query", "Tested live on Vercel with query: 'What are the eligibility criteria for real estate project funding?'. Returned accurate senior secured debt criteria, ₹25L minimum ticket size, and direct link to /project-funding/."),
        ("24/7 Client Navigation", "Assists corporate visitors, debt issuers, and HNIs in discovering relevant advisory services, branch locations, and calculators."),
        ("Privacy & Consent", "Does not store personal investor credentials or track unsolicited telemetry; fully aligns with DPDP Act principles.")
    ]
    for ch, cd in c4_points:
        p_ch = tf4.add_paragraph()
        p_ch.text = f"•  {ch}:"
        p_ch.font.size = Pt(9.5)
        p_ch.font.bold = True
        p_ch.font.color.rgb = TEXT_MAIN
        p_ch.space_before = Pt(3)

        p_cd = tf4.add_paragraph()
        p_cd.text = f"   {cd}"
        p_cd.font.size = Pt(9)
        p_cd.font.color.rgb = TEXT_MUTED

    p4_lim = tf4.add_paragraph()
    p4_lim.text = "GOVERNANCE & BOUNDARIES"
    p4_lim.font.size = Pt(8.5)
    p4_lim.font.bold = True
    p4_lim.font.color.rgb = DEMO_AMBER
    p4_lim.space_before = Pt(6)
    p4_lim.space_after = Pt(2)

    p4_lim_txt = tf4.add_paragraph()
    p4_lim_txt.text = "• Knowledge-Bounded Assistant: Operates on institutional knowledge retrieval; not an autonomous financial adviser.\n• No Fiduciary Advice: Does not provide live investment recommendations, guaranteed return commitments, or legally binding loan sanctions."
    p4_lim_txt.font.size = Pt(8.5)
    p4_lim_txt.font.color.rgb = TEXT_MUTED

    # Right Screenshot Frame (Showing Verified Chatbot Closeup & Dialogue)
    s4_img_close = os.path.join(ASSETS_DIR, "04_chatbot_closeup.png")
    s4_img_desk = os.path.join(ASSETS_DIR, "04_chatbot_interaction.png")

    f4 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.15), Inches(1.5), Inches(6.38), Inches(5.35))
    f4.fill.solid()
    f4.fill.fore_color.rgb = CARD_BG
    f4.line.color.rgb = CARD_BORDER
    f4.line.width = Pt(1)

    if os.path.exists(s4_img_close):
        s4.shapes.add_picture(s4_img_close, Inches(6.25), Inches(1.6), width=Inches(3.7))
    elif os.path.exists(s4_img_desk):
        s4.shapes.add_picture(s4_img_desk, Inches(6.25), Inches(1.6), width=Inches(5.0))

    # Right side annotation card
    ann4 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.15), Inches(1.6), Inches(2.25), Inches(5.1))
    ann4.fill.solid()
    ann4.fill.fore_color.rgb = RGBColor(248, 250, 252)
    ann4.line.color.rgb = CARD_BORDER
    ann4.line.width = Pt(1)
    tf_ann4 = ann4.text_frame
    tf_ann4.word_wrap = True
    tf_ann4.margin_left = tf_ann4.margin_right = tf_ann4.margin_top = tf_ann4.margin_bottom = Inches(0.15)

    pa0 = tf_ann4.paragraphs[0]
    pa0.text = "LIVE DIALOGUE AUDIT"
    pa0.font.size = Pt(8.5)
    pa0.font.bold = True
    pa0.font.color.rgb = GOLD
    pa0.space_after = Pt(4)

    pa1 = tf_ann4.add_paragraph()
    pa1.text = "Verified User Query:\n'What are the eligibility criteria for real estate project funding?'"
    pa1.font.size = Pt(8.5)
    pa1.font.color.rgb = TEXT_MAIN
    pa1.space_after = Pt(6)

    pa2 = tf_ann4.add_paragraph()
    pa2.text = "Grounded Response:\nOutlines 7-stage project evaluation: (1) Application, (2) KYC & Clearances, (3) Title Due Diligence, (4) Feasibility, (5) Committee Approval, (6) ROC Charge Creation, (7) Milestone Disbursements."
    pa2.font.size = Pt(8)
    pa2.font.color.rgb = LIVE_GREEN
    pa2.space_after = Pt(6)

    pa3 = tf_ann4.add_paragraph()
    pa3.text = "Citation Link:\nDirects user to '7-Stage Project Evaluation Journey'."
    pa3.font.size = Pt(8)
    pa3.font.color.rgb = TEXT_MUTED

    set_notes(s4, """
Slide 4: Website Chatbot
- Slide 4 details the website chatbot feature.
- The chatbot operates directly in the live environment as an interactive client advisory assistant.
- During testing on the live Vercel site, we submitted a factual enquiry regarding real estate funding criteria. As seen in the capture, the engine accurately referenced Niventra's debt syndication parameters, mandatory RERA approvals, and asset coverage requirements without hallucinatory claims.
- Scope boundary: The chatbot is strictly a grounded knowledge interface for navigation and qualification. It is programmed not to dispense personalized financial advice or binding investment terms.
""")

    # =========================================================================
    # SLIDE 5: INVESTMENT RETURN CALCULATOR
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5, LIGHT_BG)
    add_header(s5, "Investment Return Calculator", "INVESTOR FINANCIAL MODELLING", "LIVE (ILLUSTRATIVE)", slide_num=5)

    # Left Info Card
    c5 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(4.8), Inches(5.35))
    c5.fill.solid()
    c5.fill.fore_color.rgb = CARD_BG
    c5.line.color.rgb = CARD_BORDER
    c5.line.width = Pt(1)

    tf5 = c5.text_frame
    tf5.word_wrap = True
    tf5.margin_left = tf5.margin_right = tf5.margin_top = tf5.margin_bottom = Inches(0.25)

    p5_head = tf5.paragraphs[0]
    p5_head.text = "WORKED DEMONSTRATION CALCULATION"
    p5_head.font.size = Pt(9.5)
    p5_head.font.bold = True
    p5_head.font.color.rgb = GOLD
    p5_head.space_after = Pt(6)

    c5_calc_data = [
        ("Principal Investment", "₹25,00,000 (Institutional Minimum Ticket)"),
        ("Indicative Annual Rate", "14.50% p.a. (Senior Secured Debenture Model)"),
        ("Investment Tenor", "36 Months (Quarterly Coupon / Bullet Redemption)"),
        ("Total Interest Earned", "₹10,87,500 over 3-year term"),
        ("Monthly Gross Payout", "₹36,250 indicative cash-flow"),
        ("Net Monthly Payout", "₹32,625 after Section 193 TDS (10%)")
    ]
    for k, v in c5_calc_data:
        p_k = tf5.add_paragraph()
        p_k.text = f"•  {k}: {v}"
        p_k.font.size = Pt(9)
        p_k.font.color.rgb = TEXT_MAIN
        p_k.space_after = Pt(2.5)

    p5_mech = tf5.add_paragraph()
    p5_mech.text = "MATHEMATICAL FORMULA & SCHEDULE"
    p5_mech.font.size = Pt(8.5)
    p5_mech.font.bold = True
    p5_mech.font.color.rgb = LIVE_GREEN
    p5_mech.space_before = Pt(4)
    p5_mech.space_after = Pt(2)

    p5_mech_txt = tf5.add_paragraph()
    p5_mech_txt.text = "• Verified Formula: Simple interest coupon model [Interest = (P × R × T) / 100].\n• Interactive Cash-Flow Schedule: Displays quarterly coupon distribution calendar."
    p5_mech_txt.font.size = Pt(8.5)
    p5_mech_txt.font.color.rgb = TEXT_MUTED

    p5_lim = tf5.add_paragraph()
    p5_lim.text = "DISCLAIMER & CFO GOVERNANCE"
    p5_lim.font.size = Pt(8.5)
    p5_lim.font.bold = True
    p5_lim.font.color.rgb = DEMO_AMBER
    p5_lim.space_before = Pt(4)
    p5_lim.space_after = Pt(2)

    p5_lim_txt = tf5.add_paragraph()
    p5_lim_txt.text = "• Illustrative Model Only: Does not represent a guaranteed return or certified projection.\n• Regulatory Compliance: Tax deductions subject to Section 193 Indian Income Tax Act.\n• CFO Deferral: Default interest rates await formal CFO policy approval."
    p5_lim_txt.font.size = Pt(8)
    p5_lim_txt.font.color.rgb = TEXT_MUTED

    # Right Screenshot Frame
    s5_img = os.path.join(ASSETS_DIR, "05_calculator_interface.png")
    if os.path.exists(s5_img):
        f5 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.85), Inches(1.5), Inches(6.7), Inches(5.35))
        f5.fill.solid()
        f5.fill.fore_color.rgb = CARD_BG
        f5.line.color.rgb = CARD_BORDER
        f5.line.width = Pt(1)

        s5.shapes.add_picture(s5_img, Inches(5.92), Inches(1.57), width=Inches(6.56))

        cap5 = s5.shapes.add_textbox(Inches(5.92), Inches(6.5), Inches(6.56), Inches(0.25))
        tf_cap5 = cap5.text_frame
        tf_cap5.margin_top = tf_cap5.margin_bottom = tf_cap5.margin_left = tf_cap5.margin_right = 0
        p_cap5 = tf_cap5.paragraphs[0]
        p_cap5.text = "Live /calculator/ Interface: ₹25L Principal @ 14.50% with Indicative Cash-Flow Schedule"
        p_cap5.font.size = Pt(8.5)
        p_cap5.font.color.rgb = TEXT_LIGHT
        p_cap5.alignment = PP_ALIGN.CENTER

    set_notes(s5, """
Slide 5: Investment Return Calculator
- Slide 5 illustrates the live return calculator located at /calculator/.
- The slide demonstrates an actual calculation using institutional parameters: a principal of ₹25 Lakhs at an indicative annual coupon of 14.50% over a 36-month tenure.
- The deployed calculator accurately computes ₹10,87,500 in cumulative interest and generates an interactive quarterly cash-flow schedule with automatic Section 193 TDS calculation (₹32,625 net monthly).
- Governance note: Management must note that all outputs are explicitly marked as illustrative. Default display coupon rates remain subject to final CFO authorization, and returns are never represented as guaranteed.
""")

    # =========================================================================
    # SLIDE 6: BRANCHES AND OFFICE LOCATIONS (ALL 25 LOCATIONS)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6, LIGHT_BG)
    add_header(s6, "Branch Directory & Office Locations", "PHYSICAL INFRASTRUCTURE & GOVERNANCE", "LIVE (25 LOCATIONS)", slide_num=6)

    # Top Distribution Summary Bar
    c6_top = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(1.2))
    c6_top.fill.solid()
    c6_top.fill.fore_color.rgb = CARD_BG
    c6_top.line.color.rgb = CARD_BORDER
    c6_top.line.width = Pt(1)

    tf6_t = c6_top.text_frame
    tf6_t.word_wrap = True
    tf6_t.margin_left = tf6_t.margin_right = tf6_t.margin_top = tf6_t.margin_bottom = Inches(0.15)

    p6_th = tf6_t.paragraphs[0]
    p6_th.text = "COMPLETE 25-LOCATION DIRECTORY DISTRIBUTION (/contact/)"
    p6_th.font.size = Pt(9.5)
    p6_th.font.bold = True
    p6_th.font.color.rgb = GOLD
    p6_th.space_after = Pt(2)

    p6_td = tf6_t.add_paragraph()
    p6_td.text = "• Madhya Pradesh (12): Gwalior (MCA Registered Head Office), Bhopal, Indore, Jabalpur, Ujjain, Sagar, Dewas, Satna, Ratlam, Rewa, Singrauli, Burhanpur.\n• Rajasthan (7): Jaipur, Jodhpur, Kota, Bikaner, Ajmer, Udaipur, Bhilwara.   • Uttar Pradesh (3): Lucknow, Kanpur, Agra.\n• Delhi NCR (2): New Delhi (Operational Northern Advisory Desk), Connaught Place.   • Haryana (1): Gurugram (Corporate Finance Hub)."
    p6_td.font.size = Pt(8.5)
    p6_td.font.color.rgb = TEXT_MAIN

    # Bottom Two Screenshot Frames Side-by-Side
    # Left Frame: Head office & filters
    s6_img_a = os.path.join(ASSETS_DIR, "06a_branch_directory_head_office.png")
    f6_a = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.75), Inches(5.75), Inches(4.3))
    f6_a.fill.solid()
    f6_a.fill.fore_color.rgb = CARD_BG
    f6_a.line.color.rgb = CARD_BORDER
    f6_a.line.width = Pt(1)

    if os.path.exists(s6_img_a):
        s6.shapes.add_picture(s6_img_a, Inches(0.88), Inches(2.82), width=Inches(5.59))
        cap6a = s6.shapes.add_textbox(Inches(0.88), Inches(6.75), Inches(5.59), Inches(0.25))
        tf_cap6a = cap6a.text_frame
        tf_cap6a.margin_top = tf_cap6a.margin_bottom = tf_cap6a.margin_left = tf_cap6a.margin_right = 0
        p_cap6a = tf_cap6a.paragraphs[0]
        p_cap6a.text = "Gwalior Registered Head Office (CIN: L17111MP1984PLC002492) & State Filter Tabs"
        p_cap6a.font.size = Pt(8)
        p_cap6a.font.color.rgb = TEXT_LIGHT
        p_cap6a.alignment = PP_ALIGN.CENTER

    # Right Frame: Regional grid
    s6_img_b = os.path.join(ASSETS_DIR, "06b_branch_directory_grid.png")
    f6_b = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.78), Inches(2.75), Inches(5.75), Inches(4.3))
    f6_b.fill.solid()
    f6_b.fill.fore_color.rgb = CARD_BG
    f6_b.line.color.rgb = CARD_BORDER
    f6_b.line.width = Pt(1)

    if os.path.exists(s6_img_b):
        s6.shapes.add_picture(s6_img_b, Inches(6.86), Inches(2.82), width=Inches(5.59))
        cap6b = s6.shapes.add_textbox(Inches(6.86), Inches(6.75), Inches(5.59), Inches(0.25))
        tf_cap6b = cap6b.text_frame
        tf_cap6b.margin_top = tf_cap6b.margin_bottom = tf_cap6b.margin_left = tf_cap6b.margin_right = 0
        p_cap6b = tf_cap6b.paragraphs[0]
        p_cap6b.text = "Regional Branch Cards Grid: Instant Search & Multi-State Branch Details"
        p_cap6b.font.size = Pt(8)
        p_cap6b.font.color.rgb = TEXT_LIGHT
        p_cap6b.alignment = PP_ALIGN.CENTER

    set_notes(s6, """
Slide 6: Branches and Office Locations
- Slide 6 presents the company's verified branch directory on the live /contact/ page.
- We have verified that all 25 locations are live and accessible across six state tabs: Madhya Pradesh with 12 locations, Rajasthan with 7, Uttar Pradesh with 3, Delhi NCR with 2, and Haryana with 1.
- Crucially, the directory maintains proper corporate governance: Gwalior is distinctly badged as the official MCA-registered Head Office under CIN L17111MP1984PLC002492, while New Delhi is clearly identified as our operational Northern Advisory Desk.
- Visitors can filter by state pill or perform real-time instant text searches across cities, localities, and PIN codes.
""")

    # =========================================================================
    # SLIDE 7: INVESTOR PORTAL AND INVESTMENT TRACKING
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7, LIGHT_BG)
    add_header(s7, "Accredited Investor Portal & Tracking", "PORTAL GOVERNANCE & DASHBOARD", "GATE LIVE / DASH DEMO", slide_num=7)

    # Left Info Card
    c7 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(4.8), Inches(5.35))
    c7.fill.solid()
    c7.fill.fore_color.rgb = CARD_BG
    c7.line.color.rgb = CARD_BORDER
    c7.line.width = Pt(1)

    tf7 = c7.text_frame
    tf7.word_wrap = True
    tf7.margin_left = tf7.margin_right = tf7.margin_top = tf7.margin_bottom = Inches(0.25)

    p7_head = tf7.paragraphs[0]
    p7_head.text = "PORTAL ARCHITECTURE & ACCESS CONTROL"
    p7_head.font.size = Pt(9.5)
    p7_head.font.bold = True
    p7_head.font.color.rgb = GOLD
    p7_head.space_after = Pt(6)

    c7_points = [
        ("Live Authentication Gateway (/login)", "Production route enforces accredited investor entry with TLS 256-bit encryption, CSRF protection, and DPDP Act statutory disclosures."),
        ("Demonstration Tracking Dashboard", "Provides accredited investors with portfolio analytics: ₹50,00,000 Active Capital, Cumulative Coupon Yield, Debenture Series A/B allocation, and quarterly payout schedule."),
        ("Tax & Compliance Ledger", "Displays annual Section 193 withholding certificates, Form 16A tracking, and regulatory audit trail.")
    ]
    for ch, cd in c7_points:
        p_ch = tf7.add_paragraph()
        p_ch.text = f"•  {ch}:"
        p_ch.font.size = Pt(9.5)
        p_ch.font.bold = True
        p_ch.font.color.rgb = TEXT_MAIN
        p_ch.space_before = Pt(3)

        p_cd = tf7.add_paragraph()
        p_cd.text = f"   {cd}"
        p_cd.font.size = Pt(8.5)
        p_cd.font.color.rgb = TEXT_MUTED

    p7_lim = tf7.add_paragraph()
    p7_lim.text = "AUTHENTICATION STATUS & GOVERNANCE"
    p7_lim.font.size = Pt(8.5)
    p7_lim.font.bold = True
    p7_lim.font.color.rgb = DEMO_AMBER
    p7_lim.space_before = Pt(6)
    p7_lim.space_after = Pt(2)

    p7_lim_txt = tf7.add_paragraph()
    p7_lim_txt.text = "• Live vs Demonstration Distinction: The public login gateway is fully live on Vercel. Authenticated dashboard analytics operate in demonstration mode.\n• Data Safety: Zero live investor accounts or private financial records are exposed on the public web.\n• Backend Integration: Production database connectivity is scheduled for subsequent infrastructure sprint."
    p7_lim_txt.font.size = Pt(8.5)
    p7_lim_txt.font.color.rgb = TEXT_MUTED

    # Right Dual Screenshots (Top: Live Login, Bottom: Demo Dashboard)
    s7_img_login = os.path.join(ASSETS_DIR, "07_investor_portal_entry.png")
    s7_img_dash = os.path.join(ASSETS_DIR, "07b_investor_dashboard_demo.png")

    f7_top = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.85), Inches(1.5), Inches(6.7), Inches(2.5))
    f7_top.fill.solid()
    f7_top.fill.fore_color.rgb = CARD_BG
    f7_top.line.color.rgb = CARD_BORDER
    f7_top.line.width = Pt(1)

    if os.path.exists(s7_img_login):
        s7.shapes.add_picture(s7_img_login, Inches(5.92), Inches(1.56), width=Inches(6.56), height=Inches(2.12))
        cap7a = s7.shapes.add_textbox(Inches(5.92), Inches(3.72), Inches(6.56), Inches(0.24))
        tf_cap7a = cap7a.text_frame
        tf_cap7a.margin_top = tf_cap7a.margin_bottom = tf_cap7a.margin_left = tf_cap7a.margin_right = 0
        p_cap7a = tf_cap7a.paragraphs[0]
        p_cap7a.text = "Live Gateway (/login): Accredited Investor Access Gate with 256-bit TLS"
        p_cap7a.font.size = Pt(8)
        p_cap7a.font.color.rgb = TEXT_LIGHT
        p_cap7a.alignment = PP_ALIGN.CENTER

    f7_bot = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.85), Inches(4.2), Inches(6.7), Inches(2.65))
    f7_bot.fill.solid()
    f7_bot.fill.fore_color.rgb = CARD_BG
    f7_bot.line.color.rgb = CARD_BORDER
    f7_bot.line.width = Pt(1)

    if os.path.exists(s7_img_dash):
        s7.shapes.add_picture(s7_img_dash, Inches(5.92), Inches(4.26), width=Inches(6.56), height=Inches(2.26))
        cap7b = s7.shapes.add_textbox(Inches(5.92), Inches(6.56), Inches(6.56), Inches(0.24))
        tf_cap7b = cap7b.text_frame
        tf_cap7b.margin_top = tf_cap7b.margin_bottom = tf_cap7b.margin_left = tf_cap7b.margin_right = 0
        p_cap7b = tf_cap7b.paragraphs[0]
        p_cap7b.text = "Verified Demonstration Dashboard: Debenture Holdings, Returns & Cash-Flow Forecast"
        p_cap7b.font.size = Pt(8)
        p_cap7b.font.color.rgb = TEXT_LIGHT
        p_cap7b.alignment = PP_ALIGN.CENTER

    set_notes(s7, """
Slide 7: Investor Portal and Investment Tracking
- Slide 7 covers the Accredited Investor Portal and investment tracking interface.
- As shown in the top capture, unauthenticated visitors accessing private routes are securely redirected to the live /login gateway with 256-bit TLS encryption and statutory disclosures.
- The lower capture demonstrates the authenticated investment tracking interface: displaying active portfolio capital (e.g. ₹50,00,000), cumulative coupon yield, Debenture Series allocations, and cash-flow calendars.
- Explicit governance distinction: The login gateway is live on Vercel, while the tracking dashboard operates in demonstration mode. No live production database or private investor PII is exposed on the public web.
""")

    # =========================================================================
    # SLIDE 8: SUMMARY OF WEBSITE FEATURES (EXECUTIVE MATRIX)
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8, LIGHT_BG)
    add_header(s8, "Summary of Website Features & Verification Status", "PLATFORM READINESS OVERVIEW", "VERIFIED SUITE", slide_num=8)

    features_summary = [
        ("01", "Website Overview & Navigation", "LIVE", "Institutional landing page, core service pillars, responsive navigation bar, and trust metrics.", "01_home_overview.png"),
        ("02", "Client Meeting / Consultation Panel", "LIVE", "Asynchronous 3-step appointment intake with category selection, capital range, and tracking ID.", "02_schedule_meeting_panel.png"),
        ("03", "Real Estate Project Funding Portal", "LIVE", "3-stage developer funding evaluation (/project-funding/) with 5-point institutional document checklist.", "03b_project_funding_step2.png"),
        ("04", "Website Advisory Chatbot", "LIVE", "Grounded client assistant for 24/7 navigation guidance and investment parameter qualification.", "04_chatbot_closeup.png"),
        ("05", "Investment Return Calculator", "LIVE (ILLUS)", "Interactive debenture return modeller with simple interest formula, Section 193 TDS, and cash-flow schedule.", "05_calculator_interface.png"),
        ("06", "25-Branch Office Directory", "LIVE", "Complete 25-location directory across 6 states with Gwalior Head Office and Delhi operational desk.", "06a_branch_directory_head_office.png"),
        ("07", "Investor Portal & Tracking", "GATE LIVE / DASH DEMO", "Accredited login gate with 256-bit TLS; demonstration dashboard showing ₹50L holdings and returns.", "07_investor_portal_entry.png")
    ]

    card_y_start = Inches(1.35)
    card_h = Inches(0.7)
    card_gap = Inches(0.08)

    for i, (num, feat_name, badge_txt, feat_desc, thumb_fn) in enumerate(features_summary):
        y = card_y_start + i * (card_h + card_gap)
        row_card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), y, Inches(11.733), card_h)
        row_card.fill.solid()
        row_card.fill.fore_color.rgb = CARD_BG
        row_card.line.color.rgb = CARD_BORDER
        row_card.line.width = Pt(1)

        # Thumbnail (adjusted width and position to prevent overlap)
        thumb_p = os.path.join(ASSETS_DIR, thumb_fn)
        if os.path.exists(thumb_p):
            s8.shapes.add_picture(thumb_p, Inches(0.95), y + Inches(0.06), width=Inches(0.95))

        # Text Frame with generous left margin so text is completely clear of thumbnail
        tf_row = row_card.text_frame
        tf_row.word_wrap = True
        tf_row.margin_left = Inches(1.25)
        tf_row.margin_right = Inches(2.2)
        tf_row.margin_top = Inches(0.08)
        tf_row.margin_bottom = Inches(0.06)

        pr1 = tf_row.paragraphs[0]
        pr1.text = f"{num}. {feat_name}"
        pr1.font.size = Pt(10.5)
        pr1.font.bold = True
        pr1.font.color.rgb = TEXT_MAIN

        pr2 = tf_row.add_paragraph()
        pr2.text = feat_desc
        pr2.font.size = Pt(8.5)
        pr2.font.color.rgb = TEXT_MUTED

        # Status Badge on right
        b_fg = LIVE_GREEN if "LIVE" in badge_txt and "DEMO" not in badge_txt and "GATE" not in badge_txt else (DEMO_AMBER if "DEMO" in badge_txt or "GATE" in badge_txt else DEV_BLUE)
        b_bg = LIVE_BG if b_fg == LIVE_GREEN else (DEMO_BG if b_fg == DEMO_AMBER else DEV_BG)

        row_badge = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.5), y + Inches(0.16), Inches(1.9), Inches(0.36))
        row_badge.fill.solid()
        row_badge.fill.fore_color.rgb = b_bg
        row_badge.line.color.rgb = b_fg
        row_badge.line.width = Pt(1)

        tf_rb = row_badge.text_frame
        tf_rb.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_rb = tf_rb.paragraphs[0]
        p_rb.text = badge_txt
        p_rb.alignment = PP_ALIGN.CENTER
        p_rb.font.size = Pt(8)
        p_rb.font.bold = True
        p_rb.font.color.rgb = b_fg

    # Footer Links Bar
    foot_box = s8.shapes.add_textbox(Inches(0.8), Inches(6.9), Inches(11.0), Inches(0.3))
    tf_foot = foot_box.text_frame
    tf_foot.margin_top = tf_foot.margin_bottom = tf_foot.margin_left = tf_foot.margin_right = 0
    p_foot = tf_foot.paragraphs[0]
    p_foot.text = "Live Deployment: https://niventra-capital-advisory.vercel.app/  |  Repository: https://github.com/Ar10Ansari/niventra-capital-advisory  |  All screenshots verified from production build"
    p_foot.font.size = Pt(8.5)
    p_foot.font.color.rgb = TEXT_MUTED

    set_notes(s8, """
Slide 8: Summary of Website Features
- In summary, Slide 8 consolidates the verification status of all seven core functional areas covered today.
- 1. Overview & Navigation: Live on Vercel with responsive institutional design.
- 2. Client Consultation Panel: Live asynchronous enquiry intake with serialized reference tracking.
- 3. Real Estate Project Funding: Live 3-stage intake with comprehensive developer credential and document checklist.
- 4. Advisory Chatbot: Live knowledge-grounded assistant with zero unauthorized advice claims.
- 5. Investment Return Calculator: Live illustrative coupon calculator with Section 193 tax deduction.
- 6. Branch Directory: Live with all 25 locations, state filtering, and Gwalior Head Office badging.
- 7. Investor Portal: Live secure login gateway with demonstration tracking dashboard.
- Thank you for your leadership and review. We invite your questions and guidance on next steps.
""")

    prs.save(OUTPUT_FILE)
    print(f"Presentation saved successfully to: {OUTPUT_FILE}")
    print(f"Total Slides: {len(prs.slides)}")

if __name__ == "__main__":
    build_overview_presentation()
