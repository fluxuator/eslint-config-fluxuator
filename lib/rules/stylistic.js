/**
 * https://eslint.style/packages/default
 * https://eslint.style/guide/migration
 */
module.exports = {
  '@stylistic/semi': ['warn', 'never'],

  // Enforce consistent indentation (indent)
  '@stylistic/indent': [
    'warn',
    2,
    {
      SwitchCase: 1,
      offsetTernaryExpressions: true,
    },
  ],

  // Require a specific member delimiter style for interfaces and type literals
  '@stylistic/member-delimiter-style': [
    'warn',
    {
      multiline: {
        delimiter: 'none',
        requireLast: true,
      },
    },
  ],
}
