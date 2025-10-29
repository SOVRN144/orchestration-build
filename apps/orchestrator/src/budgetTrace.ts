export type BudgetStatus = 'stubbed' | 'computed' | 'final' | 'error';

export interface BudgetTrace {
  schemaVersion: '1.0.0';
  provider: string;
  model: string;
  timestamp: string;
  turnId: string;
  runId: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  status: BudgetStatus;
}

export function createStubBudgetTrace(init: Partial<BudgetTrace> = {}): BudgetTrace {
  const timestamp = init.timestamp ?? new Date().toISOString();
  const toNonNegInt = (value: unknown) => {
    const numeric = typeof value === 'number' ? value : value === undefined ? 0 : Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.max(0, Math.trunc(numeric));
  };
  const inputTokens = toNonNegInt(init.inputTokens);
  const outputTokens = toNonNegInt(init.outputTokens);

  return {
    schemaVersion: '1.0.0',
    provider: init.provider ?? 'stub',
    model: init.model ?? 'unknown',
    timestamp,
    turnId: init.turnId ?? 'turn_local_1',
    runId: init.runId ?? 'run_local_001',
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    status: init.status ?? 'stubbed',
  };
}
