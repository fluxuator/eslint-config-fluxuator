const { RuleTester } = require('eslint')
const noClassComparisonRule = require('./no-class-comparison.rule')

/** @type {import("eslint").RuleTester} */
const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
})

ruleTester.run('no-class-comparison', noClassComparisonRule, {
  valid: [
    'const foo = {}; const boo = null; const bar = foo === boo;',
    'undefined != null;',
    '1 !== 0;',
    'a % 0;',
    'const age = 44; age > 18;',
    'class Foo {}; const classA = new Foo(); classA instanceof Foo;',

    // Exclusions
    'const dateA = new Date(); const dateB = new Date(); dateA < dateB;',
    'class MyDate extends Date {}; const dateA = new MyDate(); dateA > 10000000;',
  ],
  invalid: [
    {
      code: 'class Foo {}; class Boo {}; const classA = new Foo(); const classB = new Boo(); classA !== classB;',
      errors: ['Comparison operator "!==" is not allowed here. Create and use `notEquals` class methods instead.'],
    },
    {
      code: 'class Foo {}; const classA = new Foo(); classA % 3',
      errors: ['Comparison operator "%" is not allowed here.'],
    },
    {
      code: 'class A extends B {}; class B extends C {}; class C {}; const classA = new A(); classA == undefined;',
      options: [
        {
          suggestions: {
            C: {
              '==': 'Use `C.equals()` method instead.',
            },
          },
        },
      ],
      errors: ['Comparison operator "==" is not allowed here. Use `C.equals()` method instead.'],
    },
  ],
})
