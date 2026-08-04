const testingLibrary = require('eslint-plugin-testing-library')

const testingLibraryRules = require('./rules/testing-library')
const { testFiles } = require('./shared.config')

module.exports = [
  // https://github.com/testing-library/eslint-plugin-testing-library
  {
    name: 'testing-library',
    files: testFiles,
    ...testingLibrary.configs['flat/react'],
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...testingLibraryRules,
    },
  },
]
