# Sprint3-AppSus

## Lint

ESLint config lives in `eslint.config.js`, enforces single quotes and no semicolons.

Install (npm only — this project pins `npm` via `packageManager`):

```
npm install
```

Run manually:

```
npx eslint .
```

### Automatic checks on commit

A git hook (`.githooks/pre-commit`) runs eslint on staged files and blocks the
commit only if changed/added lines have violations (pre-existing issues
elsewhere in a file are ignored). Enabled once per clone:

```
git config core.hooksPath .githooks
```
