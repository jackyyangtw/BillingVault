"use client";

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function AddPaymentMethodCard() {
  function handleCardSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>新增付款方式</CardTitle>
        <CardDescription>
          之後會在這裡掛 TapPay SDK，完成卡號欄位與 prime token 交換。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/40 flex gap-3 rounded-3xl border p-4">
          <ShieldCheck className="text-primary mt-0.5 shrink-0" />
          <p className="text-muted-foreground text-sm leading-6">
            卡號資料不進入 SecureCart 前端狀態，送出時只保留 TapPay prime
            與後端回傳的付款方式識別碼。
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus data-icon="inline-start" />
              新增卡片
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>新增信用卡</DialogTitle>
              <DialogDescription>
                先填入測試卡片資料。正式串接 TapPay 後，卡號欄位會改由 hosted
                fields 接管。
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCardSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="cardHolder">持卡人姓名</FieldLabel>
                  <Input
                    id="cardHolder"
                    name="cardHolder"
                    autoComplete="cc-name"
                    placeholder="Wang Xiao Ming"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="cardNumber">卡號</FieldLabel>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </Field>

                <FieldGroup className="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="cardExpiry">到期日</FieldLabel>
                    <Input
                      id="cardExpiry"
                      name="cardExpiry"
                      autoComplete="cc-exp"
                      placeholder="12/30"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="cardCvc">CVC</FieldLabel>
                    <Input
                      id="cardCvc"
                      name="cardCvc"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      placeholder="123"
                      required
                    />
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel htmlFor="billingEmail">帳單 Email</FieldLabel>
                  <Input
                    id="billingEmail"
                    name="billingEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="billing@securecart.dev"
                    required
                  />
                </Field>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      取消
                    </Button>
                  </DialogClose>
                  <Button type="submit">儲存卡片</Button>
                </DialogFooter>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
