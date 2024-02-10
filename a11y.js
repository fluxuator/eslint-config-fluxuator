// https://github.com/veritem/eslint-plugin-vitest
module.exports = {
  overrides: [
    {
      files: ['**/*.{jsx,tsx}'],
      plugins: ['jsx-a11y'],
      extends: ['plugin:jsx-a11y/recommended'],
      rules: require('./rules/a11y'),
    },
  ],
}
