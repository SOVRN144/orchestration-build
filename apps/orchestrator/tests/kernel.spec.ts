import { describe, it, expect } from 'vitest';
import { runMockLoop } from '../src/kernel';

describe('runMockLoop', () => {
  it('converges within 3 turns for README task', async () => {
    const res = await runMockLoop('add a README section', 3);
    expect(res.status).toBe('CONVERGED');
    expect(res.turns).toBeLessThanOrEqual(3);
    expect(res.diff).toContain('README.md');
  });

  it('produces unchecked checklist before critique feedback', async () => {
    const res = await runMockLoop('add a README section', 1);
    expect(res.status).toBe('FAILED');
    expect(res.diff).toContain('- [ ] Added context');
    expect(res.diff).toContain('- [ ] Acceptance checklist');
  });
});
