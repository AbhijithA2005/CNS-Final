"""
Automated REST API Test Suite for SecureVault Backend
Tests /api/health, /api/encrypt, /api/decrypt, /api/history, /api/stats, /api/download/{id},
/api/crypto/validate-matrix, and /api/crypto/password-strength.
"""

import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_health():
    """Verify health endpoint."""
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_api_password_strength():
    """Verify password strength calculation endpoint."""
    res = client.post("/api/crypto/password-strength", json={"password": "Weak"})
    assert res.status_code == 200
    assert res.json()["data"]["level"] in ("Weak", "Moderate")

    res2 = client.post("/api/crypto/password-strength", json={"password": "SuperSecureP@ssw0rd2026!"})
    assert res2.status_code == 200
    assert res2.json()["data"]["level"] == "Very Strong"


def test_api_validate_matrix():
    """Verify 2x2 Hill matrix validation endpoint."""
    # Invertible matrix: det = 3*17 - 5*6 = 21 (odd)
    res = client.post("/api/crypto/validate-matrix", json={"matrix": [[3, 5], [6, 17]]})
    assert res.status_code == 200
    assert res.json()["data"]["is_valid"] is True
    assert res.json()["data"]["determinant"] == 21

    # Non-invertible matrix: det = 2*4 - 2*2 = 4 (even)
    res_bad = client.post("/api/crypto/validate-matrix", json={"matrix": [[2, 2], [2, 4]]})
    assert res_bad.status_code == 200
    assert res_bad.json()["data"]["is_valid"] is False


def test_api_encrypt_decrypt_download_flow():
    """End-to-end API test: upload -> encrypt -> download .svault -> decrypt -> download original."""
    content = b"Confidential API test file content with binary \x00\x01\xfe\xff"
    password = "TestApiPassword123!"

    # 1. Encrypt via API
    encrypt_res = client.post(
        "/api/encrypt",
        files={"file": ("test_upload.bin", io.BytesIO(content), "application/octet-stream")},
        data={"password": password},
    )
    assert encrypt_res.status_code == 200
    enc_json = encrypt_res.json()
    assert enc_json["success"] is True
    op_id = enc_json["data"]["operation_id"]
    download_url = enc_json["data"]["download_url"]

    # 2. Download encrypted container
    download_res = client.get(download_url)
    assert download_res.status_code == 200
    container_bytes = download_res.content
    assert container_bytes.startswith(b"SVAULT")

    # 3. Decrypt via API
    decrypt_res = client.post(
        "/api/decrypt",
        files={"file": ("test_upload.bin.svault", io.BytesIO(container_bytes), "application/octet-stream")},
        data={"password": password},
    )
    assert decrypt_res.status_code == 200
    dec_json = decrypt_res.json()
    assert dec_json["success"] is True
    assert dec_json["data"]["original_filename"] == "test_upload.bin"
    dec_op_id = dec_json["data"]["operation_id"]

    # 4. Download decrypted file
    rec_download_res = client.get(f"/api/download/{dec_op_id}")
    assert rec_download_res.status_code == 200
    assert rec_download_res.content == content

    # 5. Verify History & Stats
    hist_res = client.get("/api/history")
    assert hist_res.status_code == 200
    assert hist_res.json()["data"]["total"] >= 2

    stats_res = client.get("/api/stats")
    assert stats_res.status_code == 200
    assert stats_res.json()["data"]["files_processed"] >= 2
    assert stats_res.json()["data"]["encrypted_count"] >= 1
    assert stats_res.json()["data"]["decrypted_count"] >= 1


def test_api_wrong_password():
    """Verify API returns 400 error on wrong password."""
    content = b"Some data"
    enc_res = client.post(
        "/api/encrypt",
        files={"file": ("data.txt", io.BytesIO(content), "text/plain")},
        data={"password": "CorrectKey123"},
    )
    container_bytes = client.get(enc_res.json()["data"]["download_url"]).content

    # Attempt decrypt with wrong password
    dec_res = client.post(
        "/api/decrypt",
        files={"file": ("data.txt.svault", io.BytesIO(container_bytes), "application/octet-stream")},
        data={"password": "WrongPassword"},
    )
    assert dec_res.status_code == 400
    assert dec_res.json()["success"] is False
    assert "Decryption failed" in dec_res.json()["message"]
