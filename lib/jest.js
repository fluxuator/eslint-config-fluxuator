import jestPlugin from 'eslint-plugin-jest'

import jestRules from './rules/jest.js'
import { testFiles } from './shared.config.js'

/**
 * @param {number|string} version
 */
export default function (version) {
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
