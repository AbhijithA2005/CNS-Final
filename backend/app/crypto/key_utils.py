"""
Key Management and Cryptographic Key Derivation (PBKDF2)

Security Standards:
- NIST SP 800-132 recommendation for Password-Based Key Derivation (PBKDF2).
- Pseudo-Random Function: HMAC-SHA256.
- Iteration Count: 100,000 rounds to resist GPU-accelerated dictionary/brute-force attacks.
- Salt: 16 cryptographically secure random bytes (os.urandom / Crypto.Random).

Derived Key Blueprint (total 64 bytes):
- Bytes 00..07 (8 bytes) : DES 64-bit key (56 effective bits)
- Bytes 08..39 (32 bytes): HMAC-SHA256 integrity authentication key
- Bytes 40..43 (4 bytes) : Hill Cipher 2x2 matrix seed coefficients
- Bytes 44..63 (20 bytes): Future expansion / entropy buffer
"""

import os
import re
from typing import Tuple, Dict, Any
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256
import numpy as np

from app.crypto.hill_cipher import derive_hill_matrix_2x2, is_invertible_mod256, matrix_modinv

PBKDF2_ITERATIONS = 100_000
SALT_SIZE = 16
TOTAL_DERIVED_KEY_LEN = 64


def generate_salt(size: int = SALT_SIZE) -> bytes:
    """Generate cryptographically secure random salt."""
    return os.urandom(size)


def derive_keys(password: str, salt: bytes) -> Tuple[bytes, bytes, np.ndarray, np.ndarray, int]:
    """Derive DES key, HMAC key, and Hill Cipher invertible matrix from password and salt.

    Returns:
        (des_key, hmac_key, hill_matrix, hill_inv_matrix, hill_det)
    """
    if not password:
        raise ValueError("Password cannot be empty")
    if len(salt) < 16:
        raise ValueError("Salt must be at least 16 bytes")

    derived_stream = PBKDF2(
        password=password,
        salt=salt,
        dkLen=TOTAL_DERIVED_KEY_LEN,
        count=PBKDF2_ITERATIONS,
        hmac_hash_module=SHA256,
    )

    des_key = derived_stream[0:8]
    hmac_key = derived_stream[8:40]
    hill_seed_bytes = derived_stream[40:44]

    hill_matrix, hill_inv_matrix, hill_det = derive_hill_matrix_2x2(hill_seed_bytes)

    return des_key, hmac_key, hill_matrix, hill_inv_matrix, hill_det


def derive_custom_keys(
    password: str,
    salt: bytes,
    custom_matrix: list = None
) -> Tuple[bytes, bytes, np.ndarray, np.ndarray, int]:
    """Derive keys, optionally accepting a custom invertible 2x2 Hill matrix."""
    des_key, hmac_key, default_hill_mat, default_hill_inv, default_det = derive_keys(password, salt)

    if custom_matrix is not None:
        mat_arr = np.array(custom_matrix, dtype=int)
        if mat_arr.shape != (2, 2):
            raise ValueError("Custom Hill matrix must be a 2x2 matrix")
        if not is_invertible_mod256(mat_arr):
            raise ValueError("Provided 2x2 matrix determinant is even, so it has no modular inverse modulo 256")
        hill_matrix = mat_arr % 256
        hill_inv_matrix = matrix_modinv(hill_matrix, 256)
        hill_det = int((hill_matrix[0, 0] * hill_matrix[1, 1] - hill_matrix[0, 1] * hill_matrix[1, 0])) % 256
        return des_key, hmac_key, hill_matrix, hill_inv_matrix, hill_det

    return des_key, hmac_key, default_hill_mat, default_hill_inv, default_det


def evaluate_password_strength(password: str) -> Dict[str, Any]:
    """Evaluate password strength and entropy for security feedback."""
    score = 0
    feedback = []

    if len(password) >= 8:
        score += 1
    else:
        feedback.append("At least 8 characters")

    if len(password) >= 12:
        score += 1

    if re.search(r"[a-z]", password) and re.search(r"[A-Z]", password):
        score += 1
    else:
        feedback.append("Mixed upper and lowercase letters")

    if re.search(r"\d", password):
        score += 1
    else:
        feedback.append("At least one number")

    if re.search(r"[!@#$%^&*(),.?\":{}|<>\-_=+]", password):
        score += 1
    else:
        feedback.append("At least one special symbol")

    level = "Weak"
    if score >= 4:
        level = "Very Strong"
    elif score == 3:
        level = "Strong"
    elif score == 2:
        level = "Moderate"

    return {
        "score": min(score, 4),
        "level": level,
        "suggestions": feedback,
    }
