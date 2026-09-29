"""
Automated Cryptographic Test Suite for SecureVault

Tests:
1. Hill Cipher encryption/decryption
2. DES encryption/decryption
3. Full pipeline
4. Text file (.txt)
5. Simulated PDF file (.pdf)
6. Binary Image (.png / .jpg)
7. ZIP archive (.zip)
8. Empty file (0 bytes)
9. Large file (1 MB pseudo-random payload)
10. Wrong password rejection
11. Corrupted container header rejection
12. Modified ciphertext tampering detection (HMAC rejection)
13. Invalid .svault file detection

For every supported file type:
    original file bytes == decrypted file bytes (byte-for-byte)
    SHA-256(original) == SHA-256(decrypted)
"""

import os
import io
import zipfile
import hashlib
import pytest
import numpy as np

from app.crypto.hill_cipher import (
    derive_hill_matrix_2x2,
    hill_encrypt,
    hill_decrypt,
    matrix_modinv,
    is_invertible_mod256,
)
from app.crypto.des_cipher import des_encrypt, des_decrypt
from app.crypto.pipeline import encrypt_pipeline, decrypt_pipeline, DecryptionError
from app.crypto.key_utils import derive_keys


def sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


class TestHillCipher:
    def test_01_hill_cipher_roundtrip(self):
        """Test 1: Hill Cipher encryption/decryption modulo 256."""
        seed = b"\x33\x44\x55\x66"
        K, K_inv, det = derive_hill_matrix_2x2(seed)
        assert is_invertible_mod256(K)
        assert (det % 2) == 1

        plaintext = b"Hill Cipher Binary Transformation Test \x00\xff\x7f\x80"
        encrypted = hill_encrypt(plaintext, K)
        assert encrypted != plaintext

        decrypted = hill_decrypt(encrypted, K_inv, len(plaintext))
        assert decrypted == plaintext
        assert sha256_hex(decrypted) == sha256_hex(plaintext)


class TestDESCipher:
    def test_02_des_cipher_roundtrip(self):
        """Test 2: DES encryption/decryption in CBC mode with PKCS#7 padding."""
        key = b"12345678"  # 8 bytes
        iv = b"abcdefgh"   # 8 bytes
        plaintext = b"Testing DES-CBC block cipher with exact PKCS#7 unpadding!"

        ciphertext = des_encrypt(plaintext, key, iv)
        assert ciphertext != plaintext
        assert len(ciphertext) % 8 == 0

        recovered = des_decrypt(ciphertext, key, iv)
        assert recovered == plaintext
        assert sha256_hex(recovered) == sha256_hex(plaintext)


class TestFullPipeline:
    def test_03_full_pipeline_roundtrip(self):
        """Test 3: Full two-stage pipeline (Hill + DES-CBC + HMAC)."""
        data = b"Testing combined layered security architecture."
        password = "MasterPassword2026!#"

        container, meta = encrypt_pipeline(data, "test.dat", password)
        recovered, fname, dec_meta = decrypt_pipeline(container, password)

        assert recovered == data
        assert fname == "test.dat"
        assert sha256_hex(recovered) == sha256_hex(data)

    def test_04_text_file(self):
        """Test 4: Text file roundtrip."""
        data = (
            "SecureVault Text File Demonstration\n"
            "Layer 1: Hill Cipher Matrix Substitution\n"
            "Layer 2: Data Encryption Standard (CBC Mode)\n"
            "Integrity: HMAC-SHA256 Encrypt-then-MAC\n"
        ).encode("utf-8")

        container, _ = encrypt_pipeline(data, "document.txt", "P@ssword123")
        recovered, fname, _ = decrypt_pipeline(container, "P@ssword123")

        assert recovered == data
        assert fname == "document.txt"
        assert sha256_hex(recovered) == sha256_hex(data)

    def test_05_pdf_file(self):
        """Test 5: Simulated PDF binary file with PDF header and binary EOF marker."""
        pdf_bytes = (
            b"%PDF-1.4\n"
            b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
            b"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
            b"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >> endobj\n"
            b"xref\n0 4\n0000000000 65535 f \n"
            b"trailer << /Size 4 /Root 1 0 R >>\n"
            b"startxref\n180\n%%EOF\n"
        )
        container, _ = encrypt_pipeline(pdf_bytes, "academic_paper.pdf", "Research@2026")
        recovered, fname, _ = decrypt_pipeline(container, "Research@2026")

        assert recovered == pdf_bytes
        assert fname == "academic_paper.pdf"
        assert sha256_hex(recovered) == sha256_hex(pdf_bytes)

    def test_06_image_file(self):
        """Test 6: Simulated PNG image header and arbitrary binary bytes."""
        png_header = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
        arbitrary_pixels = os.urandom(4096)
        png_bytes = png_header + arbitrary_pixels + b"\x00\x00\x00\x00IEND\xaeB`\x82"

        container, _ = encrypt_pipeline(png_bytes, "screenshot.png", "ImageKey#99")
        recovered, fname, _ = decrypt_pipeline(container, "ImageKey#99")

        assert recovered == png_bytes
        assert fname == "screenshot.png"
        assert sha256_hex(recovered) == sha256_hex(png_bytes)

    def test_07_zip_file(self):
        """Test 7: Real ZIP archive containing multiple subfiles."""
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("hello.txt", "Hello inside ZIP!")
            zf.writestr("data.bin", os.urandom(1024))
            zf.writestr("subfolder/nested.txt", "Nested directory file")
        zip_bytes = zip_buffer.getvalue()

        container, _ = encrypt_pipeline(zip_bytes, "archive.zip", "ZipSecuRe!2026")
        recovered, fname, _ = decrypt_pipeline(container, "ZipSecuRe!2026")

        assert recovered == zip_bytes
        assert fname == "archive.zip"
        assert sha256_hex(recovered) == sha256_hex(zip_bytes)

        # Ensure recovered zip can be read back cleanly
        rec_buf = io.BytesIO(recovered)
        with zipfile.ZipFile(rec_buf, "r") as zf:
            assert zf.read("hello.txt") == b"Hello inside ZIP!"
            assert zf.read("subfolder/nested.txt") == b"Nested directory file"

    def test_08_empty_file(self):
        """Test 8: Empty file (0 bytes)."""
        empty_data = b""
        container, _ = encrypt_pipeline(empty_data, "empty.txt", "EmptyPass1!")
        recovered, fname, _ = decrypt_pipeline(container, "EmptyPass1!")

        assert recovered == empty_data
        assert fname == "empty.txt"
        assert sha256_hex(recovered) == sha256_hex(empty_data)

    def test_09_large_file(self):
        """Test 9: 1 MB pseudo-random binary payload."""
        large_data = os.urandom(1024 * 1024)  # 1 Megabyte
        orig_hash = sha256_hex(large_data)

        container, _ = encrypt_pipeline(large_data, "dataset.bin", "LargeDatasetKey#2026")
        recovered, fname, _ = decrypt_pipeline(container, "LargeDatasetKey#2026")

        assert recovered == large_data
        assert fname == "dataset.bin"
        assert sha256_hex(recovered) == orig_hash

    def test_10_wrong_password(self):
        """Test 10: Wrong password rejection."""
        data = b"Sensitive information that requires correct credentials."
        container, _ = encrypt_pipeline(data, "secrets.txt", "CorrectPassword123")

        with pytest.raises(DecryptionError) as exc_info:
            decrypt_pipeline(container, "WrongPassword456")
        assert "Decryption failed: invalid key or corrupted file." in str(exc_info.value)

    def test_11_corrupted_encrypted_file(self):
        """Test 11: Corrupted container file (truncated bytes)."""
        data = b"Corrupted file test data."
        container, _ = encrypt_pipeline(data, "sample.txt", "SafeKey123")

        # Truncate container to corrupt structure
        corrupted = container[: len(container) - 40]
        with pytest.raises(DecryptionError):
            decrypt_pipeline(corrupted, "SafeKey123")

    def test_12_modified_ciphertext(self):
        """Test 12: Ciphertext tampering / bit-flip (HMAC integrity rejection)."""
        data = b"Tamper detection verification via Encrypt-then-MAC."
        container, _ = encrypt_pipeline(data, "test.txt", "IntegrityKey123")

        # Flip a bit in the ciphertext region
        tampered = bytearray(container)
        tampered[60] ^= 0x01  # Flip one bit

        with pytest.raises(DecryptionError) as exc_info:
            decrypt_pipeline(bytes(tampered), "IntegrityKey123")
        assert "Decryption failed: invalid key or corrupted file." in str(exc_info.value)

    def test_13_invalid_svault_file(self):
        """Test 13: Completely arbitrary or non-svault file passed to decrypt."""
        bogus_data = b"THIS IS NOT A SVAULT FILE AT ALL" + os.urandom(100)
        with pytest.raises(DecryptionError):
            decrypt_pipeline(bogus_data, "AnyPassword")
