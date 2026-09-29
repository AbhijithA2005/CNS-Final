#!/usr/bin/env bash
# SecureVault All-in-One Launcher Script

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "============================================================"
echo " Starting SecureVault (Hill Cipher + DES File Sharing)"
echo "============================================================"

# Ensure virtual environment exists
if [ ! -d ".venv" ]; then
    echo "[!] Virtual environment .venv not found. Creating..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r backend/requirements.txt
else
    source .venv/bin/activate
fi

# Clean up any lingering processes on ports 8000 & 3000
echo "[*] Ensuring ports 8000 and 3000 are available..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# 1. Start FastAPI Backend in background
echo "[*] Launching FastAPI Backend on http://127.0.0.1:8000..."
PYTHONPATH=backend python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend health check
echo "[*] Waiting for backend to initialize..."
for i in {1..15}; do
    if curl -s http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
        echo "[✓] Backend is healthy and ready!"
        break
    fi
    sleep 0.5
done

# 2. Trap SIGINT and SIGTERM to kill backend when user presses Ctrl+C
trap 'echo "\n[*] Shutting down SecureVault..."; kill -9 $BACKEND_PID 2>/dev/null; exit 0' INT TERM EXIT

# 3. Start Next.js Frontend in foreground
echo "[*] Launching Next.js Frontend on http://localhost:3000..."
echo "============================================================"
echo "  👉 Web Application: http://localhost:3000"
echo "  👉 Swagger API Docs: http://localhost:8000/docs"
echo "  Press Ctrl+C to stop both servers."
echo "============================================================"

cd frontend
npm run dev -- -p 3000
