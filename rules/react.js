'use strict'

/**
 * This file contains the basic ESLint rules
 */
module.exports = {
  // https://github.com/yannickcr/eslint-plugin-react/tree/master/docs/rules
  'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
  'react/jsx-no-comment-textnodes': 'warn',
  'react/jsx-no-duplicate-props': 'warn',
  'react/jsx-no-target-blank': 'warn',
  // Disallow undeclared variables in JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-undef.md
  'react/jsx-no-undef': 'warn',

  'react/jsx-pascal-case': [
    'warn',
    {
      allowAllCaps: true,
      ignore: [],
    },
  ],
  'react/no-danger-with-children': 'warn',
  // Disabled because of undesirable warnings
  // See https://github.com/facebook/create-react-app/issues/5204 for
  // blockers until its re-enabled
  // 'react/no-deprecated': 'warn',
  'react/no-direct-mutation-state': 'warn',
  'react/no-is-mounted': 'warn',
  'react/no-typos': 'error',
  'react/require-render-return': 'error',
  'react/style-prop-object': 'warn',
  'react/jsx-uses-vars': 'warn',
  'react/jsx-uses-react': 'warn',

  // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
  'react-hooks/rules-of-hooks': 'error',

  'react-hooks/exhaustive-deps': 'warn',

  // Prevent missing props validation in a React component definition
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
  'react/prop-types': [
    'warn',
    {
      ignore: [],
      customValidators: [],
      skipUndeclared: false,
    },
  ],
}
