#!/usr/bin/env node
import { createStubBudgetTrace } from '../budgetTrace';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.split('=');
    return [key.replace(/^--/, ''), value ?? ''];
  })
);

const trace = createStubBudgetTrace({ turnId: args.turnId, runId: args.runId });
process.stdout.write(`${JSON.stringify(trace)}\n`);
process.exit(0);
