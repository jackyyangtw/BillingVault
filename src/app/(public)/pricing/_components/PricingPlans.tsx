"use client";

import Link from "next/link";
import { Check, CreditCard } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/tailwind-css/utils";
import {
  type BillingCycle,
  formatPlanPrice,
  plans,
} from "@/mocks/fixtures/plans";

export default function PricingPlans() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="flex flex-col gap-10">
      <div className="bg-card mx-auto flex rounded-4xl border p-1">
        {(["monthly", "yearly"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCycle(item)}
            className={cn(
              "rounded-4xl px-4 py-2 text-sm font-medium transition-colors",
              cycle === item
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item === "monthly" ? "月繳" : "年繳省 2 個月"}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-4 lg:items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "bg-card relative flex flex-col rounded-4xl border p-6 shadow-md",
              plan.highlight && "border-primary bg-primary/5 shadow-xl",
            )}
          >
            {plan.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                {plan.badge}
              </Badge>
            )}

            <div>
              <TypographyH3 className="text-lg">{plan.name}</TypographyH3>
              <TypographyMuted className="mt-1">
                {plan.description}
              </TypographyMuted>
              <div className="mt-4 flex min-h-14 items-baseline gap-1">
                <span
                  className={cn(
                    "font-bold",
                    plan.monthlyPrice === null ? "text-3xl" : "text-5xl",
                  )}
                >
                  {formatPlanPrice(plan, cycle)}
                </span>
                {plan.monthlyPrice !== null && (
                  <TypographyMuted className="inline">
                    /{cycle === "monthly" ? "月" : "年"}
                  </TypographyMuted>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <ul className="flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-primary size-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="mt-8 w-full"
              variant={plan.highlight ? "default" : "outline"}
              asChild
            >
              <Link href={`/checkout?plan=${plan.id}&cycle=${cycle}`}>
                <CreditCard data-icon="inline-start" />
                {plan.cta}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
