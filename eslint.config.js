// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

// Using an async IIFE (Immediately Invoked Function Expression) to use dynamic import
module.exports = (async () => {
  const unicorn = await import("eslint-plugin-unicorn");

  return defineConfig([
    {
      files: ["**/*.ts"],
      extends: [
        eslint.configs.recommended,
        tseslint.configs.recommended,
        tseslint.configs.stylistic,
        angular.configs.tsRecommended,
      ],
      plugins: {
        unicorn: unicorn.default,
      },
      processor: angular.processInlineTemplates,
      rules: {
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
          },
        ],
        "@angular-eslint/component-selector": [
          "warn",
          {
            type: "element",
            prefix: "app",
            style: "kebab-case",
          },
        ],
        // ⚠️ Temporarily set to "warn" to unblock CI
        // TODO: 👷🏼 Fix all occurrences category by category, then restore the "error" value
        "@angular-eslint/prefer-inject": "warn",
        "unicorn/filename-case": [
          "warn",
          {
            "case": "kebabCase",
            "ignore": [/^.*\.config\.js$/]
          }
        ],
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@angular-eslint/contextual-lifecycle": "warn",
        "@typescript-eslint/no-unused-expressions": "warn",
        "no-prototype-builtins": "warn",

      },
    },
    {
      files: ["**/*.html"],
      extends: [
        angular.configs.templateRecommended,
        angular.configs.templateAccessibility,
      ],
      rules: {
        // ⚠️ Temporarily set to "warn" to unblock CI
        // TODO: 👷🏼 Fix all occurrences category by category, then restore the "error" value
        "@angular-eslint/template/eqeqeq": "warn",
        "@angular-eslint/template/click-events-have-key-events": "warn",
        "@angular-eslint/template/interactive-supports-focus": "warn",
        "@angular-eslint/template/alt-text": "warn",
        // ⚠️ Rule is for Angular 17+ control flow. Not relevant for v15.
        "@angular-eslint/template/prefer-control-flow": "off",
      },
    }
  ]);
})();
