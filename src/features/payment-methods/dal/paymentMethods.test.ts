import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  paymentMethod: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { testOrderId, testPaymentMethodId, testUserId } from "@/test/testIds";
import { createPaymentMethod } from "./createPaymentMethod";
import { deletePaymentMethod } from "./deletePaymentMethod";
import { listPaymentMethods } from "./listPaymentMethods";
import { setDefaultPaymentMethod } from "./setDefaultPaymentMethod";

function createStoredPaymentMethod(overrides = {}) {
  return {
    id: testPaymentMethodId,
    userId: testUserId,
    brand: "VISA",
    binCode: "424242",
    last4: "4242",
    holder: "Billing Vault",
    billingEmail: "billing@example.com",
    cardIdentifier: "card_identifier",
    providerPaymentMethodId: "provider_method_id",
    providerCardKey: "CARD_KEY",
    providerCardToken: "CARD_TOKEN",
    expMonth: 12,
    expYear: 2099,
    isDefault: false,
    tappayPrimeState: "ready",
    createdAt: new Date("2026-06-06T08:00:00.000Z"),
    updatedAt: new Date("2026-06-06T08:00:00.000Z"),
    ...overrides,
  };
}

describe("付款方式 Prisma DAL", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    prismaMock.$transaction.mockImplementation(async (callback) =>
      callback(prismaMock),
    );
  });

  it("查詢付款方式時只回傳卡片摘要並將預設卡排在前面", async () => {
    const firstMethod = createStoredPaymentMethod({
      id: testPaymentMethodId,
      isDefault: true,
    });
    const secondMethod = createStoredPaymentMethod({
      id: testOrderId,
      brand: "Mastercard",
      last4: "8888",
      isDefault: false,
    });
    prismaMock.paymentMethod.findMany.mockResolvedValue([
      firstMethod,
      secondMethod,
    ]);

    await expect(listPaymentMethods(testUserId)).resolves.toEqual([
      {
        id: firstMethod.id,
        brand: "VISA",
        binCode: "424242",
        last4: "4242",
        holder: "Billing Vault",
        expiresAt: "12/99",
        billingEmail: "billing@example.com",
        status: "primary",
        tappayPrimeState: "ready",
      },
      {
        id: secondMethod.id,
        brand: "Mastercard",
        binCode: "424242",
        last4: "8888",
        holder: "Billing Vault",
        expiresAt: "12/99",
        billingEmail: "billing@example.com",
        status: "backup",
        tappayPrimeState: "ready",
      },
    ]);

    expect(prismaMock.paymentMethod.findMany).toHaveBeenCalledWith({
      where: { userId: testUserId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  });

  it("新增第一張付款方式時自動設為預設卡", async () => {
    prismaMock.paymentMethod.count.mockResolvedValue(0);
    prismaMock.paymentMethod.create.mockResolvedValue(
      createStoredPaymentMethod({ isDefault: true }),
    );

    await expect(
      createPaymentMethod(testUserId, {
        brand: "VISA",
        binCode: "424242",
        last4: "4242",
        holder: "Billing Vault",
        billingEmail: "billing@example.com",
        cardIdentifier: "card_identifier",
        providerPaymentMethodId: "provider_method_id",
        providerCardKey: "CARD_KEY",
        providerCardToken: "CARD_TOKEN",
        expMonth: 12,
        expYear: 2099,
      }),
    ).resolves.toMatchObject({
      brand: "VISA",
      status: "primary",
    });

    expect(prismaMock.paymentMethod.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: testUserId,
        isDefault: true,
        providerCardKey: "CARD_KEY",
        providerCardToken: "CARD_TOKEN",
      }),
    });
  });

  it("新增非第一張付款方式時維持備用卡", async () => {
    prismaMock.paymentMethod.count.mockResolvedValue(1);
    prismaMock.paymentMethod.create.mockResolvedValue(
      createStoredPaymentMethod({ isDefault: false }),
    );

    await expect(
      createPaymentMethod(testUserId, {
        brand: "VISA",
        last4: "4242",
        holder: "Billing Vault",
        billingEmail: "billing@example.com",
      }),
    ).resolves.toMatchObject({
      status: "backup",
    });

    expect(prismaMock.paymentMethod.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: testUserId,
        isDefault: false,
      }),
    });
  });

  it("刪除預設卡後會把同一使用者最近的卡片設為預設", async () => {
    prismaMock.paymentMethod.findFirst
      .mockResolvedValueOnce({ id: "method-default", isDefault: true })
      .mockResolvedValueOnce({ id: "method-next" });

    await deletePaymentMethod(testUserId, "method-default");

    expect(prismaMock.paymentMethod.delete).toHaveBeenCalledWith({
      where: { id: "method-default" },
    });
    expect(prismaMock.paymentMethod.findFirst).toHaveBeenNthCalledWith(2, {
      where: { userId: testUserId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    expect(prismaMock.paymentMethod.update).toHaveBeenCalledWith({
      where: { id: "method-next" },
      data: { isDefault: true },
    });
  });

  it("刪除不存在或不屬於使用者的付款方式時拒絕操作", async () => {
    prismaMock.paymentMethod.findFirst.mockResolvedValue(null);

    await expect(
      deletePaymentMethod(testUserId, "method-other-user"),
    ).rejects.toThrow("Payment method not found.");

    expect(prismaMock.paymentMethod.delete).not.toHaveBeenCalled();
    expect(prismaMock.paymentMethod.update).not.toHaveBeenCalled();
  });

  it("設定預設付款方式時會先取消同一使用者原本的預設卡", async () => {
    prismaMock.paymentMethod.findFirst.mockResolvedValue({
      id: "method-target",
      expMonth: 12,
      expYear: 2099,
    });

    await setDefaultPaymentMethod(testUserId, "method-target");

    expect(prismaMock.paymentMethod.updateMany).toHaveBeenCalledWith({
      where: { userId: testUserId, isDefault: true },
      data: { isDefault: false },
    });
    expect(prismaMock.paymentMethod.update).toHaveBeenCalledWith({
      where: { id: "method-target" },
      data: { isDefault: true },
    });
  });

  it("已過期付款方式不能設為預設卡", async () => {
    vi.setSystemTime(new Date("2026-06-06T12:00:00.000Z"));
    prismaMock.paymentMethod.findFirst.mockResolvedValue({
      id: "method-expired",
      expMonth: 1,
      expYear: 2026,
    });

    await expect(
      setDefaultPaymentMethod(testUserId, "method-expired"),
    ).rejects.toThrow("Expired payment methods cannot be set as default.");

    expect(prismaMock.paymentMethod.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.paymentMethod.update).not.toHaveBeenCalled();
  });
});
