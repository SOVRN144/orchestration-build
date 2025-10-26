# ADR-0001 — Orchestrator North‑Star & Guardrails
Date: 2025-10-25  (TZ: Africa/Johannesburg)
Status: Proposed
Owner: S⨀VRN (Lyra Orchestrator)

## 1) Decision
Stand up a two‑agent orchestration PoC with **Architect = Claude Sonnet 4.5** and **Builder = OpenAI GPT (4o‑mini→4o→GPT‑5 Thinking as needed)**.
Enforce least‑privilege GitHub automation, strict cost ceilings, and default **no‑training** data posture. Use CodeRabbit + Copilot Code Review as merge gates.

### North‑Star metric (PoC)
**From prompt to open PR ≤ 30 minutes at ≤ R100 (~$5.5) total model spend**, with ≤1 re‑work cycle after bot reviews.

---

## 2) Provider selection (from Phase 0A research)
**OpenAI (API)**
- Pricing (examples): 4o‑mini ≈ $0.075/M input, $0.30/M output; 4o higher; o1 higher; GPT‑5 Thinking listed in research.  
- Context: up to ~128k (model‑dependent).  
- Limits: tiered RPM/TPM; token‑bucket; Batch API.  
- Compliance: API data **not** used for training by default; **30‑day** abuse‑monitoring logs; **Zero‑Data‑Retention (ZDR)** available. Regional endpoints incl. **US/EU**.
- Capabilities: tool/function calling, JSON mode, streaming, structured outputs.

**Anthropic (Claude)**
- Pricing (examples): Haiku low, **Sonnet 3.5/4.5 mid**, Opus high; long‑context priced separately.  
- Context: 200k standard; **1M context** for select/beta models.  
- Limits: tiered RPM/TPM; token‑bucket; **prompt caching** & **Batch**.  
- Compliance: API/commercial data **not** used for training by default; ~30‑day logs. Regional routing via **AWS Bedrock / GCP Vertex** if required.
- Capabilities: tool‑use, JSON, streaming, structured outputs, vision.

**GitHub Copilot Code Review**
- Pricing: seat‑based (Pro/Business/Enterprise). **Premium request quota** (e.g., Pro ≈ 300/mo).  
- Trigger: auto on PR or manual `@copilot review`.  
- Compliance: Business/Enterprise **not used for training**; Pro/Free have data controls.

**CodeRabbit**
- Pricing: seat‑based (Lite/Pro/Enterprise). Rate limits per dev/repo/hr (e.g., Pro **5 reviews/hr**, **400 files/hr**).  
- Trigger: auto on PR/commits or manual `@coderabbitai review`.  
- Compliance: not used for training (commercial/API); SOC2/GDPR notes.

> Sources: see Phase 0A JSON artifact. Use provider docs as source of truth for precise figures.
 
---

## 3) Guardrails & Budgets
- **Per‑run cap:** ≤ R100 (≈ $5.5) — hard stop with graceful summary.  
- **Per‑turn soft caps:** Architect ≤ 12k input / 3k output; Builder ≤ 25k input / 8k output (escalate to higher‑tier model only on rubric triggers).  
- **Routing policy:** default **Builder=4o‑mini**, escalate to **4o** then **GPT‑5 Thinking** on “complexity ≥ high” or “security‑critical”. Architect stays on **Claude Sonnet 4.5**.  
- **Batch/Prompt caching:** enable where available; prefer cached prompts for plan/critique loops.  
- **Region:** default US; switch to **EU endpoints** when compliance requires regional processing. Consider Bedrock/Vertex for strict residency.

---

## 4) Repo & Reviews
- **Branch protection:** require **CodeRabbit** and **Copilot Code Review** checks + 1 human approval before merge.  
- **Provenance footer** in PR body: model versions, prompt hashes, retrieved files, token/cost totals.  
- **Least‑privilege GitHub App**: scopes for contents, pulls, checks; no admin permissions.

---

## 5) Secrets & Data
- **Secrets store:** 1Password/Doppler/SSM; inject via GitHub Actions OIDC; **no static PATs** in repo.  
- **Rotation:** 90‑day rotation cadence; ephemeral tokens for dev.  
- **Data policy:** keep logs; redact PII; default 30‑day retention; prefer ZDR where supported.

---

## 6) Smoke test for Phase 0
- This ADR present and committed as `/docs/ADR-0001-orchestration-goals.md`.  
- `npm run plan:dry` prints the debate loop, budgets, routes, and exits **without** any API calls.

---

## 7) Risks & Mitigations
- **Cost drift:** hard per‑run cap + token estimators + cache.  
- **Model drift:** pin model IDs; emit provenance.  
- **Compliance drift:** isolate regions; switch to Bedrock/Vertex if residency is mandated.

---

## 8) Open Questions (to track)
- Confirm exact **rpm/tpm** per chosen tiers at time of rollout.  
- Whether to standardize on **EU routing** by default for future compliance.  
- Final choice of secrets platform (SSM vs 1Password vs Doppler).


**Reference:** See `docs/policies/github-app-least-privilege.md` for exact permissions and branch protection payloads.


## Compliance reference
See `docs/policies/data-terms-residency.md` and `docs/policies/provider-compliance.json` for Phase 0C decisions.
