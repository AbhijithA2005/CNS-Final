"""
DES (Data Encryption Standard) Cipher Implementation in CBC Mode

The Data Encryption Standard (DES) is a symmetric-key block cipher published by NIST in 1977.
It operates on 64-bit (8-byte) blocks using a 64-bit key (of which 56 bits are effective,
and 8 bits are parity bits).

Modes of Operation:
- Electronic Codebook (ECB): Insecure because identical plaintext blocks produce
  identical ciphertext blocks, revealing patterns (e.g. the famous ECB penguin).
- Cipher Block Chaining (CBC): Secure block chaining where each plaintext block is
  XORed with the previous ciphertext block before encryption. The first block is
  XORed with a pseudo-random Initialization Vector (IV).

Padding:
PKCS#7 padding is applied so the data length is an exact multiple of the 8-byte block size.

Educational & Viva Security Notice:
DES is considered cryptographically OBSOLETE for modern high-security production
due to its small 56-bit keyspace (2^56 ≈ 7.2 x 10^16 keys), which can be brute-forced
in hours using modern GPUs or specialized FPGA hardware. It is used here for academic
and educational demonstration alongside Hill Cipher.
"""

from typing import Dict, Any
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad

BLOCK_SIZE = DES.block_size  # 8 bytes (64 bits)
KEY_SIZE = 8  # 8 bytes (64 bits, 56 effective bits)


def des_encrypt(data: bytes, key: bytes, iv: bytes) -> bytes:
    """Encrypt data using DES in CBC mode with PKCS#7 padding.

    Args:
        data: Plaintext bytes.
        key: Exactly 8 bytes DES key.
        iv: Exactly 8 bytes random initialization vector.

    Returns:
        Ciphertext bytes.
    """
    if len(key) != KEY_SIZE:
        raise ValueError(f"DES key must be exactly {KEY_SIZE} bytes (got {len(key)})")
    if len(iv) != BLOCK_SIZE:
        raise ValueError(f"DES IV must be exactly {BLOCK_SIZE} bytes (got {len(iv)})")

    cipher = DES.new(key, DES.MODE_CBC, iv=iv)
    padded_data = pad(data, BLOCK_SIZE, style="pkcs7")
    ciphertext = cipher.encrypt(padded_data)
    return ciphertext


def des_decrypt(ciphertext: bytes, key: bytes, iv: bytes) -> bytes:
    """Decrypt data using DES in CBC mode and remove PKCS#7 padding.

    Args:
        ciphertext: Ciphertext bytes (must be a multiple of 8 bytes).
        key: Exactly 8 bytes DES key.
        iv: Exactly 8 bytes initialization vector.

    Returns:
        Original plaintext bytes before DES encryption.
    """
    if len(key) != KEY_SIZE:
        raise ValueError(f"DES key must be exactly {KEY_SIZE} bytes (got {len(key)})")
    if len(iv) != BLOCK_SIZE:
        raise ValueError(f"DES IV must be exactly {BLOCK_SIZE} bytes (got {len(iv)})")
    if len(ciphertext) % BLOCK_SIZE != 0:
        raise ValueError(f"Ciphertext length must be a multiple of {BLOCK_SIZE} bytes")

    cipher = DES.new(key, DES.MODE_CBC, iv=iv)
    decrypted_padded = cipher.decrypt(ciphertext)
    try:
        plaintext = unpad(decrypted_padded, BLOCK_SIZE, style="pkcs7")
    except ValueError as e:
        raise ValueError("DES PKCS#7 unpadding failed: invalid key or corrupted data") from e
    return plaintext


def get_des_metadata() -> Dict[str, Any]:
    """Return DES metadata for educational display and viva explanations."""
    return {
        "algorithm": "DES (Data Encryption Standard)",
        "mode": "CBC (Cipher Block Chaining)",
        "block_size_bytes": BLOCK_SIZE,
        "block_size_bits": BLOCK_SIZE * 8,
        "key_size_bytes": KEY_SIZE,
        "effective_key_bits": 56,
        "parity_bits": 8,
        "padding_standard": "PKCS#7",
        "security_advisory": (
            "DES is cryptographically obsolete for modern production security due to "
            "its 56-bit effective key size, susceptible to exhaustive key search (brute-force). "
            "Included here strictly for educational and pedagogical purposes in layered cryptography."
        ),
    }
