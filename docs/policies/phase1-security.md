# Security-in-Dev (Mocks)
- Never log `process.env` or secrets.
- Fixtures use obvious fakes: `sk_test_`, `test_`, `example_`.
- In CI, mask any runtime token immediately via `::add-mask::TOKEN`.
- Keep actions pinned, `permissions: { contents: read }`.
