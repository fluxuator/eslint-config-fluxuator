// https://github.com/veritem/eslint-plugin-vitest
module.exports = {
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.{spec,test}.*'],
      plugins: ['vitest', 'jest-formatting'],
      extends: ['plugin:vitest/recommended', 'plugin:jest-formatting/recommended'],
      rules: require('./rules/vitest', './rules/jest-formatting'),
    },
  ],
}
