"""
Hill Cipher Implementation for Binary Data (Modulo 256)

In classical cryptography, the Hill Cipher is a polygraphic substitution cipher
based on linear algebra. Each character is mapped to an integer modulo 26.

For arbitrary file encryption (images, PDFs, documents, executables), each byte
is treated as an element in the ring of integers modulo 256 (Z_256).

Mathematical Invertibility Condition:
An n x n matrix K with integer entries in [0, 255] has a modular inverse K^-1 mod 256
if and only if:
    gcd(det(K) mod 256, 256) == 1

Since the prime factor of 256 is 2, this condition simplifies to:
    det(K) mod 256 must be ODD (i.e. det(K) mod 2 == 1).

Decryption matrix:
    K^-1 = (det(K)^-1 * adj(K)) mod 256
where adj(K) is the adjugate matrix and det(K)^-1 is the modular multiplicative
inverse of det(K) mod 256.
"""

from typing import Tuple, Dict, Any, List
import numpy as np


def egcd(a: int, b: int) -> Tuple[int, int, int]:
    """Extended Euclidean Algorithm.
    Returns (g, x, y) such that a*x + b*y = g = gcd(a, b).
    """
    if a == 0:
        return (b, 0, 1)
    g, y, x = egcd(b % a, a)
    return (g, x - (b // a) * y, y)


def modinv(a: int, m: int = 256) -> int:
    """Compute the modular multiplicative inverse of a modulo m.
    Returns x such that (a * x) % m == 1.
    Raises ValueError if inverse does not exist.
    """
    a = a % m
    g, x, _ = egcd(a, m)
    if g != 1:
        raise ValueError(f"Scalar {a} has no modular inverse modulo {m} (gcd={g})")
    return x % m


def is_invertible_mod256(matrix: np.ndarray) -> bool:
    """Check if square matrix is invertible modulo 256."""
    try:
        det = matrix_det(matrix)
        return (det % 2) == 1
    except Exception:
        return False


def matrix_det(matrix: np.ndarray, m: int = 256) -> int:
    """Calculate the determinant of a 2x2 or 3x3 integer matrix modulo m."""
    n = matrix.shape[0]
    if n == 2:
        a, b = int(matrix[0, 0]), int(matrix[0, 1])
        c, d = int(matrix[1, 0]), int(matrix[1, 1])
        det = (a * d - b * c) % m
        return det
    elif n == 3:
        m00, m01, m02 = int(matrix[0, 0]), int(matrix[0, 1]), int(matrix[0, 2])
        m10, m11, m12 = int(matrix[1, 0]), int(matrix[1, 1]), int(matrix[1, 2])
        m20, m21, m22 = int(matrix[2, 0]), int(matrix[2, 1]), int(matrix[2, 2])
        det = (
            m00 * (m11 * m22 - m12 * m21)
            - m01 * (m10 * m22 - m12 * m20)
            + m02 * (m10 * m21 - m11 * m20)
        ) % m
        return det
    else:
        # General dimension using float det rounded
        det_float = np.linalg.det(matrix)
        return int(round(det_float)) % m


def matrix_adjugate(matrix: np.ndarray) -> np.ndarray:
    """Compute the adjugate of a 2x2 or 3x3 integer matrix."""
    n = matrix.shape[0]
    if n == 2:
        a, b = int(matrix[0, 0]), int(matrix[0, 1])
        c, d = int(matrix[1, 0]), int(matrix[1, 1])
        # adj([[a, b], [c, d]]) = [[d, -b], [-c, a]]
        return np.array([[d, -b], [-c, a]], dtype=int)
    elif n == 3:
        adj = np.zeros((3, 3), dtype=int)
        for i in range(3):
            for j in range(3):
                # Minor M_ji (transposed for adjugate)
                minor = np.delete(np.delete(matrix, i, axis=0), j, axis=1)
                cofactor = ((-1) ** (i + j)) * int(round(np.linalg.det(minor)))
                adj[j, i] = cofactor
        return adj
    else:
        raise NotImplementedError("Only 2x2 and 3x3 matrices are supported")


def matrix_modinv(matrix: np.ndarray, m: int = 256) -> np.ndarray:
    """Compute the inverse of an integer matrix modulo m.
    K^-1 = (det(K)^-1 * adj(K)) % m
    """
    det = matrix_det(matrix, m)
    if det % 2 == 0:
        raise ValueError(f"Matrix determinant {det} is even, not invertible modulo {m}")
    inv_det = modinv(det, m)
    adj = matrix_adjugate(matrix)
    inv_mat = (inv_det * adj) % m
    return inv_mat.astype(int)


def derive_hill_matrix_2x2(four_bytes: bytes) -> Tuple[np.ndarray, np.ndarray, int]:
    """Deterministically derive a 2x2 matrix from 4 bytes that is GUARANTEED invertible mod 256.

    Proof:
    Let a = four_bytes[0] | 1       (odd: a = 2k + 1)
    Let b = four_bytes[1] & 0xFE    (even: b = 2m)
    Let c = four_bytes[2] & 0xFE    (even: c = 2p)
    Let d = four_bytes[3] | 1       (odd: d = 2q + 1)

    det = (a*d - b*c) mod 256
    det mod 2 = ((odd * odd) - (even * even)) mod 2 = (1 - 0) mod 2 = 1.
    Since det is always odd, gcd(det, 256) == 1 ALWAYS holds!
    Hence, K is unconditionally invertible mod 256.
    """
    if len(four_bytes) < 4:
        raise ValueError("Need at least 4 bytes to derive 2x2 Hill matrix")

    a = (four_bytes[0] | 1) % 256
    b = (four_bytes[1] & 0xFE) % 256
    c = (four_bytes[2] & 0xFE) % 256
    d = (four_bytes[3] | 1) % 256

    K = np.array([[a, b], [c, d]], dtype=int)
    det = matrix_det(K, 256)
    K_inv = matrix_modinv(K, 256)
    return K, K_inv, det


def hill_encrypt(data: bytes, K: np.ndarray) -> bytes:
    """Encrypt binary data with Hill Cipher matrix K modulo 256.
    Applies zero-padding if data length is not a multiple of matrix dimension n.
    """
    if not data:
        return b""
    n = K.shape[0]
    pad_len = (n - (len(data) % n)) % n
    padded = data + b"\x00" * pad_len
    arr = np.frombuffer(padded, dtype=np.uint8).reshape(-1, n)
    # Vectorized matrix multiplication: C = P * K^T mod 256
    enc = (arr @ K.T) % 256
    return enc.astype(np.uint8).tobytes()


def hill_decrypt(enc_data: bytes, K_inv: np.ndarray, original_length: int) -> bytes:
    """Decrypt binary data with inverted Hill Cipher matrix K_inv modulo 256.
    Trims zero padding to match original_length.
    """
    if not enc_data or original_length == 0:
        return b""
    n = K_inv.shape[0]
    if len(enc_data) % n != 0:
        raise ValueError(f"Encrypted data length ({len(enc_data)}) must be a multiple of matrix dim {n}")
    arr = np.frombuffer(enc_data, dtype=np.uint8).reshape(-1, n)
    dec = (arr @ K_inv.T) % 256
    raw = dec.astype(np.uint8).tobytes()
    return raw[:original_length]


def get_hill_metadata(K: np.ndarray) -> Dict[str, Any]:
    """Return mathematical metadata for UI visualization & viva explanation."""
    n = K.shape[0]
    det = matrix_det(K, 256)
    is_inv = (det % 2 == 1)
    inv_det = modinv(det, 256) if is_inv else None
    K_inv = matrix_modinv(K, 256) if is_inv else None

    return {
        "dimension": n,
        "matrix": K.tolist(),
        "determinant": det,
        "is_coprime_256": is_inv,
        "det_modular_inverse": inv_det,
        "inverse_matrix": K_inv.tolist() if K_inv is not None else None,
        "modulus": 256,
        "formula": "C = (P · K^T) mod 256",
        "decrypt_formula": "P = (C · (K^-1)^T) mod 256",
    }
