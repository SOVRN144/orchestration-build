type Severity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
const SENSITIVE_KEYS = new Set([
  'authorization',
  'token',
  'password',
  'cookie',
  'api_key',
  'apikey',
  'secret',
  'private_key',
  'privatekey',
]);

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redact(item));
  }
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, innerValue] of Object.entries(value as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = redact(innerValue);
      }
    }
    return result;
  }
  return value;
}

export function formatOtelJsonl(input: {
  event: string;
  severity?: Severity;
  resource?: Record<string, unknown>;
  traceId?: string;
  spanId?: string;
  data?: Record<string, unknown>;
  message?: string;
  traceFlags?: string;
}): string {
  const now = new Date().toISOString();
  const severity = input.severity ?? 'INFO';
  const severityNumberMap: Record<Severity, number> = {
    DEBUG: 5,
    INFO: 9,
    WARN: 13,
    ERROR: 17,
  };
  const safeMessageValue = input.message ?? input.event;
  const safeMessage =
    typeof safeMessageValue === 'string' ? redact(safeMessageValue) : safeMessageValue;
  return JSON.stringify({
    timestamp: now,
    severity,
    severityNumber: severityNumberMap[severity],
    traceFlags: input.traceFlags ?? '00',
    schemaVersion: '1.0.0',
    event: input.event,
    msg: safeMessage,
    body: safeMessage,
    resource: input.resource ?? { service: 'orchestrator', env: 'local' },
    traceId: input.traceId ?? 'trace-stub',
    spanId: input.spanId ?? 'span-stub',
    data: redact(input.data ?? {}),
  });
}

export function emitOtelJsonlToStderr(entry: Parameters<typeof formatOtelJsonl>[0]) {
  process.stderr.write(formatOtelJsonl(entry) + '\n');
}
