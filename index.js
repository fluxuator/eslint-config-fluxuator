'use strict'

/**
 * Inspired by https://github.com/airbnb/javascript
 * and https://github.com/facebook/create-react-app but less opinionated.
 *
 * NOTE! When adding rules here, you need to make sure they are compatible with
 * `typescript-eslint`, as some rules such as `no-array-constructor` aren't compatible.
 */
module.exports = {
  root: true,

  parser: '@babel/eslint-parser',

  plugins: [
    'import',
    'jsx-a11y',
    'react',
    'react-hooks',
  ],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
      },
      plugins: [
        '@typescript-eslint',
      ],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: require('./rules/typescript'),
    },
  ],

  rules: Object.assign(
    require('./rules/node'),
    require('./rules/react'),
    require('./rules/a11y'),
  ),
}
