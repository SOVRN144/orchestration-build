# GitHub App Least-Privilege & Required Checks
Updated: 2025-10-25 (TZ: Africa/Johannesburg)

## Minimal repository permissions (GitHub App)
Use **Checks API** (modern) OR **Commit Statuses API** (legacy). Prefer **Checks**.

- **Contents: write** — create branches, push commits, read repo contents
- **Pull requests: write** — open/update PRs
- **Checks: write** — create/read check runs (if using Checks API)
- **Commit statuses: write** — alternative if using Status API (legacy)
- **Metadata: read** — implicit for repo metadata

> Scope the installation to **Only select repositories**.

## Enforce required checks on protected branches
**UI**
1. *Settings → Branches → Add rule* (e.g., `main`)
2. Enable **Require status checks to pass before merging**
3. (Recommended) Enable **Require branches to be up to date**
4. Pick check names once they appear at least once on the PR

**REST**
```
PUT /repos/{owner}/{repo}/branches/{branch}/protection
{
  "required_status_checks": {
    "strict": true,
    "checks": [
      { "context": "CodeRabbit", "app_id": -1 },
      { "context": "Copilot Code Review", "app_id": -1 }
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1
  },
  "restrictions": null
}
```

**GraphQL**
- `branchProtectionRule` → set `requiredStatusChecks` and `requiresApprovingReviews`

## Discovering exact check names / app IDs
1. Trigger both tools on a test PR.
2. List check runs for the head SHA:
   - `GET /repos/{owner}/{repo}/commits/{ref}/check-runs`
3. Use each run’s `name` as the **context** (case-sensitive) and `app.id` if you want strict binding.

**Common names (verify via API in your org)**
- CodeRabbit: `CodeRabbit` / `coderabbit` / `coderabbit/review`
- Copilot Code Review: `Copilot Code Review` / `copilot-code-review`

## Rate limits and tokens (for automation)
- GitHub App installation tokens **expire after ~1 hour** — refresh per job
- REST rate-limit baseline **5000 req/hour** per installation; scales with org size

## Rationale: App vs PAT
- **Fine-grained** perms, **repo-scoped**, **short-lived** tokens, **first-class audit**, and **per-install revocation**
- Safer than user-scoped PATs (broad, long-lived, hard to audit)

---

### Smoke test for 0B
- Run `npm run policy:branch:dry` to print your branch-protection payload using env vars:
  - `REPO_OWNER`, `REPO_NAME`, `PROTECTED_BRANCH` (e.g., `main`)
  - `CHECKS` = CSV of contexts (e.g., `"CodeRabbit: -1, Copilot Code Review: -1"`)
- Validate the contexts match what you see in `GET .../check-runs` on a sample PR.
