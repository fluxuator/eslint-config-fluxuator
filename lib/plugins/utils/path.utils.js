const path = require('path')

function getRelativePath(sourcePath, targetPath) {
  const relativePath = path.relative(path.dirname(sourcePath), targetPath)

  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

/**
 * Checks if two paths are in the same directory or have the same depth.
 *
 * @param {string} currentFile
 * @param {string} importedFile
 *
 * @returns {number}
 */
function getPathsDepthDiff(currentFile, importedFile) {
  let relativePath = getRelativePath(currentFile, importedFile)
  let depth = 0

  if (relativePath.startsWith('./')) {
    return depth
  }

  while (relativePath.startsWith('../')) {
    depth += 1
    relativePath = relativePath.substring(3)
  }

  return depth
}

module.exports = {
  getPathsDepthDiff,
  getRelativePath,
}
