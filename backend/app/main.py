"""
Main FastAPI Application Entrypoint for SecureVault
Combines Hill Cipher + DES Layered Cryptographic Pipeline API.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.database import init_db
from app.routes.encryption import router as encryption_router
from app.routes.decryption import router as decryption_router
from app.routes.history import router as history_router
from app.routes.files import router as files_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for database initialization and cleanup."""
    init_db()
    yield


app = FastAPI(
    title="SecureVault API",
    description="Layered Cryptographic File Sharing System using Hill Cipher & DES in CBC Mode",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (Vercel frontend + local dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom validation error handler to keep responses unified."""
    errors = exc.errors()
    msg = errors[0].get("msg", "Invalid request parameters") if errors else "Validation failed"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "message": f"Input validation error: {msg}", "error_code": "VALIDATION_ERROR"},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions without leaking sensitive internal state or stack traces."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "message": "An unexpected error occurred. Please try again.", "error_code": "INTERNAL_SERVER_ERROR"},
    )


# Register Routers
app.include_router(encryption_router)
app.include_router(decryption_router)
app.include_router(history_router)
app.include_router(files_router)


@app.get("/api/health")
async def health_check():
    """Health check endpoint requested by specification."""
    return {"status": "ok"}


@app.get("/")
async def root():
    """Root informative endpoint."""
    return {
        "name": "SecureVault Cryptographic API",
        "subtitle": "Secure File Sharing using Hill Cipher + DES",
        "status": "active",
        "docs_url": "/docs",
        "health_check": "/api/health",
    }
