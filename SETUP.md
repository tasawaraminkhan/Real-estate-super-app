# PropVerse local setup

## Prerequisites
- Node 20 (`nvm use`)
- pnpm 9+
- Docker Desktop running

## Steps

```bash
git clone https://github.com/tasawaraminkhan/Real-estate-super-app.git
cd Real-estate-super-app
pnpm install
cp .env.example .env
pnpm stack:up

# wait for postgres healthy
cd services/api
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init   # first time
pnpm exec prisma db seed
cd ../..

pnpm --filter @propverse/api dev
# other terminal:
pnpm --filter @propverse/mobile start
```

## API endpoints (v1)

| Method | Path | Notes |
|--------|------|-------|
| GET | /api/health | health |
| POST | /api/v1/auth/otp/request | `{ "phone": "03001234567" }` — returns `devOtp` in dev |
| POST | /api/v1/auth/otp/verify | `{ "phone", "code" }` → tokens + user |
| GET | /api/v1/auth/me | Bearer token |
| GET | /api/v1/properties | paginated list |
| GET | /api/v1/properties/:id | detail |
| GET | /api/v1/search/properties | filters: purpose, priceMin/Max, areaMin/Max, sort |
| GET | /api/v1/societies | list |
| GET | /api/v1/societies/:id/map | GeoJSON-style plot features |

Swagger: http://localhost:3001/api/docs

## Smoke

```bash
pnpm smoke
```
