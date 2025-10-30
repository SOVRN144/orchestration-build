#!/usr/bin/env node
import { createStubBudgetTrace } from '../budgetTrace';

const trace = createStubBudgetTrace();
process.stdout.write(`${JSON.stringify(trace)}\n`);
