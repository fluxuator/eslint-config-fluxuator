import eslintJS from '@eslint/js'
import stylisticPlugin from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import importX from 'eslint-plugin-import-x'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import tsESLint from 'typescript-eslint'

import fluxuatorPlugin from './plugins/fluxuator.plugin.js'
import nodeRules from './rules/node.js'
import reactRules from './rules/react.js'
import stylisticRules from './rules/stylistic.js'
import typescriptRules from './rules/typescript.js'
import prettierConfig from './prettier.js'
import { allSupportedFiles, ignores, onlyTypeScriptFiles } from './shared.config.js'

// NOTE: Do NOT use `settings.react.version: 'detect'` here. Under real ESLint v10,
// eslint-plugin-react@7.37.5's own auto-detection falls back to `context.getFilename()`,
// an API ESLint v10 removed, and crashes any rule that resolves the React version
// (e.g. `react/no-direct-mutation-state`, prop-types rules). Resolving the version
// ourselves avoids that code path entirely.
//
// NOTE: `import.meta.resolve()` (stable, no second argument in Node's shipped API)
// resolves relative to *this file's own installed location*, not `process.cwd()` —
// unlike the old `require.resolve(..., {paths:[process.cwd()]})`. In practice this
// still finds a hoisted/peer `react` because Node's node_modules resolution walks
// up the directory tree from wherever this package is installed, which is always
// nested under the consumer's node_modules somewhere. Under strict resolvers (e.g.
// Yarn PnP) this can still fail even when React is installed, since `react` isn't a
// declared dependency of this package — only an optional one, via
// `peerDependenciesMeta` in package.json — for exactly this kind of best-effort
// detection. A resolution failure here is expected and handled: it falls through to
// the `'999.999.999'` fallback below.
function detectReactVersion() {
  try {
    const reactPackageJsonUrl = import.meta.resolve('react/package.json')

    return JSON.parse(fs.readFileSync(fileURLToPath(reactPackageJsonUrl), 'utf8')).version
  } catch {
    return undefined
  }
}

const reactVersion = detectReactVersion()

export default [
  {
    name: 'react/ignores',
    ignores,
  },
  // https://github.com/jsx-eslint/eslint-plugin-react
  {
    name: 'react/recommended',

    files: allSupportedFiles,
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'], // React 17+ JSX runtime

    settings: {
      react: {
        version: reactVersion || '999.999.999',
      },
    },
  },
  {
    name: 'react/all-files',

    files: allSupportedFiles,

    plugins: {
      '@stylistic': stylisticPlugin,
      'import-x': importX,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.es2015, // es6
        ...globals.node,
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      ...nodeRules,
      ...reactRules,
      ...stylisticRules,
    },
  },
  {
    name: 'react/typescript/fluxuator',
    files: allSupportedFiles,
    plugins: {
      fluxuator: fluxuatorPlugin,
    },
    rules: {
      'fluxuator/no-class-comparison': 'error',
    },
  },
  // TypeScript configs
  ...defineConfig(
    {
      name: 'react/typescript',
      files: onlyTypeScriptFiles,
      extends: [eslintJS.configs.recommended, ...tsESLint.configs.recommended],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: typescriptRules,
    },
    {
      name: 'react/typescript/declaration-files',

      files: ['**/*.d.ts'],
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    }
  ),

  // NOTE: Prettier config should always be at the last position!
  ...prettierConfig,
]
