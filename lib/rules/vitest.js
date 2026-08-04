/**
 * We use eslint-loader so even warnings are very visible.
 * This is why we prefer to use "WARNING" level for potential warns,
 * and we try not to use "warn" level at all.
 */
module.exports = {
  // https://github.com/veritem/eslint-plugin-vitest
  'vitest/consistent-test-it': ['warn', { fn: 'it' }],

  // https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/expect-expect.md
  // https://github.com/mmkal/expect-type?tab=readme-ov-file#jest--eslint-plugin-jest
  'vitest/expect-expect': [
    'warn',
    {
      assertFunctionNames: ['expect', 'expectTypeOf'],
    },
  ],
  // https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/valid-title.md
  'vitest/valid-title': [
    'error',
    {
      // Allow functions or classes as title of `describe` block
      ignoreTypeOfDescribeName: true,
    },
  ],
  // https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/no-importing-vitest-globals.md
  'vitest/no-importing-vitest-globals': 'warn',
}
