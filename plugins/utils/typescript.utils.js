/** @type {import("typescript/lib/tsc")} */
const ts = require('typescript')
const path = require('path')
const fs = require('node:fs')

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

function isPathAlias(filepath, tsAliasPaths) {
  return Object.keys(tsAliasPaths).some((alias) => filepath.startsWith(alias))
}

/**
 * @param {string} filePath
 * @param {object} tsAliasPaths
 * @returns {string}
 */
function resolvePathByAlias(filePath, tsAliasPaths) {
  for (const [alias, aliasPath] of Object.entries(tsAliasPaths)) {
    if (filePath.startsWith(alias)) {
      return filePath.replace(alias, aliasPath)
    }
  }

  return filePath
}

/**
 * @param {string} baseDir
 * @param {string}filePath
 * @param {object}tsAliasPaths
 * @returns {string|undefined}
 */
function resolveAliasByPath(baseDir, filePath, tsAliasPaths) {
  for (const [alias, aliasPath] of Object.entries(tsAliasPaths)) {
    const normalizedFilePath = path.normalize(filePath)
    const normalizedAliasPath = path.normalize(aliasPath)

    if (normalizedFilePath.startsWith(normalizedAliasPath)) {
      return (alias + normalizedFilePath.replace(normalizedAliasPath, '').replace(/^\//, '')).replace(/\/$/, '')
    }
  }
}

module.exports = {
  resolveTsConfigPath,
  getTsConfig,
  normalizeAliasPaths,
  isPathAlias,
  resolvePathByAlias,
  resolveAliasByPath,
}
