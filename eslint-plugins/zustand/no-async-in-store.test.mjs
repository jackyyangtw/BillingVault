// @vitest-environment node
import { RuleTester } from "eslint";
import { describe } from "vitest";
import rule from "./no-async-in-store.mjs";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MSG_ID = "noAsyncInStore";

/**
 * 快速建立 invalid case — 預設只有 1 個 error
 */
function invalid(code, errorCount = 1) {
  return {
    code,
    errors: Array.from({ length: errorCount }, () => ({
      messageId: MSG_ID,
    })),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("no-async-in-store", () => {
  ruleTester.run("no-async-in-store", rule, {
    // =======================================================================
    // ✅ Valid — 不應報錯
    // =======================================================================
    valid: [
      // ----- 基本同步 store -----
      {
        name: "同步 arrow function — 不應報錯",
        code: `
            import { create } from "zustand";
            const useStore = create((set) => ({
              count: 0,
              inc: () => set((s) => ({ count: s.count + 1 })),
            }));
          `,
      },

      // ----- async 不在 store 內 -----
      {
        name: "async function 定義在 store 外部 — 不應報錯",
        code: `
            import { create } from "zustand";
            async function fetchData() { return 42; }
            const useStore = create((set) => ({
              count: 0,
            }));
          `,
      },

      // ----- middleware 包裝但內部同步 -----
      {
        name: "devtools middleware 包裝、內部同步 — 不應報錯",
        code: `
            import { create } from "zustand";
            const useStore = create(devtools((set) => ({
              count: 0,
              inc: () => set((s) => ({ count: s.count + 1 })),
            })));
          `,
      },
      {
        name: "persist + devtools 巢狀、內部同步 — 不應報錯",
        code: `
            import { create } from "zustand";
            const useStore = create(devtools(persist((set) => ({
              count: 0,
            }))));
          `,
      },

      // ----- 其他套件的 create — 不應報錯（false positive 防護）-----
      {
        name: "其他套件的 create — 不應報錯",
        code: `
            import { create } from "some-other-lib";
            const thing = create((set) => ({
              fetch: async () => {},
            }));
          `,
      },
      {
        name: "其他套件的 createStore — 不應報錯",
        code: `
            import { createStore } from "another-lib";
            const store = createStore((set) => ({
              load: async () => {},
            }));
          `,
      },
      {
        name: "沒有 import 的 create — 不應報錯",
        code: `
            const useStore = create((set) => ({
              fetch: async () => {},
            }));
          `,
      },

      // ----- createStore from zustand/vanilla、同步 -----
      {
        name: "createStore 同步 — 不應報錯",
        code: `
            import { createStore } from "zustand/vanilla";
            const store = createStore((set) => ({
              count: 0,
            }));
          `,
      },

      // ----- renamed import、同步 -----
      {
        name: "renamed import 同步 — 不應報錯",
        code: `
            import { create as myCreate } from "zustand";
            const useStore = myCreate((set) => ({
              count: 0,
            }));
          `,
      },
    ],

    // =======================================================================
    // ❌ Invalid — 應報錯
    // =======================================================================
    invalid: [
      // ----- 基本：store 內有 async -----
      invalid(`
          import { create } from "zustand";
          const useStore = create((set) => ({
            fetch: async () => {},
          }));
        `),

      // ----- middleware 穿透 -----
      invalid(`
          import { create } from "zustand";
          const useStore = create(devtools((set) => ({
            fetch: async () => {},
          })));
        `),
      invalid(`
          import { create } from "zustand";
          const useStore = create(devtools(persist((set) => ({
            fetch: async () => {},
          }))));
        `),

      // ----- createStore (zustand/vanilla) -----
      invalid(`
          import { createStore } from "zustand/vanilla";
          const store = createStore((set) => ({
            load: async () => {},
          }));
        `),

      // ----- renamed import -----
      invalid(`
          import { create as myCreate } from "zustand";
          const useStore = myCreate((set) => ({
            fetch: async () => {},
          }));
        `),

      // ----- 多個 async method → 應各報一次 -----
      invalid(
        `
          import { create } from "zustand";
          const useStore = create((set) => ({
            fetchA: async () => {},
            fetchB: async () => {},
          }));
        `,
        2,
      ),

      // ----- async function expression（非 arrow）-----
      invalid(`
          import { create } from "zustand";
          const useStore = create((set) => ({
            fetch: async function() {},
          }));
        `),

      // ----- immer middleware 穿透 -----
      invalid(`
          import { create } from "zustand";
          const useStore = create(immer((set) => ({
            fetch: async () => {},
          })));
        `),
    ],
  });
});
