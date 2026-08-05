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

The package is pure ESM (`"type": "module"` in `package.json`). Every top-level file in `lib/` (`index.js`,
`node.js`, `react.js`, `jest.js`, `vitest.js`, `a11y.js`, `prettier.js`, `react-testing-library.js`) default-exports
an **array of flat config objects** (`jest.js` default-exports a function that returns one, so it can take the
consumer's installed Jest version), published as a separate entry point via `package.json`'s `exports` map (e.g.
consumers do `import nodeConfig from 'eslint-config-fluxuator/node'`). `lib/config.js` is the one exception — it
default-exports a plain object of shared primitives (`ignores`, `allSupportedFiles`, `onlyTypeScriptFiles`,
`testFiles`, `prettierConfig`), not a config array; see the "Shared primitives" section below. Actual rule bodies
do **not** live in the top-level files — they live in `lib/rules/*.js` and get pulled in via
`import rules from './rules/<name>.js'` (relative imports need the explicit `.js` extension under ESM). When
changing a rule that comes from a third-party plugin, edit the file in `lib/rules/`, not the top-level composing
file.

Composition happens two ways:

- **Array spreading** chains other local configs together, e.g. `lib/react.js` spreads in `lib/prettier.js`'s
  default export. **Prettier must always be last** in any spread chain so it can override conflicting style rules.
- **`files` globs on individual config objects** scope a plugin+rules pair to matching paths without affecting
  the rest of the project — e.g. the TypeScript-only block in `lib/node.js`/`lib/react.js` is a separate object
  with `files: onlyTypeScriptFiles` (from `lib/shared.config.js`), and test rules (`lib/jest.js`, `lib/vitest.js`,
  `lib/react-testing-library.js`) apply only under `testFiles` (`**/__tests__/**/*` or `**/*.{spec,test}.*`).

### Shared primitives (`lib/shared.config.js` / `lib/config.js`)

`lib/shared.config.js` defines the file-glob and ignore-pattern constants every other `lib/` file imports
(`ignores`, `allSupportedFiles`, `onlyTypeScriptFiles`, `testFiles`, `sharedPrettierConfig`). `lib/config.js`
re-exports these publicly (renaming `sharedPrettierConfig` to `prettierConfig`) as the `./config` entry point, for
consumers who want to reuse the same globs/ignores in their own custom flat config objects without hardcoding
them.

### Two base tracks: browser/React vs Node

- `lib/react.js` is the **base React/browser** config: parser is ESLint's built-in `espree` (JSX enabled via
  `parserOptions.ecmaFeatures.jsx`), combines `lib/rules/node.js` + `lib/rules/react.js`, and adds a TS-only
  config object using `typescript-eslint` + `lib/rules/typescript.js`. `lib/index.js` is just a one-line re-export
  of `lib/react.js`'s default export (`export { default } from './react.js'`) — it has no config logic of its own.
- `lib/node.js` is the **Node-only** config: no React plugin, no JSX, same TS-only block layered on top.
- Both `lib/node.js` and `lib/react.js` already spread `lib/prettier.js` in at the end of their own array — there
  is no separate `*-recommended.js` bundle to opt into; Prettier and (for React) the React 17+ JSX transform are
  built into the base config directly.

### Rule-file conventions (`lib/rules/`)

- `lib/rules/typescript.js`: when adding a `@typescript-eslint` rule that shadows a core ESLint rule, the core
  rule must be turned off in the same file — some rules like `no-array-constructor` are not compatible between
  the two and need care.
- `lib/jest.js` and `lib/vitest.js` each pull in their plugin's own `flat/recommended` (or `configs.recommended`)
  preset first, then layer `lib/rules/jest.js` / `lib/rules/vitest.js` on top.
- Optional add-ons (`lib/a11y.js`, `lib/react-testing-library.js`) are opt-in — consumers spread them explicitly
  into their config array on top of a base config; they are never pulled in automatically. The custom `fluxuator`
  plugin (`lib/plugins/`) is not a separate opt-in file — it's already wired into `lib/node.js` and `lib/react.js`
  directly (see "Custom plugin" below).

### Custom plugin (`lib/plugins/`)

`lib/node.js` and `lib/react.js` both register an in-house `fluxuator` ESLint plugin
(`lib/plugins/fluxuator.plugin.js`) with two rules under `lib/plugins/rules/`: `no-class-comparison` (enabled by
default) and `restrict-import-paths` (registered but off by default — needs per-project `tsconfig` options).
Shared helpers live in `lib/plugins/utils/`; `lib/plugins/__fixtures__/` holds `tsconfig.json` fixtures used only
by `restrict-import-paths`'s tests. Every file under `lib/plugins/` has a matching `*.spec.js` run by Vitest
(`RuleTester`-based for the two `*.rule.spec.js` files, plain `describe`/`it`/`expect` for the rest — Vitest's
`globals: true` setting is what makes `RuleTester`'s internal `describe`/`it` calls resolve without per-file
imports).

### Peer dependencies

Nearly everything this config touches (`eslint`, `prettier`, `typescript`, `typescript-eslint`,
`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jest`, `@vitest/eslint-plugin`,
`eslint-plugin-testing-library`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier`, `eslint-plugin-prettier`) is a
`peerDependency`, all marked `optional: true`. If you add a new rule file that depends on a plugin, add the
plugin as an optional peer dependency in `package.json` rather than a hard `dependency` — only truly
always-needed packages (`eslint-plugin-import-x`, `eslint-plugin-unused-imports`, `confusing-browser-globals`,
`globals`, `lodash.defaultsdeep`) belong in `dependencies`. `lodash.defaultsdeep` is required unconditionally by
`no-class-comparison`, which is why it's a hard dependency even though the rule itself is opt-in.

### Dogfooding

The repo lints itself using its own `node` + `vitest` configs (`eslint.config.js` →
`export default [...nodeConfig, ...vitestConfig]`). Pre-commit runs `lint-staged` (`.lintstagedrc`):
staged `.js` files get `eslint --fix`, everything else gets `prettier --write`. Commit messages are enforced as
Conventional Commits by commitlint (`commitlint.config.js`) via the `commit-msg` hook, and releases use
semantic-release off the `main` branch (rules in `package.json` `release.plugins`) — commit type/scope affects
versioning, so keep conventional commit types accurate (e.g. `chore(deps)` triggers a patch release per the
custom `releaseRules`).
