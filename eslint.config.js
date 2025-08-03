import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierRecommended from "eslint-config-prettier";

export default [
  // 1. Base JavaScript rules
  js.configs.recommended,

  // 2. TypeScript-specific rules and parser
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsEslint,
      react: reactPlugin,
    },
    rules: {
      // TypeScript rules
      ...tsEslint.configs["eslint-recommended"].rules,
      ...tsEslint.configs["recommended"].rules,
      ...tsEslint.configs["recommended-requiring-type-checking"].rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",

      // React rules for TSX files
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    },
  },

  // 3. Import plugin rules (for both JS and TS)
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...importPlugin.configs.errors.rules,
      ...importPlugin.configs.warnings.rules,
      "import/no-unresolved": "error",
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          ts: "never",
          tsx: "never",
        },
      ],
    },
  },

  // 4. Prettier config (must be last to override other formatting rules)
  prettierRecommended,
];
