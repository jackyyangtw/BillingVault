import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const checkoutSteps = ["選擇方案", "帳務資訊", "付款方式", "確認訂單", "完成"];

export default function CheckoutSteps() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>結帳步驟</CardTitle>
        <CardDescription>
          第二階段的核心流程：選方案、填帳務、模擬付款，再確認訂單。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-5">
          {checkoutSteps.map((step, index) => (
            <div
              key={step}
              className="bg-muted/30 rounded-3xl border px-4 py-3 text-center"
            >
              <p className="text-primary text-xs font-semibold">0{index + 1}</p>
              <p className="mt-1 text-sm font-medium">{step}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
