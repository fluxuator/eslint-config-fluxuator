import { ESLint } from 'eslint'
import nodeConfig from 'eslint-config-fluxuator/node'
import typedNodeConfig from 'eslint-config-fluxuator/node/typed'
import reactConfig from 'eslint-config-fluxuator/react'
import typedReactConfig from 'eslint-config-fluxuator/react/typed'

async function getParserOptions(config, filePath) {
  const eslint = new ESLint({
    overrideConfig: config,
    overrideConfigFile: true,
  })

  return (await eslint.calculateConfigForFile(filePath)).languageOptions.parserOptions
}

async function lintTypeScriptWithoutTsconfig(config) {
  const eslint = new ESLint({
    overrideConfig: config,
    overrideConfigFile: true,
  })

  return eslint.lintText('export const promise = Promise.resolve()', { filePath: 'src/example.ts' })
}

describe.each([
  ['node', nodeConfig],
  ['react', reactConfig],
])('%s base config', (_name, config) => {
  it('does not enable the TypeScript project service', async () => {
    await expect(getParserOptions(config, 'src/example.ts')).resolves.not.toHaveProperty('projectService')
  })

  it('lints a TypeScript file that is not part of a tsconfig project', async () => {
    const [result] = await lintTypeScriptWithoutTsconfig(config)

    expect(result.fatalErrorCount).toBe(0)
  })
})

describe.each([
  ['node', typedNodeConfig],
  ['react', typedReactConfig],
])('%s typed add-on', (_name, config) => {
  it('enables the TypeScript project service', async () => {
    await expect(getParserOptions(config, 'src/example.ts')).resolves.toHaveProperty('projectService', true)
  })
})
