# eslint-config-fluxuator

This package includes the shareable [ESLint](https://eslint.org) configuration that I use in my projects.

It was inspired by https://github.com/airbnb/javascript and https://github.com/facebook/create-react-app but less
opinionated.

## Installation (React app)

NOTE: You can also create it in your home directory to enable it globally for all projects.

### React App

1. Install this package, ESLint and the necessary dependencies

```sh
yarn add -D eslint-config-fluxuator \
              @babel/core@^7.0.0 @babel/eslint-parser@^7.0.0 @babel/preset-react@^7.0.0 \
            eslint@^8.0.0 \
              eslint-plugin-react@^7.0.0 eslint-plugin-react-hooks@^4.0.0 \
            typescript@^5 \
              @typescript-eslint/eslint-plugin@^6 @typescript-eslint/parser@^6
```

2. Create a file named `.eslintrc` with following contents in the root folder of your project:

```json
{
  "extends": ["fluxuator"]
}
```

3. You can override the settings from `eslint-config-fluxuator` by editing the `.eslintrc` file. Learn more
   about [configuring ESLint](http://eslint.org/docs/user-guide/configuring) on the ESLint website.

```json
{
  "extends": ["fluxuator"],
  "rules": {
    "some-annoying-rule": "off"
  }
}
```

4. If you are using the new JSX transform from React 17, add "fluxuator/jsx-runtime" to "extends" to disable
   the relevant rules.

5. Add a script to you package.json to check your project with Eslint.

```json
{
  "scripts": {
    "lint": "eslint '**/*.{ts,tsx}' --report-unused-disable-directives",
    "lint:fix": "yarn lint --fix --max-warnings 0"
  }
}
```

### React App (Recommended)

You can also enable all recommended rules for your React App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```json5
{
  extends: ['fluxuator/react-recommended'],
}
```

```json5
{
  extends: [
    'fluxuator/react-recommended',
    // "fluxuator/vitest-recommended"
    // "fluxuator/jest-recommended"
  ],
}
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

### NodeJS App

1. Install this package, ESLint and the necessary plugins

```sh
yarn add -D eslint-config-fluxuator \
            eslint@^8.0.0 \
            typescript@^5 \
              @typescript-eslint/eslint-plugin@^6 @typescript-eslint/parser@^6
```

2. Create a file named `.eslintrc` with following contents in the root folder of your project:

```json
{
  "extends": ["fluxuator/node"]
}
```

3. You can override the settings from `eslint-config-fluxuator` by editing the `.eslintrc` file. Learn more
   about [configuring ESLint](http://eslint.org/docs/user-guide/configuring) on the ESLint website.

```json
{
  "extends": ["fluxuator/node"],
  "rules": {
    "some-annoying-rule": "off"
  }
}
```

### NodeJS App (Recommended)

You can also enable all recommended rules for your NodeJS App with only one config that combines all recommended rules
including Prettier, but without testing libraries (should be installed separately)

```json
{
  "extends": ["fluxuator/node-recommended", "fluxuator/jest"]
}
```

_NOTE: Requires [Prettier](#prettier) to be installed additionally_

That's it!

## Extensions

### Jest

This config also ships with optional Jest rules for ESLint (based
on [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest))

1. Install the ESLint plugin for Jest and Testing Library (if you don't already have them installed).

```sh
yarn add -D jest eslint-plugin-jest eslint-plugin-jest-formatting
```

2. Enable these rules by adding the Jest config to the `extends` array in your ESLint config.

```json
{
  "extends": ["fluxuator", "fluxuator/jest"]
}
```

### Vitest

In case you are using ViteJS as app builder, it is recommended to use Vitest instead of Jest in your app.
This config also ships with optional Vitest rules for ESLint (based
on [`eslint-plugin-vitest`](https://github.com/veritem/eslint-plugin-vitest))

1. Install the ESLint plugin for Vitest

```sh
yarn add -D jest eslint-plugin-vites eslint-plugin-jest-formatting
```

2. Enable these rules by adding the Jest config to the `extends` array in your ESLint config.

```json
{
  "extends": ["fluxuator", "fluxuator/vitest"]
}
```

### Testing Library

You can also charge your ESLint with additional power
of [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library)) rules.

```sh
yarn add -D  eslint-plugin-testing-library
```

and enable additional rules

```json
{
  "extends": ["fluxuator", "fluxuator/vitest", "fluxuator/testing-library"]
}
```

### Prettier

This config also ships with optional Prettier rules for ESLint.

1. Install the Prettier tool (if you don't already have them installed).

```sh
yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
```

2. Enable these rules by adding the Prettier config to the `extends` array in your ESLint config. Make sure to put it
   last, so it gets the chance to override other configs.

```json
{
  "extends": ["fluxuator", "fluxuator/prettier"]
}
```

### Accessibility Checks

Some basic rules from the [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin are
activated:

If you want to enable even more accessibility rules, you can create an `.eslintrc` file in the root of your project with
this content:

```json
{
  "extends": ["fluxuator", "fluxuator/a11y"]
}
```

## MDX rules

This config also ships with optional [MDX](https://github.com/mdx-js/mdx) rules for ESLint (based
on [`eslint-plugin-mdx`](https://github.com/mdx-js/eslint-mdx)).

1. Install the ESLint plugin for MDX (if you don't already have it installed).

```sh
yarn add -D eslint-plugin-mdx@^1.16.0
```

2. Enable these rules by adding the MDX config to the `extends` array in your ESLint config.

```json
{
  "extends": ["fluxuator", "fluxuator/jest", "fluxuator/mdx"]
}
```
