'use strict'

/**
 * This file contains the recommended ESLint rules
 */
module.exports = {
  semi: ['warn', 'never'],

  indent: ['warn', 2, {SwitchCase: 1}],

  // Enforce consistent linebreak style for operators
  // https://eslint.org/docs/rules/operator-linebreak
  'operator-linebreak': ['warn', 'before'],

  // Require Following Curly Brace Conventions
  // https://eslint.org/docs/rules/curly
  curly: 'warn',

  // Require Brace Style
  // https://eslint.org/docs/rules/brace-style
  'brace-style': 'warn',

  'max-len': ['warn', 120, 2],

  'no-multiple-empty-lines': ['warn', {max: 1, maxEOF: 1}],

  'arrow-body-style': ['warn', 'as-needed'],

  'arrow-parens': ['warn', 'as-needed', {requireForBlockBody: true}],

  quotes: ['warn', 'single'],

  'no-debugger': 'warn',

  'function-paren-newline': ['warn', 'consistent'],

  'object-curly-newline': ['warn', {consistent: true}],

  // Require or disallow trailing commas
  // https://eslint.org/docs/rules/comma-dangle
  'comma-dangle': [
    'warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    },
  ],
  'padded-blocks': ['warn', 'never'],

  'prefer-template': 'warn',

  'template-curly-spacing': ['warn', 'never'],

  'no-param-reassign': ['warn', {props: false}],

  'import/order': [
    'warn', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
    },
  ],

  'sort-imports': [
    'warn', {
      ignoreCase: false,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'single', 'multiple', 'all'],
    },
  ],

  // Prevents unnecessary path segments in import and require statements.
  // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-useless-path-segments.md
  'import/no-useless-path-segments': ['warn', {noUselessIndex: true}],

  // Reports if a module's default export is unnamed.
  // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-anonymous-default-export.md
  'import/no-anonymous-default-export': ['warn', {
    allowArray: true,
    allowArrowFunction: true,
    allowAnonymousClass: false,
    allowAnonymousFunction: true,
    allowCallExpression: true,
    allowLiteral: false,
    allowObject: true,
  }],

  // Require quotes around object literal property names
  // https://eslint.org/docs/rules/quote-props
  'quote-props': ['warn', 'as-needed'],

  // Require Object Literal Shorthand Syntax
  // https://eslint.org/docs/rules/object-shorthand
  'object-shorthand': 'warn',

  // require or disallow strict mode directives (strict)
  // https://eslint.org/docs/rules/strict
  strict: 'warn',

  // Suggest using const
  // https://eslint.org/docs/rules/prefer-const
  'prefer-const': 'warn',

  // Enforce consistent spacing inside braces
  // https://eslint.org/docs/rules/object-curly-spacing
  'object-curly-spacing': ['warn', 'always'],

  // Disallow or enforce spaces inside of brackets
  // https://eslint.org/docs/rules/array-bracket-spacing
  'array-bracket-spacing': ['warn', 'never'],

  // Disallow or enforce spaces inside of computed properties
  // https://eslint.org/docs/rules/computed-property-spacing
  'computed-property-spacing': ['warn', 'never'],

  // Require or disallow padding lines between statements
  // https://eslint.org/docs/rules/padding-line-between-statements
  'padding-line-between-statements': [
    'warn',
    {blankLine: 'always', prev: '*', next: 'return'},
    {blankLine: 'always', prev: ['const', 'let', 'var'], next: '*'},
    {blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var']},
    {blankLine: 'always', prev: 'directive', next: '*'},
    {blankLine: 'any', prev: 'directive', next: 'directive'},
    {blankLine: 'always', prev: ['case', 'default'], next: '*'},
  ],
}
