# eslint-config-fluxuator

This package includes the shareable [ESLint](https://eslint.org) configuration that I use in my projects.

It was inspired by https://github.com/airbnb/javascript and https://github.com/facebook/create-react-app but less
opinionated.

## Migrating from v1

This release migrates the config to ESLint v10's flat config and brings a few breaking changes:

- The `import/*` rule keys are now `import-x/*`. Any custom `rules: { 'import/some-rule': ... }` override in your own
  config silently stops applying and must be renamed to `import-x/some-rule`.
- Four `react/*` rules (`jsx-curly-spacing`, `jsx-equals-spacing`, `jsx-tag-spacing`, `jsx-filename-extension`) are
  now force-disabled due to an upstream `eslint-plugin-react` incompatibility with ESLint v10 (no fix available yet)
  and cannot be re-enabled without crashing.
- Flat config only — ESLint v10 doesn't support `.eslintrc` at all, so you'll need to migrate your own config to
  `eslint.config.js` too. See ESLint's own
  [migration guide](https://eslint.org/docs/latest/use/configure/migration-guide).

## Installation (React app)

NOTE: You can also create it in your home directory to enable it globally for all projects.

### React App

1. Install this package and ESLint

```sh
pnpm add -D eslint-config-fluxuator \
            "eslint@^9.0.0 || ^10.0.0" \
              eslint-plugin-react@^7.37.0 eslint-plugin-react-hooks@^7.0.0 \
            typescript@^5 \
              @typescript-eslint/eslint-plugin@^8 @typescript-eslint/parser@^8
```

2. Create a file named `eslint.config.js` in the root folder of your project:

```js
module.exports = [...require('eslint-config-fluxuator')]
```

3. You can override the settings from `eslint-config-fluxuator` by appending your own flat config object to the array. Learn more about [configuring ESLint](https://eslint.org/docs/latest/use/configure/configuration-files) on the ESLint website.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  {
    rules: {
      'some-annoying-rule': 'off',
    },
  },
]
```

4. If you are using the new JSX transform from React 17+, spread `eslint-config-fluxuator/jsx-runtime` into the array too, to disable the relevant rules.

```js
module.exports = [...require('eslint-config-fluxuator'), ...require('eslint-config-fluxuator/jsx-runtime')]
```

5. Add a script to your package.json to check your project with ESLint.

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "pnpm lint --fix --max-warnings 0"
  }
}
```

### React App (Recommended)

You can also enable all recommended rules for your React App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```js
module.exports = [
  ...require('eslint-config-fluxuator/react-recommended'),
  // ...require('eslint-config-fluxuator/vitest-recommended'),
  // ...require('eslint-config-fluxuator/jest-recommended'),
]
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

### NodeJS App

1. Install this package, ESLint and the necessary plugins

```sh
pnpm add -D eslint-config-fluxuator \
            "eslint@^9.0.0 || ^10.0.0" \
            typescript@^5 \
              @typescript-eslint/eslint-plugin@^8 @typescript-eslint/parser@^8
```

2. Create a file named `eslint.config.js` in the root folder of your project:

```js
module.exports = [...require('eslint-config-fluxuator/node')]
```

3. You can override the settings from `eslint-config-fluxuator` by appending your own flat config object to the array. Learn more about [configuring ESLint](https://eslint.org/docs/latest/use/configure/configuration-files) on the ESLint website.

```js
module.exports = [
  ...require('eslint-config-fluxuator/node'),
  {
    rules: {
      'some-annoying-rule': 'off',
    },
  },
]
```

### NodeJS App (Recommended)

You can also enable all recommended rules for your NodeJS App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```js
module.exports = [...require('eslint-config-fluxuator/node-recommended'), ...require('eslint-config-fluxuator/jest')]
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

That's it!

## Extensions

### Jest

This config also ships with optional Jest rules for ESLint (based
on [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest))

1. Install the ESLint plugin for Jest and Testing Library (if you don't already have them installed).

```sh
pnpm add -D jest eslint-plugin-jest
```

2. Enable these rules by spreading the Jest config into your ESLint config array.

```js
module.exports = [...require('eslint-config-fluxuator'), ...require('eslint-config-fluxuator/jest')]
```

### Vitest

In case you are using ViteJS as app builder, it is recommended to use Vitest instead of Jest in your app.
This config also ships with optional Vitest rules for ESLint (based
on [`@vitest/eslint-plugin`](https://github.com/vitest-dev/eslint-plugin-vitest))

1. Install the ESLint plugin for Vitest

```sh
pnpm add -D vitest @vitest/eslint-plugin
```

2. Enable these rules by spreading the Vitest config into your ESLint config array.

```js
module.exports = [...require('eslint-config-fluxuator'), ...require('eslint-config-fluxuator/vitest')]
```

### Testing Library

You can also charge your ESLint with additional power
of [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library)) rules.

```sh
pnpm add -D eslint-plugin-testing-library
```

and enable additional rules

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/vitest'),
  ...require('eslint-config-fluxuator/testing-library'),
]
```

### Prettier

This config also ships with optional Prettier rules for ESLint.

1. Install the Prettier tool (if you don't already have them installed).

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

2. Enable these rules by spreading the Prettier config into your ESLint config array. Make sure to put it
   last, so it gets the chance to override other configs.

```js
module.exports = [...require('eslint-config-fluxuator'), ...require('eslint-config-fluxuator/prettier')]
```

### Accessibility Checks

Some basic rules from the [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin are
activated:

If you want to enable even more accessibility rules, spread the a11y config into your ESLint config array:

```js
module.exports = [...require('eslint-config-fluxuator'), ...require('eslint-config-fluxuator/a11y')]
```

## MDX rules

This config also ships with optional [MDX](https://github.com/mdx-js/mdx) rules for ESLint (based
on [`eslint-plugin-mdx`](https://github.com/mdx-js/eslint-mdx)).

1. Install the ESLint plugin for MDX (if you don't already have it installed).

```sh
pnpm add -D eslint-plugin-mdx@^3.0.0
```

2. Enable these rules by spreading the MDX config into your ESLint config array.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/jest'),
  ...require('eslint-config-fluxuator/mdx'),
]
```

## Custom rules

This config also ships a small set of custom rules, in addition to the ones provided by third-party plugins.

1. Enable them by spreading the custom config into your ESLint config array.

```js
module.exports = [...require('eslint-config-fluxuator'), ...require('eslint-config-fluxuator/custom')]
```

2. Rules:

- [`fluxuator/no-class-comparison`](lib/plugins/rules/no-class-comparison.md) — enabled by default. Disallows comparing class instances with comparison operators and suggests alternative ways to compare them (e.g. an `.equals()` method).
- [`fluxuator/restrict-import-paths`](lib/plugins/rules/restrict-import-paths.md) — registered but **not** enabled by default. Restricts import paths to a certain depth and suggests the aliased path instead (or vice versa), resolving path aliases from your project's `tsconfig.json`. Requires per-project configuration (`useTsConfig`, `rootDir`, `allowedPathDepth`) to be useful — see the linked doc before enabling it.
