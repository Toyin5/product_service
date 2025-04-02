import type { Config } from "jest";

const config: Config = {};

export default config;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testRegex: "./__tests__/.*\\.spec\\.ts$",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/config/"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
