# eslint-config-fluxuator

This package includes the shareable [ESLint](https://eslint.org) configuration that I use in my projects.

It was inspired by https://github.com/airbnb/javascript and https://github.com/facebook/create-react-app but less
opinionated.

## Installation (React app)

NOTE: You can also create it in your home directory to enable it globally for all projects.

### React App

1. Install this package and ESLint

```sh
pnpm add -D eslint-config-fluxuator \
            "eslint@^9.0.0 || ^10.0.0" \
              eslint-plugin-react@^7.37.0 eslint-plugin-react-hooks@^7.0.0 \
            typescript@^5 \
              typescript-eslint@^8
```

2. Create a file named `eslint.config.js` in the root folder of your project. `.` bundles the Node, React and
   Prettier rules together — it's an alias for `./react`.

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

4. Add a script to your package.json to check your project with ESLint.

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "pnpm lint --fix --max-warnings 0"
  }
}
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

### NodeJS App

1. Install this package, ESLint and the necessary plugins

```sh
pnpm add -D eslint-config-fluxuator \
            "eslint@^9.0.0 || ^10.0.0" \
            typescript@^5 \
              typescript-eslint@^8
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

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

That's it!

## Extensions

### Jest

This config also ships with optional Jest rules for ESLint (based
on [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest))

1. Install the ESLint plugin for Jest (if you don't already have it installed).

```sh
pnpm add -D jest eslint-plugin-jest
```

2. Enable these rules by spreading the Jest config into your ESLint config array. `./jest` is a function that takes
   your installed Jest version, used by `eslint-plugin-jest`'s version-aware rules.

```js
module.exports = [
  ...require('eslint-config-fluxuator'),
  ...require('eslint-config-fluxuator/jest')(require('jest/package.json').version),
]
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

### React Testing Library

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
  ...require('eslint-config-fluxuator/react-testing-library'),
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

## Custom rules

This config also ships a small set of custom rules, in addition to the ones provided by third-party plugins.

- [`fluxuator/no-class-comparison`](lib/plugins/rules/no-class-comparison.md) — enabled by default in `.`, `./node` and `./react`. Disallows comparing class instances with comparison operators and suggests alternative ways to compare them (e.g. an `.equals()` method).
- [`fluxuator/restrict-import-paths`](lib/plugins/rules/restrict-import-paths.md) — registered but **not** enabled by default, and not currently exposed via a standalone export. Restricts import paths to a certain depth and suggests the aliased path instead (or vice versa), resolving path aliases from your project's `tsconfig.json`.
