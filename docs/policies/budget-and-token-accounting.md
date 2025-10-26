# Budget Caps & Token Accounting — Phase 0E
Updated: 2025-10-25 (TZ: Africa/Johannesburg)

This document encodes the Phase 0E research and how the orchestrator enforces **hard budget caps** and accurate **token-based costing**.

## Provider facts (from your 0E research)
**OpenAI**
- Usage fields: `response.usage.{prompt_tokens, completion_tokens, total_tokens}` (+ fields for cached/reasoning tokens if present).
- Headers: `x-ratelimit-*` (remaining requests/tokens, reset).
- Cost: `(input_tokens × input_rate + output_tokens × output_rate)/1e6`.
- Discounts: **Cached input tokens ~50%**, **Batch API ~50%** (both sides).

**Anthropic**
- Usage fields: `usage.{input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens}`.
- No rate-limit headers (dashboard only).
- Cost: base rates; **cache creation** multiplier (≈**1.25×** 5min, **2.0×** 1h); **cache read** ≈ **0.1×**.
- No Batch API; use Messages/Message Batches semantics as applicable.

**Gotchas**
- Tool/function-calling arguments and JSON outputs are **billable tokens**.
- Cached tokens reduce **cost** but still **count** toward TPM; throughput limits still apply.
- Streaming often omits `usage` until final event; aggregate on completion.
- Multi-turn: full history influences token count; summarize/context-manage.
- Retries consume budget; account for failed attempts.

## Orchestrator rules
- **Per-run hard cap:** `MAX_USD` (default 5.50 ≈ R100). Abort gracefully once estimated total exceeds cap.
- **Per-step token caps:** enforce model-specific ceilings; escalate (or refuse) when exceeded.
- **Estimator-of-record:** prefer provider `usage` fields; fall back to static estimators only when streaming without final usage.
- **Caching & batch flags:** pass flags into estimator for correct pricing.
- **Telemetry:** log per-turn `usage` + computed `cost_usd`; PR provenance includes totals.

See `tools/budget/ratecards.json` and `tools/budget/estimator.mjs`.
