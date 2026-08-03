const globals = require('globals')
const importX = require('eslint-plugin-import-x')
const unusedImports = require('eslint-plugin-unused-imports')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
  {
    files: ['**/*.{js,cjs,mjs,ts,mts,cts}'],
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: require('./lib/rules/node'),
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    // If adding a typescript-eslint version of an existing ESLint rule,
    // make sure to disable the ESLint rule here.
    rules: require('./lib/rules/typescript'),
  },
]
