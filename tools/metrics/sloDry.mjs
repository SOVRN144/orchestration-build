#!/usr/bin/env node
/**
 * metrics:slo:dry — prints Phase 0F SLO targets for dashboards.
 */
import fs from 'fs';
const path = 'docs/metrics/p0f-slo.json';
if (!fs.existsSync(path)) {
  console.error('Missing docs/metrics/p0f-slo.json');
  process.exit(1);
}
const slo = JSON.parse(fs.readFileSync(path, 'utf8'));
console.log(JSON.stringify({ status: 'OK', slo }, null, 2));
