"""
History and Audit Trail Routes for SecureVault.
Provides list, filtering, search, and detailed inspection of cryptographic operations.
"""

from typing import Optional
from fastapi import APIRouter, Query, status
from fastapi.responses import JSONResponse

from app.database import get_operations, get_operation_by_id, get_stats
from app.schemas import APIResponse

router = APIRouter(prefix="/api", tags=["History & Audit"])


@router.get("/history", response_model=APIResponse)
async def list_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    operation: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
):
    """Retrieve paginated cryptographic operation history with filters."""
    offset = (page - 1) * limit
    items, total = get_operations(
        limit=limit,
        offset=offset,
        operation_filter=operation,
        status_filter=status_filter,
        search=search,
    )

    return {
        "success": True,
        "message": "History retrieved successfully",
        "data": {
            "items": items,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit if limit > 0 else 1,
        },
    }


@router.get("/history/{op_id}", response_model=APIResponse)
async def get_history_detail(op_id: str):
    """Retrieve detailed metadata for a specific operation."""
    op = get_operation_by_id(op_id)
    if not op:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Operation record not found", "error_code": "NOT_FOUND"},
        )

    return {
        "success": True,
        "message": "Operation details retrieved",
        "data": op,
    }


@router.get("/stats", response_model=APIResponse)
async def get_dashboard_statistics():
    """Retrieve summary metrics for the SecureVault dashboard."""
    stats = get_stats()
    return {
        "success": True,
        "message": "Dashboard statistics retrieved",
        "data": stats,
    }
