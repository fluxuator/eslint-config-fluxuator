const noClassComparisonRule = require('./rules/no-class-comparison.rule')
const restrictImportPathsRule = require('./rules/restrict-import-paths.rule')

/** @type {import("eslint").ESLint.Plugin} */
module.exports = {
  rules: {
    'no-class-comparison': noClassComparisonRule,
    'restrict-import-paths': restrictImportPathsRule,
  },
}
