import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const integrationSteps = [
  "載入 TapPay SDK 與 card setup",
  "使用 hosted fields 取得 prime",
  "送 prime 到後端建立付款方式",
  "支援預設卡切換與備援卡扣款",
];

export default function PaymentIntegrationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>TapPay 串接準備</CardTitle>
        <CardDescription>
          付款頁會成為多卡管理與 tokenization 的唯一入口。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-3">
          {integrationSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6">
              <Badge variant="outline">{index + 1}</Badge>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
