#!/usr/bin/env python3
"""
Redesign SecureVault Presentation: Apple Keynote + Modern Cybersecurity Aesthetic.
High-readability, large typography for classroom projection (6-meter rule).

Color Palette:
- 85% Neutral Dark: Near-black / Deep Charcoal (#0B0F17, #131A26)
- 10% White / Light Slate (#FFFFFF, #CBD5E1, #94A3B8)
- 5% Single Subtle Blue Accent (#38BDF8 / #60A5FA)
- Zero multi-colors, zero rainbow gradients, zero clutter.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# Dark Executive Palette
COLOR_BG = RGBColor(11, 15, 23)           # #0B0F17 (Deep Obsidian Charcoal)
COLOR_CARD_BG = RGBColor(19, 26, 38)      # #131A26 (Subtle Dark Slate Card)
COLOR_CARD_ALT = RGBColor(15, 21, 32)     # #0F1520 (Darker Accent Card)
COLOR_BORDER = RGBColor(35, 47, 68)       # #232F44 (Subtle Slate Border)
COLOR_WHITE = RGBColor(255, 255, 255)     # #FFFFFF (Pure White)
COLOR_TEXT_LIGHT = RGBColor(203, 213, 225)# #CBD5E1 (Light Slate Body)
COLOR_TEXT_MUTED = RGBColor(148, 163, 184)# #94A3B8 (Muted Slate)
COLOR_BLUE = RGBColor(56, 189, 248)       # #38BDF8 (Subtle Cyan/Blue Accent)
COLOR_BLUE_MUTED = RGBColor(30, 58, 95)   # #1E3A5F (Dark Blue Container Fill)

FONT_HEADING = "Helvetica"
FONT_BODY = "Arial"
FONT_MONO = "Courier New"
TOTAL_SLIDES = 18


def create_redesigned_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.color.rgb = COLOR_BG
        return bg

    def add_footer(slide, current_slide):
        # Footer text box
        fbox = slide.shapes.add_textbox(Inches(0.9), Inches(6.8), Inches(11.533), Inches(0.4))
        tf = fbox.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = f"SecureVault   •   Hill Cipher + DES File Security Pipeline"
        p.font.name = FONT_BODY
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_TEXT_MUTED

        p_num = tf.add_paragraph()
        p_num.text = f"{current_slide:02d} / {TOTAL_SLIDES:02d}"
        p_num.alignment = PP_ALIGN.RIGHT
        p_num.font.name = FONT_BODY
        p_num.font.size = Pt(13)
        p_num.font.bold = True
        p_num.font.color.rgb = COLOR_BLUE

    def add_slide_header(slide, title_text, category_text="CRYPTOGRAPHY & NETWORK SECURITY"):
        # Category label
        cbox = slide.shapes.add_textbox(Inches(0.9), Inches(0.55), Inches(11.533), Inches(0.35))
        ctf = cbox.text_frame
        cp = ctf.paragraphs[0]
        cp.text = category_text.upper()
        cp.font.name = FONT_HEADING
        cp.font.size = Pt(13)
        cp.font.bold = True
        cp.font.color.rgb = COLOR_BLUE

        # Slide Main Title (Large Classroom Font)
        tbox = slide.shapes.add_textbox(Inches(0.9), Inches(0.9), Inches(11.533), Inches(0.75))
        ttf = tbox.text_frame
        ttf.word_wrap = True
        tp = ttf.paragraphs[0]
        tp.text = title_text
        tp.font.name = FONT_HEADING
        tp.font.size = Pt(36)
        tp.font.bold = True
        tp.font.color.rgb = COLOR_WHITE

    def add_card(slide, left, top, width, height, bg=COLOR_CARD_BG, border=COLOR_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg
        card.line.color.rgb = border
        card.line.width = Pt(1.5)
        return card

    # =========================================================================
    # SLIDE 01: COVER SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    # Ambient Accent Border Card
    add_card(s1, Inches(1.0), Inches(1.0), Inches(11.333), Inches(5.5), bg=COLOR_CARD_BG, border=COLOR_BORDER)

    tb = s1.shapes.add_textbox(Inches(1.6), Inches(1.5), Inches(10.133), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "SECURE FILE SHARING SYSTEM"
    p0.font.name = FONT_HEADING
    p0.font.size = Pt(40)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_WHITE
    p0.space_after = Pt(6)

    p1 = tf.add_paragraph()
    p1.text = "Using Hill Cipher + DES"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_BLUE
    p1.space_after = Pt(22)

    # Product Identifier Pill Box
    p2 = tf.add_paragraph()
    p2.text = "PRODUCT: SecureVault"
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(20)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_after = Pt(36)

    p3 = tf.add_paragraph()
    p3.text = "B.Tech Computer Science & Engineering Mini-Project\nCourse: Cryptography & Network Security (CNS) • Classroom Viva Presentation"
    p3.font.name = FONT_BODY
    p3.font.size = Pt(17)
    p3.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 02: WHY SECURE FILE SHARING?
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_slide_header(s2, "Why Secure File Sharing?", "Problem Statement")
    add_footer(s2, 2)

    # 3 Large Challenge Cards
    issues = [
        ("01", "Single-Layer Vulnerability", "Relying on a single cipher creates a single point of failure. If the key or algorithm is compromised, all data is lost."),
        ("02", "Classical Hill Cipher Limit", "Classical Hill Cipher is defined over mod 26 (A-Z only). It cannot encrypt binary files (PDFs, images, ZIPs) without data corruption."),
        ("03", "DES 56-Bit Key Constraint", "DES has an effective key length of 56 bits. Exhaustive key search is feasible today with modern GPU computing clusters."),
    ]
    for i, (num, title, desc) in enumerate(issues):
        left = Inches(0.9 + i * 3.9)
        add_card(s2, left, Inches(1.85), Inches(3.7), Inches(3.3))
        tb = s2.shapes.add_textbox(left + Inches(0.25), Inches(2.05), Inches(3.2), Inches(2.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p_num = tf.paragraphs[0]
        p_num.text = num
        p_num.font.name = FONT_HEADING
        p_num.font.size = Pt(32)
        p_num.font.bold = True
        p_num.font.color.rgb = COLOR_BLUE
        p_num.space_after = Pt(8)

        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.name = FONT_HEADING
        p_t.font.size = Pt(21)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_WHITE
        p_t.space_after = Pt(10)

        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.name = FONT_BODY
        p_d.font.size = Pt(16)
        p_d.font.color.rgb = COLOR_TEXT_LIGHT

    # Bottom Approach Banner
    add_card(s2, Inches(0.9), Inches(5.35), Inches(11.533), Inches(1.1), bg=COLOR_BLUE_MUTED, border=COLOR_BLUE)
    tb_bot = s2.shapes.add_textbox(Inches(1.2), Inches(5.45), Inches(11.0), Inches(0.9))
    tf_bot = tb_bot.text_frame
    tf_bot.word_wrap = True
    pb = tf_bot.paragraphs[0]
    pb.text = "OUR APPROACH:  Hill Cipher in Z_256  +  DES-CBC  +  HMAC-SHA256 Integrity"
    pb.font.name = FONT_HEADING
    pb.font.size = Pt(21)
    pb.font.bold = True
    pb.font.color.rgb = COLOR_WHITE

    # =========================================================================
    # SLIDE 03: PROBLEM VS SOLUTION
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_slide_header(s3, "The Challenge vs. SecureVault", "Comparative Analysis")
    add_footer(s3, 3)

    # Left Column: THE CHALLENGE
    add_card(s3, Inches(0.9), Inches(1.85), Inches(5.6), Inches(4.6))
    tb_l = s3.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(5.0), Inches(4.1))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    pl = tf_l.paragraphs[0]
    pl.text = "THE CHALLENGE"
    pl.font.name = FONT_HEADING
    pl.font.size = Pt(24)
    pl.font.bold = True
    pl.font.color.rgb = COLOR_TEXT_MUTED
    pl.space_after = Pt(18)

    ch_items = [
        "Single cipher dependency creates systemic risk",
        "Classical Hill Cipher restricted to mod 26 (letters only)",
        "Binary files require exact byte-level preservation",
        "DES alone is vulnerable to modern exhaustive search",
    ]
    for it in ch_items:
        p = tf_l.add_paragraph()
        p.text = f"—  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(18)
        p.font.color.rgb = COLOR_TEXT_LIGHT
        p.space_after = Pt(14)

    # Right Column: SECUREVAULT
    add_card(s3, Inches(6.833), Inches(1.85), Inches(5.6), Inches(4.6), bg=COLOR_CARD_BG, border=COLOR_BLUE)
    tb_r = s3.shapes.add_textbox(Inches(7.133), Inches(2.1), Inches(5.0), Inches(4.1))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    pr = tf_r.paragraphs[0]
    pr.text = "SECUREVAULT"
    pr.font.name = FONT_HEADING
    pr.font.size = Pt(24)
    pr.font.bold = True
    pr.font.color.rgb = COLOR_BLUE
    pr.space_after = Pt(18)

    sv_items = [
        "Hill Cipher extended to Ring Z_256 (handles all 256 bytes)",
        "DES in CBC mode with random 8-byte IV per file",
        "PBKDF2 key derivation (100,000 SHA-256 rounds)",
        "HMAC-SHA256 Encrypt-then-MAC authentication tag",
    ]
    for it in sv_items:
        p = tf_r.add_paragraph()
        p.text = f"✓  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.space_after = Pt(14)

    # =========================================================================
    # SLIDE 04: SYSTEM ARCHITECTURE
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_slide_header(s4, "System Architecture Pipeline", "High-Level Architecture")
    add_footer(s4, 4)

    # Large Horizontal Step Flow (6 Major Blocks)
    steps = [
        ("FILE", "Original Bytes\n(PDF, JPG, ZIP)"),
        ("PBKDF2", "100k Rounds\nHMAC-SHA256"),
        ("HILL", "Z_256 Matrix\nLayer 1"),
        ("DES-CBC", "Block Cipher\nLayer 2"),
        ("HMAC", "Integrity Tag\nEncrypt-then-MAC"),
        (".SVAULT", "Encrypted\nFile Container"),
    ]

    for i, (st_name, st_desc) in enumerate(steps):
        left = Inches(0.9 + i * 1.95)
        is_end = (i == len(steps) - 1)
        card_bg = COLOR_BLUE_MUTED if is_end else COLOR_CARD_BG
        card_border = COLOR_BLUE if is_end else COLOR_BORDER

        add_card(s4, left, Inches(2.2), Inches(1.75), Inches(3.2), bg=card_bg, border=card_border)
        tb = s4.shapes.add_textbox(left + Inches(0.1), Inches(2.4), Inches(1.55), Inches(2.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = f"0{i+1}"
        p0.font.name = FONT_HEADING
        p0.font.size = Pt(16)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_BLUE
        p0.space_after = Pt(8)

        p1 = tf.add_paragraph()
        p1.text = st_name
        p1.font.name = FONT_HEADING
        p1.font.size = Pt(20)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_WHITE
        p1.space_after = Pt(10)

        p2 = tf.add_paragraph()
        p2.text = st_desc
        p2.font.name = FONT_BODY
        p2.font.size = Pt(14)
        p2.font.color.rgb = COLOR_TEXT_LIGHT

        # Arrow indicator
        if i < len(steps) - 1:
            abox = s4.shapes.add_textbox(left + Inches(1.68), Inches(3.2), Inches(0.4), Inches(0.6))
            atf = abox.text_frame
            ap = atf.paragraphs[0]
            ap.text = "→"
            ap.font.name = FONT_HEADING
            ap.font.size = Pt(26)
            ap.font.bold = True
            ap.font.color.rgb = COLOR_BLUE

    # Caption Box
    add_card(s4, Inches(0.9), Inches(5.65), Inches(11.533), Inches(0.85))
    tb_c = s4.shapes.add_textbox(Inches(1.2), Inches(5.75), Inches(11.0), Inches(0.7))
    tf_c = tb_c.text_frame
    pc = tf_c.paragraphs[0]
    pc.text = "Each stage is completely decoupled and reversible: Decryption validates HMAC → DES Decrypt → Hill Decrypt → Original File."
    pc.font.name = FONT_BODY
    pc.font.size = Pt(16)
    pc.font.color.rgb = COLOR_TEXT_MUTED

    # =========================================================================
    # SLIDE 05: CRYPTOGRAPHIC KEY PIPELINE
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_slide_header(s5, "Cryptographic Key Pipeline", "Key Derivation & Partitioning")
    add_footer(s5, 5)

    # Top: User Password Box
    add_card(s5, Inches(4.3), Inches(1.8), Inches(4.7), Inches(0.85))
    t1 = s5.shapes.add_textbox(Inches(4.4), Inches(1.9), Inches(4.5), Inches(0.65)).text_frame
    p = t1.paragraphs[0]
    p.text = "USER PASSWORD + 16B RANDOM SALT"
    p.font.name = FONT_HEADING
    p.font.size = Pt(18)
    p.font.bold = True
    p.alignment = PP_ALIGN.CENTER
    p.font.color.rgb = COLOR_WHITE

    # Arrow down
    a1 = s5.shapes.add_textbox(Inches(6.3), Inches(2.65), Inches(0.7), Inches(0.4)).text_frame
    ap = a1.paragraphs[0]
    ap.text = "↓"
    ap.font.size = Pt(24)
    ap.font.bold = True
    ap.font.color.rgb = COLOR_BLUE

    # PBKDF2 Box
    add_card(s5, Inches(3.8), Inches(3.05), Inches(5.7), Inches(0.9), bg=COLOR_BLUE_MUTED, border=COLOR_BLUE)
    t2 = s5.shapes.add_textbox(Inches(3.9), Inches(3.15), Inches(5.5), Inches(0.7)).text_frame
    p = t2.paragraphs[0]
    p.text = "PBKDF2-HMAC-SHA256 (100,000 Rounds)\nYields 64 Derived Pseudorandom Bytes"
    p.font.name = FONT_HEADING
    p.font.size = Pt(17)
    p.font.bold = True
    p.alignment = PP_ALIGN.CENTER
    p.font.color.rgb = COLOR_WHITE

    # 3 Partitioned Key Cards
    keys = [
        ("DES Key", "8 Bytes (64 bits)", "56 effective bits\nUsed in DES-CBC"),
        ("HMAC Key", "32 Bytes (256 bits)", "Integrity Authentication\nEncrypt-then-MAC"),
        ("Hill Matrix Seed", "4 Bytes (32 bits)", "Deterministically builds\nInvertible 2x2 Matrix"),
    ]
    for i, (k_name, k_size, k_use) in enumerate(keys):
        left = Inches(1.3 + i * 3.7)
        add_card(s5, left, Inches(4.35), Inches(3.3), Inches(2.1))
        tb = s5.shapes.add_textbox(left + Inches(0.2), Inches(4.5), Inches(2.9), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = k_name
        p0.font.name = FONT_HEADING
        p0.font.size = Pt(20)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_BLUE
        p0.space_after = Pt(4)

        p1 = tf.add_paragraph()
        p1.text = k_size
        p1.font.name = FONT_MONO
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_WHITE
        p1.space_after = Pt(6)

        p2 = tf.add_paragraph()
        p2.text = k_use
        p2.font.name = FONT_BODY
        p2.font.size = Pt(15)
        p2.font.color.rgb = COLOR_TEXT_LIGHT

    # =========================================================================
    # SLIDE 06: HILL CIPHER IN Z_256
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_slide_header(s6, "Hill Cipher in Ring Z_256", "Layer 1: Linear Transformation")
    add_footer(s6, 6)

    # Large Center Formula Card
    add_card(s6, Inches(0.9), Inches(1.85), Inches(11.533), Inches(1.7), bg=COLOR_CARD_BG, border=COLOR_BLUE)
    tb_f = s6.shapes.add_textbox(Inches(1.2), Inches(2.05), Inches(11.0), Inches(1.3))
    tf_f = tb_f.text_frame
    pf = tf_f.paragraphs[0]
    pf.text = "C  =  ( P  ×  K^T )  mod  256"
    pf.font.name = FONT_MONO
    pf.font.size = Pt(40)
    pf.font.bold = True
    pf.font.color.rgb = COLOR_BLUE
    pf.alignment = PP_ALIGN.CENTER

    pf_sub = tf_f.add_paragraph()
    pf_sub.text = "Decryption:  P  =  ( C  ×  (K^-1)^T )  mod  256"
    pf_sub.font.name = FONT_MONO
    pf_sub.font.size = Pt(22)
    pf_sub.font.color.rgb = COLOR_WHITE
    pf_sub.alignment = PP_ALIGN.CENTER

    # 3 Supporting Points
    add_card(s6, Inches(0.9), Inches(3.8), Inches(11.533), Inches(2.7))
    tb_pts = s6.shapes.add_textbox(Inches(1.3), Inches(4.0), Inches(10.7), Inches(2.3))
    tf_pts = tb_pts.text_frame
    tf_pts.word_wrap = True

    pts = [
        "Operates directly on 8-bit bytes (0 to 255) rather than 26 alphabet characters.",
        "Preserves arbitrary binary file structures (PDF, PNG, ZIP, executables) with 100% byte fidelity.",
        "Transforms byte pairs using a 2×2 modular invertible key matrix K in Ring Z_256.",
        "Flow:  Plain Bytes  →  Modular Matrix Multiplication  →  Encrypted Intermediate Bytes.",
    ]
    for i, pt in enumerate(pts):
        p = tf_pts.paragraphs[0] if i == 0 else tf_pts.add_paragraph()
        p.text = f"•  {pt}"
        p.font.name = FONT_BODY
        p.font.size = Pt(20)
        p.font.color.rgb = COLOR_WHITE if i == 0 else COLOR_TEXT_LIGHT
        p.space_after = Pt(12)

    # =========================================================================
    # SLIDE 07: HILL CIPHER INVERTIBILITY
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_slide_header(s7, "Hill Cipher Invertibility Condition", "Mathematical Proof")
    add_footer(s7, 7)

    # Large Equation Box
    add_card(s7, Inches(0.9), Inches(1.85), Inches(5.6), Inches(4.6))
    tb1 = s7.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(5.0), Inches(4.1))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "Invertibility in Z_256"
    p.font.name = FONT_HEADING
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.space_after = Pt(18)

    p_eq = tf1.add_paragraph()
    p_eq.text = "gcd( det(K), 256 ) = 1"
    p_eq.font.name = FONT_MONO
    p_eq.font.size = Pt(28)
    p_eq.font.bold = True
    p_eq.font.color.rgb = COLOR_BLUE
    p_eq.space_after = Pt(16)

    p_pf = tf1.add_paragraph()
    p_pf.text = "Since 256 = 2^8, its only prime factor is 2.\n\nTherefore:"
    p_pf.font.name = FONT_BODY
    p_pf.font.size = Pt(20)
    p_pf.font.color.rgb = COLOR_TEXT_LIGHT
    p_pf.space_after = Pt(14)

    p_odd = tf1.add_paragraph()
    p_odd.text = "det(K) MUST BE ODD"
    p_odd.font.name = FONT_HEADING
    p_odd.font.size = Pt(32)
    p_odd.font.bold = True
    p_odd.font.color.rgb = COLOR_BLUE

    # Right Box: Deterministic Construction
    add_card(s7, Inches(6.833), Inches(1.85), Inches(5.6), Inches(4.6))
    tb2 = s7.shapes.add_textbox(Inches(7.133), Inches(2.1), Inches(5.0), Inches(4.1))
    tf2 = tb2.text_frame
    tf2.word_wrap = True

    p2 = tf2.paragraphs[0]
    p2.text = "Guaranteed Odd Construction"
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_after = Pt(18)

    m_pts = [
        "Matrix K = [[a, b], [c, d]]",
        "det(K) = (a·d − b·c) mod 256",
        "Enforce a, d = ODD (2k + 1)",
        "Enforce b, c = EVEN (2m)",
        "det(K) mod 2 = (ODD × ODD) − (EVEN × EVEN)",
        "det(K) mod 2 = 1 − 0 = 1 (Always Odd!)",
    ]
    for it in m_pts:
        p = tf2.add_paragraph()
        p.text = f"•  {it}"
        p.font.name = FONT_MONO if "det" in it or "K =" in it else FONT_BODY
        p.font.size = Pt(18)
        p.font.color.rgb = COLOR_WHITE if "Always Odd" in it else COLOR_TEXT_LIGHT
        p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 08: DES-CBC BLOCK CIPHER
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8)
    add_slide_header(s8, "DES in CBC Mode", "Layer 2: Block Cipher Mechanics")
    add_footer(s8, 8)

    # Center Spec Numbers
    add_card(s8, Inches(0.9), Inches(1.85), Inches(11.533), Inches(1.4), bg=COLOR_CARD_BG, border=COLOR_BLUE)
    tbs = s8.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11.0), Inches(1.1))
    tfs = tbs.text_frame
    ps = tfs.paragraphs[0]
    ps.text = "64-Bit Blocks   +   56-Bit Effective Key   +   16 Feistel Rounds"
    ps.font.name = FONT_HEADING
    ps.font.size = Pt(28)
    ps.font.bold = True
    ps.alignment = PP_ALIGN.CENTER
    ps.font.color.rgb = COLOR_BLUE

    # CBC Execution Flow Card
    add_card(s8, Inches(0.9), Inches(3.5), Inches(11.533), Inches(3.0))
    tbf = s8.shapes.add_textbox(Inches(1.3), Inches(3.7), Inches(10.7), Inches(2.6))
    tff = tbf.text_frame
    tff.word_wrap = True

    cbc_flow = [
        "Initialization Vector (IV):  8 cryptographically random bytes generated per file.",
        "Chaining Formula:  C_0 = IV,   C_i = DES_Encrypt( P_i ⊕ C_{i-1} )",
        "Diffusion:  Every ciphertext block depends on all preceding plaintext blocks.",
        "PKCS#7 Padding:  Appends 1 to 8 bytes ensuring strict 64-bit block alignment.",
        "Decryption:  P_i = DES_Decrypt( C_i ) ⊕ C_{i-1}  (Fully reversible & parallelizable).",
    ]
    for i, it in enumerate(cbc_flow):
        p = tff.paragraphs[0] if i == 0 else tff.add_paragraph()
        p.text = f"•  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(19)
        p.font.color.rgb = COLOR_WHITE if i == 1 else COLOR_TEXT_LIGHT
        p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 09: WHY CBC OVER ECB?
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9)
    add_slide_header(s9, "Why CBC Mode Over ECB Mode?", "Block Cipher Mode Comparison")
    add_footer(s9, 9)

    # Left: ECB (Insecure)
    add_card(s9, Inches(0.9), Inches(1.85), Inches(5.6), Inches(4.6))
    tb_ecb = s9.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(5.0), Inches(4.1))
    tf_ecb = tb_ecb.text_frame
    tf_ecb.word_wrap = True

    p = tf_ecb.paragraphs[0]
    p.text = "ECB MODE (INSECURE)"
    p.font.name = FONT_HEADING
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_MUTED
    p.space_after = Pt(16)

    ecb_steps = [
        "Block 1  →  DES  →  Ciphertext 1",
        "Block 2  →  DES  →  Ciphertext 2",
        "Block 3  →  DES  →  Ciphertext 3",
        "Identical plaintext blocks produce identical ciphertext blocks.",
        "Leaks structural file patterns (e.g., the infamous ECB penguin image).",
    ]
    for it in ecb_steps:
        p = tf_ecb.add_paragraph()
        p.text = f"—  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(17)
        p.font.color.rgb = COLOR_TEXT_LIGHT
        p.space_after = Pt(10)

    # Right: CBC (Secure)
    add_card(s9, Inches(6.833), Inches(1.85), Inches(5.6), Inches(4.6), bg=COLOR_CARD_BG, border=COLOR_BLUE)
    tb_cbc = s9.shapes.add_textbox(Inches(7.133), Inches(2.1), Inches(5.0), Inches(4.1))
    tf_cbc = tb_cbc.text_frame
    tf_cbc.word_wrap = True

    p = tf_cbc.paragraphs[0]
    p.text = "CBC MODE (IMPLEMENTED)"
    p.font.name = FONT_HEADING
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE
    p.space_after = Pt(16)

    cbc_steps = [
        "Block 1 ⊕ IV  →  DES  →  Ciphertext 1",
        "Block 2 ⊕ Ciphertext 1  →  DES  →  Ciphertext 2",
        "Block 3 ⊕ Ciphertext 2  →  DES  →  Ciphertext 3",
        "Prevents identical plaintext blocks from generating identical ciphertexts.",
        "Completely eliminates structural and frequency patterns.",
    ]
    for it in cbc_steps:
        p = tf_cbc.add_paragraph()
        p.text = f"✓  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(17)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.space_after = Pt(10)

    # =========================================================================
    # SLIDE 10: PBKDF2 + HMAC: DEFENSE IN DEPTH
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10)
    add_slide_header(s10, "Defense in Depth: Key Derivation & Integrity", "Key Management & MAC")
    add_footer(s10, 10)

    # Card 1: PBKDF2
    add_card(s10, Inches(0.9), Inches(1.85), Inches(5.6), Inches(4.6))
    tb_pb = s10.shapes.add_textbox(Inches(1.2), Inches(2.1), Inches(5.0), Inches(4.1))
    tf_pb = tb_pb.text_frame
    tf_pb.word_wrap = True

    p = tf_pb.paragraphs[0]
    p.text = "PBKDF2 (NIST SP 800-132)"
    p.font.name = FONT_HEADING
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE
    p.space_after = Pt(16)

    pb_items = [
        "100,000 Rounds of HMAC-SHA256",
        "16-Byte Cryptographically Random Salt",
        "Dramatically slows down GPU dictionary & rainbow table attacks",
        "No plaintext passwords ever written to disk or database",
    ]
    for it in pb_items:
        p = tf_pb.add_paragraph()
        p.text = f"•  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(18)
        p.font.color.rgb = COLOR_WHITE
        p.space_after = Pt(14)

    # Card 2: HMAC-SHA256
    add_card(s10, Inches(6.833), Inches(1.85), Inches(5.6), Inches(4.6))
    tb_hm = s10.shapes.add_textbox(Inches(7.133), Inches(2.1), Inches(5.0), Inches(4.1))
    tf_hm = tb_hm.text_frame
    tf_hm.word_wrap = True

    p = tf_hm.paragraphs[0]
    p.text = "HMAC-SHA256 (Encrypt-then-MAC)"
    p.font.name = FONT_HEADING
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE
    p.space_after = Pt(16)

    hm_items = [
        "32-Byte Authenticated Signature Tag",
        "Constant-Time Verification (hmac.compare_digest)",
        "Stops Bit-Flipping and Tamper Attacks",
        "Padding Oracle Defense: HMAC verified before DES unpadding",
    ]
    for it in hm_items:
        p = tf_hm.add_paragraph()
        p.text = f"•  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(18)
        p.font.color.rgb = COLOR_WHITE
        p.space_after = Pt(14)

    # =========================================================================
    # SLIDE 11: .SVAULT BINARY CONTAINER FORMAT
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11)
    add_slide_header(s11, ".svault Binary Container Specification", "File Format Structure")
    add_footer(s11, 11)

    # Monospace Stack Container Layout
    add_card(s11, Inches(0.9), Inches(1.85), Inches(11.533), Inches(4.6))
    tbc = s11.shapes.add_textbox(Inches(1.2), Inches(2.05), Inches(11.0), Inches(4.2))
    tfc = tbc.text_frame
    tfc.word_wrap = True

    sections = [
        ("[ 00..05 ]  SVAULT MAGIC HEADER", "6 Bytes", "ASCII identifier b'SVAULT'"),
        ("[ 06..07 ]  VERSION & FLAGS", "2 Bytes", "Version 0x01 + reserved flags"),
        ("[ 08..23 ]  PBKDF2 SALT", "16 Bytes", "Cryptographic random salt for key regeneration"),
        ("[ 24..31 ]  DES IV", "8 Bytes", "Random Initialization Vector for CBC mode"),
        ("[ 32..36 ]  HILL MATRIX", "5 Bytes", "Matrix dimension (2) + coefficients a, b, c, d"),
        ("[ 37..46 ]  METADATA", "10B + Name", "Original file size (uint64) + UTF-8 filename"),
        ("[ +00..+n ] DES CIPHERTEXT", "8B + Length", "PKCS#7 padded ciphertext bytes"),
        ("[ -32..00 ] HMAC-SHA256 TAG", "32 Bytes", "Integrity signature over all preceding container bytes"),
    ]

    for offset, size, desc in sections:
        p = tfc.add_paragraph()
        p.text = f"{offset:<32} {size:<14} {desc}"
        p.font.name = FONT_MONO
        p.font.size = Pt(15)
        p.font.color.rgb = COLOR_BLUE if "HMAC" in offset or "MAGIC" in offset else COLOR_WHITE
        p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 12: IMPORTANT SECURITY ADVISORY
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12)
    add_slide_header(s12, "Important Security Advisory", "Cryptanalysis & Academic Context")
    add_footer(s12, 12)

    # Prominent Statement Card
    add_card(s12, Inches(0.9), Inches(1.85), Inches(11.533), Inches(1.3), bg=COLOR_CARD_BG, border=COLOR_BLUE)
    tba = s12.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11.0), Inches(1.0))
    tfa = tba.text_frame
    pa = tfa.paragraphs[0]
    pa.text = "DES IS OBSOLETE FOR MODERN PRODUCTION SECURITY"
    pa.font.name = FONT_HEADING
    pa.font.size = Pt(28)
    pa.font.bold = True
    pa.font.color.rgb = COLOR_WHITE
    pa.alignment = PP_ALIGN.CENTER

    # 3 Points + Modern Alternatives
    add_card(s12, Inches(0.9), Inches(3.4), Inches(11.533), Inches(3.1))
    tb_ap = s12.shapes.add_textbox(Inches(1.3), Inches(3.6), Inches(10.7), Inches(2.7))
    tf_ap = tb_ap.text_frame
    tf_ap.word_wrap = True

    pts_adv = [
        "56-Bit Effective Key: Total keyspace is 2^56 ≈ 7.2 × 10^16 keys.",
        "Vulnerable to Brute-Force: Modern distributed GPU clusters can exhaust the keyspace in hours.",
        "Educational Demonstration: Used here strictly to demonstrate Feistel block chaining alongside Hill Cipher.",
        "Modern Production Alternatives: AES-256-GCM (NIST standard) or ChaCha20-Poly1305.",
    ]
    for i, it in enumerate(pts_adv):
        p = tf_ap.paragraphs[0] if i == 0 else tf_ap.add_paragraph()
        p.text = f"•  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(20)
        p.font.color.rgb = COLOR_BLUE if i == 3 else COLOR_TEXT_LIGHT
        p.font.bold = (i == 3)
        p.space_after = Pt(12)

    # =========================================================================
    # SLIDE 13: TESTING DASHBOARD
    # =========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_bg(s13)
    add_slide_header(s13, "Automated Testing & Verification", "Quality Assurance")
    add_footer(s13, 13)

    # Big Metrics on Left
    add_card(s13, Inches(0.9), Inches(1.85), Inches(4.5), Inches(4.6))
    tb_m = s13.shapes.add_textbox(Inches(1.1), Inches(2.1), Inches(4.1), Inches(4.1))
    tf_m = tb_m.text_frame
    tf_m.word_wrap = True

    p0 = tf_m.paragraphs[0]
    p0.text = "18"
    p0.font.name = FONT_HEADING
    p0.font.size = Pt(72)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_BLUE
    p0.space_after = Pt(0)

    p1 = tf_m.add_paragraph()
    p1.text = "TEST CASES"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(22)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    p1.space_after = Pt(16)

    p2 = tf_m.add_paragraph()
    p2.text = "100%"
    p2.font.name = FONT_HEADING
    p2.font.size = Pt(54)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_after = Pt(0)

    p3 = tf_m.add_paragraph()
    p3.text = "ALL PASSED"
    p3.font.name = FONT_HEADING
    p3.font.size = Pt(18)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_TEXT_MUTED

    # Test Matrix on Right (9 Verified Items)
    add_card(s13, Inches(5.7), Inches(1.85), Inches(6.733), Inches(4.6))
    tb_t = s13.shapes.add_textbox(Inches(6.0), Inches(2.1), Inches(6.2), Inches(4.1))
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True

    t_cases = [
        "Plaintext Text File (.txt)",
        "Document Binary File (.pdf)",
        "Image Bitmap File (.png, .jpg)",
        "Compressed Archive (.zip)",
        "Empty File Edge Case (0 Bytes)",
        "Large Binary Payload (1 MB)",
        "Wrong Password Rejection (400 Error)",
        "Tampered Ciphertext Detection",
        "Corrupted Container Protection",
    ]
    for it in t_cases:
        p = tf_t.add_paragraph()
        p.text = f"✓  {it}"
        p.font.name = FONT_BODY
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 14: BYTE-FOR-BYTE VALIDATION
    # =========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_bg(s14)
    add_slide_header(s14, "Cryptographic Hash Verification", "Fidelity & Integrity")
    add_footer(s14, 14)

    # Center Comparison Card
    add_card(s14, Inches(1.5), Inches(1.85), Inches(10.333), Inches(4.6))
    tb = s14.shapes.add_textbox(Inches(1.8), Inches(2.2), Inches(9.733), Inches(3.9))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "Original File SHA-256"
    p0.font.name = FONT_HEADING
    p0.font.size = Pt(24)
    p0.font.bold = True
    p0.alignment = PP_ALIGN.CENTER
    p0.font.color.rgb = COLOR_TEXT_MUTED
    p0.space_after = Pt(12)

    p_eq = tf.add_paragraph()
    p_eq.text = "=="
    p_eq.font.name = FONT_HEADING
    p_eq.font.size = Pt(36)
    p_eq.font.bold = True
    p_eq.alignment = PP_ALIGN.CENTER
    p_eq.font.color.rgb = COLOR_BLUE
    p_eq.space_after = Pt(12)

    p1 = tf.add_paragraph()
    p1.text = "Decrypted File SHA-256"
    p1.font.name = FONT_HEADING
    p1.font.size = Pt(24)
    p1.font.bold = True
    p1.alignment = PP_ALIGN.CENTER
    p1.font.color.rgb = COLOR_TEXT_MUTED
    p1.space_after = Pt(24)

    p_res = tf.add_paragraph()
    p_res.text = "✓  BYTE-FOR-BYTE MATCH"
    p_res.font.name = FONT_HEADING
    p_res.font.size = Pt(34)
    p_res.font.bold = True
    p_res.alignment = PP_ALIGN.CENTER
    p_res.font.color.rgb = COLOR_WHITE

    # =========================================================================
    # SLIDE 15: LIVE DEMONSTRATION FLOW
    # =========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_bg(s15)
    add_slide_header(s15, "Live Demonstration Flow", "Walkthrough")
    add_footer(s15, 15)

    # 7-Step Horizontal Flow Cards
    steps7 = [
        ("1", "Upload File"),
        ("2", "Set Key"),
        ("3", "Hill mod 256"),
        ("4", "DES-CBC"),
        ("5", "Get .svault"),
        ("6", "Decrypt"),
        ("7", "SHA-256 ✓"),
    ]

    for i, (num, label) in enumerate(steps7):
        left = Inches(0.9 + i * 1.68)
        is_last = (i == len(steps7) - 1)
        add_card(s15, left, Inches(2.2), Inches(1.5), Inches(3.2), bg=COLOR_BLUE_MUTED if is_last else COLOR_CARD_BG, border=COLOR_BLUE if is_last else COLOR_BORDER)
        tb = s15.shapes.add_textbox(left + Inches(0.1), Inches(2.4), Inches(1.3), Inches(2.8))
        tf = tb.text_frame
        tf.word_wrap = True

        p_num = tf.paragraphs[0]
        p_num.text = num
        p_num.font.name = FONT_HEADING
        p_num.font.size = Pt(32)
        p_num.font.bold = True
        p_num.font.color.rgb = COLOR_BLUE
        p_num.space_after = Pt(12)

        p_l = tf.add_paragraph()
        p_l.text = label
        p_l.font.name = FONT_HEADING
        p_l.font.size = Pt(18)
        p_l.font.bold = True
        p_l.font.color.rgb = COLOR_WHITE

    # Live Terminal Demo Callout
    add_card(s15, Inches(0.9), Inches(5.65), Inches(11.533), Inches(0.85))
    tbd = s15.shapes.add_textbox(Inches(1.2), Inches(5.75), Inches(11.0), Inches(0.7))
    tfd = tbd.text_frame
    pd = tfd.paragraphs[0]
    pd.text = "Live Terminal Script:  python backend/demo_test.py  →  Instant SHA-256 Verification in front of examiners."
    pd.font.name = FONT_MONO
    pd.font.size = Pt(16)
    pd.font.color.rgb = COLOR_BLUE

    # =========================================================================
    # SLIDE 16: VIVA QUESTIONS (EXAMINER CHEAT SHEET)
    # =========================================================================
    s16 = prs.slides.add_slide(blank_layout)
    set_bg(s16)
    add_slide_header(s16, "Viva Examiner Defense", "Core Defense Points")
    add_footer(s16, 16)

    # Clean 5-Row Card
    add_card(s16, Inches(0.9), Inches(1.85), Inches(11.533), Inches(4.6))
    tb_v = s16.shapes.add_textbox(Inches(1.3), Inches(2.05), Inches(10.7), Inches(4.2))
    tf_v = tb_v.text_frame
    tf_v.word_wrap = True

    viva = [
        ("WHY RING Z_256?", "Binary byte compatibility across all file formats (0..255)."),
        ("WHY ODD DETERMINANT?", "gcd(det(K), 256) = 1 is required for modular matrix invertibility."),
        ("WHY CBC OVER ECB?", "Prevents repeated ciphertext blocks; eliminates pattern recognition."),
        ("WHY HMAC-SHA256?", "Provides integrity and authentication; stops bit-flipping attacks."),
        ("WHY NOT DES IN PRODUCTION?", "56-bit effective key length is vulnerable to exhaustive brute force."),
    ]
    for q, a in viva:
        p = tf_v.add_paragraph()
        p.text = f"{q:<30}  →  {a}"
        p.font.name = FONT_BODY
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.space_after = Pt(14)

    # =========================================================================
    # SLIDE 17: CONCLUSION / KEY TAKEAWAYS
    # =========================================================================
    s17 = prs.slides.add_slide(blank_layout)
    set_bg(s17)
    add_slide_header(s17, "SecureVault — Key Takeaways", "Conclusion")
    add_footer(s17, 17)

    # 4 Large Takeaway Cards
    takeaways = [
        ("01", "Binary-Compatible Hill Cipher", "Extended linear algebra to Ring Z_256 with guaranteed odd determinant."),
        ("02", "DES-CBC Layered Defense", "Paired linear diffusion with non-linear Feistel block permutation."),
        ("03", "PBKDF2 + HMAC Integrity", "100k-round key derivation and constant-time Encrypt-then-MAC authentication."),
        ("04", "Verified 100% Byte Fidelity", "Byte-for-byte SHA-256 equality proven across all major file types."),
    ]
    for i, (num, title, desc) in enumerate(takeaways):
        left = Inches(0.9 + i * 2.95)
        add_card(s17, left, Inches(1.85), Inches(2.75), Inches(3.6))
        tb = s17.shapes.add_textbox(left + Inches(0.2), Inches(2.1), Inches(2.35), Inches(3.1))
        tf = tb.text_frame
        tf.word_wrap = True

        p0 = tf.paragraphs[0]
        p0.text = num
        p0.font.name = FONT_HEADING
        p0.font.size = Pt(28)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_BLUE
        p0.space_after = Pt(8)

        p1 = tf.add_paragraph()
        p1.text = title
        p1.font.name = FONT_HEADING
        p1.font.size = Pt(19)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_WHITE
        p1.space_after = Pt(10)

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = FONT_BODY
        p2.font.size = Pt(15)
        p2.font.color.rgb = COLOR_TEXT_LIGHT

    # Bottom Tagline
    add_card(s17, Inches(0.9), Inches(5.65), Inches(11.533), Inches(0.85), bg=COLOR_CARD_BG, border=COLOR_BLUE)
    tbt = s17.shapes.add_textbox(Inches(1.2), Inches(5.75), Inches(11.0), Inches(0.7))
    tft = tbt.text_frame
    pt = tft.paragraphs[0]
    pt.text = "Educational cryptography with a production-grade, end-to-end working implementation."
    pt.font.name = FONT_HEADING
    pt.font.size = Pt(18)
    pt.font.bold = True
    pt.font.color.rgb = COLOR_WHITE
    pt.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 18: FINAL SLIDE
    # =========================================================================
    s18 = prs.slides.add_slide(blank_layout)
    set_bg(s18)

    add_card(s18, Inches(1.5), Inches(1.5), Inches(10.333), Inches(4.5), bg=COLOR_CARD_BG, border=COLOR_BORDER)
    tb_end = s18.shapes.add_textbox(Inches(1.8), Inches(2.2), Inches(9.733), Inches(3.2))
    tf_end = tb_end.text_frame
    tf_end.word_wrap = True

    pe0 = tf_end.paragraphs[0]
    pe0.text = "THANK YOU"
    pe0.font.name = FONT_HEADING
    pe0.font.size = Pt(48)
    pe0.font.bold = True
    pe0.alignment = PP_ALIGN.CENTER
    pe0.font.color.rgb = COLOR_WHITE
    pe0.space_after = Pt(14)

    pe1 = tf_end.add_paragraph()
    pe1.text = "Questions & Answers"
    pe1.font.name = FONT_HEADING
    pe1.font.size = Pt(24)
    pe1.font.bold = True
    pe1.alignment = PP_ALIGN.CENTER
    pe1.font.color.rgb = COLOR_BLUE
    pe1.space_after = Pt(22)

    pe2 = tf_end.add_paragraph()
    pe2.text = "SecureVault  •  Secure File Sharing using Hill Cipher + DES\nDepartment of Computer Science & Engineering"
    pe2.font.name = FONT_BODY
    pe2.font.size = Pt(17)
    pe2.alignment = PP_ALIGN.CENTER
    pe2.font.color.rgb = COLOR_TEXT_MUTED

    output_path = os.path.join(os.path.dirname(__file__), "..", "SecureVault_Presentation.pptx")
    output_path = os.path.abspath(output_path)
    prs.save(output_path)
    print(f"[✓] Successfully generated redesigned presentation at: {output_path}")
    return output_path


if __name__ == "__main__":
    create_redesigned_deck()
