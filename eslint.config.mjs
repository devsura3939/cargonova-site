import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import reactKeyUniqueness from "./eslint/rules/react-key-uniqueness.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      local: {
        rules: {
          "react-key-uniqueness": reactKeyUniqueness,
        },
      },
    },
    rules: {
      // Prose-heavy marketing copy uses straight apostrophes/quotes in JSX.
      // HTML entities would hurt readability; Next.js renders them safely.
      "react/no-unescaped-entities": "off",
      // Missing keys already error via eslint-config-next; state it explicitly
      // so the intent survives config refactors.
      "react/jsx-key": "error",
      // Provably-duplicate keys in the same map fail lint (and thus build).
      "local/react-key-uniqueness": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
