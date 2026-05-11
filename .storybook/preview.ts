// https://storybook.js.org/docs/essentials/themes 自定義 Storybook 主題
import type { Preview, ReactRenderer } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import { themes } from "storybook/theming";

import "../src/app/globals.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "dark",
    }),
  ],
  parameters: {
    docs: {
      theme: themes.dark,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
