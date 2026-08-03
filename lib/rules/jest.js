/**
 * We use eslint-loader so even warnings are very visible.
 * This is why we prefer to use "WARNING" level for potential warns,
 * and we try not to use "warn" level at all.
 */
module.exports = {
  // https://github.com/jest-community/eslint-plugin-jest
  'jest/no-conditional-expect': 'warn',
  'jest/no-identical-title': 'warn',
  'jest/no-interpolation-in-snapshots': 'warn',
  'jest/no-jasmine-globals': 'warn',
  'jest/valid-describe-callback': 'warn',
  'jest/valid-expect': 'warn',
  'jest/valid-expect-in-promise': 'warn',
  'jest/valid-title': 'warn',

  // Disallow using expect outside of it, test, beforeX or afterX blocks (no-standalone-expect)
  // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-standalone-expect.md
  'jest/no-standalone-expect': 'off',
}
