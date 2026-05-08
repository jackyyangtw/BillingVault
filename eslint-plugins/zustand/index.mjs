import noAsyncZustandActionsRule from "./no-async-zustand-actions.mjs";

const plugin = {
  meta: {
    name: "eslint-plugin-zustand",
    version: "1.0.0",
  },
  rules: {
    "no-async-zustand-actions": noAsyncZustandActionsRule,
  },
};

export default plugin;
