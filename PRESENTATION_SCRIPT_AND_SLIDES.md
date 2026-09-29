# SecureVault: Classroom Presentation Script & Viva Defense Guide

> **Generated Presentation File:** [`SecureVault_Presentation.pptx`](file:///Users/rama/Desktop/CNS%20project/SecureVault_Presentation.pptx)  
> **Course / Subject:** Cryptography and Network Security (CNS)  
> **Topic:** Secure File Sharing System Using Hill Cipher and DES  
> **Design Style:** Apple Keynote + Modern Cybersecurity Aesthetic  
> **Slide Format:** 16:9 Widescreen, 18 Slides, Near-Black Palette (`#0B0F17`) with Subtle Sky Blue Accent (`#38BDF8`), 6-Meter Classroom Readability.

---

## 18-Slide Classroom Walkthrough & Speaking Script

---

### Slide 01: Cover Slide
- **Main Heading (40 pt):** SECURE FILE SHARING SYSTEM
- **Accent Subtitle (28 pt):** Using Hill Cipher + DES
- **Product Identifier (20 pt):** PRODUCT: SecureVault
- **Academic Context:** B.Tech CSE Mini-Project • Cryptography & Network Security

#### 🎙️ Speaking Script (15 seconds):
> *"Good morning/afternoon respected examiners and professors. Today, I am presenting our Cryptography and Network Security project: **'Secure File Sharing System Using Hill Cipher and DES'**, titled **SecureVault**.*  
> *This system implements a two-stage hybrid cryptosystem operating in ring $\mathbb{Z}_{256}$ with DES-CBC and HMAC-SHA256 authenticated integrity."*

---

### Slide 02: Why Secure File Sharing?
- **3 Visual Challenge Cards:**
  - `01` **Single-Layer Vulnerability:** Relying on one cipher creates a single point of failure.
  - `02` **Classical Hill Cipher Limit:** Classical Hill Cipher is mod 26 (A–Z only); it corrupts binary files (PDFs, images, ZIPs).
  - `03` **DES 56-Bit Key Constraint:** 56-bit effective keyspace is vulnerable to modern GPU brute-force attacks.
- **Bottom Banner:**
  `OUR APPROACH: Hill Cipher in Z_256 + DES-CBC + HMAC-SHA256 Integrity`

#### 🎙️ Speaking Script (30 seconds):
> *"Why did we build this? In real-world security, single-layer encryption poses significant risks. Classical Hill Cipher cannot handle binary files because it operates modulo 26, which only covers English letters.*  
> *Meanwhile, DES alone has a 56-bit key length that is vulnerable to modern GPU clusters. To demonstrate layered defense, our approach combines Hill Cipher over $\mathbb{Z}_{256}$, DES in CBC mode, and HMAC-SHA256 authentication."*

---

### Slide 03: The Challenge vs. SecureVault
- **Left Column (The Challenge):**
  - Single cipher dependency creates systemic risk
  - Classical Hill Cipher restricted to mod 26
  - Binary files require exact byte-level preservation
  - DES alone provides limited modern security
- **Right Column (SecureVault - Highlighted in Blue):**
  - ✓ Hill Cipher extended to Ring $\mathbb{Z}_{256}$ (handles all 256 bytes)
  - ✓ DES in CBC mode with random 8-byte IV per file
  - ✓ PBKDF2 key derivation (100,000 SHA-256 rounds)
  - ✓ HMAC-SHA256 Encrypt-then-MAC authentication tag

#### 🎙️ Speaking Script (30 seconds):
> *"Comparing the challenge to our solution:*  
> *Rather than altering file bytes or restricting users to text files, SecureVault operates at the byte level in $\mathbb{Z}_{256}$. We replace ECB with CBC mode to prevent pattern leakage, derive keys using 100,000 PBKDF2 rounds, and seal the file using an Encrypt-then-MAC tag."*

---

### Slide 04: System Architecture Pipeline
- **Horizontal 6-Stage Flow:**
  `[01 FILE] → [02 PBKDF2] → [03 HILL] → [04 DES-CBC] → [05 HMAC] → [06 .SVAULT]`
- **Decryption:** Fully symmetrical and reverse: Verify HMAC → DES Decrypt → Hill Decrypt → Original File.

#### 🎙️ Speaking Script (25 seconds):
> *"Here is the complete end-to-end architecture:*  
> *The original file bytes are processed through PBKDF2 key derivation, then passed into Layer 1 (Hill Cipher in $\mathbb{Z}_{256}$), followed by Layer 2 (DES in CBC mode). Finally, an HMAC-SHA256 tag is computed and sealed into the `.svault` container.*  
> *Decryption performs these stages in reverse after verifying the HMAC tag."*

---

### Slide 05: Cryptographic Key Pipeline
- **Top:** User Password + 16-byte Random Salt
- **Center Box:** PBKDF2-HMAC-SHA256 (100,000 Rounds) $\rightarrow$ 64 Derived Pseudorandom Bytes
- **3 Partitioned Keys:**
  - `DES Key` (8 Bytes / 64 bits): 56 effective bits for DES-CBC
  - `HMAC Key` (32 Bytes / 256 bits): Integrity Authentication (Encrypt-then-MAC)
  - `Hill Matrix Seed` (4 Bytes / 32 bits): Builds invertible $2 \times 2$ matrix

#### 🎙️ Speaking Script (25 seconds):
> *"Key management is handled without storing plaintext passwords. The user's passphrase and a 16-byte random salt are passed through 100,000 rounds of PBKDF2.*  
> *This produces 64 bytes partitioned into an 8-byte DES key, a 32-byte HMAC key, and a 4-byte seed that deterministically generates an invertible Hill matrix."*

---

### Slide 06: Hill Cipher in Ring $\mathbb{Z}_{256}$
- **Prominent Formula (40 pt):**
  $$C \equiv (P \times K^T) \pmod{256}$$
  $$\text{Decryption: } P \equiv (C \times (K^{-1})^T) \pmod{256}$$
- **3 Key Principles:**
  - Operates directly on 8-bit bytes ($0$ to $255$).
  - Preserves arbitrary binary structures (PDF, PNG, ZIP, binaries).
  - Uses an invertible $2 \times 2$ matrix in ring $\mathbb{Z}_{256}$.

#### 🎙️ Speaking Script (30 seconds):
> *"In Stage 1, we implement the Hill Cipher over the algebraic ring $\mathbb{Z}_{256}$.*  
> *Each pair of plaintext bytes is multiplied by the transpose of an invertible key matrix $K$ modulo 256. Decryption is the exact inverse operation, multiplying by $K^{-1}$ modulo 256. This guarantees zero data loss on arbitrary binary files."*

---

### Slide 07: Hill Cipher Invertibility Condition
- **Left Box:**
  $$\gcd(\det(K), 256) = 1$$
  *Since $256 = 2^8$, its only prime factor is 2. Therefore:*  
  **$\det(K)$ MUST BE ODD**
- **Right Box:**
  - Matrix $K = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$, $\det(K) = (ad - bc) \pmod{256}$
  - Enforce $a, d = \text{ODD}$, $b, c = \text{EVEN}$
  - $\det(K) \equiv (1 \times 1) - (0 \times 0) \equiv 1 \pmod 2$ (Always Odd!)

#### 🎙️ Speaking Script (35 seconds):
> *"A crucial viva point: How do we guarantee the matrix is invertible modulo 256?*  
> *A matrix is invertible in $\mathbb{Z}_{256}$ if and only if $\gcd(\det(K), 256) = 1$. Because $256$ is $2^8$, its only prime divisor is 2. Therefore, $\det(K)$ must be an ODD integer.*  
> *We enforce that diagonal entries $a$ and $d$ are odd, and off-diagonal entries $b$ and $c$ are even. Since $(\text{odd} \times \text{odd}) - (\text{even} \times \text{even}) = \text{odd}$, the determinant is mathematically guaranteed to be odd, making $K$ unconditionally invertible."*

---

### Slide 08: DES in CBC Mode
- **Top Specs:** 64-Bit Blocks + 56-Bit Effective Key + 16 Feistel Rounds
- **CBC Chaining Formula:**
  $$C_0 = \text{IV}, \quad C_i = \text{DES\_Encrypt}(P_i \oplus C_{i-1})$$
- **PKCS#7 Padding:** Ensures strict 64-bit alignment.

#### 🎙️ Speaking Script (25 seconds):
> *"In Stage 2, the intermediate ciphertext is encrypted using DES in CBC mode.*  
> *DES utilizes 16 rounds of Feistel substitution and permutation. In CBC mode, each block is XORed with the preceding ciphertext block, initialized with a random 8-byte IV, eliminating structural block patterns."*

---

### Slide 09: Why CBC Mode Over ECB Mode?
- **Left (ECB - Insecure):**
  - $\text{Block } i \rightarrow \text{DES} \rightarrow \text{Ciphertext } i$
  - Identical plaintext blocks produce identical ciphertexts.
  - Leaks structural patterns (ECB Penguin vulnerability).
- **Right (CBC - Implemented):**
  - $\text{Block } i \oplus C_{i-1} \rightarrow \text{DES} \rightarrow C_i$
  - Prevents identical plaintext blocks from generating identical ciphertexts.
  - Completely eliminates structural and frequency patterns.

#### 🎙️ Speaking Script (25 seconds):
> *"This visual illustrates why we implemented CBC rather than ECB mode.*  
> *In ECB mode, identical blocks produce identical ciphertexts, exposing structural patterns. In CBC mode, the ciphertext of block 1 is XORed into block 2, completely scattering data across the entire file."*

---

### Slide 10: Defense in Depth: Key Derivation & Integrity
- **Left (PBKDF2):** 100,000 rounds of HMAC-SHA256, 16-byte random salt, zero plaintext passwords stored.
- **Right (HMAC-SHA256):** 32-byte authentication tag, constant-time `hmac.compare_digest` check, prevents bit-flipping and padding oracle exploits.

#### 🎙️ Speaking Script (25 seconds):
> *"Encryption alone only guarantees confidentiality, not authenticity. To provide defense in depth, we implement the Encrypt-then-MAC paradigm.*  
> *An HMAC-SHA256 tag is verified in constant time before any decryption logic is touched, neutralizing bit-flipping and padding oracle attacks."*

---

### Slide 11: .svault Binary Container Specification
- **Visual Container Stack:**
  - `[00..05] SVAULT MAGIC HEADER` (6 Bytes)
  - `[06..07] VERSION & FLAGS` (2 Bytes)
  - `[08..23] PBKDF2 SALT` (16 Bytes)
  - `[24..31] DES IV` (8 Bytes)
  - `[32..36] HILL MATRIX` (5 Bytes)
  - `[37..46] METADATA` (Original size + filename)
  - `[+00..+n] DES CIPHERTEXT` (Padded bytes)
  - `[-32..00] HMAC-SHA256 TAG` (32 Bytes)

#### 🎙️ Speaking Script (25 seconds):
> *"All encrypted outputs are packaged into a portable `.svault` container format.*  
> *The header stores the magic bytes, version, salt, IV, matrix coefficients, original file metadata, ciphertext, and the sealing HMAC-SHA256 tag."*

---

### Slide 12: Important Security Advisory
- **Core Statement (28 pt):**
  `DES IS OBSOLETE FOR MODERN PRODUCTION SECURITY`
- **3 Key Points:**
  - 56-bit effective key ($2^{56} \approx 7.2 \times 10^{16}$ keys)
  - Vulnerable to brute-force attacks via modern GPU clusters
  - Used here strictly for educational demonstration
- **Production Standard:** AES-256-GCM or ChaCha20-Poly1305.

#### 🎙️ Speaking Script (25 seconds):
> *"We emphasize academic integrity: DES is cryptographically obsolete for modern enterprise production due to its 56-bit key size, which can be brute-forced in hours.*  
> *In SecureVault, DES is implemented strictly to study Feistel block cipher mechanics. Production systems should deploy AES-256-GCM."*

---

### Slide 13: Automated Testing & Verification
- **Left Metrics:** **18 TEST CASES • 100% ALL PASSED**
- **Right Verified Matrix:**
  - ✓ Plaintext Text File (`.txt`)
  - ✓ Document Binary File (`.pdf`)
  - ✓ Image Bitmap File (`.png`, `.jpg`)
  - ✓ Compressed Archive (`.zip`)
  - ✓ Empty File Edge Case (0 Bytes)
  - ✓ Large Binary Payload (1 MB)
  - ✓ Wrong Password Rejection (400 Error)
  - ✓ Tampered Ciphertext Detection
  - ✓ Corrupted Container Protection

#### 🎙️ Speaking Script (25 seconds):
> *"Our project includes an automated test suite of 18 unit and integration tests, all passing with 100% success.*  
> *We validated text files, PDFs, image files, ZIP archives, empty files, and 1 MB binary payloads, as well as tamper detection and wrong password rejection."*

---

### Slide 14: Cryptographic Hash Verification
- **Visual Centerpiece:**
  `Original File SHA-256 == Decrypted File SHA-256`
- **Bottom Result (34 pt):**
  `✓ BYTE-FOR-BYTE MATCH`

#### 🎙️ Speaking Script (20 seconds):
> *"To prove mathematical reversibility, we compute the SHA-256 hash of the original file and compare it against the decrypted file.*  
> *In every case, the SHA-256 digests match identically, proving 100% byte-for-byte fidelity."*

---

### Slide 15: Live Demonstration Flow
- **7-Step Process:**
  `1 Upload File → 2 Set Key → 3 Hill mod 256 → 4 DES-CBC → 5 Get .svault → 6 Decrypt → 7 SHA-256 ✓`
- **Live Terminal Demo Script:** `python backend/demo_test.py`

#### 🎙️ Speaking Script (20 seconds):
> *"This slide outlines our live workflow: uploading a file, setting credentials, running the two-stage encryption, downloading the `.svault` container, decrypting it, and validating the SHA-256 checksum.*  
> *We also have a standalone terminal script `demo_test.py` for live terminal demonstrations."*

---

### Slide 16: Viva Examiner Defense
- **Top 5 Examiner Questions:**
  - `WHY RING Z_256?` $\rightarrow$ Binary byte compatibility across all file formats ($0$ to $255$).
  - `WHY ODD DETERMINANT?` $\rightarrow$ $\gcd(\det(K), 256) = 1$ is required for modular invertibility.
  - `WHY CBC OVER ECB?` $\rightarrow$ Prevents repeated ciphertext blocks; eliminates pattern recognition.
  - `WHY HMAC-SHA256?` $\rightarrow$ Provides integrity and authentication; stops bit-flipping attacks.
  - `WHY NOT DES IN PRODUCTION?` $\rightarrow$ 56-bit effective key length is vulnerable to exhaustive brute force.

#### 🎙️ Speaking Script (30 seconds):
> *"Here is a summary of the core theoretical questions addressed by our system: why we chose ring $\mathbb{Z}_{256}$, why an odd determinant is strictly required, why CBC mode prevents visual leaks, why HMAC is required alongside encryption, and why DES is restricted to educational contexts."*

---

### Slide 17: SecureVault — Key Takeaways
- `01` **Binary-Compatible Hill Cipher:** Extended linear algebra to Ring $\mathbb{Z}_{256}$ with guaranteed odd determinant.
- `02` **DES-CBC Layered Defense:** Paired linear diffusion with non-linear Feistel block permutation.
- `03` **PBKDF2 + HMAC Integrity:** 100k-round key derivation and constant-time Encrypt-then-MAC authentication.
- `04` **Verified 100% Byte Fidelity:** Byte-for-byte SHA-256 equality proven across all major file types.

#### 🎙️ Speaking Script (20 seconds):
> *"To conclude, SecureVault bridges classical linear algebra and modern block cipher principles into an end-to-end, working application with full mathematical reversibility and authenticated integrity."*

---

### Slide 18: Final Slide
- **Heading (48 pt):** THANK YOU
- **Subtitle (24 pt):** Questions & Answers
- **Product Footer:** SecureVault • Secure File Sharing using Hill Cipher + DES • Department of Computer Science & Engineering

#### 🎙️ Speaking Script (10 seconds):
> *"Thank you for your time and attention. I am now ready to take any questions from the panel."*
