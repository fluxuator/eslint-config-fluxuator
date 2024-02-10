module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [1, 'always', Infinity],
    'body-max-line-length': [1, 'always', Infinity],
    'footer-max-line-length': [1, 'always', Infinity],
    'subject-case': [1, 'never'],
  },
}
