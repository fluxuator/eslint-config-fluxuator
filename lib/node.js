/**
 * Inspired by https://github.com/airbnb/javascript
 * and https://github.com/facebook/create-react-app but less opinionated.
 *
 * NOTE! When adding rules here, you need to make sure they are compatible with
 * `typescript-eslint`, as some rules such as `no-array-constructor` aren't compatible.
 */
const { defineConfig } = require('eslint/config')
const eslintJS = require('@eslint/js')
const stylisticPlugin = require('@stylistic/eslint-plugin')
const globals = require('globals')
const importX = require('eslint-plugin-import-x')
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort')
const unusedImports = require('eslint-plugin-unused-imports')
const tsESLint = require('typescript-eslint')

const fluxuatorPlugin = require('./plugins/fluxuator.plugin')
const nodeRules = require('./rules/node')
const stylisticRules = require('./rules/stylistic')
const typescriptRules = require('./rules/typescript')
const prettierConfig = require('./prettier')
const { allSupportedFiles, ignores, onlyTypeScriptFiles } = require('./shared.config')

module.exports = [
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
