const cardBrandByType: Record<number, string> = {
  1: "Visa",
  2: "Mastercard",
  3: "JCB",
  4: "Union Pay",
  5: "AMEX",
};

export type TapPayCardBrandInput = {
  type?: number;
  issuer?: string;
  issuerZhTw?: string;
};

export function getTapPayCardBrand({
  type,
  issuer,
  issuerZhTw,
}: TapPayCardBrandInput) {
  return (type ? cardBrandByType[type] : undefined) ?? issuer ?? issuerZhTw;
}
