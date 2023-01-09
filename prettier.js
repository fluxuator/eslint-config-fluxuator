'use strict'

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
  },
}
