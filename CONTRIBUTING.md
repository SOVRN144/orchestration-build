# Contributing to Orchestration Build

## Development Setup

```bash
npm install
npm run check:fast  # format + lint + type-check
npm test
npm run smoke:p1    # Phase 1 smoke test
```

## Commit Guidelines

- Conventional Commits: feat:, fix:, docs:, test:, ci:
- Tiny PRs: ≤200 lines preferred, single concern
- Phase Gates: Each phase has DoD (see Phase 1/Phase 1 plan.pdf)

## Testing

- All tests must pass: npm test
- Deterministic: Tests use UTC, fake timers, seeded randomness
- Coverage target: ≥80% (current: 87%)

## Security

- Never commit secrets (.env is gitignored)
- Use .env.example for safe mock values
- secretGuard.ts scans fixtures; allow sk_test_, test_, example_ prefixes

## Pull Request Process

1. Create feature branch: git checkout -b feature/your-feature
2. Make changes and add tests
3. Run quality checks: npm run check:fast && npm test
4. Push and open PR against main
5. Ensure CI passes (all checks green)
6. Request review from maintainers

## Code Style

- Format: Prettier (automatic via npm run format)
- Lint: ESLint flat config (run npm run lint)
- TypeScript: Strict mode enabled, noUncheckedIndexedAccess: true

## Phase-1 Status

✅ Phase 1 Complete (1A-1K)
- Message schema & validation
- Loop convergence (3 exit paths)
- Event bus (envelope-based)
- Logging (OTEL stub JSONL + redaction)
- Budget trace (stubbed)
- Security guards (secretGuard)
- Deterministic tests (15/15 passing)

🚀 Next: Phase 2 (Real Provider Adapters)
