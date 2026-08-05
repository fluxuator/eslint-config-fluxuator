import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended'

import { allSupportedFiles, sharedPrettierConfig } from './shared.config.js'

export default [
  {
    name: 'prettier/recommended',
    ...prettierRecommendedConfig,
  },
  {
    name: 'prettier/overrides',
    files: allSupportedFiles,
    rules: {
      'prettier/prettier': ['warn', sharedPrettierConfig],

      // This rule is more advanced than the Prettier one and should be added after `prettier/prettier`
      quotes: ['warn', 'single', { avoidEscape: true }],

      // Formatting for indentation is handled by Prettier
      '@stylistic/indent': 'off',

      // NOTE: This rule is disabled in eslint-plugin-prettier due to several bugs
      // More: https://github.com/prettier/eslint-config-prettier/blob/2c842675e55b91aecaef6f997d234ebf2d220ffb/
      // README.md#arrow-body-style-and-prefer-arrow-callback
      // Remove the following line in case of mentioned in README problems
      'arrow-body-style': ['warn', 'as-needed'],

      // This rule still can be used just fine with Prettier
      // as long as you don't use the "multi-line" or "multi-or-nest" option.
      // Option 'all' is fine.
      // https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#curly
      curly: ['warn', 'all'],
    },
  },
]
