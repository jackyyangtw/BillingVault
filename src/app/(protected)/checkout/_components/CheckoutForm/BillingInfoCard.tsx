import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { ControlledTextField } from "./fields";

export default function BillingInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>帳務資訊</CardTitle>
        <CardDescription>
          資料只在前端模擬，不會送到真實付款服務。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <ControlledTextField
            name="companyName"
            label="公司或團隊名稱"
            autoComplete="organization"
            placeholder="例如 Acme Security Lab…"
          />
          <ControlledTextField
            name="billingEmail"
            label="帳務 Email"
            autoComplete="email"
            inputMode="email"
            placeholder="例如 billing@example.com…"
            spellCheck={false}
            type="email"
          />
          <ControlledTextField
            name="taxId"
            label="稅籍或統編"
            autoComplete="off"
            inputMode="numeric"
            placeholder="選填…"
            spellCheck={false}
          />
          <ControlledTextField
            name="billingAddress"
            label="帳單地址"
            autoComplete="street-address"
            placeholder="例如 Taipei, Taiwan…"
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
