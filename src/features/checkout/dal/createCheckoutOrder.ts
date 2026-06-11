import "server-only";

import {
  createInvoiceNumber,
  createOrderNumber,
} from "@/features/checkout/dal/checkoutOrderNumbers";
import {
  assertNoRecentPendingOrder,
  createPendingCheckoutOrder,
} from "@/features/checkout/dal/createPendingCheckoutOrder";
import {
  completeCheckoutOrder,
  markCheckoutPaymentFailed,
} from "@/features/checkout/dal/finalizeCheckoutOrder";
import { getExistingCheckoutOrderResult } from "@/features/checkout/dal/getExistingCheckoutOrderResult";
import { getCheckoutPaymentSource } from "@/features/checkout/dal/checkoutPaymentSource";
import type {
  CheckoutOrderResult,
  CreateCheckoutOrderInput,
} from "@/features/checkout/dal/createCheckoutOrderTypes";
import { getCurrentSubscriptionCheckoutState } from "@/features/subscriptions/dal/getCurrentSubscriptionCheckoutState";
import { calculateCheckoutPricing } from "@/features/checkout/dal/pricing";
import { processCheckoutPayment } from "@/features/checkout/dal/processCheckoutPayment";
import { isBillingCycleDowngrade, isPlanDowngrade } from "@/mocks/plans";

export type { CheckoutOrderResult, CreateCheckoutOrderInput };

export async function createCheckoutOrder(
  userId: string,
  input: CreateCheckoutOrderInput,
): Promise<CheckoutOrderResult> {
  if (process.env.NEXT_PUBLIC_TAPPAY_SERVER_TYPE !== "sandbox") {
    throw new Error("TapPay sandbox mode is required for demo checkout.");
  }

  const existingOrder = await getExistingCheckoutOrderResult(
    userId,
    input.idempotencyKey,
  );

  if (existingOrder) {
    return existingOrder;
  }

  const currentSubscription = await getCurrentSubscriptionCheckoutState(userId);

  if (isPlanDowngrade(currentSubscription?.planId, input.planId)) {
    throw new Error("目前方案不可透過結帳降級，請到訂閱管理變更方案。");
  }

  if (isBillingCycleDowngrade(currentSubscription?.cycle, input.cycle)) {
    throw new Error("目前年繳方案不可透過結帳改為月繳，請到訂閱管理變更方案。");
  }

  await assertNoRecentPendingOrder(userId);

  const pricing = calculateCheckoutPricing(input);
  const orderNumber = createOrderNumber();
  const invoiceNumber = createInvoiceNumber(orderNumber);
  const paymentSource = await getCheckoutPaymentSource(userId, input);
  const pending = await createPendingCheckoutOrder({
    userId,
    input,
    orderNumber,
    pricing,
    paymentSource,
  });
  const pendingPayment = pending.payments[0];

  if (!pendingPayment) {
    throw new Error("付款紀錄建立失敗。");
  }

  const paymentResult = await processCheckoutPayment({
    orderNumber,
    amountCents: pricing.amountCents,
    paymentSource,
    details: `${pricing.productName} ${pricing.planName} subscription`,
    cardholder: {
      name: input.companyName,
      email: input.billingEmail,
      address: input.billingAddress,
    },
    simulateFailure: input.simulatePaymentFailure,
  });

  if (paymentResult.status === "failed") {
    await markCheckoutPaymentFailed({
      pendingOrderId: pending.id,
      pendingPaymentId: pendingPayment.id,
      paymentResult,
    });

    return {
      status: "failed",
      orderId: pending.id,
      orderNumber,
      amountCents: pricing.amountCents,
      currency: pricing.currency,
      providerTradeId: paymentResult.providerTradeId,
      failureMessage: paymentResult.failureMessage,
    };
  }

  await completeCheckoutOrder({
    userId,
    input,
    pendingOrderId: pending.id,
    pendingPaymentId: pendingPayment.id,
    invoiceNumber,
    pricing,
    paymentSource,
    paymentResult,
  });

  return {
    status: "succeeded",
    orderId: pending.id,
    orderNumber,
    amountCents: pricing.amountCents,
    currency: pricing.currency,
    providerTradeId: paymentResult.providerTradeId,
  };
}
