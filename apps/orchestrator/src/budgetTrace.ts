export type BudgetStatus = 'stubbed';

export interface BudgetTrace {
  schemaVersion: '1.0.0';
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  status: BudgetStatus;
}

export function createStubBudgetTrace(init: Partial<BudgetTrace> = {}): BudgetTrace {
  const inputTokens = init.inputTokens ?? 0;
  const outputTokens = init.outputTokens ?? 0;
  return {
    schemaVersion: '1.0.0',
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    status: 'stubbed',
  };
}
