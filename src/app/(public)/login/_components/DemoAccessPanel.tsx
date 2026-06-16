import { Badge } from "@/components/ui/badge";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

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
            <dt className="text-muted-foreground">一鍵登入</dt>
            <dd className="font-medium">Server Action</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">憑證來源</dt>
            <dd className="font-medium">Server env</dd>
          </div>
        </dl>
      </div>
      <FieldDescription>
        Demo 帳密只在伺服器端讀取並送往 Supabase Auth，前端不顯示也不保存。
      </FieldDescription>
    </Field>
  );
}
