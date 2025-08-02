import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierRecommended from "eslint-config-prettier";
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Base JS rules
  js.configs.recommended,

  // React plugin
  {
    plugins: {
      react: reactPlugin,
    },
    files: ["**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // React 17+ JSX transform
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Import plugin
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...importPlugin.configs.errors.rules,
      ...importPlugin.configs.warnings.rules,
    },
  },

  // Prettier plugin
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.{ts,tsx}"], // Apply specifically to TypeScript files
    languageOptions: {
      parser: tsParser, // Use the TypeScript parser
      parserOptions: {
        project: "./tsconfig.json", // <--- THIS IS THE KEY PART!
        tsconfigRootDir: import.meta.dirname, // Helps resolve the tsconfig path correctly
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Add your TypeScript specific rules here
      ...tsEslint.configs["eslint-recommended"].rules, // Disable base ESLint rules handled by TS
      ...tsEslint.configs["recommended"].rules,
      ...tsEslint.configs["recommended-requiring-type-checking"].rules,
      // Example:
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      // ... more TS rules
    },
    settings: {
      "import/resolver": {
        typescript: {
          // Always try to resolve types under the `types` folder even when no `tsconfig.json` is present
          alwaysTryTypes: true,
          // Optional: Specify the tsconfig.json file(s)
          // If you have multiple tsconfig files (e.g., for different build targets),
          // you can provide an array: `project: ['./tsconfig.json', './tsconfig.node.json']`
          project: "./tsconfig.json", // <--- This resolver setting also uses tsconfig!
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"], // Ensure node resolver knows about TS extensions
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    },
  },

  // Prettier config (should be last)
  prettierRecommended,
];
