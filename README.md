# eslint-config-fluxuator

This package includes the shareable [ESLint](https://eslint.org) configuration that I use in my projects.

It was inspired by https://github.com/airbnb/javascript and https://github.com/facebook/create-react-app but less
opinionated.

## Installation (React app)

1. Install this package, ESLint and the necessary plugins

```sh
yarn add -D eslint-config-fluxuator eslint@^7.5.0 @babel/eslint-parser@^7.0.0 @babel/preset-react@^7.0.0 \
            eslint-plugin-import@^2.22.0 eslint-plugin-jsx-a11y@^6.3.1 eslint-plugin-react@^7.20.3 \
            eslint-plugin-react-hooks@^4.0.8
```

for typescript projects install additional plugins

```shell
yarn add -D typescript@^4.0.0 @typescript-eslint/eslint-plugin@^5.0.0 @typescript-eslint/parser@^5.0.0
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

3. If you want to add more recommended rules, you can do it by adding the `fluxuator/jest` to the extends array in your
   ESLint config.

```json
{
  "extends": ["fluxuator", "fluxuator/recommended"]
}
```

4. If you are using the new JSX transform from React 17, add "plugin:react/jsx-runtime" to "extends" to disable the relevant rules.

5. Add a script to you package.json to check your project with Eslint.

```json
{
  ...
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "yarn lint --fix",
    ...
  },
  ...
}
```

## Installation (NodeJS app)

1. Install this package, ESLint and the necessary plugins

```sh
yarn add -D eslint-config-fluxuator eslint@^7.5.0 eslint-plugin-import@^2.22.0
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

3. If you want to add more recommended rules, you can do it by adding the `fluxuator/jest` to the extends array in your
   ESLint config.

```json
{
  "extends": ["fluxuator/node", "fluxuator/node-recommended"]
}
```

That's it!

## Jest rules

This config also ships with optional Jest rules for ESLint (based
on [`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest)).

1. Install the ESLint plugin for Jest (if you don't already have it installed).

```sh
yarn add -D jest eslint-plugin-jest@^24.0.0 eslint-plugin-testing-library@^3.9.0
```

2. Enable these rules by adding the Jest config to the `extends` array in your ESLint config.

```json
{
  "extends": ["fluxuator", "fluxuator/jest"]
}
```

## MDX rules

This config also ships with optional [MDX](https://github.com/mdx-js/mdx) rules for ESLint (based
on [`eslint-plugin-mdx`](https://github.com/mdx-js/eslint-mdx)).

1. Install the ESLint plugin for MDX (if you don't already have it installed).

```sh
yarn add -D eslint-plugin-mdx
```

2. Enable these rules by adding the MDX config to the `extends` array in your ESLint config.

```json
{
  "extends": ["fluxuator", "fluxuator/jest", "fluxuator/mdx"]
}
```

## Accessibility Checks

Some basic rules from the [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin are
activated:

If you want to enable even more accessibility rules, you can create an `.eslintrc` file in the root of your project with
this content:

```json
{
  "extends": ["fluxuator", "plugin:jsx-a11y/recommended"],
  "plugins": ["jsx-a11y"]
}
```
