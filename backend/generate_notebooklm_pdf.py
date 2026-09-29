#!/usr/bin/env python3
"""
Generate a Comprehensive, High-Fidelity PDF Document Optimized for Google NotebookLM Ingestion.
Enables NotebookLM to generate deep study guides, audio briefings, presentations, and executive slide decks.

Document Contents:
1. Executive Abstract & Academic Metadata
2. Problem Statement & Classical Cryptography Limitations
3. High-Level Two-Stage System Architecture
4. Mathematical Formulation: Hill Cipher in Ring Z_256 (Proofs & Algorithms)
5. Block Cipher Mechanics: DES in CBC Mode (Feistel Rounds & Padding)
6. Key Management & Integrity: PBKDF2 & HMAC-SHA256 Encrypt-then-MAC
7. .svault Binary Container Specification
8. Implementation Details & Full-Stack Monorepo Architecture
9. Experimental Verification & Test Suite (18 Automated Cases)
10. Classroom Presentation Slide-by-Slide Deck Blueprint (Ready for NotebookLM PPT conversion)
11. Viva Voce Defense Question & Answer Guide
12. Academic Security Advisory on DES
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    HRFlowable,
    KeepTogether,
)
from reportlab.pdfgen import canvas


class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically add total page count and running headers."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Skip headers on cover page
        if self._pageNumber > 1:
            # Header
            self.drawString(
                54,
                letter[1] - 36,
                "SecureVault: Secure File Sharing Using Hill Cipher and DES — CNS Academic Project",
            )
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

            # Footer
            self.line(54, 46, letter[0] - 54, 46)
            self.drawString(
                54,
                32,
                "Department of Computer Science & Engineering • Source Document for NotebookLM",
            )
            page_str = f"Page {self._pageNumber} of {total_pages}"
            self.drawRightString(letter[0] - 54, 32, page_str)

        self.restoreState()


def build_pdf(filename="SecureVault_Project_NotebookLM_Source.pdf"):
    pdf_path = os.path.abspath(filename)
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # Custom Clean Minimalist Typography Palette
    c_primary = colors.HexColor("#0F172A")    # Deep Slate
    c_secondary = colors.HexColor("#334155")  # Dark Slate
    c_accent = colors.HexColor("#0284C7")     # Blue Accent
    c_muted = colors.HexColor("#64748B")      # Muted Slate
    c_border = colors.HexColor("#CBD5E1")     # Light Border
    c_card_bg = colors.HexColor("#F8FAFC")    # Clean Canvas Fill

    doc_title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=c_primary,
        spaceAfter=6,
    )

    doc_sub_style = ParagraphStyle(
        "DocSub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=c_accent,
        spaceAfter=14,
    )

    h1_style = ParagraphStyle(
        "Heading1_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=c_primary,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        "Heading2_Custom",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=c_secondary,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        "Body_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=c_secondary,
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        "Bullet_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=c_secondary,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4,
    )

    code_style = ParagraphStyle(
        "Code_Custom",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=4,
    )

    callout_style = ParagraphStyle(
        "Callout_Custom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
    )

    story = []

    # =========================================================================
    # COVER / TITLE SECTION
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("SECUREVAULT", ParagraphStyle(
        "BrandHeader", fontName="Helvetica-Bold", fontSize=10, textColor=c_accent, spaceAfter=4
    )))
    story.append(Paragraph("Secure File Sharing System Using Hill Cipher and DES", doc_title_style))
    story.append(Paragraph("Comprehensive Academic Project Source Document & Slide Deck Blueprint", doc_sub_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_accent, spaceAfter=12))

    # Metadata Block Table
    meta_data = [
        [
            Paragraph("<b>Subject:</b> Cryptography & Network Security (CNS)", body_style),
            Paragraph("<b>Academic Degree:</b> B.Tech Computer Science & Engineering", body_style),
        ],
        [
            Paragraph("<b>Implementation:</b> Full-Stack Web Application (FastAPI + Next.js)", body_style),
            Paragraph("<b>Key Algorithms:</b> Hill Cipher (Z_256) + DES-CBC + HMAC-SHA256", body_style),
        ],
        [
            Paragraph("<b>Document Purpose:</b> NotebookLM Ingestion & Presentation Generation", body_style),
            Paragraph("<b>Mathematical Ring:</b> Integer Ring Z_256 (Byte-Level Reversible)", body_style),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), c_card_bg),
        ("BOX", (0, 0), (-1, -1), 0.5, c_border),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 1: EXECUTIVE ABSTRACT & EDUCATIONAL NOTICE
    # =========================================================================
    story.append(Paragraph("1. Executive Abstract & Educational Cryptography Notice", h1_style))
    story.append(Paragraph(
        "<b>SecureVault</b> is a production-quality, academic cryptographic file sharing system designed to "
        "demonstrate <b>layered defense-in-depth cryptography</b>. It couples a linear algebraic transformation "
        "(the polygraphic <b>Hill Cipher</b> operating over the byte ring <b>Z_256</b>) with a non-linear symmetric "
        "block cipher (the <b>Data Encryption Standard (DES)</b> operating in <b>Cipher Block Chaining (CBC)</b> mode). "
        "The cryptographic workflow is hardened with modern <b>PBKDF2-HMAC-SHA256</b> password-based key derivation "
        "and <b>HMAC-SHA256</b> Encrypt-then-MAC authentication sealed within a binary container format (<code>.svault</code>).",
        body_style,
    ))

    # Educational Warning Box
    advisory_data = [[
        Paragraph(
            "<b>IMPORTANT EDUCATIONAL & VIVA DEFENSE ADVISORY:</b><br/>"
            "This project is developed strictly for educational and pedagogical exploration of layered Feistel and "
            "matrix ciphers. <b>DES is cryptographically obsolete for modern production environments</b> due to its "
            "small 56-bit effective key length (2^56 ≈ 7.2 × 10^16 keys), which can be brute-forced within hours by "
            "modern GPU clusters. In this academic demonstration, DES illustrates Feistel block chaining and CBC "
            "diffusion. For enterprise production applications, <b>AES-256-GCM</b> or <b>ChaCha20-Poly1305</b> must be used.",
            callout_style,
        )
    ]]
    advisory_table = Table(advisory_data, colWidths=[504])
    advisory_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#F59E0B")),
        ("PADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(advisory_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 2: PROBLEM STATEMENT & MOTIVATION
    # =========================================================================
    story.append(Paragraph("2. Problem Statement & Motivation", h1_style))
    story.append(Paragraph(
        "Single-layer cryptographic designs often introduce single points of failure. In pedagogical settings, "
        "classical ciphers are frequently studied only as textbook toy examples with grave real-world shortcomings:",
        body_style,
    ))
    story.append(Paragraph(
        "• <b>Linearity of Classical Hill Cipher:</b> Classical Hill Cipher operates modulo 26 on uppercase letters A–Z. "
        "Because it is a linear transformation (C = P · K mod 26), it is entirely vulnerable to Known-Plaintext Attacks (KPA). "
        "An adversary who intercepts n plaintext-ciphertext vector pairs can recover key matrix K using standard Gaussian elimination.",
        bullet_style,
    ))
    story.append(Paragraph(
        "• <b>Binary File Incompatibility:</b> Real-world files (PDF documents, PNG images, ZIP archives, executables) "
        "contain arbitrary 8-bit bytes spanning 0 to 255. Classical mod 26 Hill Cipher cannot process arbitrary bytes, "
        "leading to silent file truncation and catastrophic data corruption.",
        bullet_style,
    ))
    story.append(Paragraph(
        "• <b>DES Block Frequency & Keyspace Limitations:</b> When DES is used in Electronic Codebook (ECB) mode, identical "
        "plaintext blocks generate identical ciphertext blocks, leaking structural file outlines (the ECB Penguin effect). "
        "Furthermore, DES alone has an inadequate 56-bit keyspace.",
        bullet_style,
    ))
    story.append(Paragraph(
        "• <b>SecureVault's Hybrid Resolution:</b> SecureVault extends the Hill Cipher to the integer ring <b>Z_256</b>, "
        "enforcing mathematical invertibility for all byte values. It chains this with DES in <b>CBC mode</b> using random IVs, "
        "and seals the container using <b>HMAC-SHA256</b> under the Encrypt-then-MAC paradigm.",
        bullet_style,
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: SYSTEM ARCHITECTURE & CRYPTOGRAPHIC PIPELINE
    # =========================================================================
    story.append(Paragraph("3. End-to-End Cryptographic Architecture", h1_style))
    story.append(Paragraph(
        "The application implements an end-to-end multi-stage pipeline where each cryptographic phase performs "
        "an orthogonal security role: key derivation, linear diffusion, non-linear confusion, and authenticated integrity.",
        body_style,
    ))

    arch_data = [
        [
            Paragraph("<b>Stage</b>", h2_style),
            Paragraph("<b>Cryptographic Primitive</b>", h2_style),
            Paragraph("<b>Operational Specification</b>", h2_style),
            Paragraph("<b>Security Contribution</b>", h2_style),
        ],
        [
            Paragraph("<b>Stage 1: Key Derivation</b>", body_style),
            Paragraph("PBKDF2-HMAC-SHA256 (NIST SP 800-132)", body_style),
            Paragraph("100,000 iterations, 16-byte random salt, 64 derived bytes", body_style),
            Paragraph("Strengthens low-entropy passwords; eliminates precomputed rainbow tables.", body_style),
        ],
        [
            Paragraph("<b>Stage 2: Layer 1 Cipher</b>", body_style),
            Paragraph("Hill Cipher over Ring Z_256", body_style),
            Paragraph("2×2 matrix multiplication modulo 256; vectorized via NumPy", body_style),
            Paragraph("Algebraic polygraphic diffusion across byte-pairs; destroys single-byte frequency distribution.", body_style),
        ],
        [
            Paragraph("<b>Stage 3: Layer 2 Cipher</b>", body_style),
            Paragraph("DES in CBC Mode + PKCS#7", body_style),
            Paragraph("64-bit blocks, 16 Feistel rounds, 8-byte random IV", body_style),
            Paragraph("Non-linear confusion via S-boxes; CBC block chaining eliminates structural pattern leakage.", body_style),
        ],
        [
            Paragraph("<b>Stage 4: Authenticated Integrity</b>", body_style),
            Paragraph("HMAC-SHA256 (Encrypt-then-MAC)", body_style),
            Paragraph("32-byte tag computed over header + ciphertext", body_style),
            Paragraph("Guarantees ciphertext integrity; detects bit-flipping; stops padding oracle exploits.", body_style),
        ],
    ]
    arch_table = Table(arch_data, colWidths=[90, 130, 144, 140])
    arch_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 4: MATHEMATICAL FORMULATION: HILL CIPHER IN RING Z_256
    # =========================================================================
    story.append(Paragraph("4. Mathematical Formulation: Hill Cipher in Ring Z_256", h1_style))
    story.append(Paragraph(
        "Classical Hill Cipher transforms n-tuples of alphabet letters using matrix multiplication modulo 26. "
        "SecureVault transforms pairs of arbitrary 8-bit bytes in the integer ring <b>Z_256</b>.",
        body_style,
    ))

    story.append(Paragraph("<b>Encryption Vector Transformation:</b>", h2_style))
    story.append(Paragraph(
        "Let the input binary stream be partitioned into 2-byte vectors P = [p_1, p_2]^T, where p_1, p_2 ∈ [0, 255]. "
        "Let K be a 2×2 key matrix with integer entries in [0, 255]:",
        body_style,
    ))
    story.append(Paragraph(
        "<code>K = [ [a, b], [c, d] ]</code><br/>"
        "<code>C = (P · K^T) mod 256</code>",
        code_style,
    ))

    story.append(Paragraph("<b>Decryption Vector Transformation:</b>", h2_style))
    story.append(Paragraph(
        "<code>P = (C · (K^-1)^T) mod 256</code>",
        code_style,
    ))

    story.append(Paragraph("<b>Mathematical Proof of Invertibility in Ring Z_256:</b>", h2_style))
    story.append(Paragraph(
        "<b>Theorem:</b> A matrix K has a unique modular inverse K^-1 mod 256 if and only if: "
        "<code>gcd(det(K) mod 256, 256) = 1</code>.<br/>"
        "<b>Proof:</b> The prime factorization of the modulus is 256 = 2^8. The only prime divisor of 256 is 2. "
        "Therefore, an integer is coprime to 256 if and only if it is not divisible by 2. "
        "Hence, <code>gcd(det(K), 256) = 1  <=>  det(K) mod 2 == 1 (det(K) must be an ODD integer)</code>.",
        body_style,
    ))

    story.append(Paragraph("<b>Guaranteed Invertible Key Derivation Construction:</b>", h2_style))
    story.append(Paragraph(
        "SecureVault guarantees that derived Hill matrices are unconditionally invertible modulo 256 by enforcing parity: "
        "Let 4 pseudo-random bytes from PBKDF2 be mapped to entries a, b, c, d as follows:<br/>"
        "• <code>a = byte[0] | 1</code> (forced odd: a = 2k + 1)<br/>"
        "• <code>b = byte[1] & 0xFE</code> (forced even: b = 2m)<br/>"
        "• <code>c = byte[2] & 0xFE</code> (forced even: c = 2n)<br/>"
        "• <code>d = byte[3] | 1</code> (forced odd: d = 2p + 1)<br/>"
        "The determinant is computed as <code>det(K) = (a·d - b·c) mod 256</code>.<br/>"
        "Evaluating modulo 2: <code>det(K) mod 2 = (odd · odd) - (even · even) = 1 - 0 = 1 (Always Odd!)</code>.<br/>"
        "Because det(K) is guaranteed odd, gcd(det(K), 256) = 1 holds universally without exception.",
        body_style,
    ))

    story.append(Paragraph("<b>Modular Matrix Inversion Computation:</b>", h2_style))
    story.append(Paragraph(
        "1. Modular inverse of determinant: Solve <code>(det(K) · det_inv) mod 256 = 1</code> using the Extended Euclidean Algorithm.<br/>"
        "2. Adjugate matrix: <code>adj(K) = [ [d, -b], [-c, a] ]</code>.<br/>"
        "3. Modular inverse matrix: <code>K^-1 = (det_inv · adj(K)) mod 256</code>.",
        body_style,
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 5: BLOCK CIPHER MECHANICS: DES IN CBC MODE
    # =========================================================================
    story.append(Paragraph("5. Block Cipher Mechanics: DES in CBC Mode", h1_style))
    story.append(Paragraph(
        "The intermediate ciphertext generated by the Hill Cipher layer is passed directly into the DES engine. "
        "DES (NIST FIPS PUB 46-3) operates on 64-bit blocks using a 56-bit effective key with 16 rounds of Feistel substitution-permutation.",
        body_style,
    ))

    story.append(Paragraph("<b>Cipher Block Chaining (CBC) Mechanics:</b>", h2_style))
    story.append(Paragraph(
        "In CBC mode, each plaintext block P_i is XORed with the preceding ciphertext block C_{i-1} prior to DES encryption. "
        "The first block P_1 is XORed with an 8-byte cryptographically random Initialization Vector (IV):",
        body_style,
    ))
    story.append(Paragraph(
        "<code>C_0 = IV (8 random bytes generated via os.urandom)</code><br/>"
        "<code>C_i = DES_Encrypt_K( P_i ⊕ C_{i-1} ),   for i >= 1</code>",
        code_style,
    ))
    story.append(Paragraph("<b>CBC Decryption:</b>", h2_style))
    story.append(Paragraph(
        "<code>P_i = DES_Decrypt_K( C_i ) ⊕ C_{i-1},   with C_0 = IV</code>",
        code_style,
    ))
    story.append(Paragraph(
        "<b>PKCS#7 Padding:</b> DES operates on strict 8-byte (64-bit) blocks. Before encryption, data is padded with N bytes "
        "of value N (where 1 <= N <= 8) so that total payload size is a multiple of 8. Decryption safely unpads the trailing bytes.",
        body_style,
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 6: KEY MANAGEMENT & AUTHENTICATED INTEGRITY
    # =========================================================================
    story.append(Paragraph("6. Key Management (PBKDF2) & Authenticated Integrity (HMAC)", h1_style))
    story.append(Paragraph(
        "<b>PBKDF2 Key Derivation (NIST SP 800-132):</b> Passwords entered by users have low entropy. "
        "SecureVault applies PBKDF2 with HMAC-SHA256, 100,000 computation rounds, and a 16-byte random salt "
        "to derive 64 pseudo-random bytes. These bytes are partitioned into:<br/>"
        "• <b>Bytes 00..07 (8 Bytes):</b> DES 64-bit key (56 effective bits).<br/>"
        "• <b>Bytes 08..39 (32 Bytes):</b> HMAC-SHA256 256-bit authentication key.<br/>"
        "• <b>Bytes 40..43 (4 Bytes):</b> Hill Cipher 2×2 matrix seed coefficients.<br/>"
        "• <b>Bytes 44..63 (20 Bytes):</b> Entropy buffer for future expansion.",
        body_style,
    ))
    story.append(Paragraph(
        "<b>HMAC-SHA256 Encrypt-then-MAC (EtM) Integrity Tag:</b> Encryption provides confidentiality but does not "
        "guarantee authenticity. A malicious actor could flip ciphertext bits or execute padding oracle attacks. "
        "SecureVault implements Encrypt-then-MAC by calculating a 32-byte HMAC-SHA256 signature across all container "
        "metadata and ciphertext. Upon decryption, the signature is verified in <b>constant time</b> using <code>hmac.compare_digest</code> "
        "prior to invoking any DES decryption. If tampered, the operation aborts with a clean error message.",
        body_style,
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 7: BINARY CONTAINER SPECIFICATION (.SVAULT)
    # =========================================================================
    story.append(Paragraph("7. Binary Container Specification (.svault Format)", h1_style))
    story.append(Paragraph(
        "SecureVault encapsulates all encrypted files into a portable binary container format with the <code>.svault</code> extension:",
        body_style,
    ))

    container_data = [
        [Paragraph("<b>Offset</b>", h2_style), Paragraph("<b>Field Name</b>", h2_style), Paragraph("<b>Length</b>", h2_style), Paragraph("<b>Description</b>", h2_style)],
        [Paragraph("00 .. 05", code_style), Paragraph("Magic Header", body_style), Paragraph("6 Bytes", body_style), Paragraph("ASCII identifier <code>b'SVAULT'</code>", body_style)],
        [Paragraph("06", code_style), Paragraph("Format Version", body_style), Paragraph("1 Byte", body_style), Paragraph("uint8 format version (0x01)", body_style)],
        [Paragraph("07", code_style), Paragraph("Reserved Flags", body_style), Paragraph("1 Byte", body_style), Paragraph("uint8 reserved (0x00)", body_style)],
        [Paragraph("08 .. 23", code_style), Paragraph("PBKDF2 Salt", body_style), Paragraph("16 Bytes", body_style), Paragraph("Cryptographic random salt for key regeneration", body_style)],
        [Paragraph("24 .. 31", code_style), Paragraph("DES IV", body_style), Paragraph("8 Bytes", body_style), Paragraph("Random 8-byte Initialization Vector for CBC mode", body_style)],
        [Paragraph("32", code_style), Paragraph("Matrix Dim (n)", body_style), Paragraph("1 Byte", body_style), Paragraph("Matrix dimension (2 for 2×2)", body_style)],
        [Paragraph("33 .. 36", code_style), Paragraph("Hill Matrix K", body_style), Paragraph("4 Bytes", body_style), Paragraph("Matrix entries a, b, c, d (uint8)", body_style)],
        [Paragraph("37 .. 44", code_style), Paragraph("Original Size", body_style), Paragraph("8 Bytes", body_style), Paragraph("uint64 big-endian original unpadded file size", body_style)],
        [Paragraph("45 .. 46", code_style), Paragraph("Filename Length", body_style), Paragraph("2 Bytes", body_style), Paragraph("uint16 big-endian filename byte count (flen)", body_style)],
        [Paragraph("47 .. 47+flen", code_style), Paragraph("Filename", body_style), Paragraph("Variable", body_style), Paragraph("UTF-8 encoded original file name", body_style)],
        [Paragraph("+00 .. +07", code_style), Paragraph("Ciphertext Len", body_style), Paragraph("8 Bytes", body_style), Paragraph("uint64 big-endian DES ciphertext length (clen)", body_style)],
        [Paragraph("+08 .. +08+clen", code_style), Paragraph("DES Ciphertext", body_style), Paragraph("Variable", body_style), Paragraph("PKCS#7 padded encrypted payload bytes", body_style)],
        [Paragraph("-32 .. End", code_style), Paragraph("HMAC-SHA256 Tag", body_style), Paragraph("32 Bytes", body_style), Paragraph("Authentication signature over all preceding bytes", body_style)],
    ]
    container_table = Table(container_data, colWidths=[70, 110, 74, 250])
    container_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(container_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 8: FULL-STACK MONOREPO IMPLEMENTATION
    # =========================================================================
    story.append(Paragraph("8. Implementation & Tech Stack Architecture", h1_style))
    story.append(Paragraph(
        "SecureVault is structured as a clean, decoupled monorepo designed to run locally on standard hardware without external cloud services:",
        body_style,
    ))
    story.append(Paragraph(
        "• <b>Frontend Architecture:</b> Built with Next.js 16 (React 19, TypeScript), Tailwind CSS, and Framer Motion. "
        "Features an Apple-inspired Liquid Glass UI, responsive dark/light mode toggle with localStorage persistence, "
        "file dropzone with touch support, real-time pipeline visualizers, and an interactive live Hill matrix invertibility calculator.",
        bullet_style,
    ))
    story.append(Paragraph(
        "• <b>Backend Architecture:</b> Built with Python 3 and FastAPI, served via Uvicorn. Implements path traversal defense, "
        "zero plaintext password logging, constant-time authentication, and modular crypto packages.",
        bullet_style,
    ))
    story.append(Paragraph(
        "• <b>Persistence Layer:</b> Lightweight local SQLite database (<code>database.db</code>) recording audit history, file sizes, "
        "timestamps, and SHA-256 hashes without storing user passwords or keys.",
        bullet_style,
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 9: EXPERIMENTAL VERIFICATION & TEST SUITE
    # =========================================================================
    story.append(Paragraph("9. Experimental Verification & Test Suite", h1_style))
    story.append(Paragraph(
        "The system has been verified using an automated test suite comprising <b>18 test cases</b> across both unit "
        "and integration levels. All 18 tests pass with 100% success:",
        body_style,
    ))

    test_data = [
        [Paragraph("<b>Test Case Category</b>", h2_style), Paragraph("<b>Target Data / Condition</b>", h2_style), Paragraph("<b>Verification Standard</b>", h2_style), Paragraph("<b>Result</b>", h2_style)],
        [Paragraph("01. Hill Cipher Unit Test", body_style), Paragraph("Random 8-bit byte sequences in Z_256", body_style), Paragraph("Matrix modular inversion C · K^-1 == P", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("02. DES-CBC Unit Test", body_style), Paragraph("Binary blocks with PKCS#7 padding", body_style), Paragraph("Block alignment & padding removal", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("03. Plaintext Document", body_style), Paragraph("ASCII / UTF-8 text file (.txt)", body_style), Paragraph("SHA-256(Original) == SHA-256(Decrypted)", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("04. Binary Document", body_style), Paragraph("Portable Document Format (.pdf)", body_style), Paragraph("Header & binary EOF byte-for-byte equality", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("05. Raster Image", body_style), Paragraph("PNG / JPEG bitmap graphic (.png)", body_style), Paragraph("Pixel buffers & metadata byte-for-byte equality", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("06. Compressed Archive", body_style), Paragraph("Multi-file ZIP archive (.zip)", body_style), Paragraph("Archive integrity & subfile extraction verified", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("07. Edge Case: Empty File", body_style), Paragraph("0-byte empty file", body_style), Paragraph("Graceful handling with 0-byte roundtrip", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("08. Large Binary Dataset", body_style), Paragraph("1 MB pseudo-random binary payload", body_style), Paragraph("Hash match across 1,048,576 bytes", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("09. Wrong Password Rejection", body_style), Paragraph("Incorrect credentials supplied", body_style), Paragraph("HMAC verification fails; 400 Bad Request", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("10. Ciphertext Tampering", body_style), Paragraph("Single-bit flipped in ciphertext", body_style), Paragraph("HMAC fails; DES unpadding aborted safely", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("11. Corrupted Container", body_style), Paragraph("Truncated .svault file", body_style), Paragraph("Container parser detects incomplete header", body_style), Paragraph("<b>PASS</b>", body_style)],
        [Paragraph("12. REST API Integration", body_style), Paragraph("Upload -> Encrypt -> Download -> Decrypt", body_style), Paragraph("Full roundtrip via HTTP client endpoints", body_style), Paragraph("<b>PASS</b>", body_style)],
    ]
    test_table = Table(test_data, colWidths=[120, 134, 190, 60])
    test_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#E2E8F0")),
        ("GRID", (0, 0), (-1, -1), 0.5, c_border),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(test_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # SECTION 10: PRESENTATION SLIDE-BY-SLIDE BLUEPRINT (FOR NOTEBOOKLM)
    # =========================================================================
    story.append(Paragraph("10. Slide Deck Blueprint (Direct Directive for NotebookLM PPT Generation)", h1_style))
    story.append(Paragraph(
        "<b>Note for NotebookLM:</b> Use the following 18-slide structure as the primary blueprint when generating presentation "
        "outlines, slide content, and presentation summaries. Maintain large typography, high contrast, and minimal colors.",
        body_style,
    ))

    slides_outline = [
        ("Slide 01: Title Slide", "SECURE FILE SHARING SYSTEM Using Hill Cipher + DES (SecureVault). B.Tech CSE Mini-Project, CNS Course."),
        ("Slide 02: Why Secure File Sharing?", "Problem statement: 01 Single-layer vulnerability, 02 Classical Hill Cipher cannot handle binary files (mod 26 limit), 03 DES has limited 56-bit key. Our Approach: Hill in Z_256 + DES-CBC + HMAC-SHA256."),
        ("Slide 03: Challenge vs. SecureVault", "Comparative analysis: Left (Challenge: mod 26 restriction, single cipher risk) vs. Right (SecureVault: Z_256 byte handling, CBC mode, 100k PBKDF2 rounds, HMAC tag)."),
        ("Slide 04: System Architecture Pipeline", "Horizontal pipeline: [01 FILE] -> [02 PBKDF2] -> [03 HILL] -> [04 DES-CBC] -> [05 HMAC] -> [06 .SVAULT]. Fully reversible decryption."),
        ("Slide 05: Cryptographic Key Pipeline", "User password + 16B salt -> PBKDF2 (100k rounds) -> 64 bytes partitioned into DES Key (8B), HMAC Key (32B), and Hill Matrix Seed (4B)."),
        ("Slide 06: Hill Cipher in Ring Z_256", "Central formula: C = (P * K^T) mod 256. 3 points: operates on 8-bit bytes, supports arbitrary files, invertible 2x2 matrix."),
        ("Slide 07: Hill Cipher Invertibility", "Equation: gcd(det(K), 256) = 1. Since 256 = 2^8, det(K) MUST BE ODD. Parity construction proof: diagonal odd, off-diagonal even guarantees odd determinant."),
        ("Slide 08: DES in CBC Mode", "Specifications: 64-bit blocks + 56-bit key + 16 Feistel rounds. CBC chaining formula C_i = DES(P_i ⊕ C_{i-1}) with random 8-byte IV."),
        ("Slide 09: Why CBC Over ECB?", "Comparison: ECB mode leaks structural patterns (identical blocks = identical ciphertexts). CBC mode diffuses blocks using XOR chaining."),
        ("Slide 10: Defense in Depth (PBKDF2 + HMAC)", "Two security pillars: PBKDF2 (100k rounds mitigates GPU dictionary attacks) and HMAC-SHA256 (constant-time verification stops bit-flipping)."),
        ("Slide 11: .svault Binary Container", "Visual layout: Magic b'SVAULT', Version, Salt, IV, Hill Matrix, Metadata, DES Ciphertext, HMAC-SHA256 tag."),
        ("Slide 12: Important Security Advisory", "Prominent statement: DES IS OBSOLETE FOR MODERN PRODUCTION SECURITY. 56-bit key is brute-force vulnerable. Used here for academic Feistel study. Modern standard: AES-256-GCM."),
        ("Slide 13: Testing & Quality Assurance", "Display numbers: 18 TEST CASES, 100% ALL PASSED. Checkmarks: TXT, PDF, PNG/JPG, ZIP, Empty file, 1MB binary, Wrong password, Tampered ciphertext, Corrupted container."),
        ("Slide 14: Byte-for-Byte Validation", "Original File SHA-256 == Decrypted File SHA-256 -> ✓ BYTE-FOR-BYTE MATCH. Proves complete mathematical reversibility."),
        ("Slide 15: Live Demonstration Flow", "7-step walkthrough: 1 Upload -> 2 Set Key -> 3 Hill mod 256 -> 4 DES-CBC -> 5 Get .svault -> 6 Decrypt -> 7 SHA-256 Match ✓."),
        ("Slide 16: Viva Defense: Core Questions", "Cheat sheet: Why Z_256? (byte compatibility); Why odd determinant? (invertibility); Why CBC? (pattern elimination); Why HMAC? (integrity); Why not DES in production? (56-bit key)."),
        ("Slide 17: SecureVault Key Takeaways", "Summary: 01 Binary-compatible Hill, 02 Layered Feistel defense, 03 PBKDF2 + HMAC integrity, 04 Verified 100% byte fidelity."),
        ("Slide 18: Final Slide", "THANK YOU. Questions & Answers. SecureVault • Department of Computer Science & Engineering."),
    ]

    for title, desc in slides_outline:
        story.append(Paragraph(f"<b>{title}:</b> {desc}", bullet_style))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 11: VIVA VOCE DEFENSE GUIDE (TOP EXAMINER QUESTIONS)
    # =========================================================================
    story.append(Paragraph("11. Viva Voce Defense Question & Answer Guide", h1_style))
    story.append(Paragraph(
        "This section prepares students for oral examination and technical defense before faculty panels:",
        body_style,
    ))

    viva_qa = [
        ("Q1: Can classical Hill Cipher encrypt images or PDF files without corruption?",
         "Answer: No. Classical Hill Cipher operates modulo 26 on uppercase English letters (A-Z). Binary files contain 256 distinct byte values (0-255). SecureVault formulates the Hill Cipher over Ring Z_256, mapping every byte directly to an element of the ring, preserving binary headers and data byte-for-byte."),
        ("Q2: How do you mathematically guarantee that the Hill matrix is invertible modulo 256?",
         "Answer: In any integer ring Z_m, an n×n matrix is invertible if and only if gcd(det(K) mod m, m) = 1. Since 256 = 2^8, its only prime factor is 2. Therefore, gcd(det(K), 256) = 1 if and only if det(K) is an ODD integer. SecureVault enforces that diagonal entries a and d are odd, and off-diagonal entries b and c are even. Since (odd × odd) - (even × even) = odd - even = odd, det(K) is mathematically guaranteed to be odd, ensuring universal invertibility."),
        ("Q3: What attack does Encrypt-then-MAC (HMAC-SHA256) prevent?",
         "Answer: Symmetric ciphers in CBC mode provide confidentiality, but not authenticity or integrity. An attacker could alter ciphertext bits (bit-flipping) or conduct padding oracle attacks by observing server padding error responses. SecureVault computes an HMAC-SHA256 tag over the entire container and verifies it in constant time (hmac.compare_digest) prior to executing any decryption or unpadding. If corrupted, decryption aborts immediately with a generic error."),
        ("Q4: Why is CBC mode preferred over ECB mode in DES?",
         "Answer: In ECB mode, each 64-bit block is encrypted independently. Identical plaintext blocks produce identical ciphertext blocks, preserving structural patterns (e.g. the ECB Penguin). In CBC mode, each plaintext block is XORed with the previous ciphertext block before encryption, initialized with a random 8-byte IV. Two identical files or blocks produce completely randomized, dissimilar ciphertexts."),
        ("Q5: Why is PBKDF2 used instead of a standard single-round SHA-256 hash?",
         "Answer: Single-round SHA-256 hashes can be calculated billions of times per second on modern consumer GPUs, making dictionary attacks easy. PBKDF2 (NIST SP 800-132) applies 100,000 iterations of HMAC-SHA256 with a 16-byte random salt, making brute-force password guessing computationally intractable and preventing precomputed rainbow table attacks."),
        ("Q6: Is DES considered secure for modern production systems?",
         "Answer: No. DES has an effective key length of 56 bits (2^56 ≈ 7.2 × 10^16 keys), which can be exhausted by modern GPU clusters or distributed cloud hardware in a matter of hours. We explicitly disclose this in our application and project report. DES is included here strictly for academic exploration of Feistel structures and CBC block chaining. Modern production systems must deploy AES-256-GCM or ChaCha20-Poly1305."),
    ]

    for q, a in viva_qa:
        story.append(Paragraph(f"<b>{q}</b>", h2_style))
        story.append(Paragraph(a, body_style))

    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 12: CONCLUSION
    # =========================================================================
    story.append(Paragraph("12. Conclusion & Summary", h1_style))
    story.append(Paragraph(
        "SecureVault demonstrates that classical linear matrix algebra (Hill Cipher) and standard Feistel block ciphers (DES) "
        "can be rigorously compounded into a functional, authenticated file sharing system. By extending the Hill Cipher "
        "to the integer ring Z_256, the system achieves universal binary compatibility with guaranteed mathematical invertibility. "
        "The end-to-end integration of PBKDF2, DES-CBC, PKCS#7 padding, and HMAC-SHA256 ensures complete byte-for-byte fidelity "
        "while providing defense-in-depth against structural pattern leakage, dictionary attacks, and unauthorized tampering.",
        body_style,
    ))

    # Build the document using NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[✓] Generated NotebookLM source PDF: {pdf_path}")
    return pdf_path


if __name__ == "__main__":
    build_pdf("SecureVault_Project_NotebookLM_Source.pdf")
