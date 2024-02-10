/**
 * We use eslint-loader so even warnings are very visible.
 * This is why we prefer to use "WARNING" level for potential warns,
 * and we try not to use "warn" level at all.
 */
module.exports = {
  // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
  'jsx-a11y/alt-text': 'warn',
  'jsx-a11y/anchor-has-content': 'warn',
  'jsx-a11y/anchor-is-valid': [
    'warn',
    {
      aspects: ['noHref', 'invalidHref'],
    },
  ],
  'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
  'jsx-a11y/aria-props': 'warn',
  'jsx-a11y/aria-proptypes': 'warn',
  'jsx-a11y/aria-role': ['warn', { ignoreNonDOM: true }],
  'jsx-a11y/aria-unsupported-elements': 'warn',
  'jsx-a11y/heading-has-content': 'warn',
  'jsx-a11y/iframe-has-title': 'warn',
  'jsx-a11y/img-redundant-alt': 'warn',
  'jsx-a11y/no-access-key': 'warn',
  'jsx-a11y/no-distracting-elements': 'warn',
  'jsx-a11y/no-redundant-roles': 'warn',
  'jsx-a11y/role-has-required-aria-props': 'warn',
  'jsx-a11y/role-supports-aria-props': 'warn',
  'jsx-a11y/scope': 'warn',
}
