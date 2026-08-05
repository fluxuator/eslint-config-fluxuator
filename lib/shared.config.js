const jsExt = ['js', 'cjs', 'mjs', 'jsx', 'cjsx', 'mjsx'].join(',')
const tsExt = ['ts', 'cts', 'mts', 'tsx', 'ctsx', 'mtsx'].join(',')

export const ignores = ['dist/', 'build/', 'node_modules/', 'coverage/', '.*', `!.*.{${jsExt},${tsExt}}`]

export const allSupportedFiles = [`**/*.{${jsExt},${tsExt}}`]

export const onlyTypeScriptFiles = [`**/*.{${tsExt}}`]

export const testFiles = [`**/__tests__/**/*.{${jsExt},${tsExt}}`, `**/*.{spec,test}.{${jsExt},${tsExt}}`]

/**
 * @see https://prettier.io/docs/en/configuration.html
 */
export const sharedPrettierConfig = {
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
