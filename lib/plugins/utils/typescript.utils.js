/** @type {import("typescript/lib/tsc")} */
import fs from 'node:fs'
import path from 'path'
import ts from 'typescript'

/**
 * Resolves a TypeScript configuration file path.
 *
 * @param {string} basePath
 * @param {boolean|string} useTsConfigPath
 *
 * @returns {string} The full path to TypeScript configuration file.
 */
function resolveTsConfigPath(basePath, useTsConfigPath) {
  let resolvedPath

  if (useTsConfigPath === true) {
    resolvedPath = 'tsconfig.json'
  } else if (typeof useTsConfigPath === 'string') {
    resolvedPath = useTsConfigPath
  }

  if (!resolvedPath) {
    return ''
  }

  resolvedPath = path.resolve(basePath, resolvedPath)

  return fs.existsSync(resolvedPath) ? resolvedPath : ''
}

/**
 * Resolves a TypeScript configuration file.
 *
 * @param {string} tsConfigPath
 *
 * @returns {object} The resolved configuration.
 */
function getTsConfig(tsConfigPath = '') {
  if (!tsConfigPath) {
    return
  }

  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile)

  if (configFile.error) {
    throw new Error(
      ts.formatDiagnostics([configFile.error], {
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
      })
    )
  }

  const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(tsConfigPath))

  if (parsedConfig.errors.length > 0) {
    throw new Error(
      ts.formatDiagnostics(parsedConfig.errors, {
        getCanonicalFileName: (fileName) => fileName,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getNewLine: () => ts.sys.newLine,
      })
    )
  }

  const basePath = parsedConfig.options.baseUrl || path.dirname(tsConfigPath)

  return {
    basePath,
    paths: parsedConfig.options.paths || {},
  }
}

/**
 * @param {string} basePath
 * @param {object|undefined} aliasPaths
 *
 * @returns {object|undefined}
 */
function normalizeAliasPaths(basePath, aliasPaths) {
  if (!aliasPaths) {
    return
  }

  return Object.entries(aliasPaths).reduce((acc, [alias, relativePaths]) => {
    const fixedAlias = alias.replace(/\*$/, '')

    if (acc[fixedAlias] || relativePaths.length === 0) {
      return acc
    }

    const aliasPath = relativePaths[0].replace(/\*$/, '')

    acc[fixedAlias] = path.join(basePath, aliasPath)

    return acc
  }, {})
}

function findAlias(filePath, tsAliasPaths) {
  return Object.entries(tsAliasPaths)
    .sort(([left], [right]) => right.length - left.length)
    .find(([alias]) => filePath.startsWith(alias))
}

function isPathAlias(filePath, tsAliasPaths) {
  return Boolean(findAlias(filePath, tsAliasPaths))
}

/**
 * @param {string} filePath
 * @param {object} tsAliasPaths
 * @returns {string}
 */
function resolvePathByAlias(filePath, tsAliasPaths) {
  const match = findAlias(filePath, tsAliasPaths)

  return match ? match[1] + filePath.slice(match[0].length) : filePath
}

/**
 * @param {string} filePath
 * @param {object} tsAliasPaths
 * @returns {string|undefined}
 */
function resolveAliasByPath(filePath, tsAliasPaths) {
  const entries = Object.entries(tsAliasPaths)
    .map(([alias, target]) => [alias, path.resolve(target)])
    .sort(([, left], [, right]) => right.length - left.length)

  for (const [alias, target] of entries) {
    const relativePath = path.relative(target, path.resolve(filePath))

    if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
      continue
    }

    return (alias + relativePath.split(path.sep).join('/')).replace(/\/$/, '')
  }
}

export { resolveTsConfigPath, getTsConfig, normalizeAliasPaths, isPathAlias, resolvePathByAlias, resolveAliasByPath }
