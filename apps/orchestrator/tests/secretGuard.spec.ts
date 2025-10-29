import { describe, it, expect } from 'vitest';
import { assertNoRealSecrets, guardArgs } from '../src/security/secretGuard';

describe('secretGuard', () => {
  it('allows obvious fakes', () => {
    expect(() => assertNoRealSecrets({ token: 'sk_test_example_123' })).not.toThrow();
  });

  it('flags likely real creds', () => {
    const ghpToken = 'ghp_' + ['123456', '7890ab', 'cdef12', '345678', '90abcd', 'ef1234'].join('');
    expect(() => assertNoRealSecrets({ token: ghpToken })).toThrow(/GitHub token/);
  });

  it('guardArgs blocks before sink', () => {
    const sink = (value: unknown) => JSON.stringify(value).length;
    const header = ['eyJhbGciOiJI', 'UzI1NiIsInR5cCI6IkpXVCJ9'].join('');
    const payload = [
      'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9l',
      'IiwiaWF0IjoxNTE2MjM5MDIyfQ',
    ].join('');
    const signature = ['SflKxwRJSMeKKF2QT4fwpMeJf36POk6y', 'JV_adQssw5c'].join('');
    const jwt = [header, payload, signature].join('.');
    expect(() => guardArgs(sink, { jwt })).toThrow(/JWT/);
  });
});
