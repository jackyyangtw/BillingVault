import { expect, type Page, test } from "@playwright/test";

const demoEmail = process.env.PLAYWRIGHT_TEST_EMAIL ?? "demo@securecart.dev";
const demoPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;

async function signIn(page: Page, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(demoEmail);
  await page.getByLabel("密碼").fill(password);
  await page.getByRole("button", { name: "登入" }).click();
}

test.describe("Supabase Email 登入", () => {
  test("未登入進入帳務頁時，會導向登入頁並保留 callbackUrl", async ({
    page,
  }) => {
    await page.goto("/account/billing");

    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Faccount%2Fbilling/);
    await expect(
      page.getByRole("heading", {
        name: "登入後，繼續完成你的安全訂閱結帳。",
      }),
    ).toBeVisible();
  });

  test("未登入進入結帳頁時，會導向登入頁並保留原查詢參數", async ({ page }) => {
    await page.goto("/checkout?plan=pro&cycle=yearly");

    await expect(page).toHaveURL(
      /\/login\?callbackUrl=%2Fcheckout%3Fplan%3Dpro%26cycle%3Dyearly/,
    );
  });

  test("登入頁會移除不安全的 callbackUrl", async ({ page }) => {
    await page.goto("/login?callbackUrl=https://evil.com");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("輸入錯誤帳密時，會顯示登入錯誤", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(demoEmail);
    await page.getByLabel("密碼").fill("definitely-wrong-password");
    await page.getByRole("button", { name: "登入" }).click();

    await expect(
      page.getByText("帳號或密碼錯誤，請確認測試帳號後再試。"),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("成功登入後會回到原頁，已登入時不再停留登入頁，且可登出", async ({
    page,
  }) => {
    const password = demoPassword;

    if (!password) {
      test.skip(
        true,
        "請設定 PLAYWRIGHT_TEST_PASSWORD 來執行 Supabase 真實登入測試。",
      );
      return;
    }

    await page.goto("/account/billing");
    await signIn(page, password);

    await expect(page).toHaveURL(/\/account\/billing$/);
    await expect(
      page.getByText("Billing, payments, subscriptions"),
    ).toBeVisible();

    await page.goto("/login");
    await expect(page).toHaveURL(/\/checkout$/);

    await page.goto("/account/billing");
    await page.getByRole("button", { name: "開啟使用者選單" }).click();
    await page.getByRole("menuitem", { name: "登出" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/account/billing");
    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Faccount%2Fbilling/);
  });
});
