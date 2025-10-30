import { describe, it, expect } from 'vitest';
import type { DestinationStream } from 'pino';
import { createLogger, logTurn } from '../src/logging/logger';

describe('logger', () => {
  it('redacts sensitive fields', () => {
    const chunks: string[] = [];
    const destination: DestinationStream = {
      write(chunk: string) {
        chunks.push(chunk);
      },
      flush() {
        /* noop */
      },
    } as DestinationStream;
    const logger = createLogger({ level: 'info' }, destination);
    logger.info({ headers: { authorization: 'secret' } }, 'test');

    const combined = chunks.join('');
    expect(combined).toContain('[REDACTED]');
    expect(combined).not.toContain('secret');
  });

  it('logs orchestrator turn entries', () => {
    expect(() =>
      logTurn({
        task: 'demo',
        turn: 1,
        role: 'architect',
        type: 'propose',
        status: 'propose',
        message: 'starting',
      })
    ).not.toThrow();
  });
});
