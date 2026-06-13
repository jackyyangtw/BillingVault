import { expect, type Page, test } from "@playwright/test";

const demoEmail = process.env.PLAYWRIGHT_TEST_EMAIL ?? "demo@billingvault.dev";
const demoPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;

async function signIn(page: Page, password: string) {
  await page.getByLabel("Email").fill(demoEmail);
  await page.getByLabel("密碼").fill(password);
  await page.getByRole("button", { name: "登入" }).click();
}

async function openCheckout(page: Page) {
  const password = demoPassword;

  if (!password) {
    test.skip(
      true,
      "請設定 PLAYWRIGHT_TEST_PASSWORD 來執行 Supabase 真實登入測試。",
    );
    return;
  }

  await page.goto("/checkout?plan=pro&cycle=monthly");
  await expect(page).toHaveURL(/\/login\?callbackUrl=/);

  await signIn(page, password);
  await expect(page).toHaveURL(/\/checkout\?plan=pro&cycle=monthly$/);
  await expect(
    page.getByRole("heading", { name: "模擬 SaaS 訂閱結帳流程" }),
  ).toBeVisible();
}

test.describe("結帳表單防呆", () => {
  test("缺少必填帳務資料時不會送出訂單", async ({ page }) => {
    await openCheckout(page);

    await page.getByLabel("公司或團隊名稱").fill("");
    await page.getByLabel("帳務 Email").fill("");
    await page.getByLabel("帳單地址").fill("");
    await page.getByRole("button", { name: "確認訂閱" }).click();

    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText("請輸入公司或團隊名稱")).toBeVisible();
    await expect(page.getByText("請輸入有效的帳務 Email")).toBeVisible();
    await expect(page.getByText("請輸入帳單地址")).toBeVisible();
  });

  test("帳務 Email 格式錯誤時顯示可理解的錯誤", async ({ page }) => {
    await openCheckout(page);

    await page.getByLabel("帳務 Email").fill("not-an-email");
    await page.getByLabel("帳單地址").fill("Taipei, Taiwan");
    await page.getByRole("button", { name: "確認訂閱" }).click();

    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText("請輸入有效的帳務 Email")).toBeVisible();
  });

  test("信用卡欄位由 TapPay hosted fields 接管而不是一般輸入框", async ({
    page,
  }) => {
    await openCheckout(page);

    await expect(page.getByText("使用新信用卡")).toBeVisible();
    await expect(page.locator("#tappay-card-number")).toBeVisible();
    await expect(page.locator("#tappay-card-expiration-date")).toBeVisible();
    await expect(page.locator("#tappay-card-ccv")).toBeVisible();
    await expect(
      page.getByText(
        "卡號由 TapPay 安全欄位處理，不會進入 BillingVault 狀態。",
      ),
    ).toBeVisible();

    await expect(page.locator("#tappay-card-number input")).toHaveCount(0);
    await expect(
      page.locator("#tappay-card-expiration-date input"),
    ).toHaveCount(0);
    await expect(page.locator("#tappay-card-ccv input")).toHaveCount(0);
  });
});
