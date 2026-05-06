/**
 * eslint-plugin-zustand — 自訂 Zustand 相關 ESLint 規則。
 *
 * 目前包含：
 *  - no-async-zustand-actions: 禁止在 store state creator 中定義 async function。
 */
import noAsyncInStore from "./no-async-zustand-actions.mjs";

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
  meta: {
    name: "eslint-plugin-zustand",
    version: "1.0.0",
  },
  rules: {
    "no-async-zustand-actions": noAsyncInStore,
  },
};

export default plugin;
