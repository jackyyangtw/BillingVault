export type TapPaySandboxPaymentInput = {
  orderNumber: string;
  amountCents: number;
  cardholder: TapPayCardholder;
  details: string;
  simulateFailure?: boolean;
};

export type TapPaySandboxPayByPrimeInput = TapPaySandboxPaymentInput & {
  prime: string;
};

export type TapPaySandboxPayByTokenInput = TapPaySandboxPaymentInput & {
  cardKey: string;
  cardToken: string;
};

export type TapPayCardholder = {
  name: string;
  email: string;
  address: string;
  phoneNumber?: string;
};

export type TapPayCardSecret = {
  card_key?: string;
  card_token?: string;
};

export type TapPaySandboxPaymentResult =
  | {
      status: "succeeded";
      providerTradeId: string;
      providerStatusCode: "0";
      providerMessage: string;
      cardSecret?: {
        cardKey: string;
        cardToken: string;
      };
    }
  | {
      status: "failed";
      providerTradeId: string;
      providerStatusCode: string;
      providerMessage: string;
      failureCode: string;
      failureMessage: string;
    };

export type TapPayPayByPrimeResponse = {
  status: number;
  msg: string;
  rec_trade_id?: string;
  card_secret?: TapPayCardSecret;
};
