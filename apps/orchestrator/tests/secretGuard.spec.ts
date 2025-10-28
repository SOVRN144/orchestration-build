import { describe, it, expect } from 'vitest';
import { assertNoRealSecrets, guardArgs } from '../src/security/secretGuard';

describe('secretGuard', () => {
  it('allows obvious fakes', () => {
    expect(() => assertNoRealSecrets({ token: 'sk_test_example_123' })).not.toThrow();
  });

  it('flags likely real creds', () => {
    expect(() =>
      assertNoRealSecrets({ token: 'ghp_1234567890abcdef1234567890abcdef1234' })
    ).toThrow(/GitHub token/);
  });

  it('guardArgs blocks before sink', () => {
    const sink = (value: unknown) => JSON.stringify(value).length;
    expect(() => guardArgs(sink, { jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.bad.sig' })).toThrow(
      /JWT/
    );
  });
});
