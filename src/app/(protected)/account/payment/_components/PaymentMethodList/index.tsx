"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePaymentMethodsListQuery } from "@/features/payment-methods/queries/usePaymentMethodsListQuery";
import PaymentMethodItem from "./PaymentMethodItem";
import PaymentMethodListSkeleton from "./PaymentMethodListSkeleton";

export default function PaymentMethodList() {
  const {
    data: paymentMethods = [],
    isError,
    isPending,
  } = usePaymentMethodsListQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>已綁定卡片</CardTitle>
        <CardDescription>
          支援多卡管理，保留預設卡、備援卡與過期狀態。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && <PaymentMethodListSkeleton />}

        {!isPending && isError && (
          <div className="text-destructive rounded-3xl border border-dashed p-6 text-sm leading-6">
            付款方式載入失敗，請稍後再試。
          </div>
        )}

        {!isPending && !isError && paymentMethods.length === 0 && (
          <div className="text-muted-foreground rounded-3xl border border-dashed p-6 text-sm leading-6">
            目前沒有卡片
          </div>
        )}

        {!isPending && !isError && paymentMethods.length > 0 && (
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <PaymentMethodItem key={method.id} method={method} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
