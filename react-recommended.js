'use strict'

module.exports = {
  extends: [
    './index',
    './jsx-runtime',
    './jest',
    './prettier', // NOTE: Prettier config should be always at the last position!
  ],
  rules: {
    // NOTE: This rule is disabled in eslint-plugin-prettier due to several bugs
    // More: https://github.com/prettier/eslint-config-prettier/blob/2c842675e55b91aecaef6f997d234ebf2d220ffb/README.md#arrow-body-style-and-prefer-arrow-callback
    // Remove the following line in case of mentioned in README problems
    'arrow-body-style': ['warn', 'as-needed'],
  },
}
