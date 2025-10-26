#!/usr/bin/env node
/**
 * policy:compliance:dry — prints chosen compliance posture from JSON.
 * Env (optional): REGION=US|EU  SENSITIVE=true|false
 */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const cfgPath = path.join(root, 'docs', 'policies', 'provider-compliance.json');
if (!fs.existsSync(cfgPath)) {
  console.error('Missing docs/policies/provider-compliance.json');
  process.exit(1);
}
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const region = process.env.REGION || cfg.default_region;
const sensitive = String(process.env.SENSITIVE || 'false') === 'true';

function endpointFor(provider) {
  if (provider === 'openai') {
    return sensitive ? cfg.providers.openai.eu_endpoint : cfg.providers.openai.endpoint;
  }
  if (provider === 'anthropic') {
    return cfg.providers.anthropic.endpoint + (sensitive ? ' (prefer Bedrock/Vertex regional deployment)' : '');
  }
  return 'n/a';
}

const out = {
  region_selected: region,
  sensitive_project: sensitive,
  providers: {
    openai: {
      endpoint: endpointFor('openai'),
      zero_data_retention: cfg.providers.openai.zero_data_retention,
      modified_abuse_monitoring: cfg.providers.openai.modified_abuse_monitoring,
      training_opt_in: cfg.providers.openai.training_opt_in
    },
    anthropic: {
      endpoint: endpointFor('anthropic'),
      zero_data_retention: cfg.providers.anthropic.zero_data_retention,
      training_opt_in: cfg.providers.anthropic.training_opt_in,
      bedrock: cfg.providers.anthropic.bedrock,
      vertex: cfg.providers.anthropic.vertex
    },
    github_copilot_code_review: {
      plan: cfg.providers.github_copilot_code_review.plan,
      retain_prompts: cfg.providers.github_copilot_code_review.retain_prompts,
      training_on_customer_data: cfg.providers.github_copilot_code_review.training_on_customer_data
    },
    coderabbit: {
      training_on_customer_data: cfg.providers.coderabbit.training_on_customer_data,
      code_retention: cfg.providers.coderabbit.code_retention,
      embeddings_persist: cfg.providers.coderabbit.embeddings_persist,
      embeddings_opt_out: cfg.providers.coderabbit.embeddings_opt_out
    }
  }
};

console.log('=== Compliance Posture (Dry) ===');
console.log(JSON.stringify(out, null, 2));
