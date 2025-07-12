import createConfig from "@classroom/eslint-config/create-config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default createConfig(
  {
    react: true,
  },
  {
    plugins: {
      "@tanstack/query": pluginQuery,
    },
    rules: {
      "antfu/top-level-function": "off",
      "@tanstack/query/exhaustive-deps": "error",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md", "~__root.tsx"],
        },
      ],
    },
  },
  {
    files: ["**/*.test.js", "**/*.test.ts", "**/*-test.js", "**/*-test.ts"],
    languageOptions: {
      globals: {
        it: "readonly",
        expect: "readonly",
        describe: "readonly",
        test: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
  },
);
