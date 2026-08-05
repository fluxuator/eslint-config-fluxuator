import path from 'path'

import { getPathsDepthDiff, getRelativePath } from '../utils/path.utils.js'
import {
  getTsConfig,
  isPathAlias,
  normalizeAliasPaths,
  resolveAliasByPath,
  resolvePathByAlias,
  resolveTsConfigPath,
} from '../utils/typescript.utils.js'

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: 'layout',
    fixable: 'code',
    messages: {
      preferRelative: 'Use a relative import path "{{path}}" instead of alias',
      preferAlias: 'Use an aliased import path "{{path}}" instead of a relative one',
    },
    schema: {
      type: 'array',
      minItems: 0,
      maxItems: 1,
      items: [
        {
          type: 'object',
          properties: {
            useTsConfig: {
              anyOf: [
                {
                  type: 'boolean',
                },
                {
                  type: 'string',
                },
              ],
            },
            allowedPathDepth: { type: 'number' },
            rootDir: { type: 'string' },
          },
          additionalProperties: false,
        },
      ],
    },
  },

  /**
   * @param {import("eslint").Rule.RuleContext} context
   *
   * @returns {import("eslint").Rule.NodeListener}
   */
  create(context) {
    const {
      /**
       * -1 - any relation path is allowed
       * 0 - relation path within the same directory is allowed
       * 1 - relation path to parent directory is allowed
       * 2 - relation path to grandparent directory is allowed
       * ...
       */
      allowedPathDepth = -1,
      rootDir = './src',
      useTsConfig = true,
    } = context.options[0] || {}
    const tsConfigPath = resolveTsConfigPath(context.cwd, useTsConfig)
    const workingDirPath = tsConfigPath ? path.dirname(tsConfigPath) : context.cwd
    const rootDirPath = path.resolve(workingDirPath, rootDir)
    let aliasedPaths

    if (tsConfigPath) {
      const tsConfig = getTsConfig(tsConfigPath)

      aliasedPaths = tsConfig ? normalizeAliasPaths(tsConfig.basePath, tsConfig.paths) : undefined
    }

    /**
     * Gets the top-level directory within the root directory
     * @param {string} filePath - Absolute file path
     * @param {string} rootPath - Absolute root path
     * @returns {string} The top-level directory name
     */
    function getTopLevelDir(filePath, rootPath) {
      const relativePath = path.relative(rootPath, filePath)
      const parts = relativePath.split(path.sep)

      return parts[0]
    }

    return {
      ImportDeclaration(node) {
        if (!aliasedPaths) {
          // No aliases - nothing to check
          return
        }

        const currentFilePath = context.filename
        const contextDirPath = path.dirname(currentFilePath)

        if (!currentFilePath.startsWith(rootDirPath)) {
          // Skip files that are not in the root directory

          return
        }

        const importPath = node.source.value
        const isRelativePath = importPath.startsWith('.')
        const isAliasedPath = isPathAlias(importPath, aliasedPaths)

        if (!isRelativePath && !isAliasedPath) {
          // We're not interested in import paths of vendors
          return
        }

        let resolvedImportedPath

        if (isRelativePath) {
          resolvedImportedPath = path.resolve(contextDirPath, importPath)
        } else if (isAliasedPath) {
          const resolvedAliasedPath = resolvePathByAlias(importPath, aliasedPaths)

          resolvedImportedPath = path.resolve(workingDirPath, resolvedAliasedPath)
        } else {
          throw new Error('Unexpected path type')
        }

        const importPathDepthDiff = getPathsDepthDiff(currentFilePath, resolvedImportedPath)

        // Check if both files are in the same top-level module directory
        const currentTopLevelDir = getTopLevelDir(currentFilePath, rootDirPath)
        const importedTopLevelDir = getTopLevelDir(resolvedImportedPath, rootDirPath)
        const isSameModule = currentTopLevelDir === importedTopLevelDir

        if (isAliasedPath && importPathDepthDiff <= allowedPathDepth && isSameModule) {
          const relativePath = getRelativePath(currentFilePath, resolvedImportedPath)

          context.report({
            node,
            messageId: 'preferRelative',
            data: {
              path: relativePath,
            },
            fix(fixer) {
              return fixer.replaceTextRange([node.source.range[0] + 1, node.source.range[1] - 1], relativePath)
            },
          })
        }

        if (isRelativePath && (importPathDepthDiff > allowedPathDepth || !isSameModule)) {
          const aliasedPath = resolveAliasByPath(workingDirPath, resolvedImportedPath, aliasedPaths)

          if (!aliasedPath) {
            return
          }

          context.report({
            node,
            messageId: 'preferAlias',
            data: {
              path: aliasedPath,
            },
            fix(fixer) {
              return fixer.replaceTextRange([node.source.range[0] + 1, node.source.range[1] - 1], aliasedPath)
            },
          })
        }
      },
    }
  },
}
