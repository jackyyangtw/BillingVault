export type TapPayServerType = "sandbox" | "production";

export type TapPayFieldStatus = {
  number: number;
  expiry: number;
  ccv: number;
};

export type TapPayCardUpdate = {
  cardType: string;
  canGetPrime: boolean;
  hasError: boolean;
  status: TapPayFieldStatus;
};

export type TapPayPrimeResult = {
  status: number;
  msg?: string;
  card?: {
    prime: string;
  } & Record<string, unknown>;
  clientip?: string;
  card_identifier?: string;
};

type TapPayCard = {
  setup: (config: TapPayCardSetupConfig) => void;
  onUpdate: (callback: (update: TapPayCardUpdate) => void) => void;
  getPrime: (callback: (result: TapPayPrimeResult) => void) => void;
  getTappayFieldsStatus: () => TapPayCardUpdate;
};

type TapPayDirect = {
  setupSDK: (
    appId: number,
    appKey: string,
    serverType: TapPayServerType,
  ) => void;
  card: TapPayCard;
};

type TapPayCardSetupConfig = {
  fields: {
    number: TapPayFieldConfig;
    expirationDate: TapPayFieldConfig;
    ccv: TapPayFieldConfig;
  };
  styles: TapPayFieldStyles;
  isMaskCreditCardNumber: boolean;
  maskCreditCardNumberRange: {
    beginIndex: number;
    endIndex: number;
  };
};

type TapPayFieldStyles = Record<
  string,
  Record<string, string | Record<string, string>>
>;

type TapPayFieldConfig = {
  element: string;
  placeholder: string;
};

declare global {
  interface Window {
    TPDirect?: TapPayDirect;
  }
}

export const TAPPAY_SDK_URL = "https://js.tappaysdk.com/sdk/tpdirect/v5.20.0";

export const TAPPAY_CARD_FIELDS = {
  number: "tappay-card-number",
  expirationDate: "tappay-card-expiration-date",
  ccv: "tappay-card-ccv",
} as const;

const tappayFieldStyles = {
  html: {
    "background-color": "#000000",
    background: "#000000",
    "color-scheme": "dark",
  },
  body: {
    margin: "0",
    "background-color": "#000000",
    background: "#000000",
    "color-scheme": "dark",
  },
  input: {
    color: "hsl(0 0% 98%)",
    "background-color": "#000000",
    background: "#000000",
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
    color: "hsl(0 0% 60%)",
  },
  ":focus": {
    color: "hsl(0 0% 98%)",
    "background-color": "#000000",
    background: "#000000",
  },
  ".valid": {
    color: "hsl(0 0% 98%)",
    "background-color": "#000000",
    background: "#000000",
  },
  ".invalid": {
    color: "hsl(0 84% 60%)",
    "background-color": "#000000",
    background: "#000000",
  },
  "@media screen and (max-width: 640px)": {
    input: {
      "font-size": "16px",
    },
  },
};

export const tappayCardSetupConfig: TapPayCardSetupConfig = {
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
  styles: tappayFieldStyles,
  isMaskCreditCardNumber: true,
  maskCreditCardNumberRange: {
    beginIndex: 6,
    endIndex: 11,
  },
};

export function getTapPayConfig() {
  const appId = Number(process.env.NEXT_PUBLIC_TAPPAY_APP_ID);
  const appKey = process.env.NEXT_PUBLIC_TAPPAY_APP_KEY;
  const serverType = process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE;

  if (!Number.isInteger(appId) || appId <= 0 || !appKey) {
    return {
      isReady: false,
      message: "TapPay APP_ID 或 APP_KEY 尚未設定。",
    } as const;
  }

  if (serverType !== "sandbox" && serverType !== "production") {
    return {
      isReady: false,
      message: "TapPay SERVER_TYPE 需設定為 sandbox 或 production。",
    } as const;
  }

  return {
    isReady: true,
    appId,
    appKey,
    serverType,
  } as const;
}

export function getTapPayPrime(): Promise<TapPayPrimeResult> {
  return new Promise((resolve, reject) => {
    const tappay = window.TPDirect;

    if (!tappay) {
      reject(new Error("TapPay SDK 尚未載入。"));
      return;
    }

    tappay.card.getPrime((result) => {
      if (result.status !== 0 || !result.card?.prime) {
        reject(new Error(result.msg ?? "TapPay prime 取得失敗。"));
        return;
      }

      resolve(result);
    });
  });
}
