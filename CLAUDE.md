# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A shareable ESLint configuration package (`eslint-config-fluxuator`, published as `fluxuator`) — not an app.
Consumers spread these configs into their own flat `eslint.config.js` array. ESLint v10 only supports flat
config (no `.eslintrc`), so every published entry point is a plain array of flat config objects, published from
`lib/` via the `exports` map in `package.json`.

## Commands

- Install deps: `pnpm install` (pnpm is enforced via `preinstall: npx only-allow pnpm`; package manager pinned
  via the `packageManager` field in `package.json`)
- Lint the repo itself: `pnpm lint` (runs `pnpm eslint .`)
- Test: `pnpm test` (all tests), `pnpm test:unit` (plain unit tests), `pnpm test:eslint` (ESLint `RuleTester`
  suites for the custom plugin's rules — see `vitest.config.js`'s `test.projects` split)
- Format check: `pnpm format:check`
- Format fix: `pnpm format:fix`
- `make lint` / `make lint-staged` mirror the above pnpm scripts (see `Makefile`)

Node >= 22 required (`.nvmrc` pins v24 for local dev).

## Architecture

### Config composition pattern

Every top-level file in `lib/` (`index.js`, `node.js`, `node-recommended.js`, `react-recommended.js`, `jest.js`,
`jest-recommended.js`, `vitest.js`, `vitest-recommended.js`, `testing-library.js`, `prettier.js`, `a11y.js`,
`mdx.js`, `jsx-runtime.js`, `custom.js`) exports an **array of flat config objects**, published as a separate
entry point via `package.json`'s `exports` map (e.g. consumers do
`module.exports = [...require('eslint-config-fluxuator/react-recommended')]`). Actual rule bodies do **not**
live in these files — they live in `lib/rules/*.js` and get pulled in via `require('./rules/<name>')`. When
changing a rule that comes from a third-party plugin, edit the file in `lib/rules/`, not the top-level composing
file.

Composition happens two ways:

- **Array spreading** chains other local configs together, e.g. `lib/react-recommended.js` is just
  `[...require('./index'), ...require('./jsx-runtime'), ...require('./prettier')]`. **Prettier must always be
  last** in any spread chain (noted explicitly in `lib/react-recommended.js`/`lib/node-recommended.js`) so it
  can override conflicting style rules.
- **`files` globs on individual config objects** scope a plugin+rules pair to matching paths without affecting
  the rest of the project — e.g. the TypeScript-only block in `lib/index.js`/`lib/node.js` is a separate object
  with `files: ['**/*.{ts,mts,cts,tsx}']` (or `.js` equivalent), and test rules (`lib/jest.js`, `lib/vitest.js`,
  `lib/testing-library.js`) apply only under `**/__tests__/**/*` or `**/*.{spec,test}.*`.

### Two base tracks: browser/React vs Node

- `lib/index.js` is the **base React/browser** config: parser is ESLint's built-in `espree` (JSX enabled via
  `parserOptions.ecmaFeatures.jsx`), combines `lib/rules/node.js` + `lib/rules/react.js`, and adds a TS-only
  config object using `@typescript-eslint/parser` + `lib/rules/typescript.js`.
- `lib/node.js` is the **Node-only** config: no React plugin, no JSX, same TS-only block layered on top.
- `*-recommended.js` variants (`lib/react-recommended.js`, `lib/node-recommended.js`) are convenience bundles
  that add Prettier (and for React, the `jsx-runtime` config for React 17+ JSX transform) on top of the base.

### Rule-file conventions (`lib/rules/`)

- `lib/rules/typescript.js`: when adding a `@typescript-eslint` rule that shadows a core ESLint rule, the core
  rule must be turned off in the same file — some rules like `no-array-constructor` are not compatible between
  the two and need care.
- `lib/jest.js` and `lib/vitest.js` each pull in their plugin's own `flat/recommended` (or `configs.recommended`)
  preset first, then layer `lib/rules/jest.js` / `lib/rules/vitest.js` on top.
- Optional add-ons (`lib/a11y.js`, `lib/mdx.js`, `lib/testing-library.js`, `lib/custom.js`) are opt-in —
  consumers spread them explicitly into their config array on top of a base config; they are never pulled in
  automatically.

### Custom plugin (`lib/plugins/`)

`lib/custom.js` registers an in-house `fluxuator` ESLint plugin (`lib/plugins/fluxuator.plugin.js`) with two
rules under `lib/plugins/rules/`: `no-class-comparison` (enabled by default once a consumer opts into
`custom.js`) and `restrict-import-paths` (registered but off by default — needs per-project `tsconfig` options).
Shared helpers live in `lib/plugins/utils/`; `lib/plugins/__fixtures__/` holds `tsconfig.json` fixtures used only
by `restrict-import-paths`'s tests. Every file under `lib/plugins/` has a matching `*.spec.js` run by Vitest
(`RuleTester`-based for the two `*.rule.spec.js` files, plain `describe`/`it`/`expect` for the rest — Vitest's
`globals: true` setting is what makes `RuleTester`'s internal `describe`/`it` calls resolve without per-file
imports).

### Peer dependencies

Nearly everything this config touches (`eslint`, `prettier`, `typescript`, `@typescript-eslint/*`,
`eslint-plugin-react*`, `eslint-plugin-jest`, `@vitest/eslint-plugin`, `eslint-plugin-testing-library`,
`eslint-plugin-mdx`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier`, `eslint-plugin-prettier`) is a
`peerDependency`, all marked `optional: true`. If you add a new rule file that depends on a plugin, add the
plugin as an optional peer dependency in `package.json` rather than a hard `dependency` — only truly
always-needed packages (`eslint-plugin-import-x`, `eslint-plugin-unused-imports`, `confusing-browser-globals`,
`globals`, `lodash.defaultsdeep`) belong in `dependencies`. `lodash.defaultsdeep` is required unconditionally by
`no-class-comparison`, which is why it's a hard dependency even though the rule itself is opt-in.

### Dogfooding

The repo lints itself using its own `node-recommended` config (`eslint.config.js` →
`module.exports = [...require('./lib/node-recommended')]`). Pre-commit runs `lint-staged` (`.lintstagedrc`):
staged `.js` files get `eslint --fix`, everything else gets `prettier --write`. Commit messages are enforced as
Conventional Commits by commitlint (`commitlint.config.js`) via the `commit-msg` hook, and releases use
semantic-release off the `main` branch (rules in `package.json` `release.plugins`) — commit type/scope affects
versioning, so keep conventional commit types accurate (e.g. `chore(deps)` triggers a patch release per the
custom `releaseRules`).
