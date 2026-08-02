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

function detectReactVersion() {
  try {
    return require(require.resolve('react/package.json', { paths: [process.cwd()] })).version
  } catch {
    return undefined
  }
}

const reactVersion = detectReactVersion()

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'import-x': importX,
      react,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
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
      react: reactVersion ? { version: reactVersion } : {},
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
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
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
