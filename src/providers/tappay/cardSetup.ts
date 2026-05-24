import type { TapPayCardSetupConfig, TapPayFieldStyles } from "./tappay";

type TapPayColorMode = "dark" | "light";

export const TAPPAY_CARD_FIELDS = {
  number: "tappay-card-number",
  expirationDate: "tappay-card-expiration-date",
  ccv: "tappay-card-ccv",
} as const;

const tappayColors: Record<
  TapPayColorMode,
  {
    background: string;
    foreground: string;
    placeholder: string;
    colorScheme: string;
  }
> = {
  dark: {
    background: "#29292C",
    foreground: "#fafafa",
    placeholder: "#a1a1aa",
    colorScheme: "dark",
  },
  light: {
    background: "#f4f4f5",
    foreground: "#18181b",
    placeholder: "#71717a",
    colorScheme: "light",
  },
};

function getTappayFieldStyles(colorMode: TapPayColorMode): TapPayFieldStyles {
  const colors = tappayColors[colorMode];

  return {
    html: {
      "background-color": colors.background,
      background: colors.background,
      "color-scheme": colors.colorScheme,
    },
    body: {
      margin: "0",
      "background-color": colors.background,
      background: colors.background,
      "color-scheme": colors.colorScheme,
    },
    input: {
      color: colors.foreground,
      "background-color": colors.background,
      background: colors.background,
      border: "0",
      margin: "0",
      padding: "0",
      outline: "0",
      width: "100%",
      height: "24px",
      "line-height": "24px",
      "font-size": "16px",
      "font-family": "inherit",
    },
    "::placeholder": {
      color: colors.placeholder,
    },
    ":focus": {
      color: colors.foreground,
      "background-color": colors.background,
      background: colors.background,
    },
    ".valid": {
      color: colors.foreground,
      "background-color": colors.background,
      background: colors.background,
    },
    ".invalid": {
      color: "hsl(0 84% 60%)",
      "background-color": colors.background,
      background: colors.background,
    },
    "@media screen and (max-width: 640px)": {
      input: {
        "font-size": "16px",
      },
    },
  };
}

export function getTappayCardSetupConfig(
  colorMode: TapPayColorMode,
): TapPayCardSetupConfig {
  return {
    fields: {
      number: {
        element: `#${TAPPAY_CARD_FIELDS.number}`,
        placeholder: "**** **** **** ****",
      },
      expirationDate: {
        element: `#${TAPPAY_CARD_FIELDS.expirationDate}`,
        placeholder: "MM / YY",
      },
      ccv: {
        element: `#${TAPPAY_CARD_FIELDS.ccv}`,
        placeholder: "CVC",
      },
    },
    styles: getTappayFieldStyles(colorMode),
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
      beginIndex: 6,
      endIndex: 11,
    },
  };
}
