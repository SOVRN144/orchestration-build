import { vi, beforeAll, afterAll } from 'vitest';

const FIXED_DATE = new Date('2024-01-01T00:00:00.000Z');
let randomUUIDRestore: (() => void) | undefined;

beforeAll(() => {
  process.env.TZ = 'UTC';
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_DATE);
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    const original = globalThis.crypto.randomUUID.bind(globalThis.crypto);
    const mock = vi.fn(() => '00000000-0000-0000-0000-000000000000');
    globalThis.crypto.randomUUID = mock as typeof globalThis.crypto.randomUUID;
    randomUUIDRestore = () => {
      globalThis.crypto.randomUUID = original;
    };
  }
});

afterAll(() => {
  vi.useRealTimers();
  randomUUIDRestore?.();
});
