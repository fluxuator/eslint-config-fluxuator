'use strict'

/**
 * This file contains the recommended ESLint rules
 */
module.exports = {
  'jsx-quotes': ['warn', 'prefer-double'],

  'class-methods-use-this': [
    'warn',
    {
      exceptMethods: [
        'render',
        'getInitialState',
        'getDefaultProps',
        'getChildContext',
        'componentWillMount',
        'UNSAFE_componentWillMount',
        'componentDidMount',
        'componentWillReceiveProps',
        'UNSAFE_componentWillReceiveProps',
        'shouldComponentUpdate',
        'componentWillUpdate',
        'UNSAFE_componentWillUpdate',
        'componentDidUpdate',
        'componentWillUnmount',
        'componentDidCatch',
        'getSnapshotBeforeUpdate',
      ],
    },
  ],

  // Forbid certain propTypes (any, array, object)
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
  'react/forbid-prop-types': [
    'warn',
    {
      forbid: ['any', 'array', 'object'],
      checkContextTypes: true,
      checkChildContextTypes: true,
    },
  ],

  // Enforce boolean attributes notation in JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md
  'react/jsx-boolean-value': ['warn', 'never', { always: [] }],

  // Validate closing bracket location in JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-bracket-location.md
  'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],

  // Validate closing tag location in JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-closing-tag-location.md
  'react/jsx-closing-tag-location': 'warn',

  // Enforce or disallow spaces inside of curly braces in JSX attributes
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-spacing.md
  'react/jsx-curly-spacing': ['warn', 'never', { allowMultiline: true }],

  // Validate props indentation in JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent-props.md
  'react/jsx-indent-props': ['warn', 2],

  // Limit maximum of props on a single line in JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-max-props-per-line.md
  'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],

  // Prevent usage of .bind() in JSX props
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md
  'react/jsx-no-bind': [
    'warn',
    {
      ignoreRefs: true,
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false,
      ignoreDOMComponents: true,
    },
  ],

  // Prevent duplicate props in JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-duplicate-props.md
  'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }],

  // Enforce PascalCase for user-defined JSX components
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-pascal-case.md
  'react/jsx-pascal-case': [
    'warn',
    {
      allowAllCaps: true,
      ignore: [],
    },
  ],

  // Prevent React to be incorrectly marked as unused
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-react.md
  'react/jsx-uses-react': [1],

  // Prevent variables used in JSX to be incorrectly marked as unused
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-uses-vars.md
  'react/jsx-uses-vars': 'warn',

  // Prevent usage of dangerous JSX properties
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
  'react/no-danger': 'warn',

  // Prevent usage of deprecated methods
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-deprecated.md
  'react/no-deprecated': [1],

  // Prevent usage of setState in componentDidUpdate
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-did-update-set-state.md
  'react/no-did-update-set-state': 'warn',

  // Prevent usage of setState in componentWillUpdate
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-will-update-set-state.md
  'react/no-will-update-set-state': 'warn',

  // Prevent usage of isMounted
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-is-mounted.md
  'react/no-is-mounted': 'warn',

  // Prevent using string references
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-string-refs.md
  'react/no-string-refs': 'warn',

  // Prevent usage of unknown DOM property
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md
  'react/no-unknown-property': 'warn',

  // Require ES6 class declarations over React.createClass
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-es6-class.md
  'react/prefer-es6-class': ['warn', 'always'],

  // Require stateless functions when not using lifecycle methods, setState or ref
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
  // 'react/prefer-stateless-function': ['warn', { ignorePureComponents: true }],
  // https://github.com/yannickcr/eslint-plugin-react/issues/1773
  'react/prefer-stateless-function': 'off',

  // Prevent missing React when using JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/react-in-jsx-scope.md
  'react/react-in-jsx-scope': 'warn',

  // Require render() methods to return something
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-render-return.md
  'react/require-render-return': 'warn',

  // Prevent extra closing tags for components without children
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/self-closing-comp.md
  'react/self-closing-comp': 'warn',

  // Enforce component methods order
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md
  'react/sort-comp': [
    'warn',
    {
      order: [
        'static-variables',
        'static-methods',
        'instance-variables',
        'lifecycle',
        '/^handle.+$/',
        '/^on.+$/',
        'getters',
        'setters',
        '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
        'instance-methods',
        'everything-else',
        'rendering',
      ],
      groups: {
        lifecycle: [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
          'constructor',
          'getDefaultProps',
          'getInitialState',
          'state',
          'getChildContext',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          'componentDidCatch',
        ],
        rendering: ['/^render.+$/', 'render'],
      },
    },
  ],

  // Prevent missing parentheses around multilines JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-wrap-multilines.md
  'react/jsx-wrap-multilines': [
    'warn',
    {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      return: 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
    },
  ],

  // Require that the first prop in a JSX element be on a new line when the element is multiline
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-first-prop-new-line.md
  'react/jsx-first-prop-new-line': ['warn', 'multiline-multiprop'],

  // Enforce spacing around jsx equals signs
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-equals-spacing.md
  'react/jsx-equals-spacing': ['warn', 'never'],

  // Enforce JSX indentation
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
  'react/jsx-indent': ['warn', 2],

  // Disallow target='_blank' on links
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md
  'react/jsx-no-target-blank': ['warn', { enforceDynamicLinks: 'always' }],

  // only .jsx and .tsx files may have JSX
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
  'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx', '.mdx'] }],

  // prevent accidental JS comments from being injected into JSX as text
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-comment-textnodes.md
  'react/jsx-no-comment-textnodes': 'warn',

  // disallow using React.render/ReactDOM.render's return value
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-render-return-value.md
  'react/no-render-return-value': 'warn',

  // warn against using findDOMNode()
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-find-dom-node.md
  'react/no-find-dom-node': 'warn',

  // Prevent problem with children and props.dangerouslySetInnerHTML
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger-with-children.md
  'react/no-danger-with-children': 'warn',

  // Prevent unused propType definitions
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unused-prop-types.md
  'react/no-unused-prop-types': [
    'warn',
    {
      customValidators: [],
      skipShapeProps: true,
    },
  ],

  // Require style prop value be an object or var
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/style-prop-object.md
  'react/style-prop-object': 'warn',

  // Prevent invalid characters from appearing in markup
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
  'react/no-unescaped-entities': 'warn',

  // Prevent passing of children as props
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md
  'react/no-children-prop': 'warn',

  // Validate whitespace in and around the JSX opening and closing brackets
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-prop-types.md
  'react/jsx-tag-spacing': [
    'warn',
    {
      closingSlash: 'never',
      beforeSelfClosing: 'always',
      afterOpening: 'never',
      beforeClosing: 'never',
    },
  ],

  // Prevent usage of Array index in keys
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-array-index-key.md
  'react/no-array-index-key': 'warn',

  // Enforce a defaultProps definition for every prop that is not a required prop
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/require-default-props.md
  'react/require-default-props': [
    'warn',
    {
      forbidDefaultForRequired: true,
      ignoreFunctionalComponents: true,
    },
  ],

  // Forbids using non-exported propTypes
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/forbid-foreign-prop-types.md
  // this is intentionally set to 'warn'. it would be 'error',
  // but it's only critical if you're stripping propTypes in production.
  'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],

  // Prevent void DOM elements from receiving children
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/void-dom-elements-no-children.md
  'react/void-dom-elements-no-children': 'warn',

  // Enforce all defaultProps have a corresponding non-required PropType
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/default-props-match-prop-types.md
  'react/default-props-match-prop-types': [
    'warn',
    {
      allowRequiredDefaults: false,
    },
  ],

  // Prevent usage of shouldComponentUpdate when extending React.PureComponent
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-redundant-should-component-update.md
  'react/no-redundant-should-component-update': 'warn',

  // Prevent unused state values
  // https://github.com/yannickcr/eslint-plugin-react/pull/1103/
  'react/no-unused-state': 'warn',

  // Prevents common casing typos
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-typos.md
  'react/no-typos': 'warn',

  // Enforce curly braces or disallow unnecessary curly braces in JSX props and/or children
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-curly-brace-presence.md
  'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],

  // Prevent using this.state within a this.setState
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-access-state-in-setstate.md
  'react/no-access-state-in-setstate': 'warn',

  // Prevent usage of button elements without an explicit type attribute
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/button-has-type.md
  'react/button-has-type': [
    'warn',
    {
      button: true,
      submit: true,
      reset: false,
    },
  ],

  // Prevent this from being used in stateless functional components
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-this-in-sfc.md
  'react/no-this-in-sfc': 'warn',

  // Disallow multiple spaces between inline JSX props
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-multi-spaces.md
  'react/jsx-props-no-multi-spaces': 'warn',

  // Prevent usage of UNSAFE_ methods
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-unsafe.md
  'react/no-unsafe': 'warn',

  // Enforce defaultProps declarations alphabetical sorting
  // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-default-props.md
  'react/jsx-sort-default-props': 'off',
}
