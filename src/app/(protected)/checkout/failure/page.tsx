import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  RefreshCcw,
  ReceiptText,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Checkout Failed | SecureCart",
  description:
    "Your SecureCart subscription checkout could not be completed. Review the payment details and try again.",
};

export default function CheckoutFailurePage() {
  return (
    <main>
      <section className="border-border/60 border-b py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Badge variant="destructive" className="mb-4">
            Checkout Failed
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            付款未完成
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            這筆模擬結帳尚未建立訂閱。請確認付款資料、銀行授權狀態或重新送出結帳流程。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-3xl">
                <AlertTriangle />
              </div>
              <CardTitle className="text-2xl">訂閱尚未建立</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <ResultDetail label="狀態" value="Failed" />
                <ResultDetail label="訂閱" value="未啟用" />
                <ResultDetail label="付款" value="授權未完成" />
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <FailureReason
                  icon={CreditCard}
                  title="付款資料可能不完整"
                  description="確認卡號、到期日、安全碼與帳務 Email 是否正確。"
                />
                <FailureReason
                  icon={ShieldAlert}
                  title="銀行或驗證流程拒絕"
                  description="部分付款需要 3D Secure、OTP 或銀行端重新授權。"
                />
                <FailureReason
                  icon={ReceiptText}
                  title="請重新確認訂單"
                  description="回到結帳頁重新檢查方案、產品與付款方式。"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/checkout">
                  重新結帳
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/account/payment">
                  <CreditCard data-icon="inline-start" />
                  管理付款方式
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/account/billing">
                  <RefreshCcw data-icon="inline-start" />
                  回帳務
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}

type ResultDetailProps = {
  label: string;
  value: string;
};

function ResultDetail({ label, value }: ResultDetailProps) {
  return (
    <div className="bg-muted/40 rounded-3xl border p-4">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

type FailureReasonProps = {
  icon: ComponentType;
  title: string;
  description: string;
};

function FailureReason({ icon: Icon, title, description }: FailureReasonProps) {
  return (
    <div className="flex gap-3 rounded-3xl border p-4">
      <div className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-2xl">
        <Icon />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}
