# Secure File Sharing System Using Hill Cipher and DES (SecureVault)

> **Academic B.Tech Computer Science & Engineering Mini-Project**  
> **Course / Subject:** Cryptography and Network Security (CNS)  
> **Product Name:** SecureVault  
> **Subtitle:** Secure File Sharing using Hill Cipher + DES  

---

## ⚠️ Important Educational Cryptography Notice

> **Academic Security Advisory:**  
> This project is designed strictly for **educational and pedagogical demonstrations** of layered cryptography.  
> **DES (Data Encryption Standard)** is cryptographically **obsolete** for modern production security due to its small 56-bit effective key length (2⁵⁶ ≈ 7.2 × 10¹⁶ combinations), which can be brute-forced within hours by modern GPU clusters or distributed hardware.  
> SecureVault combines a linear algebraic matrix cipher (**Hill Cipher over $\mathbb{Z}_{256}$**) with a classic Feistel block cipher (**DES-CBC**), hardened with modern **PBKDF2-HMAC-SHA256** key derivation and **HMAC-SHA256 Encrypt-then-MAC** authenticated integrity. For modern commercial deployments, AES-256-GCM or ChaCha20-Poly1305 must always be preferred.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Screenshots](#screenshots)
4. [System Architecture](#system-architecture)
5. [Cryptographic Pipeline Flow](#cryptographic-pipeline-flow)
   - [Encryption Flow](#encryption-flow)
   - [Decryption Flow](#decryption-flow)
6. [Deep-Dive Cryptographic Mathematical Principles](#deep-dive-cryptographic-mathematical-principles)
   - [Hill Cipher Modulo 256 for Binary Files](#1-hill-cipher-modulo-256-for-binary-files)
   - [Data Encryption Standard (DES) in CBC Mode](#2-data-encryption-standard-des-in-cbc-mode)
   - [Cipher Block Chaining (CBC) Mode](#3-cipher-block-chaining-cbc-mode)
   - [PBKDF2 Key Derivation Function](#4-pbkdf2-key-derivation-function)
   - [HMAC-SHA256 Encrypt-then-MAC Authentication](#5-hmac-sha256-encrypt-then-mac-authentication)
7. [The `.svault` Binary Container Format](#the-svault-binary-container-format)
8. [Technology Stack](#technology-stack)
9. [Folder Structure](#folder-structure)
10. [Prerequisites](#prerequisites)
11. [Step-by-Step Installation & Setup](#step-by-step-installation--setup)
    - [macOS / Linux](#macos--linux)
    - [Windows (PowerShell)](#windows-powershell)
12. [Running Automated Tests](#running-automated-tests)
13. [Live Viva Demonstration Script](#live-viva-demonstration-script)
14. [REST API Documentation](#rest-api-documentation)
15. [Security Checklist & Defense-in-Depth](#security-checklist--defense-in-depth)
16. [License & Acknowledgments](#license--acknowledgments)

---

## Project Overview

**SecureVault** is an end-to-end, production-grade cryptographic web application that implements a two-stage hybrid cryptosystem:
1. **Stage 1 (Linear Algebraic Diffusion):** Hill Cipher operating on arbitrary 8-bit bytes in the integer ring $\mathbb{Z}_{256}$.
2. **Stage 2 (Non-Linear Confusion & Block Permutation):** 64-bit DES in CBC (Cipher Block Chaining) mode with PKCS#7 padding.
3. **Stage 3 (Integrity & Authentication):** Encrypt-then-MAC (EtM) paradigm utilizing HMAC-SHA256 to guard against bit-flipping and padding oracle attacks.

Users can upload any arbitrary file format (PDFs, Word documents, PNG/JPEG images, ZIP archives, raw binary binaries, or plain text), supply a passphrase, encrypt it into a sealed `.svault` container, download it, and subsequently decrypt it with guaranteed **100% byte-for-byte fidelity** verified via cryptographic SHA-256 digests.

---

## Key Features

- **End-to-End File Encryption & Decryption:** Supports any file up to 50 MB with byte-for-byte fidelity.
- **Novel Binary Hill Cipher Extension:** Expands classical Hill Cipher from mod 26 (A-Z) to mod 256 ($\mathbb{Z}_{256}$) with guaranteed invertibility ($\gcd(\det(K), 256) = 1$).
- **DES-CBC Implementation:** Uses PyCryptodome's robust DES engine in CBC mode with secure 8-byte random IVs and PKCS#7 padding.
- **PBKDF2 Key Derivation:** 100,000 iterations of HMAC-SHA256 with 16-byte cryptographically secure random salts.
- **Encrypt-then-MAC Integrity:** Constant-time HMAC-SHA256 comparison blocks unauthorized decryption attempts and tampered payloads immediately.
- **Apple Liquid Glass UI/UX:** Frosted translucent glassmorphism surfaces (`backdrop-blur-2xl`), responsive cards, smooth micro-animations, and system typography.
- **Dark Mode & Light Mode:** Seamless theme toggle with local persistence.
- **Live Visual Cryptographic Pipeline:** Real-time multi-stage visual progression showing each mathematical transformation.
- **Interactive Hill Matrix Calculator:** In-browser tool on the About page allowing students and examiners to test matrix determinants and compute modular inverses in $\mathbb{Z}_{256}$.
- **Immutable SQLite Audit History:** Logs file operations, sizes, algorithms, statuses, and SHA-256 hashes without storing passwords or secret keys.

---

## Screenshots

> *Tip for Students:* Take screenshots of each page while running the application and place them into `frontend/public/screenshots/`.

| Dashboard | Encrypt Page |
|:---:|:---:|
| ![Dashboard Screenshot](frontend/public/screenshots/dashboard.png)<br>*Liquid Glass Hero & Metric Cards* | ![Encrypt Screenshot](frontend/public/screenshots/encrypt.png)<br>*Multi-stage Upload & Encryption Pipeline* |

| Decrypt Page | Interactive Matrix Inverter |
|:---:|:---:|
| ![Decrypt Screenshot](frontend/public/screenshots/decrypt.png)<br>*Authenticated Container Decryption* | ![About Screenshot](frontend/public/screenshots/about.png)<br>*Live $\mathbb{Z}_{256}$ Matrix Evaluation Tool* |

---

## System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                    SECUREVAULT CLIENT                                   |
|   (Next.js 16 + React 19 + TypeScript + Tailwind CSS + Framer Motion + Lucide React)    |
+-----------------------------------------------------------------------------------------+
       |                                           |                                   |
       | POST /api/encrypt                         | POST /api/decrypt                 | GET /api/history
       | (File + Password)                         | (.svault + Password)              |
       v                                           v                                   v
+-----------------------------------------------------------------------------------------+
|                                    FASTAPI BACKEND                                      |
|                              (Uvicorn ASGI Server :8000)                                |
+-----------------------------------------------------------------------------------------+
|  Controllers:                                                                           |
|   ├── encryption.py  -> Validates size/name, executes pipeline, stores .svault          |
|   ├── decryption.py  -> Verifies HMAC, reverses DES-CBC & Hill Cipher, restores file    |
|   ├── history.py     -> Returns paginated audit logs & dashboard metrics                |
|   └── files.py       -> Sanitized streaming file download (/api/download/{id})          |
+-----------------------------------------------------------------------------------------+
|  Cryptographic Engine:                                                                  |
|   ├── key_utils.py   -> PBKDF2 (100k rounds SHA256) -> DES key + HMAC key + Hill matrix |
|   ├── hill_cipher.py -> Linear algebra in Z_256 (Matrix modinv, Extended Euclidean)    |
|   ├── des_cipher.py  -> PyCryptodome DES.MODE_CBC + PKCS#7 padding                      |
|   └── pipeline.py    -> .svault binary pack/unpack + Encrypt-then-MAC authentication    |
+-----------------------------------------------------------------------------------------+
|  Storage Layer:                                                                         |
|   ├── SQLite 3 (database.db) -> Operations audit table (Zero plaintext password store) |
|   ├── uploads/               -> Transient upload workspace                              |
|   ├── encrypted/             -> Stored .svault encrypted containers                     |
|   └── decrypted/             -> Stored recovered original files                         |
+-----------------------------------------------------------------------------------------+
```

---

## Cryptographic Pipeline Flow

### Encryption Flow

```
[ Plaintext File Bytes (Any Format) ]
                  |
                  v
[ 1. PBKDF2 Key Derivation ]
      Input: Password + 16-byte Random Salt (100,000 rounds HMAC-SHA256)
      Outputs:
        ├── DES Key (8 bytes / 56 effective bits)
        ├── HMAC Key (32 bytes / 256 bits)
        └── Hill Matrix Seed (4 bytes -> invertible 2x2 matrix K in Z_256)
                  |
                  v
[ 2. Hill Cipher Layer 1 ]
      Formula: C1 = (P * K^T) mod 256
      Linear matrix multiplication over 2-byte blocks in Z_256
                  |
                  v
[ 3. DES-CBC Layer 2 ]
      8-byte Random IV + PKCS#7 Block Padding
      Formula: C2_i = DES_Key_Encrypt(C1_i ⊕ C2_{i-1})
                  |
                  v
[ 4. Binary Packaging ]
      Header: MAGIC("SVAULT") + Version + Salt + IV + Matrix K + File Size + Filename
      Payload: DES Ciphertext
                  |
                  v
[ 5. Integrity Tag (Encrypt-then-MAC) ]
      Tag = HMAC-SHA256(HMAC_Key, Header + Payload)
                  |
                  v
[ Sealed Output: filename.svault ]
```

### Decryption Flow

```
[ Uploaded filename.svault Container ]
                  |
                  v
[ 1. Header Extraction & Validation ]
      Verify MAGIC == b"SVAULT" and Version == 1
      Extract: Salt (16B), IV (8B), Matrix K (4B), Original Size, Filename, Ciphertext, HMAC
                  |
                  v
[ 2. Key Regeneration ]
      Re-derive DES Key, HMAC Key, Matrix K using Password + Extracted Salt (PBKDF2)
                  |
                  v
[ 3. Constant-Time HMAC Verification ]
      Compute: Expected_Tag = HMAC-SHA256(HMAC_Key, Container_Bytes[0 : end-32])
      Compare: hmac.compare_digest(Expected_Tag, Stored_Tag)
      ──> If mismatch: ABORT IMMEDIATELY ("Decryption failed: invalid key or corrupted file.")
                  |
                  v (Signature Matches)
[ 4. DES-CBC Decryption Layer 1 ]
      Decrypt ciphertext using DES Key and IV
      Remove PKCS#7 padding -> Yields Hill Ciphertext (C1)
                  |
                  v
[ 5. Hill Cipher Inversion Layer 2 ]
      Compute Modular Inverse: K^-1 = (det(K)^-1 * adj(K)) mod 256
      Formula: P = (C1 * (K^-1)^T) mod 256
      Trim zero-padding to Original File Size
                  |
                  v
[ Original Recovered File (Byte-for-Byte Exact Match) ]
```

---

## Deep-Dive Cryptographic Mathematical Principles

### 1. Hill Cipher Modulo 256 for Binary Files

The classical Hill cipher is defined over alphabet characters modulo 26:
$$C \equiv K \cdot P \pmod{26}$$

To handle arbitrary binary data without data corruption, **SecureVault** formulates the Hill Cipher over the ring of integers modulo 256 ($\mathbb{Z}_{256}$):
$$C \equiv (P \cdot K^T) \pmod{256}$$

#### Mathematical Invertibility Theorem in $\mathbb{Z}_{256}$:
A square matrix $K \in \mathbb{Z}_{256}^{n \times n}$ is invertible if and only if:
$$\gcd(\det(K) \pmod{256}, 256) = 1$$

Because $256 = 2^8$, its only prime factor is 2. Therefore:
$$\gcd(\det(K), 256) = 1 \iff \det(K) \text{ is ODD} \iff \det(K) \equiv 1 \pmod 2$$

#### Guaranteed Invertible Key Derivation:
For a $2 \times 2$ matrix $K = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$, $\det(K) = (a \cdot d - b \cdot c) \pmod{256}$.
By enforcing:
- $a$ is odd ($a \equiv 1 \pmod 2$)
- $d$ is odd ($d \equiv 1 \pmod 2$)
- $b$ is even ($b \equiv 0 \pmod 2$)
- $c$ is even ($c \equiv 0 \pmod 2$)

We obtain:
$$\det(K) \equiv (\text{odd} \cdot \text{odd}) - (\text{even} \cdot \text{even}) \equiv 1 - 0 \equiv 1 \pmod 2$$
Thus, **$\det(K)$ is unconditionally odd**, and $\gcd(\det(K), 256) = 1$ is mathematically guaranteed!

#### Modular Inverse Calculation:
1. Determinant Inverse: Find $d^{-1}$ using the Extended Euclidean Algorithm such that $(d \cdot d^{-1}) \equiv 1 \pmod{256}$.
2. Adjugate Matrix:
   $$\operatorname{adj}(K) = \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$$
3. Inverse Matrix:
   $$K^{-1} \equiv (d^{-1} \cdot \operatorname{adj}(K)) \pmod{256}$$

---

### 2. Data Encryption Standard (DES) in CBC Mode

DES is an iterative 16-round symmetric block cipher utilizing a **Feistel structure**:
- **Block Length:** 64 bits (8 bytes)
- **Key Length:** 64 bits total, of which 56 bits are active and 8 bits are parity checks.
- **Round Function:**
  $$L_i = R_{i-1}$$
  $$R_i = L_{i-1} \oplus F(R_{i-1}, K_i)$$
  where $F$ performs 32-to-48 bit expansion (E), key mixing, non-linear S-box substitution (8 S-boxes), and permutation (P).

### 3. Cipher Block Chaining (CBC) Mode

In CBC mode:
$$C_0 = \text{IV}$$
$$C_i = E_K(P_i \oplus C_{i-1}), \quad i \ge 1$$

Decryption reverses the chain:
$$P_i = D_K(C_i) \oplus C_{i-1}, \quad C_0 = \text{IV}$$

**PKCS#7 Padding:** Appends $N$ bytes each with byte value $N$ (where $1 \le N \le 8$) to bring total plaintext length to an exact multiple of 8.

---

### 4. PBKDF2 Key Derivation Function

Passwords have low entropy compared to raw 256-bit cryptographic keys. SecureVault employs **PBKDF2** (Password-Based Key Derivation Function 2) according to **NIST SP 800-132**:
$$\text{DK} = \text{PBKDF2}(\text{PRF}=\text{HMAC-SHA256}, \text{Password}, \text{Salt}, \text{Count}=100000, \text{Len}=64)$$
- **Salt:** 16 cryptographically secure random bytes generated via `os.urandom`.
- **Iteration Count:** 100,000 rounds.

---

### 5. HMAC-SHA256 Encrypt-then-MAC Authentication

CBC mode is vulnerable to padding oracle attacks and bit-flipping if unauthenticated. SecureVault applies the **Encrypt-then-MAC (EtM)** architecture:
$$\text{MAC} = \text{HMAC-SHA256}(K_{\text{HMAC}}, \text{Header} \parallel \text{Ciphertext})$$
During decryption:
- Stored MAC and computed MAC are compared using constant-time string equality (`hmac.compare_digest`).
- Any tampering causes immediate termination with:
  `"Decryption failed: invalid key or corrupted file."`

---

## The `.svault` Binary Container Format

Every encrypted file produced by SecureVault has the `.svault` extension and follows this strictly documented binary specification:

```
+--------------------------------------------------------------------------------+
| Offset (Bytes) | Field Name            | Type      | Description               |
+--------------------------------------------------------------------------------+
| 00 .. 05       | Magic Bytes           | 6 bytes   | ASCII string b"SVAULT"    |
| 06             | Container Version     | uint8     | Version 0x01              |
| 07             | Flags                 | uint8     | Reserved (0x00)           |
| 08 .. 23       | Salt                  | 16 bytes  | Random PBKDF2 salt        |
| 24 .. 31       | IV                    | 8 bytes   | Random DES-CBC IV         |
| 32             | Hill Matrix Dim (n)   | uint8     | Matrix dimension (2)      |
| 33 .. 36       | Hill Coefficients     | 4 bytes   | a, b, c, d matrix entries |
| 37 .. 44       | Original File Size    | uint64 BE | Original unpadded length  |
| 45 .. 46       | Filename Length (flen)| uint16 BE | Length of filename string |
| 47 .. 47+flen  | Original Filename     | UTF-8     | Sanitized original name   |
| +00 .. +07     | Ciphertext Length (cl)| uint64 BE | DES ciphertext byte count |
| +08 .. +08+cl  | DES Ciphertext        | Bytes     | Padded encrypted bytes    |
| -32 .. End     | HMAC-SHA256 Tag       | 32 bytes  | Authentication checksum   |
+--------------------------------------------------------------------------------+
```

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 with custom Apple Liquid Glass design tokens
- **Animations:** Framer Motion 13
- **Icons:** Lucide React 1.48
- **Design Paradigm:** Frosted Glassmorphism, Dynamic Responsive Cards, Minimal Apple Typography

### Backend
- **Framework:** FastAPI 0.110+
- **ASGI Server:** Uvicorn
- **Cryptography Engine:** PyCryptodome 3.20+ (DES-CBC, PBKDF2, HMAC-SHA256)
- **Matrix Engine:** NumPy (Vectorized modular arithmetic in $\mathbb{Z}_{256}$)
- **Database:** SQLite 3 (Zero external database required)
- **File Uploads:** python-multipart
- **Testing:** Pytest 8+, HTTPX

---

## Folder Structure

```
secure-file-sharing/
│
├── frontend/                          # Next.js Frontend Application
│   ├── app/
│   │   ├── globals.css                # Apple Liquid Glass design system & tokens
│   │   ├── layout.tsx                 # Root layout with ToastProvider & Navbar
│   │   ├── page.tsx                   # Dashboard page
│   │   ├── encrypt/page.tsx           # Encryption page
│   │   ├── decrypt/page.tsx           # Decryption page
│   │   ├── history/page.tsx           # Operation audit history page
│   │   └── about/page.tsx             # Cryptographic documentation & playground
│   │
│   ├── components/
│   │   ├── Navbar.tsx                 # Liquid glass navigation with status dot
│   │   ├── Footer.tsx                 # Academic advisory & project credits
│   │   ├── GlassCard.tsx              # Translucent frosted glass card container
│   │   ├── GlassButton.tsx            # Micro-animated tactile action buttons
│   │   ├── GlassInput.tsx             # Input with strength meter & show/hide toggle
│   │   ├── FileDropzone.tsx           # Drag & drop upload area with touch support
│   │   ├── FilePreview.tsx            # Selected file metadata badge with type icons
│   │   ├── EncryptionPipeline.tsx     # Visual 4-stage encryption flowchart
│   │   ├── DecryptionPipeline.tsx     # Visual 5-stage decryption flowchart
│   │   ├── StatCard.tsx               # Dashboard metrics counter cards
│   │   ├── SecurityBadge.tsx          # Security posture compliance badges
│   │   ├── HistoryTable.tsx           # Responsive audit table with mobile cards
│   │   ├── Modal.tsx                  # Pop-up glass inspection modal
│   │   ├── Toast.tsx                  # Status notification alert manager
│   │   └── ThemeToggle.tsx            # Dark/Light mode theme switch
│   │
│   ├── lib/
│   │   ├── api.ts                     # REST client connecting to FastAPI backend
│   │   └── utils.ts                   # Formatters (bytes, dates, hash truncation)
│   ├── hooks/
│   │   └── useTheme.ts                # LocalStorage theme management hook
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces and response schemas
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts                 # API proxy rewrites to localhost:8000
│
├── backend/                           # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint, CORS, routers & health check
│   │   ├── database.py                # SQLite connection pool & queries
│   │   ├── schemas.py                 # Pydantic request/response validation schemas
│   │   │
│   │   ├── routes/
│   │   │   ├── encryption.py          # POST /api/encrypt endpoint
│   │   │   ├── decryption.py          # POST /api/decrypt endpoint
│   │   │   ├── history.py             # GET /api/history & GET /api/stats
│   │   │   └── files.py               # GET /api/download/{id} & /api/crypto tools
│   │   │
│   │   ├── crypto/
│   │   │   ├── hill_cipher.py         # Binary Hill Cipher mod 256 implementation
│   │   │   ├── des_cipher.py          # PyCryptodome DES in CBC mode
│   │   │   ├── pipeline.py            # Encrypt/Decrypt pipeline & .svault packing
│   │   │   └── key_utils.py           # PBKDF2 key derivation & strength assessment
│   │   │
│   │   └── utils/
│   │       ├── file_utils.py          # Path traversal prevention & safe filenames
│   │       └── validation.py          # Container, password, & file size validators
│   │
│   ├── uploads/                       # Temporary upload staging
│   ├── encrypted/                     # Saved .svault encrypted containers
│   ├── decrypted/                     # Saved recovered original files
│   ├── database.db                    # SQLite database file
│   ├── requirements.txt               # Backend dependencies
│   ├── demo_test.py                   # Terminal viva demonstration script
│   ├── .env.example
│   │
│   └── tests/
│       ├── test_crypto.py             # 13 unit tests verifying byte equality
│       └── test_api.py                # Integration tests for all REST endpoints
│
├── demo.txt                           # Sample file for quick demonstration
├── README.md                          # Full academic documentation
├── .gitignore
└── LICENSE
```

---

## Prerequisites

Ensure you have the following installed on your laptop:

1. **Python:** Version 3.10, 3.11, 3.12, 3.13, or 3.14  
   Check: `python3 --version`
2. **Node.js:** Version 18.0.0 or higher (LTS recommended)  
   Check: `node -v`
3. **npm:** Version 9.0.0 or higher  
   Check: `npm -v`

---

## Step-by-Step Installation & Setup

### macOS / Linux

```bash
# 1. Clone repository
git clone <repository-url>
cd "CNS project"

# 2. Set up Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 3. Install Backend Dependencies
pip install -r backend/requirements.txt

# 4. Install Frontend Dependencies
cd frontend
npm install
cd ..

# 5. Start the FastAPI Backend Server (Terminal 1)
source .venv/bin/activate
PYTHONPATH=backend uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 6. Start the Next.js Frontend Server (Terminal 2)
cd frontend
npm run dev -- -p 3000
```

Open your browser and navigate to:  
👉 **`http://localhost:3000`**

### Windows (PowerShell)

```powershell
# 1. Open PowerShell and navigate to project folder
cd "CNS project"

# 2. Create virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1

# 3. Install Backend Dependencies
pip install -r backend\requirements.txt

# 4. Install Frontend Dependencies
cd frontend
npm install
cd ..

# 5. Run Backend (Terminal 1)
$env:PYTHONPATH="backend"
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 6. Run Frontend (Terminal 2)
cd frontend
npm run dev -- -p 3000
```

---

## Running Automated Tests

To run the automated cryptographic test suite verifying byte-for-byte fidelity across all 13 test specifications:

```bash
# Activate virtual environment
source .venv/bin/activate

# Run pytest on crypto and API test suites
PYTHONPATH=backend pytest backend/tests/ -v
```

### Expected Pytest Output:
```
backend/tests/test_api.py::test_api_health PASSED
backend/tests/test_api.py::test_api_password_strength PASSED
backend/tests/test_api.py::test_api_validate_matrix PASSED
backend/tests/test_api.py::test_api_encrypt_decrypt_download_flow PASSED
backend/tests/test_api.py::test_api_wrong_password PASSED
backend/tests/test_crypto.py::TestHillCipher::test_01_hill_cipher_roundtrip PASSED
backend/tests/test_crypto.py::TestDESCipher::test_02_des_cipher_roundtrip PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_03_full_pipeline_roundtrip PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_04_text_file PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_05_pdf_file PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_06_image_file PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_07_zip_file PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_08_empty_file PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_09_large_file PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_10_wrong_password PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_11_corrupted_encrypted_file PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_12_modified_ciphertext PASSED
backend/tests/test_crypto.py::TestFullPipeline::test_13_invalid_svault_file PASSED

======================== 18 passed in 2.18s =========================
```

---

## Live Viva Demonstration Script

For viva examinations, a standalone Python verification script `demo_test.py` is included. It reads `demo.txt`, generates keys, encrypts via the pipeline, decrypts, and asserts identical SHA-256 hashes:

```bash
source .venv/bin/activate
python backend/demo_test.py
```

### Demonstration Terminal Output:
```
============================================================
 SecureVault Live Cryptographic Demo
 Layered Hill Cipher (Z_256) + DES (CBC) + HMAC-SHA256
============================================================

[1] Target File       : demo.txt
    Original Size     : 194 bytes
    Original SHA256   : 57fa05e7cf2e336f40bf70cb19dc3d1d0667d0b13424ab5300955568c13b0188
    Encryption Key    : AcademicDemoPass2026!

[2] Executing Encryption Pipeline...
    -> PBKDF2 (100k rounds) key derivation...
    -> Stage 1: Invertible 2x2 Hill Cipher modulo 256...
    -> Stage 2: DES in CBC Mode with PKCS#7 padding...
    -> Stage 3: Packaging .svault container & calculating HMAC-SHA256...
    Encrypted Container Size : 295 bytes
    Container SHA256         : 3b844473cd9414aa46e95f49f9568ccb52372b3a1b8d30c40a222661fe80385e
    Hill Matrix (K)          : [[245, 194], [110, 101]]
    Hill Determinant         : 77 (gcd=1, coprime to 256)
    Hill Inverse Matrix (K^-1): [[121, 54], [218, 73]]

[3] Executing Decryption Pipeline...
    -> Authenticating container header & payload with HMAC-SHA256...
    -> Stage 1: DES-CBC decryption & unpadding...
    -> Stage 2: Inverted Hill Cipher matrix multiplication mod 256...
    Recovered Filename: demo.txt
    Recovered Size    : 194 bytes
    Decrypted SHA256  : 57fa05e7cf2e336f40bf70cb19dc3d1d0667d0b13424ab5300955568c13b0188

============================================================
 VERIFICATION RESULTS
============================================================
Original SHA256 : 57fa05e7cf2e336f40bf70cb19dc3d1d0667d0b13424ab5300955568c13b0188
Decrypted SHA256: 57fa05e7cf2e336f40bf70cb19dc3d1d0667d0b13424ab5300955568c13b0188

 RESULT: [ PASS ] (Byte-for-byte exact equality guaranteed!)
============================================================
```

---

## REST API Documentation

FastAPI provides interactive Swagger documentation automatically at `http://localhost:8000/docs`.

### Core Endpoints

| Method | Endpoint | Description | Request Payload | Response |
|---|---|---|---|---|
| `POST` | `/api/encrypt` | Encrypt uploaded file | `file` (multipart), `password` (form), `custom_matrix` (optional) | JSON with download link & crypto metadata |
| `POST` | `/api/decrypt` | Decrypt `.svault` file | `file` (multipart), `password` (form) | JSON with download link & recovered metadata |
| `GET` | `/api/history` | List operation audit log | Query: `page`, `limit`, `operation`, `status`, `search` | Paginated JSON list of operations |
| `GET` | `/api/history/{id}` | Inspect operation detail | Path parameter: `id` | Operation record JSON |
| `GET` | `/api/download/{id}` | Download generated file | Path parameter: `id` | Binary file stream (`application/octet-stream`) |
| `GET` | `/api/stats` | Dashboard metrics | None | Total processed, encrypted, decrypted, storage |
| `POST` | `/api/crypto/validate-matrix` | Invertibility test in $\mathbb{Z}_{256}$ | JSON: `{"matrix": [[a,b],[c,d]]}` | Invertibility, $\det$, $\det^{-1}$, $K^{-1}$ |
| `POST` | `/api/crypto/password-strength` | Assess password entropy | JSON: `{"password": "..."}` | Score (0-4), level, suggestions |
| `GET` | `/api/health` | Service health status | None | `{"status": "ok"}` |

---

## Security Checklist & Defense-in-Depth

- [x] **Path Traversal Defense:** All filenames are sanitized with `os.path.basename` and regex stripping; file paths are verified with `resolve()` to ensure they never escape their designated directory.
- [x] **Zero Plaintext Password Storage:** Passwords and derived secret keys are never written to the database or logged in server output.
- [x] **Constant-Time Verification:** HMAC-SHA256 signature verification utilizes `hmac.compare_digest` to prevent timing attacks.
- [x] **Deterministic Reversible Modulo 256 Algebra:** Vectorized NumPy operations prevent floating-point rounding errors and ensure perfect modular arithmetic.
- [x] **File Size Capping:** Strict 50 MB limits prevent memory exhaustion denial-of-service.
- [x] **Sanitized Error Responses:** Internal stack traces are suppressed from client-facing API responses to prevent information leakage.

---

## License & Acknowledgments

This project is licensed under the **MIT License**.

Developed for academic presentation in the **Computer Network Security (CNS)** course. Special acknowledgment to Lester S. Hill (Hill Cipher, 1929) and the National Bureau of Standards (DES, 1977) for their foundational contributions to modern cryptographic history.
