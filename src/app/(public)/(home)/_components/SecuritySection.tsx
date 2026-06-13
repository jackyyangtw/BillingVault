import {
  Lock,
  ShieldCheck,
  GitMerge,
  CreditCard,
  Zap,
  Activity,
} from "lucide-react";
import {
  TypographyH2,
  TypographyH3,
  TypographyLead,
  TypographyMuted,
} from "@/components/ui/typography";

const securityItems = [
  {
    icon: Lock,
    title: "Server-side Session 驗證",
    description:
      "登入狀態由 Supabase SSR 與 Server DAL 驗證，敏感資料只在伺服器端讀取並回傳最小必要欄位。",
  },
  {
    icon: ShieldCheck,
    title: "CSP Nonce 標頭",
    description:
      "透過每次請求動態產生的 Nonce，實作內容安全政策，阻擋行內腳本注入攻擊。",
  },
  {
    icon: GitMerge,
    title: "安全回調 URL 驗證",
    description:
      "所有 OAuth 重導向皆需通過白名單驗證，防止 Open Redirect 開放重導向漏洞。",
  },
  {
    icon: CreditCard,
    title: "模擬信用卡 Tokenization",
    description:
      "付款資料送出後立即進行 Tokenization，原始卡號絕不經過伺服器傳輸。",
  },
  {
    icon: Zap,
    title: "送出鎖定機制",
    description:
      "結帳表單在第一次送出後即鎖定，有效防止重複扣款與 Race Condition。",
  },
  {
    icon: Activity,
    title: "冪等鍵（Idempotency Key）",
    description:
      "每筆訂閱請求均附帶唯一識別鍵，確保重試操作完全安全，不會產生重複訂閱。",
  },
];

export default function SecuritySection() {
  return (
    <section id="security" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <TypographyH2 className="border-0 pb-0 text-4xl font-bold">
            安全是設計原則，不是事後補舊
          </TypographyH2>
          <TypographyLead className="mt-4 text-base">
            BillingVault 的每一層架構都以真實攻擊情境為前提進行設計， 從 Token
            處理到表單送出，每個環節都有對應的防護措施。
          </TypographyLead>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {securityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="border-border bg-card flex gap-4 rounded-xl border p-6"
              >
                <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="text-primary size-5" />
                </div>
                <div>
                  <TypographyH3 className="text-base">
                    {item.title}
                  </TypographyH3>
                  <TypographyMuted className="mt-1.5 leading-relaxed">
                    {item.description}
                  </TypographyMuted>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
