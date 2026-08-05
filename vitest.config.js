export default {
  test: {
    globals: true,
    environment: 'node',
    projects: [
      {
        test: {
          name: 'UNIT',
          globals: true,
          include: ['**/*.spec.js'],
          exclude: ['**/node_modules/**', '**/*.rule.spec.js'],
        },
      },
      {
        test: {
          name: 'ESLint',
          globals: true,
          include: ['**/*.rule.spec.js'],
          exclude: ['**/node_modules/**'],
        },
      },
    ],
  },
}
