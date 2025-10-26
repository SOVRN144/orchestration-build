# Phase 0F — Success Metrics & Baseline Benchmarks
Updated: 2025-10-25 (TZ: Africa/Johannesburg)

This document summarizes the **key takeaways** from your Phase 0F research (15 sources). It captures the metrics we’ll track, the before/after deltas that matter, and **PoC SLO targets** (p95).

---

## Q1 — Metrics that capture agentic dev value
- **PR Acceptance Rate**: 83.8% agent PRs (vs 91% human baseline).
- **Merged Without Rework**: 54.9% pass first review; 45.1% require revisions.
- **Defect Density Reduction**: 15–30% after ACRT adoption.
- **Commit Velocity**: +110% to +490% (e.g., 42 vs 20 commits/week baseline).
- **Time-to-Merge**: Elite <24h; high performers <7 days.
- **Issue Resolution Speed**: ~same-day bug fixes vs 2–3 days typical.
- **Review Effectiveness Ceiling**: Accuracy drops beyond ~80–100 LOC per review session.
- **MTTR (Security)**: 180 min → 22 min (≈88% faster) for common vulns with Autofix.
- **Cost ROI**: 1h review saves ~33h maintenance (33:1); some orgs report 90% fewer defects post-institutionalization.

---

## Q2 — Before/After deltas (illustrative)
| Study | Baseline | After Agent/AI | Delta | Constraint |
|---|---|---|---|---|
| GitHub PR study | 91% acceptance | 83.8% agent | −3.2 pp | Docs PRs outperform (85.7% agent vs 76.5% human) |
| ACRT adoption | baseline defects | −15–30% density | −15–30% | −20–30% human review depth; +40% throughput |
| Agentic week-1 | 20 commits/wk | 42 commits (3 days), 5 PRs, 30 issues | +110–2900% | 2 regressions; requires human oversight |

> Full source list & dates are preserved in the Phase 0F research JSON artifact.

---

## Q3 — Recommended PoC SLOs (p95, small team)
**Velocity**
- **Time-to-Merge**: <36h initially (target <24h by week 8).
- **Human Review Latency**: <12h.
- **First-Response (PR assigned)**: <4h.
- **Commit Velocity Growth**: +50–100% over baseline.

**Quality**
- **Defect Escape (PR-DER)**: <8% initially; trend to <5% by week 12.
- **Rework Cycles**: p95 ≤ 2 rounds.
- **Substantive Comment Ratio**: ≥70% substantive vs ≤30% nits.
- **PR Size Guardrail**: warn >400 LOC; aim for ≤100 LOC per review slice.

**Agent Performance**
- **Task Scope**: ≤30–40 min human-equivalent tasks (peak success zone).
- **Success Rate**: 70–80% initially; ≥80% by week 4.
- **Agent Latency**: p95 <200 ms for realtime prompts; p50 <50 ms first-token (where applicable).

**Cost/Efficiency**
- **Cost per Successful Task**: ≤ $0.50 for narrow tasks.
- **Human Review Time Budget**: 5–8 minutes per PR after automation.
- **Run Cap**: ≤ R100 (~$5.50) per orchestrated feature (see Phase 0E).

---

## Constraints & caveats
1) **Task complexity ceiling**: success degrades beyond ~35 min human-equivalent.  
2) **Rework ratio**: expect ~45–50% revisions early; mitigate with tests/linting.  
3) **Review depth trade‑off**: throughput gains can reduce review depth; compensate with automation.  
4) **Token cost multiplier**: multi‑agent ≈ 4–15× tokens vs single‑agent; budget accordingly.  
5) **Domain dependency**: biggest wins come after narrowing task types and adding domain context.

---

## Implementation plan (Weeks 1–12)
- **W1–2**: Baseline metrics (time-to-merge, defect escape, review latency).  
- **W3–4**: Narrow tasks (≤40 min), accept 70% pass rate, measure rework.  
- **W5–8**: Optimize to <24h time-to-merge; push defect escape toward <5%.  
- **W9–12**: Broaden task types, grow acceptance 75–80%, finalize dashboard.

---

### How we’ll measure
- GitHub: PR timestamps, review events, merge times, comments (substantive vs nit).  
- CI: failed vs passed checks, reruns, test coverage deltas.  
- Orchestrator: per-turn tokens/cost (Phase 0E), agent pass/rework.  
- Security: MTTR for auto-flagged vulns; autofix success rate.

> These targets become the default in `docs/metrics/p0f-slo.json` and are enforced in CI dashboards later.
