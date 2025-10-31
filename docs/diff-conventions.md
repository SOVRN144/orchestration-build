# Diff Conventions v1.0.0

## Overview

The orchestrator produces **unified diffs** as the primary output of the two-agent debate loop. Phase 1 uses stubbed git-style diffs; Phase 2+ will integrate with real provider-generated patches.

## Phase 1 Format (Stubbed)

### Unified Diff Structure

```
diff --git a/FILE b/FILE
+ LINE1
+ LINE2
+ LINE3
```

**Characteristics:**
- Git-style header: `diff --git a/FILE b/FILE`
- Additions only (no deletions or modifications in Phase 1 mocks)
- Lines prefixed with `+ ` for additions
- No context lines (stubbed implementation)
- Single file target (README.md in Phase 1)

### Example (Phase 1)

```
diff --git a/README.md b/README.md
+ ## add a README section
+ - [x] Added context
+ - [x] Acceptance checklist
```

### CLI Contract

The `pocMock.ts` CLI follows this output contract:

1. **Print diff** (or `(no diff)` if empty)
2. **Print status** (`CONVERGED` | `FAILED`)
3. **Exit code** (0 for CONVERGED, 1 for FAILED)

**Example:**
```bash
$ npm run smoke:p1

diff --git a/README.md b/README.md
+ ## add a README section
+ - [x] Added context
+ - [x] Acceptance checklist

CONVERGED
```

## Implementation

### Phase 1 Components

**Builder Mock** (`apps/orchestrator/src/agents/builder.mock.ts:8-13`):
```typescript
let diff = `diff --git a/README.md b/README.md\n`;
if (critique && critique.includes('missing acceptance checklist')) {
  diff += `+ ## ${task}\n+ - [x] Added context\n+ - [x] Acceptance checklist\n`;
} else {
  diff += `+ ## ${task}\n+ - [ ] Added context\n+ - [ ] Acceptance checklist\n`;
}
```

**Kernel Loop** (`apps/orchestrator/src/kernel.ts:29`):
- Extracts `diff` from builder's `implement()` return value
- Passes diff to architect's `critique()` and `verify()` methods
- Returns final diff in `DebateResult`

**CLI Output** (`apps/orchestrator/src/cli/pocMock.ts:20-21`):
```typescript
console.log(result.diff || '(no diff)');
console.log(result.status);
```

## Migration to Phase 2

When real provider adapters are integrated:

### Changes

1. **Diff Generation**
   - Phase 1: Builder mock produces hardcoded git-style additions
   - Phase 2+: Provider adapters (Anthropic/OpenAI) generate real diffs from LLM responses
   - Format remains unified diff (backward compatible)

2. **Diff Complexity**
   - Phase 1: Additions only, single file
   - Phase 2+: Multi-file diffs with additions, deletions, modifications
   - Context lines (3-line default)
   - Hunk headers with line numbers

3. **File Operations**
   - Phase 2: Real file reads/writes
   - Git integration for actual patch application
   - Conflict detection and resolution

### Extended Format (Phase 2+)

```diff
diff --git a/src/foo.ts b/src/foo.ts
index 1234567..abcdefg 100644
--- a/src/foo.ts
+++ b/src/foo.ts
@@ -10,6 +10,8 @@ export function foo() {
   const x = 1;
   const y = 2;
+  // New logic
+  const z = 3;
   return x + y;
 }
```

**New Fields:**
- Index hashes
- File mode
- Hunk headers (`@@ -L,N +L,N @@`)
- Context lines (unchanged lines for positioning)
- Deletions prefixed with `-`

### Provider Integration (Phase 2+)

**Anthropic Adapter:**
- Extract code blocks from Claude's responses
- Generate diffs using `git diff` or diff library
- Validate syntax before returning to kernel

**OpenAI Adapter:**
- Parse GPT responses for code changes
- Map to unified diff format
- Handle multi-turn code evolution

## Validation Rules

### Phase 1 Requirements

- ✅ Must start with `diff --git a/` header
- ✅ Additions prefixed with `+ `
- ✅ Newline-terminated lines
- ✅ Non-empty for CONVERGED status

### Phase 2+ Requirements

- Valid unified diff syntax
- Parseable by `git apply` or `patch` command
- File paths relative to repo root
- Hunks apply cleanly to target files
- No binary diffs (text only)

## Testing

### Smoke Test Verification

```bash
# Phase 1: Stubbed diff with CONVERGED status
npm run smoke:p1

# Expected output:
# diff --git a/README.md b/README.md
# + ## add a README section
# + - [x] Added context
# + - [x] Acceptance checklist
#
# CONVERGED

echo $?  # Expected: 0
```

### Unit Tests

**Loop Tests** (`apps/orchestrator/tests/loop.spec.ts`):
- Verifies diff presence in CONVERGED result
- Checks diff updates between turns
- Validates NO_IMPROVEMENT detection (identical diffs)

**Builder Tests** (`apps/orchestrator/tests/kernel.spec.ts`):
- Mock builder produces valid git header
- Critique changes reflected in subsequent diffs
- Checklist completion tracked via diff content

## Diff Evolution Tracking

### Convergence Signal

The architect's `verify()` function inspects the diff to determine convergence:

```typescript
// apps/orchestrator/src/agents/architect.mock.ts:30
const ok = diff.includes('[x]');
return ok ? 'Verified: meets scope & checklist.' : 'Verification failed.';
```

**Phase 1 Signal:** Presence of `[x]` indicates complete checklist
**Phase 2+ Signal:** Semantic analysis of diff quality, test coverage, style compliance

### Stagnation Detection

The kernel tracks `prevDiff` and compares to current diff each turn:

```typescript
// apps/orchestrator/src/kernel.ts:34
if (isNoImprovement(prevDiff, diff, turn)) {
  return { status: 'FAILED', reason: 'NO_IMPROVEMENT', ... };
}
```

**Detection:** Exact string match between consecutive diffs signals loop stagnation

## Format Versioning

- **Current:** 1.0.0 (Phase 1, stubbed git-style additions)
- **Breaking Changes:** Major version bump required
- **Backward Compatibility:** Phase 2+ must parse Phase 1 format
- **Migration Guide:** Provided when format transitions occur

## References

### Unified Diff Format
- Standard: POSIX diff -u
- Git variant: `git diff` documentation
- Parsing libraries: `diff` (npm), `unified` (npm)

### Phase 1 Implementation
- Builder mock: `apps/orchestrator/src/agents/builder.mock.ts:3-26`
- Kernel loop: `apps/orchestrator/src/kernel.ts:8-49`
- CLI output: `apps/orchestrator/src/cli/pocMock.ts:1-37`

### Related Documentation
- Loop convergence: Phase 1 plan.pdf, section 5
- Message schema: `docs/architecture/phase-1-plan.md`
- Budget trace: `docs/budget-trace-schema.md`
