import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import prettierRecommended from "eslint-config-prettier";

export default [
  // Base JS rules
  js.configs.recommended,

  // React plugin
  {
    plugins: {
      react: reactPlugin,
    },
    files: ["**/*.jsx", "**/*.tsx"],
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

  // JSX a11y plugin
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      ...jsxA11y.configs.recommended.rules,
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

  // Prettier config (should be last)
  prettierRecommended,
];
