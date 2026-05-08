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
    const zustandBindings = new Set();

    const ZUSTAND_MIDDLEWARES = new Set([
      "devtools",
      "persist",
      "subscribeWithSelector",
      "combine",
      "immer",
      "temporal",
    ]);

    function resolveStateCreator(node) {
      if (!node) return null;

      if (
        node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        ZUSTAND_MIDDLEWARES.has(node.callee.name) &&
        node.arguments.length > 0
      ) {
        return resolveStateCreator(node.arguments[0]);
      }

      if (
        node.type === "ArrowFunctionExpression" ||
        node.type === "FunctionExpression"
      ) {
        return node;
      }

      return null;
    }

    function isTrackedZustandFactoryCall(node) {
      if (node.type !== "CallExpression") return false;

      const { callee } = node;

      if (callee.type === "Identifier") {
        return zustandBindings.has(callee.name);
      }

      if (
        callee.type === "CallExpression" &&
        callee.callee.type === "Identifier"
      ) {
        return zustandBindings.has(callee.callee.name);
      }

      return false;
    }

    const stateCreatorBodies = new Set();

    function isWithinStateCreator(node) {
      let current = node.parent;
      while (current) {
        if (stateCreatorBodies.has(current)) return true;
        current = current.parent;
      }
      return false;
    }

    return {
      ImportDeclaration(node) {
        const src = node.source.value;
        if (src !== "zustand" && src !== "zustand/vanilla") return;

        for (const spec of node.specifiers) {
          if (
            spec.type === "ImportSpecifier" &&
            (spec.imported.name === "create" ||
              spec.imported.name === "createStore")
          ) {
            zustandBindings.add(spec.local.name);
          }
        }
      },

      CallExpression(node) {
        if (!isTrackedZustandFactoryCall(node)) return;

        const firstArg = node.arguments[0];
        if (!firstArg) return;

        const stateCreator = resolveStateCreator(firstArg);
        if (!stateCreator) return;

        const body = stateCreator.body;
        if (body) {
          stateCreatorBodies.add(body);
        }
      },

      ":function[async=true]"(node) {
        if (isWithinStateCreator(node)) {
          context.report({ node, messageId: "noAsyncZustandActions" });
        }
      },
    };
  },
};

export default rule;
