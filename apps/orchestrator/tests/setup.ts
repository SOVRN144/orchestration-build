import { vi, beforeAll, afterAll } from 'vitest';

const FIXED_DATE = new Date('2024-01-01T00:00:00.000Z');
let randomUUIDSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeAll(() => {
  process.env.TZ = 'UTC';
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_DATE);
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    randomUUIDSpy = vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000000');
  }
});

afterAll(() => {
  vi.useRealTimers();
  randomUUIDSpy?.mockRestore();
});
