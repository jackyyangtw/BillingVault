"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * 主題切換 Provider
 *
 * 透過 next-themes 管理 light / dark 模式，
 * 以 class strategy 配合 Tailwind 的 `.dark` variant。
 */
export default function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
