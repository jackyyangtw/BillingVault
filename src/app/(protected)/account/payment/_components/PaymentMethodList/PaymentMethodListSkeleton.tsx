import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentMethodListSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className="grid gap-4 rounded-3xl border p-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
        >
          <Skeleton className="size-16 rounded-2xl" />
          <div className="grid gap-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <div className="flex gap-2 md:justify-end">
            <Skeleton className="h-8 w-20 rounded-4xl" />
            <Skeleton className="size-8 rounded-4xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
