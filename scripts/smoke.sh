#!/usr/bin/env bash
set -euo pipefail
API="${API_URL:-http://localhost:3001}"
echo "== PropVerse Phase 1-2 smoke =="
curl -sS "$API/api/health"; echo
curl -sS -X POST "$API/api/v1/auth/otp/request" -H "Content-Type: application/json" -d '{"phone":"03001234567"}'; echo
curl -sS "$API/api/v1/billing/plans"; echo
curl -sS -X POST "$API/api/v1/construction/estimate" -H "Content-Type: application/json" \
  -d '{"areaValue":5,"areaUnit":"MARLA","floors":1,"constructionType":"GREY_STRUCTURE","quality":"STANDARD","city":"Lahore"}' | head -c 400; echo
curl -sS "$API/api/v1/search/properties?purpose=SALE&limit=2" | head -c 300; echo
echo "Smoke finished."
