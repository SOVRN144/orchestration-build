export const SECRET_PATTERNS = [
  { name: 'GitHub token', re: /\bghp_[A-Za-z0-9]{36}\b/ },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'JWT', re: /\beyJ[A-Za-z0-9._-]+?\.[A-Za-z0-9._-]+?\.[A-Za-z0-9._-]+?\b/ },
  // TODO: Extend with additional providers (OpenAI sk-..., Slack xoxb-, Stripe sk_live_) as coverage grows.
];

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Object.prototype.toString.call(v) === '[object Object]';
}

function* walk(
  v: unknown,
  seen = new WeakSet<object>(),
  path: string[] = []
): Generator<{ path: string; str: string }> {
  if (typeof v === 'string') {
    yield { path: path.join('.'), str: v };
    return;
  }
  if (Array.isArray(v)) {
    if (seen.has(v as object)) return;
    seen.add(v as object);
    for (let i = 0; i < v.length; i++) {
      yield* walk(v[i], seen, [...path, String(i)]);
    }
    return;
  }
  if (isPlainObject(v)) {
    if (seen.has(v)) return;
    seen.add(v);
    for (const [k, val] of Object.entries(v)) yield* walk(val, seen, [...path, k]);
  }
}

export function assertNoRealSecrets(candidate: unknown): void {
  const hits: string[] = [];
  for (const node of walk(candidate)) {
    for (const { name, re } of SECRET_PATTERNS) {
      const match = node.str.match(re);
      if (!match) continue;
      const value = match[0];
      if (value.startsWith('sk_test_') || value.startsWith('test_') || value.startsWith('example_'))
        continue;
      hits.push(`${name} at "${node.path}"`);
      if (hits.length >= 3) break;
    }
    if (hits.length >= 3) break;
  }
  if (hits.length)
    throw new Error(`Possible real secret(s):\n${hits.map((h) => `• ${h}`).join('\n')}`);
}

export function guardArgs<T extends unknown[], R>(fn: (...args: T) => R, ...args: T): R {
  for (const arg of args) assertNoRealSecrets(arg);
  return fn(...args);
}
