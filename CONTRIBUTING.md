# Contributing

## Workflow

- keep architecture boundaries intact: engine -> state -> UI -> repositories -> workers -> D1
- avoid moving business rules into React components or Workers
- prefer small, focused changes over broad refactors
- run typecheck, lint, tests, and build before opening a release-facing change

## Local Setup

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Pull Request Expectations

- explain the user-facing outcome
- call out any architecture-sensitive decisions
- include screenshots or manual verification notes for UI changes
- keep documentation current when behavior or deployment steps change
