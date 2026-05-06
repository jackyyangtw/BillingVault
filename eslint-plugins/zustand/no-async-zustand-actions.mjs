/**
 * ESLint Rule: no-async-zustand-actions
 *
 * 禁止在 Zustand store 的 state creator 中定義 async function。
 * Zustand store 應只包含同步的狀態操作，非同步邏輯應放在 component 或獨立 action 層。
 *
 * 偵測範圍：
 *  - `create(...)` / `create<T>()(...)` (從 "zustand" import)
 *  - `createStore(...)` (從 "zustand/vanilla" import)
 *  - 包含 middleware 巢狀結構（如 `create(devtools((set) => ...))`)
 *  - 支援 renamed import（如 `import { create as myCreate } from "zustand"`）
 *
 * 注意：只會檢查從 "zustand" 或 "zustand/vanilla" 匯入的函式，
 * 其他套件的同名函式不會被誤判。
 *
 * @type {import("eslint").Rule.RuleModule}
 */
const rule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow async functions inside Zustand store state creators",
      recommended: true,
    },
    messages: {
      noAsyncZustandActions:
        "Zustand stores should not contain async functions. Move asynchronous logic to a component or a dedicated action module, and use TanStack Query when appropriate.",
    },
    schema: [],
  },

  create(context) {
    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    /**
     * 記錄從 "zustand" 或 "zustand/vanilla" 匯入的 local binding name。
     * 用來區分 zustand 的 create / createStore 與其他套件的同名函式。
     */
    const zustandBindings = new Set();

    /**
     * 已知的 Zustand middleware 名稱。
     * 若 create / createStore 的引數是這些函式的呼叫，我們會「穿透」
     * 它們，繼續往內層找真正的 state creator。
     */
    const ZUSTAND_MIDDLEWARES = new Set([
      "devtools",
      "persist",
      "subscribeWithSelector",
      "combine",
      "immer",
      "temporal",
    ]);

    /**
     * 遞迴穿透 middleware 包裝，找到最內層的 state creator callback。
     * 例如 `devtools(persist((set) => ...))` → 回傳 `(set) => ...`
     */
    function unwrapMiddlewares(node) {
      if (!node) return null;

      // 如果是 CallExpression 且 callee 是已知 middleware，取第一個引數繼續穿透
      if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        ZUSTAND_MIDDLEWARES.has(node.callee.name) &&
        node.arguments.length > 0
      ) {
        return unwrapMiddlewares(node.arguments[0]);
      }

      // 到達 function / arrow function → 就是 state creator
      if (
        node.type === "ArrowFunctionExpression" ||
        node.type === "FunctionExpression"
      ) {
        return node;
      }

      return null;
    }

    /**
     * 判斷 CallExpression 是否為從 zustand 匯入的 `create(...)` / `create<T>()(...)` / `createStore(...)`。
     */
    function isZustandCreateCall(node) {
      if (node.type !== "CallExpression") return false;

      const { callee } = node;

      // 直接呼叫: create(...) / createStore(...)
      if (callee.type === "Identifier") {
        return zustandBindings.has(callee.name);
      }

      // 泛型呼叫 (TypeScript): create<T>()(...)
      // AST 結構：CallExpression > callee = CallExpression > callee = Identifier
      if (
        callee.type === "CallExpression" &&
        callee.callee.type === "Identifier"
      ) {
        return zustandBindings.has(callee.callee.name);
      }

      return false;
    }

    // -----------------------------------------------------------------------
    // 記錄所有 state creator 函式節點，用來判斷某個 async fn 是否「在 store 裡」
    // -----------------------------------------------------------------------

    /** @type {Set<import("estree").Node>} */
    const stateCreatorBodies = new Set();

    /**
     * 檢查 node 是否在任一 state creator body 範圍內。
     */
    function isInsideStateCreator(node) {
      let current = node.parent;
      while (current) {
        if (stateCreatorBodies.has(current)) return true;
        current = current.parent;
      }
      return false;
    }

    // -----------------------------------------------------------------------
    // Visitor
    // -----------------------------------------------------------------------

    return {
      // 追蹤 import 來源，只記錄從 zustand 系列匯入的 binding
      ImportDeclaration(node) {
        const src = node.source.value;
        if (src !== "zustand" && src !== "zustand/vanilla") return;

        for (const spec of node.specifiers) {
          if (
            spec.type === "ImportSpecifier" &&
            (spec.imported.name === "create" ||
              spec.imported.name === "createStore")
          ) {
            // 支援 renamed import: import { create as xxx } from "zustand"
            zustandBindings.add(spec.local.name);
          }
        }
      },

      CallExpression(node) {
        if (!isZustandCreateCall(node)) return;

        // 取得傳入 create / createStore 的第一個引數
        const firstArg = node.arguments[0];
        if (!firstArg) return;

        const stateCreator = unwrapMiddlewares(firstArg);
        if (!stateCreator) return;

        // 記錄 body 範圍
        const body = stateCreator.body;
        if (body) {
          stateCreatorBodies.add(body);
        }
      },

      // 攔截所有 async function，再判斷是否在 state creator 裡
      ":function[async=true]"(node) {
        if (isInsideStateCreator(node)) {
          context.report({ node, messageId: "noAsyncZustandActions" });
        }
      },
    };
  },
};

export default rule;
