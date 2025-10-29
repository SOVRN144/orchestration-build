# Logging Strategy (Phase-1)
- Minimal stable fields: task, turn, role, type, status, timestamp (ISO UTC).
- Format: JSON Lines for CI; human `console.log` ok in dev.
- Redaction: never log tokens/cookies/passwords; default to `[REDACTED]`.
- Trace/correlation: add in Phase-2; not required for P-1.
