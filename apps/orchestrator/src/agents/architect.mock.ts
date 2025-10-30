import type { Message } from '../schema/messages';

export function architectPropose(task: string, turn: number): Message {
  return {
    role: 'architect',
    type: 'propose',
    content: `Plan: create/update README; add section for "${task}". Steps: draft → review → finalize.`,
    turn,
    reasons: ['Phase-1 mock planning'],
    evidence: ['task-spec'],
    risks: [],
  };
}

export function architectCritique(diff: string, turn: number): Message {
  const ok = diff.includes('[x]');
  const needs = ok ? 'looks good; verify' : 'missing acceptance checklist; add [x] items.';
  return {
    role: 'architect',
    type: 'critique',
    content: `Critique: ${needs}`,
    turn,
    reasons: [needs],
    evidence: diff ? [diff.slice(0, 40)] : [],
    risks: ok ? [] : ['missing-checklist'],
  };
}

export function architectVerify(diff: string, turn: number): Message {
  const ok = diff.includes('[x]');
  return {
    role: 'architect',
    type: 'verify',
    content: ok ? 'Verified: meets scope & checklist.' : 'Verification failed.',
    turn,
    reasons: [ok ? 'criteria-met' : 'criteria-failed'],
    evidence: diff ? [diff.slice(0, 40)] : [],
    risks: ok ? [] : ['needs-updates'],
  };
}
