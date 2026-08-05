import testingLibrary from 'eslint-plugin-testing-library'

import testingLibraryRules from './rules/testing-library.js'
import { testFiles } from './shared.config.js'

export default [
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
