#!/usr/bin/env node
/**
 * policy:branch:dry — prints a branch protection payload using env vars.
 * Env:
 *   REPO_OWNER, REPO_NAME, PROTECTED_BRANCH (default: main)
 *   CHECKS='CodeRabbit:-1,Copilot Code Review:-1'  // "context:app_id" pairs
 *   REQUIRE_UP_TO_DATE=true|false (default true)
 *   REQUIRE_HUMAN_REVIEWS=1  // approving review count (default 1)
 */
import process from 'process';

const owner = process.env.REPO_OWNER || 'your-org';
const repo = process.env.REPO_NAME || 'your-repo';
const branch = process.env.PROTECTED_BRANCH || 'main';
const strict = String(process.env.REQUIRE_UP_TO_DATE || 'true') === 'true';
const reviews = Number(process.env.REQUIRE_HUMAN_REVIEWS || 1);

const checksCsv = (process.env.CHECKS || 'CodeRabbit:-1,Copilot Code Review:-1')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function parseChecks(pairs) {
  return pairs.map(p => {
    const [context, appIdRaw] = p.split(':').map(v => v.trim());
    const app_id = Number(appIdRaw);
    return { context, app_id: Number.isFinite(app_id) ? app_id : -1 };
  });
}

const payload = {
  required_status_checks: {
    strict,
    checks: parseChecks(checksCsv)
  },
  enforce_admins: true,
  required_pull_request_reviews: {
    required_approving_review_count: reviews
  },
  restrictions: null
};

console.log('PUT /repos/%s/%s/branches/%s/protection', owner, repo, branch);
console.log(JSON.stringify(payload, null, 2));
console.log('\nNote: set exact check "context" and "app_id" after discovering them via the Checks API.');
