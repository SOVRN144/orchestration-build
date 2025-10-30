import { describe, it, expect } from 'vitest';
import { createStubBudgetTrace } from '../src/budgetTrace';

describe('BudgetTrace (Phase-1 minimal)', () => {
  it('emits zeros with stubbed status', () => {
    const trace = createStubBudgetTrace();
    expect(trace).toEqual({
      schemaVersion: '1.0.0',
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      status: 'stubbed',
    });
  });

  it('computes totals deterministically', () => {
    const trace = createStubBudgetTrace({ inputTokens: 3, outputTokens: 7 });
    expect(trace.totalTokens).toBe(10);
    expect(trace.status).toBe('stubbed');
  });
});
