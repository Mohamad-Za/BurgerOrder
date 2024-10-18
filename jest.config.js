module.exports = {
  testEnvironment: 'node',
  transform: {
      '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/testing/**/*.test.js'], 
};