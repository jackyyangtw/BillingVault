"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      richColors
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg":
            "light-dark(oklch(0.962 0.044 156.743), oklch(0.236 0.052 160.167))",
          "--success-text":
            "light-dark(oklch(0.262 0.051 172.552), oklch(0.871 0.15 154.449))",
          "--success-border":
            "light-dark(oklch(0.871 0.15 154.449), oklch(0.448 0.119 151.328))",
          "--error-bg":
            "light-dark(oklch(0.971 0.013 17.38), oklch(0.258 0.092 26.042))",
          "--error-text":
            "light-dark(var(--destructive), oklch(0.885 0.062 18.334))",
          "--error-border":
            "light-dark(oklch(0.808 0.114 19.571), oklch(0.444 0.177 26.899))",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
