# Logging Strategy (Phase-1)

Phase-1 uses a lightweight OTEL-aligned JSONL stub for local loops:

- **Emitted fields:** `timestamp`, `severity`, `severityNumber`, `traceFlags`, `schemaVersion`, `event`, `msg`, `body`, `resource`, `traceId`, `spanId`, and `data`.
- **Defaults:** severity defaults to `INFO` (`severityNumber = 9`), `traceFlags` to `"00"`, and `traceId`/`spanId` to stub values. `resource` includes `{ service: "orchestrator", env: "local" }`.
- **Redaction:** keys matching token/password/cookie/secret variants are replaced with `[REDACTED]` recursively.
- **Usage:** do not wire into runtime yet; use `formatOtelJsonl` / `emitOtelJsonlToStderr` for local scaffolding and demos.
- **Future phases:** real transports, OTEL exporters, and correlation IDs will replace the stub once services go live.
