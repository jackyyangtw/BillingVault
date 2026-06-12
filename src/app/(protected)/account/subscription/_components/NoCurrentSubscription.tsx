import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NoCurrentSubscription() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>目前沒有訂閱</CardTitle>
        <CardDescription>
          完成結帳後，這裡會顯示目前方案、續訂日與訂閱狀態。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-2xl">
              <CreditCard aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-medium">選擇方案並完成付款</p>
              <p className="text-muted-foreground mt-1 text-sm leading-6">
                訂閱建立後會自動同步到此頁面。
              </p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/checkout">前往結帳</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
