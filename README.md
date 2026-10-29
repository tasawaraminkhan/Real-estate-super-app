# PropVerse

**Pakistan Real Estate Super-App** — Zameen + Graana + Bayut + Zillow + Airbnb + Houzz, ek unified platform.

> Mission: Buyer 3 taps mein samajh jaye — yeh jagah kahan hai, kitni badi hai, kitne ki hai, aur uski zaroorat ke mutabiq hai ya nahi. Seller 5 minute mein proper listing daal de.

## Stack (locked)

| Layer | Tech |
|-------|------|
| Monorepo | Turborepo + pnpm |
| Mobile | Expo SDK 51+ / React Native + TypeScript |
| Web / Admin | Next.js 14 App Router |
| API | NestJS 10 + Prisma |
| DB | PostgreSQL 16 + PostGIS 3 |
| Cache / Queue | Redis 7 + BullMQ |
| Storage | MinIO (local) / S3 (prod) |
| Maps | Mapbox + react-native-maps |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/tasawaraminkhan/Real-estate-super-app.git
cd Real-estate-super-app

# 2. Node 20
nvm use

# 3. Install
pnpm install

# 4. Env
cp .env.example .env

# 5. Infrastructure
pnpm stack:up

# 6. DB
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 7. Run everything
pnpm dev
```

- API: http://localhost:3001  
- Swagger: http://localhost:3001/api/docs  
- Web: http://localhost:3000  
- Mailhog: http://localhost:8025  
- MinIO: http://localhost:9001 (minioadmin / minioadmin)

## Mobile (Android)

```bash
pnpm --filter @propverse/mobile start
# then press `a` for Android emulator
```

## Project Structure

```
propverse/
├── apps/
│   ├── mobile/          # Expo React Native
│   ├── web/             # Next.js public site
│   └── admin/           # Next.js admin console
├── services/
│   └── api/             # NestJS API
├── packages/
│   ├── shared/          # Zod schemas + TS types (single source of truth)
│   └── ui/              # Design tokens + shared components
├── infra/               # Docker, CI helpers
├── docs/                # ARCHITECTURE.md, DECISIONS.md
└── scripts/             # smoke.sh, bench, seed helpers
```

## Build Guide Mapping

Yeh repo PropVerse Build Guide (18 prompts) ke mutabiq banaya ja raha hai:

| Phase | Prompts | Status |
|-------|---------|--------|
| 0–1 Foundation | P01–P03 | In progress |
| Data + Auth | P04–P05 | Pending |
| Marketplace | P06–P08 | Pending |
| Differentiator | P09–P11 | Pending |
| Growth + Trust | P12–P14 | Pending |
| Polish + Ship | P15–P18 | Pending |

## Design Tokens

- Primary: `#0D6B5F`
- Accent (flag): `#B9551B`
- Ink: `#0F1C19`
- Fonts: Bricolage Grotesque (display), IBM Plex Sans (body), IBM Plex Mono (numbers/prices)

## License

Proprietary — All rights reserved.
