module.exports = [
  ...require('./node'),
  ...require('./prettier'), // NOTE: Prettier config should be always at the last position!
];
