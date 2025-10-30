import { describe, it, expect } from 'vitest';
import { formatOtelJsonl } from '../src/logging/otelLogger.stub';

describe('otelLogger.stub', () => {
  it('redacts sensitive fields and emits OTEL-like shape', () => {
    const line = formatOtelJsonl({
      event: 'phase1-test',
      data: {
        authorization: 'Bearer abc',
        token: 'ghp_token',
        nested: { password: 'secret' },
      },
    });
    const obj = JSON.parse(line);
    expect(obj.timestamp).toMatch(/T/);
    expect(obj.severity).toBe('INFO');
    expect(obj.severityNumber).toBe(9);
    expect(obj.event).toBe('phase1-test');
    expect(obj.msg).toBe('phase1-test');
    expect(obj.body).toBe('phase1-test');
    expect(obj.schemaVersion).toBe('1.0.0');
    expect(obj.traceFlags).toBe('00');
    expect(obj.resource.service).toBe('orchestrator');
    expect(obj.data.authorization).toBe('[REDACTED]');
    expect(obj.data.token).toBe('[REDACTED]');
    expect(obj.data.nested.password).toBe('[REDACTED]');
  });
});
