/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+[.]tsx?$': ['ts-jest', {tsconfig: 'tsconfig.test.json'}],
  },
  transformIgnorePatterns: [],
  testEnvironment: 'jsdom',
  verbose: true,
};
