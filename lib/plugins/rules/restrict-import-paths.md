# restrict-import-paths

Restrict the import paths to a certain depth and suggest the aliased path instead or vice versa.

## Options

### allowedPathDepth (default: 0)

The `allowedPathDepth` option is a number that specifies the maximum depth of the import path.
If the import path is deeper relative to the current file, the linter will report a warning (or error) and suggest the
aliased path instead.

### rootDir (default: './src')

The `rootDir` option is a string that specifies the starting point to check the import path depth.

### useTsConfig (default: true)

When `useTsConfig` is `true`, the rule will use the `paths` option from the `tsconfig.json` file to resolve. You can
also specify the alternative path to the TypeScript configuration file.

_eslint.config.js_

```javascript
export default {
  rules: {
    'fluxuator/restrict-import-paths': 'warn',
  },
}
```

---

[↩️ Back to the main page](../../README.md#custom-rules)
