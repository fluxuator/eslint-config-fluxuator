const { getRelativePath, getPathsDepthDiff } = require('./path.utils')

describe('path.utils', () => {
  describe('getRelativePath', () => {
    const dataset = [
      {
        sourcePath: './index.ts',
        targetPath: './file.ts',
        expected: './file.ts',
      },
      {
        sourcePath: '/dir1/dir2/index.ts',
        targetPath: '/dir1/dir2/file.ts',
        expected: './file.ts',
      },
      {
        sourcePath: './dir/index.ts',
        targetPath: './file.ts',
        expected: '../file.ts',
      },
      {
        sourcePath: './src/dir1/file.ts',
        targetPath: './src/dir2/file.ts',
        expected: '../dir2/file.ts',
      },
      {
        sourcePath: './src/dir1/dir2/dir/3file.ts',
        targetPath: './file.ts',
        expected: '../../../../file.ts',
      },
    ]

    it.each(dataset)('compare "$sourcePath" with "$targetPath"', ({ sourcePath, targetPath, expected }) => {
      const result = getRelativePath(sourcePath, targetPath)

      expect(result).toBe(expected)
    })
  })

  describe('getPathsDepthDiff', () => {
    const dataset = [
      {
        currentFile: './index.ts',
        importedFile: './file.ts',
        expected: 0,
      },
      {
        currentFile: '/dir1/dir2/index.ts',
        importedFile: '/dir1/dir2/file.ts',
        expected: 0,
      },
      {
        currentFile: './dir/index.ts',
        importedFile: './file.ts',
        expected: 1,
      },
      {
        currentFile: './src/dir1/file.ts',
        importedFile: './src/dir2/file.ts',
        expected: 1,
      },
      {
        currentFile: './src/dir1/dir2/dir/3file.ts',
        importedFile: './file.ts',
        expected: 4,
      },
    ]

    it.each(dataset)('compare "$currentFile" with "$importedFile"', ({ currentFile, importedFile, expected }) => {
      const result = getPathsDepthDiff(currentFile, importedFile)

      expect(result).toBe(expected)
    })
  })
})
