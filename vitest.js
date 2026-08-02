// https://github.com/vitest-dev/eslint-plugin-vitest
const vitest = require('@vitest/eslint-plugin')

const TEST_FILES = ['**/__tests__/**/*', '**/*.{spec,test}.*']

module.exports = [
  {
    files: TEST_FILES,
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...require('./rules/vitest'),
    },
  },
]
