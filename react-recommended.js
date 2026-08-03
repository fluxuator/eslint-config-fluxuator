module.exports = [
  ...require('./index'),
  ...require('./jsx-runtime'),
  ...require('./prettier'), // NOTE: Prettier config should be always at the last position!
]
