const jest = require('eslint-plugin-jest');

const TEST_FILES = ['**/__tests__/**/*', '**/*.{spec,test}.*'];

module.exports = [
  {
    files: TEST_FILES,
    plugins: jest.configs['flat/recommended'].plugins,
    languageOptions: jest.configs['flat/recommended'].languageOptions,
    rules: {
      ...jest.configs['flat/recommended'].rules,
      ...require('./rules/jest'),
    },
  },
];
