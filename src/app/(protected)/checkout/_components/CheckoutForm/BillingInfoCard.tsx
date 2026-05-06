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
            placeholder="Acme Security Lab"
          />
          <ControlledTextField
            name="billingEmail"
            label="帳務 Email"
            placeholder="billing@example.com"
            type="email"
          />
          <ControlledTextField
            name="taxId"
            label="稅籍或統編"
            placeholder="選填"
          />
          <ControlledTextField
            name="billingAddress"
            label="帳單地址"
            placeholder="Taipei, Taiwan"
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
