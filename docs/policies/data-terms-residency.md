# Data Terms, IP Ownership & Residency — Provider Policy
Updated: 2025-10-25 (TZ: Africa/Johannesburg)

This document codifies our Phase 0C findings and the posture we adopt for the orchestrator.

---

## OpenAI (API)
- **IP & Ownership:** Customer owns Input/Output; OpenAI assigns Output rights to customer.
- **Training Defaults:** API data **not used for training** unless **explicit opt-in**.
- **Retention:** **30-day** abuse-monitoring logs by default; **Zero Data Retention (ZDR)** and **Modified Abuse Monitoring** available with approval.
- **Residency/Routing:** US & **EU endpoints**; additional regions for **storage** only. Cloud options via **Azure OpenAI** / **AWS Bedrock**.
- **DPA/SCCs:** DPA available; SCCs included. Subprocessors published.

## Anthropic (Claude API)
- **IP & Ownership:** Customer owns Input/Output; assignment to customer.
- **Training Defaults:** **API/commercial data not used** for training by default; opt-in via programs only.
- **Retention:** ~**30 days** logs default; **Zero Data Retention** available for API.
- **Residency/Routing:** Direct API primarily US; regional routing via **AWS Bedrock** and **Google Vertex AI** (US/EU/APAC).
- **DPA/SCCs & Certs:** DPA w/ EU/UK/Swiss SCCs; **SOC 2 Type II**, **ISO 27001/42001**; HIPAA configurable.

## GitHub Copilot Code Review
- **Ownership:** Customer retains ownership of code/suggestions (subject to GitHub terms).
- **Training/Retention (Business/Enterprise):** **No prompts/suggestions retained**; **no training** on customer data (not enable‑able). Telemetry metadata—limited retention (~28 days for custom models).
- **Residency:** Global Microsoft/GitHub infra; models may include OpenAI/Anthropic/Google (admin can restrict to GitHub models only).
- **DPA/SCCs:** GitHub DPA with SCCs; trust/compliance via Microsoft.

## CodeRabbit
- **Ownership:** Customer retains code; processes as service provider under DPA.
- **Training/Retention:** **No training** on customer code; review content held in memory then discarded; **embeddings may persist** for review improvement (**opt‑out available**).
- **Residency:** Not explicitly published; appears global.
- **DPA/Certs:** DPA available; **SOC 2 Type II**; GDPR compliant.

> South Africa: no provider documents ZA‑specific residency as of 2025‑10‑25. For strict residency, prefer **Bedrock/Vertex** regional deployments.

---

## Our Compliance Posture (adopted)
1. **Training:** Do **not** opt in to training with any provider.  
2. **Retention:** Prefer **ZDR/Modified Abuse Monitoring** for OpenAI; **ZDR** for Anthropic where eligible.  
3. **Residency:** Default US; switch to **EU endpoints** for sensitive projects. If legal mandates strict residency, route via **Bedrock/Vertex** regional endpoints.  
4. **DPAs:** Execute and file DPAs (OpenAI, Anthropic, GitHub) with SCCs where applicable. Keep links in `/docs/policies/dpa-links.md`.  
5. **Subprocessors:** Maintain current subprocessor links; review quarterly.  
6. **Logging:** Keep orchestrator logs for 30 days with **PII redaction**; store only hashes for prompts/artifacts when possible.  
7. **Provenance:** PRs include a **provenance footer** (model IDs, prompt hashes, token/cost totals).

---

## Acceptance checks (Phase 0C)
- DPA links recorded; ZDR/retention settings documented.  
- Residency strategy chosen per environment (US default, EU for sensitive).  
- `npm run policy:compliance:dry` prints the selected provider posture.
