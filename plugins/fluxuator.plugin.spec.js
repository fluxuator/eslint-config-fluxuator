const plugin = require('./fluxuator.plugin')

describe('fluxuator.plugin.js', () => {
  it('should have rules', () => {
    expect(plugin.rules).toHaveProperty('no-class-comparison')
    expect(plugin.rules).toHaveProperty('restrict-import-paths')
  })
})
