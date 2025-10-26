#!/usr/bin/env node
/**
 * policy:secrets:dry — prints the secrets plan by environment.
 * Env: ENV=dev|staging|prod (default dev)
 */
const env = process.env.ENV || 'dev';
const plan = {
  dev: {
    role: 'ci-dev-role',
    ssmPath: '/app/dev/*',
    secrets: ['app/dev/*'],
    rotation: '90d (SSM config); SecretsManager as needed'
  },
  staging: {
    role: 'ci-staging-role',
    ssmPath: '/app/staging/*',
    secrets: ['app/staging/*'],
    rotation: '60d; DB secrets managed rotation'
  },
  prod: {
    role: 'ci-prod-role',
    ssmPath: '/app/prod/*',
    secrets: ['app/prod/*'],
    rotation: '30d; managed rotation required; approvals before role use'
  }
}[env];

console.log('=== Secrets Plan (Dry) — %s ===', env);
console.log(JSON.stringify(plan, null, 2));
