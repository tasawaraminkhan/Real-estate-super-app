# PropVerse — Setup & Phase 1–2 API

## Run locally

```bash
pnpm install && cp .env.example .env
pnpm stack:up
cd services/api
pnpm exec prisma generate
pnpm exec prisma migrate dev --name phase12
pnpm exec prisma db seed
pnpm --filter @propverse/api dev
```

Swagger: http://localhost:3001/api/docs

## Phase 1–2 endpoints

### Auth
- `POST /api/v1/auth/otp/request` `{ phone }`
- `POST /api/v1/auth/otp/verify` `{ phone, code }`
- `GET  /api/v1/auth/me` Bearer

### Listings
- `GET  /api/v1/properties`
- `GET  /api/v1/properties/:id`
- `POST /api/v1/properties` draft (auth)
- `PATCH /api/v1/properties/:id` (auth, owner)
- `POST /api/v1/properties/:id/submit` → fraud score + ACTIVE/PENDING_REVIEW
- `POST /api/v1/properties/:id/favourite`
- `GET  /api/v1/properties/favourites`
- `GET  /api/v1/properties/me/list`

### Media
- `POST /api/v1/media/presign` `{ propertyId, filename, contentType }`
- `POST /api/v1/media/confirm` `{ propertyId, objectKey, sortOrder }`

### Search & societies
- `GET /api/v1/search/properties?...`
- `GET /api/v1/societies` · `GET /api/v1/societies/:id/map`

### Construction cost
- `POST /api/v1/construction/estimate`
  `{ areaValue, areaUnit, floors, constructionType, quality, city }`

### Billing / payments
- `GET  /api/v1/billing/plans`
- `POST /api/v1/billing/seed-plans`
- `POST /api/v1/billing/intent` `{ planCode, provider? }` → mock payment
- `POST /api/v1/billing/confirm` `{ transactionId }`
- `POST /api/v1/billing/feature` `{ propertyId }` (uses featured credits)

Plans: FREE · STARTER (3k) · PROFESSIONAL (8k) · AGENCY (20k) PKR/mo

### Leads CRM
- `POST /api/v1/leads` · `GET /api/v1/leads` · `PATCH /api/v1/leads/:id/stage`

### Chat
- `POST /api/v1/chat/threads` · `GET /api/v1/chat/threads`
- `GET/POST /api/v1/chat/threads/:id/messages` (phone numbers auto-masked)

### Admin
- `GET  /api/v1/admin/dashboard`
- `GET  /api/v1/admin/moderation`
- `POST /api/v1/admin/moderation/:id` `{ action: approve|reject }`

## APK

Actions → **Build Android APK** → artifact `propverse-apk`  
Demo OTP on device: **123456**
