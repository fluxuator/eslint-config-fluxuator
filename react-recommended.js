module.exports = {
  extends: [
    './index',
    './jsx-runtime',
    './jest',
    './testing-library',
    './prettier', // NOTE: Prettier config should be always at the last position!
  ],
};
