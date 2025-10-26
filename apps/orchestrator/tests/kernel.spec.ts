import { describe, it, expect } from 'vitest';
import { runMockLoop } from '../src/kernel';

describe('runMockLoop', () => {
  it('converges within 3 turns for README task', async () => {
    const res = await runMockLoop('add a README section', 3);
    expect(res.status).toBe('CONVERGED');
    expect(res.turns).toBeLessThanOrEqual(3);
    expect(res.diff).toContain('README.md');
  });
});
