'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  root: true,

  plugins: ['import'],

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
}
