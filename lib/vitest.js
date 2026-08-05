// https://github.com/vitest-dev/eslint-plugin-vitest
import vitest from '@vitest/eslint-plugin'

import vitestRules from './rules/vitest.js'
import { testFiles } from './shared.config.js'

export default [
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
