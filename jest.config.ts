/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import path from "path";

export default {
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|svg)$":
      "<rootDir>/node_modules/@patternfly/react-styles/__mocks__/styleMock.js",
    "@patternfly/react-code-editor": path.resolve(
      __dirname,
      "./__mocks__/react-code-editor.js"
    ),
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@i18n/(.*)$": "<rootDir>/src/i18n/$1",
    "^@apis/(.*)$": "<rootDir>/src/apis/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@contexts/(.*)$": "<rootDir>/src/contexts/$1",
    "^@openapi/(.*)$": "<rootDir>/openapi/$1",
  },
  reporters: ["default"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/*.(spec|steps|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    "node_modules/(?!@patternfly/react-icons|@patternfly/react-tokens|@novnc|@popperjs|lodash|monaco-editor|react-monaco-editor|byte-size|uniforms)",
  ],
  setupFilesAfterEnv: ["<rootDir>/setupJest.ts"],
};
