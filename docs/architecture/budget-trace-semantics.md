# BudgetTrace Semantics (Phase-1)
- Fields: `inputTokens`, `outputTokens`, `totalTokens`, `schemaVersion`, `status="stubbed"`.
- Behavior: zeros/omitted; no costs in P-1.
- Aggregation later: sum per-message to run totals.
- Phase-2: populate from adapters; flip `status="live"`.
