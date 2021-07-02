'use strict'

/**
 * This file contains the recommended ESLint rules
 */
module.exports = {
  // Enforce camelCase naming convention ('@typescript-eslint/camelcase')
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/camelcase.md
  // '@typescript-eslint/camelcase': ['warn', {
  //   properties: 'never',
  //   ignoreDestructuring: true,
  // }],
  // This rule has been deprecated in favour of the naming-convention rule.

  // Enforces naming conventions for everything across a codebase (naming-convention)
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
  '@typescript-eslint/naming-convention': ['warn', {
    selector: 'variable',
    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    leadingUnderscore: 'allow',
  }, {
    selector: 'parameter',
    format: ['camelCase', 'PascalCase'],
    leadingUnderscore: 'allow',
  }, {
    selector: ['classProperty', 'classMethod'],
    format: ['camelCase'],
    modifiers: ['private'],
    leadingUnderscore: 'allow',
  }, {
    selector: 'memberLike',
    format: ['camelCase', 'PascalCase'],
    modifiers: ['private'],
  }, {
    selector: 'objectLiteralProperty',
    format: ['camelCase', 'PascalCase', 'snake_case'],
  }, {
    selector: 'typeLike',
    format: ['PascalCase'],
  }],

  // Prefer an interface declaration over a type literal (type T = { ... })
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-interface.md
  '@typescript-eslint/prefer-interface': 'off',

  // Require explicit return types on functions and class methods
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
  '@typescript-eslint/explicit-function-return-type': 'off',

  // Disallow usage of the any type
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
  '@typescript-eslint/no-explicit-any': 'off',

  // Require explicit accessibility modifiers on class properties and methods
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-member-accessibility.md
  '@typescript-eslint/explicit-member-accessibility': 'off',

  // Disallows the use of require statements except in import statements
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-var-requires.md
  '@typescript-eslint/no-var-requires': 'off',

  // Disallows non-null assertions using the ! postfix operator
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-non-null-assertion.md
  '@typescript-eslint/no-non-null-assertion': 'off',

  // Enforce consistent indentation (indent)
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
  '@typescript-eslint/indent': ['warn', 2, {
    SwitchCase: 1,
  }],
  // Disabled in favour of extended rule `@typescript-eslint/indent`
  indent: 'off',

  // Disallow Empty Functions
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
  '@typescript-eslint/no-empty-function': 'off',
  // Disabled in favour of extended rule `@typescript-eslint/no-empty-function`
  'no-empty-function': 'off',

  // Require a specific member delimiter style for interfaces and type literals
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
  '@typescript-eslint/member-delimiter-style': ['warn', {
    multiline: {
      delimiter: 'none',
      requireLast: true,
    },
  }],

  // Require or disallow semicolons instead of ASI
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
  '@typescript-eslint/semi': ['warn', 'never'],
  // Disabled in favour of extended rule `@typescript-eslint/semi`
  semi: 'off',

  // Other overridden rules for typescript
  'react/default-props-match-prop-types': 'off',
}
