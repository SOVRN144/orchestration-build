# Diff Conventions (Phase-1)
- Format: unified diff string with `diff --git` header.
- Producer: mock builder returns fixture diffs.
- No patching in P-1; strings only (stable, snapshot-friendly).
- P-3: introduce safe patching (node-patch or similar).
