module.exports = {
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.{spec,test}.*'],
      plugins: ['jest', 'jest-formatting'],
      extends: ['plugin:jest/recommended', 'plugin:jest-formatting/recommended'],
      env: {
        'jest/globals': true,
      },
      rules: require('./rules/jest', './rules/jest-formatting'),
    },
  ],
}
