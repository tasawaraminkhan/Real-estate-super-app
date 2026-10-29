#!/usr/bin/env bash
set -euo pipefail
API="${API_URL:-http://localhost:3001}"
echo "== PropVerse smoke =="
echo "1. Health"; curl -sS "$API/api/health"; echo
echo "2. OTP request"; curl -sS -X POST "$API/api/v1/auth/otp/request" -H "Content-Type: application/json" -d '{"phone":"03001234567"}'; echo
echo "3. Properties"; curl -sS "$API/api/v1/properties?limit=5"; echo
echo "4. Search SALE"; curl -sS "$API/api/v1/search/properties?purpose=SALE&limit=3"; echo
echo "Smoke finished."
