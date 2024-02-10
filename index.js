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

  plugins: ['import', 'react', 'react-hooks', 'unused-imports'],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },

  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  rules: Object.assign({}, require('./rules/node'), require('./rules/react')),

  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
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
  ],
}
