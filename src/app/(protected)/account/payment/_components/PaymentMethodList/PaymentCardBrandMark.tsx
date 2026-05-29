import { cn } from "@/lib/tailwind-css/utils";
import { cardBrandIcon, fallbackCardBrandIcon } from "./constants";

type PaymentCardBrandMarkProps = {
  brand: string;
  isPrimary: boolean;
};

export default function PaymentCardBrandMark({
  brand,
  isPrimary,
}: PaymentCardBrandMarkProps) {
  const normalizedBrand = brand.toLowerCase().replace(/[\s_-]/g, "");
  const CardIcon = cardBrandIcon[normalizedBrand] ?? fallbackCardBrandIcon;

  return (
    <div
      className={cn(
        "bg-card/80 ring-foreground/10 dark:bg-foreground/5 dark:ring-foreground/10 flex size-16 items-center justify-center rounded-2xl shadow-sm ring-1",
        isPrimary && "ring-primary/15 dark:ring-primary/15",
      )}
      aria-label={`${brand} card`}
      title={brand}
    >
      <CardIcon className="h-auto w-12" />
    </div>
  );
}
