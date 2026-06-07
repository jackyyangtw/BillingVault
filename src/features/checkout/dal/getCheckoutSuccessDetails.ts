import "server-only";

import { centsToTwdAmount, formatTwdAmount } from "@/lib/currency";
import { prisma } from "@/lib/prisma";
import { products } from "@/mocks/fixtures/products";
import { plans } from "@/mocks/fixtures/plans";
import { LOCALE } from "@/settings/locale";

export type CheckoutSuccessDetails = {
  orderNumber: string;
  amount: string;
  productName: string;
  planName: string;
  purchasedAt: string;
};

const purchaseDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export async function getCheckoutSuccessDetails(
  userId: string,
  orderNumber: string,
): Promise<CheckoutSuccessDetails | null> {
  const order = await prisma.order.findFirst({
    where: {
      userId,
      orderNumber,
    },
    select: {
      orderNumber: true,
      planId: true,
      productId: true,
      items: true,
      amountCents: true,
      createdAt: true,
    },
  });

  if (!order) {
    return null;
  }

  return {
    orderNumber: order.orderNumber,
    amount: formatTwdAmount(centsToTwdAmount(order.amountCents)),
    productName: getOrderProductName(order),
    planName: getPlanName(order.planId),
    purchasedAt: purchaseDateFormatter.format(order.createdAt),
  };
}

function getProductName(productId: string) {
  return (
    products.find((product) => product.id === productId)?.name ?? productId
  );
}

function getOrderProductName(order: {
  productId: string;
  items: { productId: string }[];
}) {
  const productIds = order.items.map((item) => item.productId);
  const resolvedProductIds =
    productIds.length > 0 ? productIds : [order.productId];

  return resolvedProductIds.map(getProductName).join("、");
}

function getPlanName(planId: string) {
  return plans.find((plan) => plan.id === planId)?.name ?? planId;
}
