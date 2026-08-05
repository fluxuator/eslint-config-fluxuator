import jsxA11y from 'eslint-plugin-jsx-a11y'

import a11yRules from './rules/a11y.js'
import { allSupportedFiles } from './shared.config.js'

export default [
  // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
  {
    files: allSupportedFiles,
    ...jsxA11y.flatConfigs.recommended,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...a11yRules,
    },
  },
]
