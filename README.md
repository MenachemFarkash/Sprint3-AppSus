# Sprint3-AppSus

AppSus: a shared shell (header, folder nav, filters) hosting two Google-inspired apps built with plain React + Babel-in-browser, no bundler.

## Status

- **Mail** — Gmail-style client: folders (inbox/sent/draft/trash/starred), list + detail view, compose, filter/search, mark read/unread, save mail as note.
- **Notes** — Google Keep-style app: masonry note list, create/edit note (text/image/video/audio/checklist types), pin, color, archive.
- **About** — team + tech stack page.
- Shared: header, app switcher menu, folder nav, filter bar, user avatar, toast messages (`UserMsg`), event bus, `localStorage`-backed async storage service.

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
