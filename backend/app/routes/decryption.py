"""
Decryption Route for SecureVault API.
Handles upload of .svault container, HMAC verification, two-stage decryption
(DES-CBC then Hill Cipher mod 256), saving recovered file, and audit logging.
"""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Form, status
from fastapi.responses import JSONResponse

from app.crypto.pipeline import decrypt_pipeline, DecryptionError
from app.database import insert_operation
from app.utils.file_utils import (
    sanitize_filename,
    generate_unique_filename,
    DECRYPTED_DIR,
    get_safe_path,
)
from app.utils.validation import validate_encrypted_file, validate_password
from app.schemas import APIResponse

router = APIRouter(prefix="/api", tags=["Decryption"])


@router.post("/decrypt", response_model=APIResponse)
async def decrypt_file_endpoint(
    file: UploadFile = File(...),
    password: str = Form(...),
):
    """Decrypt a SecureVault (.svault) file using DES-CBC followed by Hill Cipher."""
    # 1. Validate password
    valid_pass, pass_err = validate_password(password)
    if not valid_pass:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": pass_err, "error_code": "INVALID_PASSWORD"},
        )

    # 2. Read incoming encrypted container bytes
    try:
        container_bytes = await file.read()
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Unable to read uploaded file. Please try again.", "error_code": "FILE_READ_ERROR"},
        )

    safe_upload_name = sanitize_filename(file.filename or "encrypted.svault")
    valid_container, container_err = validate_encrypted_file(safe_upload_name, container_bytes)
    if not valid_container:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": container_err, "error_code": "INVALID_CONTAINER"},
        )

    op_id = str(uuid.uuid4())

    # 3. Execute Decryption Pipeline (HMAC authentication -> DES -> Hill)
    try:
        recovered_bytes, original_filename, metadata = decrypt_pipeline(
            container_bytes=container_bytes,
            password=password,
        )
    except DecryptionError as e:
        # Secure message: do not leak whether key was wrong or ciphertext tampered
        insert_operation({
            "id": op_id,
            "original_filename": safe_upload_name,
            "stored_filename": "failed_decryption",
            "operation": "DECRYPT",
            "original_size": len(container_bytes),
            "output_size": 0,
            "algorithm": "DES + Hill Cipher",
            "status": "FAILED",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "error_message": str(e),
            "sha256": None,
        })
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": str(e), "error_code": "DECRYPTION_FAILED"},
        )
    except Exception:
        insert_operation({
            "id": op_id,
            "original_filename": safe_upload_name,
            "stored_filename": "failed_decryption",
            "operation": "DECRYPT",
            "original_size": len(container_bytes),
            "output_size": 0,
            "algorithm": "DES + Hill Cipher",
            "status": "FAILED",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "error_message": "Unexpected error during decryption",
            "sha256": None,
        })
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Decryption failed: invalid key or corrupted file.", "error_code": "DECRYPTION_FAILED"},
        )

    # 4. Save recovered file to decrypted directory
    stored_recovered_name = generate_unique_filename(original_filename, prefix="dec")
    target_path = get_safe_path(DECRYPTED_DIR, stored_recovered_name)

    with open(target_path, "wb") as f:
        f.write(recovered_bytes)

    # 5. Record successful decryption in database
    created_at = datetime.now(timezone.utc).isoformat()
    insert_operation({
        "id": op_id,
        "original_filename": original_filename,
        "stored_filename": stored_recovered_name,
        "operation": "DECRYPT",
        "original_size": len(container_bytes),
        "output_size": len(recovered_bytes),
        "algorithm": "DES + Hill Cipher",
        "status": "SUCCESS",
        "created_at": created_at,
        "error_message": None,
        "sha256": metadata["sha256"],
    })

    return {
        "success": True,
        "message": "File decrypted successfully! Original contents recovered byte-for-byte.",
        "data": {
            "operation_id": op_id,
            "original_filename": original_filename,
            "stored_filename": stored_recovered_name,
            "container_size": len(container_bytes),
            "recovered_size": len(recovered_bytes),
            "sha256": metadata["sha256"],
            "algorithms": "DES (CBC Mode) + Hill Cipher",
            "integrity_verified": True,
            "download_url": f"/api/download/{op_id}",
            "hill_metadata": metadata["hill_metadata"],
            "des_metadata": metadata["des_metadata"],
        },
    }
