#!/usr/bin/env node
import { runMockLoop } from '../kernel';

async function main() {
  try {
    const task = process.env.TASK || 'add a README section';
    const maxTurns = parseInt(process.env.MAX_TURNS || '3', 10);

    const result = await runMockLoop(task, maxTurns);

    // Phase 1 contract: print diff, then status; exit 0/1
    console.log(result.diff || '(no diff)');
    console.log(result.status);

    process.exit(result.status === 'CONVERGED' ? 0 : 1);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(String(err));
    }
    process.exit(1);
  }
}

void main();
