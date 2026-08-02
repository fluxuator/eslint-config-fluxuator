const mdx = require('eslint-plugin-mdx')

module.exports = [
  {
    ...mdx.flat,
    files: ['**/*.mdx'],
  },
]
