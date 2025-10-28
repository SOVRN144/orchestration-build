import { describe, it, expect } from 'vitest';
import { assertValidMessage, validateMessage } from '../src/schema/validate';

describe('message.schema', () => {
  it('valid minimal message passes', () => {
    const ok = validateMessage({ role: 'architect', type: 'propose', content: 'x', turn: 1 });
    expect(ok).toBe(true);
  });

  it('extra property fails', () => {
    expect(() =>
      assertValidMessage({
        role: 'builder',
        type: 'verify',
        content: 'y',
        turn: 2,
        extra: true,
      })
    ).toThrow(/MESSAGE_SCHEMA_VALIDATION_FAILED/);
  });

  it('missing required fails', () => {
    expect(() => assertValidMessage({ role: 'architect', type: 'critique', turn: 1 })).toThrow(
      /MESSAGE_SCHEMA_VALIDATION_FAILED/
    );
  });
});
