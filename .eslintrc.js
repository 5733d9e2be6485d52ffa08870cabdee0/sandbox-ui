module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    // "plugin:xstate/all", cos-ui // https://issues.redhat.com/browse/MGDOBR-510
    // "plugin:storybook/recommended", app-services-ui-components
    "eslint:recommended",
    "prettier",
  ],
  plugins: [
    "@typescript-eslint",
    "eslint-plugin-react-hooks",
    "jest",
    "jest-dom",
    "react",
    "react-hooks",
    "testing-library",
    //"xstate", cos-ui https://issues.redhat.com/browse/MGDOBR-510
  ],

  // kafka-ui
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-function-return-type": "off", // https://issues.redhat.com/browse/MGDOBR-530
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "warn",

    "import/extensions": "off",
    "import/no-unresolved": "off",

    indent: ["error", 2],
    "object-curly-spacing": ["error", "always"],
    semi: ["error", "always"],

    "react/jsx-uses-react": "off",
    "react/prop-types": "error",
    "react/react-in-jsx-scope": "off",

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",

    "no-unused-vars": "off",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: ".",
            message:
              "Please import sibling components explictly to avoid cyclic dependencies",
          },
          {
            name: "./",
            message:
              "Please import sibling components explictly to avoid cyclic dependencies",
          },
          {
            name: "dayjs",
            message: "Please use date-fns instead",
          },
        ],
      },
    ],
  },

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
  globals: {
    console: "readonly",
    document: "readonly",
  },
};
