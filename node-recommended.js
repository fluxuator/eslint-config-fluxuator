'use strict'

/**
 * This file contains the recommended ESLint rules
 */
module.exports = {
  rules: require('./rules/recommended.node'),
  overrides: [
    {
      files: ['**/*.ts'],
      rules: require('./rules/recommended.typescript'),
    },
  ],
}
