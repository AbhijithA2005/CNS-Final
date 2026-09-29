"""
SQLite Database Connection and Initialization for SecureVault
Uses standard library sqlite3 for zero-external-dependency local database storage.
"""

import sqlite3
import os
from typing import List, Dict, Any, Optional, Tuple

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database.db")


def get_db_connection() -> sqlite3.Connection:
    """Create and return a database connection with dict-like row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables and indexes."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS operations (
        id TEXT PRIMARY KEY,
        original_filename TEXT NOT NULL,
        stored_filename TEXT NOT NULL,
        operation TEXT NOT NULL,
        original_size INTEGER NOT NULL,
        output_size INTEGER NOT NULL,
        algorithm TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        error_message TEXT,
        sha256 TEXT
    );
    """)

    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_operations_created_at ON operations(created_at DESC);
    """)
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_operations_status ON operations(status);
    """)
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_operations_op ON operations(operation);
    """)

    conn.commit()
    conn.close()


# Ensure tables exist upon module import
init_db()


def insert_operation(op: Dict[str, Any]):
    """Insert a new operation record."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO operations (
            id, original_filename, stored_filename, operation,
            original_size, output_size, algorithm, status,
            created_at, error_message, sha256
        ) VALUES (
            :id, :original_filename, :stored_filename, :operation,
            :original_size, :output_size, :algorithm, :status,
            :created_at, :error_message, :sha256
        )
        """,
        op,
    )
    conn.commit()
    conn.close()


def get_operations(
    limit: int = 50,
    offset: int = 0,
    operation_filter: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None
) -> Tuple[List[Dict[str, Any]], int]:
    """Fetch operations list with optional filtering and search."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM operations WHERE 1=1"
    params = []

    if operation_filter and operation_filter.upper() != "ALL":
        query += " AND UPPER(operation) = ?"
        params.append(operation_filter.upper())

    if status_filter and status_filter.upper() != "ALL":
        query += " AND UPPER(status) = ?"
        params.append(status_filter.upper())

    if search:
        query += " AND (original_filename LIKE ? OR stored_filename LIKE ? OR sha256 LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]

    # Count total
    count_query = "SELECT COUNT(*) FROM operations WHERE 1=1"
    count_params = []
    if operation_filter and operation_filter.upper() != "ALL":
        count_query += " AND UPPER(operation) = ?"
        count_params.append(operation_filter.upper())
    if status_filter and status_filter.upper() != "ALL":
        count_query += " AND UPPER(status) = ?"
        count_params.append(status_filter.upper())
    if search:
        count_query += " AND (original_filename LIKE ? OR stored_filename LIKE ? OR sha256 LIKE ?)"
        count_params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

    cursor.execute(count_query, count_params)
    total = cursor.fetchone()[0]

    conn.close()
    return results, total


def get_operation_by_id(op_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve an operation by its unique ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM operations WHERE id = ?", (op_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None


def get_stats() -> Dict[str, Any]:
    """Retrieve high-level dashboard metrics."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM operations")
    total_processed = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM operations WHERE UPPER(operation) = 'ENCRYPT' AND UPPER(status) = 'SUCCESS'")
    total_encrypted = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM operations WHERE UPPER(operation) = 'DECRYPT' AND UPPER(status) = 'SUCCESS'")
    total_decrypted = cursor.fetchone()[0]

    cursor.execute("SELECT COALESCE(SUM(output_size), 0) FROM operations WHERE UPPER(status) = 'SUCCESS'")
    total_storage = cursor.fetchone()[0]

    conn.close()
    return {
        "files_processed": total_processed,
        "encrypted_count": total_encrypted,
        "decrypted_count": total_decrypted,
        "total_storage_bytes": total_storage,
    }
