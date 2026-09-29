"""
Pydantic schemas and standard response contracts for SecureVault API.
"""

from typing import Generic, TypeVar, Optional, Any, List, Dict
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class APIResponse(BaseModel, Generic[DataT]):
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[DataT] = None


class APIErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str = "INTERNAL_ERROR"


class OperationRecord(BaseModel):
    id: str
    original_filename: str
    stored_filename: str
    operation: str
    original_size: int
    output_size: int
    algorithm: str
    status: str
    created_at: str
    error_message: Optional[str] = None
    sha256: Optional[str] = None


class HistoryResponse(BaseModel):
    items: List[OperationRecord]
    total: int
    page: int
    limit: int


class DashboardStats(BaseModel):
    files_processed: int
    encrypted_count: int
    decrypted_count: int
    total_storage_bytes: int


class PipelineMetadata(BaseModel):
    original_filename: str
    original_size: int
    processed_size: int
    original_sha256: Optional[str] = None
    output_sha256: Optional[str] = None
    algorithms: str = "Hill Cipher + DES (CBC Mode)"
    hill_matrix: Optional[List[List[int]]] = None
    hill_det: Optional[int] = None
    hill_inv_matrix: Optional[List[List[int]]] = None
    operation_id: str
    download_url: str


class PasswordStrengthResponse(BaseModel):
    score: int
    level: str
    suggestions: List[str]


class ValidateMatrixRequest(BaseModel):
    matrix: List[List[int]]


class ValidateMatrixResponse(BaseModel):
    is_valid: bool
    determinant: int
    is_coprime_256: bool
    inverse_matrix: Optional[List[List[int]]] = None
    explanation: str
