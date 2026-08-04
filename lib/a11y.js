const jsxA11y = require('eslint-plugin-jsx-a11y')

const a11yRules = require('./rules/a11y')
const { allSupportedFiles } = require('./shared.config')

module.exports = [
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
