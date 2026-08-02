const fluxuatorPlugin = require('./plugins/fluxuator.plugin')

module.exports = [
  {
    plugins: {
      fluxuator: fluxuatorPlugin,
    },
    rules: {
      'fluxuator/no-class-comparison': 'error',
    },
  },
]
