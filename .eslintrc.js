module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:jest-dom/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "react-hooks", "jest-dom", "testing-library"],
  settings: {
    react: {
      version: "999.999.999",
    },
  },
  overrides: [
    {
      files: [
        "**/__tests__/**/*.[jt]s?(x)",
        "test/?(*.)+(spec|test).[jt]s?(x)",
      ],
      extends: ["plugin:testing-library/react"],
    },
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
};
