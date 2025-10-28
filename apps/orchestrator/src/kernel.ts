import { InMemoryBus } from './bus/inMemoryBus';
import { architectPropose, architectCritique, architectVerify } from './agents/architect.mock';
import { builderImplement } from './agents/builder.mock';
import { assertValidMessage } from './schema/validate';
import { isNoImprovement } from './loop/isNoImprovement';
import type { DebateResult, Message } from './schema/messages';

export async function runMockLoop(task: string, maxTurns = 3): Promise<DebateResult> {
  const bus = new InMemoryBus();
  let diff = '';
  let prevDiff = '';
  let lastCritique: Message | null = null;

  for (let turn = 1; turn <= maxTurns; turn++) {
    // Architect proposes (turn 1) or critiques (turn 2)
    if (turn === 1) {
      const p = architectPropose(task, turn);
      assertValidMessage(p);
      bus.publish(p);
    } else {
      const c = architectCritique(diff, turn);
      assertValidMessage(c);
      bus.publish(c);
      lastCritique = c;
    }

    // Builder implements
    const impl = builderImplement(task, lastCritique?.content ?? null, turn);
    diff = impl.diff;
    assertValidMessage(impl.msg);
    bus.publish(impl.msg);

    // Check for stagnation (no improvement) after diff update
    if (turn > 1 && isNoImprovement(prevDiff, diff, turn)) {
      return { status: 'FAILED', turns: turn, diff, log: bus.history(), reason: 'NO_IMPROVEMENT' };
    }
    prevDiff = diff;

    // Architect verifies at end of turn
    const v = architectVerify(diff, turn);
    assertValidMessage(v);
    bus.publish(v);
    if (v.content.startsWith('Verified')) {
      return { status: 'CONVERGED', turns: turn, diff, log: bus.history() };
    }
  }

  return { status: 'FAILED', turns: maxTurns, diff, log: bus.history(), reason: 'MAX_TURNS' };
}
