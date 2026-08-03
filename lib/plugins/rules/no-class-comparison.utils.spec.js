const { findSuggestion } = require('./no-class-comparison.utils')

describe('no-class-comparison.utils', () => {
  describe('findSuggestion', () => {
    describe('it should return a suggestion or empty string', () => {
      const dataset = [
        // Default suggestions (returns empty string if not found)
        {
          operator: '==',
          expected: ' Create and use `equals` class methods instead.',
        },
        {
          operator: '+',
          expected: '',
        },
        // Override fallback suggestions
        {
          operator: '==',
          suggestions: { '*': { '==': 'Use equal' } },
          expected: ' Use equal',
        },
        // Make sure that other suggestions are not affected
        {
          operator: '===',
          suggestions: { '*': { '==': 'Use equal' } },
          expected: ' Create and use `equals` class methods instead.',
        },
        // Custom class suggestions
        {
          operator: '==',
          suggestions: { Foo: { '==': 'Use Foo.equals()' } },
          classNames: ['Foo'],
          expected: ' Use Foo.equals()',
        },
        // Custom class suggestions with fallback when an operator is not found
        {
          operator: '!==',
          suggestions: { Foo: { '!==': 'Use Foo.equals()' } },
          classNames: ['Boo'],
          expected: ' Create and use `notEquals` class methods instead.',
        },
        // Custom class suggestions with overridden according to the hierarchy
        // The first class in the list has the highest priority
        // class A extends B {}; class B extends C {}; class C {};
        {
          operator: '==',
          suggestions: {
            B: { '==': 'Use B.equals()' },
            C: { '==': 'Use C.equals()' },
          },
          classNames: ['A', 'B', 'C'],
          expected: ' Use B.equals()',
        },
      ]

      it.each(dataset)('given %p', ({ operator, suggestions, classNames, expected }) => {
        const result = findSuggestion(operator, suggestions, classNames)

        expect(result).toBe(expected)
      })
    })
  })
})
