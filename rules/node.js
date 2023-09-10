const restrictedGlobals = require('confusing-browser-globals');

/**
 * This file contains the basic ESLint rules
 */
module.exports = {
  // http://eslint.org/docs/rules/
  'array-callback-return': 'warn',
  'default-case': ['warn', { commentPattern: '^no default$' }],
  'dot-location': ['warn', 'property'],
  eqeqeq: ['warn', 'smart'],
  'new-parens': 'warn',
  'no-array-constructor': 'warn',
  'no-caller': 'warn',
  'no-console': 'error',
  'no-cond-assign': ['warn', 'except-parens'],
  'no-const-assign': 'warn',
  'no-control-regex': 'warn',
  'no-delete-var': 'warn',
  'no-dupe-args': 'warn',
  'no-dupe-class-members': 'warn',
  'no-dupe-keys': 'warn',
  'no-duplicate-case': 'warn',
  'no-empty-character-class': 'warn',
  'no-empty-pattern': 'warn',
  'no-eval': 'warn',
  'no-ex-assign': 'warn',
  'no-extend-native': 'warn',
  'no-extra-bind': 'warn',
  'no-extra-label': 'warn',
  'no-fallthrough': 'off',
  'no-func-assign': 'warn',
  'no-implied-eval': 'warn',
  'no-invalid-regexp': 'warn',
  'no-iterator': 'warn',
  'no-label-var': 'warn',
  'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
  'no-lone-blocks': 'warn',
  'no-loop-func': 'warn',
  'no-mixed-operators': [
    'warn',
    {
      groups: [
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
      allowSamePrecedence: false,
    },
  ],
  'no-multi-str': 'warn',
  'no-native-reassign': 'warn',
  'no-negated-in-lhs': 'warn',
  'no-new-func': 'warn',
  'no-new-object': 'warn',
  'no-new-symbol': 'warn',
  'no-new-wrappers': 'warn',
  'no-obj-calls': 'warn',
  'no-octal': 'warn',
  'no-octal-escape': 'warn',
  'no-redeclare': 'warn',
  'no-regex-spaces': 'warn',
  'no-restricted-syntax': ['warn', 'WithStatement'],
  'no-script-url': 'warn',
  'no-self-assign': 'warn',
  'no-self-compare': 'warn',
  'no-sequences': 'warn',
  'no-shadow-restricted-names': 'warn',
  'no-sparse-arrays': 'warn',
  'no-template-curly-in-string': 'warn',
  'no-this-before-super': 'warn',
  'no-throw-literal': 'warn',
  'no-undef': 'error',
  'no-restricted-globals': ['error'].concat(restrictedGlobals),
  'no-unreachable': 'warn',
  'no-unused-expressions': [
    'error',
    {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
    },
  ],
  'no-unused-labels': 'warn',

  // Disallow Unused Variables
  // https://eslint.org/docs/rules/no-unused-vars#options
  'no-unused-vars': 'off', // disabled in favor of "unused-imports/no-unused-vars"

  // Find and remove unused es6 module imports.
  // https://github.com/sweepline/eslint-plugin-unused-imports
  'unused-imports/no-unused-imports': 'warn',
  'unused-imports/no-unused-vars': [
    'warn',
    {
      vars: 'all',
      args: 'none',
      ignoreRestSiblings: true,
      varsIgnorePattern: '^(jsx$|_)',
      argsIgnorePattern: '^_',
    },
  ],

  'no-use-before-define': [
    'warn',
    {
      functions: false,
      classes: false,
      variables: false,
    },
  ],
  'no-useless-computed-key': 'warn',

  // Disallow unnecessary concatenation of strings
  // https://eslint.org/docs/rules/no-useless-concat
  'no-useless-concat': 'warn',

  'no-useless-constructor': 'warn',
  'no-useless-escape': 'warn',
  'no-useless-rename': [
    'warn',
    {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    },
  ],

  'no-with': 'warn',
  'no-whitespace-before-property': 'warn',
  'require-yield': 'warn',
  'rest-spread-spacing': ['warn', 'never'],

  // require or disallow strict mode directives (strict)
  // https://eslint.org/docs/rules/strict
  strict: 'warn',

  'unicode-bom': ['warn', 'never'],
  'use-isnan': 'warn',
  'valid-typeof': 'warn',
  'no-restricted-properties': [
    'error',
    {
      object: 'require',
      property: 'ensure',
      message:
        'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
    },
    {
      object: 'System',
      property: 'import',
      message:
        'Please use import() instead. More info: https://facebook.github.io/create-react-app/docs/code-splitting',
    },
  ],
  'getter-return': 'warn',

  // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
  'import/first': 'error',
  'import/newline-after-import': 'error',
  'import/no-amd': 'error',

  // Reports if a module's default export is unnamed.
  // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-anonymous-default-export.md
  'import/no-anonymous-default-export': [
    'warn',
    {
      allowArray: true,
      allowArrowFunction: true,
      allowAnonymousClass: false,
      allowAnonymousFunction: true,
      allowCallExpression: true,
      allowLiteral: false,
      allowObject: true,
    },
  ],

  // Reports if a resolved path is imported more than once.
  // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md#inline-type-imports
  'import/no-duplicates': ['warn', { 'prefer-inline': true }],

  'import/no-webpack-loader-syntax': 'error',

  semi: ['warn', 'always'],

  indent: ['warn', 2, { SwitchCase: 1 }],

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

  'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],

  'arrow-body-style': ['warn', 'as-needed'],

  'arrow-parens': ['warn', 'as-needed', { requireForBlockBody: true }],

  quotes: ['warn', 'single'],

  'no-debugger': 'error',

  'function-paren-newline': ['warn', 'consistent'],

  'object-curly-newline': ['warn', { consistent: true }],

  // Require or disallow trailing commas
  // https://eslint.org/docs/rules/comma-dangle
  'comma-dangle': [
    'warn',
    {
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

  'no-param-reassign': ['warn', { props: false }],

  // Prevents unnecessary path segments in import and require statements.
  // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-useless-path-segments.md
  'import/no-useless-path-segments': ['warn', { noUselessIndex: true }],

  // Require quotes around object literal property names
  // https://eslint.org/docs/rules/quote-props
  'quote-props': ['warn', 'as-needed'],

  // Require Object Literal Shorthand Syntax
  // https://eslint.org/docs/rules/object-shorthand
  'object-shorthand': 'warn',

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
    { blankLine: 'always', prev: '*', next: 'return' },

    { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
    { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
    { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },

    { blankLine: 'always', prev: 'directive', next: '*' },
    { blankLine: 'any', prev: 'directive', next: 'directive' },

    { blankLine: 'always', prev: ['case', 'default'], next: '*' },
    { blankLine: 'never', prev: 'case', next: ['case', 'return'] },

    { blankLine: 'always', prev: 'import', next: '*' },
    { blankLine: 'always', prev: '*', next: 'export' },
    { blankLine: 'any', prev: ['import', 'export'], next: ['import', 'export'] },
  ],
};
