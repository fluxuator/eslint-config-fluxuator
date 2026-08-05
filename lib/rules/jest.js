/**
 * We use eslint-loader so even warnings are very visible.
 * This is why we prefer to use "WARNING" level for potential warns,
 * and we try not to use "warn" level at all.
 */
export default {
  // https://github.com/jest-community/eslint-plugin-jest
  'jest/no-conditional-expect': 'warn',
  'jest/no-identical-title': 'warn',
  'jest/no-interpolation-in-snapshots': 'warn',
  'jest/no-jasmine-globals': 'warn',
  'jest/valid-describe-callback': 'warn',
  'jest/valid-expect': 'warn',
  'jest/valid-expect-in-promise': 'warn',

  // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/valid-title.md
  'jest/valid-title': [
    'warn',
    {
      // Allow functions or classes as title of `describe` block
      ignoreTypeOfDescribeName: true,
    },
  ],

  // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/expect-expect.md
  // https://github.com/mmkal/expect-type?tab=readme-ov-file#jest--eslint-plugin-jest
  'jest/expect-expect': [
    'warn',
    {
      assertFunctionNames: ['expect', 'expectTypeOf'],
    },
  ],

  // Disallow using expect outside of it, test, beforeX or afterX blocks (no-standalone-expect)
  // https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-standalone-expect.md
  'jest/no-standalone-expect': 'off',
}
