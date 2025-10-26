import type { Message } from '../schema/messages';

export function architectPropose(task: string, turn: number): Message {
  return {
    role: 'architect',
    type: 'propose',
    content: `Plan: create/update README; add section for "${task}". Steps: draft → review → finalize.`,
    turn
  };
}

export function architectCritique(diff: string, turn: number): Message {
  const needs = diff.includes('[x]') ? 'looks good; verify' : 'missing acceptance checklist; add [x] items.';
  return {
    role: 'architect',
    type: 'critique',
    content: `Critique: ${needs}`,
    turn
  };
}

export function architectVerify(diff: string, turn: number): Message {
  const ok = diff.includes('[x]');
  return {
    role: 'architect',
    type: 'verify',
    content: ok ? 'Verified: meets scope & checklist.' : 'Verification failed.',
    turn
  };
}
