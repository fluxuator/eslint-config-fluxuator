const { defineConfig } = require('eslint/config')
const eslintJS = require('@eslint/js')
const stylisticPlugin = require('@stylistic/eslint-plugin')
const globals = require('globals')
const importX = require('eslint-plugin-import-x')
const react = require('eslint-plugin-react')
const reactHooks = require('eslint-plugin-react-hooks')
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort')
const unusedImports = require('eslint-plugin-unused-imports')
const tsESLint = require('typescript-eslint')

const fluxuatorPlugin = require('./plugins/fluxuator.plugin')
const nodeRules = require('./rules/node')
const reactRules = require('./rules/react')
const stylisticRules = require('./rules/stylistic')
const typescriptRules = require('./rules/typescript')
const prettierConfig = require('./prettier')
const { allSupportedFiles, ignores, onlyTypeScriptFiles } = require('./shared.config')

// NOTE: Do NOT use `settings.react.version: 'detect'` here. Under real ESLint v10,
// eslint-plugin-react@7.37.5's own auto-detection falls back to `context.getFilename()`,
// an API ESLint v10 removed, and crashes any rule that resolves the React version
// (e.g. `react/no-direct-mutation-state`, prop-types rules). Resolving the version
// ourselves avoids that code path entirely.
function detectReactVersion() {
  try {
    return require(require.resolve('react/package.json', { paths: [process.cwd()] })).version
  } catch {
    return undefined
  }
}

const reactVersion = detectReactVersion()

module.exports = [
  {
    name: 'react/ignores',
    ignores,
  },
  // https://github.com/jsx-eslint/eslint-plugin-react
  {
    name: 'react/recommended',

    files: allSupportedFiles,
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'], // React 17+ JSX runtime

    settings: {
      react: {
        version: reactVersion || '999.999.999',
      },
    },
  },
  {
    name: 'react/all-files',

    files: allSupportedFiles,

    plugins: {
      '@stylistic': stylisticPlugin,
      'import-x': importX,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.es2015, // es6
        ...globals.node,
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      ...nodeRules,
      ...reactRules,
      ...stylisticRules,
    },
  },
  {
    name: 'react/typescript/fluxuator',
    files: allSupportedFiles,
    plugins: {
      fluxuator: fluxuatorPlugin,
    },
    rules: {
      'fluxuator/no-class-comparison': 'error',
    },
  },
  // TypeScript configs
  ...defineConfig(
    {
      name: 'react/typescript',

      files: onlyTypeScriptFiles,
      extends: [eslintJS.configs.recommended, ...tsESLint.configs.recommended],
      // If adding a typescript-eslint version of an existing ESLint rule,
      // make sure to disable the ESLint rule here.
      rules: typescriptRules,
    },
    {
      name: 'react/typescript/declaration-files',

      files: ['**/*.d.ts'],
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    }
  ),

  // NOTE: Prettier config should always be at the last position!
  ...prettierConfig,
]
