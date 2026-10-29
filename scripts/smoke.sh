#!/usr/bin/env bash
set -euo pipefail

API="${API_URL:-http://localhost:3001}"

echo "== PropVerse smoke =="
echo "API: $API"
echo

echo "1. Health"
curl -sS "$API/api/health" | head -c 300
echo -e "\n"

echo "2. Properties list"
curl -sS "$API/api/v1/properties?limit=5" | head -c 500
echo -e "\n"

echo "3. Property detail"
curl -sS "$API/api/v1/properties/00000000-0000-4000-8000-000000000001" | head -c 400
echo -e "\n"

echo "Smoke finished."
