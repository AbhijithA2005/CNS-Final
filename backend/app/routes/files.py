"""
File Download and Cryptographic Analysis Tool Routes for SecureVault.
Provides safe file retrieval with path traversal defense, matrix validation, and password strength checks.
"""

import os
import numpy as np
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse, JSONResponse

from app.database import get_operation_by_id
from app.utils.file_utils import (
    ENCRYPTED_DIR,
    DECRYPTED_DIR,
    get_safe_path,
)
from app.crypto.hill_cipher import matrix_det, is_invertible_mod256, matrix_modinv, modinv
from app.crypto.key_utils import evaluate_password_strength
from app.schemas import APIResponse, ValidateMatrixRequest

router = APIRouter(prefix="/api", tags=["Files & Cryptographic Utilities"])


@router.get("/download/{op_id}")
async def download_file_endpoint(op_id: str):
    """Download the output file from an encryption or decryption operation."""
    op = get_operation_by_id(op_id)
    if not op:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operation record not found",
        )

    if op["status"] != "SUCCESS":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot download file from a failed operation",
        )

    operation = op["operation"].upper()
    stored_filename = op["stored_filename"]
    original_filename = op["original_filename"]

    if operation == "ENCRYPT":
        target_dir = ENCRYPTED_DIR
        download_name = f"{original_filename}.svault" if not original_filename.endswith(".svault") else original_filename
    elif operation == "DECRYPT":
        target_dir = DECRYPTED_DIR
        download_name = original_filename
    else:
        raise HTTPException(status_code=400, detail="Invalid operation type")

    try:
        file_path = get_safe_path(target_dir, stored_filename)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid file path")

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested file is no longer available on the server",
        )

    return FileResponse(
        path=file_path,
        filename=download_name,
        media_type="application/octet-stream",
    )


@router.post("/crypto/validate-matrix", response_model=APIResponse)
async def validate_matrix_endpoint(req: ValidateMatrixRequest):
    """Validate whether an arbitrary 2x2 integer matrix is invertible modulo 256 for Hill Cipher."""
    mat_arr = np.array(req.matrix, dtype=int)
    if mat_arr.shape != (2, 2):
        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": "Matrix must be exactly 2x2 in size",
                "error_code": "INVALID_DIMENSIONS",
            },
        )

    det = matrix_det(mat_arr, 256)
    is_valid = (det % 2 == 1)

    inv_det = None
    inv_matrix = None
    explanation = ""

    if is_valid:
        inv_det = modinv(det, 256)
        inv_mat = matrix_modinv(mat_arr, 256)
        inv_matrix = inv_mat.tolist()
        explanation = (
            f"Valid Hill Cipher Matrix! Determinant = {det} (odd). "
            f"gcd({det}, 256) = 1, so det^-1 mod 256 = {inv_det}. "
            "A valid modular inverse matrix exists."
        )
    else:
        explanation = (
            f"Invalid Matrix! Determinant = {det} (even). "
            f"gcd({det}, 256) = {np.gcd(det, 256)} != 1. "
            "Even determinants share factor 2 with 256 and cannot be inverted in Z_256."
        )

    return {
        "success": True,
        "message": "Matrix validation evaluated",
        "data": {
            "is_valid": is_valid,
            "determinant": det,
            "is_coprime_256": is_valid,
            "det_modular_inverse": inv_det,
            "inverse_matrix": inv_matrix,
            "explanation": explanation,
        },
    }


@router.post("/crypto/password-strength", response_model=APIResponse)
async def password_strength_endpoint(req: dict):
    """Evaluate password strength and return score and suggestions."""
    pwd = req.get("password", "")
    res = evaluate_password_strength(pwd)
    return {
        "success": True,
        "message": "Password strength assessed",
        "data": res,
    }
