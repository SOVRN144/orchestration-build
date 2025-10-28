# Testing & Determinism
- No network/LLM; fake timers + `vi.setSystemTime()`.
- Set `TZ=UTC` in CI, restore timers after tests.
- Seed/stub randomness when used; avoid volatile snapshots.
- Keep coverage off in Phase-1 for speed.
