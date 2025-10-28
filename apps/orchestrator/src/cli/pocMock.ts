#!/usr/bin/env node
import { runMockLoop } from '../kernel';
import { ValidationError } from '../schema/validate';

async function main() {
  try {
    const task = process.env.TASK || 'add a README section';
    const DEFAULT_MAX_TURNS = 3;
    const MAX_TURNS_CAP = 10;
    const rawMaxTurns = process.env.MAX_TURNS;
    const parsed = rawMaxTurns ? Number.parseInt(rawMaxTurns, 10) : Number.NaN;
    const maxTurns =
      Number.isFinite(parsed) && Number.isInteger(parsed) && parsed > 0
        ? Math.min(parsed, MAX_TURNS_CAP)
        : DEFAULT_MAX_TURNS;

    const result = await runMockLoop(task, maxTurns);

    // Phase 1 contract: print diff, then status; exit 0/1
    console.log(result.diff || '(no diff)');
    console.log(result.status);

    process.exit(result.status === 'CONVERGED' ? 0 : 1);
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      console.error(err.message);
      console.error('Validation errors:', JSON.stringify(err.errors, null, 2));
    } else if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(String(err));
    }
    process.exit(1);
  }
}

void main();
