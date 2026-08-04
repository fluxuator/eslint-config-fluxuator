// https://github.com/vitest-dev/eslint-plugin-vitest
const vitest = require('@vitest/eslint-plugin')

const vitestRules = require('./rules/vitest')
const { testFiles } = require('./shared.config')

module.exports = [
  {
    name: 'vitest',

    files: testFiles,
    plugins: {
      vitest,
    },
    languageOptions: vitest.configs.env.languageOptions,
    rules: {
      ...vitest.configs.recommended.rules,
      ...vitestRules,
    },
  },
]
