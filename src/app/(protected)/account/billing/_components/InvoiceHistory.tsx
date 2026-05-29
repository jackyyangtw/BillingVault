import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <div className="flex flex-col gap-1">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="hover:bg-muted/50 hover:border-primary/40 flex items-center justify-between gap-4 rounded-lg border-l-2 border-transparent px-3 py-3 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{invoice.id}</p>
                <p className="text-muted-foreground text-sm">
                  {invoice.orderNumber} · {formatDate(invoice.date)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-base font-semibold">
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
