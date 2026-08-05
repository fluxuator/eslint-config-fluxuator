import noClassComparisonRule from './rules/no-class-comparison.rule.js'
import restrictImportPathsRule from './rules/restrict-import-paths.rule.js'

/** @type {import("eslint").ESLint.Plugin} */
export default {
  rules: {
    'no-class-comparison': noClassComparisonRule,
    'restrict-import-paths': restrictImportPathsRule,
  },
}
