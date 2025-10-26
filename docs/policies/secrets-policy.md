# Secrets & Key Hygiene (Phase 0D)
Updated: 2025-10-25 (TZ: Africa/Johannesburg)

This document captures our current decision **based on the research you provided** (1Password Secrets Automation)
and sets placeholders for Doppler, AWS SSM/Secrets Manager, and HashiCorp Vault once their research arrives.

## Decision (interim)
- **CI/CD (interim)**: Use **1Password Secrets Automation service accounts** to provide build-time secrets in GitHub Actions.
- **Goal state**: Prefer **OIDC-based, short-lived credentials** (AWS SSM/Secrets Manager or Vault OIDC) for CI once research is finalized.
- **Developer workflows**: Continue using 1Password for interactive, local developer secrets.

## 1Password Secrets Automation (from research)
**Auth model:** Service account token (bearer). _OIDC not supported natively for service accounts._  
**Scope:** Per-vault read access; grant only the vault(s) used by the orchestrator.  
**Rotation:** Manual via 1Password UI (now/1h/3d), new token replaces old; audit via Events API (Business plans).  
**Network/Encryption:** Hosted; TLS in transit, AES-256-GCM at rest; no IP allowlisting/VPC/private-link for the SaaS endpoint.  
**GitHub Actions usage:** Inject `OP_SERVICE_ACCOUNT_TOKEN` from GitHub Secrets; use `1password/load-secrets-action@v3` with `op://vault/item/field` references.

> Interim risk: long-lived token in GitHub Encrypted Secrets (rotate every 90 days or when staff changes; scope to CI-only vault).

### GitHub Actions snippet
See `docs/policies/snippets/1password-actions.yml` for a minimal workflow using the 1Password action.

## Placeholders (to fill when research lands)
- **Doppler** — Expect OIDC workflow or service token; project/environment scoping; audit logs; rotation policies.  
- **AWS SSM Parameter Store / AWS Secrets Manager** — **Preferred for OIDC** via GitHub Actions → AWS IAM role (assume-role-with-web-identity), KMS encryption, VPC endpoints, automatic rotation (Secrets Manager).  
- **HashiCorp Vault** — OIDC/JWT auth methods, short-lived tokens, fine-grained policies, audit devices; ideal for private/VPC.

## Rotation & auditing (interim policy)
- **Rotation cadence**: 90 days for `OP_SERVICE_ACCOUNT_TOKEN` (sooner on staff change).  
- **Audit**: Enable 1Password Events API (Business tier) and export monthly summaries.  
- **Scopes**: Only the CI vault; avoid org-wide vault access.  
- **Least privilege**: GitHub App scoped to **selected repos**; workflows guarded by **environments** & reviewer gates before secrets are exposed.

## Acceptance (Phase 0D)
- This doc present.  
- `policy:secrets:dry` prints the active provider and shows the exact GH Actions snippet.  
- When Doppler/AWS/Vault research is ready, update `provider-secrets.json` and switch CI to an OIDC-based provider.

