# ESLint v10 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `eslint-config-fluxuator` from eslintrc-format shareable configs to flat config, so it works under ESLint v10 (which removed eslintrc support entirely), and release it as a major version bump.

**Architecture:** Every top-level entry-point file (`index.js`, `node.js`, `*-recommended.js`, `jest.js`, `vitest.js`, `testing-library.js`, `prettier.js`, `a11y.js`, `mdx.js`, `jsx-runtime.js`) changes from exporting a single eslintrc-shaped object (`{ extends, overrides, plugins: [...strings], env }`) to exporting an **array of flat config objects**. Composition that used to go through `extends: ['./a', './b']` becomes array-spreading (`[...require('./a'), ...require('./b')]`); `overrides: [{ files }]` becomes array entries carrying their own top-level `files` key. Rule content in `rules/*.js` stays almost untouched (plain rule-key objects work the same in both formats) — the only rule-key renames are `import/*` → `import-x/*` in `rules/node.js` (plugin swap) and the base parser drops from `@babel/eslint-parser` to ESLint's built-in `espree` (confirmed the shipped babel config only ever used babel for JSX parsing, which espree already does natively).

**Tech Stack:** ESLint 10.8.0, `eslint-plugin-import-x` 4.17.1, `@vitest/eslint-plugin` 1.6.x, `@typescript-eslint` 8.x, `globals` 17.8.0, pnpm.

## Global Constraints

- `eslint` peer: `^9.0.0 || ^10.0.0` — flat config only, no eslintrc fallback, no dual-format output.
- Node engine: `^22.13.0 || >=24` (Node 20 support explicitly dropped, even though ESLint v10 itself still allows it). `.nvmrc` → `24`.
- Package manager is pnpm only (`preinstall: npx only-allow pnpm` in `package.json` — do not use npm/yarn to install in this repo, only in the isolated scratch dirs used for verification if needed).
- No `@babel/core`, `@babel/eslint-parser`, `@babel/preset-react` anywhere in the shipped configs or `package.json` peers — base parser is ESLint's built-in `espree`.
- Plugin key for the import plugin is `import-x` (not `import`); every rule key in `rules/node.js` that starts with `import/` becomes `import-x/`.
- Every composed config file must keep Prettier last in its array (Prettier must win any conflicting stylistic rule).
- No unit test framework exists in this repo (confirmed: no `test` script, no test files). Verification for every task is a real `eslint` run against a throwaway fixture file using the real, installed `eslint@10.8.0` — create the fixture and a temp `--config` pointer, run it, confirm exact expected output, then delete both before committing. Never commit fixture/scratch files.
- Conventional commits enforced by commitlint (`commit-msg` husky hook) — every commit message must be a valid conventional-commit header.

---

### Task 1: Update `package.json` dependencies, peers, and engines

**Files:**
- Modify: `package.json`
- Modify: `.nvmrc`

**Interfaces:**
- Produces: an installed `node_modules` containing `eslint@10.8.0`, `eslint-plugin-import-x@4.17.1`, `@vitest/eslint-plugin@^1.6.0`, `globals@17.8.0`, and bumped `@typescript-eslint`/`eslint-plugin-jest`/`eslint-plugin-testing-library`/`eslint-plugin-react`/`eslint-plugin-react-hooks`/`eslint-plugin-jsx-a11y`/`eslint-plugin-mdx` — every later task's verification steps run against this real install.

- [ ] **Step 1: Edit `.nvmrc`**

Replace the entire file content (currently `v20`) with:

```
24
```

- [ ] **Step 2: Edit `package.json` `engines`**

Change:
```json
  "engines": {
    "node": ">=18"
  },
```
to:
```json
  "engines": {
    "node": "^22.13.0 || >=24"
  },
```

- [ ] **Step 3: Edit `package.json` `dependencies`**

Current:
```json
  "dependencies": {
    "@rushstack/eslint-patch": "^1.10.4",
    "confusing-browser-globals": "^1.0.11",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-unused-imports": "^4.1.4"
  },
```
Replace with:
```json
  "dependencies": {
    "confusing-browser-globals": "^1.0.11",
    "eslint-plugin-import-x": "^4.17.1",
    "eslint-plugin-unused-imports": "^4.4.1",
    "globals": "^17.8.0"
  },
```
(`@rushstack/eslint-patch` is dropped — it's never `require()`'d anywhere in this codebase, and its purpose, patching eslintrc's plugin-resolution algorithm, doesn't apply once flat config resolves plugins via normal `require`. `eslint-plugin-import` is replaced by `eslint-plugin-import-x`.)

- [ ] **Step 4: Edit `package.json` `devDependencies`**

Current:
```json
  "devDependencies": {
    "@babel/core": "^7.29.7",
    "@babel/eslint-parser": "^7.28.5",
    "@commitlint/cli": "^19.5.0",
    "@commitlint/config-conventional": "^19.5.0",
    "@commitlint/cz-commitlint": "^19.5.0",
    "@typescript-eslint/eslint-plugin": "^8.32.1",
    "@typescript-eslint/parser": "^8.19.0",
    "commitizen": "^4.3.1",
    "commitlint": "^19.5.0",
    "eslint": "^8.57.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-jest": "^28.8.3",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-testing-library": "^6.3.0",
    "git-cz": "^4.9.0",
    "husky": "^9.1.6",
    "inquirer": "^9.3.7",
    "lint-staged": "^15.2.10",
    "pinst": "^3.0.0",
    "prettier": "^3.3.3",
    "typescript": "^5.7.3"
  },
```
Replace with:
```json
  "devDependencies": {
    "@commitlint/cli": "^19.5.0",
    "@commitlint/config-conventional": "^19.5.0",
    "@commitlint/cz-commitlint": "^19.5.0",
    "@typescript-eslint/eslint-plugin": "^8.32.1",
    "@typescript-eslint/parser": "^8.19.0",
    "@vitest/eslint-plugin": "^1.6.0",
    "commitizen": "^4.3.1",
    "commitlint": "^19.5.0",
    "eslint": "^10.8.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-jest": "^29.16.0",
    "eslint-plugin-jest-formatting": "^3.1.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-mdx": "^3.8.1",
    "eslint-plugin-prettier": "^5.5.0",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-testing-library": "^7.16.2",
    "git-cz": "^4.9.0",
    "husky": "^9.1.6",
    "inquirer": "^9.3.7",
    "lint-staged": "^15.2.10",
    "pinst": "^3.0.0",
    "prettier": "^3.3.3",
    "typescript": "^5.7.3"
  },
```
(`@babel/core`/`@babel/eslint-parser` removed — no longer used. `eslint` bumped to the v10 line. `eslint-plugin-jest-formatting`, `eslint-plugin-jsx-a11y`, `eslint-plugin-mdx`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `@vitest/eslint-plugin` are added as devDependencies so later tasks in this plan can smoke-test every shipped config file against a real install, matching how `eslint-plugin-jest`/`eslint-plugin-testing-library` were already devDependencies for the same reason.)

- [ ] **Step 5: Edit `package.json` `peerDependencies`**

Current:
```json
  "peerDependencies": {
    "@babel/core": "^7.23.7",
    "@babel/eslint-parser": "^7.23.3",
    "@babel/preset-react": "^7.14.5",
    "@typescript-eslint/eslint-plugin": "^6.0.0 || ^7.0.0",
    "@typescript-eslint/parser": "^6.0.0 || ^7.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^8.5.0 || ^9.0.0",
    "eslint-plugin-jest": "^27.0.1",
    "eslint-plugin-jest-formatting": "^3.1.0",
    "eslint-plugin-jsx-a11y": "^6.4.1",
    "eslint-plugin-mdx": "^1.16.0",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react": "^7.26.1",
    "eslint-plugin-react-hooks": "^4.2.0",
    "eslint-plugin-testing-library": "^6.3.0",
    "eslint-plugin-vitest": ">=0.3.0",
    "prettier": "^3.0.0",
    "typescript": "^4 || ^5"
  },
```
Replace with:
```json
  "peerDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@vitest/eslint-plugin": "^1.6.0",
    "eslint": "^9.0.0 || ^10.0.0",
    "eslint-config-prettier": "^10.1.0",
    "eslint-plugin-jest": "^29.0.0",
    "eslint-plugin-jest-formatting": "^3.1.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "eslint-plugin-mdx": "^3.0.0",
    "eslint-plugin-prettier": "^5.5.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^7.0.0",
    "eslint-plugin-testing-library": "^7.0.0",
    "prettier": "^3.0.0",
    "typescript": "^4 || ^5"
  },
```

- [ ] **Step 6: Edit `package.json` `peerDependenciesMeta`**

Current:
```json
  "peerDependenciesMeta": {
    "@babel/core": {
      "optional": true
    },
    "@babel/eslint-parser": {
      "optional": true
    },
    "@babel/preset-react": {
      "optional": true
    },
    "@typescript-eslint/eslint-plugin": {
      "optional": true
    },
    "@typescript-eslint/parser": {
      "optional": true
    },
    "eslint-plugin-mdx": {
      "optional": true
    },
    "eslint-config-prettier": {
      "optional": true
    },
    "eslint-plugin-jest": {
      "optional": true
    },
    "eslint-plugin-jest-formatting": {
      "optional": true
    },
    "eslint-plugin-vitest": {
      "optional": true
    },
    "eslint-plugin-jsx-a11y": {
      "optional": true
    },
    "eslint-plugin-prettier": {
      "optional": true
    },
    "eslint-plugin-react": {
      "optional": true
    },
    "eslint-plugin-react-hooks": {
      "optional": true
    },
    "eslint-plugin-testing-library": {
      "optional": true
    },
    "prettier": {
      "optional": true
    },
    "typescript": {
      "optional": true
    }
  },
```
Replace with:
```json
  "peerDependenciesMeta": {
    "@typescript-eslint/eslint-plugin": {
      "optional": true
    },
    "@typescript-eslint/parser": {
      "optional": true
    },
    "@vitest/eslint-plugin": {
      "optional": true
    },
    "eslint-plugin-mdx": {
      "optional": true
    },
    "eslint-config-prettier": {
      "optional": true
    },
    "eslint-plugin-jest": {
      "optional": true
    },
    "eslint-plugin-jest-formatting": {
      "optional": true
    },
    "eslint-plugin-jsx-a11y": {
      "optional": true
    },
    "eslint-plugin-prettier": {
      "optional": true
    },
    "eslint-plugin-react": {
      "optional": true
    },
    "eslint-plugin-react-hooks": {
      "optional": true
    },
    "eslint-plugin-testing-library": {
      "optional": true
    },
    "prettier": {
      "optional": true
    },
    "typescript": {
      "optional": true
    }
  },
```

- [ ] **Step 7: Install and verify**

Run: `pnpm install`
Expected: install succeeds with no `ERESOLVE`/unmet-peer *errors* (peer *warnings* for `eslint-plugin-react`/`eslint-plugin-jsx-a11y` are expected and fine — their own declared peer ranges still lag v10 even though they work; this repo's `pnpm-lock.yaml` will record the resolution regardless).

Run: `node -e "console.log(require('eslint/package.json').version)"`
Expected: `10.8.0`

- [ ] **Step 8: Commit**

```bash
git add package.json .nvmrc pnpm-lock.yaml
git commit -m "chore(deps)!: bump eslint peer to v10, swap import/vitest plugins

BREAKING CHANGE: eslint peer is now ^9.0.0 || ^10.0.0 (was ^8.0.0). Node
engine requirement raised to ^22.13.0 || >=24. eslint-plugin-import
replaced by eslint-plugin-import-x, eslint-plugin-vitest replaced by
@vitest/eslint-plugin, @babel/* peers removed, @rushstack/eslint-patch
dependency removed. @typescript-eslint, eslint-plugin-jest,
eslint-plugin-testing-library, eslint-plugin-react-hooks peer majors
bumped."
```

---

### Task 2: Rewrite `rules/node.js` — rename `import/*` to `import-x/*`

**Files:**
- Modify: `rules/node.js`

**Interfaces:**
- Consumes: nothing new.
- Produces: `module.exports` from `rules/node.js` — an object whose keys are unchanged except the 7 import-rule keys, now consumed by Task 3 (`node.js`).

- [ ] **Step 1: Edit the import rule keys**

In `rules/node.js`, these 7 keys currently start with `import/`:
- `'import/first'`
- `'import/newline-after-import'`
- `'import/no-amd'`
- `'import/no-anonymous-default-export'`
- `'import/no-duplicates'`
- `'import/no-webpack-loader-syntax'`
- `'import/no-useless-path-segments'`

Rename every one of them to the `import-x/` prefix, keeping their values exactly as-is. For example:
```js
  // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
  'import-x/first': 'error',
  'import-x/newline-after-import': 'error',
  'import-x/no-amd': 'error',

  // Reports if a module's default export is unnamed.
  // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-anonymous-default-export.md
  'import-x/no-anonymous-default-export': [
    'warn',
    {
      allowArray: true,
      allowArrowFunction: true,
      allowAnonymousClass: false,
      allowAnonymousFunction: true,
      allowCallExpression: true,
      allowLiteral: false,
      allowObject: true,
    },
  ],

  // Reports if a resolved path is imported more than once.
  // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md#inline-type-imports
  'import-x/no-duplicates': ['warn', { 'prefer-inline': true }],

  'import-x/no-webpack-loader-syntax': 'error',
```
and further down:
```js
  // Prevents unnecessary path segments in import and require statements.
  // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-useless-path-segments.md
  'import-x/no-useless-path-segments': ['warn', { noUselessIndex: true }],
```
Every other key in the file (all the plain `no-*`/`unused-imports/*` rules, `restrictedGlobals` usage) stays exactly as it is.

- [ ] **Step 2: Verify the rename is complete**

Run: `grep -n "'import/" rules/node.js`
Expected: no output (empty — confirms no `import/` keys remain).

Run: `grep -c "'import-x/" rules/node.js`
Expected: `7`

- [ ] **Step 3: Commit**

```bash
git add rules/node.js
git commit -m "refactor(rules): rename import/* rule keys to import-x/*"
```

---

### Task 3: Rewrite `node.js` — flat config, Node base

**Files:**
- Modify: `node.js`
- Test fixture (create, verify, delete): `.tmp-verify-node.js`, `.tmp-verify-node.config.js`, `.tmp-verify-node.ts`

**Interfaces:**
- Consumes: `rules/node.js` (Task 2's renamed export), `rules/typescript.js` (unchanged).
- Produces: `module.exports` — an array of flat config objects — consumed by `node-recommended.js` (Task 5) and the repo's own `eslint.config.js` (Task 12).

- [ ] **Step 1: Replace `node.js` content**

```js
const globals = require('globals')
const importX = require('eslint-plugin-import-x')
const unusedImports = require('eslint-plugin-unused-imports')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2018,
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: require('./rules/node'),
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    // If adding a typescript-eslint version of an existing ESLint rule,
    // make sure to disable the ESLint rule here.
    rules: require('./rules/typescript'),
  },
]
```

This mirrors the original `node.js` exactly: same `env` set (`browser`, `commonjs`, `es6`→`es2021`, `jest`, `node`), same `ecmaVersion: 2018` base / `2021` TS override, same `sourceType: 'module'`, same rule files. What changed: `plugins` is now an object of imported modules (not a string array ESLint resolves by name), the TS block is a `files`-scoped array entry instead of an `overrides` entry, and there's no `parser: '@babel/eslint-parser'` (this base config never had one — only `index.js` did).

- [ ] **Step 2: Write the verification fixture**

Create `.tmp-verify-node.config.js`:
```js
module.exports = [...require('./node.js')]
```

Create `.tmp-verify-node.js`:
```js
var unused = 1;
import { foo } from 'bar';
import { baz } from 'bar';
```

Create `.tmp-verify-node.ts`:
```ts
const x: number = 1;
```

- [ ] **Step 3: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-node.config.js .tmp-verify-node.js`
Expected: reports `import-x/no-duplicates` (two imports from `'bar'`) and `unused-imports/no-unused-vars` (`unused`) — confirms the plugin rename resolved correctly and the base config loads without error.

Run: `node_modules/.bin/eslint --config .tmp-verify-node.config.js .tmp-verify-node.ts`
Expected: no parser errors (confirms `@typescript-eslint/parser` override applies to `.ts` files; `x` is used so no unused-var warning expected).

- [ ] **Step 4: Delete the fixtures**

Run: `rm .tmp-verify-node.config.js .tmp-verify-node.js .tmp-verify-node.ts`

- [ ] **Step 5: Commit**

```bash
git add node.js
git commit -m "feat(node)!: rewrite node.js as flat config

BREAKING CHANGE: node.js now exports an array of flat config objects
instead of an eslintrc-shaped object with extends/overrides."
```

---

### Task 4: Rewrite `index.js` — flat config, browser/React base (espree)

**Files:**
- Modify: `index.js`
- Test fixture (create, verify, delete): `.tmp-verify-index.config.js`, `.tmp-verify-index.jsx`

**Interfaces:**
- Consumes: `rules/node.js`, `rules/react.js`, `rules/typescript.js` (all unchanged content except Task 2's rename, already reflected via `require('./rules/node')`).
- Produces: `module.exports` — array of flat config objects — consumed by `react-recommended.js` (Task 5).

- [ ] **Step 1: Replace `index.js` content**

```js
/**
 * Inspired by https://github.com/airbnb/javascript
 * and https://github.com/facebook/create-react-app but less opinionated.
 *
 * NOTE! When adding rules here, you need to make sure they are compatible with
 * `typescript-eslint`, as some rules such as `no-array-constructor` aren't compatible.
 */
const globals = require('globals')
const importX = require('eslint-plugin-import-x')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const unusedImports = require('eslint-plugin-unused-imports')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    plugins: {
      'import-x': importX,
      react,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...require('./rules/node'),
      ...require('./rules/react'),
    },
  },
  {
    files: ['**/*.ts?(x)'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    // If adding a typescript-eslint version of an existing ESLint rule,
    // make sure to disable the ESLint rule here.
    rules: require('./rules/typescript'),
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'unused-imports/no-unused-vars': 'off',
    },
  },
]
```

Notes on what changed from the original: no `parser: '@babel/eslint-parser'` / `parserOptions.requireConfigFile` / `parserOptions.babelOptions` — those existed only to get JSX parsing, which `languageOptions.ecmaFeatures.jsx: true` now provides via the default `espree` parser. Everything else (globals set, TS override glob `**/*.ts?(x)`, `.d.ts` override, `settings.react.version: 'detect'`, rule merge) is unchanged in substance.

- [ ] **Step 2: Write the verification fixture**

Create `.tmp-verify-index.config.js`:
```js
module.exports = [...require('./index.js')]
```

Create `.tmp-verify-index.jsx`:
```jsx
function App() {
  return <div className="a"></div>;
}

export default App;
```

- [ ] **Step 3: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-index.config.js .tmp-verify-index.jsx`
Expected: reports `react/react-in-jsx-scope` (React not imported, and this base config — unlike `jsx-runtime.js` — still requires it) and/or `react/jsx-uses-react` related warnings, with **no parser error on the JSX syntax itself** — confirms espree is parsing JSX correctly without `@babel/eslint-parser`.

- [ ] **Step 4: Delete the fixtures**

Run: `rm .tmp-verify-index.config.js .tmp-verify-index.jsx`

- [ ] **Step 5: Commit**

```bash
git add index.js
git commit -m "feat(index)!: rewrite index.js as flat config, drop babel parser

BREAKING CHANGE: index.js now exports an array of flat config objects.
Base parser is ESLint's built-in espree instead of @babel/eslint-parser
(the babel parser was only ever used for JSX parsing here, which espree
already handles natively)."
```

---

### Task 5: Rewrite `jsx-runtime.js`, `node-recommended.js`, `react-recommended.js`

**Files:**
- Modify: `jsx-runtime.js`
- Modify: `node-recommended.js`
- Modify: `react-recommended.js`
- Test fixture (create, verify, delete): `.tmp-verify-react-rec.config.js`, `.tmp-verify-react-rec.jsx`

**Interfaces:**
- Consumes: `index.js` (Task 4), `node.js` (Task 3), `prettier.js` (Task 6 — must be done before this task's verification step, or reorder: see note below).
- Produces: `module.exports` arrays consumed by end users and by `jest-recommended.js`/`vitest-recommended.js` indirectly (they don't depend on these, but follow the same pattern).

> **Note:** `react-recommended.js` and `node-recommended.js` both spread `prettier.js`. Do Task 6 (`prettier.js`) before running this task's verification step, or verify only the `jsx-runtime.js`/composition-shape parts here and re-verify the Prettier-inclusive files after Task 6. This plan does Task 6 next, so do steps 1–2 here, then step 3 (verification) after Task 6 lands — reorder your working branch commits however is convenient, the two are independent code changes.

- [ ] **Step 1: Replace `jsx-runtime.js` content**

```js
const react = require('eslint-plugin-react')

module.exports = [react.configs.flat['jsx-runtime']]
```

`react.configs.flat['jsx-runtime']` is `eslint-plugin-react`'s own flat-config export for the new JSX transform — confirmed shape is `{ plugins, rules: { 'react/react-in-jsx-scope': 0, 'react/jsx-uses-react': 0 }, languageOptions }`, a direct drop-in replacement for the old `extends: ['plugin:react/jsx-runtime']`.

- [ ] **Step 2: Replace `node-recommended.js` and `react-recommended.js` content**

`node-recommended.js`:
```js
module.exports = [
  ...require('./node'),
  ...require('./prettier'), // NOTE: Prettier config should be always at the last position!
]
```

`react-recommended.js`:
```js
module.exports = [
  ...require('./index'),
  ...require('./jsx-runtime'),
  ...require('./prettier'), // NOTE: Prettier config should be always at the last position!
]
```

- [ ] **Step 3: Write the verification fixture (run after Task 6 is complete)**

Create `.tmp-verify-react-rec.config.js`:
```js
module.exports = [...require('./react-recommended.js')]
```

Create `.tmp-verify-react-rec.jsx`:
```jsx
function App() {
  return <div className="a"></div>;
}

export default App;
```

- [ ] **Step 4: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-react-rec.config.js .tmp-verify-react-rec.jsx`
Expected: **no** `react/react-in-jsx-scope` warning (jsx-runtime override turned it off, unlike Task 4's plain `index.js` test) — confirms the composition order (`index` → `jsx-runtime` → `prettier`) applies correctly, with jsx-runtime's rule-off winning over index's rule-on.

- [ ] **Step 5: Delete the fixtures**

Run: `rm .tmp-verify-react-rec.config.js .tmp-verify-react-rec.jsx`

- [ ] **Step 6: Commit**

```bash
git add jsx-runtime.js node-recommended.js react-recommended.js
git commit -m "feat!: rewrite jsx-runtime, node-recommended, react-recommended as flat config

BREAKING CHANGE: these now export arrays of flat config objects, composed
via array spreading instead of eslintrc extends chains."
```

---

### Task 6: Rewrite `prettier.js`

**Files:**
- Modify: `prettier.js`
- Test fixture (create, verify, delete): `.tmp-verify-prettier.config.js`, `.tmp-verify-prettier.js`

**Interfaces:**
- Consumes: nothing from this package.
- Produces: `module.exports` — array of flat config objects — consumed by `node-recommended.js`, `react-recommended.js` (Task 5).

- [ ] **Step 1: Replace `prettier.js` content**

```js
const prettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = [
  prettierRecommended,
  {
    rules: {
      'prettier/prettier': [
        'warn',
        {
          semi: false,
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'es5',
          arrowParens: 'always',
          bracketSpacing: true,
          bracketSameLine: false,
          jsxSingleQuote: false,
          quoteProps: 'as-needed',
          tabWidth: 2,
          useTabs: false,
        },
      ],
      // NOTE: This rule is disabled in eslint-plugin-prettier due to several bugs
      // More: https://github.com/prettier/eslint-config-prettier/blob/2c842675e55b91aecaef6f997d234ebf2d220ffb/README.md#arrow-body-style-and-prefer-arrow-callback
      // Remove the following line in case of mentioned in README problems
      'arrow-body-style': ['warn', 'as-needed'],
      // This rule is more advanced than Prettier one and should be added after `prettier/prettier`
      quotes: ['warn', 'single', { avoidEscape: true }],
    },
  },
]
```

`require('eslint-plugin-prettier/recommended')` is the confirmed flat-config replacement for the old `extends: ['plugin:prettier/recommended']` — its shape is `{ name, plugins, rules }` and it already bundles `eslint-config-prettier`'s rule-disabling internally (same as the eslintrc version did), so there's no separate `require('eslint-config-prettier')` needed here.

- [ ] **Step 2: Write the verification fixture**

Create `.tmp-verify-prettier.config.js`:
```js
module.exports = [...require('./prettier.js')]
```

Create `.tmp-verify-prettier.js` (double-quoted string, violates the configured `quotes` rule and Prettier formatting):
```js
const x = "hello"
```

- [ ] **Step 3: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-prettier.config.js .tmp-verify-prettier.js`
Expected: reports both `quotes` (double quote used, single required) and `prettier/prettier` (missing semicolon is fine per config since `semi: false`, but the double-quote string itself is also a Prettier formatting violation given `singleQuote: true`).

- [ ] **Step 4: Delete the fixtures**

Run: `rm .tmp-verify-prettier.config.js .tmp-verify-prettier.js`

- [ ] **Step 5: Commit**

```bash
git add prettier.js
git commit -m "feat(prettier)!: rewrite prettier.js as flat config

BREAKING CHANGE: prettier.js now exports an array of flat config objects
built on eslint-plugin-prettier's own flat 'recommended' export."
```

---

### Task 7: Rewrite `a11y.js`

**Files:**
- Modify: `a11y.js`
- Test fixture (create, verify, delete): `.tmp-verify-a11y.config.js`, `.tmp-verify-a11y.jsx`

**Interfaces:**
- Consumes: `rules/a11y.js` (unchanged).
- Produces: `module.exports` — array of flat config objects — standalone optional add-on, not consumed by any other file in this package.

- [ ] **Step 1: Replace `a11y.js` content**

```js
const jsxA11y = require('eslint-plugin-jsx-a11y')

module.exports = [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: jsxA11y.flatConfigs.recommended.plugins,
    languageOptions: jsxA11y.flatConfigs.recommended.languageOptions,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...require('./rules/a11y'),
    },
  },
]
```

`jsxA11y.flatConfigs.recommended` is the confirmed flat-config export (shape `{ languageOptions, name, plugins, rules }`, no `files` key of its own) — the direct replacement for `extends: ['plugin:jsx-a11y/recommended']`. Same `files: ['**/*.{jsx,tsx}']` scope as the original override.

- [ ] **Step 2: Write the verification fixture**

Create `.tmp-verify-a11y.config.js`:
```js
module.exports = [...require('./a11y.js')]
```

Create `.tmp-verify-a11y.jsx`:
```jsx
function App() {
  return <img src="a.png" />;
}

export default App;
```

- [ ] **Step 3: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-a11y.config.js .tmp-verify-a11y.jsx`
Expected: reports `jsx-a11y/alt-text` (`<img>` missing `alt`) — confirms both the plugin's bundled recommended rules and this package's own `rules/a11y.js` overrides are active.

- [ ] **Step 4: Delete the fixtures**

Run: `rm .tmp-verify-a11y.config.js .tmp-verify-a11y.jsx`

- [ ] **Step 5: Commit**

```bash
git add a11y.js
git commit -m "feat(a11y)!: rewrite a11y.js as flat config

BREAKING CHANGE: a11y.js now exports an array of flat config objects
built on eslint-plugin-jsx-a11y's own flatConfigs.recommended export."
```

---

### Task 8: Rewrite `jest.js` and `jest-recommended.js`

**Files:**
- Modify: `jest.js`
- Modify: `jest-recommended.js`
- Test fixture (create, verify, delete): `.tmp-verify-jest.config.js`, `.tmp-verify-jest.test.js`

**Interfaces:**
- Consumes: `rules/jest.js` (unchanged), `rules/jest-formatting.js` (still empty, no longer required directly — see note), `testing-library.js` (Task 10, for `jest-recommended.js`).
- Produces: `module.exports` arrays. `jest-recommended.js` is a standalone convenience bundle, consumed by nothing else in this package.

> Note: the original `jest.js` had `rules: require('./rules/jest', './rules/jest-formatting')` — `require()` only ever takes one argument, so the second path was silently ignored. This had zero practical effect (`rules/jest-formatting.js` is `module.exports = {}`, and the real jest-formatting rules came from the `extends: ['plugin:jest-formatting/recommended']` line instead), but the flat rewrite below fixes the pattern properly by pulling jest-formatting's rules from its own bundled config object.

- [ ] **Step 1: Replace `jest.js` content**

```js
const jest = require('eslint-plugin-jest')
const jestFormatting = require('eslint-plugin-jest-formatting')

const TEST_FILES = ['**/__tests__/**/*', '**/*.{spec,test}.*']

module.exports = [
  {
    files: TEST_FILES,
    plugins: jest.configs['flat/recommended'].plugins,
    languageOptions: jest.configs['flat/recommended'].languageOptions,
    rules: {
      ...jest.configs['flat/recommended'].rules,
      ...require('./rules/jest'),
    },
  },
  {
    files: TEST_FILES,
    plugins: {
      'jest-formatting': jestFormatting,
    },
    rules: jestFormatting.configs.recommended.overrides[0].rules,
  },
]
```

`jest.configs['flat/recommended']` (confirmed shape `{ plugins, languageOptions, rules }`, `languageOptions.globals` already includes the jest globals — `describe`/`test`/`expect`/etc — replacing the old `env: { 'jest/globals': true }`) is the flat replacement for `extends: ['plugin:jest/recommended']`. `eslint-plugin-jest-formatting` has not been updated for flat config — its `configs.recommended` is still the old eslintrc shape (`{ plugins: ['jest-formatting'], overrides: [{ files, rules }] }`) — so its rules are pulled out manually via `.overrides[0].rules` and applied under this package's own `TEST_FILES` scope (matching how the original single `overrides` block applied both plugins' rules under one file glob).

- [ ] **Step 2: Replace `jest-recommended.js` content**

```js
module.exports = [...require('./jest'), ...require('./testing-library')]
```

- [ ] **Step 3: Write the verification fixture**

Create `.tmp-verify-jest.config.js`:
```js
module.exports = [...require('./jest.js')]
```

Create `.tmp-verify-jest.test.js`:
```js
describe('a', () => {
  test('b', () => {
    expect(true).toBe(true)
  })
})
test('c', () => {
  expect(true).toBe(true)
})
```

- [ ] **Step 4: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-jest.config.js .tmp-verify-jest.test.js`
Expected: reports `jest-formatting/padding-around-describe-blocks` and/or `jest-formatting/padding-around-test-blocks` (missing blank line between the `describe` block and the trailing `test` block) — confirms jest-formatting's rules are actually wired up (this is the exact class of thing the original `require()` bug silently skipped, now fixed). No `jest/*` errors expected since `describe`/`test`/`expect` are correctly recognized as jest globals.

- [ ] **Step 5: Delete the fixtures**

Run: `rm .tmp-verify-jest.config.js .tmp-verify-jest.test.js`

- [ ] **Step 6: Commit**

```bash
git add jest.js jest-recommended.js
git commit -m "feat(jest)!: rewrite jest.js and jest-recommended.js as flat config

BREAKING CHANGE: jest.js and jest-recommended.js now export arrays of
flat config objects. Also fixes a latent bug where rules/jest-formatting
overrides were silently dropped by a multi-argument require() call —
jest-formatting's bundled rules are now correctly applied."
```

---

### Task 9: Rewrite `vitest.js` and `vitest-recommended.js`

**Files:**
- Modify: `vitest.js`
- Modify: `vitest-recommended.js`
- Test fixture (create, verify, delete): `.tmp-verify-vitest.config.js`, `.tmp-verify-vitest.test.js`

**Interfaces:**
- Consumes: `rules/vitest.js` (unchanged — confirmed `@vitest/eslint-plugin` still registers under the `vitest` plugin key, so the existing `vitest/consistent-test-it` rule key needs no rename), `rules/jest-formatting.js` (same note as Task 8), `testing-library.js` (Task 10).
- Produces: `module.exports` arrays. `vitest-recommended.js` is a standalone convenience bundle.

- [ ] **Step 1: Replace `vitest.js` content**

```js
// https://github.com/vitest-dev/eslint-plugin-vitest
const vitest = require('@vitest/eslint-plugin')
const jestFormatting = require('eslint-plugin-jest-formatting')

const TEST_FILES = ['**/__tests__/**/*', '**/*.{spec,test}.*']

module.exports = [
  {
    files: TEST_FILES,
    plugins: {
      vitest: vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...require('./rules/vitest'),
    },
  },
  {
    files: TEST_FILES,
    plugins: {
      'jest-formatting': jestFormatting,
    },
    rules: jestFormatting.configs.recommended.overrides[0].rules,
  },
]
```

Replaces the old `eslint-plugin-vitest` (unmaintained, crashes under real ESLint v10 — see design spec) with `@vitest/eslint-plugin`, published by the Vitest project itself. Confirmed its `configs.recommended` is `{ name, plugins: { vitest }, rules }` with rule keys still prefixed `vitest/*` — same plugin key as before, so `rules/vitest.js` (`'vitest/consistent-test-it': ['warn', { fn: 'it' }]`) needs no changes.

- [ ] **Step 2: Replace `vitest-recommended.js` content**

```js
module.exports = [...require('./vitest'), ...require('./testing-library')]
```

- [ ] **Step 3: Write the verification fixture**

Create `.tmp-verify-vitest.config.js`:
```js
module.exports = [...require('./vitest.js')]
```

Create `.tmp-verify-vitest.test.js`:
```js
describe('a', () => {
  it('b', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 4: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-vitest.config.js .tmp-verify-vitest.test.js`
Expected: no crash on load (confirms `@vitest/eslint-plugin` requires and runs cleanly under `eslint@10.8.0`, unlike the old `eslint-plugin-vitest`). No `vitest/consistent-test-it` violation expected since the fixture already uses `it`.

- [ ] **Step 5: Delete the fixtures**

Run: `rm .tmp-verify-vitest.config.js .tmp-verify-vitest.test.js`

- [ ] **Step 6: Commit**

```bash
git add vitest.js vitest-recommended.js
git commit -m "feat(vitest)!: replace eslint-plugin-vitest with @vitest/eslint-plugin

BREAKING CHANGE: vitest.js and vitest-recommended.js now export arrays
of flat config objects, built on @vitest/eslint-plugin (the actively
maintained, Vitest-project-published plugin) instead of the unmaintained
eslint-plugin-vitest, which crashes when loaded under real ESLint v10."
```

---

### Task 10: Rewrite `testing-library.js`

**Files:**
- Modify: `testing-library.js`
- Test fixture (create, verify, delete): `.tmp-verify-tl.config.js`, `.tmp-verify-tl.test.js`

**Interfaces:**
- Consumes: `rules/testing-library.js` (unchanged).
- Produces: `module.exports` — array of flat config objects — consumed by `jest-recommended.js` (Task 8) and `vitest-recommended.js` (Task 9).

- [ ] **Step 1: Replace `testing-library.js` content**

```js
// https://github.com/testing-library/eslint-plugin-testing-library
const testingLibrary = require('eslint-plugin-testing-library')

const TEST_FILES = ['**/__tests__/**/*', '**/*.{spec,test}.*']

module.exports = [
  {
    files: TEST_FILES,
    plugins: testingLibrary.configs['flat/react'].plugins,
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...require('./rules/testing-library'),
    },
  },
]
```

`testingLibrary.configs['flat/react']` (confirmed shape `{ name, plugins, rules }`) is the flat replacement for `extends: ['plugin:testing-library/react']`.

- [ ] **Step 2: Write the verification fixture**

Create `.tmp-verify-tl.config.js`:
```js
module.exports = [...require('./testing-library.js')]
```

Create `.tmp-verify-tl.test.js`:
```js
import { render, screen } from '@testing-library/react'

test('a', async () => {
  render(<div />)
  await screen.findByText('hi')
})
```

- [ ] **Step 3: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-tl.config.js .tmp-verify-tl.test.js`
Expected: no crash on load, confirming the flat config export resolves; specific rule output isn't asserted here since it depends on unrelated JSX-parse setup this minimal fixture doesn't include — the goal of this check is confirming the plugin loads and applies without error under v10, matching the pattern used for the other plugin-swap tasks.

- [ ] **Step 4: Delete the fixtures**

Run: `rm .tmp-verify-tl.config.js .tmp-verify-tl.test.js`

- [ ] **Step 5: Commit**

```bash
git add testing-library.js
git commit -m "feat(testing-library)!: rewrite testing-library.js as flat config

BREAKING CHANGE: testing-library.js now exports an array of flat config
objects built on eslint-plugin-testing-library's flat/react export."
```

---

### Task 11: Rewrite `mdx.js`

**Files:**
- Modify: `mdx.js`
- Test fixture (create, verify, delete): `.tmp-verify-mdx.config.js`, `.tmp-verify-mdx.mdx`

**Interfaces:**
- Consumes: nothing from this package.
- Produces: `module.exports` — array of flat config objects — standalone optional add-on.

- [ ] **Step 1: Replace `mdx.js` content**

```js
const mdx = require('eslint-plugin-mdx')

module.exports = [
  {
    ...mdx.flat,
    files: ['*.mdx'],
  },
]
```

`mdx.flat` (confirmed shape: a single ready-to-use flat config object with `name`, `files`, `languageOptions`, `plugins`, `processor`, `rules`) replaces `extends: 'plugin:mdx/recommended'`. Its own default `files` is `['**/*.{md,mdx}']`; overridden here to `['*.mdx']` to preserve this package's original, narrower scope (Markdown files were never linted by this config, only `.mdx`).

- [ ] **Step 2: Write the verification fixture**

Create `.tmp-verify-mdx.config.js`:
```js
module.exports = [...require('./mdx.js')]
```

Create `.tmp-verify-mdx.mdx`:
```mdx
# Hello

Some **text**.
```

- [ ] **Step 3: Run verification**

Run: `node_modules/.bin/eslint --config .tmp-verify-mdx.config.js .tmp-verify-mdx.mdx`
Expected: exits cleanly (no parse errors), confirming `mdx.flat`'s processor correctly handles a `.mdx` file under v10.

- [ ] **Step 4: Delete the fixtures**

Run: `rm .tmp-verify-mdx.config.js .tmp-verify-mdx.mdx`

- [ ] **Step 5: Commit**

```bash
git add mdx.js
git commit -m "feat(mdx)!: rewrite mdx.js as flat config

BREAKING CHANGE: mdx.js now exports an array of flat config objects
built on eslint-plugin-mdx's own flat export."
```

---

### Task 12: Dogfood — migrate the repo's own lint config

**Files:**
- Create: `eslint.config.js`
- Delete: `.eslintrc`

**Interfaces:**
- Consumes: `node-recommended.js` (Task 5).
- Produces: nothing consumed elsewhere — this is the config ESLint actually loads when you run `pnpm lint` in this repo.

- [ ] **Step 1: Create `eslint.config.js`**

```js
module.exports = [...require('./node-recommended')]
```

- [ ] **Step 2: Delete `.eslintrc`**

Run: `rm .eslintrc`

- [ ] **Step 3: Run the repo's own lint script**

Run: `pnpm lint`
Expected: exits 0 (this codebase should already be clean against its own rules — if it isn't, something in the flat rewrite changed rule behavior unexpectedly; investigate before proceeding rather than suppressing).

- [ ] **Step 4: Confirm the pre-commit hook still works end-to-end**

Run: `git add eslint.config.js && git rm .eslintrc && git commit -m "test: dry run pre-commit hook" --dry-run`

This doesn't actually commit (`--dry-run`), just confirms `lint-staged`/husky wiring doesn't choke on the new config before the real commit in Step 5. If it errors, fix `eslint.config.js`/`.lintstagedrc` before proceeding — don't skip hooks to work around it.

- [ ] **Step 5: Commit for real**

```bash
git add eslint.config.js
git rm .eslintrc
git commit -m "chore!: migrate repo's own lint config to eslint.config.js

BREAKING CHANGE: .eslintrc removed, replaced by eslint.config.js — ESLint
v10 no longer supports the eslintrc format at all."
```

---

### Task 13: Rewrite `README.md` for flat config consumption

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: nothing (documentation only).
- Produces: nothing consumed by code — this is the task where a future consumer learns how to actually use the package.

- [ ] **Step 1: Replace the React App installation section**

Replace (lines 8–57 of the current README, "React App" through the `lint`/`lint:fix` scripts section) with:

```markdown
### React App

1. Install this package and ESLint

```sh
pnpm add -D eslint-config-fluxuator eslint@^9.0.0
```

2. Create a file named `eslint.config.js` in the root folder of your project:

```js
module.exports = [...require('eslint-config-fluxuator')]
```

3. You can override the settings from `eslint-config-fluxuator` by appending your own flat config object to the array. Learn more about [configuring ESLint](https://eslint.org/docs/latest/use/configure/configuration-files) on the ESLint website.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  {
    rules: {
      'some-annoying-rule': 'off',
    },
  },
]
```

4. If you are using the new JSX transform from React 17+, spread `"fluxuator/jsx-runtime"` into the array too, to disable the relevant rules.

5. Add a script to your package.json to check your project with ESLint.

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "pnpm lint --fix --max-warnings 0"
  }
}
```
```

- [ ] **Step 2: Replace the "React App (Recommended)" section**

Replace:
```markdown
### React App (Recommended)

You can also enable all recommended rules for your React App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```json5
{
  extends: ['fluxuator/react-recommended'],
}
```

```json5
{
  extends: [
    'fluxuator/react-recommended',
    // "fluxuator/vitest-recommended"
    // "fluxuator/jest-recommended"
  ],
}
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_
```
with:
```markdown
### React App (Recommended)

You can also enable all recommended rules for your React App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```js
module.exports = [
  ...require('eslint-config-fluxuator/react-recommended'),
  // ...require('eslint-config-fluxuator/vitest-recommended'),
  // ...require('eslint-config-fluxuator/jest-recommended'),
]
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_
```

- [ ] **Step 3: Replace the "NodeJS App" and "NodeJS App (Recommended)" sections**

Replace:
```markdown
### NodeJS App

1. Install this package, ESLint and the necessary plugins

```sh
yarn add -D eslint-config-fluxuator \
            eslint@^8.0.0 \
            typescript@^5 \
              @typescript-eslint/eslint-plugin@^6 @typescript-eslint/parser@^6
```

2. Create a file named `.eslintrc` with following contents in the root folder of your project:

```json
{
  "extends": ["fluxuator/node"]
}
```

3. You can override the settings from `eslint-config-fluxuator` by editing the `.eslintrc` file. Learn more
   about [configuring ESLint](http://eslint.org/docs/user-guide/configuring) on the ESLint website.

```json
{
  "extends": ["fluxuator/node"],
  "rules": {
    "some-annoying-rule": "off"
  }
}
```

### NodeJS App (Recommended)

You can also enable all recommended rules for your NodeJS App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```json
{
  "extends": ["fluxuator/node-recommended", "fluxuator/jest"]
}
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

That's it!
```
with:
```markdown
### NodeJS App

1. Install this package, ESLint and the necessary plugins

```sh
pnpm add -D eslint-config-fluxuator \
            eslint@^9.0.0 \
            typescript@^5 \
              @typescript-eslint/eslint-plugin@^8 @typescript-eslint/parser@^8
```

2. Create a file named `eslint.config.js` in the root folder of your project:

```js
module.exports = [...require('eslint-config-fluxuator/node')]
```

3. You can override the settings from `eslint-config-fluxuator` by appending your own flat config object to the array. Learn more about [configuring ESLint](https://eslint.org/docs/latest/use/configure/configuration-files) on the ESLint website.

```js
module.exports = [
  ...require('eslint-config-fluxuator/node'),
  {
    rules: {
      'some-annoying-rule': 'off',
    },
  },
]
```

### NodeJS App (Recommended)

You can also enable all recommended rules for your NodeJS App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```js
module.exports = [
  ...require('eslint-config-fluxuator/node-recommended'),
  ...require('eslint-config-fluxuator/jest'),
]
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

That's it!
```

- [ ] **Step 4: Replace the "Extensions" section (Jest, Vitest, Testing Library, Prettier, Accessibility Checks)**

Replace the full "Extensions" section (from `## Extensions` through the end of the "Accessibility Checks" subsection, i.e. everything covering Jest/Vitest/Testing Library/Prettier/a11y installation) with:

```markdown
## Extensions

### Jest

This config also ships with optional Jest rules for ESLint (based
on [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest))

1. Install the ESLint plugin for Jest and Testing Library (if you don't already have them installed).

```sh
pnpm add -D jest eslint-plugin-jest eslint-plugin-jest-formatting
```

2. Enable these rules by spreading the Jest config into your ESLint config array.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/jest'),
]
```

### Vitest

In case you are using ViteJS as app builder, it is recommended to use Vitest instead of Jest in your app.
This config also ships with optional Vitest rules for ESLint (based
on [`@vitest/eslint-plugin`](https://github.com/vitest-dev/eslint-plugin-vitest))

1. Install the ESLint plugin for Vitest

```sh
pnpm add -D vitest @vitest/eslint-plugin eslint-plugin-jest-formatting
```

2. Enable these rules by spreading the Vitest config into your ESLint config array.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/vitest'),
]
```

### Testing Library

You can also charge your ESLint with additional power
of [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library)) rules.

```sh
pnpm add -D eslint-plugin-testing-library
```

and enable additional rules

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/vitest'),
  ...require('eslint-config-fluxuator/testing-library'),
]
```

### Prettier

This config also ships with optional Prettier rules for ESLint.

1. Install the Prettier tool (if you don't already have them installed).

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

2. Enable these rules by spreading the Prettier config into your ESLint config array. Make sure to put it
   last, so it gets the chance to override other configs.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/prettier'),
]
```

### Accessibility Checks

Some basic rules from the [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin are
activated:

If you want to enable even more accessibility rules, spread the a11y config into your ESLint config array:

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/a11y'),
]
```
```

- [ ] **Step 5: Replace the "MDX rules" section**

Replace:
```markdown
## MDX rules

This config also ships with optional [MDX](https://github.com/mdx-js/mdx) rules for ESLint (based
on [`eslint-plugin-mdx`](https://github.com/mdx-js/eslint-mdx)).

1. Install the ESLint plugin for MDX (if you don't already have it installed).

```sh
yarn add -D eslint-plugin-mdx@^1.16.0
```

2. Enable these rules by adding the MDX config to the `extends` array in your ESLint config.

```json
{
  "extends": ["fluxuator", "fluxuator/jest", "fluxuator/mdx"]
}
```
```
with:
```markdown
## MDX rules

This config also ships with optional [MDX](https://github.com/mdx-js/mdx) rules for ESLint (based
on [`eslint-plugin-mdx`](https://github.com/mdx-js/eslint-mdx)).

1. Install the ESLint plugin for MDX (if you don't already have it installed).

```sh
pnpm add -D eslint-plugin-mdx@^3.0.0
```

2. Enable these rules by spreading the MDX config into your ESLint config array.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/jest'),
  ...require('eslint-config-fluxuator/mdx'),
]
```
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for flat config consumption"
```

---

### Task 14: Final verification and release-triggering commit

**Files:** none (verification + final empty-diff commit only, if needed)

**Interfaces:** none — this task confirms the whole migration works together end to end.

- [ ] **Step 1: Full clean install and lint**

Run: `rm -rf node_modules && pnpm install && pnpm lint`
Expected: install succeeds, `pnpm lint` exits 0.

- [ ] **Step 2: Format check**

Run: `pnpm format:check`
Expected: exits 0 (all files, including the rewritten `.js` config files, pass Prettier's own check — if not, run `pnpm format:fix` and review the diff before committing).

- [ ] **Step 3: Confirm no leftover scratch files**

Run: `git status`
Expected: no untracked `.tmp-verify-*` files listed (every task above deleted its own fixtures — this is the final safety check that none were missed).

- [ ] **Step 4: Confirm the breaking-change trail exists**

Run: `git log --oneline main..HEAD | cat`
Expected: at least one commit in the branch history has a `!` after its type (every commit from Task 1 onward does) — `semantic-release`'s commit-analyzer will pick up the first one it scans and trigger a major release regardless of which commit ends up as the PR's merge commit, as long as the breaking commits aren't squashed away.

- [ ] **Step 5: Push and open the PR (only if explicitly asked to)**

This plan stops at a fully migrated, locally-verified branch. Do not push or open a PR unless the user explicitly asks — pushing and opening PRs are actions with external visibility, per this repo's own contribution norms (semantic-release runs off `main`).
