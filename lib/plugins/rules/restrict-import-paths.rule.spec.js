import { RuleTester } from 'eslint'
import { fileURLToPath } from 'node:url'
import path from 'path'

import restrictImportPathsRule from './restrict-import-paths.rule.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import("eslint").RuleTester} */
const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2015 },
})

const basePath = path.resolve(__dirname, '../__fixtures__')

const defaultConfigCtx = {
  filename: path.join(basePath, 'src/app/dir1/file.ts'),
  options: [
    {
      useTsConfig: path.join(basePath, 'tsconfig.json'),
    },
  ],
}

ruleTester.run('restrict-import-paths: default config', restrictImportPathsRule, {
  valid: [
    {
      ...defaultConfigCtx,
      code: "import { foo } from '#app/foo';",
    },
    {
      ...defaultConfigCtx,
      code: "import { foo } from '#app/file.ts';",
    },
    {
      ...defaultConfigCtx,
      code: "import { foo } from '#app/dir2/file.ts';",
    },
    {
      ...defaultConfigCtx,
      code: "import { foo } from 'ext-lib';",
    },
    {
      ...defaultConfigCtx,
      code: "import { foo } from '#unknown-alias';",
    },
  ],
  invalid: [
    {
      ...defaultConfigCtx,
      code: "import { foo } from '../foo';",
      output: "import { foo } from '#app/foo';",
      errors: [{ message: 'Use an aliased import path "#app/foo" instead of a relative one' }],
    },
    {
      ...defaultConfigCtx,
      code: "import { foo } from './file.spec.ts';",
      output: "import { foo } from '#app/dir1/file.spec.ts';",
      errors: [{ message: 'Use an aliased import path "#app/dir1/file.spec.ts" instead of a relative one' }],
    },
  ],
})

const sameFolderConfigCtx = {
  filename: path.join(basePath, 'src/app/dir1/file.ts'),
  options: [
    {
      allowedPathDepth: 0,
      useTsConfig: path.join(basePath, 'tsconfig.json'),
    },
  ],
}

ruleTester.run(
  'restrict-import-paths: default config but allowed releative path within same folder',
  restrictImportPathsRule,
  {
    valid: [
      {
        ...sameFolderConfigCtx,
        code: "import { foo } from './foo';",
      },
      {
        ...sameFolderConfigCtx,
        code: "import { foo } from '#app/file.ts';",
      },
      {
        ...sameFolderConfigCtx,
        code: "import { foo } from '#app/dir2/file.ts';",
      },
      {
        ...sameFolderConfigCtx,
        code: "import { foo } from 'ext-lib';",
      },
      {
        ...sameFolderConfigCtx,
        code: "import { foo } from '#unknown-alias';",
      },
    ],
    invalid: [
      {
        ...sameFolderConfigCtx,
        code: "import { foo } from '../foo';",
        output: "import { foo } from '#app/foo';",
        errors: [{ message: 'Use an aliased import path "#app/foo" instead of a relative one' }],
      },
      {
        ...sameFolderConfigCtx,
        code: "import { foo } from '#app/dir1/file.spec.ts';",
        output: "import { foo } from './file.spec.ts';",
        errors: [{ message: 'Use a relative import path "./file.spec.ts" instead of alias' }],
      },
    ],
  }
)

const anotherConfigCtx = {
  filename: path.join(basePath, 'app/dir1/file.ts'),
  options: [
    {
      allowedPathDepth: 0,
      rootDir: './app',
      useTsConfig: path.join(basePath, 'tsconfig.another.json'),
    },
  ],
}

ruleTester.run('restrict-import-paths: another config', restrictImportPathsRule, {
  valid: [
    {
      ...anotherConfigCtx,
      code: "import { foo } from './foo';",
    },
    {
      ...anotherConfigCtx,
      code: "import { foo } from '#app/file.ts';",
    },
    {
      ...anotherConfigCtx,
      code: "import { foo } from '#app/dir2/file.ts';",
    },
    {
      ...anotherConfigCtx,
      code: "import { foo } from 'ext-lib';",
    },
    {
      ...anotherConfigCtx,
      code: "import { foo } from '#unknown-alias';",
    },
  ],
  invalid: [
    {
      ...anotherConfigCtx,
      code: "import { foo } from '../foo';",
      output: "import { foo } from '#app/foo';",
      errors: [{ message: 'Use an aliased import path "#app/foo" instead of a relative one' }],
    },
    {
      ...anotherConfigCtx,
      code: "import { foo } from '#app/dir1/file.spec.ts';",
      output: "import { foo } from './file.spec.ts';",
      errors: [{ message: 'Use a relative import path "./file.spec.ts" instead of alias' }],
    },
  ],
})

const simpleConfigCtxDepth0 = {
  filename: path.join(basePath, 'src/dir1/file.ts'),
  options: [
    {
      allowedPathDepth: 0,
      rootDir: './src',
      useTsConfig: path.join(basePath, 'tsconfig.simple.json'),
    },
  ],
}

ruleTester.run('restrict-import-paths: simple config depth 0', restrictImportPathsRule, {
  valid: [
    {
      ...simpleConfigCtxDepth0,
      code: "import { foo } from './foo';",
    },
    {
      ...simpleConfigCtxDepth0,
      code: "import { foo } from '#app/file.ts';",
    },
    {
      ...simpleConfigCtxDepth0,
      code: "import { foo } from '#app/dir2/file.ts';",
    },
    {
      ...simpleConfigCtxDepth0,
      code: "import { foo } from 'ext-lib';",
    },
    {
      ...simpleConfigCtxDepth0,
      code: "import { foo } from '#unknown-alias';",
    },
  ],
  invalid: [
    {
      ...simpleConfigCtxDepth0,
      code: "import { foo } from '../foo';",
      output: "import { foo } from '#foo';",
      errors: [{ message: 'Use an aliased import path "#foo" instead of a relative one' }],
    },
    {
      ...simpleConfigCtxDepth0,
      code: "import { foo } from '#dir1/file.spec.ts';",
      output: "import { foo } from './file.spec.ts';",
      errors: [{ message: 'Use a relative import path "./file.spec.ts" instead of alias' }],
    },
  ],
})

const simpleConfigCtxDepth1 = {
  options: [
    {
      allowedPathDepth: 1,
      rootDir: './src',
      useTsConfig: path.join(basePath, 'tsconfig.simple.json'),
    },
  ],
}

ruleTester.run('restrict-import-paths: simple config depth 1', restrictImportPathsRule, {
  valid: [
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/file.ts'),
      code: "import { foo } from './foo';",
    },
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/file.ts'),
      code: "import { foo } from '#app/file.ts';",
    },
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/file.ts'),
      code: "import { foo } from '#app/dir1/file.ts';",
    },
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/sub-dir1/file.ts'),
      code: "import { foo } from '../sub-dir2/file.ts';",
    },
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/file.ts'),
      code: "import { foo } from 'ext-lib';",
    },
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/file.ts'),
      code: "import { foo } from '#unknown-alias';",
    },
  ],
  invalid: [
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/file.ts'),
      code: "import { foo } from '../foo';",
      output: "import { foo } from '#foo';",
      errors: [{ message: 'Use an aliased import path "#foo" instead of a relative one' }],
    },
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/file.ts'),
      code: "import { foo } from '#dir1/file.spec.ts';",
      output: "import { foo } from './file.spec.ts';",
      errors: [{ message: 'Use a relative import path "./file.spec.ts" instead of alias' }],
    },
    {
      ...simpleConfigCtxDepth1,
      filename: path.join(basePath, 'src/dir1/sub-dir1/file.ts'),
      code: "import { foo } from '#dir1/sub-dir2/file.ts';",
      output: "import { foo } from '../sub-dir2/file.ts';",
      errors: [{ message: 'Use a relative import path "../sub-dir2/file.ts" instead of alias' }],
    },
  ],
})
