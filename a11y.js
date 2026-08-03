const jsxA11y = require('eslint-plugin-jsx-a11y')

module.exports = [
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: jsxA11y.flatConfigs.recommended.plugins,
    languageOptions: jsxA11y.flatConfigs.recommended.languageOptions,
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...require('./lib/rules/a11y'),
    },
  },
]
