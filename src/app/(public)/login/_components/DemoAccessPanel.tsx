import { Badge } from "@/components/ui/badge";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

export const DEMO_EMAIL = "demo@billingvault.dev";
export const DEMO_PASSWORD = "請查看 GitHub README";

const DEMO_ACCESS_URL =
  "https://github.com/jackyyangtw/BillingVault#demo-access";

export default function DemoAccessPanel() {
  return (
    <Field className="mt-5">
      <div className="flex items-center justify-between gap-3">
        <FieldLabel>Demo Access</FieldLabel>
        <Badge variant="secondary">Sandbox only</Badge>
      </div>
      <div className="bg-muted/50 rounded-lg border p-3">
        <dl className="grid gap-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-mono">{DEMO_EMAIL}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Password</dt>
            <dd>
              <a
                href={DEMO_ACCESS_URL}
                target="_blank"
                rel="noreferrer"
                className="text-primary font-medium underline underline-offset-4"
              >
                GitHub README
              </a>
            </dd>
          </div>
        </dl>
      </div>
      <FieldDescription>
        這組帳號只用於公開 demo 與 sandbox 付款流程，請勿輸入真實信用卡資料。
      </FieldDescription>
    </Field>
  );
}
