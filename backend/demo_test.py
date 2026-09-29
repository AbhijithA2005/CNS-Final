#!/usr/bin/env python3
"""
SecureVault Viva & Live Demo Script
Demonstrates end-to-end encryption and decryption of demo.txt with SHA-256 hash comparison.
"""

import os
import sys
import hashlib

# Ensure backend package is in python path
sys.path.insert(0, os.path.dirname(__file__))

from app.crypto.pipeline import encrypt_pipeline, decrypt_pipeline


def sha256_of_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def main():
    print("=" * 60)
    print(" SecureVault Live Cryptographic Demo")
    print(" Layered Hill Cipher (Z_256) + DES (CBC) + HMAC-SHA256")
    print("=" * 60)

    demo_file_path = os.path.join(os.path.dirname(__file__), "..", "demo.txt")
    if not os.path.exists(demo_file_path):
        with open(demo_file_path, "w", encoding="utf-8") as f:
            f.write("SecureVault demonstration file.\n")

    with open(demo_file_path, "rb") as f:
        original_bytes = f.read()

    original_sha256 = sha256_of_bytes(original_bytes)
    password = "AcademicDemoPass2026!"

    print(f"\n[1] Target File       : demo.txt")
    print(f"    Original Size     : {len(original_bytes)} bytes")
    print(f"    Original SHA256   : {original_sha256}")
    print(f"    Encryption Key    : {password}")

    # Encrypt
    print("\n[2] Executing Encryption Pipeline...")
    print("    -> PBKDF2 (100k rounds) key derivation...")
    print("    -> Stage 1: Invertible 2x2 Hill Cipher modulo 256...")
    print("    -> Stage 2: DES in CBC Mode with PKCS#7 padding...")
    print("    -> Stage 3: Packaging .svault container & calculating HMAC-SHA256...")

    container_bytes, enc_meta = encrypt_pipeline(original_bytes, "demo.txt", password)
    container_sha256 = sha256_of_bytes(container_bytes)
    print(f"    Encrypted Container Size : {len(container_bytes)} bytes")
    print(f"    Container SHA256         : {container_sha256}")
    print(f"    Hill Matrix (K)          : {enc_meta['hill_metadata']['matrix']}")
    print(f"    Hill Determinant         : {enc_meta['hill_metadata']['determinant']} (gcd=1, coprime to 256)")
    print(f"    Hill Inverse Matrix (K^-1): {enc_meta['hill_metadata']['inverse_matrix']}")

    # Decrypt
    print("\n[3] Executing Decryption Pipeline...")
    print("    -> Authenticating container header & payload with HMAC-SHA256...")
    print("    -> Stage 1: DES-CBC decryption & unpadding...")
    print("    -> Stage 2: Inverted Hill Cipher matrix multiplication mod 256...")

    decrypted_bytes, recovered_filename, dec_meta = decrypt_pipeline(container_bytes, password)
    decrypted_sha256 = sha256_of_bytes(decrypted_bytes)

    print(f"    Recovered Filename: {recovered_filename}")
    print(f"    Recovered Size    : {len(decrypted_bytes)} bytes")
    print(f"    Decrypted SHA256  : {decrypted_sha256}")

    # Compare
    print("\n" + "=" * 60)
    print(" VERIFICATION RESULTS")
    print("=" * 60)
    print(f"Original SHA256 : {original_sha256}")
    print(f"Decrypted SHA256: {decrypted_sha256}")

    if original_sha256 == decrypted_sha256 and original_bytes == decrypted_bytes:
        print("\n RESULT: [ PASS ] (Byte-for-byte exact equality guaranteed!)")
        print("=" * 60)
        return 0
    else:
        print("\n RESULT: [ FAIL ] (Hashes do not match!)")
        print("=" * 60)
        return 1


if __name__ == "__main__":
    sys.exit(main())
