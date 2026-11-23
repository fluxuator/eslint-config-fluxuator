import { generateNotes } from '@semantic-release/release-notes-generator'

import packageJson from './package.json' with { type: 'json' }

it('generates release notes with the configured Conventional Commits preset', async () => {
  const [, config] = packageJson.release.plugins.find(
    (plugin) => Array.isArray(plugin) && plugin[0] === '@semantic-release/release-notes-generator'
  )
  const notes = await generateNotes(config, {
    cwd: process.cwd(),
    options: { repositoryUrl: packageJson.repository.url },
    commits: [{ hash: '1234567890abcdef', message: 'fix: release regression' }],
    lastRelease: { gitTag: '4.2.1' },
    nextRelease: { gitTag: '4.2.2', version: '4.2.2' },
    logger: { log() {} },
  })

  expect(notes).toContain('release regression')
  expect(notes).toContain('4.2.2')
})
