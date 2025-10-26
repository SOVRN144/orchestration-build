#!/usr/bin/env node
/**
 * Phase Research Checker
 * Usage:
 *   node tools/research/checkPhase.mjs 6
 *   npm run research:phase -- 0.5
 */
import fs from 'fs';
import path from 'path';
import process from 'process';

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node tools/research/checkPhase.mjs <phase>, e.g., 0 | 0.5 | 6');
  process.exit(2);
}

const root = process.cwd();
const missionJsonCandidates = [
  path.join(root, 'research_missions.json'),
  path.join(root, 'docs', 'research', 'research_missions.json')
];

let missionsDoc = null;
for (const p of missionJsonCandidates) {
  if (fs.existsSync(p)) {
    missionsDoc = JSON.parse(fs.readFileSync(p, 'utf8'));
    break;
  }
}
if (!missionsDoc) {
  console.error('research_missions.json not found. Place it at repo root or docs/research/.');
  process.exit(2);
}

const missions = missionsDoc.missions || [];
const selected = missions.filter(m => String(m.phase) === String(arg));
if (selected.length === 0) {
  console.error(`No missions found for phase "${arg}".`);
  process.exit(2);
}

let failures = 0;
console.log(`\nChecking Phase ${arg} — ${selected.length} mission(s)\n`);

function normalizePath(saveTo) {
  const rel = saveTo.replace(/^\/+/, '');
  return path.join(root, rel);
}

function validateEntry(entry) {
  const required = ['source_url', 'source_title', 'last_updated_date'];
  const missing = required.filter(k => !(k in entry) || entry[k] === '');
  const hasAnswersOrCaps = ('answers' in entry && Object.keys(entry.answers || {}).length > 0)
    || ('capabilities' in entry && Array.isArray(entry.capabilities) && entry.capabilities.length > 0);
  return { missing, hasAnswersOrCaps };
}

for (const m of selected) {
  const target = normalizePath(m.save_to);
  let ok = true;
  let note = '';

  if (!fs.existsSync(target)) {
    ok = false;
    note = 'file missing';
  } else {
    try {
      const raw = fs.readFileSync(target, 'utf8').trim();
      const data = JSON.parse(raw);
      const items = Array.isArray(data) ? data : [data];
      let localFails = 0;
      for (const it of items) {
        const v = validateEntry(it);
        if (v.missing.length > 0 || !v.hasAnswersOrCaps) {
          localFails++;
        }
      }
      if (localFails > 0) {
        ok = false;
        note = `validation failed for ${localFails}/${items.length} entr${items.length>1?'ies':'y'}`;
      } else {
        note = `ok — ${items.length} source${items.length>1?'s':''}`;
      }
    } catch (e) {
      ok = false;
      note = `invalid JSON (${e.message})`;
    }
  }

  if (!ok) failures++;
  console.log(`${ok ? '✅' : '❌'} ${m.title} \n   ↳ ${m.save_to} — ${note}`);
}

if (failures > 0) {
  console.error(`\nPhase ${arg} FAILED: ${failures} mission(s) incomplete.\n`);
  process.exit(1);
} else {
  console.log(`\nPhase ${arg} PASSED: all missions complete.\n`);
  process.exit(0);
}
