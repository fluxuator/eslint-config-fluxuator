import { fileURLToPath } from 'node:url'
import path from 'path'

import {
  getTsConfig,
  isPathAlias,
  normalizeAliasPaths,
  resolveAliasByPath,
  resolvePathByAlias,
  resolveTsConfigPath,
} from './typescript.utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('typescript.utils', () => {
  describe('resolveTsConfigPath', () => {
    const basePath = path.resolve(__dirname, '../__fixtures__')

    it('should return the path to the tsconfig.json file', () => {
      const tsConfigPath = resolveTsConfigPath(basePath, true)

      expect(tsConfigPath).toBe(`${basePath}/tsconfig.json`)
    })

    it('should return the path to the specified tsconfig file', () => {
      const customFile = 'tsconfig.another.json'

      const tsConfigPath = resolveTsConfigPath(basePath, customFile)

      expect(tsConfigPath).toBe(`${basePath}/${customFile}`)
    })

    it('should return an empty string if no tsconfig file is specified', () => {
      const tsConfigPath = resolveTsConfigPath(basePath, false)

      expect(tsConfigPath).toBe('')
    })
  })

  describe('getTsConfig', () => {
    const cwd = path.resolve(__dirname, '../__fixtures__')

    describe('should return the path aliases from the tsconfig.json file', () => {
      it('should return the path aliases with defined `baseUrl` parameter', () => {
        const aliases = getTsConfig(path.join(cwd, 'tsconfig.json'))

        expect(aliases).toEqual({
          basePath: `${cwd}/src`,
          paths: {
            '#app/*': ['app/*'],
            '#testing-utils': ['testing-utils'],
            '#testing-utils/*': ['testing-utils/*'],
          },
        })
      })

      it('should return the path aliases with default `baseUrl` parameter', () => {
        const aliases = getTsConfig(path.join(cwd, 'tsconfig.another.json'))

        expect(aliases).toEqual({
          basePath: `${cwd}`,
          paths: {
            '#app/*': ['app/*'],
            '#testing-utils': ['testing-utils'],
            '#testing-utils/*': ['testing-utils/*'],
          },
        })
      })

      it('should return an empty object if the tsconfig file is not provided', () => {
        const result = getTsConfig()

        expect(result).toBeUndefined()
      })

      it('should return an empty object if the tsconfig file is not found', () => {
        expect(() => {
          getTsConfig('invalid.json')
        }).toThrow("error TS5083: Cannot read file 'invalid.json'.")
      })
    })
  })

  describe('normalizeAliasPaths', () => {
    const cwd = path.resolve(__dirname, '../__fixtures__')

    describe('should return the normalized path aliases', () => {
      const dataset = [
        {
          basePath: `${cwd}/src`,
          paths: {
            '#app/*': ['app/*'],
            '#testing-utils': ['testing-utils'],
            '#testing-utils/*': ['testing-utils/*'],
          },
          expected: {
            '#app/': `${cwd}/src/app/`,
            '#testing-utils': `${cwd}/src/testing-utils`,
            '#testing-utils/': `${cwd}/src/testing-utils/`,
          },
        },
        {
          basePath: cwd,
          paths: {
            '#*': ['src/*'],
          },
          expected: {
            '#': `${cwd}/src/`,
          },
        },
      ]

      it.each(dataset)('given %p', ({ basePath, paths, expected }) => {
        const result = normalizeAliasPaths(basePath, paths)

        expect(result).toEqual(expected)
      })
    })
  })

  describe('isPathAlias', () => {
    const aliases = {
      '@app': ['./src/app'],
      '#foo': ['./src/foo'],
    }

    describe('should assert if the path is an alias or not', () => {
      const dataset = [
        {
          sourcePath: '@app/index.ts',
          expected: true,
        },
        {
          sourcePath: '#foo/index.ts',
          expected: true,
        },
        {
          sourcePath: '#bar/index.ts',
          expected: false,
        },
        {
          sourcePath: './index.ts',
          expected: false,
        },
      ]

      it.each(dataset)('given %p', ({ sourcePath, expected }) => {
        const result = isPathAlias(sourcePath, aliases)

        expect(result).toBe(expected)
      })
    })
  })

  describe('resolvePathByAlias', () => {
    const aliases = {
      '@app': ['./src/app'],
    }

    describe('should find the alias for the path', () => {
      const dataset = [
        {
          sourcePath: '@app/index.ts',
          expected: './src/app/index.ts',
        },
        {
          sourcePath: '@app/foo/bar.ts',
          expected: './src/app/foo/bar.ts',
        },
        {
          sourcePath: '@app',
          expected: './src/app',
        },
        {
          sourcePath: '@app.ts',
          expected: './src/app.ts',
        },
        {
          sourcePath: '../src/app/file.js',
          expected: '../src/app/file.js',
        },
      ]

      it.each(dataset)('$sourcePath => $expected', ({ sourcePath, expected }) => {
        const result = resolvePathByAlias(sourcePath, aliases)

        expect(result).toBe(expected)
      })
    })
  })

  describe('resolveAliasByPath', () => {
    const basePath = __dirname

    describe('should resolve path by the`@app` alias', () => {
      const aliases = {
        '@app/': './src/app',
      }

      const dataset = [
        {
          sourcePath: 'src/app/index.ts',
          expected: '@app/index.ts',
        },
        {
          sourcePath: 'src/app/bar.ts',
          expected: '@app/bar.ts',
        },
        {
          sourcePath: 'src/app',
          expected: '@app',
        },
        {
          sourcePath: './src/app/foo/bar.ts',
          expected: '@app/foo/bar.ts',
        },
        {
          sourcePath: '../src/app/file.js',
          expected: undefined,
        },
      ]

      it.each(dataset)('$sourcePath => $expected', ({ sourcePath, expected }) => {
        const result = resolveAliasByPath(basePath, sourcePath, aliases)

        expect(result).toBe(expected)
      })
    })

    describe('should resolve path by the`@*` alias', () => {
      const aliases = {
        '@': './src',
      }

      const dataset = [
        {
          sourcePath: 'src/index.ts',
          expected: '@index.ts',
        },
        {
          sourcePath: 'src/app/index.ts',
          expected: '@app/index.ts',
        },
        {
          sourcePath: './src/app/foo/bar.ts',
          expected: '@app/foo/bar.ts',
        },
        {
          sourcePath: '../src/app/file.js',
          expected: undefined,
        },
      ]

      it.each(dataset)('$sourcePath => $expected', ({ sourcePath, expected }) => {
        const result = resolveAliasByPath(basePath, sourcePath, aliases)

        expect(result).toBe(expected)
      })
    })
  })
})
