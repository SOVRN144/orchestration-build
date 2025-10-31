# Budget Trace Schema v1.0.0

## Overview

The `BudgetTrace` schema tracks token usage and costs across all LLM provider interactions. Phase 1 uses stubbed values; Phase 2+ will populate from real provider responses.

## Phase 1 Schema (Stubbed)

```typescript
interface BudgetTrace {
  schemaVersion: '1.0.0';
  provider: string;        // 'stub' (Phase 1) | 'anthropic' | 'openai' (Phase 2+)
  model: string;           // 'unknown' (Phase 1) | actual model ID (Phase 2+)
  timestamp: string;       // ISO 8601 UTC
  turnId: string;          // Conversation turn identifier
  runId: string;           // Execution run identifier
  inputTokens: number;     // ≥0, prompt tokens
  outputTokens: number;    // ≥0, completion tokens
  totalTokens: number;     // inputTokens + outputTokens
  status: BudgetStatus;    // 'stubbed' | 'computed' | 'final' | 'error'
}

type BudgetStatus = 'stubbed' | 'computed' | 'final' | 'error';
```

### Example (Phase 1)

```json
{
  "schemaVersion": "1.0.0",
  "provider": "stub",
  "model": "unknown",
  "timestamp": "2025-10-30T17:04:55.745Z",
  "turnId": "turn_local_1",
  "runId": "run_local_001",
  "inputTokens": 0,
  "outputTokens": 0,
  "totalTokens": 0,
  "status": "stubbed"
}
```

### CLI Usage

```bash
# Phase 1: Stubbed trace with custom tokens
npm run poc:budget -- --turnId=turn_42 --inputTokens=100 --outputTokens=50

# Output:
# {"schemaVersion":"1.0.0","provider":"stub","model":"unknown",
#  "timestamp":"2025-10-30T...","turnId":"turn_42","runId":"run_local_001",
#  "inputTokens":100,"outputTokens":50,"totalTokens":150,"status":"stubbed"}
```

### Migration to Phase 2

Changes when real providers are integrated:

1. **Provider & Model**
   - Populated from adapter response (e.g., `provider: "anthropic"`, `model: "claude-3-5-sonnet-20241022"`)
2. **Status Transitions**
   - `stubbed` → `computed` when real provider returns token counts
   - `computed` → `final` after verification/reconciliation (Phase 4)
   - `error` if provider call fails or tokens unavailable
3. **Extended Fields (Phase 4)**
   - `cacheMetrics`: `{cacheCreationInputTokens, cacheReadInputTokens, cachedTokens}`
   - `costMicros`: Cost in micros (1 millionth of currency unit)
   - `currency`: "USD", "EUR", etc.
   - `reasoningTokens`: For extended thinking models (Claude, o1)

### Implementation

- Location: `apps/orchestrator/src/budgetTrace.ts`
- Factory Function: `createStubBudgetTrace(init?: Partial<BudgetTrace>): BudgetTrace`
- Validation:
  - `inputTokens` and `outputTokens` coerced to non-negative integers
  - `totalTokens` automatically computed as sum
  - `timestamp` defaults to `new Date().toISOString()`

### Testing

- Deterministic Tests: `apps/orchestrator/tests/budgetTrace.spec.ts` (coming in Phase 2)

Manual Verification:

```bash
npm run poc:budget -- --inputTokens=100 --outputTokens=50 | jq '.totalTokens'
# Expected: 150
```

### Schema Versioning

- Current: 1.0.0 (Phase 1, stubbed)
- Breaking changes require major version bump
- Backward compatibility maintained within major version
- Migration guide provided for version transitions
