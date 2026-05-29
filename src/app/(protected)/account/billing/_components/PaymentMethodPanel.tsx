import Link from "next/link";
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
import PaymentCardBrandMark from "../../payment/_components/PaymentMethodList/PaymentCardBrandMark";

type PaymentMethodPanelProps = {
  paymentMethod: PaymentMethod | null;
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
        {paymentMethod ? (
          <div className="border-primary/30 bg-primary/3 ring-primary/10 dark:border-primary/25 dark:bg-primary/8 dark:ring-primary/10 flex flex-col gap-5 rounded-3xl border p-4 ring-1">
            <div className="flex items-center gap-3">
              <PaymentCardBrandMark brand={paymentMethod.brand} isPrimary />
              <div>
                <p className="font-semibold">
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
        ) : (
          <div className="text-muted-foreground rounded-3xl border border-dashed p-6 text-sm leading-6">
            尚無卡片。請前往付款方式頁新增。
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/account/payment">管理付款方式</Link>
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
