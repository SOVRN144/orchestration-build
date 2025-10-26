#!/usr/bin/env node
/**
 * budget:dry — aggregates turn costs and enforces MAX_USD.
 * Usage:
 *   node tools/budget/runBudgetDry.mjs tools/budget/samples/usage.example.json
 * Env:
 *   MAX_USD=5.5 (override file)
 *   EXRATE_ZAR_PER_USD=18.0 (optional; prints ZAR)
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const file = process.argv[2] || 'tools/budget/samples/usage.example.json';
if (!fs.existsSync(file)) {
  console.error('Usage file not found:', file);
  process.exit(1);
}
const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
const maxUsd = process.env.MAX_USD ? Number(process.env.MAX_USD) : Number(cfg.max_usd || 5.5);
const exrate = process.env.EXRATE_ZAR_PER_USD ? Number(process.env.EXRATE_ZAR_PER_USD) : null;

let total = 0;
const breakdown = [];

for (const t of cfg.turns) {
  const args = ['tools/budget/estimator.mjs', '--provider', t.provider, '--model', t.model, '--input', String(t.input||0), '--output', String(t.output||0)];
  if (t.provider === 'openai') {
    if (t.cached_input) { args.push('--cached-input', String(t.cached_input)); }
    if (t.batch) { args.push('--batch'); }
  }
  if (t.provider === 'anthropic') {
    if (t.anth_cache_create) { args.push('--anth-cache-create', String(t.anth_cache_create)); }
    if (t.anth_cache_window) { args.push('--anth-cache-window', String(t.anth_cache_window)); }
    if (t.anth_cache_read) { args.push('--anth-cache-read', String(t.anth_cache_read)); }
  }
  const p = spawnSync('node', args, { encoding: 'utf-8' });
  if (p.status !== 0) {
    console.error('Estimator failed:', p.stderr || p.stdout);
    process.exit(1);
  }
  const res = JSON.parse(p.stdout);
  breakdown.push(res);
  total += res.total_usd;
  if (total > maxUsd) {
    console.log(JSON.stringify({ status: 'ABORT', reason: 'MAX_USD exceeded', max_usd: maxUsd, total_usd: Number(total.toFixed(6)), breakdown }, null, 2));
    process.exit(0);
  }
}

const out = { status: 'OK', total_usd: Number(total.toFixed(6)), breakdown };
if (exrate) out.total_zar = Number((total * exrate).toFixed(2));
console.log(JSON.stringify(out, null, 2));
