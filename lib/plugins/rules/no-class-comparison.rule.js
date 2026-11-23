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

    function findVariable(identifier) {
      let scope = context.sourceCode.getScope(identifier)

      while (scope) {
        const variable = scope.set.get(identifier.name)

        if (variable) {
          return variable
        }

        scope = scope.upper
      }
    }

    function getClassNames(identifier, visited = new Set()) {
      if (!isIdentifier(identifier)) {
        return []
      }

      const variable = findVariable(identifier)

      if (visited.has(variable)) {
        return []
      }

      visited.add(variable)

      const definition = variable?.defs[0]
      const classNode = definition?.type === 'ClassName' ? definition.node : definition?.node.init

      return [identifier.name, ...(classNode?.superClass ? getClassNames(classNode.superClass, visited) : [])]
    }

    function getInstanceClasses(node) {
      if (!isIdentifier(node)) {
        return []
      }

      const definition = findVariable(node)?.defs.find((def) => def.type === 'Variable')
      const initializer = definition?.node.init

      if (!isNewExpression(initializer)) {
        return []
      }

      const names = getClassNames(initializer.callee)

      if (names.some((name) => excludedClasses.includes(name))) {
        return []
      }

      // Keep checking instances whose constructor is a member expression or anonymous class.
      return names.length > 0 ? names : ['*']
    }

    return {
      /**
       * Check if the left or right side of the binary expression is a class instance
       * and report if the operator is not allowed
       */
      BinaryExpression(node) {
        const classNames = [...getInstanceClasses(node.left), ...getInstanceClasses(node.right)]

        if (classNames.length === 0) {
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

        const suggestion = findSuggestion(node.operator, options.suggestions, classNames)

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
