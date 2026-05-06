import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import zustandPlugin from "./eslint-plugins/zustand/index.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom Zustand rules — 禁止在 store 中使用 async function。
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      zustand: zustandPlugin,
    },
    rules: {
      "zustand/no-async-zustand-actions": "error",
    },
  },
]);

export default eslintConfig;
