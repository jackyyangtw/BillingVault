import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { formatTwdAmount } from "@/lib/currency";
import { products } from "@/mocks/fixtures/products";
import { plans } from "@/mocks/fixtures/plans";
import type { BillingInvoice, BillingOrder, BillingOverview } from "./types";

const billingOrderInclude = {
  payments: {
    orderBy: { createdAt: "desc" },
    take: 1,
  },
} satisfies Prisma.OrderInclude;

type BillingOrderRecord = Prisma.OrderGetPayload<{
  include: typeof billingOrderInclude;
}>;

export async function listBillingOverview(
  userId: string,
): Promise<BillingOverview> {
  const [orders, invoiceRecords] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: billingOrderInclude,
    }),
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      take: 3,
      include: {
        order: { select: { orderNumber: true } },
      },
    }),
  ]);

  const billingOrders = orders.map(toBillingOrder);
  const invoices = invoiceRecords.map(toBillingInvoice);

  return {
    summary: getBillingSummary(billingOrders),
    invoices,
    orders: billingOrders,
  };
}

function toBillingOrder(order: BillingOrderRecord): BillingOrder {
  const payment = order.payments[0];

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt.toISOString(),
    planName: getPlanName(order.planId),
    productName: getProductName(order.productId),
    amount: centsToAmount(order.amountCents),
    status: order.status,
    paymentStatus: payment?.status ?? "pending",
    providerTradeId: payment?.providerTradeId ?? undefined,
  };
}

type InvoiceWithOrder = Prisma.InvoiceGetPayload<{
  include: { order: { select: { orderNumber: true } } };
}>;

function toBillingInvoice(invoice: InvoiceWithOrder): BillingInvoice {
  return {
    id: invoice.invoiceNumber,
    orderNumber: invoice.order.orderNumber,
    date: invoice.issuedAt.toISOString(),
    amount: centsToAmount(invoice.amountCents),
    status: invoice.status === "void" ? "open" : invoice.status,
  };
}

function getBillingSummary(orders: BillingOrder[]) {
  const latestOrder = orders[0];

  if (!latestOrder) {
    return [
      {
        label: "本期費用",
        value: formatTwdAmount(0),
        description: "目前尚未建立 sandbox 訂單。",
      },
      {
        label: "付款狀態",
        value: "尚無紀錄",
        description: "完成結帳後會在此顯示付款健康度。",
      },
      {
        label: "最近訂單",
        value: "-",
        description: "尚無可顯示的訂單編號。",
      },
    ];
  }

  return [
    {
      label: "本期費用",
      value: formatSummaryAmount(latestOrder.amount),
      description: `${latestOrder.planName} / ${latestOrder.productName}`,
    },
    {
      label: "付款狀態",
      value: getPaymentSummaryValue(latestOrder),
      description: getPaymentSummaryDescription(latestOrder),
    },
    {
      label: "最近訂單",
      value: getShortOrderNumber(latestOrder.orderNumber),
      description: `完整訂單號可在下方訂單紀錄查看。建立於 ${formatSummaryDate(latestOrder.date)}`,
    },
  ];
}

function centsToAmount(amountCents: number) {
  return amountCents / 100;
}

function getPlanName(planId: string) {
  return plans.find((plan) => plan.id === planId)?.name ?? planId;
}

function getProductName(productId: string) {
  return (
    products.find((product) => product.id === productId)?.name ?? productId
  );
}

function formatSummaryAmount(amount: number) {
  return formatTwdAmount(amount);
}

function formatSummaryDate(date: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getPaymentSummaryValue(order: BillingOrder) {
  if (order.status === "paid" && order.paymentStatus === "succeeded") {
    return "正常";
  }

  if (order.status === "failed" || order.paymentStatus === "failed") {
    return "付款失敗";
  }

  return "處理中";
}

function getPaymentSummaryDescription(order: BillingOrder) {
  if (order.providerTradeId) {
    return "TapPay sandbox 授權成功，交易 ID 可在訂單紀錄查看。";
  }

  return `訂單 ${order.orderNumber} 尚未完成付款。`;
}

function getShortOrderNumber(orderNumber: string) {
  if (orderNumber.length <= 12) {
    return orderNumber;
  }

  return `${orderNumber.slice(0, 8)}...${orderNumber.slice(-4)}`;
}
