#!/usr/bin/env node
/**
 * Budget estimator — computes USD cost from token usage.
 * Usage examples:
 *   node tools/budget/estimator.mjs --provider openai --model gpt-4o --input 12000 --output 1800
 *   node tools/budget/estimator.mjs --provider openai --model gpt-4o --input 12000 --output 1800 --cached-input 6000 --batch
 *   node tools/budget/estimator.mjs --provider anthropic --model claude-3-5-sonnet --input 12000 --output 1800 --anth-cache-create 2000 --anth-cache-window 5m --anth-cache-read 4000
 */
import fs from 'fs';
import path from 'path';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => {
  if (a.startsWith('--')) {
    const key = a.replace(/^--/, '');
    const val = (i+1 < arr.length && !arr[i+1].startsWith('--')) ? arr[i+1] : true;
    return [key, val];
  }
  return [];
}).filter(Boolean));

const root = process.cwd();
const rcPath = path.join(root, 'tools', 'budget', 'ratecards.json');
if (!fs.existsSync(rcPath)) {
  console.error('Missing tools/budget/ratecards.json');
  process.exit(1);
}
const rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
const provider = String(args.provider || '').toLowerCase();
const model = String(args.model || '');
const input = Number(args.input || 0);
const output = Number(args.output || 0);
const batch = Boolean(args.batch || false);
const cachedInput = Number(args['cached-input'] || 0);

// Anthropic cache flags
const anthCreate = Number(args['anth-cache-create'] || 0);
const anthWindow = String(args['anth-cache-window'] || '5m'); // 5m | 1h
const anthRead = Number(args['anth-cache-read'] || 0);

function costOpenAI() {
  const cfg = rc.openai;
  const m = cfg.models[model];
  if (!m) throw new Error(`Unknown OpenAI model: ${model}`);
  const inRate = m.input_per_million;
  const outRate = m.output_per_million;
  const cachedDisc = cfg.cache_discount_input; // fraction of base price
  const batchDisc = batch ? cfg.batch_discount : 1.0;
  const billIn = Math.max(0, input - cachedInput);
  const baseCost = (billIn * inRate + output * outRate) / 1e6;
  const cachedCost = (cachedInput * inRate * cachedDisc) / 1e6;
  const total = (baseCost + cachedCost) * batchDisc;
  return {
    provider: 'openai', model, input, output, cachedInput, batch,
    breakdown_usd: {
      base_in: (billIn * inRate) / 1e6,
      cached_in: (cachedInput * inRate * cachedDisc) / 1e6,
      out: (output * outRate) / 1e6,
      batch_multiplier: batch ? cfg.batch_discount : 1.0
    },
    total_usd: Number(total.toFixed(6))
  };
}

function costAnthropic() {
  const cfg = rc.anthropic;
  const m = cfg.models[model];
  if (!m) throw new Error(`Unknown Anthropic model: ${model}`);
  const inRate = m.input_per_million;
  const outRate = m.output_per_million;
  const multCreate = cfg.cache_creation_multiplier[anthWindow] || 1.25;
  const discRead = cfg.cache_read_discount_input;

  const normIn = Math.max(0, input - anthCreate - anthRead);
  const baseCost = (normIn * inRate + output * outRate) / 1e6;
  const createCost = (anthCreate * inRate * multCreate) / 1e6;
  const readCost = (anthRead * inRate * discRead) / 1e6;
  const total = baseCost + createCost + readCost;

  return {
    provider: 'anthropic', model, input, output, cache_create: anthCreate, cache_window: anthWindow, cache_read: anthRead,
    breakdown_usd: {
      base_in: (normIn * inRate) / 1e6,
      cache_create_in: (anthCreate * inRate * multCreate) / 1e6,
      cache_read_in: (anthRead * inRate * discRead) / 1e6,
      out: (output * outRate) / 1e6
    },
    total_usd: Number(total.toFixed(6))
  };
}

let result;
if (provider === 'openai') result = costOpenAI();
else if (provider === 'anthropic') result = costAnthropic();
else {
  console.error('Provider must be "openai" or "anthropic"');
  process.exit(1);
}

console.log(JSON.stringify(result, null, 2));
