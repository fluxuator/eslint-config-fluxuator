/**
 * Inspired by https://github.com/airbnb/javascript
 * and https://github.com/facebook/create-react-app but less opinionated.
 *
 * NOTE! When adding rules here, you need to make sure they are compatible with
 * `typescript-eslint`, as some rules such as `no-array-constructor` aren't compatible.
 */
import eslintJS from '@eslint/js'
import stylisticPlugin from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import importX from 'eslint-plugin-import-x'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tsESLint from 'typescript-eslint'

import fluxuatorPlugin from './plugins/fluxuator.plugin.js'
import nodeRules from './rules/node.js'
import stylisticRules from './rules/stylistic.js'
import typescriptRules from './rules/typescript.js'
import prettierConfig from './prettier.js'
import { allSupportedFiles, ignores, onlyTypeScriptFiles } from './shared.config.js'

export default [
  {
    name: 'nodejs/ignores',
    ignores,
  },
  {
    name: 'nodejs/all-files',

    files: allSupportedFiles,

    plugins: {
      '@stylistic': stylisticPlugin,
      'import-x': importX,
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      ...nodeRules,
      ...stylisticRules,
    },
  },
  {
    name: 'nodejs/typescript/fluxuator',
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
      name: 'nodejs/typescript',
      files: onlyTypeScriptFiles,
      extends: [eslintJS.configs.recommended, ...tsESLint.configs.recommended],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: typescriptRules,
    },
    {
      name: 'nodejs/typescript/declaration-files',
      files: ['**/*.d.ts'],
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    }
  ),

  // NOTE: Prettier config should always be at the last position!
  ...prettierConfig,
]
