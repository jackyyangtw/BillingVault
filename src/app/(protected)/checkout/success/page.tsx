import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileText,
  ReceiptText,
  RotateCcw,
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
  title: "Checkout Success | SecureCart",
  description:
    "Your SecureCart subscription checkout has been completed successfully.",
};

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order ?? "Sandbox order";

  return (
    <main>
      <section className="border-border/60 border-b py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Checkout Complete
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            訂閱建立成功
          </h1>
          <p className="text-muted-foreground mt-5 max-w-3xl text-lg leading-8">
            SecureCart
            已完成這筆模擬結帳。你可以接著查看帳務摘要、管理訂閱方案，或確認付款方式狀態。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Card>
            <CardHeader>
              <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-3xl">
                <CheckCircle2 />
              </div>
              <CardTitle className="text-2xl">付款流程已完成</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-3 sm:grid-cols-4">
                <ResultDetail label="狀態" value="Active" />
                <ResultDetail label="訂單" value={orderNumber} />
                <ResultDetail label="類型" value="SaaS 訂閱" />
                <ResultDetail label="付款" value="sandbox 授權成功" />
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                <NextStep
                  icon={ReceiptText}
                  title="查看帳務摘要"
                  description="確認本期帳務狀態、付款方式與帳單紀錄。"
                />
                <NextStep
                  icon={FileText}
                  title="管理訂閱"
                  description="檢查目前方案，準備之後的升級、降級或取消流程。"
                />
                <NextStep
                  icon={CreditCard}
                  title="確認付款方式"
                  description="管理預設扣款卡與備援付款卡。"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/account/billing">
                  前往帳務
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/account/subscription">管理訂閱</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/checkout">
                  <RotateCcw data-icon="inline-start" />
                  再次結帳
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

type NextStepProps = {
  icon: ComponentType;
  title: string;
  description: string;
};

function NextStep({ icon: Icon, title, description }: NextStepProps) {
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
