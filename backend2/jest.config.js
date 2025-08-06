module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

  // An array of regexp pattern strings that are matched against all test paths
  // matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/'],

  // A map from regular expressions to paths to transformers
  transform: {},

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of paths to directories that Jest should use to search for files in
  roots: ['<rootDir>/src'],

  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover'],

  // An array of regexp pattern strings that are matched against all file paths before executing the test
  watchPathIgnorePatterns: ['node_modules'],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: 'jest-runner',

  // The paths to modules that run some code to configure or set up the testing environment
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework
  // setupFilesAfterEnv: [],

  // The number of seconds after which a test is considered as slow
  slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use
  // snapshotSerializers: [],

  // An array of regexp pattern strings that are matched against all source file paths before re-running tests
  // watchPathIgnorePatterns: [],
};