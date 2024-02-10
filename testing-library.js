// https://github.com/testing-library/eslint-plugin-testing-library
module.exports = {
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.{spec,test}.*'],
      plugins: ['testing-library'],
      extends: ['plugin:testing-library/react'],
      rules: require('./rules/testing-library'),
    },
  ],
}
