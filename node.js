module.exports = {
  root: true,

  plugins: ['import', 'unused-imports'],

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
  },

  rules: require('./rules/node'),

  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
      },
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: require('./rules/typescript'),
    },
  ],
}
