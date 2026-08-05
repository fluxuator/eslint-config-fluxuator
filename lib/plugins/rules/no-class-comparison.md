# no-class-comparison

Disallows comparing classes with comparison
operators and suggests alternative ways to compare them.

## Options

### suggestions

The `suggestions` option is an object where keys are class names and values are objects with comparison operators as
keys and suggestions as values.

Also, you can use `*` as a wildcard to apply suggestions to all occurrences. This suggestion will be used as a fallback
if there is no specific suggestion for a class.

By default, the rule has a basic list of suggestions for the limited list of comparison operators. But you can always
extend it in your [ESLint configuration file](https://eslint.org/docs/latest/use/configure/configuration-files).

_eslint.config.js_

```javascript
export default {
  rules: {
    'fluxuator/no-class-comparison': [
      'error',
      {
        suggestions: {
          // Will be applied to a specific class
          MyVO: {
            '==': 'Use `MyVO.equals(MyVO)` method.',
          },
          // In case of deep inheritance chain you can specify a suggestion for a superclass
          MyDeepSuperclass: {
            '==': 'Use `MyDeepSuperclass.equals(MyDeepSuperclass)` method.',
          },
          // Will be applied to all classes as fallback suggestion
          '*': {
            '===': 'Use `Class.equals(AnotherClass)` method.',
            '<=': 'Not implemented yet',
          },
        },
      },
    ],
  },
}
```

## Ignored classes

Some built-in objects like `Date` are ignored as they support comparison operators. It also ignores classes that extend
built-in classes.

The current list of ignored classes:

- [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

---

[↩️ Back to the main page](../../README.md#custom-rules)
