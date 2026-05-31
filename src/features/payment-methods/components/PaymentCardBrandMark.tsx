import type { ComponentType, SVGProps } from "react";
import {
  AmericanExpressFlatRoundedIcon,
  GenericFlatRoundedIcon,
  JCBFlatRoundedIcon,
  MastercardFlatRoundedIcon,
  UnionPayFlatRoundedIcon,
  VisaFlatRoundedIcon,
} from "react-svg-credit-card-payment-icons";
import { cn } from "@/lib/tailwind-css/utils";

type PaymentCardIcon = ComponentType<SVGProps<SVGSVGElement>>;

type PaymentCardBrandMarkProps = {
  brand: string;
  isPrimary: boolean;
};

const cardBrandIcon: Record<string, PaymentCardIcon> = {
  americanexpress: AmericanExpressFlatRoundedIcon,
  amex: AmericanExpressFlatRoundedIcon,
  jcb: JCBFlatRoundedIcon,
  mastercard: MastercardFlatRoundedIcon,
  unionpay: UnionPayFlatRoundedIcon,
  visa: VisaFlatRoundedIcon,
};

export default function PaymentCardBrandMark({
  brand,
  isPrimary,
}: PaymentCardBrandMarkProps) {
  const normalizedBrand = brand.toLowerCase().replace(/[\s_-]/g, "");
  const CardIcon = cardBrandIcon[normalizedBrand] ?? GenericFlatRoundedIcon;

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
