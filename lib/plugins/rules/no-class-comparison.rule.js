import { isIdentifier, isNewExpression } from '../utils/ast.utils.js'

import { findSuggestion } from './no-class-comparison.utils.js'

const allowedClassOperators = ['instanceof']

const excludedClasses = ['Date']

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    messages: {
      unexpected: 'Comparison operator "{{operator}}" is not allowed here.{{suggestion}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          suggestions: {
            type: 'object',
            patternProperties: {
              '^[\\*\\w]+$': {
                type: 'object',
                patternProperties: {
                  '^.*$': { type: 'string' },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  /**
   * @param {import("eslint").Rule.RuleContext} context
   *
   * @returns {import("eslint").Rule.NodeListener}
   */
  create(context) {
    const options = Object.assign({}, context.options[0])

    const classVars = new Set()
    const classNames = new Set()

    return {
      /**
       * Get a class name and its superclass names and store them into the set
       */
      ClassDeclaration(node) {
        if (node.id) {
          classNames.add(node.id.name)
        }

        if (node.superClass) {
          classNames.add(node.superClass.name)
        }
      },

      /**
       * Check if the variable is assigned to a class instance
       * and store the variable name into the set
       */
      VariableDeclarator(node) {
        if (!isNewExpression(node.init)) {
          return
        }

        // Check if the current class to variable is excluded
        if (excludedClasses.includes(node.init.callee.name)) {
          return
        }

        // Check if the extended class is excluded
        if (excludedClasses.some((excludedClass) => classNames.has(excludedClass))) {
          return
        }

        if (isIdentifier(node.id)) {
          // Store the class variable into the set.
          // It will be used in the BinaryExpression visitor to check if the variable is assigned to a class instance
          classVars.add(node.id.name)
        }
      },

      /**
       * Check if the left or right side of the binary expression is a class instance
       * and report if the operator is not allowed
       */
      BinaryExpression(node) {
        const leftIsClass = isIdentifier(node.left) && classVars.has(node.left.name)
        const rightIsClass = isIdentifier(node.right) && classVars.has(node.right.name)

        if (!leftIsClass && !rightIsClass) {
          return
        }

        if (allowedClassOperators.includes(node.operator)) {
          return
        }

        const operatorToken = context.sourceCode.getFirstTokenBetween(
          node.left,
          node.right,
          (token) => token.value === node.operator
        )

        const suggestion = findSuggestion(node.operator, options.suggestions, Array.from(classNames))

        context.report({
          loc: operatorToken.loc,
          messageId: 'unexpected',
          data: {
            operator: node.operator,
            suggestion,
          },
        })
      },
    }
  },
}
