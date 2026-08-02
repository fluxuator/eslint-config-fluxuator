/**
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isNewExpression(node) {
  return node && node.type === 'NewExpression'
}

/**
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isIdentifier(node) {
  return node && node.type === 'Identifier'
}

module.exports = {
  isNewExpression,
  isIdentifier,
}
