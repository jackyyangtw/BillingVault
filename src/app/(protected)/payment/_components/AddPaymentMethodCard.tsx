import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddPaymentMethodCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>新增付款方式</CardTitle>
        <CardDescription>
          之後會在這裡掛 TapPay SDK，完成卡號欄位與 prime token 交換。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 flex gap-3 rounded-3xl border p-4">
          <ShieldCheck className="text-primary mt-0.5 shrink-0" />
          <p className="text-muted-foreground text-sm leading-6">
            卡號資料不進入 SecureCart 前端狀態，送出時只保留 TapPay prime
            與後端回傳的付款方式識別碼。
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Plus data-icon="inline-start" />
          新增卡片
        </Button>
      </CardFooter>
    </Card>
  );
}
