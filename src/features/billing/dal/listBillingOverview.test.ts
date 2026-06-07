import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  order: {
    findMany: vi.fn(),
  },
  invoice: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import {
  testFailedOrderNumber,
  testPaidInvoiceNumber,
  testPaidOrderNumber,
  testUserId,
} from "@/test/testIds";
import { listBillingOverview } from "./listBillingOverview";

describe("帳單總覽 Prisma DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("沒有訂單與發票時回傳空清單與預設摘要", async () => {
    prismaMock.order.findMany.mockResolvedValue([]);
    prismaMock.invoice.findMany.mockResolvedValue([]);

    await expect(listBillingOverview(testUserId)).resolves.toEqual({
      summary: [
        {
          label: "本期費用",
          value: "NT$0",
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
      ],
      invoices: [],
      orders: [],
    });

    expect(prismaMock.order.findMany).toHaveBeenCalledWith({
      where: { userId: testUserId },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        items: true,
      },
    });
    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith({
      where: { userId: testUserId },
      orderBy: { issuedAt: "desc" },
      take: 3,
      include: {
        order: { select: { orderNumber: true } },
      },
    });
  });

  it("有付款成功訂單時回傳 DTO 摘要與最近發票", async () => {
    prismaMock.order.findMany.mockResolvedValue([
      {
        id: "order_1",
        orderNumber: testPaidOrderNumber,
        createdAt: new Date("2026-06-06T10:30:00.000Z"),
        planId: "business",
        productId: "codeguard",
        items: [
          {
            productId: "codeguard",
          },
          {
            productId: "deploywatch",
          },
        ],
        amountCents: 3540000,
        status: "paid",
        payments: [
          {
            status: "succeeded",
            providerTradeId: "SANDBOX_TRADE_ID",
          },
        ],
      },
    ]);
    prismaMock.invoice.findMany.mockResolvedValue([
      {
        invoiceNumber: testPaidInvoiceNumber,
        issuedAt: new Date("2026-06-06T10:31:00.000Z"),
        amountCents: 3540000,
        status: "paid",
        order: {
          orderNumber: testPaidOrderNumber,
        },
      },
    ]);

    await expect(listBillingOverview(testUserId)).resolves.toMatchObject({
      summary: [
        {
          label: "本期費用",
          value: "NT$35,400",
          description: "Business / CodeGuard、DeployWatch",
        },
        {
          label: "付款狀態",
          value: "正常",
          description: "TapPay sandbox 授權成功，交易 ID 可在訂單紀錄查看。",
        },
        {
          label: "最近訂單",
          value: "SC202606...3687",
        },
      ],
      invoices: [
        {
          id: testPaidInvoiceNumber,
          orderNumber: testPaidOrderNumber,
          date: "2026-06-06T10:31:00.000Z",
          amount: 35400,
          status: "paid",
        },
      ],
      orders: [
        {
          id: "order_1",
          orderNumber: testPaidOrderNumber,
          date: "2026-06-06T10:30:00.000Z",
          planName: "Business",
          productName: "CodeGuard、DeployWatch",
          amount: 35400,
          status: "paid",
          paymentStatus: "succeeded",
          providerTradeId: "SANDBOX_TRADE_ID",
        },
      ],
    });
  });

  it("付款失敗訂單會在摘要標示付款失敗", async () => {
    prismaMock.order.findMany.mockResolvedValue([
      {
        id: "order_failed",
        orderNumber: testFailedOrderNumber,
        createdAt: new Date("2026-06-04T08:00:00.000Z"),
        planId: "pro",
        productId: "codeguard",
        items: [],
        amountCents: 4800,
        status: "failed",
        payments: [
          {
            status: "failed",
            providerTradeId: null,
          },
        ],
      },
    ]);
    prismaMock.invoice.findMany.mockResolvedValue([]);

    const overview = await listBillingOverview(testUserId);

    expect(overview.summary[1]).toMatchObject({
      label: "付款狀態",
      value: "付款失敗",
      description: `訂單 ${testFailedOrderNumber} 尚未完成付款。`,
    });
    expect(overview.orders[0]).toMatchObject({
      paymentStatus: "failed",
      status: "failed",
    });
  });
});
