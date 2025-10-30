# Red-Bar Demo (Phase-1)

Use these scripts to verify CI failure handling without touching runtime code:

```bash
npm run demo:redbar:lint    # triggers ESLint failure via demos/red-bar/lint-fail.ts
npm run demo:redbar:ts      # triggers TypeScript compile error via demos/red-bar/ts-fail.ts
```

> Both fixtures live under `demos/red-bar/` and are ignored by default lint/type-check jobs so normal CI stays green. Run them manually to demonstrate the red-bar workflow during onboarding or audits.
