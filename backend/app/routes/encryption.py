"""
Encryption Route for SecureVault API.
Handles file upload, validation, two-stage cryptographic pipeline execution,
secure storage of .svault file, and database audit logging.
"""

import json
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse

from app.crypto.pipeline import encrypt_pipeline
from app.database import insert_operation
from app.utils.file_utils import (
    sanitize_filename,
    generate_unique_filename,
    ENCRYPTED_DIR,
    get_safe_path,
)
from app.utils.validation import validate_upload_file, validate_password
from app.schemas import APIResponse, APIErrorResponse

router = APIRouter(prefix="/api", tags=["Encryption"])


@router.post("/encrypt", response_model=APIResponse)
async def encrypt_file_endpoint(
    file: UploadFile = File(...),
    password: str = Form(...),
    custom_matrix: Optional[str] = Form(None),
):
    """Encrypt an uploaded file using the Hill Cipher + DES cryptographic pipeline."""
    # 1. Validate password
    valid_pass, pass_err = validate_password(password)
    if not valid_pass:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": pass_err, "error_code": "INVALID_PASSWORD"},
        )

    # 2. Read file bytes
    try:
        file_bytes = await file.read()
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Unable to read uploaded file. Please try again.", "error_code": "FILE_READ_ERROR"},
        )

    safe_original_name = sanitize_filename(file.filename or "file.bin")
    valid_file, file_err = validate_upload_file(safe_original_name, len(file_bytes))
    if not valid_file:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": file_err, "error_code": "INVALID_FILE"},
        )

    # 3. Parse optional custom matrix
    parsed_matrix = None
    if custom_matrix:
        try:
            parsed_matrix = json.loads(custom_matrix)
        except Exception:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"success": False, "message": "Invalid custom matrix format. Expected a 2x2 JSON array.", "error_code": "INVALID_MATRIX"},
            )

    op_id = str(uuid.uuid4())
    stored_svault_name = generate_unique_filename(safe_original_name, prefix="enc", extension=".svault")
    target_path = get_safe_path(ENCRYPTED_DIR, stored_svault_name)

    # 4. Execute Cryptographic Pipeline
    try:
        encrypted_container, metadata = encrypt_pipeline(
            data=file_bytes,
            original_filename=safe_original_name,
            password=password,
            custom_matrix=parsed_matrix,
        )
    except Exception as e:
        # Record failure in database
        insert_operation({
            "id": op_id,
            "original_filename": safe_original_name,
            "stored_filename": stored_svault_name,
            "operation": "ENCRYPT",
            "original_size": len(file_bytes),
            "output_size": 0,
            "algorithm": "Hill Cipher + DES",
            "status": "FAILED",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "error_message": "Encryption failed",
            "sha256": None,
        })
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": "Encryption process failed. Please check inputs and try again.", "error_code": "ENCRYPTION_FAILED"},
        )

    # 5. Save encrypted file to disk
    with open(target_path, "wb") as f:
        f.write(encrypted_container)

    # 6. Log success in SQLite
    created_at = datetime.now(timezone.utc).isoformat()
    insert_operation({
        "id": op_id,
        "original_filename": safe_original_name,
        "stored_filename": stored_svault_name,
        "operation": "ENCRYPT",
        "original_size": len(file_bytes),
        "output_size": len(encrypted_container),
        "algorithm": "Hill Cipher + DES",
        "status": "SUCCESS",
        "created_at": created_at,
        "error_message": None,
        "sha256": metadata["encrypted_sha256"],
    })

    return {
        "success": True,
        "message": "File encrypted successfully with Hill Cipher + DES",
        "data": {
            "operation_id": op_id,
            "original_filename": safe_original_name,
            "stored_filename": stored_svault_name,
            "original_size": len(file_bytes),
            "encrypted_size": len(encrypted_container),
            "original_sha256": metadata["original_sha256"],
            "encrypted_sha256": metadata["encrypted_sha256"],
            "algorithms": "Hill Cipher + DES (CBC Mode)",
            "download_url": f"/api/download/{op_id}",
            "hill_metadata": metadata["hill_metadata"],
            "des_metadata": metadata["des_metadata"],
            "pipeline_stages": metadata["pipeline_stages"],
        },
    }
