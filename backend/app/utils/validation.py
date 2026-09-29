"""
Input and File Validation Utilities for SecureVault.
Provides security checks for file size, container format, and passwords.
"""

from typing import Tuple, Optional
from app.crypto.pipeline import MAGIC_HEADER

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB limit for academic demo
SVAULT_EXTENSION = ".svault"


def validate_upload_file(filename: Optional[str], size: int) -> Tuple[bool, Optional[str]]:
    """Validate incoming upload."""
    if not filename:
        return False, "Please select a file to proceed."

    if size > MAX_FILE_SIZE_BYTES:
        return False, f"File size exceeds the {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB limit."

    return True, None


def validate_encrypted_file(filename: Optional[str], data: bytes) -> Tuple[bool, Optional[str]]:
    """Validate encrypted file candidate for decryption."""
    valid, err = validate_upload_file(filename, len(data))
    if not valid:
        return False, err

    if len(data) < len(MAGIC_HEADER):
        return False, "Invalid SecureVault file: file is too small or corrupted."

    if not data.startswith(MAGIC_HEADER):
        return (
            False,
            "Invalid file format: this file does not contain a valid SecureVault (.svault) magic header.",
        )

    return True, None


def validate_password(password: Optional[str]) -> Tuple[bool, Optional[str]]:
    """Validate encryption/decryption password."""
    if not password or len(password.strip()) == 0:
        return False, "Password cannot be empty. Please enter a key or password."

    return True, None
