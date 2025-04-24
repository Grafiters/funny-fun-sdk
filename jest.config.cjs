/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm', // Use ts-jest for ESM modules
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'], // Only include .ts for ESM treatment
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { useESM: true }],
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Fix ESM import paths for .js
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@solana|ethers|web3))/', // Transform some node_modules
  ],
};
