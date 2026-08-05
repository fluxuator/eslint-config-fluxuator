import { allSupportedFiles, ignores, onlyTypeScriptFiles, sharedPrettierConfig, testFiles } from './shared.config.js'

export default {
  ignores,
  allSupportedFiles,
  onlyTypeScriptFiles,
  testFiles,
  prettierConfig: sharedPrettierConfig,
}
