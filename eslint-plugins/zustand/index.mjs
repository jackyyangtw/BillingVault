/**
 * eslint-plugin-zustand — 自訂 Zustand 相關 ESLint 規則。
 *
 * 目前包含：
 *  - no-async-in-store: 禁止在 store state creator 中定義 async function。
 */
import noAsyncInStore from "./no-async-in-store.mjs";

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
  meta: {
    name: "eslint-plugin-zustand",
    version: "1.0.0",
  },
  rules: {
    "no-async-in-store": noAsyncInStore,
  },
};

export default plugin;
