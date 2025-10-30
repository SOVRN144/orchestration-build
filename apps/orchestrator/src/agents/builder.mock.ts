import type { Message } from '../schema/messages';

export function builderImplement(
  task: string,
  critique: string | null,
  turn: number
): { msg: Message; diff: string } {
  let diff = `diff --git a/README.md b/README.md\n`;
  if (critique && critique.includes('missing acceptance checklist')) {
    diff += `+ ## ${task}\n+ - [x] Added context\n+ - [x] Acceptance checklist\n`;
  } else {
    diff += `+ ## ${task}\n+ - [ ] Added context\n+ - [ ] Acceptance checklist\n`;
  }
  return {
    msg: {
      role: 'builder',
      type: 'implement',
      content: 'Produced diff for README.md',
      turn,
      reasons: ['mock-diff'],
      evidence: [diff.split('\n')[1] ?? ''],
      risks: diff.includes('[ ]') ? ['incomplete-checklist'] : [],
    },
    diff,
  };
}
