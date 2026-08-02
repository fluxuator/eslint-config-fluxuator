# ESLint v10 migration — design

Date: 2026-08-02

## Goal

Upgrade `eslint-config-fluxuator` to support ESLint v10, landed as a breaking
change on a new branch, released as a major version bump via conventional
commits. All peer packages were checked for real compatibility with ESLint
v10 before committing to this design (live npm registry queries plus actual
functional smoke tests against `eslint@10.8.0`, not just declared peer
ranges — several packages declare narrower peer ranges than what they
actually run under, and one crashes outright despite looking fine on paper).

## Why this is bigger than a version bump

ESLint v10 removed the legacy `.eslintrc.*` config format entirely — no
compatibility flag, no fallback. Verified directly:

```
$ eslint test.js   # with only a .eslintrc.json present
Oops! Something went wrong! :(
ESLint: 10.8.0
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
From ESLint v9.0.0, the default configuration file is now eslint.config.js.
```

Every file this package ships (`index.js`, `node.js`, `react-recommended.js`,
`node-recommended.js`, `jest.js`, `jest-recommended.js`, `vitest.js`,
`vitest-recommended.js`, `testing-library.js`, `prettier.js`, `a11y.js`,
`mdx.js`, `jsx-runtime.js`) is written in the old eslintrc shape
(`extends`/`overrides`/`plugins`-as-strings/`env`). None of it loads under
ESLint v10 as-is. This is a full flat-config rewrite, not a dependency bump.

## Decisions

1. **Flat config only, drop ESLint <9 support.** Peer `eslint`:
   `^9.0.0 || ^10.0.0`. No dual eslintrc+flat output — one format, one
   maintenance burden.
2. **Base parser: espree (built-in) instead of `@babel/eslint-parser`.**
   `index.js` currently sets `requireConfigFile: false` with
   `babelOptions: { presets: ['@babel/preset-react'] }` — meaning it never
   reads a consumer's own babel config and the _only_ thing babel
   contributes is JSX parsing. Espree's `ecmaFeatures.jsx: true` does the
   same parsing with zero extra peer dependency. Confirmed
   `@babel/eslint-parser@7.28.5` also crashes hard under real ESLint v10
   (`scopeManager.addGlobals is not a function` — an internal ESLint API
   removed in v10), and the only fix line (`@babel/eslint-parser@8.0.1`)
   forces `@babel/core@^8.0.0` _and_ `@babel/preset-react@^8.0.0` in
   lockstep — three brand-new majors (all barely past RC) forced onto every
   React/browser consumer for a feature (JSX parsing) espree already
   covers. Not worth it. `@babel/core`, `@babel/eslint-parser`, and
   `@babel/preset-react` are removed from `peerDependencies` and
   `peerDependenciesMeta` entirely.
3. **`env` blocks → `languageOptions.globals`.** Flat config has no `env`
   shorthand. Replacement is the `globals` npm package
   (`languageOptions.globals: { ...globals.browser, ...globals.node, ... }`).
   New plain dependency, zero ESLint coupling, and it's what replaces
   something rather than a net-new capability.
4. **`eslint-plugin-import` → `eslint-plugin-import-x`.** `eslint-plugin-import`
   is a hard `dependency` (not peer) used unconditionally in both `index.js`
   and `node.js` — it is the single blocker for v10 support across the
   entire package, since its own peer range tops out `^9` with no
   prerelease pointing past it. `eslint-plugin-import-x@4.17.1` is the
   actively maintained fork; its peer explicitly covers
   `^8.57.0 || ^9.0.0 || ^10.0.0`, and it was functionally verified against
   real `eslint@10.8.0` (ran a rule, got a real lint result, no crash).
   Plugin key changes from `import` to `import-x`; every `import/*` rule key
   in `rules/node.js` (`import/first`, `import/no-duplicates`, etc.) is
   renamed to `import-x/*`.
5. **`eslint-plugin-vitest` (veritem's) → `@vitest/eslint-plugin`.** The
   currently-used `eslint-plugin-vitest` (repository
   `github.com/veritem/eslint-plugin-vitest`) tops out at 0.5.4, peer maxes
   `^9`, and — confirmed by actually requiring it under real
   `eslint@10.8.0` with its transitive `@typescript-eslint/utils` — crashes
   on load:
   ```
   TypeError: Class extends value undefined is not a constructor or null
     at .../eslint/LegacyESLint.js:12
   ```
   This is a real functional break, not a metadata gap. The replacement is
   `@vitest/eslint-plugin`, published by the Vitest project itself — its
   `repository` field points to `github.com/vitest-dev/eslint-plugin-vitest`
   (same org the user pointed at), peer is the open range `eslint >=8.57.0`
   (covers v10), and it loads and exposes
   `configs: ['legacy-recommended', 'legacy-all', 'recommended', 'all', 'env']`
   cleanly under v10. `vitest.js`/`vitest-recommended.js` get rewritten
   against this package; exact rule-key prefix to be confirmed in
   implementation (verify whether it still registers under `vitest/*` or a
   different namespace) since its `configs.recommended` shape wasn't fully
   inspected during brainstorming.
6. **Node engine: `^22.13.0 || >=24`.** ESLint v10 itself requires
   `^20.19.0 || ^22.13.0 || >=24`, but per explicit instruction Node 20
   support is dropped from this package's own `engines.node` even though
   ESLint v10 would still permit it. `.nvmrc` → `24`.

## Dependency / peer change table

| package                                     | current                     | new                         | reasoning                                                                                                                                                                                      |
| ------------------------------------------- | --------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint` (peer)                             | `^8.0.0`                    | `^9.0.0 \|\| ^10.0.0`       | flat-config-only decision                                                                                                                                                                      |
| `eslint-plugin-import` (dependency)         | present, unpinned peer note | **removed**                 | replaced, see decision 4                                                                                                                                                                       |
| `eslint-plugin-import-x`                    | —                           | new dependency `^4.17.1`    | replacement, v10-verified                                                                                                                                                                      |
| `eslint-plugin-vitest` (peer)               | `>=0.3.0`                   | **removed**                 | crashes under real v10, see decision 5                                                                                                                                                         |
| `@vitest/eslint-plugin`                     | —                           | new peer `^1.6.0`, optional | replacement, official vitest-dev package                                                                                                                                                       |
| `@typescript-eslint/eslint-plugin` (peer)   | `^6.0.0 \|\| ^7.0.0`        | `^8.0.0`                    | only 8.65+ declares v10 support; verified functional                                                                                                                                           |
| `@typescript-eslint/parser` (peer)          | `^6.0.0 \|\| ^7.0.0`        | `^8.0.0`                    | same                                                                                                                                                                                           |
| `eslint-plugin-jest` (peer)                 | `^27.0.1`                   | `^29.0.0`                   | only 29.16+ declares v10                                                                                                                                                                       |
| `eslint-plugin-jest-formatting` (peer)      | `^3.1.0`                    | keep `^3.1.0`               | open peer range already; flat-config export support to be confirmed in implementation                                                                                                          |
| `eslint-plugin-testing-library` (peer)      | `^6.3.0`                    | `^7.0.0`                    | 6.x peer tops out at eslint `^8`, real gap; 7.16+ covers v10                                                                                                                                   |
| `eslint-plugin-jsx-a11y` (peer)             | `^6.4.1`                    | `^6.10.0`                   | declared peer metadata lags v10, but functionally verified working (`flatConfigs.recommended`/`.strict` present and correctly shaped) at 6.10.2+                                               |
| `eslint-plugin-react` (peer)                | `^7.26.1`                   | `^7.37.0`                   | same story — verified via `configs.flat.recommended`, real lint error produced under v10                                                                                                       |
| `eslint-plugin-react-hooks` (peer)          | `^4.2.0`                    | `^7.0.0`                    | v7 explicitly declares `^10.0.0` peer support and ships `configs.flat`                                                                                                                         |
| `eslint-config-prettier` (peer)             | `^8.5.0 \|\| ^9.0.0`        | `^10.1.0`                   | `eslint-plugin-prettier`'s own peer excludes exactly `10.0.x` (`>=7.0.0 <10.0.0 \|\| >=10.1.0`)                                                                                                |
| `eslint-plugin-prettier` (peer)             | `^5.2.1`                    | keep, freshen to `^5.5.0`   | open eslint peer (`>=8.0.0`), no v10-specific gap found                                                                                                                                        |
| `eslint-plugin-mdx` (peer)                  | `^1.16.0`                   | `^3.0.0`                    | massively stale range; flat-config support to be confirmed in implementation (optional add-on, lower priority)                                                                                 |
| `eslint-plugin-unused-imports` (dependency) | `^4.1.4`                    | `^4.4.1`                    | already declares `^10.0.0 \|\| ^9.0.0 \|\| ^8.0.0` peer, just freshen                                                                                                                          |
| `@babel/core` (peer)                        | `^7.23.7`                   | **removed**                 | no longer used, see decision 2                                                                                                                                                                 |
| `@babel/eslint-parser` (peer)               | `^7.23.3`                   | **removed**                 | no longer used                                                                                                                                                                                 |
| `@babel/preset-react` (peer)                | `^7.14.5`                   | **removed**                 | no longer used                                                                                                                                                                                 |
| `@rushstack/eslint-patch` (dependency)      | `^1.10.4`                   | **removed**                 | never `require()`'d anywhere in this codebase; its purpose (patching eslintrc's old plugin-resolution algorithm) doesn't apply once flat config resolves plugins via normal `require`/`import` |
| `globals`                                   | —                           | new dependency              | replaces `env` blocks, see decision 3                                                                                                                                                          |
| `prettier` (peer)                           | `^3.0.0`                    | unchanged                   | no eslint coupling                                                                                                                                                                             |
| `typescript` (peer)                         | `^4 \|\| ^5`                | unchanged                   | no eslint coupling                                                                                                                                                                             |
| `confusing-browser-globals` (dependency)    | present                     | unchanged                   | plain global-name list, no eslint coupling                                                                                                                                                     |

## Flat config authoring shape

Each entry-point module exports an array of flat config objects (ESLint v10
resolves plugins via direct `require`/`import` in the config file itself —
no more string-based `plugins: ['import']` name resolution). Composition
mirrors the current `extends`/`overrides` structure:

- What is currently an `extends: ['./node', './prettier']` array becomes
  spreading arrays of flat config objects together, e.g.
  `[...require('./node'), ...require('./prettier')]` — Prettier still last,
  same reasoning as today (must win any rule conflicts).
- What is currently `overrides: [{ files: [...] }]` becomes flat config
  objects with a top-level `files` key in the same array, e.g. the
  TypeScript override in `index.js`/`node.js` and the test-file overrides in
  `jest.js`/`vitest.js`/`testing-library.js` become their own array entries
  scoped by `files`.
- ESLint v10 ships `@eslint/config-helpers` (`defineConfig`,
  `globalIgnores`, native nested `extends` support) as one of its own
  dependencies — worth using during implementation if it keeps the config
  files closer in spirit to today's `extends` composition rather than
  writing manual array-spreads everywhere. Final call on this deferred to
  implementation.

## Rule key renames

- `import/*` → `import-x/*` throughout `rules/node.js`.
- Vitest plugin's rule-key prefix (currently `vitest/*` in `rules/vitest.js`,
  9 lines) needs confirming against `@vitest/eslint-plugin`'s actual
  registration convention during implementation — not resolved during
  brainstorming.

## Repo dogfooding changes

- `.eslintrc` → `eslint.config.js`, extending the package's own
  `node-recommended` flat output.
- `.huskyrc` pre-commit hook and `.lintstagedrc` reference `pnpm lint`
  unchanged in spirit, but should be smoke-tested against the new flat
  config once written.
- `package.json`: `engines.node` → `^22.13.0 || >=24`; `.nvmrc` → `24`.

## README

Full rewrite required — current install instructions tell consumers to
create `.eslintrc` with `"extends": ["fluxuator"]`. Flat config consumption
looks different (spread the package's array export into the consumer's own
`eslint.config.js`). Every code sample in the README needs updating to
match.

## Explicitly out of scope / deferred to implementation-time verification

These were flagged during peer research but not fully resolved — call them
out explicitly rather than assume either way when writing the plan:

- `eslint-plugin-jest-formatting` flat-config export shape (untested;
  package hasn't been touched in a while).
- `eslint-plugin-mdx` v3 flat-config support (optional add-on, lower
  priority than the core path).
- `eslint-plugin-prettier`'s flat-config export name (`plugin:prettier/
recommended` is eslintrc-only naming — flat equivalent needs confirming,
  likely an exported `eslintPluginPrettierRecommended` config object).
- `@vitest/eslint-plugin`'s exact rule-key namespace and which of its five
  configs (`legacy-recommended`, `legacy-all`, `recommended`, `all`, `env`)
  is the right base for `vitest.js`.

## Versioning strategy

Semantic-release here uses the angular commit-analyzer preset plus a
handful of custom `releaseRules` in `package.json` (`docs`→patch,
`refactor`→minor, `style`→patch, `chore(deps)`→patch). A breaking-change
marker (`!` after type, or a `BREAKING CHANGE:` footer) overrides
type-based rules and forces a major release regardless. Work lands as
normal atomic commits on the branch; the commit that ships the migration
(or the squash-merge commit) is:

```
feat!: migrate to ESLint v10 flat config

BREAKING CHANGE: drops eslintrc support (ESLint v10 removed it entirely),
requires eslint ^9.0.0 || ^10.0.0, Node ^22.13.0 || >=24. Replaces
eslint-plugin-import with eslint-plugin-import-x (import/* → import-x/*
rule keys), eslint-plugin-vitest with @vitest/eslint-plugin, and the babel
parser with espree. Bumps @typescript-eslint, eslint-plugin-jest,
eslint-plugin-testing-library, eslint-plugin-react-hooks peer majors.
Removes @babel/* peers and @rushstack/eslint-patch (unused under flat
config).
```
