import { RuleTester } from 'eslint'

import noClassComparisonRule from './no-class-comparison.rule.js'

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

    'class Foo {}; const item = new Foo(); function compare(item) { return item > 1; }',
    'function first() { const item = new Foo(); } function second() { const item = 1; return item > 0; }',

    'class Parent extends Date {}; class Child extends Parent {}; const item = new Child(); item > 0;',

    // Exclusions
    'const dateA = new Date(); const dateB = new Date(); dateA < dateB;',
    'class MyDate extends Date {}; const dateA = new MyDate(); dateA > 10000000;',
  ],
  invalid: [
    {
      code: 'const item = new library.Foo(); item > 1;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'class Base {}; class Foo extends Base {}; function compare() { class Base {}; const item = new Foo(); return item == null; }',
      options: [{ suggestions: { Base: { '==': 'Use Base.equals().' } } }],
      errors: ['Comparison operator "==" is not allowed here. Use Base.equals().'],
    },
    {
      code: 'class MyDate extends Date {}; class Foo {}; const item = new Foo(); item > 1;',
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: 'class Other {}; class Foo {}; const item = new Foo(); item == null;',
      options: [{ suggestions: { Other: { '==': 'Wrong class.' }, Foo: { '==': 'Use Foo.equals().' } } }],
      errors: ['Comparison operator "==" is not allowed here. Use Foo.equals().'],
    },
    {
      code: 'class Foo {}; const item = new Foo(); function compare() { return item > 1; }',
      errors: [{ messageId: 'unexpected' }],
    },
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
