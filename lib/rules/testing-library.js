/**
 * We use eslint-loader so even warnings are very visible.
 * This is why we prefer to use "WARNING" level for potential warns,
 * and we try not to use "warn" level at all.
 */
module.exports = {
  // https://github.com/testing-library/eslint-plugin-testing-library
  'testing-library/await-async-queries': 'warn',
  'testing-library/await-async-utils': 'warn',
  'testing-library/no-await-sync-queries': 'warn',
  'testing-library/no-container': 'warn',
  'testing-library/no-debugging-utils': 'warn',
  'testing-library/no-dom-import': ['warn', 'react'],
  'testing-library/no-node-access': 'warn',
  'testing-library/no-promise-in-fire-event': 'warn',
  'testing-library/no-render-in-lifecycle': 'warn',
  'testing-library/no-unnecessary-act': 'warn',
  'testing-library/no-wait-for-multiple-assertions': 'warn',
  'testing-library/no-wait-for-side-effects': 'warn',
  'testing-library/no-wait-for-snapshot': 'warn',
  'testing-library/prefer-find-by': 'warn',
  'testing-library/prefer-presence-queries': 'warn',
  'testing-library/prefer-query-by-disappearance': 'warn',
  'testing-library/prefer-screen-queries': 'warn',
  'testing-library/render-result-naming-convention': 'warn',
}
