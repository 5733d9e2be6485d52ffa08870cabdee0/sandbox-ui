/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "\\.(css|less|svg)$":
      "<rootDir>/node_modules/@patternfly/react-styles/__mocks__/styleMock.js",
  },
  reporters: ["default"],
  testEnvironment: "jsdom",
  testMatch: ["**/*.(spec|steps|test).[jt]s?(x)"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
};
