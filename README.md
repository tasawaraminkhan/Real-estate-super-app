# PropVerse

**Pakistan Real Estate Super-App** — listings, PostGIS search, society map, construction cost, fraud scoring, billing, leads, chat.

Repo: https://github.com/tasawaraminkhan/Real-estate-super-app

## Status (phases)

| Phase | Status |
|-------|--------|
| Monorepo + Docker (PostGIS/Redis/MinIO) | Done |
| Auth phone OTP + JWT + RBAC | Done |
| Prisma schema + seed | Done |
| Listings CRUD + submit + fraud | Done |
| Media presign/confirm | Done |
| Geospatial search API | Done |
| Society map API + mobile grid | Done |
| Construction cost engine | Done |
| Billing plans + mock pay + featured | Done |
| Leads CRM | Done |
| Chat + phone mask | Done |
| Admin API + Next admin UI | Done |
| Public web (listings / estimate) | Done |
| Mobile: Home, Map, Cost, Sell, Leads, Detail, Chat | Done |
| Standalone release APK (GitHub Actions) | Done |
| Real JazzCash/Easypaisa / production S3 | Stub (mock) |
| Escrow ledger | Feature-flagged / not enabled |
| Full Mapbox GL polygons | Next polish |

## Apps

| Path | Port | Role |
|------|------|------|
| `services/api` | 3001 | NestJS API + Swagger `/api/docs` |
| `apps/mobile` | Expo | Android APK via Actions |
| `apps/web` | 3000 | Public site |
| `apps/admin` | 3002 | Moderation dashboard |

## Quick start (API)

```bash
pnpm install   # or npm in each package
cp .env.example .env
docker compose up -d
cd services/api && npx prisma generate && npx prisma migrate dev && npx prisma db seed
npm run start:dev
```

Demo OTP: **123456**

## APK

1. [Actions](https://github.com/tasawaraminkhan/Real-estate-super-app/actions) → latest **Build PropVerse standalone APK** (Success)
2. Artifacts → **propverse-apk**
3. Uninstall old app → install new

Release APK embeds JS — **no Metro / laptop needed**.

## Mobile tabs

Home (search/filters) · Map (plot inventory) · Cost · Sell (4-step) · Leads

Detail + Chat screens from listing tap.

## Docs

- `SETUP.md` — endpoint list Phase 1–2
- `docs/ARCHITECTURE.md` — if present

## Design

Primary `#0D6B5F` · background `#EEF1EC` · prices monospace-friendly formatting in UI.
