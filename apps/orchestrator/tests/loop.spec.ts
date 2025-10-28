import { describe, it, expect } from 'vitest';
import { isNoImprovement } from '../src/loop/isNoImprovement';

describe('loop primitive (stagnation)', () => {
  it('no stagnation on first turn', () => {
    expect(isNoImprovement(null, 'diff', 1)).toBe(false);
  });

  it('stagnation on identical diffs after turn 1', () => {
    expect(isNoImprovement('X', 'X', 2)).toBe(true);
  });

  it('improvement detected when diffs differ', () => {
    expect(isNoImprovement('A', 'B', 2)).toBe(false);
  });
});
