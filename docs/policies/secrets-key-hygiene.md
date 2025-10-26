# Secrets & Key Hygiene — Phase 0D
Updated: 2025-10-25 (TZ: Africa/Johannesburg)

This document codifies our secrets posture for the orchestrator CI/CD and local dev.

## Decisions
- **CI (GitHub Actions):** Use **OIDC** with short‑lived creds; no long‑lived PATs or static cloud keys.
- **Stores by use‑case:**
  - **AWS SSM Parameter Store** — cheap config (non‑rotating), path‑scoped, KMS‑encrypted.
  - **AWS Secrets Manager** — high‑sensitivity secrets + managed rotation (DB, API tokens).
  - **HashiCorp Vault** (optional) — dynamic secrets (db/aws) with TTL ≤ 1h; audit device enabled.
  - **1Password / Doppler** — developer workflows & local dev; CI prefers AWS (audited + VPC/PrivateLink).
- **Rotation cadence:** 30–90 days for static items; AWS SM managed rotation where supported; Vault dynamic TTL 1h.
- **Audit:** CloudTrail (AWS), Vault audit device, 1Password/Doppler activity logs.
- **Network & encryption:** TLS in transit; KMS CMK for AWS; PrivateLink where available.

## OIDC subject scoping (GitHub → AWS/Vault)
Use `id-token: write` and restrict trust by `sub`:
- Branch runs: `repo:ORG/REPO:ref:refs/heads/<branch>`
- Pull requests: `repo:ORG/REPO:pull_request`
- Environments: `repo:ORG/REPO:environment:<env>`

Verify actual `sub` values in your job logs before finalizing IAM/Vault policies.

## Roles
- `ci-dev-role` → read `/app/dev/*` (SSM) + selected SecretsManager ARNs
- `ci-staging-role` → read `/app/staging/*`
- `ci-prod-role` → read `/app/prod/*` (approval required)

## Rotation
- **AWS SM:** enable rotation for DB secrets; cron 30d/60d; Lambda/managed rotation.
- **Vault:** TTL 1h; renew in long jobs; revoke on job end.
- **SSM configs:** rotate values 90d and emit change tickets.

---

See templates under `templates/github/actions/secrets/` for runnable examples.
