# PropVerse Architecture

## High-level

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Mobile     │  │  Web        │  │  Admin      │
│  (Expo)     │  │  (Next.js)  │  │  (Next.js)  │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                 ┌──────▼──────┐
                 │  NestJS API │  /api/v1
                 │  + Socket.IO│
                 └──────┬──────┘
                        │
       ┌────────────────┼────────────────┐
       │                │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│ PostgreSQL  │  │   Redis     │  │  MinIO/S3   │
│ + PostGIS   │  │  + BullMQ   │  │  (media)    │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Core domains

1. **Identity** — Phone OTP, JWT rotation, RBAC (BUYER / OWNER / AGENT / AGENCY_ADMIN / DEVELOPER / CONTRACTOR / ARCHITECT / VENDOR / ADMIN)
2. **Listings** — 5-step wizard, media pipeline, lifecycle (DRAFT → PENDING_REVIEW → ACTIVE → …)
3. **Search** — PostGIS radius / bbox / polygon + filters + facets + cursor pagination
4. **Society Map** — Plot-level inventory, GeoJSON, colour-coded status
5. **CRM + Chat** — Leads kanban, masked calling, Socket.IO messaging
6. **Construction** — Cost engine (deterministic, versioned rates) + project tracker
7. **Trust** — Rule-based fraud score, moderation queue, KYC
8. **Monetization** — Subscriptions, featured listings, escrow (feature-flagged)

## Non-negotiables

- TypeScript strict, no `any` without comment
- All inputs validated with Zod (shared package)
- Money as integer minor units or Prisma Decimal
- Soft deletes everywhere
- Secrets only from env
- Every list endpoint paginated (max 50)
- Error shape: `{ error: { code, message, details? } }`

## Area units (single source of truth)

| Unit   | SqFt    | Note                          |
|--------|---------|-------------------------------|
| Marla  | 225     | Punjab standard; city override possible |
| Kanal  | 4,500   | 20 Marla                      |
| Acre   | 43,560  | Agricultural                  |
| SqYd   | 9       | Commercial                    |
| SqM    | 10.7639 | International                 |

`price_per_sqft` is a generated column after normalisation.
