# Architecture Decision Records (ADR)

## ADR-001: Monorepo with Turborepo + pnpm

**Date:** 2026-10-29  
**Status:** Accepted  

Single repo for mobile, web, admin, API and shared packages. Shared Zod schemas and design tokens prevent drift.

## ADR-002: PostGIS geography, not geometry

**Date:** 2026-10-29  
**Status:** Accepted  

Radius and distance queries use `geography(Point,4326)` so measurements are in metres. `geometry` would use degrees and produce wrong results in Karachi/Lahore.

## ADR-003: Phone-first auth + OTP

**Date:** 2026-10-29  
**Status:** Accepted  

Pakistan market is phone-centric. Primary login is OTP. Email/password is secondary. Refresh tokens rotate; reuse detection revokes the family.

## ADR-004: Money as integer minor units

**Date:** 2026-10-29  
**Status:** Accepted  

Never store money as float. Use BIGINT minor units (paisa) or Prisma `Decimal`. Display formatting happens in UI.

## ADR-005: Escrow behind feature flag

**Date:** 2026-10-29  
**Status:** Accepted  

`ESCROW_ENABLED=false` by default. Holding customer funds requires regulatory clearance (State Bank / SECP). Code can ship, production switch stays off until legal sign-off.

## ADR-006: Design tokens locked

**Date:** 2026-10-29  
**Status:** Accepted  

Primary `#0D6B5F`, Accent `#B9551B`, numeric font IBM Plex Mono (tabular). Raw hex never appears inside components.
