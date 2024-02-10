module.exports = {
  plugins: ['prettier'],
  extends: ['plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        printWidth: 120,
        singleQuote: true,
        trailingComma: 'es5',
        arrowParens: 'always',
        bracketSpacing: true,
        bracketSameLine: false,
        jsxSingleQuote: false,
        quoteProps: 'as-needed',
        tabWidth: 2,
        useTabs: false,
      },
    ],
    // NOTE: This rule is disabled in eslint-plugin-prettier due to several bugs
    // More: https://github.com/prettier/eslint-config-prettier/blob/2c842675e55b91aecaef6f997d234ebf2d220ffb/README.md#arrow-body-style-and-prefer-arrow-callback
    // Remove the following line in case of mentioned in README problems
    'arrow-body-style': ['warn', 'as-needed'],
    // This rule is more advanced than Prettier one and should be added after `prettier/prettier`
    quotes: ['warn', 'single', { avoidEscape: true }],
  },
}
