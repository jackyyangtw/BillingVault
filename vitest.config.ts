import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // 讓 "server-only" 在測試環境中不拋錯
      "server-only": path.resolve(__dirname, "./__mocks__/server-only.ts"),
    },
  },
  test: {
    // 覆蓋率設定
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/types.ts",
        "src/**/index.ts",
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
        "src/components/ui/**",
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          // 使用 jsdom 模擬瀏覽器環境（Zustand / React 測試需要）
          environment: "jsdom",
          // 測試檔案位置
          include: [
            "src/**/*.test.{ts,tsx}",
            "eslint-plugins/**/*.test.{mjs,ts}",
          ],
          // 全域 setup（如有需要可在此擴充）
          globals: true,
          // 全域 setup — 註冊 @testing-library/jest-dom matchers
          setupFiles: ["./vitest.setup.ts"],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
