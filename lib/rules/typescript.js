/**
 * Rules that do not require TypeScript type information.
 */
const rules = {
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
  // https://eslint.org/docs/latest/rules/no-redeclare
  // Disallow variable redeclaration
  'no-redeclare': 'off',
  // https://typescript-eslint.io/rules/no-redeclare/
  '@typescript-eslint/no-redeclare': 'off',
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
  // https://typescript-eslint.io/rules/naming-convention/
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
      selector: 'import',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
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
      selector: 'objectLiteralMethod',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    },
    {
      selector: 'typeLike',
      format: ['PascalCase'],
    },
    {
      selector: 'enumMember',
      format: ['PascalCase', 'UPPER_CASE'],
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

  // Disallow Empty Functions
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
  '@typescript-eslint/no-empty-function': 'off',
  // Disabled in favour of extended rule `@typescript-eslint/no-empty-function`
  'no-empty-function': 'off',

  // Enforce consistent usage of type imports
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/consistent-type-imports.md
  '@typescript-eslint/consistent-type-imports': [
    'warn',
    {
      prefer: 'no-type-imports',
    },
  ],

  // https://typescript-eslint.io/rules/no-empty-object-type/
  '@typescript-eslint/no-empty-object-type': [
    'warn',
    {
      allowInterfaces: 'with-single-extends',
    },
  ],

  // Other overridden rules for typescript
  'react/default-props-match-prop-types': 'off',

  // Forbid certain propTypes
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
  'react/forbid-prop-types': 'off',
}

/**
 * Rules that require TypeScript's project service.
 */
export const typeAwareRules = {
  // https://typescript-eslint.io/rules/no-floating-promises/
  '@typescript-eslint/no-floating-promises': 'warn',
}

export default rules
