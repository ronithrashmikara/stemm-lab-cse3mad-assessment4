module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  collectCoverageFrom: ['src/domain/**/*.ts', 'src/data/**/*.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/submission/', '<rootDir>/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/submission/', '<rootDir>/dist/'],
};
