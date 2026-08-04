const jestPlugin = require('eslint-plugin-jest')

const jestRules = require('./rules/jest')
const { testFiles } = require('./shared.config')

/**
 * @param {number|string} version
 */
module.exports = function (version) {
  return [
    {
      name: 'jest',
      files: testFiles,
      ...jestPlugin.configs['flat/recommended'],
      settings: {
        jest: {
          version: version.toString(),
        },
      },
      rules: {
        ...jestPlugin.configs['flat/recommended'].rules,
        ...jestRules,
      },
    },
  ]
}
