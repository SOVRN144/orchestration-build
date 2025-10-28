# Event Bus (Phase-1)
**Purpose**: Simple in-memory bus for local loops.
## API
- `publish(msg)` → appends to log
- `history()` → returns array in publish order
## Guarantees (P-1)
- In-process ordering only; no IDs/causality.
## Future
- `messageId`, `parentId`, causality, persistence (P-2+).
## Testing
- Assert `history().length` and chronological role/type ordering in loop/kernel tests.
