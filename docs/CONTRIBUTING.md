## Contributing (Phase-1)
- Keep pull requests tiny (≤200 LOC), single-purpose, easy to revert.
- Branch naming: `phase-1/<ticket>-<slug>`; always rebase on `main`; fast-forward merges only.
- Before requesting review run: `npm run lint`, `npm run type-check`, `npm test`, `npm run smoke:p1`.
- Use mocks only; no live provider calls. Prefer diffs ≤40 lines per file when possible.
