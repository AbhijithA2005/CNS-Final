"""
SecureVault Two-Stage Cryptographic Pipeline (Hill Cipher + DES)

Security Architecture:
1. Encrypt-then-MAC (EtM) paradigm for provable authenticity.
2. Key Derivation: PBKDF2 (HMAC-SHA256, 100,000 rounds) generates independent:
   - DES 64-bit key (56 effective bits)
   - HMAC-SHA256 256-bit authentication key
   - Hill Cipher 2x2 invertible matrix modulo 256
3. Stage 1: Hill Cipher Byte Transformation
   - Linear matrix multiplication modulo 256
   - C1 = (P * K^T) mod 256
4. Stage 2: DES-CBC Block Cipher
   - 64-bit block size with PKCS#7 padding
   - 8-byte cryptographically secure random Initialization Vector (IV)
   - C2 = DES_CBC_Encrypt(C1)
5. Stage 3: Packaging & HMAC-SHA256 Integrity Tag
   - Binary container format (.svault)
   - HMAC tag computed across all header metadata and ciphertext
"""

import struct
import hmac
import os
import hashlib
from typing import Tuple, Dict, Any, Optional
import numpy as np

from Crypto.Hash import HMAC, SHA256
from app.crypto.hill_cipher import (
    hill_encrypt,
    hill_decrypt,
    matrix_modinv,
    get_hill_metadata,
)
from app.crypto.des_cipher import (
    des_encrypt,
    des_decrypt,
    get_des_metadata,
    BLOCK_SIZE as DES_BLOCK_SIZE,
)
from app.crypto.key_utils import generate_salt, derive_keys

MAGIC_HEADER = b"SVAULT"
CURRENT_VERSION = 1
MIN_CONTAINER_SIZE = 6 + 1 + 1 + 16 + 8 + 1 + 4 + 8 + 2 + 0 + 8 + 0 + 32  # 87 bytes


class DecryptionError(Exception):
    """Raised when decryption fails due to invalid password or corrupted container."""
    pass


def encrypt_pipeline(
    data: bytes,
    original_filename: str,
    password: str,
    custom_matrix: Optional[list] = None
) -> Tuple[bytes, Dict[str, Any]]:
    """Execute complete two-stage encryption: Hill Cipher followed by DES-CBC.

    Returns:
        (svault_container_bytes, execution_metadata)
    """
    original_size = len(data)
    salt = generate_salt(16)
    iv = os.urandom(DES_BLOCK_SIZE)

    # 1. Derive keys
    des_key, hmac_key, hill_mat, hill_inv, det = derive_keys(password, salt)

    if custom_matrix is not None:
        mat_arr = np.array(custom_matrix, dtype=int)
        hill_mat = mat_arr % 256
        hill_inv = matrix_modinv(hill_mat, 256)
        det = int((hill_mat[0, 0] * hill_mat[1, 1] - hill_mat[0, 1] * hill_mat[1, 0])) % 256

    # 2. Stage 1: Hill Cipher encryption
    hill_ciphertext = hill_encrypt(data, hill_mat)

    # 3. Stage 2: DES-CBC encryption
    des_ciphertext = des_encrypt(hill_ciphertext, des_key, iv)

    # 4. Pack binary container
    filename_encoded = original_filename.encode("utf-8")
    flen = len(filename_encoded)
    clen = len(des_ciphertext)

    # Header structure:
    # MAGIC(6s) + VERSION(B) + FLAGS(B) + SALT(16s) + IV(8s) + MAT_DIM(B) + MAT_COEFFS(4B) + ORIG_SIZE(Q) + FLEN(H)
    header_fixed = struct.pack(
        ">6sBB16s8sBBBBBQH",
        MAGIC_HEADER,
        CURRENT_VERSION,
        0,  # flags
        salt,
        iv,
        2,  # 2x2 dimension
        int(hill_mat[0, 0]),
        int(hill_mat[0, 1]),
        int(hill_mat[1, 0]),
        int(hill_mat[1, 1]),
        original_size,
        flen,
    )

    payload_before_hmac = header_fixed + filename_encoded + struct.pack(">Q", clen) + des_ciphertext

    # 5. Integrity: Compute HMAC-SHA256
    h = HMAC.new(hmac_key, digestmod=SHA256)
    h.update(payload_before_hmac)
    mac = h.digest()

    full_container = payload_before_hmac + mac

    # Calculate hashes for audit trail & verification
    orig_sha256 = hashlib.sha256(data).hexdigest()
    enc_sha256 = hashlib.sha256(full_container).hexdigest()

    meta = {
        "original_filename": original_filename,
        "original_size": original_size,
        "encrypted_size": len(full_container),
        "original_sha256": orig_sha256,
        "encrypted_sha256": enc_sha256,
        "hill_metadata": get_hill_metadata(hill_mat),
        "des_metadata": get_des_metadata(),
        "pipeline_stages": [
            {"stage": 1, "name": "Key Derivation", "algorithm": "PBKDF2 (100,000 rounds HMAC-SHA256)"},
            {"stage": 2, "name": "First-Layer Encryption", "algorithm": "Hill Cipher (2x2 modulo 256)"},
            {"stage": 3, "name": "Second-Layer Encryption", "algorithm": "DES-CBC (PKCS#7 padding)"},
            {"stage": 4, "name": "Integrity Protection", "algorithm": "HMAC-SHA256 (Encrypt-then-MAC)"},
        ],
    }

    return full_container, meta


def decrypt_pipeline(
    container_bytes: bytes,
    password: str
) -> Tuple[bytes, str, Dict[str, Any]]:
    """Execute complete two-stage decryption: DES-CBC decryption followed by Hill Cipher.

    Returns:
        (original_file_bytes, original_filename, execution_metadata)
    """
    if len(container_bytes) < MIN_CONTAINER_SIZE:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.")

    # 1. Parse header
    fixed_header_len = struct.calcsize(">6sBB16s8sBBBBBQH")
    if len(container_bytes) < fixed_header_len + 32:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.")

    (
        magic,
        version,
        flags,
        salt,
        iv,
        dim,
        k00,
        k01,
        k10,
        k11,
        original_size,
        flen,
    ) = struct.unpack(">6sBB16s8sBBBBBQH", container_bytes[:fixed_header_len])

    if magic != MAGIC_HEADER:
        raise DecryptionError("Invalid file: not a recognized SecureVault (.svault) encrypted container.")

    if version != CURRENT_VERSION:
        raise DecryptionError(f"Unsupported SecureVault version: {version}")

    cursor = fixed_header_len
    if len(container_bytes) < cursor + flen + 8 + 32:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.")

    filename_bytes = container_bytes[cursor : cursor + flen]
    try:
        original_filename = filename_bytes.decode("utf-8")
    except UnicodeDecodeError:
        original_filename = "recovered_file.bin"
    cursor += flen

    (clen,) = struct.unpack(">Q", container_bytes[cursor : cursor + 8])
    cursor += 8

    if len(container_bytes) != cursor + clen + 32:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.")

    des_ciphertext = container_bytes[cursor : cursor + clen]
    stored_mac = container_bytes[cursor + clen :]

    # 2. Derive keys from password + salt
    try:
        des_key, hmac_key, derived_hill_mat, derived_hill_inv, _ = derive_keys(password, salt)
    except Exception as e:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.") from e

    # 3. Authenticate payload with HMAC-SHA256 (Constant Time)
    payload_to_verify = container_bytes[: cursor + clen]
    h = HMAC.new(hmac_key, digestmod=SHA256)
    h.update(payload_to_verify)
    computed_mac = h.digest()

    if not hmac.compare_digest(stored_mac, computed_mac):
        # Integrity verification failed: either password is wrong or ciphertext was modified
        raise DecryptionError("Decryption failed: invalid key or corrupted file.")

    # 4. Stage 1: DES-CBC decryption
    try:
        hill_ciphertext = des_decrypt(des_ciphertext, des_key, iv)
    except Exception as e:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.") from e

    # 5. Stage 2: Hill Cipher decryption
    # Reconstruct matrix
    container_hill_mat = np.array([[k00, k01], [k10, k11]], dtype=int)
    try:
        hill_inv = matrix_modinv(container_hill_mat, 256)
    except Exception as e:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.") from e

    try:
        recovered_data = hill_decrypt(hill_ciphertext, hill_inv, original_size)
    except Exception as e:
        raise DecryptionError("Decryption failed: invalid key or corrupted file.") from e

    if len(recovered_data) != original_size:
        raise DecryptionError("Decryption failed: size mismatch in recovered payload.")

    orig_sha256 = hashlib.sha256(recovered_data).hexdigest()

    meta = {
        "original_filename": original_filename,
        "recovered_size": len(recovered_data),
        "sha256": orig_sha256,
        "hill_metadata": get_hill_metadata(container_hill_mat),
        "des_metadata": get_des_metadata(),
        "integrity_verified": True,
    }

    return recovered_data, original_filename, meta
