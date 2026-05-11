import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PaymentMethod } from "@/mocks/fixtures/payment-methods";

type PaymentMethodPanelProps = {
  paymentMethod: PaymentMethod;
};

export default function PaymentMethodPanel({
  paymentMethod,
}: PaymentMethodPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>付款方式</CardTitle>
        <CardDescription>
          目前預設扣款卡。多卡管理已拆至付款方式頁。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 flex flex-col gap-5 rounded-3xl border p-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-2xl">
              <CreditCard />
            </div>
            <div>
              <p className="font-medium">
                {paymentMethod.brand} ending in {paymentMethod.last4}
              </p>
              <p className="text-muted-foreground text-sm">
                Expires {paymentMethod.expiresAt}
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm">
            <PaymentDetail label="持卡人" value={paymentMethod.holder} />
            <PaymentDetail
              label="帳務 Email"
              value={paymentMethod.billingEmail}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/payment">管理付款方式</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

type PaymentDetailProps = {
  label: string;
  value: string;
};

function PaymentDetail({ label, value }: PaymentDetailProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
