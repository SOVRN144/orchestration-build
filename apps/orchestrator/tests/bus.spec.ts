import { describe, it, expect, vi } from 'vitest';
import { InMemoryBus } from '../src/bus/inMemoryBus';
import type { Message } from '../src/schema/messages';

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  role: 'architect',
  type: 'propose',
  content: 'test',
  turn: 1,
  ...overrides,
});

describe('InMemoryBus', () => {
  it('assigns monotonic sequence numbers and envelopes payload', () => {
    const bus = new InMemoryBus(5);
    const env1 = bus.publish(makeMessage({ turn: 1 }));
    vi.advanceTimersByTime(1000);
    const env2 = bus.publish(makeMessage({ turn: 2 }), { correlationId: env1.id });

    expect(env1.seq).toBe(1);
    expect(env2.seq).toBe(2);
    expect(env2.correlationId).toBe(env1.id);
    expect(bus.history()).toHaveLength(2);
    expect(bus.historyEnvelopes()[1].payload.turn).toBe(2);
  });

  it('bounds history using capacity and supports clear()', () => {
    const bus = new InMemoryBus(2);
    bus.publish(makeMessage({ content: 'a' }));
    bus.publish(makeMessage({ content: 'b' }));
    bus.publish(makeMessage({ content: 'c' }));

    expect(bus.history().map((m) => m.content)).toEqual(['b', 'c']);
    bus.clear();
    expect(bus.history()).toEqual([]);
  });
});
