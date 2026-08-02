# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A shareable ESLint configuration package (`eslint-config-fluxuator`, published as `fluxuator`) — not an app.
Consumers `extends` these configs from their own `.eslintrc`. There is no build step, bundler, or test suite;
the "source" is plain CommonJS config objects that get `require()`'d.

## Commands

- Install deps: `pnpm install` (pnpm is enforced via `preinstall: npx only-allow pnpm`; package manager pinned to `pnpm@9.1.4`)
- Lint the repo itself: `pnpm lint` (runs `pnpm eslint .`, which is `eslint --ext .js,.jsx,.ts,.tsx,.mdx`)
- Format check: `pnpm format:check`
- Format fix: `pnpm format:fix`
- Commit via commitizen (conventional commits, required by commit-msg hook): `pnpm commit`
- `make lint` / `make lint-staged` mirror the above pnpm scripts (see `Makefile`)

There is no test runner in this repo (no `test` script, no test files) — validate changes by linting a config
against itself or a sample project, not by running a test suite.

Node >= 18 required (`.nvmrc` pins v20 for local dev).

## Architecture

### Config composition pattern

Every top-level file (`index.js`, `node.js`, `node-recommended.js`, `react-recommended.js`, `jest.js`,
`jest-recommended.js`, `vitest.js`, `vitest-recommended.js`, `testing-library.js`, `prettier.js`, `a11y.js`,
`mdx.js`, `jsx-runtime.js`) is a small ESLint config object, published as a separate entry point
(e.g. consumers do `extends: ["fluxuator/react-recommended"]`). Actual rule bodies do **not** live in these
files — they live in `rules/*.js` and get pulled in via `require('./rules/<name>')`. When changing a rule,
edit the file in `rules/`, not the top-level composing file.

Composition happens two ways:

- **`extends` arrays** chain other local configs together, e.g. `react-recommended.js` is just
  `extends: ['./index', './jsx-runtime', './prettier']`. **Prettier must always be last** in any `extends`
  chain (noted explicitly in `react-recommended.js`/`node-recommended.js`) so it can override conflicting
  style rules.
- **`overrides` blocks with `files` globs** scope a plugin+rules pair to matching files without affecting the
  rest of the project, e.g. TypeScript rules only apply under `overrides: [{ files: ['**/*.ts?(x)'] }]` in
  `index.js`/`node.js`, and test rules (`jest.js`, `vitest.js`, `testing-library.js`) only apply under
  `**/__tests__/**/*` or `**/*.{spec,test}.*`.

### Two base tracks: browser/React vs Node

- `index.js` is the **base React/browser** config: parser is `@babel/eslint-parser` with
  `@babel/preset-react`, combines `rules/node.js` + `rules/react.js`, and adds a TS override using
  `@typescript-eslint/parser` + `rules/typescript.js`.
- `node.js` is the **Node-only** config: no React plugin, no JSX, same TS override pattern layered on top.
- `*-recommended.js` variants (`react-recommended.js`, `node-recommended.js`) are convenience bundles that
  add Prettier (and for React, the `jsx-runtime` override for React 17+ JSX transform) on top of the base.

### Rule-file conventions (`rules/`)

- `rules/typescript.js`: when adding a `@typescript-eslint` rule that shadows a core ESLint rule, the core
  rule must be turned off in the same file (documented inline in `index.js`) — some rules like
  `no-array-constructor` are not compatible between the two and need care.
- `rules/jest.js` + `rules/jest-formatting.js` are combined only for Jest projects; `rules/vitest.js` +
  `rules/jest-formatting.js` are combined only for Vitest projects (`jest-formatting` rules apply to both
  since they're framework-agnostic test-block style rules).
- Optional add-ons (`a11y.js`, `mdx.js`, `testing-library.js`) are opt-in — consumers add them explicitly to
  their `extends` array on top of a base config; they are never pulled in automatically.

### Peer dependencies

Nearly everything this config touches (`eslint`, `prettier`, `typescript`, `@typescript-eslint/*`,
`eslint-plugin-react*`, `eslint-plugin-jest*`, `eslint-plugin-vitest`, `eslint-plugin-testing-library`,
`eslint-plugin-mdx`, `eslint-plugin-jsx-a11y`, `@babel/*`) is a `peerDependency`, most marked
`optional: true`. If you add a new rule file that depends on a plugin, add the plugin as an optional peer
dependency in `package.json` rather than a hard `dependency` — only truly always-needed plugins
(`eslint-plugin-import`, `eslint-plugin-unused-imports`, `confusing-browser-globals`,
`@rushstack/eslint-patch`) belong in `dependencies`.

### Dogfooding

The repo lints itself using its own `node-recommended` config (`.eslintrc` → `extends: ["./node-recommended"]`).
Pre-commit runs `lint-staged` (`.lintstagedrc`): staged `.js` files get `eslint --fix`, everything else gets
`prettier --write`. Commit messages are enforced as Conventional Commits by commitlint
(`commitlint.config.js`) via the `commit-msg` hook, and releases use semantic-release off the `main` branch
(rules in `package.json` `release.plugins`) — commit type/scope affects versioning, so keep conventional
commit types accurate (e.g. `chore(deps)` triggers a patch release per the custom `releaseRules`).
