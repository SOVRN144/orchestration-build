#!/usr/bin/env node
/**
 * policy:secrets:dry — prints the active secrets provider and GH Actions snippet.
 * Env (optional): ACTIVE=1password|aws_ssm|aws_secrets_manager|vault|doppler
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const cfgPath = path.join(root, 'docs', 'policies', 'provider-secrets.json');
if (!fs.existsSync(cfgPath)) {
  console.error('Missing docs/policies/provider-secrets.json');
  process.exit(1);
}
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const active = process.env.ACTIVE || cfg.active_provider_for_ci;

function readSnippet(name) {
  const p = path.join(root, 'docs', 'policies', 'snippets', name);
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8');
  return '# snippet not found';
}

const out = {
  active_provider_for_ci: active,
  details: cfg.providers[active] || {},
  snippet: active === '1password'
    ? readSnippet('1password-actions.yml')
    : '# Add snippets for doppler/aws/vault when research lands'
};

console.log('=== Secrets Provider (Dry) ===');
console.log(JSON.stringify(out, null, 2));
