#!/usr/bin/env node
/**
 * plan:dry — prints the orchestrator plan without calling any APIs.
 * Usage: node tools/plan/planDry.mjs
 */
const plan = {
  northStar: "PR ≤ 30 min at ≤ R100 (~$5.5) with ≤1 rework cycle",
  roles: {
    architect: { provider: "Anthropic", model: "Claude Sonnet 4.5", context: "≈200k" },
    builder: { provider: "OpenAI", model: "GPT 4o-mini → 4o → GPT-5 Thinking (escalation)", context: "≈128k (model-dependent)" }
  },
  routing: [
    "Default: Builder=4o-mini",
    "Escalate to 4o when complexity=high or large diff",
    "Escalate to GPT-5 Thinking for security-critical or failed critiques >2x"
  ],
  budgets: {
    runCapRand: 100,
    architect: { maxIn: 12000, maxOut: 3000 },
    builder: { maxIn: 25000, maxOut: 8000 }
  },
  reviews: ["CodeRabbit required", "Copilot Code Review required", "≥1 human approval"],
  provenance: ["model IDs", "prompt hashes", "retrieved files", "token & cost totals"],
  compliance: ["API data not used for training (default)", "30-day logs; prefer ZDR", "Region: US/EU selectable"]
};

console.log("=== Orchestrator Plan (Dry Run) ===");
console.log(JSON.stringify(plan, null, 2));
console.log("\nNo provider calls were made.");
process.exit(0);
