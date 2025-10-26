// ESLint v9 flat config for the orchestrator workspace
// Minimal ruleset: base JS + TS recommended; ignore build artifacts.
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'eslint.config.cjs'],
  },
];
