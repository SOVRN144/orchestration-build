#!/usr/bin/env node
import { createStubBudgetTrace } from '../budgetTrace';

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (!match) return [arg.replace(/^--/, ''), ''];
    return [match[1], match[2]];
  })
);

const trace = createStubBudgetTrace({ turnId: args.turnId, runId: args.runId });
process.stdout.write(`${JSON.stringify(trace)}\n`);
