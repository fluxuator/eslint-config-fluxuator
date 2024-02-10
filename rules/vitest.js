/**
 * We use eslint-loader so even warnings are very visible.
 * This is why we prefer to use "WARNING" level for potential warns,
 * and we try not to use "warn" level at all.
 */
module.exports = {
  // https://github.com/veritem/eslint-plugin-vitest
  'vitest/consistent-test-it': ['warn', { fn: 'it' }],
}
