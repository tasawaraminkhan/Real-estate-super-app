# Contributing to PropVerse

## Workflow

1. Branch from `main`: `feat/...`, `fix/...`, `chore/...`
2. Conventional commits: `feat(api): add property search filters`
3. Every PR must pass: lint, typecheck, unit tests
4. Keep scope small — one vertical slice per PR when possible

## Local setup

See root README. Always run `pnpm stack:up` before API work.

## Code rules

- TypeScript strict
- Zod for every external input
- No secrets in code
- Soft-delete by default
- Tests for new business logic

## Review checklist

- [ ] Ownership / RBAC checks present
- [ ] Money never float
- [ ] Loading / empty / error states on UI
- [ ] Urdu + English strings via i18n
- [ ] Honest gap list in PR description
