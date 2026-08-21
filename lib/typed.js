import eslintJS from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tsESLint from 'typescript-eslint'

import { typeAwareRules } from './rules/typescript.js'
import { onlyTypeScriptFiles } from './shared.config.js'

export function createTypedConfig(name) {
  return defineConfig({
    name: `${name}/typescript/typed`,
    files: onlyTypeScriptFiles,
    extends: [eslintJS.configs.recommended, ...tsESLint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: typeAwareRules,
  })
}
