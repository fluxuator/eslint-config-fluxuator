'use strict'

/**
 * This file contains the recommended ESLint rules
 */
module.exports = {
  rules: Object.assign(
    require('./rules/recommended.node'),
    require('./rules/recommended.react'),
  ),
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: require('./rules/recommended.typescript'),
    },
  ],
}
