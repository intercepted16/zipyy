/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:svelte/prettier",
    "prettier"
  ],
  rules: {
    "no-console": "error",
    "svelte/no-target-blank": "error",
    "no-unused-vars": ["error", { varsIgnorePattern: "^_" }]
  },

  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    extraFileExtensions: [".svelte"]
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser"
      }
    }
  ]
};
