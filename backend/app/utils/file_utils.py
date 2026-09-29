"""
File utilities and path security for SecureVault.
Provides path traversal protection, secure filename generation, and directory management.
"""

import os
import re
import uuid
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
ENCRYPTED_DIR = BASE_DIR / "encrypted"
DECRYPTED_DIR = BASE_DIR / "decrypted"

# Ensure runtime directories exist
for directory in (UPLOADS_DIR, ENCRYPTED_DIR, DECRYPTED_DIR):
    directory.mkdir(parents=True, exist_ok=True)


def sanitize_filename(filename: str) -> str:
    """Sanitize uploaded filename to prevent directory traversal or filesystem exploits."""
    if not filename:
        return "unnamed_file"

    # Strip directory components (e.g. ../ or /etc/passwd)
    cleaned = os.path.basename(filename)

    # Replace suspicious characters, keep alphanumeric, dot, dash, underscore, space
    cleaned = re.sub(r"[^\w\.\-\s]", "_", cleaned)
    cleaned = cleaned.strip()

    if not cleaned or cleaned.startswith("."):
        cleaned = f"file_{uuid.uuid4().hex[:8]}"

    return cleaned[:255]  # limit filename length


def generate_unique_filename(original_name: str, prefix: str = "", extension: str = None) -> str:
    """Generate a unique filesystem name using UUIDv4 while preserving safe original extension."""
    safe_name = sanitize_filename(original_name)
    stem, ext = os.path.splitext(safe_name)
    target_ext = extension if extension is not None else ext
    unique_id = uuid.uuid4().hex[:12]

    if prefix:
        return f"{prefix}_{unique_id}{target_ext}"
    return f"{stem}_{unique_id}{target_ext}"


def get_safe_path(directory: Path, filename: str) -> Path:
    """Resolve and verify that the target path does not escape the parent directory."""
    resolved_dir = directory.resolve()
    target = (directory / os.path.basename(filename)).resolve()

    if not str(target).startswith(str(resolved_dir)):
        raise ValueError(f"Path traversal detected: {filename}")

    return target


def format_bytes(size: int) -> str:
    """Format bytes into human-readable string (KB, MB, GB)."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    elif size < 1024 * 1024 * 1024:
        return f"{size / (1024 * 1024):.1f} MB"
    else:
        return f"{size / (1024 * 1024 * 1024):.2f} GB"
