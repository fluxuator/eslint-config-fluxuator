/**
 * This file contains the basic ESLint rules
 */
module.exports = {
  // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
  'default-case': 'off',
  // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
  'no-dupe-class-members': 'off',
  // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
  'no-undef': 'off',

  'react/prop-types': ['off', {}],

  // Add TypeScript specific rules (and turn off ESLint equivalents)
  '@typescript-eslint/consistent-type-assertions': 'warn',
  'no-array-constructor': 'off',
  '@typescript-eslint/no-array-constructor': 'warn',
  'no-redeclare': 'off',
  '@typescript-eslint/no-redeclare': 'warn',
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': [
    'warn',
    {
      functions: false,
      classes: false,
      variables: false,
      typedefs: false,
    },
  ],
  'no-unused-expressions': 'off',
  '@typescript-eslint/no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
    },
  ],

  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': 'off', // disabled in favor of "unused-imports/no-unused-vars"

  'no-useless-constructor': 'off',
  '@typescript-eslint/no-useless-constructor': 'warn',

  // Disallow `@ts-<directive>` comments or require descriptions after directive.
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/ban-ts-comment.md
  '@typescript-eslint/ban-ts-comment': 'warn',

  // Enforces naming conventions for everything across a codebase (naming-convention)
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
  '@typescript-eslint/naming-convention': [
    'warn',
    {
      selector: 'default',
      format: ['camelCase', 'UPPER_CASE'],
      leadingUnderscore: 'allowSingleOrDouble',
    },
    {
      selector: 'variable',
      format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
      leadingUnderscore: 'allowSingleOrDouble',
    },
    {
      selector: 'function',
      format: ['PascalCase', 'camelCase'],
    },
    {
      selector: 'parameter',
      format: ['camelCase', 'snake_case', 'PascalCase'],
      leadingUnderscore: 'allowSingleOrDouble',
    },
    {
      selector: 'property',
      format: ['camelCase', 'PascalCase', 'snake_case'],
      leadingUnderscore: 'allowSingleOrDouble',
    },
    {
      selector: 'property',
      format: null,
      filter: {
        regex: 'aria-[a-z]+',
        match: true,
      },
      leadingUnderscore: 'allowSingleOrDouble',
    },
    {
      selector: ['classProperty', 'classMethod'],
      format: ['camelCase'],
      modifiers: ['private'],
      leadingUnderscore: 'allowSingleOrDouble',
    },
    {
      selector: 'memberLike',
      format: ['camelCase', 'PascalCase'],
      modifiers: ['private'],
      leadingUnderscore: 'allowSingleOrDouble',
    },
    {
      selector: 'objectLiteralProperty',
      format: null,
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },
    {
      selector: 'enumMember',
      format: ['camelCase', 'UPPER_CASE'],
    },
  ],

  // Prefer an interface declaration over a type literal (type T = { ... })
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-interface.md
  '@typescript-eslint/prefer-interface': 'off',

  // Require explicit return types on functions and class methods
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
  '@typescript-eslint/explicit-function-return-type': 'off',

  // Disallow usage of any type
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
  '@typescript-eslint/indent': [
    'warn',
    2,
    {
      SwitchCase: 1,
    },
  ],
  // Disabled in favour of extended rule `@typescript-eslint/indent`
  indent: 'off',

  // Disallow Empty Functions
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
  '@typescript-eslint/no-empty-function': 'off',
  // Disabled in favour of extended rule `@typescript-eslint/no-empty-function`
  'no-empty-function': 'off',

  // Require a specific member delimiter style for interfaces and type literals
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
  '@typescript-eslint/member-delimiter-style': [
    'warn',
    {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
    },
  ],

  // Enforce consistent usage of type imports
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/consistent-type-imports.md
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    {
      prefer: 'no-type-imports',
    },
  ],

  // Require or disallow semicolons instead of ASI
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
  // '@typescript-eslint/semi': ['warn', 'never'],
  // Disabled in favour of extended rule `@typescript-eslint/semi`
  // semi: 'off',

  // Other overridden rules for typescript
  'react/default-props-match-prop-types': 'off',

  // Forbid certain propTypes
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
  'react/forbid-prop-types': 'off',
};
