module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-refresh/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["@typescript-eslint", "react-hooks", "react-refresh"],
  ignorePatterns: ["dist", "node_modules"],
  settings: {
    react: {
      version: "detect"
    }
  }
};
