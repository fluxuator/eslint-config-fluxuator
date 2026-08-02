// https://github.com/testing-library/eslint-plugin-testing-library
const testingLibrary = require('eslint-plugin-testing-library');

const TEST_FILES = ['**/__tests__/**/*', '**/*.{spec,test}.*'];

module.exports = [
  {
    files: TEST_FILES,
    plugins: testingLibrary.configs['flat/react'].plugins,
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...require('./rules/testing-library'),
    },
  },
];
