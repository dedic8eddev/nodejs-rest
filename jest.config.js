module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  coveragePathIgnorePatterns: ["mocks/"],
  testPathIgnorePatterns: ["mocks/"],
  testResultsProcessor: "jest-sonar-reporter"
};
