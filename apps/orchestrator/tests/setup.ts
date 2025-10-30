import { beforeEach, afterEach, vi } from 'vitest';

process.env.TZ = 'UTC';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
});

afterEach(() => {
  vi.useRealTimers();
});
