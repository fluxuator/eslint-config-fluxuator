const jsExt = ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx'].join(',')
const tsExt = ['ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'].join(',')

module.exports.ignores = ['dist/', 'build/', 'node_modules/', 'coverage/', '.*', `!.*.{${jsExt},${tsExt}}`]

module.exports.allSupportedFiles = [`**/*.{${jsExt},${tsExt}}`]

module.exports.onlyTypeScriptFiles = [`**/*.{${tsExt}}`]

module.exports.testFiles = [`**/__tests__/**/*.{${jsExt},${tsExt}}`, `**/*.{spec,test}.{${jsExt},${tsExt}}`]

/**
 * @see https://prettier.io/docs/en/configuration.html
 */
module.exports.sharedPrettierConfig = {
  semi: false,
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: ['*.yml', '*.yaml', '*.json5'],
      options: {
        singleQuote: false,
      },
    },
  ],
}
