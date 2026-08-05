import defaultsDeep from 'lodash.defaultsdeep'

const defaultSuggestions = {
  '!=': 'Create and use `notEquals` class methods instead.',
  '!==': 'Create and use `notEquals` class methods instead.',
  '==': 'Create and use `equals` class methods instead.',
  '===': 'Create and use `equals` class methods instead.',
}

/**
 * Find a suggestion for the operator
 *
 * @param {string} operator
 * @param {object} suggestions
 * @param {string[]} classNames
 *
 * @returns {string}
 */
function findSuggestion(operator = '', suggestions = {}, classNames = []) {
  const mergedSuggestions = defaultsDeep({}, suggestions, { '*': defaultSuggestions })

  const classHasSuggestion = classNames.find((className) => mergedSuggestions[className]?.[operator])

  if (classHasSuggestion) {
    return ` ${mergedSuggestions[classHasSuggestion][operator]}`
  }

  const fallbackSuggestion = mergedSuggestions['*'][operator]

  return fallbackSuggestion ? ` ${fallbackSuggestion}` : ''
}

export { findSuggestion }
