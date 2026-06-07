import { Info } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { products } from "@/mocks/fixtures/products";
import type { CheckoutFormValues } from "@/app/(protected)/checkout/_components/CheckoutForm/schema";

export default function ProductsField() {
  const form = useFormContext<CheckoutFormValues>();

  return (
    <Controller
      name="productIds"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="md:col-span-2">
          <FieldLabel>SaaS 產品</FieldLabel>
          <p className="text-muted-foreground flex items-start gap-2 text-sm leading-6">
            <Info
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-cyan-500"
            />
            <span>
              因為這是 demo，可購買已有商品是正常現象，主要用來體驗結帳流程。
            </span>
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {products.map((product) => {
              const inputId = `product-${product.id}`;
              const checked = field.value.includes(product.id);

              return (
                <label
                  key={product.id}
                  htmlFor={inputId}
                  className="bg-input/40 has-checked:border-primary has-checked:bg-primary/10 flex min-h-24 cursor-pointer flex-col gap-2 rounded-3xl border border-transparent p-4 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        field.onChange(
                          checked
                            ? field.value.filter(
                                (productId) => productId !== product.id,
                              )
                            : [...field.value, product.id],
                        )
                      }
                      className="accent-primary size-4"
                    />
                    <span className="font-medium">{product.name}</span>
                  </span>
                  <span className="text-muted-foreground text-sm leading-6">
                    {product.tagline}
                  </span>
                </label>
              );
            })}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
