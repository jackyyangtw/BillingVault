import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { ControlledTextField } from "./fields";

export default function PaymentMethodCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>模擬付款方式</CardTitle>
        <CardDescription>
          使用測試卡片格式展示 tokenization 前的輸入流程。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <ControlledTextField
              name="cardNumber"
              label="卡號"
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
            />
          </div>
          <ControlledTextField
            name="cardExpiry"
            label="到期日"
            placeholder="12/30"
          />
          <ControlledTextField
            name="cardCvc"
            label="CVC"
            placeholder="123"
            inputMode="numeric"
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
