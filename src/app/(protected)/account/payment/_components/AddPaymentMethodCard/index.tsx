"use client";

import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddPaymentDialog from "./AddPaymentDialog";

export default function AddPaymentMethodCard() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>新增付款方式</CardTitle>
        <CardDescription>
          使用 TapPay SDK 綁定信用卡，前端只取得一次性 prime。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 flex gap-3 rounded-3xl border p-4">
          <ShieldCheck className="text-primary mt-0.5 shrink-0" />
          <p className="text-muted-foreground text-sm leading-6">
            卡號資料不進入 SecureCart 前端狀態，送出時只交換 TapPay prime
            與後端回傳的付款方式識別碼。
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus data-icon="inline-start" />
              新增卡片
            </Button>
          </DialogTrigger>
          {open && <AddPaymentDialog onOpenChange={setOpen} />}
        </Dialog>
      </CardFooter>
    </Card>
  );
}
