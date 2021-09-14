/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jsdom',
  verbose: true,
  transformIgnorePatterns: [
      "node_modules/"
  ]
};
