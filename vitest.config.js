module.exports = {
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 10000,
    projects: [
      {
        test: {
          name: 'UNIT',
          globals: true,
          environment: 'node',
          include: ['**/*.spec.js', '**/*.test.js'],
          exclude: ['**/node_modules/**', '**/*.rule.spec.js', '**/*.rule.test.js'],
        },
      },
      {
        test: {
          name: 'ESLint',
          globals: true,
          environment: 'node',
          testTimeout: 10000,
          include: ['**/*.rule.spec.js', '**/*.rule.test.js'],
          exclude: ['**/node_modules/**'],
        },
      },
    ],
  },
}
