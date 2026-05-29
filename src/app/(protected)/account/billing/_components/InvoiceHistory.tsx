import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { InvoiceData } from "./types";
import { formatCurrency, formatDate, getInvoiceStatusLabel } from "./utils";

type InvoiceHistoryProps = {
  invoices: InvoiceData[];
};

export default function InvoiceHistory({ invoices }: InvoiceHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>帳單紀錄</CardTitle>
        <CardDescription>最近三筆付款紀錄與收款狀態。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {invoices.map((invoice, index) => (
            <div key={invoice.id}>
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-medium">{invoice.id}</p>
                  <p className="text-muted-foreground text-sm">
                    {invoice.orderNumber} · {formatDate(invoice.date)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="font-medium">
                    {formatCurrency(invoice.amount)}
                  </span>
                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "secondary"
                        : invoice.status === "failed"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {getInvoiceStatusLabel(invoice.status)}
                  </Badge>
                </div>
              </div>
              {index < invoices.length - 1 && <Separator />}
            </div>
          ))}
          {invoices.length === 0 && (
            <div className="text-muted-foreground rounded-3xl border border-dashed p-6 text-sm leading-6">
              完成 sandbox 結帳後，invoice 會出現在這裡。
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
