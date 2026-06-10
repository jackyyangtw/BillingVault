import type { TapPayPrimeResult } from "@/providers/tappay/tappay";

export function toNewCardCheckoutInput(primeResult: TapPayPrimeResult) {
  return {
    prime: primeResult.card?.prime ?? "",
    card: {
      binCode: primeResult.card?.bincode,
      last4: primeResult.card?.lastfour,
      type: primeResult.card?.type,
      issuer: primeResult.card?.issuer,
      issuerZhTw: primeResult.card?.issuer_zh_tw,
      cardIdentifier: primeResult.card_identifier,
      expMonth: primeResult.card?.expiry_month,
      expYear: primeResult.card?.expiry_year,
    },
  };
}
